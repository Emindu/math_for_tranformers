"use client";

import React, { useState } from 'react';
import { Network, Info } from 'lucide-react';

export default function AttentionInfoLab() {
    // Two simplified simulated attention heads
    const [activeHead, setActiveHead] = useState<1 | 2>(1);

    const tokens = ["The", "cat", "sat", "on", "the", "mat"];

    // Head 1: Local Context (High MI with adjacent tokens)
    const head1Matrix = [
        [0.9, 0.4, 0.1, 0.0, 0.0, 0.0],
        [0.4, 0.9, 0.4, 0.1, 0.0, 0.0],
        [0.1, 0.4, 0.9, 0.4, 0.1, 0.0],
        [0.0, 0.1, 0.4, 0.9, 0.4, 0.1],
        [0.0, 0.0, 0.1, 0.4, 0.9, 0.4],
        [0.0, 0.0, 0.0, 0.1, 0.4, 0.9],
    ];

    // Head 2: Syntactic/Semantic Links 
    // e.g. "cat" -> "sat" (Subject-Verb)
    // "on" -> "mat" (Preposition-Object)
    const head2Matrix = [
        [0.8, 0.8, 0.1, 0.0, 0.0, 0.0],
        [0.8, 0.9, 0.9, 0.0, 0.0, 0.1],
        [0.1, 0.9, 0.8, 0.2, 0.1, 0.0],
        [0.0, 0.0, 0.2, 0.6, 0.7, 0.9],
        [0.0, 0.0, 0.1, 0.7, 0.8, 0.9],
        [0.0, 0.1, 0.0, 0.9, 0.9, 0.9],
    ];

    const currentMatrix = activeHead === 1 ? head1Matrix : head2Matrix;

    // We can allow users to hover over a cell to see the exact Mutual Information I(x_i; y_j | context)
    const [hoverInfo, setHoverInfo] = useState<{ x: number, y: number, val: number } | null>(null);

    // Color gradient for the heatmap based on value (0 to 1)
    // 0 = dark blue/slate, 1 = bright cyan/teal
    const getBgColor = (val: number) => {
        // Linear interpolation from slate-800 to teal-400
        const intensity = Math.round(val * 100);
        return `color-mix(in srgb, #2dd4bf ${intensity}%, transparent)`;
    };

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Network className="text-teal-400" size={20} />
                        Attention Mutual Information
                    </h3>
                    <p className="text-slate-400 text-sm">Visualizing <span className="font-mono bg-slate-800 px-1 rounded">I(x_i; y_j | ctx)</span> across attention heads</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 z-10 mb-8 flex gap-4">
                <button
                    onClick={() => setActiveHead(1)}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${activeHead === 1 ? 'bg-teal-500 text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Head 1: Local Context
                </button>
                <button
                    onClick={() => setActiveHead(2)}
                    className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${activeHead === 2 ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Head 2: Syntactic Links
                </button>
            </div>

            {/* Heatmap Area */}
            <div className="flex-1 flex flex-col justify-center items-center relative py-6 overflow-x-auto">
                <div className="relative">
                    {/* Y-Axis labels (Output Tokens Y) */}
                    <div className="absolute -left-12 top-10 bottom-0 flex flex-col justify-between py-4">
                        {tokens.map((t, i) => (
                            <div key={`y-${i}`} className="text-xs font-mono text-slate-400 h-10 flex items-center justify-end pr-2 w-10">
                                {t}
                            </div>
                        ))}
                    </div>
                    {/* Main Grid */}
                    <div className="grid grid-cols-6 gap-1 p-2 bg-slate-800 rounded-xl border border-slate-700">
                        {/* X-Axis labels (Input Tokens X) */}
                        <div className="col-span-6 grid grid-cols-6 gap-1 mb-2">
                            {tokens.map((t, i) => (
                                <div key={`x-${i}`} className="text-xs font-mono text-slate-400 text-center w-10 md:w-14">
                                    {t}
                                </div>
                            ))}
                        </div>

                        {/* Matrix Cells */}
                        {currentMatrix.map((row, y) => (
                            <React.Fragment key={`row-${y}`}>
                                {row.map((val, x) => (
                                    <div
                                        key={`cell-${x}-${y}`}
                                        className="w-10 h-10 md:w-14 md:h-14 rounded-md cursor-pointer transition-all duration-300 border border-slate-700/50 hover:border-white hover:scale-110 relative z-10"
                                        style={{ backgroundColor: getBgColor(val), opacity: val < 0.1 ? 0.3 : 1 }}
                                        onMouseEnter={() => setHoverInfo({ x, y, val })}
                                        onMouseLeave={() => setHoverInfo(null)}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Axis Titles */}
                    <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-bold text-slate-500 tracking-widest uppercase">
                        Output Y
                    </div>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-500 tracking-widest uppercase">
                        Input X
                    </div>
                </div>
            </div>

            {/* Hover Info Panel */}
            <div className="h-16 mt-8 flex items-center justify-center">
                {hoverInfo ? (
                    <div className="bg-slate-800 px-6 py-3 rounded-xl border border-slate-600 flex items-center gap-4 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                        <Info className="text-teal-400" size={20} />
                        <div className="text-slate-300 text-sm">
                            <span className="font-mono text-slate-400">I(</span>
                            <span className="text-blue-300 font-bold font-mono">"{tokens[hoverInfo.x]}"</span>
                            <span className="font-mono text-slate-400"> ; </span>
                            <span className="text-purple-300 font-bold font-mono">"{tokens[hoverInfo.y]}"</span>
                            <span className="font-mono text-slate-400">) = </span>
                            <span className="text-white font-mono font-bold text-lg">{hoverInfo.val.toFixed(2)}</span>
                            <span className="text-slate-500 text-xs ml-2">bits</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm italic">
                        Hover over the heatmap cells to inspect the mutual information between tokens.
                    </div>
                )}
            </div>

        </div>
    );
}
