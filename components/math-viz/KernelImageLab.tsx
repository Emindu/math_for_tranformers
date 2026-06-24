"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

function Arrow({ start, end, color, label, dashed = false }: { start: [number, number, number], end: [number, number, number], color: string, label?: string, dashed?: boolean }) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const length = new THREE.Vector3().subVectors(endVec, startVec).length();

    if (length < 0.05) return null;

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={3} dashed={dashed} dashSize={0.15} gapSize={0.1} />
            <mesh position={endVec}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text position={endVec.clone().add(new THREE.Vector3(0.15, 0.15, 0))} fontSize={0.2} color={color} outlineWidth={0.02} outlineColor="#000000">
                    {label}
                </Text>
            )}
        </group>
    );
}

// Apply 2x2 matrix to a 2D point
function applyMatrix(m: number[][], p: [number, number]): [number, number, number] {
    return [
        m[0][0] * p[0] + m[0][1] * p[1],
        m[1][0] * p[0] + m[1][1] * p[1],
        0
    ];
}

// Calculate rank and nullity for a 2x2 matrix
function calculateRankNullity(m: number[][]): { rank: number; nullity: number; kernelDir: [number, number] | null } {
    const det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
    const epsilon = 0.0001;

    if (Math.abs(det) > epsilon) {
        // Full rank (2), nullity 0, no kernel direction
        return { rank: 2, nullity: 0, kernelDir: null };
    }

    // Determinant is ~0, so rank <= 1
    // Check if entire matrix is zero
    const isZero = Math.abs(m[0][0]) < epsilon && Math.abs(m[0][1]) < epsilon &&
        Math.abs(m[1][0]) < epsilon && Math.abs(m[1][1]) < epsilon;

    if (isZero) {
        return { rank: 0, nullity: 2, kernelDir: [1, 0] }; // Entire plane is kernel
    }

    // Rank 1: find kernel direction (null space)
    // Kernel is solutions to Ax = 0
    // For a 2x2 singular matrix, kernel is perpendicular to non-zero row
    let kernelDir: [number, number];
    if (Math.abs(m[0][0]) > epsilon || Math.abs(m[0][1]) > epsilon) {
        // Use first row: [a, b] -> kernel is [-b, a] (normalized)
        kernelDir = [-m[0][1], m[0][0]];
    } else {
        // Use second row
        kernelDir = [-m[1][1], m[1][0]];
    }

    // Normalize
    const len = Math.sqrt(kernelDir[0] ** 2 + kernelDir[1] ** 2);
    if (len > epsilon) {
        kernelDir = [kernelDir[0] / len, kernelDir[1] / len];
    }

    return { rank: 1, nullity: 1, kernelDir };
}

export default function KernelImageLab() {
    const [matrix, setMatrix] = useState<number[][]>([
        [1, 0],
        [0, 0]
    ]);

    const presets: { name: string, m: number[][], desc: string }[] = [
        { name: 'Rank 2', m: [[1, 0], [0, 1]], desc: 'Full rank, no kernel' },
        { name: 'Rank 1 (Proj X)', m: [[1, 0], [0, 0]], desc: 'Projects onto X-axis' },
        { name: 'Rank 1 (Proj Y)', m: [[0, 0], [0, 1]], desc: 'Projects onto Y-axis' },
        { name: 'Rank 1 (Line)', m: [[1, 1], [1, 1]], desc: 'Projects onto y=x line' },
        { name: 'Rank 0', m: [[0, 0], [0, 0]], desc: 'Zero matrix' },
    ];

    const { rank, nullity, kernelDir } = useMemo(() => calculateRankNullity(matrix), [matrix]);

    // Standard basis
    const e1: [number, number] = [1, 0];
    const e2: [number, number] = [0, 1];

    // Transformed basis (Image)
    const te1 = applyMatrix(matrix, e1);
    const te2 = applyMatrix(matrix, e2);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 relative z-10">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Kernel & Image Lab</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Explore the <Latex>{'$\\ker(T)$'}</Latex> and <Latex>{'$\\text{Im}(T)$'}</Latex> of a linear transformation.
                    </p>
                </div>

                {/* Matrix Input */}
                <div className="space-y-3 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm border-b pb-2">Matrix <Latex>{'$[T]$'}</Latex></h4>
                    <div className="grid grid-cols-2 gap-2">
                        {[0, 1].map(row => (
                            [0, 1].map(col => (
                                <input
                                    key={`m-${row}-${col}`}
                                    type="number"
                                    value={matrix[row][col]}
                                    onChange={e => {
                                        const newM = matrix.map(r => [...r]);
                                        newM[row][col] = parseFloat(e.target.value) || 0;
                                        setMatrix(newM);
                                    }}
                                    className="w-full border rounded px-2 py-1 text-center text-sm font-mono"
                                    step={0.5}
                                />
                            ))
                        ))}
                    </div>
                </div>

                {/* Presets */}
                <div className="space-y-2 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm border-b pb-2">Presets</h4>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => setMatrix(preset.m)}
                                className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition-colors"
                                title={preset.desc}
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rank-Nullity Info */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 text-sm mb-3">Rank-Nullity Theorem</h4>
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                            <p className="text-xs text-slate-500">dim(V)</p>
                            <p className="text-xl font-bold text-slate-800">2</p>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-2 shadow-sm">
                            <p className="text-xs text-blue-600">rank(T)</p>
                            <p className="text-xl font-bold text-blue-700">{rank}</p>
                        </div>
                        <div className="bg-orange-100 rounded-lg p-2 shadow-sm">
                            <p className="text-xs text-orange-600">nullity(T)</p>
                            <p className="text-xl font-bold text-orange-700">{nullity}</p>
                        </div>
                    </div>
                    <p className="text-xs text-center text-indigo-700 font-mono">
                        2 = {rank} + {nullity} ✓
                    </p>
                </div>
            </div>

            {/* Right Column: Viz + Calculation Steps */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="h-[280px] bg-white rounded-lg overflow-hidden relative border border-slate-200">
                    <Canvas camera={{ position: [0, 0, 4], fov: 55 }} dpr={[1, 2]} gl={{ antialias: true }}>
                        <color attach="background" args={['#ffffff']} />
                        <OrbitControls makeDefault />
                        <ambientLight intensity={0.85} />
                        <directionalLight position={[5, 8, 5]} intensity={0.7} />
                        <hemisphereLight args={['#ffffff', '#e2e8f0', 0.5]} />

                        <Grid args={[10, 10]} cellSize={1} cellThickness={0.5} cellColor="#e2e8f0" sectionSize={5} sectionThickness={1} sectionColor="#cbd5e1" fadeDistance={20} />

                        {/* Original Basis (Domain) */}
                        <Arrow start={[0, 0, 0]} end={[1, 0, 0]} color="#64748b" label="e₁" dashed />
                        <Arrow start={[0, 0, 0]} end={[0, 1, 0]} color="#64748b" label="e₂" dashed />

                        {/* Transformed Basis (Image) */}
                        <Arrow start={[0, 0, 0]} end={te1} color="#3b82f6" label="T(e₁)" />
                        <Arrow start={[0, 0, 0]} end={te2} color="#ef4444" label="T(e₂)" />

                        {/* Kernel Direction */}
                        {kernelDir && (
                            <>
                                <Line
                                    points={[
                                        new THREE.Vector3(-kernelDir[0] * 3, -kernelDir[1] * 3, 0),
                                        new THREE.Vector3(kernelDir[0] * 3, kernelDir[1] * 3, 0)
                                    ]}
                                    color="#f97316"
                                    lineWidth={4}
                                />
                                <Text position={[kernelDir[0] * 2.5, kernelDir[1] * 2.5 + 0.3, 0]} fontSize={0.25} color="#f97316" outlineWidth={0.02} outlineColor="#000000">
                                    ker(T)
                                </Text>
                            </>
                        )}

                        {/* Legend */}
                        <Text position={[-2.5, 2.2, 0]} fontSize={0.18} color="#64748b" anchorX="left">
                            Dashed: Domain basis
                        </Text>
                        <Text position={[-2.5, 1.9, 0]} fontSize={0.18} color="#3b82f6" anchorX="left">
                            Blue/Red: Image
                        </Text>
                        {kernelDir && (
                            <Text position={[-2.5, 1.6, 0]} fontSize={0.18} color="#f97316" anchorX="left">
                                Orange: Kernel
                            </Text>
                        )}
                    </Canvas>
                </div>

                {/* Calculation Steps - Right Column */}
                <div className="p-4 bg-white rounded-lg border border-slate-200 text-sm space-y-3 flex-1">
                    <h4 className="font-semibold text-slate-700 text-base border-b pb-2">Calculation Steps</h4>

                    <div className="space-y-1">
                        <p className="text-slate-600">
                            <strong>Step 1:</strong> Compute determinant
                        </p>
                        <p className="font-mono text-slate-800 bg-slate-50 p-2 rounded">
                            det([T]) = ({matrix[0][0]})({matrix[1][1]}) - ({matrix[0][1]})({matrix[1][0]}) = {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-slate-600">
                            <strong>Step 2:</strong> Determine rank
                        </p>
                        <p className="font-mono text-slate-800 bg-slate-50 p-2 rounded">
                            {Math.abs(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) > 0.0001
                                ? "det ≠ 0 → Matrix is invertible → rank = 2"
                                : (Math.abs(matrix[0][0]) < 0.0001 && Math.abs(matrix[0][1]) < 0.0001 && Math.abs(matrix[1][0]) < 0.0001 && Math.abs(matrix[1][1]) < 0.0001)
                                    ? "Matrix is zero → rank = 0"
                                    : "det = 0, but matrix ≠ 0 → rank = 1"
                            }
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-slate-600">
                            <strong>Step 3:</strong> Apply Rank-Nullity Theorem
                        </p>
                        <p className="font-mono text-slate-800 bg-slate-50 p-2 rounded">
                            nullity(T) = dim(V) - rank(T) = 2 - {rank} = {nullity}
                        </p>
                    </div>

                    {kernelDir && (
                        <div className="space-y-1">
                            <p className="text-slate-600">
                                <strong>Kernel Direction:</strong>
                            </p>
                            <p className="font-mono text-orange-600 bg-orange-50 p-2 rounded">
                                ker(T) = span({'{'} ({kernelDir[0].toFixed(2)}, {kernelDir[1].toFixed(2)}) {'}'})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
