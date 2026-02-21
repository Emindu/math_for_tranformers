"use client";

import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function EmpiricalRiskLab() {
    const [sampleSize, setSampleSize] = useState<number>(10);
    const [capacity, setCapacity] = useState<number>(1); // e.g. Polynomial degree

    // Generate points
    const points: { x: number, y: number }[] = [];
    // True function: A simple sine wave + linear
    const trueFunc = (x: number) => Math.sin(x * Math.PI) * 0.5 + x * 0.2;

    // Fixed seed random generation so it doesn't jump wildly
    const seededRandom = (s: number) => {
        const x = Math.sin(s++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < sampleSize; i++) {
        // distribute x somewhat evenly
        const x = -1 + (2 * i) / (Math.max(1, sampleSize - 1));
        const noise = (seededRandom(i) - 0.5) * 0.6; // add variance
        points.push({ x, y: trueFunc(x) + noise });
    }

    // Calculating Polynomial fit
    // To visualize "capacity", we will simulate what a polynomial of degree 'capacity' looks like.
    // For a real app, this would use a matrix solver. We will fake it via an approximation for visual effect.
    // Low capacity = linear
    // High capacity = touches every point (overfitting)

    // Simulate True Risk vs Empirical Risk calculation
    const isOverfitting = capacity > 3 && sampleSize < 15;
    const empiricalRisk = Math.max(0, 0.4 - (capacity * 0.05) - (sampleSize * 0.005));
    // True risk explodes if capacity is high and n is low
    const trueRisk = Math.max(0.1, empiricalRisk + (capacity * capacity) / (sampleSize * 2));

    return (
        <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full">

            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Target className="text-indigo-500" />
                        Empirical vs True Risk Visualization
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Balancing Data Size (<Latex>{'$n$'}</Latex>) and Model Capacity (<Latex>{'$\\mathcal{H}$'}</Latex>)</p>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center justify-center relative min-h-[300px]">

                {/* SVG Graph Area */}
                <div className="w-full h-[250px] bg-slate-50 rounded-xl relative border border-slate-200 overflow-hidden mb-6">
                    {/* Fake Grid */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* True Distribution D (Subtle background curve) */}
                        <path
                            d="M 0,125 Q 100,50 200,125 T 400,125"
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="4"
                            strokeDasharray="8 4"
                            className="opacity-50"
                        />
                        // Note: For a true fit, we use CSS transforms to position points in a 400x250 viewbox
                        {/* We map x in [-1, 1] to [20, 380], y in [-1, 1] to [230, 20] */}
                        {points.map((pt, i) => {
                            const cx = 200 + (pt.x * 180);
                            const cy = 125 - (pt.y * 100);
                            return (
                                <circle key={i} cx={cx} cy={cy} r="4" fill="#6366f1" />
                            );
                        })}

                        {/* Fitted Curve h_ERM */}
                        {/* For visual metaphor, a higher capacity makes the line "wigglier" to catch points */}
                        <path
                            d={capacity > 3
                                ? "M 20, 150 Q 100, 20 200, 200 T 380, 50" // Wiggly overfit
                                : "M 20, 180 L 380, 70"} // Simple linear fit
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="3"
                        />
                    </svg>

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <div className="w-3 h-3 bg-slate-300 rounded-full border border-slate-400 border-dashed"></div> True Distribution (<Latex>{'$\\mathcal{D}$'}</Latex>)
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Training Data (<Latex>{'$S$'}</Latex>)
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
                            <div className="w-3 h-0.5 bg-rose-500 border-y border-rose-500"></div> <Latex>{'$h_{\\text{ERM}}$'}</Latex>
                        </div>
                    </div>
                </div>

                {/* Risk Bars */}
                <div className="w-full flex justify-around mb-6">
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Empirical Risk <Latex>{'$\\hat{R}_n(h)$'}</Latex></div>
                        <div className="h-24 w-12 bg-slate-100 rounded-lg overflow-hidden flex items-end">
                            <div className="w-full bg-sky-500 rounded-lg transition-all duration-300" style={{ height: `${empiricalRisk * 100}%` }}></div>
                        </div>
                        <div className="text-sm font-mono mt-2 text-sky-600 font-bold">{empiricalRisk.toFixed(2)}</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">True Risk <Latex>{'$R(h)$'}</Latex></div>
                        <div className="h-24 w-12 bg-slate-100 rounded-lg overflow-hidden flex items-end">
                            <div className="w-full bg-rose-500 rounded-lg transition-all duration-300" style={{ height: `${Math.min(100, trueRisk * 100)}%` }}></div>
                        </div>
                        <div className="text-sm font-mono mt-2 text-rose-600 font-bold">{trueRisk.toFixed(2)}</div>
                    </div>
                </div>

                {isOverfitting && (
                    <div className="w-full bg-rose-50 text-rose-700 text-sm font-bold px-4 py-2 rounded-lg border border-rose-200 flex items-center justify-center gap-2 animate-pulse mb-6">
                        <AlertTriangle size={16} /> WARNING: High Generalization Error (Overfitting)
                    </div>
                )}

                {/* Controls */}
                <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-semibold text-slate-700">Sample Size (<Latex>{'$n$'}</Latex>)</label>
                                <span className="text-xs font-mono text-indigo-600">{sampleSize} points</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={sampleSize}
                                onChange={(e) => setSampleSize(Number(e.target.value))}
                                className="accent-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-semibold text-slate-700">Model Capacity (<Latex>{'$\\mathcal{H}$'}</Latex>)</label>
                                <span className="text-xs font-mono text-rose-600">Degree {capacity}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="8"
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                className="accent-rose-500"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
