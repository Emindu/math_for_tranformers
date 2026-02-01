"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line, Plane } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

function Arrow({ start, end, color, label }: { start: [number, number, number], end: [number, number, number], color: string, label?: string }) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();

    if (length < 0.1) return null;

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={3} />
            <mesh position={endVec}>
                <coneGeometry args={[0.08, 0.25, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text position={endVec.clone().add(new THREE.Vector3(0, 0.2, 0))} fontSize={0.25} color={color} outlineWidth={0.02} outlineColor="#000000">
                    {label}
                </Text>
            )}
        </group>
    );
}

// Apply 2x2 matrix to a 2D point (z=0)
function applyMatrix(m: number[][], p: [number, number]): [number, number, number] {
    return [
        m[0][0] * p[0] + m[0][1] * p[1],
        m[1][0] * p[0] + m[1][1] * p[1],
        0
    ];
}

export default function LinearTransformationLab() {
    // Transformation Matrix (2x2)
    const [matrix, setMatrix] = useState<number[][]>([
        [1, 0],
        [0, 1]
    ]);

    // Presets
    const presets: { name: string, m: number[][] }[] = [
        { name: 'Identity', m: [[1, 0], [0, 1]] },
        { name: 'Rotation 45°', m: [[0.707, -0.707], [0.707, 0.707]] },
        { name: 'Rotation 90°', m: [[0, -1], [1, 0]] },
        { name: 'Shear X', m: [[1, 0.5], [0, 1]] },
        { name: 'Shear Y', m: [[1, 0], [0.5, 1]] },
        { name: 'Scale 2x', m: [[2, 0], [0, 2]] },
        { name: 'Reflection Y', m: [[-1, 0], [0, 1]] },
    ];

    // Generate grid points
    const gridPoints = useMemo(() => {
        const points: [number, number][] = [];
        for (let x = -2; x <= 2; x += 1) {
            for (let y = -2; y <= 2; y += 1) {
                points.push([x, y]);
            }
        }
        return points;
    }, []);

    // Transformed grid points
    const transformedPoints = useMemo(() => {
        return gridPoints.map(p => applyMatrix(matrix, p));
    }, [gridPoints, matrix]);

    // Basis vectors
    const e1: [number, number] = [1, 0];
    const e2: [number, number] = [0, 1];
    const te1 = applyMatrix(matrix, e1);
    const te2 = applyMatrix(matrix, e2);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 mt-8 relative z-10">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Linear Transformation Lab</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Explore how a 2x2 matrix transforms <Latex>{'$\\mathbb{R}^2$'}</Latex>. Adjust the matrix or use presets.
                    </p>
                </div>

                {/* Matrix Input */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">Transformation Matrix <Latex>{'$[T]$'}</Latex></h4>

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
                                    step={0.1}
                                />
                            ))
                        ))}
                    </div>
                </div>

                {/* Presets */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">Presets</h4>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => setMatrix(preset.m)}
                                className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm text-indigo-800">
                    <p><strong>Determinant:</strong> {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2)}</p>
                    <p className="mt-1 text-xs text-slate-500">A determinant of 0 means the transformation collapses the plane.</p>
                </div>
            </div>

            {/* Viz */}
            <div className="flex-1 h-[500px] bg-slate-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <color attach="background" args={['#0f172a']} />
                    <OrbitControls makeDefault />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <Grid args={[10, 10]} cellSize={1} cellThickness={0.5} cellColor="#334155" sectionSize={5} sectionThickness={1} sectionColor="#475569" fadeDistance={25} />

                    {/* Original Basis Vectors (dashed) */}
                    <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0)]} color="#64748b" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
                    <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0)]} color="#64748b" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />

                    {/* Transformed Basis Vectors */}
                    <Arrow start={[0, 0, 0]} end={te1} color="#3b82f6" label="T(e1)" />
                    <Arrow start={[0, 0, 0]} end={te2} color="#ef4444" label="T(e2)" />

                    {/* Transformed Grid Points */}
                    {transformedPoints.map((p, i) => (
                        <mesh key={i} position={p}>
                            <sphereGeometry args={[0.05, 16, 16]} />
                            <meshStandardMaterial color="#a855f7" />
                        </mesh>
                    ))}

                </Canvas>
                <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
                    <p><span className="text-blue-400">Blue: T(e1)</span>, <span className="text-red-400">Red: T(e2)</span>, <span className="text-purple-400">Purple dots: Transformed grid</span></p>
                </div>
            </div>
        </div>
    );
}
