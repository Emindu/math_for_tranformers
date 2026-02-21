"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Square, RotateCcw, Activity } from 'lucide-react';

// A classic "ravine" optimization landscape to demonstrate the difference between Adam, SGD, and GD.
// We use a scaled Rosenbrock-like function or simply an elongated bowl.
const lossFunction = (x: number, y: number) => {
    // Elongated bowl that causes standard GD to oscillate
    return (x * x) / 20 + (y * y) / 2;
};

// Gradients for the loss function: df/dx = x/10, df/dy = y
const getGradient = (x: number, y: number, noiseLevel: number = 0) => {
    const randN = () => Math.sqrt(-2.0 * Math.log(Math.random() || 0.001)) * Math.cos(2.0 * Math.PI * Math.random());
    return {
        dx: (x / 10) + (noiseLevel * randN()),
        dy: y + (noiseLevel * randN())
    };
};

export default function GradientDescentVariantsLab() {
    const [running, setRunning] = useState(false);

    // Lift state up so we can reset from the UI panel outside the canvas
    const [resetSignal, setResetSignal] = useState(0);

    const handleReset = () => {
        setRunning(false);
        setResetSignal(prev => prev + 1);
    };

    return (
        <div className="w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 h-[800px]">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Activity className="text-indigo-400" size={20} />
                    <h3 className="text-white font-semibold">Optimizer Trajectories Visualization</h3>
                </div>
            </div>

            {/* Control Panel (Moved out of 3D Canvas to prevent visual obstruction) */}
            <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex flex-col sm:flex-row gap-6 justify-between items-center">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                        <span className="text-sm font-medium text-slate-200">Gradient Descent (GD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
                        <span className="text-sm font-medium text-slate-200">Stochastic GD (SGD)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                        <span className="text-sm font-medium text-slate-200">Adam</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setRunning(!running)}
                        className={`px-5 py-2 rounded-lg flex items-center gap-2 font-bold transition-all ${running ? 'bg-amber-500 hover:bg-amber-600 text-slate-900' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    >
                        {running ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        {running ? 'Pause Simulation' : 'Run Optimizers'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>
            </div>

            {/* 3D Canvas Area */}
            <div className="flex-grow bg-slate-100 relative shadow-inner">
                <Canvas camera={{ position: [30, 35, 30], fov: 45 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[20, 40, 20]} intensity={1.2} />
                    <pointLight position={[-20, 20, -20]} intensity={0.5} color="#818cf8" />

                    <LossLandscape />
                    <OptimizerRace running={running} resetSignal={resetSignal} />

                    <OrbitControls
                        enablePan={false}
                        minDistance={15}
                        maxDistance={100}
                        maxPolarAngle={Math.PI / 2 - 0.05}
                        autoRotate={!running}
                        autoRotateSpeed={0.5}
                        target={[0, 0, 0]}
                    />
                </Canvas>

                {/* Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                    <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 text-slate-300 text-sm flex gap-4 max-w-3xl mx-auto shadow-xl">
                        <div className="flex-1">
                            <strong className="text-rose-400 block mb-1">GD behaves poorly in ravines.</strong>
                            It oscillates vertically across the steep axis and makes very slow progress along the flat axis.
                        </div>
                        <div className="flex-1">
                            <strong className="text-amber-400 block mb-1">SGD introduces noise.</strong>
                            Stochasticity helps escape local minima but creates a jittery path that requires learning rate decay.
                        </div>
                        <div className="flex-1">
                            <strong className="text-emerald-400 block mb-1">Adam adapts beautifully.</strong>
                            Momentum smooths out the oscillations, and adaptive learning rates speed up progress along the flat axis.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LossLandscape() {
    // Generate an improved, shaded loss surface geometry with a custom colormap feeling
    const geometry = useMemo(() => {
        const size = 50;
        const segments = 100;
        const geo = new THREE.PlaneGeometry(size, size, segments, segments);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors = [];

        // Colormap generator (from deep blue low to bright yellow high)
        const colorLow = new THREE.Color("#1e1b4b"); // deep indigo
        const colorMid = new THREE.Color("#4f46e5"); // indigo
        const colorHigh = new THREE.Color("#818cf8"); // light indigo/periwinkle
        const colorMax = new THREE.Color("#e0e7ff"); // extremely light

        let maxLoss = 0;
        let minLoss = Infinity;

        // First pass to find min/max for normalization
        for (let i = 0; i < pos.count; i++) {
            const y = lossFunction(pos.getX(i), pos.getZ(i));
            if (y > maxLoss) maxLoss = y;
            if (y < minLoss) minLoss = y;
        }

        // Second pass to set height and colors
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            const y = lossFunction(x, z);
            pos.setY(i, y);

            // Interpolate color based on height
            const normalizedHeight = (y - minLoss) / (maxLoss - minLoss);
            const c = new THREE.Color();

            if (normalizedHeight < 0.33) {
                c.lerpColors(colorLow, colorMid, normalizedHeight / 0.33);
            } else if (normalizedHeight < 0.66) {
                c.lerpColors(colorMid, colorHigh, (normalizedHeight - 0.33) / 0.33);
            } else {
                c.lerpColors(colorHigh, colorMax, (normalizedHeight - 0.66) / 0.34);
            }

            colors.push(c.r, c.g, c.b);
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <group>
            <mesh geometry={geometry}>
                <meshStandardMaterial
                    vertexColors={true}
                    wireframe={false}
                    roughness={0.8}
                    transparent={true}
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Overlay a subtle wireframe to indicate topology better */}
            <mesh geometry={geometry}>
                <meshBasicMaterial
                    color="#ffffff"
                    wireframe={true}
                    transparent={true}
                    opacity={0.05}
                />
            </mesh>
        </group>
    );
}

interface Point3D {
    x: number;
    y: number;
    z: number;
}

function OptimizerRace({ running, resetSignal }: { running: boolean, resetSignal: number }) {
    // Starting position far out on a steep edge of the elongated bowl
    const startX = -20;
    const startZ = 15;
    const getStartY = () => lossFunction(startX, startZ);

    const [pathGD, setPathGD] = useState<Point3D[]>([{ x: startX, y: getStartY(), z: startZ }]);
    const [pathSGD, setPathSGD] = useState<Point3D[]>([{ x: startX, y: getStartY(), z: startZ }]);
    const [pathAdam, setPathAdam] = useState<Point3D[]>([{ x: startX, y: getStartY(), z: startZ }]);

    // Internal states for momentum/Adam
    const adamState = useRef({ m: { x: 0, z: 0 }, v: { x: 0, z: 0 }, t: 0 });

    useEffect(() => {
        // Reset all paths
        setPathGD([{ x: startX, y: getStartY(), z: startZ }]);
        setPathSGD([{ x: startX, y: getStartY(), z: startZ }]);
        setPathAdam([{ x: startX, y: getStartY(), z: startZ }]);
        adamState.current = { m: { x: 0, z: 0 }, v: { x: 0, z: 0 }, t: 0 };
    }, [resetSignal]);

    useFrame(() => {
        if (!running) return;

        const isConverged = (p: Point3D) => p.x * p.x + p.z * p.z < 0.05;

        // --- Standard GD ---
        setPathGD(prev => {
            const last = prev[prev.length - 1];
            if (isConverged(last)) return prev;

            // GD learning rate must be low enough not to explode on the steep y-axis, 
            // but this makes it excruciatingly slow on the flat x-axis.
            const lr = 1.0;
            const grad = getGradient(last.x, last.z, 0);
            const nx = last.x - lr * grad.dx;
            const nz = last.z - lr * grad.dy;
            return [...prev, { x: nx, y: lossFunction(nx, nz), z: nz }];
        });

        // --- SGD (noisy GD) ---
        setPathSGD(prev => {
            const last = prev[prev.length - 1];
            if (isConverged(last)) return prev;

            // SGD bounces around a lot
            const lr = 0.5;
            const grad = getGradient(last.x, last.z, 2.0); // Noisy gradient
            const nx = last.x - lr * grad.dx;
            const nz = last.z - lr * grad.dy;
            return [...prev, { x: nx, y: lossFunction(nx, nz), z: nz }];
        });

        // --- Adam ---
        setPathAdam(prev => {
            const last = prev[prev.length - 1];
            if (isConverged(last)) return prev;

            const lr = 1.0; // Adam can handle a much higher generic learning rate
            const beta1 = 0.9;
            const beta2 = 0.999;
            const eps = 1e-8;

            const grad = getGradient(last.x, last.z, 0);
            const state = adamState.current;
            state.t += 1;

            state.m.x = beta1 * state.m.x + (1 - beta1) * grad.dx;
            state.m.z = beta1 * state.m.z + (1 - beta1) * grad.dy;

            state.v.x = beta2 * state.v.x + (1 - beta2) * (grad.dx * grad.dx);
            state.v.z = beta2 * state.v.z + (1 - beta2) * (grad.dy * grad.dy);

            const mHatX = state.m.x / (1 - Math.pow(beta1, state.t));
            const mHatZ = state.m.z / (1 - Math.pow(beta1, state.t));
            const vHatX = state.v.x / (1 - Math.pow(beta2, state.t));
            const vHatZ = state.v.z / (1 - Math.pow(beta2, state.t));

            const nx = last.x - lr * mHatX / (Math.sqrt(vHatX) + eps);
            const nz = last.z - lr * mHatZ / (Math.sqrt(vHatZ) + eps);

            return [...prev, { x: nx, y: lossFunction(nx, nz), z: nz }];
        });
    });

    return (
        <group>
            {/* Target Minimum Marker */}
            <mesh position={[0, lossFunction(0, 0), 0]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={1} />
            </mesh>

            <pointLight position={[0, 2, 0]} color="#a855f7" intensity={2} distance={20} />

            {/* Trajectories */}
            <TrajectoryLine path={pathGD} color="#f43f5e" thickness={0.3} />
            <TrajectoryLine path={pathSGD} color="#fbbf24" thickness={0.15} />
            <TrajectoryLine path={pathAdam} color="#34d399" thickness={0.4} />

            {/* Optimizer "Heads" */}
            <Ball pos={pathGD[pathGD.length - 1]} color="#f43f5e" size={0.8} />
            <Ball pos={pathSGD[pathSGD.length - 1]} color="#fbbf24" size={0.6} />
            <Ball pos={pathAdam[pathAdam.length - 1]} color="#34d399" size={0.9} />
        </group>
    );
}

function TrajectoryLine({ path, color, thickness }: { path: Point3D[], color: string, thickness: number }) {
    if (path.length < 2) return null;

    // Limit to the last 200 points to keep geometry from getting too complex,
    // or keep all but we only redraw occasionally. Since we want the full path,
    // and it might be long, let's render the entire path slightly elevated.
    const curve = useMemo(() => {
        // smooth out the path slightly
        const vectors = path.map(p => new THREE.Vector3(p.x, p.y + 0.3, p.z));
        // Remove duplicates if any (causes CatmullRom to crash)
        const deduped: THREE.Vector3[] = [];
        for (let i = 0; i < vectors.length; i++) {
            if (i === 0 || vectors[i].distanceTo(vectors[i - 1]) > 0.01) {
                deduped.push(vectors[i]);
            }
        }
        if (deduped.length < 2) return null;
        return new THREE.CatmullRomCurve3(deduped);
    }, [path]);

    if (!curve) return null;

    return (
        <mesh>
            <tubeGeometry args={[curve, path.length * 2, thickness, 8, false]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.2} metalness={0.5} />
        </mesh>
    );
}

function Ball({ pos, color, size }: { pos: Point3D, color: string, size: number }) {
    return (
        <mesh position={[pos.x, pos.y + size, pos.z]}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} emissive={color} emissiveIntensity={0.2} />
        </mesh>
    );
}
