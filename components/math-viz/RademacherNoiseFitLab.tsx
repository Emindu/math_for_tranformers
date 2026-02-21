"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Target, RefreshCw } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// Pre-define 40 random points scattered in a normalized [0, 1] x [0, 1] space
const NUM_POINTS = 40;
const INITIAL_POINTS = Array.from({ length: NUM_POINTS }).map(() => ({
    x: Math.random() * 0.8 + 0.1, // keep away from edges
    y: Math.random() * 0.8 + 0.1
}));

export default function RademacherNoiseFitLab() {
    const [capacity, setCapacity] = useState<number>(1); // 1 = Low (Line), 10 = High (Squiggles)
    const [labels, setLabels] = useState<number[]>([]);

    // Function to assign purely random Rademacher labels (+1 or -1) to all points
    const generateRandomLabels = useCallback(() => {
        setLabels(INITIAL_POINTS.map(() => Math.random() > 0.5 ? 1 : -1));
    }, []);

    // Initialize labels on mount
    useEffect(() => {
        generateRandomLabels();
    }, [generateRandomLabels]);

    // Visually calculating the 'Decision Boundary'
    // To cleanly visualize "fitting noise", we won't run an actual SVM or neural network.
    // Instead, we will procedurally generate SVG path squiggles that attempt to "corral" 
    // the +1 points together depending on the allowed `capacity`.

    // A low capacity model (e.g. 1) just draws a straight line. It will fail to fit the noise.
    // A high capacity model (e.g. 10) draws intense, rapid sine-wave like contours that encircle points.

    const generateBoundaryPath = () => {
        if (labels.length === 0) return "";

        const pathData: string[] = [];
        const width = 300;
        const height = 300;

        if (capacity <= 2) {
            // Low Capacity: Just a straight line (mostly useless for pure noise)
            // Draw a basic diagonal
            pathData.push(`M 0,${height / 2} L ${width},${height / 2}`);
        } else {
            // High Capacity: Overfitting contours
            // We simulate an overfitted decision boundary by drawing chaotic waves
            // The higher the capacity, the more high-frequency the waves
            const segments = Math.floor(capacity * 5);
            const amplitude = capacity * 8;

            pathData.push(`M 0,${height / 2}`);
            for (let i = 1; i <= segments; i++) {
                const x = (i / segments) * width;
                // Add chaotic vertical variation
                const yOffset = Math.sin(i * 1.5) * amplitude + (Math.random() - 0.5) * amplitude;
                const y = Math.max(0, Math.min(height, (height / 2) + yOffset));

                // Use a cubic bezier for smooth squiggles
                const cp1x = x - (width / segments) / 2;
                const cp2x = x - (width / segments) / 2;
                pathData.push(`C ${cp1x},${(height / 2)} ${cp2x},${y} ${x},${y}`);
            }
        }

        return pathData.join(" ");
    };

    // Calculate simulated "accuracy" on the noise
    // Low capacity = ~50% (random guess on random noise)
    // High capacity = Approaches 100% (memorization)
    const noiseAccuracy = Math.min(100, 50 + (capacity * 4.8));

    return (
        <div className="w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col h-full text-slate-200 p-6 relative">
            <div className="mb-6 z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                    <Target className="text-violet-400" />
                    Rademacher Noise Overfitting
                </h3>
                <p className="text-slate-400 text-sm">Visualizing <Latex>{'$\\hat{\\mathcal{R}}_n(\\mathcal{H})$'}</Latex>: A model&#39;s ability to perfectly memorize random labels.</p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center z-10">

                {/* SVG Canvas */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-2 aspect-square max-h-[300px] w-full max-w-[300px] relative overflow-hidden shadow-inner flex-shrink-0">
                    <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute inset-0">
                        {/* Boundary Path */}
                        <path
                            d={generateBoundaryPath()}
                            fill="none"
                            stroke="#8b5cf6" // Violet
                            strokeWidth={Math.max(1, 4 - capacity * 0.2)}
                            className="transition-all duration-750 ease-in-out"
                        />

                        {/* Upper/Lower Fill Simulation (Hack for visual effect) */}
                        {capacity <= 2 && (
                            <rect x="0" y="150" width="300" height="150" fill="#8b5cf6" opacity="0.1" className="transition-all" />
                        )}

                        {/* Points */}
                        {INITIAL_POINTS.map((pt, i) => {
                            const isPositive = labels[i] === 1;
                            return (
                                <g key={i} transform={`translate(${pt.x * 300}, ${pt.y * 300})`} className="transition-all duration-300">
                                    <circle
                                        cx="0" cy="0" r="6"
                                        fill={isPositive ? "#10b981" : "#f43f5e"} // Emerald vs Rose
                                    />
                                    {/* Inner dot for texture */}
                                    <circle cx="0" cy="0" r="2" fill="#ffffff" className="opacity-50" />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-6 w-full max-w-[280px]">

                    <button
                        onClick={generateRandomLabels}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl border border-slate-700 transition-colors active:scale-95"
                    >
                        <RefreshCw size={16} />
                        <span className="font-semibold text-sm">Assign Random Labels $\sigma_i$</span>
                    </button>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-slate-300">Hypothesis Capacity</label>
                            <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs font-mono border border-violet-500/30">
                                Lvl {capacity}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            className="w-full accent-violet-500 mb-2"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                            <span>Linear Line</span>
                            <span>Highly Complex</span>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border text-center transition-colors duration-500 ${capacity >= 8 ? 'bg-rose-500/20 border-rose-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Accuracy on Pure Noise
                        </div>
                        <div className={`text-3xl font-mono font-bold mb-1 ${capacity >= 8 ? 'text-rose-400' : 'text-slate-200'}`}>
                            {noiseAccuracy.toFixed(1)}%
                        </div>
                        <p className={`text-[11px] font-medium ${capacity >= 8 ? 'text-rose-300/80' : 'text-slate-500'}`}>
                            {capacity >= 8
                                ? "Warning: High Rademacher Complexity. Model is memorizing random noise!"
                                : "Low Capacity. Model cannot fit random structural noise."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
