"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { AlertTriangle, Activity } from 'lucide-react';

export default function TransformerRademacherBoundLab() {
    // Transformer Complexity Proxies
    const [numHeads, setNumHeads] = useState<number>(12); // Attention Heads
    const [numLayers, setNumLayers] = useState<number>(12); // Transformer Blocks
    const [sampleSizeN, setSampleSizeN] = useState<number>(10000); // Dataset Size

    // Empirical Risk is usually driven down to near 0 for heavy networks
    const empiricalRisk = 0.05;

    // Calculate structural complexity (Proxy for Rademacher Complexity term)
    // The true Rademacher bound scales roughly with the spectral norm of weight matrices, 
    // depth (L), and width (h). 
    // We create a bounded visual proxy: R_n(H) ~ (Layers * sqrt(Heads)) / sqrt(N)
    const complexityTerm = (numLayers * Math.sqrt(numHeads)) * 0.05;

    // Rademacher Bound Term: 2 * R_n(H)
    const rademacherTerm = 2 * (complexityTerm / Math.sqrt(Math.max(1, sampleSizeN / 1000)));

    // Confidence Term: O(1 / sqrt(n))
    const confidenceTerm = 0.5 / Math.sqrt(Math.max(1, sampleSizeN / 1000));

    // True Risk Bound = Empirical Risk + Rademacher Penalty + Confidence Penalty
    const trueRiskBound = empiricalRisk + rademacherTerm + confidenceTerm;

    // Formatting for the visual bars (cap at 1.0 or 100%)
    const maxBound = 1.0;
    const empiricalPercent = Math.min(100, (empiricalRisk / maxBound) * 100);
    const rademacherPercent = Math.min(100, (rademacherTerm / maxBound) * 100);
    const confidencePercent = Math.min(100, (confidenceTerm / maxBound) * 100);

    // Is the bound useless? (e.g. > 100% error means we guarantee nothing)
    const isLooseBound = trueRiskBound > 1.0;

    return (
        <div className="w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col h-full relative">
            <div className="p-6 border-b border-slate-200 bg-white">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Activity className="text-fuchsia-500" />
                    Transformer Generalization Bound
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Visualizing <Latex>{'$R(h) \\le \\hat{R}_n(h) + 2 \\hat{\\mathcal{R}}_n(\\mathcal{H}) + O(1/\\sqrt{n})$'}</Latex>
                </p>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-8">

                {/* The Stacked Bar Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 p-8 relative shadow-inner">

                    {/* Y-Axis scale markers */}
                    <div className="absolute left-0 top-8 bottom-8 w-12 flex flex-col justify-between items-end pr-2 text-[10px] font-bold text-slate-400 font-mono">
                        <span>1.0</span>
                        <span>0.75</span>
                        <span>0.50</span>
                        <span>0.25</span>
                        <span>0.0</span>
                    </div>

                    <div className="ml-12 h-[250px] flex items-end justify-center gap-8 md:gap-16">

                        {/* Bar 1: Empirical Risk */}
                        <div className="w-20 md:w-32 h-full flex flex-col justify-end group cursor-help">
                            <div className="text-center text-xs font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Latex>{'$\\hat{R}_n$'}</Latex>: {empiricalRisk.toFixed(2)}
                            </div>
                            <div className="w-full bg-slate-200 rounded-t-xl border-t border-x border-slate-300 relative transition-all duration-500 ease-out flex items-end" style={{ height: `${Math.max(2, empiricalPercent)}%` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-400/20 to-transparent"></div>
                                <div className="w-full bg-slate-400 h-1"></div>
                            </div>
                            <div className="text-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Train Error</div>
                        </div>

                        {/* Bar 2: True Risk Bound (Stacked) */}
                        <div className="w-20 md:w-32 h-full flex flex-col justify-end group cursor-help relative">

                            {isLooseBound && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded-lg border border-rose-200 flex items-center gap-1 z-20 shadow-sm animate-pulse">
                                    <AlertTriangle size={12} /> Bound Useless (&gt;1.0)
                                </div>
                            )}

                            <div className="text-center text-xs font-bold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 w-full">
                                <Latex>{'$R(h)$'}</Latex> Bound
                            </div>

                            <div className="w-full flex flex-col justify-end relative h-full">
                                {/* Stack 3: Confidence O(1/sqrt(n)) */}
                                <div className="w-full bg-sky-100 rounded-t-xl border-t border-x border-sky-300 relative transition-all duration-500 ease-out"
                                    style={{ height: `${Math.max(0, confidencePercent)}%` }}>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">Conf</div>
                                </div>

                                {/* Stack 2: Rademacher term */}
                                <div className="w-full bg-fuchsia-100 border-t border-x border-fuchsia-300 relative transition-all duration-500 ease-out"
                                    style={{ height: `${Math.max(0, rademacherPercent)}%` }}>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity"><Latex>{'$2\\hat{\\mathcal{R}}_n$'}</Latex></div>
                                </div>

                                {/* Stack 1: Base Empirical Risk */}
                                <div className="w-full bg-slate-200 border-t border-x border-slate-300 relative transition-all duration-500 ease-out"
                                    style={{ height: `${Math.max(2, empiricalPercent)}%` }}>
                                </div>
                            </div>

                            <div className="text-center text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">Generalization<br />Bound</div>
                            <div className="absolute h-[1px] w-full border-t border-dashed border-slate-300 -left-full top-0 pointer-events-none opacity-50"></div>
                        </div>

                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                    {/* Depth */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Layers ($L$)</label>
                            <span className="font-mono text-xs font-bold text-fuchsia-600">{numLayers}</span>
                        </div>
                        <input
                            type="range" min="1" max="96" step="1"
                            value={numLayers} onChange={(e) => setNumLayers(Number(e.target.value))}
                            className="w-full accent-fuchsia-500"
                        />
                    </div>

                    {/* Width / Heads */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Attention Heads</label>
                            <span className="font-mono text-xs font-bold text-fuchsia-600">{numHeads}</span>
                        </div>
                        <input
                            type="range" min="1" max="128" step="1"
                            value={numHeads} onChange={(e) => setNumHeads(Number(e.target.value))}
                            className="w-full accent-fuchsia-500"
                        />
                    </div>

                    {/* Data Size */}
                    <div className="flex flex-col md:col-span-2 lg:col-span-1">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-[#94a3b8]">Sample Size ($n$)</label>
                            <span className="font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{sampleSizeN.toLocaleString()}</span>
                        </div>
                        <input
                            type="range" min="1000" max="1000000" step="1000"
                            value={sampleSizeN} onChange={(e) => setSampleSizeN(Number(e.target.value))}
                            className="w-full accent-sky-500"
                        />
                    </div>

                </div>

                <p className="text-sm text-slate-500 text-center px-4">
                    Scaling the <strong className="text-fuchsia-600">Transformer size</strong> increases the Rademacher penalty. You must exponentially scale the <strong className="text-sky-600">Sample Size</strong> to maintain a tight generalization bound on the True Risk.
                </p>
            </div>
        </div>
    );
}
