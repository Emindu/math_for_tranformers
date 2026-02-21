"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// ── SVG Constants ─────────────────────────────────────────────────────────────
const W = 500;
const H_HEATMAP = 220;
const H_PLOT = 180;
const PAD_HEATMAP = { left: 40, right: 20, top: 30, bottom: 40 };
const PAD_PLOT = { left: 40, right: 20, top: 30, bottom: 40 };
const PLOT_W = W - PAD_PLOT.left - PAD_PLOT.right;

export default function FourierPositionalLab() {
    const [seqLen, setSeqLen] = useState(50);
    const [dModel, setDModel] = useState(64);
    const [selectedDim, setSelectedDim] = useState(0);

    // Generate Positional Encodings
    const pe = useMemo(() => {
        const matrix: number[][] = [];
        for (let pos = 0; pos < seqLen; pos++) {
            const row: number[] = [];
            for (let i = 0; i < dModel; i++) {
                // i is the actual dimension 0, 1, 2...
                // The pair index is Math.floor(i / 2) * 2
                const dimPair = Math.floor(i / 2) * 2;
                const denominator = Math.pow(10000, dimPair / dModel);
                if (i % 2 === 0) {
                    row.push(Math.sin(pos / denominator));
                } else {
                    row.push(Math.cos(pos / denominator));
                }
            }
            matrix.push(row);
        }
        return matrix;
    }, [seqLen, dModel]);

    // Color mapper for heatmap (-1 to 1 -> color)
    // Red for negative, white for 0, Blue for positive
    const getColor = (val: number) => {
        // Simple RGB interpolation
        // val = -1 -> 239, 68, 68 (red-500)
        // val = 0  -> 248, 250, 252 (slate-50)
        // val = 1  -> 59, 130, 246 (blue-500)
        if (val < 0) {
            const intensity = -val;
            const r = Math.round(248 - intensity * (248 - 239));
            const g = Math.round(250 - intensity * (250 - 68));
            const b = Math.round(252 - intensity * (252 - 68));
            return `rgb(${r},${g},${b})`;
        } else {
            const intensity = val;
            const r = Math.round(248 - intensity * (248 - 59));
            const g = Math.round(250 - intensity * (250 - 130));
            const b = Math.round(252 - intensity * (252 - 246));
            return `rgb(${r},${g},${b})`;
        }
    };

    // Calculate cell sizes
    const cellW = (W - PAD_HEATMAP.left - PAD_HEATMAP.right) / dModel;
    const cellH = (H_HEATMAP - PAD_HEATMAP.top - PAD_HEATMAP.bottom) / seqLen;

    // Line plot data for selected dimension
    const plotData = useMemo(() => {
        return pe.map(row => row[selectedDim]);
    }, [pe, selectedDim]);

    const dimFreq = 1 / Math.pow(10000, Math.floor(selectedDim / 2) * 2 / dModel);
    const isSin = selectedDim % 2 === 0;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Fourier Positional Encodings</h3>
            <p className="text-sm text-slate-600 mb-6">
                Visualize how positional information is encoded as a spectrum of frequencies across dimensions.
            </p>

            {/* Heatmap Section */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 relative">
                <div className="absolute top-2 left-3 text-xs font-bold text-slate-500">PE Matrix (Heatmap)</div>
                <svg viewBox={`0 0 ${W} ${H_HEATMAP}`} className="w-full">
                    {/* Y-axis label */}
                    <text x={12} y={PAD_HEATMAP.top + (cellH * seqLen) / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(-90, 12, ${PAD_HEATMAP.top + (cellH * seqLen) / 2})`}>
                        Position (p)
                    </text>
                    <text x={PAD_HEATMAP.left - 4} y={PAD_HEATMAP.top + 6} textAnchor="end" fontSize={8} fill="#94a3b8">0</text>
                    <text x={PAD_HEATMAP.left - 4} y={PAD_HEATMAP.top + (seqLen * cellH)} textAnchor="end" fontSize={8} fill="#94a3b8">{seqLen - 1}</text>

                    {/* X-axis label */}
                    <text x={PAD_HEATMAP.left + (cellW * dModel) / 2} y={H_HEATMAP - 10} textAnchor="middle" fontSize={10} fill="#64748b">
                        Model Dimension (i)
                    </text>
                    <text x={PAD_HEATMAP.left} y={H_HEATMAP - 25} textAnchor="middle" fontSize={8} fill="#94a3b8">0</text>
                    <text x={PAD_HEATMAP.left + (dModel * cellW)} y={H_HEATMAP - 25} textAnchor="middle" fontSize={8} fill="#94a3b8">{dModel - 1}</text>

                    {/* High/Low frequency labels */}
                    <text x={PAD_HEATMAP.left + 20} y={H_HEATMAP - 25} fontSize={8} fill="#3b82f6" fontStyle="italic">High Freq</text>
                    <text x={PAD_HEATMAP.left + (dModel * cellW) - 40} y={H_HEATMAP - 25} fontSize={8} fill="#ef4444" fontStyle="italic">Low Freq</text>

                    {/* Heatmap Cells */}
                    <g transform={`translate(${PAD_HEATMAP.left}, ${PAD_HEATMAP.top})`}>
                        {pe.map((row, p) => (
                            <g key={p}>
                                {row.map((val, i) => (
                                    <rect
                                        key={i}
                                        x={i * cellW}
                                        y={p * cellH}
                                        width={cellW + 0.5}
                                        height={cellH + 0.5}
                                        fill={getColor(val)}
                                        onClick={() => setSelectedDim(i)}
                                        className="cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ stroke: selectedDim === i ? '#000' : 'none', strokeWidth: selectedDim === i ? 1 : 0 }}
                                    />
                                ))}
                            </g>
                        ))}

                        {/* Selector Highlight */}
                        <rect
                            x={selectedDim * cellW}
                            y={0}
                            width={cellW}
                            height={seqLen * cellH}
                            fill="none"
                            stroke="#0f172a"
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </g>
                </svg>
            </div>

            {/* Line Plot Section */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6 relative">
                <div className="absolute top-2 left-3 text-xs font-bold text-slate-500">
                    Signal for Dimension <span className="text-blue-600">{selectedDim}</span>
                </div>
                <div className="absolute top-2 right-3 text-xs text-slate-400">
                    <span className="font-mono">
                        {isSin ? 'sin' : 'cos'}(p * {(dimFreq).toExponential(2)})
                    </span>
                </div>

                <svg viewBox={`0 0 ${W} ${H_PLOT}`} className="w-full">
                    {/* Grid and Axes */}
                    <line x1={PAD_PLOT.left} y1={PAD_PLOT.top + (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom) / 2} x2={W - PAD_PLOT.right} y2={PAD_PLOT.top + (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom) / 2} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4,4" />

                    {/* Y-axis label */}
                    <text x={12} y={PAD_PLOT.top + (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom) / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(-90, 12, ${PAD_PLOT.top + (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom) / 2})`}>
                        Value
                    </text>
                    <text x={PAD_PLOT.left - 4} y={PAD_PLOT.top + 4} textAnchor="end" fontSize={8} fill="#94a3b8">+1</text>
                    <text x={PAD_PLOT.left - 4} y={H_PLOT - PAD_PLOT.bottom + 4} textAnchor="end" fontSize={8} fill="#94a3b8">-1</text>
                    <text x={PAD_PLOT.left - 4} y={PAD_PLOT.top + (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom) / 2 + 3} textAnchor="end" fontSize={8} fill="#94a3b8">0</text>

                    {/* X-axis label */}
                    <text x={PAD_PLOT.left + PLOT_W / 2} y={H_PLOT - 10} textAnchor="middle" fontSize={10} fill="#64748b">
                        Position (p)
                    </text>
                    <text x={PAD_PLOT.left} y={H_PLOT - 25} textAnchor="middle" fontSize={8} fill="#94a3b8">0</text>
                    <text x={W - PAD_PLOT.right} y={H_PLOT - 25} textAnchor="middle" fontSize={8} fill="#94a3b8">{seqLen - 1}</text>

                    {/* Plot Line */}
                    <g transform={`translate(${PAD_PLOT.left}, ${PAD_PLOT.top})`}>
                        <polyline
                            points={plotData.map((val, p) => {
                                const x = (p / (seqLen - 1)) * PLOT_W;
                                const y = (1 - (val + 1) / 2) * (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom);
                                return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth={2}
                        />
                        {plotData.map((val, p) => {
                            const x = (p / (seqLen - 1)) * PLOT_W;
                            const y = (1 - (val + 1) / 2) * (H_PLOT - PAD_PLOT.top - PAD_PLOT.bottom);
                            return (
                                <motion.circle
                                    key={p}
                                    cx={x}
                                    cy={y}
                                    r={1.5}
                                    fill="#2563eb"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: p * 0.01 }}
                                />
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-6 mt-2">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-700">Display Positions (Length)</label>
                        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{seqLen}</span>
                    </div>
                    <input
                        type="range"
                        min={10}
                        max={100}
                        value={seqLen}
                        onChange={(e) => setSeqLen(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-700">Model Dimension (d)</label>
                        <span className="text-xs font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{dModel}</span>
                    </div>
                    <input
                        type="range"
                        min={16}
                        max={128}
                        step={2}
                        value={dModel}
                        onChange={(e) => {
                            const newDModel = parseInt(e.target.value);
                            setDModel(newDModel);
                            if (selectedDim >= newDModel) setSelectedDim(newDModel - 1);
                        }}
                        className="w-full accent-blue-600"
                    />
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
                <strong>Insight:</strong> Click on different columns in the heatmap to see the 1D signal for that dimension.
                Early dimensions (left) act like the "minute hand" of a clock, rapidly oscillating to distinguish nearby words.
                Later dimensions (right) act like the "hour hand", slowly shifting to provide long-range, global context.
            </div>
        </div>
    );
}
