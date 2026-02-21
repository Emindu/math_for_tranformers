"use client";
import React, { useState, useMemo } from 'react';
import { ShieldAlert, BarChart2, Info } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function PACBayesBoundLab() {
    const [empiricalRisk, setEmpiricalRisk] = useState(0.05);
    const [sampleSize, setSampleSize] = useState(1000); // n
    const [klDivergence, setKlDivergence] = useState(50); // KL(Q||P)
    const [delta, setDelta] = useState(0.05); // Confidence 1-delta

    // Calculate the complexity penalty term: sqrt( (KL + ln(n/delta)) / 2n )
    const complexityPenalty = useMemo(() => {
        const lnTerm = Math.log(sampleSize / delta);
        const numerator = klDivergence + lnTerm;
        const denominator = 2 * sampleSize;
        return Math.sqrt(numerator / denominator);
    }, [sampleSize, klDivergence, delta]);

    const trueRiskBound = Math.min(empiricalRisk + complexityPenalty, 1.0); // Bounded at 100% error

    // SVG dimensions for the Bar Chart
    const width = 300;
    const height = 400;

    // Height ratios
    const totalScale = 1.0; // Max Y axis is 1.0 (100% risk)
    const pxPerUnit = height / totalScale;

    const empiricalHeight = empiricalRisk * pxPerUnit;
    const penaltyHeight = complexityPenalty * pxPerUnit;
    // Ensure we don't draw past the top of the SVG box
    const visiblePenaltyHeight = Math.min(penaltyHeight, height - empiricalHeight);

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-full shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <BarChart2 className="text-purple-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">PAC-Bayes Risk Bound</h2>
                    <p className="text-slate-400 text-sm">Visualizing <Latex>{'$\\mathbb{E}_{\\theta \\sim Q} [R(\\theta)]$'}</Latex></p>
                </div>
            </div>

            <div className="flex-1 flex gap-8 mb-6">
                {/* The dynamic stacked bar chart */}
                <div className="w-1/3 bg-black rounded-xl border border-slate-800 relative flex items-end justify-center pb-8 pt-8 px-4">

                    {/* Y-Axis markers */}
                    <div className="absolute left-2 top-0 bottom-8 w-8 flex flex-col justify-between items-end text-[10px] text-slate-500 py-2 pr-2 border-r border-slate-700 pointer-events-none">
                        <span>1.0</span>
                        <span>0.75</span>
                        <span>0.5</span>
                        <span>0.25</span>
                        <span>0.0</span>
                    </div>

                    <div className="w-full max-w-[80px] relative">

                        {/* Complexity Penalty Bar (Top) */}
                        <div
                            className="w-full bg-purple-500/40 border border-purple-400/50 rounded-t-lg transition-all duration-300 relative group flex items-center justify-center"
                            style={{ height: `${visiblePenaltyHeight}px` }}
                        >
                            {visiblePenaltyHeight > 20 && (
                                <span className="text-purple-200 text-xs font-mono font-bold">
                                    +{complexityPenalty.toFixed(2)}
                                </span>
                            )}
                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-800 text-purple-200 text-xs p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity w-48 pointer-events-none z-10">
                                <strong>Complexity Penalty</strong><br />
                                <Latex>{'$\\sqrt{\\frac{\\text{KL}(Q\\|P) + \\ln(n/\\delta)}{2n}}$'}</Latex>
                            </div>
                        </div>

                        {/* Empirical Risk Bar (Bottom) */}
                        <div
                            className="w-full bg-blue-500 border border-blue-400 rounded-b-lg transition-all duration-300 relative group flex items-center justify-center"
                            style={{ height: `${empiricalHeight}px` }}
                        >
                            {empiricalHeight > 20 && (
                                <span className="text-blue-100 text-xs font-mono font-bold">
                                    {empiricalRisk.toFixed(2)}
                                </span>
                            )}
                            {/* Tooltip */}
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-800 text-blue-200 text-xs p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                <strong>Empirical Risk</strong> <Latex>{'$\\hat{R}_n(\\theta)$'}</Latex>
                            </div>
                        </div>

                        {/* Total Bound Line Marker */}
                        <div
                            className="absolute left-[-10px] right-[-10px] h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all duration-300 z-20"
                            style={{ bottom: `${empiricalHeight + visiblePenaltyHeight}px` }}
                        >
                            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 text-red-400 font-mono text-sm font-bold bg-slate-900 px-1 rounded">
                                ≤{trueRiskBound.toFixed(2)}
                            </div>
                        </div>

                    </div>

                    <div className="absolute bottom-2 text-xs font-bold text-slate-400">Risk Bound</div>
                </div>

                {/* Info panel */}
                <div className="w-2/3 flex flex-col justify-center gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <h3 className="text-slate-300 text-sm font-bold mb-2 flex items-center gap-2">
                            <ShieldAlert size={16} className="text-red-400" /> Maximum True Risk
                        </h3>
                        <div className="text-4xl font-mono text-white mb-1">
                            {trueRiskBound >= 1.0 ? '1.00+' : trueRiskBound.toFixed(3)}
                        </div>
                        <p className="text-xs text-slate-500 leading-tight">
                            With probability <Latex>{`$1-\\delta = ${(1 - delta).toFixed(2)}$`}</Latex>, the error on unseen data will not exceed this value.
                        </p>
                    </div>

                    <div className="bg-purple-900/10 rounded-xl p-4 border border-purple-500/20">
                        <h3 className="text-purple-300 text-sm font-bold mb-2 flex items-center gap-2">
                            <Info size={16} className="text-purple-400" /> Insight
                        </h3>
                        <p className="text-xs text-purple-200/70 leading-relaxed">
                            If your fine-tuned model (<Latex>{'$Q$'}</Latex>) diverges heavily from the pre-trained prior (<Latex>{'$P$'}</Latex>), <Latex>{'$\\text{KL}(Q\\|P)$'}</Latex> grows. To keep the True Risk bound tight, you must exponentially increase the Sample Size <Latex>{'$n$'}</Latex>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-5">

                {/* Empirical Risk */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            Empirical Training Risk (<Latex>{'$\\hat{R}_n$'}</Latex>)
                        </label>
                        <span className="text-blue-400 text-sm font-mono">{empiricalRisk.toFixed(3)}</span>
                    </div>
                    <input
                        type="range" min="0" max="0.5" step="0.01"
                        value={empiricalRisk}
                        onChange={(e) => setEmpiricalRisk(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                    />
                </div>

                {/* Sub-grid for KL and N */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                KL Divergence (<Latex>{'$\\text{KL}(Q\\|P)$'}</Latex>)
                            </label>
                            <span className="text-purple-400 text-sm font-mono">{klDivergence.toFixed(0)}</span>
                        </div>
                        <input
                            type="range" min="1" max="1500" step="1"
                            value={klDivergence}
                            onChange={(e) => setKlDivergence(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Distance from pre-trained prior</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                Sample Size (<Latex>{'$n$'}</Latex>)
                            </label>
                            <span className="text-emerald-400 text-sm font-mono">{sampleSize.toLocaleString()}</span>
                        </div>
                        <input
                            type="range" min="10" max="10000" step="10"
                            value={sampleSize}
                            onChange={(e) => setSampleSize(parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Amount of Fine-Tuning Data</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
