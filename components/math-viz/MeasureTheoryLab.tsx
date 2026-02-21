"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Html, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { BarChart3, Activity } from 'lucide-react';
import Latex from 'react-latex-next';

type LabMode = 'integration' | 'ergodicity';

// Arnold's Cat Map transformation
const catMap = (x: number, y: number) => {
    return {
        x: (2 * x + y) % 1,
        y: (x + y) % 1
    };
};

export default function MeasureTheoryLab() {
    const [mode, setMode] = useState<LabMode>('integration');

    // --- INTEGRATION STATE ---
    const [integrationMethod, setIntegrationMethod] = useState<'riemann' | 'lebesgue'>('riemann');
    const [resolution, setResolution] = useState(10);

    // Target function for integration
    const f = (x: number) => {
        return Math.sin(x) * 1.5 + Math.cos(x * 2.5) * 0.5 + 2.5;
    };

    // Calculate curve points
    const curvePoints = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let x = -4; x <= 4; x += 0.05) {
            pts.push(new THREE.Vector3(x, f(x), 0));
        }
        return pts;
    }, []);

    // Riemann Rectangles (Partition Domain X)
    const riemannRects = useMemo(() => {
        const rects = [];
        const width = 8 / resolution; // Domain is [-4, 4] width = 8
        for (let i = 0; i < resolution; i++) {
            const xLeft = -4 + i * width;
            const xMid = xLeft + width / 2;
            const height = f(xMid);
            rects.push({ x: xMid, y: height / 2, width: width * 0.9, height });
        }
        return rects;
    }, [resolution]);

    // Lebesgue Horizontal Slabs (Partition Range Y)
    const lebesgueRects = useMemo(() => {
        const rects = [];
        const maxY = 4.5; // Approx max of f(x)
        const dY = maxY / resolution;

        for (let i = 0; i < resolution; i++) {
            const yLevel = i * dY;
            const h = dY * 0.9;

            // Find intervals where f(x) >= yLevel
            let inInterval = false;
            let startX = -4;
            for (let x = -4; x <= 4; x += 0.05) {
                if (f(x) >= yLevel && !inInterval) {
                    inInterval = true;
                    startX = x;
                } else if (f(x) < yLevel && inInterval) {
                    inInterval = false;
                    const endX = x;
                    const width = endX - startX;
                    const xMid = startX + width / 2;
                    rects.push({ x: xMid, y: yLevel + dY / 2, width: width, height: h });
                }
            }
            if (inInterval) {
                const endX = 4;
                const width = endX - startX;
                const xMid = startX + width / 2;
                rects.push({ x: xMid, y: yLevel + dY / 2, width: width, height: h });
            }
        }
        return rects;
    }, [resolution]);

    // --- ERGODICITY STATE ---
    const [iterations, setIterations] = useState(0);

    // Initial particles forming a compact square block (the "ink drop")
    const initialParticles = useMemo(() => {
        const p = [];
        const size = 30; // 30x30 = 900 particles
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                p.push({
                    x: 0.1 + (i / size) * 0.2,
                    y: 0.1 + (j / size) * 0.2
                });
            }
        }
        return p;
    }, []);

    // Map particles to Torus coordinates
    const torusParticles = useMemo(() => {
        const R = 3; // Major radius
        const r = 1; // Minor radius

        const currentP = initialParticles.map(p => {
            let px = p.x;
            let py = p.y;
            // Apply discrete cat map 'iterations' times
            for (let i = 0; i < iterations; i++) {
                const next = catMap(px, py);
                px = next.x;
                py = next.y;
            }
            return { x: px, y: py };
        });

        const positions = new Float32Array(currentP.length * 3);
        currentP.forEach((p, idx) => {
            const u = p.x;
            const v = p.y;
            // Map [0, 1] to Torus
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI * 2;

            const px = (R + r * Math.cos(phi)) * Math.cos(theta);
            const py = (R + r * Math.cos(phi)) * Math.sin(theta);
            const pz = r * Math.sin(phi);

            positions[idx * 3] = px;
            positions[idx * 3 + 1] = pz; // Swap Y/Z so it lies flat
            positions[idx * 3 + 2] = py;
        });

        return positions;
    }, [initialParticles, iterations]);


    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 h-[600px] flex flex-col font-sans">
            {/* Header / Tabs */}
            <div className="flex bg-slate-800 p-2 gap-2 border-b border-slate-700 z-10 relative">
                <button
                    onClick={() => setMode('integration')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'integration' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                >
                    <BarChart3 size={18} />
                    Lebesgue vs Riemann
                </button>
                <button
                    onClick={() => setMode('ergodicity')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'ergodicity' ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                >
                    <Activity size={18} />
                    Ergodicity Flow
                </button>
            </div>

            <div className="flex-1 relative flex">
                {/* 3D Canvas Area */}
                <div className="flex-1 relative">
                    <Canvas camera={{ position: mode === 'integration' ? [0, 2, 12] : [0, 8, 8], fov: 50 }}>
                        <color attach="background" args={['#0f172a']} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 10]} intensity={1} />
                        <OrbitControls
                            enablePan={false}
                            minPolarAngle={0.5}
                            maxPolarAngle={mode === 'integration' ? 1.6 : 1.2}
                        />

                        {/* INTEGRATION MODE */}
                        {mode === 'integration' && (
                            <group position={[0, -2, 0]}>
                                <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -0.01, 0]} />

                                {/* Curve */}
                                <Line
                                    points={curvePoints}
                                    color="#e2e8f0"
                                    lineWidth={4}
                                />

                                {/* Draw Rectangles */}
                                {(integrationMethod === 'riemann' ? riemannRects : lebesgueRects).map((r, i) => (
                                    <group key={i} position={[r.x, r.y, 0]}>
                                        <mesh>
                                            <boxGeometry args={[r.width, r.height, 0.5]} />
                                            <meshStandardMaterial
                                                color={integrationMethod === 'riemann' ? '#3b82f6' : '#10b981'}
                                                opacity={0.7}
                                                transparent
                                                roughness={0.2}
                                            />
                                        </mesh>
                                        <lineSegments>
                                            <edgesGeometry args={[new THREE.BoxGeometry(r.width, r.height, 0.51)]} />
                                            <lineBasicMaterial color={integrationMethod === 'riemann' ? '#1d4ed8' : '#047857'} />
                                        </lineSegments>
                                    </group>
                                ))}

                                {/* Axis Lines */}
                                <Line points={[new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)]} color="#475569" lineWidth={2} />
                                <Line points={[new THREE.Vector3(-4, 0, 0), new THREE.Vector3(-4, 5, 0)]} color="#475569" lineWidth={2} />

                                {/* Method explanation text in 3D */}
                                <Html position={[-3, 4.5, 0]} transform className="pointer-events-none">
                                    <div className={`px-3 py-1 rounded text-white font-bold text-xs ${integrationMethod === 'riemann' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                        {integrationMethod === 'riemann' ? 'Domain Partition (dx)' : 'Range Partition (dy)'}
                                    </div>
                                </Html>
                            </group>
                        )}

                        {/* ERGODICITY MODE */}
                        {mode === 'ergodicity' && (
                            <group>
                                <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -2, 0]} />

                                {/* Torus Mesh (Translucent) */}
                                <mesh rotation={[Math.PI / 2, 0, 0]}>
                                    <torusGeometry args={[3, 1, 32, 64]} />
                                    <meshStandardMaterial
                                        color="#334155"
                                        transparent
                                        opacity={0.3}
                                        wireframe={true}
                                    />
                                </mesh>

                                {/* Particles representing Measure */}
                                <points>
                                    <bufferGeometry>
                                        <bufferAttribute
                                            attach="attributes-position"
                                            count={torusParticles.length / 3}
                                            array={torusParticles}
                                            itemSize={3}
                                        />
                                    </bufferGeometry>
                                    <PointMaterial
                                        color="#d946ef"
                                        size={0.15}
                                        sizeAttenuation={true}
                                        transparent
                                        opacity={0.8}
                                    />
                                </points>
                            </group>
                        )}

                    </Canvas>
                </div>

                {/* Control Overlay */}
                <div className="absolute top-4 right-4 w-72 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-xl">

                    {mode === 'integration' && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-indigo-400 font-bold text-lg mb-1">Integration Approaches</h3>
                                <p className="text-slate-400 text-xs mb-4 leading-tight">
                                    Compare Riemann (slicing the X-axis) vs Lebesgue (slicing the Y-axis) integration. Lebesgue builds integrals from simple functions based on the measure of sets where <Latex>{`$f(x) \\ge y$`}</Latex>.
                                </p>

                                <div className="flex bg-slate-800 rounded-lg p-1 mb-6 border border-slate-700">
                                    <button
                                        onClick={() => setIntegrationMethod('riemann')}
                                        className={`flex-1 text-xs py-2 font-bold rounded-md transition-colors ${integrationMethod === 'riemann' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Riemann
                                    </button>
                                    <button
                                        onClick={() => setIntegrationMethod('lebesgue')}
                                        className={`flex-1 text-xs py-2 font-bold rounded-md transition-colors ${integrationMethod === 'lebesgue' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        Lebesgue
                                    </button>
                                </div>

                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-slate-300">Partition Resolution (N)</span>
                                    <span className={integrationMethod === 'riemann' ? 'text-blue-400 font-mono' : 'text-emerald-400 font-mono'}>{resolution}</span>
                                </div>
                                <input
                                    type="range"
                                    min="4" max="40" step="1"
                                    value={resolution}
                                    onChange={(e) => setResolution(parseInt(e.target.value))}
                                    className={`w-full cursor-pointer ${integrationMethod === 'riemann' ? 'accent-blue-500' : 'accent-emerald-500'}`}
                                />
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center text-xs text-slate-300">
                                {integrationMethod === 'riemann' ?
                                    "Approximating Area = Sum of (Height × dx)" :
                                    "Approximating Area = Sum of (Measure(Set) × dy)"}
                            </div>
                        </div>
                    )}

                    {mode === 'ergodicity' && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-fuchsia-400 font-bold text-lg mb-1">Ergodic Torus</h3>
                                <p className="text-slate-400 text-xs mb-4 leading-tight">
                                    Simulating Arnold's Cat Map. Watch how a compact "drop of ink" (900 particles) is repeatedly stretched and wrapped around the Torus.
                                </p>

                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="text-slate-300">Time / Iterations</span>
                                    <span className="text-fuchsia-400 font-mono">T = {iterations}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="6" step="1"
                                    value={iterations}
                                    onChange={(e) => setIterations(parseInt(e.target.value))}
                                    className="w-full accent-fuchsia-500 cursor-pointer mb-2"
                                />
                                <p className="text-slate-500 text-[10px] italic">
                                    Slide to iterate the map. Notice how the points mix chaotically but the total number of points remains globally conserved.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 leading-none">Total Measure</div>
                                    <div className="text-lg font-bold text-emerald-400 font-mono">
                                        Conserved
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                                    <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 leading-none">State</div>
                                    <div className="text-sm font-bold text-fuchsia-400 font-mono pt-1">
                                        {iterations === 0 ? "Initial" : iterations < 3 ? "Mixing" : "Ergodic"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
