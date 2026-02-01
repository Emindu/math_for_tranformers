"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Box, Triangle, Hexagon } from 'lucide-react';

// Geometric shapes data
const SHAPES = {
    triangle: {
        sides: 3,
        name: "Equilateral Triangle (D₃)",
        vertices: [
            [0, 2],         // Top
            [1.732, -1],    // Bottom Right
            [-1.732, -1]    // Bottom Left
        ] as [number, number][],
        colors: ["#ef4444", "#22c55e", "#3b82f6"] // R, G, B
    },
    square: {
        sides: 4,
        name: "Square (D₄)",
        vertices: [
            [1.5, 1.5],   // TR
            [1.5, -1.5],  // BR
            [-1.5, -1.5], // BL
            [-1.5, 1.5]   // TL
        ] as [number, number][],
        colors: ["#ef4444", "#22c55e", "#3b82f6", "#eab308"] // R, G, B, Y
    }
};

type ShapeType = keyof typeof SHAPES;

function Polygon({ shape, rotation, scaleV, animating }: {
    shape: ShapeType,
    rotation: number,
    scaleV: [number, number],
    animating: boolean
}) {
    const meshRef = useRef<THREE.Group>(null);
    const data = SHAPES[shape];

    // Smooth animation
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Lerp rotation
            meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, rotation, delta * 5);
            // Lerp scale
            meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scaleV[0], delta * 5);
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scaleV[1], delta * 5);
        }
    });

    // Draw lines connecting vertices
    const points = [...data.vertices, data.vertices[0]].map(v => new THREE.Vector3(v[0], v[1], 0));

    return (
        <group ref={meshRef}>
            {/* Edges */}
            <Line points={points} color="#94a3b8" lineWidth={5} />

            {/* Fill area (transparent) */}
            <mesh>
                <shapeGeometry args={[(() => {
                    const s = new THREE.Shape();
                    s.moveTo(data.vertices[0][0], data.vertices[0][1]);
                    for (let i = 1; i < data.vertices.length; i++) s.lineTo(data.vertices[i][0], data.vertices[i][1]);
                    return s;
                })()]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>

            {/* Vertices */}
            {data.vertices.map((v, i) => (
                <group key={i} position={[v[0], v[1], 0.1]}>
                    <mesh>
                        <sphereGeometry args={[0.3, 32, 32]} />
                        <meshStandardMaterial color={data.colors[i]} />
                    </mesh>
                    <Text position={[0, 0, 0.4]} fontSize={0.3} color="white" fontWeight="bold">
                        {i + 1}
                    </Text>
                </group>
            ))}

            {/* Orientation Marker (F) */}
            <Text position={[0, 0, 0.1]} fontSize={1} color="#64748b" fillOpacity={0.5}>F</Text>
        </group>
    );
}

export default function SymmetryGroupLab() {
    const [shape, setShape] = useState<ShapeType>('square');
    const [targetRotation, setTargetRotation] = useState(0);
    const [targetScale, setTargetScale] = useState<[number, number]>([1, 1]);
    const [history, setHistory] = useState<string[]>(["Identity"]);
    const [animating, setAnimating] = useState(false);

    const reset = () => {
        setTargetRotation(0);
        setTargetScale([1, 1]);
        setHistory(["Identity"]);
    };

    const applyOperation = (op: string) => {
        setAnimating(true);
        let name = "";

        switch (op) {
            case 'rot90':
                setTargetRotation(r => r + Math.PI / 2);
                name = "Rotate 90°";
                break;
            case 'rot180':
                setTargetRotation(r => r + Math.PI);
                name = "Rotate 180°";
                break;
            case 'rot120':
                setTargetRotation(r => r + (2 * Math.PI / 3));
                name = "Rotate 120°";
                break;
            case 'flipX':
                setTargetScale(s => [-s[0], s[1]]); // Flip X
                name = "Flip Horizontal";
                break;
            case 'flipY':
                setTargetScale(s => [s[0], -s[1]]); // Flip Y
                name = "Flip Vertical";
                break;
        }

        setHistory(prev => [...prev.slice(-4), name]);

        // Reset animation flag after delay (approximate)
        setTimeout(() => setAnimating(false), 500);
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Symmetry Group Visualizer</h3>
                    <p className="text-sm text-slate-600">Explore the symmetries of {SHAPES[shape].name}</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setShape('triangle'); reset(); }}
                        className={`p-2 rounded ${shape === 'triangle' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200'} border`}
                    >
                        <Triangle size={20} />
                    </button>
                    <button
                        onClick={() => { setShape('square'); reset(); }}
                        className={`p-2 rounded ${shape === 'square' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200'} border`}
                    >
                        <Box size={20} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Controls */}
                <div className="md:w-64 space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-3 text-sm">Operations</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {/* Rotations */}
                            {shape === 'square' ? (
                                <>
                                    <button onClick={() => applyOperation('rot90')} className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium transition-colors text-left flex justify-between">
                                        Rotate 90° <span>r</span>
                                    </button>
                                    <button onClick={() => applyOperation('rot180')} className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium transition-colors text-left flex justify-between">
                                        Rotate 180° <span>r²</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => applyOperation('rot120')} className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium transition-colors text-left flex justify-between">
                                        Rotate 120° <span>r</span>
                                    </button>
                                </>
                            )}

                            {/* Reflections */}
                            <button onClick={() => applyOperation('flipX')} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium transition-colors text-left flex justify-between">
                                Flip Horizontal <span>h</span>
                            </button>
                            <button onClick={() => applyOperation('flipY')} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium transition-colors text-left flex justify-between">
                                Flip Vertical <span>v</span>
                            </button>

                            <div className="h-px bg-slate-200 my-2"></div>

                            <button onClick={reset} className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 text-sm font-medium transition-colors flex items-center gap-2 justify-center">
                                <RotateCcw size={14} /> Reset
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 mb-2 text-sm">Operation History</h4>
                        <ul className="text-sm space-y-1 text-slate-600 font-mono">
                            {history.map((op, i) => (
                                <li key={i} className={i === history.length - 1 ? "font-bold text-indigo-600" : ""}>
                                    {i}. {op}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 h-[400px] bg-slate-900 rounded-lg overflow-hidden relative border border-slate-800">
                    <div className="absolute top-4 left-4 text-white/50 text-xs z-10">
                        {shape === 'square' ? 'Group Order: 8' : 'Group Order: 6'}
                    </div>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <color attach="background" args={['#0f172a']} />
                        <OrbitControls makeDefault enableRotate={false} />
                        <ambientLight intensity={0.8} />
                        <pointLight position={[5, 5, 5]} intensity={0.5} />

                        <Polygon
                            shape={shape}
                            rotation={targetRotation}
                            scaleV={targetScale}
                            animating={animating}
                        />
                    </Canvas>
                </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded text-sm text-indigo-800">
                <p><strong>Observation:</strong> Notice how applying two operations in sequence results in another symmetry of the shape. This <strong>closure</strong> property is a fundamental axiom of Group Theory.</p>
            </div>
        </div>
    );
}
