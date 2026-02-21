"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';

export default function GeneralizationBoundsLab() {
    // Sliders
    const [sampleSize, setSampleSize] = useState(100); // m

    // Generate simulated data based on Capacity (VC Dimension proxy)
    const generateData = () => {
        const data = [];
        for (let capacity = 1; capacity <= 100; capacity += 2) {
            // Simulated Training Error: exponential decay as capacity increases
            const trainingError = Math.exp(-0.06 * capacity);

            // Simulated Generalization Gap: O(sqrt( capacity / m )) 
            const gap = 2.5 * Math.sqrt(capacity / sampleSize);

            // True Generalization Error (Test Error)
            const generalizationError = trainingError + gap;

            data.push({
                capacity,
                trainingError: Number(trainingError.toFixed(3)),
                generalizationError: Number(generalizationError.toFixed(3)),
                gap: Number(gap.toFixed(3))
            });
        }
        return data;
    };

    const chartData = generateData();

    // Find the optimal capacity (lowest generalization error)
    let optimalCapacity = chartData[0];
    for (const pt of chartData) {
        if (pt.generalizationError < optimalCapacity.generalizationError) {
            optimalCapacity = pt;
        }
    }

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                    <LineChartIcon className="text-rose-400" size={20} />
                    PAC Bounds & Overfitting
                </h3>
                <p className="text-slate-400 text-sm">Visualizing Theorem 1.20: The trade-off between Model Capacity and Sample Size.</p>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-6 backdrop-blur-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300 font-semibold tracking-wide">Sample Size ($m$)</span>
                    <span className="text-rose-300 font-mono font-bold bg-rose-900/30 px-2 py-0.5 rounded">{sampleSize} samples</span>
                </div>
                <input
                    type="range"
                    min="20"
                    max="500"
                    step="10"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>Low Data (Overfits easily)</span>
                    <span>High Data (Generalizes well)</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-[250px] relative w-full pt-4 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="capacity"
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 1.5]}
                            hide={true} // Relative errors, no need for exact Y numbers
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                            itemStyle={{ fontWeight: 600 }}
                            formatter={(value: any, name: any) => [
                                Number(value).toFixed(3),
                                name === 'trainingError' ? 'Empirical Risk (Train)' : 'True Risk (Test)'
                            ]}
                            labelFormatter={(label) => `Model Capacity (VC dim): ${label}`}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                        />

                        {/* Training Error: goes down */}
                        <Line
                            type="monotone"
                            dataKey="trainingError"
                            name="Empirical Risk (Train)"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                            isAnimationActive={false}
                        />

                        {/* Generalization Error: goes down then up (U shape) */}
                        <Line
                            type="monotone"
                            dataKey="generalizationError"
                            name="True Risk (Generalization)"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }}
                            isAnimationActive={false}
                        />

                        {/* Gap Area highlight (optional simulated area) */}
                    </LineChart>
                </ResponsiveContainer>

                {/* Annotations */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-end">
                    <div className="w-full flex justify-between text-[10px] text-slate-500 font-mono px-8 pb-1">
                        <span>Underfitting</span>
                        <span>{"$d_{VC}$"} Capacity</span>
                        <span>Overfitting</span>
                    </div>
                </div>
            </div>

            {/* Optimal Point Info */}
            <div className="mt-4 bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <h4 className="text-rose-200 text-sm font-semibold">Optimal Model Complexity</h4>
                    <p className="text-rose-400/80 text-xs mt-1 max-w-[200px]">Sweet spot before the generalization bound dominates.</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold font-mono text-rose-400">{optimalCapacity.capacity}</span>
                    <span className="text-[10px] text-rose-500 uppercase tracking-widest font-bold">VC Dimension</span>
                </div>
            </div>
        </div>
    );
}
