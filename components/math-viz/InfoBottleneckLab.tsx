"use client";

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceDot, Tooltip } from 'recharts';
import { Filter } from 'lucide-react';

export default function InfoBottleneckLab() {
    // Beta: trade-off parameter. Higher beta = care more about prediction I(Z;Y). Lower beta = care more about compression I(Z;X).
    const [beta, setBeta] = useState(1.0);

    // Simulated optimal frontier (Information curve)
    // equation for illustrative curve: I(Z;Y) = 1 - e^(-2 * I(Z;X))
    // We want a curve that maps compression (x-axis) to relevance (y-axis).
    const generateFrontier = () => {
        const data = [];
        for (let ix = 0.05; ix <= 2.0; ix += 0.05) {
            const iy = 1 - Math.exp(-2.5 * ix);
            data.push({
                ix: Number(ix.toFixed(2)),
                iy: Number(iy.toFixed(2))
            });
        }
        return data;
    };
    const frontierData = generateFrontier();

    // Find the "optimal" point on the frontier for the current Beta.
    // We wish to maximize: I(Z;Y) - (1/Beta) * I(Z;X)
    let bestPoint = frontierData[0];
    let maxLagrangian = -Infinity;

    for (const pt of frontierData) {
        // Objective: max I(Z;Y) - (1/beta) * I(Z;X) 
        // Note: Tishby uses Min I(Z;X) - beta * I(Z;Y). These are equivalent formulations.
        // If beta is very large (e.g. 5), we heavily weight I(Z;Y), pushing point to right.
        // If beta is very small (e.g. 0.1), we heavily weight compression, pushing point left.
        const objective = pt.iy - (1 / beta) * pt.ix;
        if (objective > maxLagrangian) {
            maxLagrangian = objective;
            bestPoint = pt;
        }
    }

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <Filter className="text-fuchsia-400" size={20} />
                        Information Bottleneck
                    </h3>
                    <p className="text-slate-400 text-sm">Balancing Compression vs. Relevance</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 z-10 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-slate-300 text-sm font-bold flex items-center gap-2">
                        Trade-off Parameter <span className="bg-slate-900 px-1 py-0.5 rounded text-xs font-mono border border-slate-700">β (Beta)</span>
                    </label>
                    <span className="text-fuchsia-300 font-mono text-lg">{beta.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">
                    <span>← More Compression</span>
                    <span>More Relevance →</span>
                </div>
                <input
                    type="range"
                    min="0.2" max="5.0" step="0.1"
                    value={beta}
                    onChange={(e) => setBeta(parseFloat(e.target.value))}
                    className="w-full accent-fuchsia-500"
                />
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={frontierData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                        {/* X-Axis: Compression I(Z;X) */}
                        <XAxis
                            dataKey="ix"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            domain={[0, 2]}
                            type="number"
                            label={{ value: "I(Z;X) Retention of Input (Bits) →", position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
                        />

                        {/* Y-Axis: Relevance I(Z;Y) */}
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            domain={[0, 1.2]}
                            label={{ value: "I(Z;Y) Relevance to Task ↑", angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />

                        {/* Theoretical Limit Curve */}
                        <Line
                            type="monotone"
                            dataKey="iy"
                            name="Optimal Frontier"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive={false}
                        />

                        {/* Current Operating Point based on Beta */}
                        <ReferenceDot
                            x={bestPoint.ix}
                            y={bestPoint.iy}
                            r={8}
                            fill="#d946ef"
                            stroke="#ffffff"
                            strokeWidth={2}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Active Point Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 z-10">
                <div className={`p-4 rounded-xl border transition-colors ${beta < 1.0 ? 'bg-indigo-900/50 border-indigo-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Compression Phase</div>
                    <div className="text-sm text-slate-300">
                        <span className="text-2xl font-mono font-bold text-indigo-400">{bestPoint.ix.toFixed(2)}</span> bits
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Information retained about input.</div>
                </div>
                <div className={`p-4 rounded-xl border transition-colors ${beta >= 1.0 ? 'bg-fuchsia-900/50 border-fuchsia-500/50' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Relevance Phase</div>
                    <div className="text-sm text-slate-300">
                        <span className="text-2xl font-mono font-bold text-fuchsia-400">{bestPoint.iy.toFixed(2)}</span> bits
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Predictive power for the output.</div>
                </div>
            </div>

        </div>
    );
}
