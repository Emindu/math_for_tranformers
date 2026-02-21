"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { Maximize, Box } from 'lucide-react';

export default function CurseOfDimensionalityLab() {
    const [epsilon, setEpsilon] = useState(0.1);
    const [dimension, setDimension] = useState(3);

    // Compute the ratio of the volume in the outer shell (1 - epsilon) to the total volume
    // Ratio = 1 - (1 - epsilon)^d
    const maxDimensions = 100;
    const dimensionsList = Array.from({ length: maxDimensions }, (_, i) => i + 1);

    const shellVolumeRatios = useMemo(() => {
        return dimensionsList.map(d => ({
            d,
            ratio: 1 - Math.pow(1 - epsilon, d)
        }));
    }, [epsilon, dimensionsList]);

    // Graph parameters
    const W = 500;
    const H = 250;
    const padX = 50;
    const padY = 30;

    const currentRatio = 1 - Math.pow(1 - epsilon, dimension);

    // Scaling helpers for SVG graph
    const toX = (val: number) => padX + ((val - 1) / (maxDimensions - 1)) * (W - padX * 2);
    const toY = (val: number) => (H - padY) - val * (H - padY * 2);

    // Generate Path for the line
    const pathD = useMemo(() => {
        if (shellVolumeRatios.length === 0) return "";
        const points = shellVolumeRatios.map(item => `${toX(item.d)},${toY(item.ratio)}`);
        return `M${points.join(" L ")}`;
    }, [shellVolumeRatios]);

    // Generate Area for filling under the curve
    const pathArea = useMemo(() => {
        if (shellVolumeRatios.length === 0) return "";
        const points = shellVolumeRatios.map(item => `${toX(item.d)},${toY(item.ratio)}`);
        return `M${toX(1)},${toY(0)} L ${points[0]} L ${points.join(" L ")} L ${toX(maxDimensions)},${toY(0)} Z`;
    }, [shellVolumeRatios]);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Maximize className="text-fuchsia-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">The Curse of Dimensionality</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Explore how the volume of a hypersphere concentrates near its surface as dimensions increase.
                The graph shows the percentage of the total volume that lies within a narrow "shell" (of thickness <Latex>{'$\\epsilon$'}</Latex>) near the boundary.
            </p>

            <div className="flex flex-col md:flex-row gap-6">

                {/* 2D Graph */}
                <div className="flex-1 bg-white rounded-lg border border-slate-200 p-2 shadow-inner">
                    <svg width="100%" height="auto" viewBox={`0 0 ${W} ${H}`} className="text-sm font-mono text-slate-500">
                        {/* Axes */}
                        <line x1={padX} y1={H - padY} x2={W - padX + 20} y2={H - padY} stroke="currentColor" strokeWidth={1} />
                        <line x1={padX} y1={H - padY} x2={padX} y2={padY - 20} stroke="currentColor" strokeWidth={1} />

                        {/* Axis Labels */}
                        <text x={W / 2} y={H - 5} textAnchor="middle" fill="currentColor">Dimension (d)</text>
                        <text x={15} y={H / 2} textAnchor="middle" fill="currentColor" transform={`rotate(-90, 15, ${H / 2})`}>Shell Volume Ratio</text>

                        {/* Y-axis Ticks */}
                        <text x={padX - 8} y={toY(0)} textAnchor="end" alignmentBaseline="middle" fill="currentColor">0%</text>
                        <text x={padX - 8} y={toY(0.5)} textAnchor="end" alignmentBaseline="middle" fill="currentColor">50%</text>
                        <text x={padX - 8} y={toY(1.0)} textAnchor="end" alignmentBaseline="middle" fill="currentColor">100%</text>
                        <line x1={padX} y1={toY(0.5)} x2={W - padX} y2={toY(0.5)} stroke="currentColor" strokeDasharray="4,4" strokeOpacity={0.2} />
                        <line x1={padX} y1={toY(1.0)} x2={W - padX} y2={toY(1.0)} stroke="currentColor" strokeDasharray="4,4" strokeOpacity={0.2} />

                        {/* Area shading */}
                        <path d={pathArea} fill="rgba(217, 70, 239, 0.1)" />

                        {/* Line plot */}
                        <path d={pathD} fill="none" stroke="#d946ef" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

                        {/* Current selected dimension marker */}
                        <motion.circle
                            cx={toX(dimension)}
                            animate={{ cy: toY(currentRatio) }}
                            r={5}
                            fill="#a21caf"
                            stroke="white"
                            strokeWidth={2}
                        />
                        <motion.line
                            x1={toX(dimension)}
                            animate={{ y1: toY(currentRatio) }}
                            x2={toX(dimension)}
                            y2={H - padY}
                            stroke="#a21caf"
                            strokeDasharray="4,4"
                        />

                        {/* Selected Dimension Text */}
                        <motion.text
                            x={Math.max(padX + 20, Math.min(W - padX - 40, toX(dimension)))}
                            animate={{ y: toY(currentRatio) - 15 }}
                            fill="#86198f"
                            textAnchor="middle"
                            fontWeight="bold"
                        >
                            {(currentRatio * 100).toFixed(1)}%
                        </motion.text>
                    </svg>
                </div>

                {/* Controls */}
                <div className="w-full md:w-64 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 justify-center">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-700">Shell Thickness (<Latex>{'$\\epsilon$'}</Latex>)</label>
                            <span className="font-mono text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-100">{epsilon.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min={0.01}
                            max={0.5}
                            step={0.01}
                            value={epsilon}
                            onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                            className="w-full accent-fuchsia-600"
                        />
                        <p className="text-xs text-slate-400 mt-1">Width of the outer "peel" relative to radius R=1.</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-700">Dimension (<Latex>{'$d$'}</Latex>)</label>
                            <span className="font-mono text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-100">{dimension}</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={maxDimensions}
                            step={1}
                            value={dimension}
                            onChange={(e) => setDimension(parseInt(e.target.value))}
                            className="w-full accent-fuchsia-600"
                        />
                        <p className="text-xs text-slate-400 mt-1">Dimensions of the embedding space.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs text-slate-700">
                        <div className="flex items-center gap-2 font-bold mb-1 text-slate-800">
                            <Box size={14} className="text-slate-500" /> Math Formula
                        </div>
                        <p className="mb-2">Ratio of volume contained in the shell <Latex>{'$(1-\\epsilon, 1]$'}</Latex> to total volume:</p>
                        <div className="text-center font-mono text-fuchsia-800 bg-white p-2 rounded">
                            <Latex>{'$\\frac{V_d(1) - V_d(1-\\epsilon)}{V_d(1)} = 1 - (1-\\epsilon)^d$'}</Latex>
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-3 bg-fuchsia-50 border-l-4 border-fuchsia-500 rounded-lg text-sm text-fuchsia-900 shadow-sm mt-2">
                <strong>Why it matters:</strong> In thousands of dimensions (typical for transformer embeddings like GPT), practically <em>all</em> data points lie on the extreme surface shell of any volume. This makes distinguishing distance practically impossible unless the data intrinsically adheres to a lower-dimensional submanifold within that space.
            </div>
        </div>
    );
}
