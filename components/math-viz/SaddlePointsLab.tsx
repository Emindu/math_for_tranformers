"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Square, RotateCcw, Activity, Droplet } from 'lucide-react';

type LandscapeType = 'saddle' | 'sharp' | 'flat';

export default function SaddlePointsLab() {
    const [landscapeType, setLandscapeType] = useState<LandscapeType>('saddle');
    const [running, setRunning] = useState(false);
    const [resetSignal, setResetSignal] = useState(0);

    const handleReset = () => {
        setRunning(false);
        setResetSignal(prev => prev + 1);
    };

    const handleTypeChange = (type: LandscapeType) => {
        setLandscapeType(type);
        handleReset();
    };

    return (
        <div className="w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 h-[700px]">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Droplet className="text-pink-400" size={20} />
                    <h3 className="text-white font-semibold">Landscape Topologies</h3>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex flex-col sm:flex-row gap-6 justify-between items-center">
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => handleTypeChange('saddle')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${landscapeType === 'saddle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Saddle Point
                    </button>
                    <button
                        onClick={() => handleTypeChange('sharp')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${landscapeType === 'sharp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Sharp Minimum
                    </button>
                    <button
                        onClick={() => handleTypeChange('flat')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${landscapeType === 'flat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Flat Minimum
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setRunning(!running)}
                        className={`px-5 py-2 rounded-lg flex items-center gap-2 font-bold transition-all ${running ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
                    >
                        {running ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        {running ? 'Stop Gradient Descent' : 'Drop Optimizer'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* 3D View */}
            <div className="flex-grow bg-slate-100 relative shadow-inner">
                <Canvas camera={{ position: [25, 20, 25], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[10, 30, 10]} intensity={1} />
                    <pointLight position={[-10, 10, -10]} intensity={0.5} />

                    <LandscapeMesh type={landscapeType} />
                    <OptimizerBall running={running} resetSignal={resetSignal} type={landscapeType} />

                    <OrbitControls
                        enablePan={false}
                        minDistance={10}
                        maxDistance={60}
                        maxPolarAngle={Math.PI / 2 - 0.1}
                        autoRotate={!running}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>

                {/* Annotations Overlay */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 text-slate-300 text-sm shadow-xl text-center max-w-2xl mx-auto">
                        {landscapeType === 'saddle' && (
                            <p><strong className="text-pink-400">The Saddle Point:</strong> The optimizer gets stuck on the flat ridge (gradient ≈ 0) before slowly falling off the steep sides.</p>
                        )}
                        {landscapeType === 'sharp' && (
                            <p><strong className="text-rose-400">Sharp Minimum:</strong> Steep walls cause the optimizer to bounce aggressively. It converges fast but is highly sensitive to noise.</p>
                        )}
                        {landscapeType === 'flat' && (
                            <p><strong className="text-teal-400">Flat Minimum:</strong> A wide, forgiving basin. The optimizer settles smoothly, leading to better generalization across data shifts.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---- MATH DEFINITIONS ----

// Returns height y = f(x, z)
function getLoss(type: LandscapeType, x: number, z: number) {
    if (type === 'saddle') {
        const scaledX = x / 5;
        const scaledZ = z / 5;
        return (scaledX * scaledX) - (scaledZ * scaledZ);
    } else if (type === 'sharp') {
        return (x * x + z * z) / 8; // Steep paraboloid
    } else { // flat
        // Create a flat basin that curves up at the edges
        const r2 = x * x + z * z;
        return Math.pow(r2 / 50, 2); // quartic for a flat bottom
    }
}

// Returns {dx, dz}
function getGradient(type: LandscapeType, x: number, z: number) {
    if (type === 'saddle') {
        return { dx: (2 * x) / 25, dz: (-2 * z) / 25 };
    } else if (type === 'sharp') {
        return { dx: x / 4, dz: z / 4 };
    } else { // flat
        const r2 = x * x + z * z;
        const factor = 4 * r2 / (2500);
        return { dx: x * factor, dz: z * factor };
    }
}

// ---- COMPONENTS ----

function LandscapeMesh({ type }: { type: LandscapeType }) {
    const geometry = useMemo(() => {
        const size = 30;
        const segments = 80;
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors = [];

        // Colormaps depending on type
        const c1 = type === 'saddle' ? new THREE.Color("#4c1d95") : type === 'sharp' ? new THREE.Color("#7f1d1d") : new THREE.Color("#064e3b");
        const c2 = type === 'saddle' ? new THREE.Color("#d946ef") : type === 'sharp' ? new THREE.Color("#fb7185") : new THREE.Color("#34d399");

        let maxL = -Infinity;
        let minL = Infinity;

        for (let i = 0; i < pos.count; i++) {
            const y = getLoss(type, pos.getX(i), pos.getZ(i));
            if (y > maxL) maxL = y;
            if (y < minL) minL = y;
        }

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            let y = getLoss(type, x, z);

            // Adjust height visually for Saddle to sit nicely in view
            pos.setY(i, type === 'saddle' ? y * 3 : y);

            const normalized = (y - minL) / (maxL - minL || 1);
            const c = new THREE.Color().lerpColors(c1, c2, normalized);
            colors.push(c.r, c.g, c.b);
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, [type]);

    return (
        <group position={[0, type === 'sharp' ? -10 : 0, 0]}>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    vertexColors={true}
                    roughness={0.6}
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
                    opacity={0.1}
                />
            </mesh>
        </group>
    );
}

interface Point { x: number, y: number, z: number }

function OptimizerBall({ running, resetSignal, type }: { running: boolean, resetSignal: number, type: LandscapeType }) {
    const getStartPos = (): Point => {
        if (type === 'saddle') return { x: 12, y: 0, z: 0.1 }; // Slight offset from z=0 so it falls off eventually
        return { x: 10, y: 0, z: 10 };
    };

    const [pos, setPos] = useState<Point>({ x: 0, y: 0, z: 0 });
    const [path, setPath] = useState<Point[]>([]);

    useEffect(() => {
        const s = getStartPos();
        s.y = getLoss(type, s.x, s.z);
        setPos(s);
        setPath([s]);
    }, [type, resetSignal]);

    useFrame((state, delta) => {
        if (!running) return;

        setPos(current => {
            const grad = getGradient(type, current.x, current.z);
            let lr = type === 'sharp' ? 0.3 : type === 'saddle' ? 2 : 5; // Adjust LR for smooth visuals

            const nx = current.x - lr * grad.dx;
            const nz = current.z - lr * grad.dz;

            // Re-render height visually scaled the same way as the mesh
            let ny = getLoss(type, nx, nz);

            const nextP = { x: nx, y: ny, z: nz };

            setPath(p => {
                if (p.length > 500) return p; // prevent infinite array growth
                return [...p, nextP];
            });

            return nextP;
        });
    });

    // Mesh vertical offset to match geometry modifications
    const yOffset = type === 'saddle' ? 3 : 1;
    const groupOffset = type === 'sharp' ? -10 : 0;

    return (
        <group position={[0, groupOffset, 0]}>
            {/* The Trail */}
            {path.map((p, i) => {
                if (i % 3 !== 0) return null; // Sparsify dots for trail
                return (
                    <mesh key={i} position={[p.x, (p.y * yOffset) + 0.2, p.z]}>
                        <sphereGeometry args={[0.2, 8, 8]} />
                        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} />
                    </mesh>
                )
            })}

            {/* The Ball */}
            <mesh position={[pos.x, (pos.y * yOffset) + 0.8, pos.z]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} emissive="#b45309" emissiveIntensity={0.5} />
            </mesh>
            <pointLight position={[pos.x, (pos.y * yOffset) + 2, pos.z]} color="#fde68a" intensity={1} distance={10} />
        </group>
    );
}
