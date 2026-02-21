"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Coins, AlignEndHorizontal } from 'lucide-react';

type LabMode = 'entropy' | 'kl';

// Utility for calculating normal PDF
const normalPDF = (x: number, mu: number, sigma: number) => {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
};

export default function InformationTheoryLab() {
    const [mode, setMode] = useState<LabMode>('entropy');

    // Entropy State
    const [p, setP] = useState(0.5); // P(Heads)

    // KL Divergence State
    // P is a standard normal (mu=0, sigma=1)
    const [muQ, setMuQ] = useState(0);
    const [sigmaQ, setSigmaQ] = useState(1);

    // --- ENTROPY CALCULATIONS ---
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
            // Map x: [0, 1] -> [-5, 5]
            // Map y: [0, 1] -> [0, 5]
            points.push(new THREE.Vector3(xVal * 10 - 5, h * 5, -2));
        }
        return points;
    }, []);

    // --- KL DIVERGENCE CALCULATIONS ---
    const muP = 0;
    const sigmaP = 1;

    // Continuous KL Divergence in bits
    const klDivergence = useMemo(() => {
        const ln2 = Math.log(2);
        const term1 = Math.log(sigmaQ / sigmaP);
        const term2 = (Math.pow(sigmaP, 2) + Math.pow(muP - muQ, 2)) / (2 * Math.pow(sigmaQ, 2));
        const valNATs = term1 + term2 - 0.5;
        return valNATs / ln2; // Convert to bits
    }, [muQ, sigmaQ]);

    const crossEntropy = useMemo(() => {
        // H(P) for standard normal in bits
        const hpNATs = 0.5 * Math.log(2 * Math.PI * Math.E * Math.pow(sigmaP, 2));
        const hpBits = hpNATs / Math.log(2);
        return hpBits + klDivergence;
    }, [klDivergence]);

    // Generate normal curves
    const pCurve = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const y = normalPDF(x, muP, sigmaP);
            pts.push(new THREE.Vector3(x * 2, y * 10, 0));
        }
        return pts;
    }, []);

    const qCurve = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const y = normalPDF(x, muQ, sigmaQ);
            pts.push(new THREE.Vector3(x * 2, y * 10, 2));
        }
        return pts;
    }, [muQ, sigmaQ]);

    // KL shading/bars (connecting P and Q visually)
    const klBars = useMemo(() => {
        const bars = [];
        for (let x = -4; x <= 4; x += 0.4) {
            const px = x;
            const yP = normalPDF(px, muP, sigmaP) * 10;
            const yQ = normalPDF(px, muQ, sigmaQ) * 10;
            bars.push({
                x: px * 2,
                yP,
                yQ,
            });
        }
        return bars;
    }, [muQ, sigmaQ]);

    return (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 h-[600px] flex flex-col font-sans">
            {/* Header / Tabs */}
            <div className="flex bg-slate-800 p-2 gap-2 border-b border-slate-700">
                <button
                    onClick={() => setMode('entropy')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'entropy' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                >
                    <Coins size={18} />
                    Coin Entropy
                </button>
                <button
                    onClick={() => setMode('kl')}
                    className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${mode === 'kl' ? 'bg-pink-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                        }`}
                >
                    <AlignEndHorizontal size={18} />
                    KL Divergence
                </button>
            </div>

            <div className="flex-1 relative flex">

                {/* 3D Canvas Area */}
                <div className="flex-1 relative">
                    <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
                        <color attach="background" args={['#0f172a']} />
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 10]} intensity={1} />
                        <OrbitControls
                            enablePan={false}
                            minPolarAngle={1.0}
                            maxPolarAngle={1.6}
                        />

                        {/* ENTROPY MODE */}
                        {mode === 'entropy' && (
                            <group>
                                {/* Ground */}
                                <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -0.01, 0]} />

                                {/* Curve */}
                                <Line
                                    points={entropyCurvePoints}
                                    color="#10b981"
                                    lineWidth={5}
                                    dashed={false}
                                />
                                {/* Glow Sphere on Curve */}
                                <mesh position={[(p * 10) - 5, entropy * 5, -2]}>
                                    <sphereGeometry args={[0.3, 32, 32]} />
                                    <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={2} />
                                </mesh>

                                {/* Labels for curve */}
                                <Html position={[-5.5, 0, -2]} center className="text-emerald-500 font-bold text-xs pointer-events-none">
                                    P=0
                                </Html>
                                <Html position={[5.5, 0, -2]} center className="text-emerald-500 font-bold text-xs pointer-events-none">
                                    P=1
                                </Html>

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
                        )}

                        {/* KL DIVERGENCE MODE */}
                        {mode === 'kl' && (
                            <group position={[0, -1, 0]}>
                                <gridHelper args={[20, 20, '#1e293b', '#1e293b']} position={[0, -0.01, 0]} />

                                {/* P(x) Curve (True Distribution) */}
                                <Line
                                    points={pCurve}
                                    color="#3b82f6"
                                    lineWidth={4}
                                />
                                <Html position={[-8, 1.5, 0]} className="text-blue-500 font-bold pointer-events-none drop-shadow-sm whitespace-nowrap">
                                    P(x) ~ N(0, 1) [True]
                                </Html>

                                {/* Q(x) Curve (Approx Distribution) */}
                                <Line
                                    points={qCurve}
                                    color="#ec4899"
                                    lineWidth={4}
                                />
                                <Html position={[-8, 1.5, 2]} className="text-pink-500 font-bold pointer-events-none drop-shadow-sm whitespace-nowrap">
                                    Q(x) ~ N(µ, σ²) [Approx]
                                </Html>

                                {/* Shaded connecting lines to represent Divergence */}
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
                        )}

                    </Canvas>
                </div>

                {/* Left (or Right) Control Overlay */}
                <div className="absolute top-4 right-4 w-72 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-xl">

                    {mode === 'entropy' && (
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-emerald-400 font-bold text-lg mb-1">Shannon Entropy</h3>
                                <p className="text-slate-400 text-xs mb-4 leading-tight">
                                    Adjust the bias of the coin. Notice how maximum uncertainty (entropy) occurs when P(H) = 0.5 (a perfectly fair coin).
                                </p>

                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-slate-300">P(Heads)</span>
                                    <span className="text-sky-400 font-mono">{p.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={p}
                                    onChange={(e) => setP(parseFloat(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                            </div>

                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Entropy H(X)</div>
                                <div className="text-3xl font-bold text-emerald-400 font-mono">
                                    {entropy.toFixed(3)}
                                </div>
                                <div className="text-slate-500 text-xs mt-1">bits</div>
                            </div>
                        </div>
                    )}

                    {mode === 'kl' && (
                        <div className="flex flex-col gap-5">
                            <div>
                                <h3 className="text-pink-400 font-bold text-lg mb-1">KL Divergence</h3>
                                <p className="text-slate-400 text-xs mb-4 leading-tight">
                                    Adjust the Mean (µ) and Variance (σ²) of the approximation Q to match the true distribution P.
                                </p>

                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="text-slate-300">Mean µ_q</span>
                                    <span className="text-pink-400 font-mono">{muQ.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="-3" max="3" step="0.1"
                                    value={muQ}
                                    onChange={(e) => setMuQ(parseFloat(e.target.value))}
                                    className="w-full accent-pink-500 cursor-pointer mb-4"
                                />

                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="text-slate-300">Std Dev σ_q</span>
                                    <span className="text-pink-400 font-mono">{sigmaQ.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.5" max="2.0" step="0.05"
                                    value={sigmaQ}
                                    onChange={(e) => setSigmaQ(parseFloat(e.target.value))}
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
                                <div className="text-xs text-emerald-400 text-center bg-emerald-900/30 py-2 rounded font-bold mt-2">
                                    Distributions Matched!
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
