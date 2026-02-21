"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import { Layers, Network, Activity } from 'lucide-react';

// The "Highly Oscillatory" target function to approximate.
// Shallow networks struggle to approximate high frequencies efficiently (Telgarsky's Theorem).
const targetFunction = (x: number, y: number) => {
    const d = Math.sqrt(x * x + y * y);
    // Base shape + high frequency ripples
    return Math.sin(d) + 0.3 * Math.sin(5 * x) * Math.cos(5 * y);
};

// Generates the geometry for a given mathematical function
function Surface({ func, color, wireframe, opacity, visible }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const size = 10;
    const resolution = 150; // High resolution for ripples

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

export default function TransformerExpressivityLab() {
    const [depth, setDepth] = useState(1);
    const [width, setWidth] = useState(10);
    const [viewMode, setViewMode] = useState<'target' | 'approx' | 'both'>('both');

    const domainSize = 10;

    // Simulating approximation capabilities based on depth and width
    const approxFunction = useMemo(() => {
        return (x: number, y: number) => {
            const target = targetFunction(x, y);

            // Width dictates basic resolution capability (low frequency capture)
            const widthRes = Math.max(1, Math.floor(Math.sqrt(width)));
            const stepW = domainSize / widthRes;

            // Depth dictates the ability to capture high-frequency ripples (oscillations)
            // Exponential increase in rippling capability with depth (simulated)
            const depthPower = Math.pow(2, depth - 1); // 1, 2, 4, 8...

            // Shallow network heavily blurs the target. Deep network captures details.
            // We use a blend.

            // Shallow/Wide approximation (Blurry piecewise grid)
            const qx = Math.round(x / stepW) * stepW;
            const qy = Math.round(y / stepW) * stepW;
            const shallowAppx = targetFunction(qx, qy);

            // If depth is 1, it only gets the shallow approximation.
            // If depth is high, it smoothly interpolates towards the perfect true high-freq target.
            const depthFactor = Math.min(1.0, depthPower / 16.0); // Caps at depth~5 

            const finalValue = shallowAppx * (1 - depthFactor) + target * depthFactor;

            return finalValue;
        };
    }, [depth, width, domainSize]);

    // Calculate simulated Network Capacity Parameter count for UI context
    const params = depth * (width * width) + width;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-8 mb-8">
            <div className="flex items-center gap-2">
                <Network className="text-emerald-600" size={24} />
                <h3 className="text-xl font-bold text-slate-800">3D Lab: Depth vs. Width Trade-off</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Explore Theorem 1.9 and 1.10. The target function contains high-frequency oscillations (ripples). See how increasing <strong>Width</strong> (neurons per layer) provides a basic blocky approximation, but increasing <strong>Depth</strong> (number of layers) exponentially improves the network's ability to model complex, folding, high-frequency details.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Controls */}
                <div className="w-full lg:w-80 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 order-2 lg:order-1">

                    {/* View Toggles */}
                    <div className="flex bg-slate-100 p-1 rounded-lg w-full mb-2">
                        <button
                            onClick={() => setViewMode('target')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${viewMode === 'target' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Target Only
                        </button>
                        <button
                            onClick={() => setViewMode('approx')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${viewMode === 'approx' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Approx Only
                        </button>
                        <button
                            onClick={() => setViewMode('both')}
                            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${viewMode === 'both' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Overlay Both
                        </button>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Model Complexity</span>
                        </div>
                        <div className="text-2xl font-mono text-emerald-700 font-bold">
                            ~{params.toLocaleString()} <span className="text-sm font-sans text-emerald-600 font-normal">params</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Network size={16} className="text-slate-400" /> Layer Width (<Latex>{'$W$'}</Latex>)
                            </label>
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-sm">
                                {width}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={4}
                            max={400}
                            step={4}
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value))}
                            className="w-full accent-slate-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">Width increases block resolution but struggles with sharp ripples.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Layers size={16} className="text-emerald-500" /> Network Depth (<Latex>{'$L$'}</Latex>)
                            </label>
                            <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded shadow-inner border border-emerald-200 text-sm">
                                {depth}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={6}
                            step={1}
                            value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">Depth exponentially increases capacity to fold space and fit oscillations (Theorem 1.10).</p>
                    </div>

                </div>

                {/* 3D Canvas */}
                <div className="flex-grow bg-slate-900 rounded-xl overflow-hidden shadow-inner relative order-1 lg:order-2" style={{ height: "550px" }}>

                    {/* Legend Overlay */}
                    <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-slate-800/80 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <span className="text-xs text-slate-300 font-mono">Target Function</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span className="text-xs text-white font-mono font-bold">Network Approx</span>
                        </div>
                    </div>

                    <Canvas camera={{ position: [7, 5, 7], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <directionalLight position={[-10, 10, -5]} intensity={1.2} color="#10b981" />

                        <gridHelper args={[10, 10, 0x475569, 0x1e293b]} position={[0, -2, 0]} />

                        <Surface
                            func={targetFunction}
                            color="#94a3b8"
                            wireframe={viewMode === 'both'}
                            opacity={viewMode === 'both' ? 0.2 : 0.8}
                            visible={viewMode === 'target' || viewMode === 'both'}
                        />

                        <Surface
                            func={approxFunction}
                            color={viewMode === 'both' ? "#10b981" : "#34d399"}
                            wireframe={false}
                            opacity={viewMode === 'both' ? 0.85 : 1}
                            visible={viewMode === 'approx' || viewMode === 'both'}
                        />

                        <OrbitControls enableDamping dampingFactor={0.05} autoRotate={true} autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

            </div>
        </div>
    );
}
