"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import { Network, Eye, EyeOff, Info } from 'lucide-react';

const targetFunction = (x: number, y: number) => {
    const d = Math.sqrt(x * x + y * y);
    return Math.sin(d) + 0.5 * Math.cos(x) * Math.sin(y);
};

function FunctionSurface({ func, color, wireframe, opacity, visible, yOffset = 0 }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const size = 10;
    const resolution = 100; // Higher resolution for smoother target and sharper steps

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
        const posAttribute = geo.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < posAttribute.count; i++) {
            v.fromBufferAttribute(posAttribute, i);
            const z = func(v.x, v.y);
            posAttribute.setZ(i, z + yOffset);
        }
        geo.computeVertexNormals();
        return geo;
    }, [func, yOffset]);

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

export default function UniversalApproximationLab() {
    // Number of neurons N
    const [neurons, setNeurons] = useState(16);
    const [showTarget, setShowTarget] = useState(true);
    const [showAppx, setShowAppx] = useState(true);

    const domainSize = 10;

    const approxFunction = useMemo(() => {
        // Constructive proof of UA theorem often uses "bump" functions constructed from ReLUs.
        // A bump function can be created using 4 ReLUs in 1D, or more in 2D.
        // We approximate the function as a piecewise constant function over a grid.
        // If we have N neurons, we can form roughly sqrt(N)/4 grid cells per dimension.
        return (x: number, y: number) => {
            // Number of grid divisions per axis
            const K = Math.max(1, Math.floor(Math.sqrt(Math.max(1, neurons) / 4)));

            // To prevent K=0 issues and handle the 1-neuron case gracefully
            if (K <= 1) {
                return targetFunction(0, 0); // Flat approximation
            }

            const step = domainSize / K;
            // Quantize coordinates to the center of each cell
            const qx = Math.round(x / step) * step;
            const qy = Math.round(y / step) * step;

            return targetFunction(qx, qy);
        };
    }, [neurons, domainSize]);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-8 mb-8">
            <div className="flex items-center gap-2">
                <Network className="text-teal-600" size={24} />
                <h3 className="text-xl font-bold text-slate-800">3D Interactive Lab: Neural Network Capacity</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                This visualization demonstrates how a continuous target function (the smooth surface) can be approximated by combining discrete "bump" functions (the blocky surface), achievable by a shallow neural network with ReLU activations. Increasing the number of neurons allows for finer localized bumps, reducing the approximation error.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* 3D Canvas */}
                <div className="flex-grow bg-slate-900 rounded-xl overflow-hidden shadow-inner relative" style={{ height: "500px" }}>
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <button
                            onClick={() => setShowTarget(!showTarget)}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${showTarget ? 'bg-slate-700 text-slate-200' : 'bg-slate-800/50 text-slate-500'}`}
                        >
                            {showTarget ? <Eye size={14} /> : <EyeOff size={14} />} {showTarget ? 'Hide' : 'Show'} Target
                        </button>
                        <button
                            onClick={() => setShowAppx(!showAppx)}
                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors ${showAppx ? 'bg-teal-700 text-teal-100' : 'bg-slate-800/50 text-slate-500'}`}
                        >
                            {showAppx ? <Eye size={14} /> : <EyeOff size={14} />} {showAppx ? 'Hide' : 'Show'} Appx
                        </button>
                    </div>

                    <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <directionalLight position={[-10, 10, -5]} intensity={1} color="#0d9488" />

                        <gridHelper args={[10, 10, 0x475569, 0x1e293b]} position={[0, -2, 0]} />

                        <FunctionSurface
                            func={targetFunction}
                            color="#94a3b8"
                            wireframe={true}
                            opacity={0.3}
                            visible={showTarget}
                        />

                        <FunctionSurface
                            func={approxFunction}
                            color="#14b8a6"
                            wireframe={false}
                            opacity={0.9}
                            visible={showAppx}
                        />

                        <OrbitControls enableDamping dampingFactor={0.05} autoRotate={showAppx && showTarget} autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

                {/* Controls */}
                <div className="w-full lg:w-80 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                Hidden Layer Neurons (<Latex>{'$N$'}</Latex>)
                            </label>
                            <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded shadow-inner border border-teal-100 text-lg">
                                {neurons}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={4}
                            max={1600}
                            step={16}
                            value={neurons}
                            onChange={(e) => setNeurons(parseInt(e.target.value))}
                            className="w-full accent-teal-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                            <span>Underfit</span>
                            <span>Optimal Fit</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col gap-3">
                        <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                            <Info size={16} className="text-teal-600" /> Mathematical Intuition
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            A classic proof of the <strong className="text-slate-800">Universal Approximation Theorem</strong> shows that we can combine multiple ReLU functions to create localized "bump" functions (like a 3D pixel or voxel).
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Each cell you see in the approximation represents a region where the network outputs a constant value. To increase the resolution of this grid (adding more smaller cells), the network requires more hidden units (neurons).
                        </p>
                        <div className="mt-2 bg-white border border-slate-100 p-2 rounded text-center shadow-sm">
                            <Latex>{'$\\text{Grid Resolution} \\sim O(\\sqrt{N})$'}</Latex>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
