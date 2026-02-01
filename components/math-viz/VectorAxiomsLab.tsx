"use client";

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import katex from 'katex';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { addVectors, scaleVector } from '@/lib/math-utils';
import { RefreshCw } from 'lucide-react';

function Arrow({ start, end, color, label }: { start: [number, number, number], end: [number, number, number], color: string, label?: string }) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();

    if (length < 0.1) return null;

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={3} />
            <mesh position={endVec} rotation={[0, 0, 0]} lookAt={() => endVec.clone().add(direction)}>
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

export default function VectorAxiomsLab() {
    const [u, setU] = useState<[number, number, number]>([2, 1, 0]);
    const [v, setV] = useState<[number, number, number]>([1, 2, 0]);
    const [scalar, setScalar] = useState(1.5);
    const [showCommutativity, setShowCommutativity] = useState(false);

    // Computed vectors
    const uPlusV = addVectors(u, v) as [number, number, number];
    const vPlusU = addVectors(v, u) as [number, number, number]; // Same as uPlusV
    const scalarU = scaleVector(u, scalar) as [number, number, number];

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Vector Axioms Lab</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Explore <strong>Closure under Addition</strong> and <strong>Scalar Multiplication</strong> visually.
                    </p>
                </div>

                {/* Arithmetic Controls */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">1. Vector Addition</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 mb-1 block">Vector <Latex>{"$\\vec{u}$"}</Latex></span>
                            {([0, 1, 2] as const).map(i => (
                                <div key={`u-${i}`} className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-slate-400 w-3">{['x', 'y', 'z'][i]}</span>
                                    <input
                                        type="number"
                                        value={u[i]}
                                        onChange={e => {
                                            const newU = [...u] as [number, number, number];
                                            newU[i] = parseFloat(e.target.value) || 0;
                                            setU(newU);
                                        }}
                                        className="w-full border rounded px-1 text-xs py-1"
                                        step={0.5}
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-rose-600 mb-1 block">Vector <Latex>{"$\\vec{v}$"}</Latex></span>
                            {([0, 1, 2] as const).map(i => (
                                <div key={`v-${i}`} className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-slate-400 w-3">{['x', 'y', 'z'][i]}</span>
                                    <input
                                        type="number"
                                        value={v[i]}
                                        onChange={e => {
                                            const newV = [...v] as [number, number, number];
                                            newV[i] = parseFloat(e.target.value) || 0;
                                            setV(newV);
                                        }}
                                        className="w-full border rounded px-1 text-xs py-1"
                                        step={0.5}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-2">
                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showCommutativity}
                                onChange={e => setShowCommutativity(e.target.checked)}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            Show Commutativity (<Latex>{'$\\vec{v} + \\vec{u}$'}</Latex>)
                        </label>
                    </div>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">2. Scalar Multiplication</h4>
                    <div>
                        <span className="text-xs font-bold text-emerald-600 mb-1 block">Scalar <Latex>{'$\\alpha$'}</Latex></span>
                        <div className="flex items-center gap-2">
                            <input
                                type="range"
                                min="-2"
                                max="3"
                                step="0.1"
                                value={scalar}
                                onChange={e => setScalar(parseFloat(e.target.value))}
                                className="w-full"
                            />
                            <span className="text-sm font-mono w-10 text-right">{scalar.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Viz */}
            <div className="flex-1 h-[500px] bg-slate-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [5, 5, 8], fov: 45 }}>
                    <color attach="background" args={['#0f172a']} />
                    <OrbitControls makeDefault />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <Grid args={[10, 10]} cellSize={1} cellThickness={0.5} cellColor="#334155" sectionSize={5} sectionThickness={1} sectionColor="#475569" fadeDistance={25} />
                    <axesHelper args={[5]} />

                    {/* u */}
                    <Arrow start={[0, 0, 0]} end={u} color="#4f46e5" label="u" />

                    {/* v (placed at origin) */}
                    <Arrow start={[0, 0, 0]} end={v} color="#e11d48" label="v" />

                    {/* u + v (Resultant) */}
                    <Arrow start={[0, 0, 0]} end={uPlusV} color="#a855f7" label="u+v" />

                    {/* Visualizing Addition: Show v starting from tip of u */}
                    <Line points={[new THREE.Vector3(...u), new THREE.Vector3(...uPlusV)]} color="#e11d48" opacity={0.5} transparent dashed dashSize={0.2} gapSize={0.1} />

                    {/* Commutativity: Show u starting from tip of v */}
                    {showCommutativity && (
                        <Line points={[new THREE.Vector3(...v), new THREE.Vector3(...vPlusU)]} color="#4f46e5" opacity={0.5} transparent dashed dashSize={0.2} gapSize={0.1} />
                    )}

                    {/* Scalar Multiplication: alpha * u */}
                    {/* Offset slightly so it doesn't overlap exactly if alpha=1 */}
                    <group position={[0.05, 0.05, 0.05]}>
                        <Arrow start={[0, 0, 0]} end={scalarU} color="#10b981" label="αu" />
                    </group>

                </Canvas>
                <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
                    <p><span className="text-indigo-400">Blue: u</span>, <span className="text-rose-400">Red: v</span>, <span className="text-purple-400">Purple: u+v</span>, <span className="text-emerald-400">Green: αu</span></p>
                </div>
            </div>
        </div>
    );
}
