"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import { ScanFace, Activity } from 'lucide-react';

// Generates the geometry for a given mathematical function
function Surface({ func, color, wireframe, opacity, visible }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const size = 10;
    const resolution = 40; // Enough for smooth relu bends

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
        const posAttribute = geo.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < posAttribute.count; i++) {
            v.fromBufferAttribute(posAttribute, i);
            const z = func(v.x, v.y);
            posAttribute.setZ(i, z);
        }
        geo.computeVertexNormals();
        return geo;
    }, [func]);

    if (!visible) return null;

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} geometry={geometry}>
            {wireframe ? (
                <meshBasicMaterial color={color} wireframe={true} transparent opacity={opacity} />
            ) : (
                <meshStandardMaterial
                    color={color}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={opacity}
                    roughness={0.2}
                    metalness={0.1}
                />
            )}
        </mesh>
    );
}

export default function NonLinearityRoleLab() {
    const [useActivation, setUseActivation] = useState(true);
    const [layers, setLayers] = useState(3);

    // Simulated target function: A bowl shape (non-linear)
    const targetFunction = (x: number, y: number) => {
        return (x * x + y * y) * 0.1 - 2;
    };

    // Simulated Approximation Function based on toggles
    const approxFunction = useMemo(() => {
        return (x: number, y: number) => {
            // Layer 1 transformation
            let h1_x = x * 0.8 + y * 0.2;
            let h1_y = x * -0.2 + y * 0.9 + 1.0;

            if (useActivation && layers >= 1) {
                h1_x = Math.max(0, h1_x); // ReLU
                h1_y = Math.max(0, h1_y);
            }

            // Layer 2 transformation
            let h2_x = h1_x * 0.5 - h1_y * 0.8;
            let h2_y = h1_x * 0.8 + h1_y * 0.5 - 2.0;

            if (useActivation && layers >= 2) {
                h2_x = Math.max(0, h2_x);
                h2_y = Math.max(0, h2_y);
            }

            // Layer 3 transformation
            let h3_x = h2_x * 0.9 + h2_y * 0.1;
            let h3_y = h2_x * -0.1 + h2_y * 0.9 - 1.0;

            if (useActivation && layers >= 3) {
                h3_x = Math.max(0, h3_x);
                h3_y = Math.max(0, h3_y);
            }

            // Output projection (collapse to Z based on layers)
            let out_z = 0;
            if (layers === 1) out_z = (h1_x + h1_y) * 0.5;
            if (layers === 2) out_z = (h2_x + h2_y) * 0.5;
            if (layers === 3) out_z = (h3_x + h3_y) * 0.5;

            // If completely linear (no activation), the result is mathematically guaranteed to be a flat plane.
            // If activation is on, it forms a piecewise linear approximation of curves.
            return out_z;
        };
    }, [useActivation, layers]);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-8 mb-8">
            <div className="flex items-center gap-2">
                <ScanFace className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-slate-800">3D Lab: Role of Non-Linearities</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Explore why activation functions (like ReLU) are critical. The grey wireframe is a non-linear target surface. Notice how stacking multiple layers <strong>without</strong> an activation function just results in a flat plane (Linear Collapse). Turning <strong>Activation ON</strong> allows the network to bend and fold the 3D space to wrap around the target.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Controls */}
                <div className="w-full lg:w-80 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 order-2 lg:order-1">

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-purple-800 uppercase tracking-widest">Network Architecture</span>
                        </div>
                        <div className="text-xl font-mono text-purple-700 font-bold mt-2">
                            {layers} Layer(s),
                            <span className={useActivation ? "text-emerald-600 ml-2" : "text-rose-600 ml-2"}>
                                {useActivation ? "Non-Linear" : "Linear"}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Activity size={16} className={useActivation ? "text-emerald-500" : "text-slate-400"} />
                                ReLU Activation
                            </label>
                            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Apply max(0, x) at each layer.</p>
                        </div>

                        <button
                            onClick={() => setUseActivation(!useActivation)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useActivation ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useActivation ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700">Stack Layers</label>
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-sm">
                                {layers}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={1}
                            value={layers}
                            onChange={(e) => setLayers(parseInt(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight text-center">
                            {useActivation ? "More layers = more folds" : "More layers = still a flat plane"}
                        </p>
                    </div>

                </div>

                {/* 3D Canvas */}
                <div className="flex-grow bg-slate-900 rounded-xl overflow-hidden shadow-inner relative order-1 lg:order-2" style={{ height: "450px" }}>

                    {/* Legend Overlay */}
                    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <span className="text-xs text-slate-300 font-mono">Non-Linear Target</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-xs text-white font-mono font-bold">Network Surface</span>
                        </div>
                    </div>

                    <Canvas camera={{ position: [8, 4, 8], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#a855f7" />

                        <gridHelper args={[10, 10, 0x475569, 0x1e293b]} position={[0, -4, 0]} />

                        <Surface
                            func={targetFunction}
                            color="#94a3b8"
                            wireframe={true}
                            opacity={0.3}
                            visible={true}
                        />

                        <Surface
                            func={approxFunction}
                            color={!useActivation ? "#ef4444" : "#a855f7"}
                            wireframe={false}
                            opacity={0.9}
                            visible={true}
                        />

                        <OrbitControls enableDamping dampingFactor={0.05} autoRotate={true} autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

            </div>
        </div>
    );
}
