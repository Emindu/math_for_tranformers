"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { AlignEndHorizontal } from 'lucide-react';

const normalPDF = (x: number, mu: number, sigma: number) => {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
};

export default function KLDivergenceLab() {
    const [muQ, setMuQ] = useState(0);
    const [sigmaQ, setSigmaQ] = useState(1);

    const muP = 0;
    const sigmaP = 1;

    const klDivergence = useMemo(() => {
        const ln2 = Math.log(2);
        const term1 = Math.log(sigmaQ / sigmaP);
        const term2 = (Math.pow(sigmaP, 2) + Math.pow(muP - muQ, 2)) / (2 * Math.pow(sigmaQ, 2));
        const valNATs = term1 + term2 - 0.5;
        return valNATs / ln2;
    }, [muQ, sigmaQ]);

    const crossEntropy = useMemo(() => {
        const hpNATs = 0.5 * Math.log(2 * Math.PI * Math.E * Math.pow(sigmaP, 2));
        const hpBits = hpNATs / Math.log(2);
        return hpBits + klDivergence;
    }, [klDivergence]);

    const pCurve = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let x = -5; x <= 5; x += 0.1) {
            pts.push(new THREE.Vector3(x * 2, normalPDF(x, muP, sigmaP) * 10, 0));
        }
        return pts;
    }, []);

    const qCurve = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let x = -5; x <= 5; x += 0.1) {
            pts.push(new THREE.Vector3(x * 2, normalPDF(x, muQ, sigmaQ) * 10, 2));
        }
        return pts;
    }, [muQ, sigmaQ]);

    const klBars = useMemo(() => {
        const bars = [];
        for (let x = -4; x <= 4; x += 0.4) {
            bars.push({
                x: x * 2,
                yP: normalPDF(x, muP, sigmaP) * 10,
                yQ: normalPDF(x, muQ, sigmaQ) * 10,
            });
        }
        return bars;
    }, [muQ, sigmaQ]);

    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 h-[600px] flex flex-col font-sans relative">
            <div className="flex bg-slate-800 p-4 border-b border-slate-700 items-center justify-between z-10">
                <div className="flex items-center gap-2 text-pink-400 font-bold">
                    <AlignEndHorizontal size={20} />
                    <span>Distribution Matching (KL Divergence)</span>
                </div>
            </div>

            <div className="flex-1 relative">
                <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
                    <color attach="background" args={['#0f172a']} />
                    <OrbitControls enablePan={false} minPolarAngle={0.5} maxPolarAngle={1.6} />

                    <group position={[0, -1, 0]}>
                        <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -0.01, 0]} />

                        <Line points={pCurve} color="#3b82f6" lineWidth={4} />
                        <Html position={[-8, 1.5, 0]} className="text-blue-500 font-bold pointer-events-none drop-shadow-sm whitespace-nowrap">
                            P(x) True
                        </Html>

                        <Line points={qCurve} color="#ec4899" lineWidth={4} />
                        <Html position={[-8, 1.5, 2]} className="text-pink-500 font-bold pointer-events-none drop-shadow-sm whitespace-nowrap">
                            Q(x) Approx
                        </Html>

                        {klBars.map((bar, i) => (
                            <Line
                                key={i}
                                points={[new THREE.Vector3(bar.x, bar.yP, 0), new THREE.Vector3(bar.x, bar.yQ, 2)]}
                                color={Math.abs(bar.yP - bar.yQ) > 0.5 ? '#f43f5e' : '#a8a29e'}
                                lineWidth={Math.abs(bar.yP - bar.yQ) * 2 + 1}
                                transparent
                                opacity={0.4}
                            />
                        ))}
                    </group>
                </Canvas>
            </div>

            <div className="absolute top-20 right-4 w-72 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-xl">
                <div className="flex flex-col gap-5">
                    <div>
                        <p className="text-slate-400 text-xs mb-4 leading-tight hidden md:block">
                            Adjust the Mean (µ) and Variance (σ²) of the approximation Q to minimize divergence from the true distribution P.
                        </p>

                        <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-300">Mean µ_q</span>
                            <span className="text-pink-400 font-mono">{muQ.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="-3" max="3" step="0.1"
                            value={muQ} onChange={(e) => setMuQ(parseFloat(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer mb-4"
                        />

                        <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-300">Std Dev σ_q</span>
                            <span className="text-pink-400 font-mono">{sigmaQ.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0.5" max="2.0" step="0.05"
                            value={sigmaQ} onChange={(e) => setSigmaQ(parseFloat(e.target.value))}
                            className="w-full accent-pink-500 cursor-pointer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 leading-none">KL Divergence<br />D(P||Q)</div>
                            <div className={`text-lg font-bold font-mono ${klDivergence < 0.1 ? 'text-emerald-400' : 'text-pink-400'}`}>
                                {klDivergence.toFixed(3)}
                            </div>
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center flex flex-col justify-center">
                            <div className="text-slate-400 text-[10px] uppercase tracking-wider mb-1 leading-none">Cross-Entropy<br />H(P, Q)</div>
                            <div className="text-lg font-bold text-indigo-400 font-mono">
                                {crossEntropy.toFixed(3)}
                            </div>
                        </div>
                    </div>

                    {klDivergence < 0.05 && (
                        <div className="text-xs text-emerald-400 text-center bg-emerald-900/40 border border-emerald-500/30 py-2 rounded font-bold mt-2">
                            Distributions Matched!
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
