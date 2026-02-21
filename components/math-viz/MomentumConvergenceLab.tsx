"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Play, RotateCcw, Info } from 'lucide-react';

type LandscapeType = 'ravine' | 'noisy';

// --- Mathematical Environments ---
const getLossAndGradient = (type: LandscapeType, x: number, z: number) => {
    if (type === 'ravine') {
        // Narrow Ravine: Shallow in x, steep in z
        // f(x,z) = x^2 / 10 + 2 * z^2
        const y = (x * x) / 10 + 2 * (z * z);
        const dx = (2 * x) / 10;
        const dz = 4 * z;
        return { y, dx, dz };
    } else {
        // Noisy Bowl: Global minimum at (0,0) but many local minima
        // f(x,z) = (x^2 + z^2)/15 - 1.5 * cos(1.5x) * cos(1.5z) + 1.5
        const y = (x * x + z * z) / 15 - 1.5 * Math.cos(1.5 * x) * Math.cos(1.5 * z) + 1.5;
        const dx = (2 * x) / 15 + 1.5 * 1.5 * Math.sin(1.5 * x) * Math.cos(1.5 * z);
        const dz = (2 * z) / 15 + 1.5 * 1.5 * Math.cos(1.5 * x) * Math.sin(1.5 * z);
        return { y, dx, dz };
    }
};

// --- Landscape Mesh ---
function LandscapeMesh({ type }: { type: LandscapeType }) {
    const geometry = useMemo(() => {
        const size = 20;
        const segments = 100;
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors = [];

        const c1 = type === 'ravine' ? new THREE.Color("#1e3a8a") : new THREE.Color("#4c1d95");
        const c2 = type === 'ravine' ? new THREE.Color("#bfdbfe") : new THREE.Color("#fbcfe8");

        let maxL = -Infinity;
        let minL = Infinity;

        for (let i = 0; i < pos.count; i++) {
            const { y } = getLossAndGradient(type, pos.getX(i), pos.getZ(i));
            if (y > maxL) maxL = y;
            if (y < minL) minL = y;
        }

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const { y } = getLossAndGradient(type, x, z);

            // Adjust visual height
            const visualY = type === 'noisy' ? y * 1.5 : y * 0.4;
            pos.setY(i, visualY);

            const normalized = (y - minL) / (maxL - minL || 1);
            const c = new THREE.Color().lerpColors(c1, c2, normalized);
            colors.push(c.r, c.g, c.b);
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, [type]);

    return (
        <group position={[0, -2, 0]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    vertexColors={true}
                    roughness={0.7}
                    transparent={true}
                    opacity={0.85}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe={true}
                    transparent={true}
                    opacity={0.15}
                />
            </mesh>
        </group>
    );
}

// --- Optimizer Simulation ---
function OptimizerSim({
    type,
    running,
    onFinish
}: {
    type: LandscapeType,
    running: boolean,
    onFinish: () => void
}) {
    // We will race two optimizers: Standard SGD vs SGD + Momentum

    // Initial states based on landscape
    const getInitialPos = () => type === 'ravine' ? new THREE.Vector3(-9, 0, 8) : new THREE.Vector3(-8, 0, 8);

    const sgdRef = useRef<THREE.Mesh>(null);
    const momRef = useRef<THREE.Mesh>(null);

    const sgdState = useRef({ pos: getInitialPos(), path: [getInitialPos()] });
    const momState = useRef({ pos: getInitialPos(), vel: new THREE.Vector3(0, 0, 0), path: [getInitialPos()] });

    const [sgdPath, setSgdPath] = useState<THREE.Vector3[]>([]);
    const [momPath, setMomPath] = useState<THREE.Vector3[]>([]);

    // Reset when landscape changes or running explicitly set to false
    useEffect(() => {
        if (!running) {
            sgdState.current = { pos: getInitialPos(), path: [getInitialPos()] };
            momState.current = { pos: getInitialPos(), vel: new THREE.Vector3(0, 0, 0), path: [getInitialPos()] };
            setSgdPath([sgdState.current.pos]);
            setMomPath([momState.current.pos]);
        }
    }, [type, running]);

    useFrame(() => {
        if (!running) return;

        // Simulation hyperparameters based on landscape
        const lrSGD = type === 'ravine' ? 0.2 : 0.8;
        const lrMom = type === 'ravine' ? 0.05 : 0.4;
        const beta = type === 'ravine' ? 0.95 : 0.9;
        const visualHeightScale = type === 'noisy' ? 1.5 : 0.4;
        const yOffset = -2; // To match LandscapeMesh position

        let sgdDist = sgdState.current.pos.lengthSq();
        let momDist = momState.current.pos.lengthSq();

        // 1. Update Standard SGD
        if (sgdDist > 0.1) {
            let p = sgdState.current.pos;
            const { dx, dz } = getLossAndGradient(type, p.x, p.z);
            p.x -= lrSGD * dx;
            p.z -= lrSGD * dz;
            const { y } = getLossAndGradient(type, p.x, p.z);
            p.y = y * visualHeightScale;

            // Add noise for 'noisy' to help it occasionally but mostly it gets stuck
            if (type === 'noisy') {
                p.x += (Math.random() - 0.5) * 0.1;
                p.z += (Math.random() - 0.5) * 0.1;
            }

            sgdState.current.path.push(p.clone());
            if (sgdState.current.path.length > 500) sgdState.current.path.shift();
        }

        // 2. Update SGD + Momentum
        if (momDist > 0.1) {
            let p = momState.current.pos;
            let v = momState.current.vel;
            const { dx, dz } = getLossAndGradient(type, p.x, p.z);

            // Momentum update rule: v_t = beta * v_{t-1} + grad
            v.x = beta * v.x + dx;
            v.z = beta * v.z + dz;

            // theta_{t+1} = theta_t - eta * v_t
            p.x -= lrMom * v.x;
            p.z -= lrMom * v.z;

            const { y } = getLossAndGradient(type, p.x, p.z);
            p.y = y * visualHeightScale;

            momState.current.path.push(p.clone());
            if (momState.current.path.length > 500) momState.current.path.shift();
        }

        // Update visuals
        if (sgdRef.current) {
            sgdRef.current.position.copy(sgdState.current.pos);
            sgdRef.current.position.y += yOffset + 0.3; // lift ball slightly
        }
        if (momRef.current) {
            momRef.current.position.copy(momState.current.pos);
            momRef.current.position.y += yOffset + 0.3; // lift ball slightly
        }

        // Update path lines (throttled to avoid re-rendering every single frame if performance drops, but works fine here)
        setSgdPath([...sgdState.current.path]);
        setMomPath([...momState.current.path]);

        // Stop condition
        if (sgdDist <= 0.2 && momDist <= 0.2) {
            onFinish();
        }
    });

    return (
        <group>
            {/* Standard SGD Ball (Blue) */}
            <mesh ref={sgdRef}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
            </mesh>
            {sgdPath.length > 1 && (
                <Line
                    points={sgdPath.map(p => new THREE.Vector3(p.x, p.y - 2 + 0.3, p.z))}
                    color="#3b82f6"
                    lineWidth={3}
                    transparent
                    opacity={0.6}
                />
            )}

            {/* Momentum Ball (Magenta) */}
            <mesh ref={momRef}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.8} />
            </mesh>
            {momPath.length > 1 && (
                <Line
                    points={momPath.map(p => new THREE.Vector3(p.x, p.y - 2 + 0.3, p.z))}
                    color="#ec4899"
                    lineWidth={4}
                    transparent
                    opacity={0.8}
                />
            )}

            {/* Labels overlay on the starting positions */}
            {!running && (
                <Html position={[-9, 2, 8]} center className="pointer-events-none">
                    <div className="flex flex-col items-center gap-1 opacity-80 transition-opacity">
                        <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                            Standard SGD
                        </div>
                        <div className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                            SGD + Momentum
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}

export default function MomentumConvergenceLab() {
    const [landscape, setLandscape] = useState<LandscapeType>('ravine');
    const [running, setRunning] = useState(false);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px] lg:h-[700px]">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 bg-slate-900 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-white">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => { setLandscape('ravine'); setRunning(false); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${landscape === 'ravine' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            Narrow Ravine
                        </button>
                        <button
                            onClick={() => { setLandscape('noisy'); setRunning(false); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${landscape === 'noisy' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        >
                            Noisy Bowl
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setRunning(true)}
                        disabled={running}
                        className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                    >
                        <Play size={16} className="mr-2" />
                        Start Race
                    </button>
                    <button
                        onClick={() => setRunning(false)}
                        className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                    >
                        <RotateCcw size={16} className="mr-2" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="relative flex-1 bg-slate-100 cursor-move">
                <Canvas camera={{ position: [0, 8, 14], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} />

                    <LandscapeMesh type={landscape} />
                    <OptimizerSim type={landscape} running={running} onFinish={() => setRunning(false)} />

                    <OrbitControls
                        enablePan={false}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 2.5}
                        minDistance={5}
                        maxDistance={30}
                    />
                </Canvas>

                {/* Overlay Legend */}
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-bold text-slate-700">Standard SGD</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                            <span className="text-xs font-bold text-slate-700">SGD + Momentum</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-700 max-w-xs ml-auto">
                        <div className="flex items-start gap-2 text-slate-200">
                            <Info size={16} className="mt-0.5 flex-shrink-0 text-indigo-400" />
                            {landscape === 'ravine' ? (
                                <p className="text-xs leading-relaxed">
                                    <strong className="text-white">Narrow Ravine:</strong> Notice how Standard SGD bounces back and forth across the steep walls, making slow progress. Momentum (Magenta) smooths out these oscillations and accelerates straight down the valley floor.
                                </p>
                            ) : (
                                <p className="text-xs leading-relaxed">
                                    <strong className="text-white">Noisy Bowl:</strong> A landscape filled with local minima. Standard SGD easily gets trapped in small pits. Momentum builds up velocity to blast through the noise and reach the global minimum.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
