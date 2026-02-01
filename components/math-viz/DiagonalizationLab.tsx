"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Maximize2, X, Play, RotateCcw } from 'lucide-react';

// Arrow component
function Arrow({ start, end, color, label, lineWidth = 3 }: {
    start: [number, number, number],
    end: [number, number, number],
    color: string,
    label?: string,
    lineWidth?: number
}) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const length = endVec.distanceTo(startVec);
    if (length < 0.05) return null;

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={lineWidth} />
            <mesh position={endVec}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text
                    position={endVec.clone().add(new THREE.Vector3(0.2, 0.15, 0))}
                    fontSize={0.22}
                    color={color}
                    outlineWidth={0.02}
                    outlineColor="#000"
                    fontWeight="bold"
                >
                    {label}
                </Text>
            )}
        </group>
    );
}

// Skewed Grid (Eigenbasis)
function EigenbasisGrid({ v1, v2, show }: { v1: [number, number], v2: [number, number], show: boolean }) {
    if (!show) return null;
    const lines: React.ReactNode[] = [];
    const range = 5;

    // Lines parallel to v2 (spaced along v1)
    for (let i = -range; i <= range; i++) {
        const start = new THREE.Vector3(v1[0] * i - v2[0] * range, v1[1] * i - v2[1] * range, -0.05);
        const end = new THREE.Vector3(v1[0] * i + v2[0] * range, v1[1] * i + v2[1] * range, -0.05);
        lines.push(<Line key={`v2-para-${i}`} points={[start, end]} color="#64748b" lineWidth={0.5} opacity={0.3} transparent />);
    }

    // Lines parallel to v1 (spaced along v2)
    for (let i = -range; i <= range; i++) {
        const start = new THREE.Vector3(v2[0] * i - v1[0] * range, v2[1] * i - v1[1] * range, -0.05);
        const end = new THREE.Vector3(v2[0] * i + v1[0] * range, v2[1] * i + v1[1] * range, -0.05);
        lines.push(<Line key={`v1-para-${i}`} points={[start, end]} color="#64748b" lineWidth={0.5} opacity={0.3} transparent />);
    }

    return <group>{lines}</group>;
}

function DiagonalizationViz({
    matrix, c1, c2, showEigenGrid
}: {
    matrix: number[][], c1: number, c2: number, showEigenGrid: boolean
}) {
    // 1. Calculate Eigenvalues and Eigenvectors
    const { eigenvalues, eigenvectors, isComplex } = useMemo(() => {
        const a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];
        const trace = a + d;
        const det = a * d - b * c;
        const disc = trace * trace - 4 * det;

        if (disc < 0) return { eigenvalues: [0, 0], eigenvectors: null, isComplex: true };

        const sqrtDisc = Math.sqrt(disc);
        const l1 = (trace + sqrtDisc) / 2;
        const l2 = (trace - sqrtDisc) / 2;

        // Find eigenvectors
        // (A - lI)v = 0 => (a-l)x + by = 0
        const getEv = (l: number): [number, number] => {
            if (Math.abs(b) > 1e-6) return [b, l - a];
            if (Math.abs(c) > 1e-6) return [l - d, c];
            return [1, 0];
        };

        let v1 = getEv(l1);
        let v2 = getEv(l2);

        // Normalize
        const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
        v1 = [v1[0] / norm1, v1[1] / norm1];
        v2 = [v2[0] / norm2, v2[1] / norm2];

        // If linear dependent (defective), handle
        // Basic check: Are they parallel?
        const dot = v1[0] * v2[1] - v1[1] * v2[0];
        if (Math.abs(dot) < 1e-4) {
            // force orth for visualization if defective (fallback)
            v2 = [-v1[1], v1[0]];
        }

        return { eigenvalues: [l1, l2], eigenvectors: [v1, v2], isComplex: false };
    }, [matrix]);

    if (isComplex || !eigenvectors) {
        return <Text position={[0, 0, 0]} color="white" fontSize={0.5}>Complex Eigenvalues - Not Diagonalizable over ℝ</Text>;
    }

    const v1 = eigenvectors[0];
    const v2 = eigenvectors[1];
    const l1 = eigenvalues[0];
    const l2 = eigenvalues[1];

    // Vector v constructed from coordinates c1, c2 in eigenbasis
    // v = c1*v1 + c2*v2
    const v: [number, number] = [
        c1 * v1[0] + c2 * v2[0],
        c1 * v1[1] + c2 * v2[1]
    ];

    // Av = c1*l1*v1 + c2*l2*v2
    const Av: [number, number] = [
        c1 * l1 * v1[0] + c2 * l2 * v2[0],
        c1 * l1 * v1[1] + c2 * l2 * v2[1]
    ];

    // Component vectors for visualization
    const comp1_v: [number, number] = [c1 * v1[0], c1 * v1[1]];
    const comp2_v: [number, number] = [c2 * v2[0], c2 * v2[1]];

    const comp1_Av: [number, number] = [c1 * l1 * v1[0], c1 * l1 * v1[1]];
    const comp2_Av: [number, number] = [c2 * l2 * v2[0], c2 * l2 * v2[1]];

    return (
        <group>
            {/* Eigenbasis Grid */}
            <EigenbasisGrid v1={v1} v2={v2} show={showEigenGrid} />

            {/* Basis Vectors P (Eigenvectors) */}
            <Arrow start={[0, 0, 0]} end={[v1[0] * 1.2, v1[1] * 1.2, 0]} color="#3b82f6" label="v₁" lineWidth={4} />
            <Arrow start={[0, 0, 0]} end={[v2[0] * 1.2, v2[1] * 1.2, 0]} color="#ef4444" label="v₂" lineWidth={4} />

            {/* Components of v */}
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(...comp1_v, 0)]} color="#3b82f6" dashed dashSize={0.1} gapSize={0.05} />
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(...comp2_v, 0)]} color="#ef4444" dashed dashSize={0.1} gapSize={0.05} />

            {/* Parallelogram for v */}
            <Line points={[new THREE.Vector3(...comp1_v, 0), new THREE.Vector3(...v, 0)]} color="#ef4444" dashed dashSize={0.05} gapSize={0.05} opacity={0.5} transparent />
            <Line points={[new THREE.Vector3(...comp2_v, 0), new THREE.Vector3(...v, 0)]} color="#3b82f6" dashed dashSize={0.05} gapSize={0.05} opacity={0.5} transparent />

            {/* Vector v */}
            <Arrow start={[0, 0, 0]} end={[v[0], v[1], 0]} color="#a855f7" label="v" lineWidth={4} />

            {/* Vector Av */}
            <Arrow start={[0, 0, 0]} end={[Av[0], Av[1], 0]} color="#22c55e" label="Av" lineWidth={4} />

            {/* Connection v -> Av */}
            <Arrow start={[v[0], v[1], 0]} end={[Av[0], Av[1], 0]} color="#94a3b8" lineWidth={1} />
        </group>
    );
}

function MatrixBox({ title, matrix, color = "bg-white" }: { title: string, matrix: number[][], color?: string }) {
    return (
        <div className={`p-2 rounded border border-slate-200 ${color} text-center`}>
            <div className="text-xs font-semibold text-slate-600 mb-1">{title}</div>
            <div className="grid grid-cols-2 gap-x-2 font-mono text-sm">
                <span>{matrix[0][0].toFixed(2)}</span><span>{matrix[0][1].toFixed(2)}</span>
                <span>{matrix[1][0].toFixed(2)}</span><span>{matrix[1][1].toFixed(2)}</span>
            </div>
        </div>
    );
}

export default function DiagonalizationLab() {
    const [matrix, setMatrix] = useState<number[][]>([[1.5, 0.5], [0.5, 1.5]]); // Symmetric default
    const [c1, setC1] = useState(1);
    const [c2, setC2] = useState(1);
    const [showEigenGrid, setShowEigenGrid] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Compute P and D for display
    const { P, Pinv, D, isComplex } = useMemo(() => {
        const a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];
        const trace = a + d;
        const disc = trace * trace - 4 * (a * d - b * c);

        if (disc < 0) return { P: [[0, 0], [0, 0]], Pinv: [[0, 0], [0, 0]], D: [[0, 0], [0, 0]], isComplex: true };

        const sqrtDisc = Math.sqrt(disc);
        const l1 = (trace + sqrtDisc) / 2;
        const l2 = (trace - sqrtDisc) / 2;

        const getEv = (l: number): [number, number] => {
            if (Math.abs(b) > 1e-6) return [b, l - a];
            if (Math.abs(c) > 1e-6) return [l - d, c];
            return [1, 0];
        };

        const v1 = getEv(l1);
        const v2 = getEv(l2);

        // Normalize
        const n1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2);
        const n2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2);
        const vn1 = [v1[0] / n1, v1[1] / n1];
        const vn2 = [v2[0] / n2, v2[1] / n2];

        // P = [v1 v2]
        const P = [[vn1[0], vn2[0]], [vn1[1], vn2[1]]];
        // D = [l1 0; 0 l2]
        const D = [[l1, 0], [0, l2]];

        // Inverse P (determinant method)
        const detP = P[0][0] * P[1][1] - P[0][1] * P[1][0];
        const Pinv = [
            [P[1][1] / detP, -P[0][1] / detP],
            [-P[1][0] / detP, P[0][0] / detP]
        ];

        return { P, Pinv, D, isComplex: false };
    }, [matrix]);

    const presets = [
        { name: 'Symmetric', m: [[1.5, 0.5], [0.5, 1.5]] },
        { name: 'Diagonal', m: [[2, 0], [0, 0.5]] },
        { name: 'Shear-like', m: [[1.5, 1], [0, 0.5]] }, // diagonalizable
        { name: 'Uneven', m: [[1, 0.5], [0.2, 1.2]] }
    ];

    const Viz = (
        <group>
            <color attach="background" args={['#0f172a']} />
            <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={5} sectionThickness={0.5} sectionColor="#334155" fadeDistance={25} />
            <OrbitControls makeDefault enableRotate={false} />
            <ambientLight intensity={0.8} />
            <pointLight position={[5, 5, 5]} intensity={0.5} />
            <DiagonalizationViz matrix={matrix} c1={c1} c2={c2} showEigenGrid={showEigenGrid} />
        </group>
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
                <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                    <h2 className="text-white font-bold">Diagonalization Lab</h2>
                    <button onClick={() => setIsFullscreen(false)} className="text-white bg-red-600 p-2 rounded"><X size={20} /></button>
                </div>
                <div className="flex-1">
                    <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>{Viz}</Canvas>
                </div>
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                    <div className="flex gap-4 text-white items-center justify-center">
                        <div>
                            <span className="text-blue-400 font-mono">c₁ (along v₁)</span>
                            <input type="range" min={-3} max={3} step={0.1} value={c1} onChange={e => setC1(parseFloat(e.target.value))} className="mx-2" />
                            {c1.toFixed(1)}
                        </div>
                        <div>
                            <span className="text-red-400 font-mono">c₂ (along v₂)</span>
                            <input type="range" min={-3} max={3} step={0.1} value={c2} onChange={e => setC2(parseFloat(e.target.value))} className="mx-2" />
                            {c2.toFixed(1)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Diagonalization Lab</h3>
                    <p className="text-sm text-slate-600">Explore A = PDP⁻¹</p>
                </div>
                <button onClick={() => setIsFullscreen(true)} className="p-2 bg-slate-200 rounded hover:bg-slate-300"><Maximize2 size={18} /></button>
            </div>

            {/* Matrix Decomposition Display */}
            {!isComplex && (
                <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-slate-100 rounded-lg overflow-x-auto">
                    <MatrixBox title="A" matrix={matrix} color="bg-violet-50 border-violet-200" />
                    <span className="font-bold text-slate-400">=</span>
                    <MatrixBox title="P (Eigenvectors)" matrix={P} color="bg-blue-50 border-blue-200" />
                    <MatrixBox title="D (Eigenvalues)" matrix={D} color="bg-green-50 border-green-200" />
                    <MatrixBox title="P⁻¹" matrix={Pinv} color="bg-orange-50 border-orange-200" />
                </div>
            )}

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white border border-slate-200 rounded">
                    <h4 className="text-sm font-semibold mb-2">Coordinates in Eigenbasis</h4>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm">
                            <span className="w-6 text-blue-600 font-mono">c₁</span>
                            <input type="range" min={-3} max={3} step={0.1} value={c1} onChange={e => setC1(parseFloat(e.target.value))} className="flex-1 mx-2" />
                            <span className="w-8 text-right">{c1.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <span className="w-6 text-red-600 font-mono">c₂</span>
                            <input type="range" min={-3} max={3} step={0.1} value={c2} onChange={e => setC2(parseFloat(e.target.value))} className="flex-1 mx-2" />
                            <span className="w-8 text-right">{c2.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded">
                    <h4 className="text-sm font-semibold mb-2">Matrix Presets</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map(p => (
                            <button key={p.name} onClick={() => setMatrix(p.m)} className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700">
                                {p.name}
                            </button>
                        ))}
                    </div>
                    <label className="flex items-center gap-2 mt-3 text-sm">
                        <input type="checkbox" checked={showEigenGrid} onChange={e => setShowEigenGrid(e.target.checked)} />
                        Show Eigenbasis Grid
                    </label>
                </div>
            </div>

            {/* Viz */}
            <div className="h-[350px] bg-slate-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>{Viz}</Canvas>
            </div>

            <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                <p>When you define vector <span className="font-mono text-purple-600 font-bold">v</span> using coordinates <span className="font-mono text-blue-600">c₁</span> and <span className="font-mono text-red-600">c₂</span> along the eigenvectors, the transformation <span className="font-mono font-bold">Av</span> becomes simple scaling:</p>
                <div className="mt-2 text-center font-mono bg-white p-2 rounded border border-slate-200">
                    Av = <span className="text-blue-600">c₁</span>·<span className="text-green-600">λ₁</span>·v₁ + <span className="text-red-600">c₂</span>·<span className="text-green-600">λ₂</span>·v₂
                </div>
            </div>
        </div>
    );
}
