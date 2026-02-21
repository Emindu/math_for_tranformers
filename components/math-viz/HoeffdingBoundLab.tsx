"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { LineChart } from 'lucide-react';

export default function HoeffdingBoundLab() {
    const [epsilon, setEpsilon] = useState<number>(0.1);
    const [sampleSizeN, setSampleSizeN] = useState<number>(50);

    // Hoeffding's Inequality: P(|R - R_n| > e) <= 2 * exp(-2 * n * e^2)
    const probBound = 2 * Math.exp(-2 * sampleSizeN * Math.pow(epsilon, 2));

    // We cap the probability at 1.0 (100%) since bounds > 1 are just trivially true but not useful visually
    const displayProb = Math.min(1.0, probBound);
    const confidence = 1.0 - displayProb;

    // Generate curve data for N
    const nValues = Array.from({ length: 40 }, (_, i) => (i + 1) * 20); // 20 to 800

    return (
        <div className="w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col h-full text-slate-200 p-6 relative">

            <div className="mb-6 z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                    <LineChart className="text-rose-400" />
                    Hoeffding's Inequality Visualization
                </h3>
                <p className="text-slate-400 text-sm">Theorem 1.22: Bounding the Generalization Error</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-6 items-center justify-between z-10">
                <div className="flex-1 text-center md:text-left">
                    <div className="text-sm text-slate-400 mb-1">Probability of Error &gt; $\epsilon$ is bounded by:</div>
                    <div className="text-lg font-mono text-rose-400 font-bold bg-rose-950/30 px-3 py-2 rounded-lg inline-block border border-rose-900/50">
                        <Latex>{"$$P(|R - \\hat{R}_n| > \\epsilon) \\le \\mathbf{2\\exp(-2n\\epsilon^2)}$$"}</Latex>
                    </div>
                </div>

                <div className="flex-1 w-full bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Calculated Bound</div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-black text-white">{(displayProb * 100).toFixed(1)}%</span>
                        <span className="text-sm text-slate-500 mb-1">Max Failure Rate</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className="bg-rose-500 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${displayProb * 100}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-emerald-400 mt-2 font-medium">
                        Model Confidence (1 - Bound): {(confidence * 100).toFixed(1)}%
                    </div>
                </div>
            </div>

            {/* Interactive Graph */}
            <div className="flex-1 relative mb-6 bg-slate-950 rounded-xl border border-slate-800 p-4 grid grid-cols-1 md:grid-cols-3 gap-6 z-10">

                {/* Controls */}
                <div className="col-span-1 flex flex-col gap-6 justify-center">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-sky-400">Error Margin ($\epsilon$)</label>
                            <span className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">{(epsilon).toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min="0.01"
                            max="0.25"
                            step="0.01"
                            value={epsilon}
                            onChange={(e) => setEpsilon(Number(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-2">Tolerance for difference between True and Empirical risk.</p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-emerald-400">Sample Size ($n$)</label>
                            <span className="text-sm font-mono text-white bg-slate-900 px-2 py-1 rounded">{sampleSizeN}</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="800"
                            step="10"
                            value={sampleSizeN}
                            onChange={(e) => setSampleSizeN(Number(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-2">Number of training data points available.</p>
                    </div>
                </div>

                {/* Density Plot Metaphor */}
                <div className="col-span-2 relative min-h-[200px] flex items-end ml-4 border-l border-b border-slate-700 pb-2">

                    {/* Y-Axis Label */}
                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Probability Bound
                    </div>
                    {/* X-Axis Label */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Sample Size $n$
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full flex items-end">
                        {nValues.map((n, idx) => {
                            const bound = 2 * Math.exp(-2 * n * Math.pow(epsilon, 2));
                            const cappedBound = Math.min(1.0, bound);
                            // height %
                            const height = cappedBound * 100;
                            const isCurrentN = Math.abs(n - sampleSizeN) < 20;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative px-[1px]">
                                    {/* Hover tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] font-mono p-1 rounded z-20 whitespace-nowrap border border-slate-600">
                                        n={n}: {(cappedBound * 100).toFixed(1)}%
                                    </div>

                                    <div
                                        className={`w-full rounded-t-sm transition-all duration-300 ${isCurrentN ? 'bg-rose-400' : 'bg-rose-900/40 group-hover:bg-rose-700/60'
                                            }`}
                                        style={{ height: `${height}%` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Indicator line for current N */}
                    <div
                        className="absolute bottom-0 w-0.5 bg-emerald-400 h-full transition-all duration-200 z-10 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        style={{ left: `${(sampleSizeN / 800) * 100}%` }}
                    >
                        <div className="absolute top-0 -translate-x-1/2 -translate-y-full bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                            Current $n$: {sampleSizeN}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-rose-500/10 blur-[100px] pointer-events-none z-0 rounded-full"></div>

        </div>
    );
}
