"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line, Plane } from '@react-three/drei';
import * as THREE from 'three';
import Late from 'react-latex-next'; // Fixed import name for consistency with usage
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { addVectors, scaleVector } from '@/lib/math-utils';

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

export default function SubspaceBasisLab() {
    // Basis Vectors
    const [v1, setV1] = useState<[number, number, number]>([2, 0, 0]);
    const [v2, setV2] = useState<[number, number, number]>([0, 2, 0]);

    // Coefficients
    const [c1, setC1] = useState(1);
    const [c2, setC2] = useState(1);

    // Calculated Point
    const p = useMemo(() => {
        const term1 = scaleVector(v1, c1);
        const term2 = scaleVector(v2, c2);
        return addVectors(term1, term2) as [number, number, number];
    }, [v1, v2, c1, c2]);

    // Determine Plane
    const planeData = useMemo(() => {
        const vec1 = new THREE.Vector3(...v1);
        const vec2 = new THREE.Vector3(...v2);
        const normal = new THREE.Vector3().crossVectors(vec1, vec2).normalize();

        // Quat to rotate plane from default (0,0,1) to normal
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

        // Check for collinearity (cross product approx 0)
        const isCollinear = vec1.clone().cross(vec2).length() < 0.01;

        return { quaternion, isCollinear };
    }, [v1, v2]);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 mt-8 relative z-10">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Subspace & Basis Lab</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Adjust basis vectors <Latex>{'$\\vec{v_1}, \\vec{v_2}$'}</Latex> to define a subspace (plane).
                        Change coefficients <Latex>{'$c_1, c_2$'}</Latex> to explore the span.
                    </p>
                </div>

                {/* Basis Vector Controls */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">Basis Vectors</h4>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 mb-1 block">Vector <Latex>{'$\\vec{v_1}$'}</Latex> (Blue)</span>
                            <div className="grid grid-cols-3 gap-2">
                                {([0, 1, 2] as const).map(i => (
                                    <input
                                        key={`v1-${i}`}
                                        type="number"
                                        value={v1[i]}
                                        onChange={e => {
                                            const newV = [...v1] as [number, number, number];
                                            newV[i] = parseFloat(e.target.value) || 0;
                                            setV1(newV);
                                        }}
                                        className="w-full border rounded px-1 text-xs py-1"
                                        step={0.5}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-red-600 mb-1 block">Vector <Latex>{'$\\vec{v_2}$'}</Latex> (Red)</span>
                            <div className="grid grid-cols-3 gap-2">
                                {([0, 1, 2] as const).map(i => (
                                    <input
                                        key={`v2-${i}`}
                                        type="number"
                                        value={v2[i]}
                                        onChange={e => {
                                            const newV = [...v2] as [number, number, number];
                                            newV[i] = parseFloat(e.target.value) || 0;
                                            setV2(newV);
                                        }}
                                        className="w-full border rounded px-1 text-xs py-1"
                                        step={0.5}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coefficient Controls */}
                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 border-b pb-2 mb-2">Linear Combination</h4>

                    <div>
                        <span className="text-xs font-bold text-purple-600 mb-1 block">
                            <Latex>{'$\\vec{p} = c_1\\vec{v_1} + c_2\\vec{v_2}$'}</Latex>
                        </span>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-slate-500 w-6">c1</span>
                                <input
                                    type="range" min="-3" max="3" step="0.1"
                                    value={c1} onChange={e => setC1(parseFloat(e.target.value))}
                                    className="flex-1"
                                />
                                <span className="text-sm font-mono w-8 text-right">{c1.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-slate-500 w-6">c2</span>
                                <input
                                    type="range" min="-3" max="3" step="0.1"
                                    value={c2} onChange={e => setC2(parseFloat(e.target.value))}
                                    className="flex-1"
                                />
                                <span className="text-sm font-mono w-8 text-right">{c2.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Viz */}
            <div className="flex-1 h-[500px] bg-white rounded-lg overflow-hidden relative border border-slate-200">
                <Canvas camera={{ position: [5, 5, 8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
                    <color attach="background" args={['#ffffff']} />
                    <OrbitControls makeDefault />
                    <ambientLight intensity={0.85} />
                    <directionalLight position={[5, 8, 5]} intensity={0.7} />
                    <hemisphereLight args={['#ffffff', '#e2e8f0', 0.5]} />

                    <Grid args={[10, 10]} cellSize={1} cellThickness={0.6} cellColor="#e2e8f0" sectionSize={5} sectionThickness={1.1} sectionColor="#cbd5e1" fadeDistance={28} />
                    <axesHelper args={[5]} />
                    <Text position={[5.3, 0, 0]} fontSize={0.3} color="#ef4444">X</Text>
                    <Text position={[0, 5.3, 0]} fontSize={0.3} color="#16a34a">Y</Text>
                    <Text position={[0, 0, 5.3]} fontSize={0.3} color="#2563eb">Z</Text>

                    {/* Subspace Plane */}
                    {!planeData.isCollinear && (
                        <Plane
                            args={[20, 20]}
                            quaternion={planeData.quaternion}
                        >
                            <meshStandardMaterial color="#3b82f6" transparent opacity={0.18} side={THREE.DoubleSide} />
                        </Plane>
                    )}

                    {/* Basis Vectors */}
                    <Arrow start={[0, 0, 0]} end={v1} color="#2563eb" label="v1" />
                    <Arrow start={[0, 0, 0]} end={v2} color="#dc2626" label="v2" />

                    {/* Resultant Point */}
                    <Arrow start={[0, 0, 0]} end={p} color="#9333ea" label="p" />

                    {/* Guide Lines */}
                    <Line points={[new THREE.Vector3(...v1).multiplyScalar(c1), new THREE.Vector3(...p)]} color="#dc2626" opacity={0.3} transparent dashed dashSize={0.2} gapSize={0.1} />
                    <Line points={[new THREE.Vector3(...v2).multiplyScalar(c2), new THREE.Vector3(...p)]} color="#2563eb" opacity={0.3} transparent dashed dashSize={0.2} gapSize={0.1} />

                </Canvas>
                <div className="absolute bottom-4 left-4 text-xs text-slate-600 pointer-events-none rounded-md bg-white/80 px-2 py-1 shadow-sm backdrop-blur">
                    <p>
                        {planeData.isCollinear
                            ? <span className="text-orange-600 font-bold">Vectors are collinear! Subspace collapses to a line.</span>
                            : "Blue plane represents the subspace spanned by v1 and v2."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
