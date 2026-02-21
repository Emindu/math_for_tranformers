"use client";

import React, { useState } from 'react';
import { AlignCenter } from 'lucide-react';

export default function MutualInfoVennLab() {
    // correlation slider from 0 (independent) to 1 (perfectly correlated)
    const [correlation, setCorrelation] = useState(0.4);

    // Assume H(X) = 1 bit, H(Y) = 1 bit for simplicity
    const hX = 1.0;
    const hY = 1.0;
    const iXY = correlation; // I(X;Y) ranges from 0 to 1
    const hXgivenY = hX - iXY;
    const hYgivenX = hY - iXY;
    const jointH = hX + hYgivenX;

    // SVG parameters
    const width = 400;
    const height = 250;
    const R = 80; // Radius of circles
    const centerY = height / 2;

    // Map correlation 0->1 to distance between centers
    // 0 correlation -> centers are at least 2*R + 20 apart -> say 180
    // 1 correlation -> centers are 0 apart
    const maxDist = 2 * R + 20;
    const dist = maxDist * (1 - correlation);

    const cx1 = width / 2 - dist / 2;
    const cx2 = width / 2 + dist / 2;

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 z-10">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <AlignCenter className="text-blue-400" size={20} />
                    Information Diagram (Venn)
                </h3>
                <p className="text-slate-400 text-sm">Visualizing Entropy, Conditional Entropy, and Mutual Information</p>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 z-10 mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-slate-300 text-sm font-bold flex items-center gap-2">
                        Mutual Dependence / Overlap
                    </label>
                    <span className="text-blue-300 font-mono text-lg">{correlation.toFixed(2)} bits</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 h-8 max-w-sm">
                    Adjust how much information X and Y share. 0 = Independent, 1 = Perfectly correlated.
                </p>
                <input
                    type="range"
                    min="0" max="1" step="0.01"
                    value={correlation}
                    onChange={(e) => setCorrelation(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                />
            </div>

            {/* Venn Diagram SVG Area */}
            <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-[300px]">
                    <defs>
                        <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
                        </linearGradient>
                        <linearGradient id="gradY" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#be185d" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>

                    {/* Left Circle (X) */}
                    <circle cx={cx1} cy={centerY} r={R} fill="url(#gradX)" style={{ mixBlendMode: 'screen' }} />

                    {/* Right Circle (Y) */}
                    <circle cx={cx2} cy={centerY} r={R} fill="url(#gradY)" style={{ mixBlendMode: 'screen' }} />

                    {/* Labels within circles */}
                    {/* H(X|Y) position */}
                    <text x={cx1 - (correlation > 0.5 ? R / 3 : R / 4)} y={centerY} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                        H(X|Y)
                    </text>
                    <text x={cx1 - (correlation > 0.5 ? R / 3 : R / 4)} y={centerY + 20} fill="#93c5fd" fontSize="12" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
                        {hXgivenY.toFixed(2)}
                    </text>

                    {/* H(Y|X) position */}
                    <text x={cx2 + (correlation > 0.5 ? R / 3 : R / 4)} y={centerY} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                        H(Y|X)
                    </text>
                    <text x={cx2 + (correlation > 0.5 ? R / 3 : R / 4)} y={centerY + 20} fill="#f9a8d4" fontSize="12" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
                        {hYgivenX.toFixed(2)}
                    </text>

                    {/* Overlap I(X;Y) position */}
                    {correlation > 0.05 && (
                        <>
                            <text x={width / 2} y={centerY} fill="white" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                                I(X;Y)
                            </text>
                            <text x={width / 2} y={centerY + 20} fill="#f8fafc" fontSize="12" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
                                {iXY.toFixed(2)}
                            </text>
                        </>
                    )}
                </svg>

                {/* Independent label */}
                {correlation === 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-500 font-bold bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-sm">
                        Completely Independent
                    </div>
                )}
            </div>

            {/* Summary Stats Footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 z-10">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400 mb-1">Marginal H(X)</div>
                    <div className="font-mono font-bold text-blue-400">{hX.toFixed(2)}</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400 mb-1">Marginal H(Y)</div>
                    <div className="font-mono font-bold text-pink-400">{hY.toFixed(2)}</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400 mb-1">Joint H(X,Y)</div>
                    <div className="font-mono font-bold text-purple-400">{jointH.toFixed(2)}</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 text-center">
                    <div className="text-[10px] text-slate-400 mb-1">Mutual I(X;Y)</div>
                    <div className="font-mono font-bold text-white">{iXY.toFixed(2)}</div>
                </div>
            </div>

        </div>
    );
}
