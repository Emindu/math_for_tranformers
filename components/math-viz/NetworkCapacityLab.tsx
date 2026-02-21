"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Layers } from 'lucide-react';

export default function NetworkCapacityLab() {
    const [numLayers, setNumLayers] = useState<number>(3);
    const [hiddenUnits, setHiddenUnits] = useState<number>(128); // Width d_model

    // Calculate Parameters W
    // For simplicity, assume a standard MLP structure: n_in -> (d_model)*L -> n_out
    // Let's assume input dim = 512, output dim = 512 for a Sequence-to-Sequence block approx
    const d_in = 512;
    const d_out = 512;

    const inputParams = d_in * hiddenUnits;
    const hiddenParams = (numLayers - 1) * (hiddenUnits * hiddenUnits);
    const outputParams = hiddenUnits * d_out;
    const totalW = inputParams + hiddenParams + outputParams;

    // VC Dimension bounds Theorem 1.24 = O(W log W)
    // To make it visually plottable against W, we scale it
    const logW = Math.log2(Math.max(2, totalW));
    const vcBound = totalW * logW;

    // Formatting large numbers
    const formatNum = (n: number) => {
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
        return n.toString();
    };

    // Calculate dynamic heights for CSS
    // Let's cap the visual max around 100M for totalW to determine scale
    // Max W possible here: layer=24, hidden=2048 -> W = 512*2048 + 23*2048^2 + 2048*512 = ~98.5M
    const MAX_W = 100e6;
    const wHeightPercent = Math.min(100, (totalW / MAX_W) * 100);

    // Max VC bound possible: 100e6 * log2(100e6) ~= 100e6 * 26.5 ~= 2.65B
    const MAX_VC = 2.65e9;
    const vcHeightPercent = Math.min(100, (vcBound / MAX_VC) * 100);

    return (
        <div className="w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full relative">

            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white z-10">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Layers className="text-amber-500" />
                        Network Capacity Scaling
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Theorem 1.24: <Latex>{'$\\text{VC} = O(W \\log W)$'}</Latex></p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-center shadow-sm">
                        <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Total Parameters ($W$)</div>
                        <div className="text-lg font-mono font-bold text-amber-700">{formatNum(totalW)}</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-center shadow-sm">
                        <div className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">VC Capacity Bound</div>
                        <div className="text-lg font-mono font-bold text-rose-700">{formatNum(vcBound)}</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-8 z-10">

                {/* Visualizer Chart */}
                <div className="flex-1 min-h-[250px] bg-white rounded-2xl border border-slate-200 p-6 flex items-end justify-center gap-12 relative overflow-hidden shadow-inner">
                    {/* Background Grid */}
                    <svg className="absolute inset-0 w-full h-full opacity-50" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid3)" />
                    </svg>

                    {/* Bar 1: Parameters W */}
                    <div className="w-24 md:w-32 h-[200px] flex flex-col justify-end group z-10">
                        <div className="text-center font-bold text-amber-600 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">{formatNum(totalW)}</div>
                        <div className="w-full bg-amber-100 rounded-t-xl border-t border-x border-amber-300 relative overflow-hidden transition-all duration-500 ease-out flex items-end" style={{ height: `${Math.max(1, wHeightPercent)}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent"></div>
                            <div className="w-full bg-amber-400 h-1"></div>
                        </div>
                        <div className="text-center text-xs font-bold text-slate-500 mt-3 pt-2 border-t border-slate-200">Parameters<br />$W$</div>
                    </div>

                    {/* Bar 2: VC Bound */}
                    <div className="w-24 md:w-32 h-[200px] flex flex-col justify-end z-10 group">
                        <div className="text-center font-bold text-rose-600 mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">~{formatNum(vcBound)}</div>
                        <div className="w-full bg-rose-100 rounded-t-xl border-t border-x border-rose-300 relative overflow-hidden transition-all duration-500 ease-out flex items-end" style={{ height: `${Math.max(1, vcHeightPercent)}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-rose-400/20 to-transparent"></div>
                            <div className="w-full bg-rose-500 h-1"></div>
                        </div>
                        <div className="text-center text-xs font-bold text-slate-500 mt-3 pt-2 border-t border-slate-200">VC Capacity<br />$O(W \log W)$</div>
                    </div>

                </div>

                {/* Controls */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-slate-700">Network Depth ($L$)</label>
                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-mono text-slate-700 font-bold border border-slate-200">{numLayers} Layers</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="24"
                                step="1"
                                value={numLayers}
                                onChange={(e) => setNumLayers(Number(e.target.value))}
                                className="w-full accent-slate-600"
                            />
                            <p className="text-[11px] text-slate-400 mt-2">Number of sequential transformer blocks.</p>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-sm font-semibold text-slate-700">Hidden Width (<Latex>{'$d_{\\text{model}}$'}</Latex>)</label>
                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm font-mono text-slate-700 font-bold border border-slate-200">{hiddenUnits} Units</span>
                            </div>
                            <input
                                type="range"
                                min="64"
                                max="2048"
                                step="64"
                                value={hiddenUnits}
                                onChange={(e) => setHiddenUnits(Number(e.target.value))}
                                className="w-full accent-slate-600"
                            />
                            <p className="text-[11px] text-slate-400 mt-2">Dimensionality of the representations.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
