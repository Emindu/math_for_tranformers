"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Coins } from 'lucide-react';

export default function EntropyLab() {
    const [p, setP] = useState(0.5); // P(Heads)

    const entropy = useMemo(() => {
        if (p === 0 || p === 1) return 0;
        return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
    }, [p]);

    const entropyCurvePoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= 100; i++) {
            const xVal = i / 100; // 0 to 1
            const pVal = xVal;
            let h = 0;
            if (pVal > 0 && pVal < 1) {
                h = -(pVal * Math.log2(pVal) + (1 - pVal) * Math.log2(1 - pVal));
            }
            points.push(new THREE.Vector3(xVal * 10 - 5, h * 5, -2));
        }
        return points;
    }, []);

    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 h-[500px] flex flex-col font-sans relative">

            {/* Header */}
            <div className="flex bg-slate-800 p-4 border-b border-slate-700 items-center justify-between z-10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Coins size={20} />
                    <span>Coin Entropy Optimization</span>
                </div>
            </div>

            {/* 3D Canvas Area */}
            <div className="flex-1 relative">
                <Canvas camera={{ position: [0, 4, 12], fov: 45 }}>
                    <color attach="background" args={['#0f172a']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={1} />
                    <OrbitControls enablePan={false} minPolarAngle={1.0} maxPolarAngle={1.6} />

                    <group>
                        {/* Ground */}
                        <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -0.01, 0]} />

                        {/* Curve */}
                        <Line points={entropyCurvePoints} color="#10b981" lineWidth={5} dashed={false} />

                        {/* Glow Sphere on Curve */}
                        <mesh position={[(p * 10) - 5, entropy * 5, -2]}>
                            <sphereGeometry args={[0.3, 32, 32]} />
                            <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={2} />
                        </mesh>

                        <Html position={[-5.5, 0, -2]} center className="text-emerald-500 font-bold text-xs pointer-events-none">P=0</Html>
                        <Html position={[5.5, 0, -2]} center className="text-emerald-500 font-bold text-xs pointer-events-none">P=1</Html>

                        {/* P(Heads) Bar */}
                        <group position={[-2, (p * 5) / 2, 2]}>
                            <mesh>
                                <boxGeometry args={[2, p * 5, 2]} />
                                <meshStandardMaterial color="#0ea5e9" opacity={0.8} transparent />
                            </mesh>
                            <Html position={[0, (p * 5) / 2 + 0.5, 0]} center className="text-sky-400 font-bold pointer-events-none text-xl drop-shadow-md">
                                P(H) = {p.toFixed(2)}
                            </Html>
                        </group>

                        {/* P(Tails) Bar */}
                        <group position={[2, ((1 - p) * 5) / 2, 2]}>
                            <mesh>
                                <boxGeometry args={[2, (1 - p) * 5, 2]} />
                                <meshStandardMaterial color="#f43f5e" opacity={0.8} transparent />
                            </mesh>
                            <Html position={[0, ((1 - p) * 5) / 2 + 0.5, 0]} center className="text-rose-400 font-bold pointer-events-none text-xl drop-shadow-md">
                                P(T) = {(1 - p).toFixed(2)}
                            </Html>
                        </group>
                    </group>
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute bottom-4 right-4 w-72 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-xl">
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-slate-400 text-xs mb-3 leading-tight hidden md:block">
                            Adjust the bias of the coin. Notice how maximum uncertainty (entropy) occurs when P(H) = 0.5.
                        </p>

                        <div className="mb-2 flex justify-between text-sm">
                            <span className="text-slate-300">P(Heads) Bias</span>
                            <span className="text-sky-400 font-mono">{p.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="1" step="0.01"
                            value={p} onChange={(e) => setP(parseFloat(e.target.value))}
                            className="w-full accent-emerald-500 cursor-pointer"
                        />
                    </div>

                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Entropy H(X)</div>
                        <div className="text-3xl font-bold text-emerald-400 font-mono flex items-end gap-1">
                            {entropy.toFixed(3)}
                            <span className="text-xs text-slate-500 mb-1">bits</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
