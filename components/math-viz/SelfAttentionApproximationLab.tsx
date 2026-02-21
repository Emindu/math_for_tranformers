"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import { Eye, Settings2 } from 'lucide-react';

const NUM_TOKENS = 5;

// Visualizes a Matrix as a grid of colored cubes
function MatrixViz({ position, data, colorScale, label }: { position: [number, number, number], data: number[][], colorScale: (v: number) => string, label: string }) {
    const rows = data.length;
    const cols = data[0].length;
    const spacing = 1.1;

    return (
        <group position={position}>
            <Text position={[(cols * spacing) / 2 - 0.5, rows * spacing + 0.5, 0]} fontSize={0.6} color="black" anchorX="center">
                {label}
            </Text>
            {data.map((row, i) =>
                row.map((val, j) => (
                    <mesh key={`${i}-${j}`} position={[j * spacing, (rows - 1 - i) * spacing, 0]}>
                        <boxGeometry args={[1, 1, 0.2]} />
                        <meshStandardMaterial color={colorScale(val)} />
                        <Text position={[0, 0, 0.15]} fontSize={0.3} color={Math.abs(val) > 0.5 ? "white" : "black"}>
                            {val.toFixed(1)}
                        </Text>
                    </mesh>
                ))
            )}
        </group>
    );
}

// Arrow component to show data flow
function FlowArrow({ start, end, progress }: { start: [number, number, number], end: [number, number, number], progress: number }) {
    const points = useMemo(() => {
        const path = new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(...end));
        return path.getPoints(50);
    }, [start, end]);

    const activePoint = new THREE.Vector3().lerpVectors(new THREE.Vector3(...start), new THREE.Vector3(...end), progress);

    return (
        <group>
            <Line points={points} color="#cbd5e1" lineWidth={1} dashed dashSize={0.2} gapSize={0.2} />
            <mesh position={activePoint}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
        </group>
    );
}

export default function SelfAttentionApproximationLab() {
    // Generate some stable random "embedding" data for 5 tokens
    const X = useMemo(() => Array.from({ length: NUM_TOKENS }, () => Array.from({ length: 3 }, () => Math.random() * 2 - 1)), []);

    // Weight matrices (simulated parameter adjustment)
    const [wScale, setWScale] = useState(1.0);
    const [attentionTemp, setAttentionTemp] = useState(1.0);

    const WQ = useMemo(() => [[1, 0, 0.5], [0, 1, -0.5], [-0.5, 0.5, 1]].map(r => r.map(v => v * wScale)), [wScale]);
    const WK = useMemo(() => [[0.5, -0.5, 1], [1, 0.5, 0], [0, 1, 0.5]].map(r => r.map(v => v * wScale)), [wScale]);
    const WV = useMemo(() => [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(r => r.map(v => v * wScale)), [wScale]);

    // Matrix Multiplication
    const multiply = (A: number[][], B: number[][]) => {
        return A.map(row => {
            return B[0].map((_, i) => row.reduce((sum, val, j) => sum + val * B[j][i], 0));
        });
    };

    const transpose = (A: number[][]) => A[0].map((_, colIndex) => A.map(row => row[colIndex]));

    // Compute Q, K, V
    const Q = useMemo(() => multiply(X, WQ), [X, WQ]);
    const K = useMemo(() => multiply(X, WK), [X, WK]);
    const V = useMemo(() => multiply(X, WV), [X, WV]);

    // Compute Attention Scores: Softmax(Q * K^T / sqrt(d_k))
    const attentionScores = useMemo(() => {
        const scores = multiply(Q, transpose(K));
        const dk = Math.sqrt(3); // dimension is 3

        return scores.map(row => {
            const scaled = row.map(v => v / (dk * attentionTemp));
            const max = Math.max(...scaled); // numerical stability
            const exps = scaled.map(v => Math.exp(v - max));
            const sum = exps.reduce((a, b) => a + b, 0);
            return exps.map(v => v / sum);
        });
    }, [Q, K, attentionTemp]);

    // Final Output: Attention * V
    const Output = useMemo(() => multiply(attentionScores, V), [attentionScores, V]);

    // Animation progress
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const int = setInterval(() => {
            setProgress(p => (p + 0.02) % 1);
        }, 50);
        return () => clearInterval(int);
    }, []);

    const colorBlue = (val: number) => {
        const alpha = Math.min(Math.abs(val), 1);
        return val > 0 ? `rgba(59, 130, 246, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
    };

    const colorProb = (val: number) => {
        // Red-Yellow-Green scale
        return `hsl(${(val * 120).toString()}, 70%, 50%)`;
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 mt-8 mb-8">
            <div className="flex items-center gap-2">
                <Eye className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-slate-800">3D Lab: Self-Attention as an Approximator</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                This lab visualizes Theorem 1.2. The Transformer is a universal approximator because the Self-Attention mechanism acts as a dynamic, input-dependent routing system. It maps an Input (<Latex>{'$X$'}</Latex>) to Queries (<Latex>{'$Q$'}</Latex>), Keys (<Latex>{'$K$'}</Latex>), and Values (<Latex>{'$V$'}</Latex>). Observe how changing the network Weights and Attention Temperature drastically alters the output mapping.
            </p>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Controls */}
                <div className="w-full lg:w-64 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm border-b pb-2">
                        <Settings2 size={16} /> Parameters
                    </h4>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Weight Scale (<Latex>{'$W_Q, W_K, W_V$'}</Latex>)</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={wScale}
                            onChange={(e) => setWScale(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                        <div className="text-xs font-mono text-slate-500 text-right mt-1">{wScale.toFixed(1)}x</div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Attention Temp (<Latex>{'$T$'}</Latex>)</label>
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={attentionTemp}
                            onChange={(e) => setAttentionTemp(parseFloat(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="text-xs font-mono text-slate-500 text-right mt-1">{attentionTemp.toFixed(1)}x</div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-tight">Lower temp = sharper, more deterministic routing. High temp = uniform averaging.</p>
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="flex-grow bg-white rounded-xl overflow-hidden border border-slate-200 relative" style={{ height: "600px" }}>
                    <Canvas camera={{ position: [0, 5, 25], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 10]} intensity={1} />
                        <OrbitControls enableZoom={true} />

                        {/* Input X */}
                        <MatrixViz position={[-15, 0, 0]} data={X} colorScale={colorBlue} label="Input (X)" />

                        {/* W Matrices (represented symbolically via flow) */}
                        <FlowArrow start={[-10, 2, 0]} end={[-5, 8, 0]} progress={progress} />
                        <FlowArrow start={[-10, 2, 0]} end={[-5, 2, 0]} progress={progress} />
                        <FlowArrow start={[-10, 2, 0]} end={[-5, -4, 0]} progress={progress} />

                        {/* Q, K, V */}
                        <MatrixViz position={[-2, 8, 0]} data={Q} colorScale={colorBlue} label="Queries (Q)" />
                        <MatrixViz position={[-2, 2, 0]} data={K} colorScale={colorBlue} label="Keys (K)" />
                        <MatrixViz position={[-2, -4, 0]} data={V} colorScale={colorBlue} label="Values (V)" />

                        {/* Attention Calculation */}
                        <FlowArrow start={[2, 8, 0]} end={[8, 5, 0]} progress={progress} />
                        <FlowArrow start={[2, 2, 0]} end={[8, 5, 0]} progress={progress} />

                        {/* Attention Scores (Softmax) */}
                        <MatrixViz position={[10, 5, 0]} data={attentionScores} colorScale={colorProb} label="Attention Weights" />

                        {/* Final Output Calculation */}
                        <FlowArrow start={[15, 5, 0]} end={[20, 2, 0]} progress={progress} />
                        <FlowArrow start={[2, -4, 0]} end={[20, -1, 0]} progress={progress} />

                        {/* Output */}
                        <MatrixViz position={[22, 0, 0]} data={Output} colorScale={colorBlue} label="Final Output" />

                    </Canvas>
                </div>
            </div>
        </div>
    );
}
