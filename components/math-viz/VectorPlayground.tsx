"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import katex from 'katex';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

// Math Helpers for 3D
const degToRad = (deg: number) => (deg * Math.PI) / 180;

function Arrow({ start, end, color, label }: { start: [number, number, number], end: [number, number, number], color: string, label?: string }) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const length = direction.length();

    if (length < 0.1) return null; // Too small to render

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={3} />
            {/* Cone at the end */}
            <mesh position={endVec} rotation={[0, 0, 0]} lookAt={() => endVec.clone().add(direction)}>
                <coneGeometry args={[0.1, 0.3, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text position={endVec.clone().add(new THREE.Vector3(0, 0.2, 0))} fontSize={0.3} color={color}>
                    {label}
                </Text>
            )}
        </group>
    );
}

export default function VectorPlayground() {
    // State for Vector V
    const [v, setV] = useState({ x: 1, y: 2, z: 0 });

    // State for Transformation T
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // Degrees
    const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });

    // Compute Transformed Vector T(v)
    const tV = useMemo(() => {
        const vec = new THREE.Vector3(v.x, v.y, v.z);

        // Apply Scale
        vec.multiply(new THREE.Vector3(scale.x, scale.y, scale.z));

        // Apply Rotation (Euler XYZ)
        const euler = new THREE.Euler(
            degToRad(rotation.x),
            degToRad(rotation.y),
            degToRad(rotation.z)
        );
        vec.applyEuler(euler);

        return vec;
    }, [v, rotation, scale]);

    const formulaHtml = useMemo(() => {
        return katex.renderToString(
            `T(\\vec{v}) = R \\cdot S \\cdot \\vec{v}`,
            { throwOnError: false }
        );
    }, []);

    const resetTransform = () => {
        setRotation({ x: 0, y: 0, z: 0 });
        setScale({ x: 1, y: 1, z: 1 });
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

            {/* Controls */}
            <div className="w-full md:w-1/3 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span>The Physics of Vectors</span>
                        <span className="text-sm font-normal text-slate-500 px-2 py-1 bg-slate-200 rounded-md">Chapter 1</span>
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: formulaHtml }} className="text-slate-600 mb-4" />
                    <p className="text-sm text-slate-600">
                        Define a vector <Latex>{'$\\vec{v}$'}</Latex> and apply linear transformations (Scale, Rotation). Observe how the new vector <Latex>{'$T(\\vec{v})$'}</Latex> changes in the vector space.
                    </p>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <h3 className="font-semibold text-slate-700">Vector <Latex>{'$\\vec{v}$'}</Latex></h3>
                    <div className="grid grid-cols-3 gap-2">
                        {(['x', 'y', 'z'] as const).map(axis => (
                            <label key={axis} className="flex flex-col">
                                <span className="text-xs text-slate-500 uppercase">{axis}</span>
                                <input
                                    type="number"
                                    value={v[axis]}
                                    onChange={e => setV({ ...v, [axis]: parseFloat(e.target.value) || 0 })}
                                    className="border rounded px-2 py-1 text-sm"
                                    step={0.5}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">Transformation <Latex>$T$</Latex></h3>
                        <button onClick={resetTransform} title="Reset Transform" className="text-slate-400 hover:text-indigo-600">
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    {/* Scaling */}
                    <div>
                        <span className="text-xs font-medium text-slate-500">Scale</span>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {(['x', 'y', 'z'] as const).map(axis => (
                                <label key={`s-${axis}`} className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase">{axis}</span>
                                    <input
                                        type="number"
                                        value={scale[axis]}
                                        onChange={e => setScale({ ...scale, [axis]: parseFloat(e.target.value) })}
                                        className="border rounded px-2 py-1 text-sm"
                                        step={0.1}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Rotation */}
                    <div>
                        <span className="text-xs font-medium text-slate-500">Rotation (Deg)</span>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                            {(['x', 'y', 'z'] as const).map(axis => (
                                <label key={`r-${axis}`} className="flex flex-col">
                                    <span className="text-[10px] text-slate-400 uppercase">{axis}</span>
                                    <input
                                        type="number"
                                        value={rotation[axis]}
                                        onChange={e => setRotation({ ...rotation, [axis]: parseFloat(e.target.value) || 0 })}
                                        className="border rounded px-2 py-1 text-sm"
                                        step={15}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 h-[500px] bg-slate-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                    <color attach="background" args={['#0f172a']} />
                    <OrbitControls makeDefault />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    {/* Grid and Axes */}
                    <Grid args={[10, 10]} cellSize={1} cellThickness={0.5} cellColor="#334155" sectionSize={5} sectionThickness={1} sectionColor="#475569" fadeDistance={20} />
                    <axesHelper args={[5]} />

                    {/* Vector v (Input) */}
                    <Arrow
                        start={[0, 0, 0]}
                        end={[v.x, v.y, v.z]}
                        color="#94a3b8" // Slate-400
                        label="v"
                    />

                    {/* Vector T(v) (Transformed) */}
                    <Arrow
                        start={[0, 0, 0]}
                        end={[tV.x, tV.y, tV.z]}
                        color="#818cf8" // Indigo-400
                        label="T(v)"
                    />

                    {/* Dashed line connecting v to T(v) for visual tracking */}
                    <Line points={[new THREE.Vector3(v.x, v.y, v.z), tV]} color="white" opacity={0.2} transparent dashed dashSize={0.2} gapSize={0.1} />

                </Canvas>

                <div className="absolute bottom-4 left-4 text-xs text-slate-400 pointer-events-none">
                    <p>Origin: (0,0,0)</p>
                    <p>Red: X, Green: Y, Blue: Z</p>
                    <p>Left Click: Rotate | Right Click: Pan | Scroll: Zoom</p>
                </div>
            </div>

        </div>
    );
}
