import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';

function generateNormalData(mean: number, stdDev: number) {
    const data = [];
    const minVal = -10;
    const maxVal = 10;
    const step = 0.5;

    for (let x = minVal; x <= maxVal; x += step) {
        // PDF of Normal Distribution
        const exponent = -((x - mean) ** 2) / (2 * (stdDev ** 2));
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
        data.push({
            x: Number(x.toFixed(1)), // For cleaner labels
            y: y,
            expected: x === Math.round(mean) ? y : null // Highlight expected point
        });
    }
    return data;
}

export default function RandomVariablesLab() {
    const [mean, setMean] = useState<number>(0);
    const [variance, setVariance] = useState<number>(2); // Storing variance, but stdDev is sqrt(variance)

    const stdDev = Math.sqrt(variance);
    const data = generateNormalData(mean, stdDev);

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6">
                <h3 className="text-white font-bold text-lg">Random Variables &amp; Moments</h3>
                <p className="text-slate-400 text-sm">Visualizing the First Moment (Mean) and Second Central Moment (Variance)</p>
            </div>

            {/* Controls Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Expectation / Mean Slider */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-indigo-400 text-sm font-bold flex items-center gap-2">
                            Expectation <span className="bg-slate-900 px-1 py-0.5 rounded text-xs font-mono border border-slate-700">E[X] / μ</span>
                        </label>
                        <span className="text-indigo-300 font-mono text-lg">{mean.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        The "center of mass" or first moment. Translates the distribution along the x-axis.
                    </p>
                    <input
                        type="range"
                        min="-5" max="5" step="0.5"
                        value={mean}
                        onChange={(e) => setMean(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                    />
                </div>

                {/* Variance Slider */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-rose-400 text-sm font-bold flex items-center gap-2">
                            Variance <span className="bg-slate-900 px-1 py-0.5 rounded text-xs font-mono border border-slate-700">Var(X) / σ²</span>
                        </label>
                        <span className="text-rose-300 font-mono text-lg">{variance.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        The spread or second central moment. Dictates how far outcomes stretch from the mean.
                    </p>
                    <input
                        type="range"
                        min="0.5" max="10" step="0.5"
                        value={variance}
                        onChange={(e) => setVariance(parseFloat(e.target.value))}
                        className="w-full accent-rose-500"
                    />
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDistribution" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="x"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8' }}
                            domain={[-10, 10]}
                            type="number"
                        />
                        <YAxis
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8' }}
                            domain={[0, 0.8]} // Keep fixed so height changes are obvious
                            hide={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

                        <Area
                            type="monotone"
                            dataKey="y"
                            stroke="#818cf8"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorDistribution)"
                            isAnimationActive={false}
                        />

                        {/* Mean Line (E[X]) */}
                        <ReferenceLine
                            x={mean}
                            stroke="#818cf8"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            label={{ position: 'top', value: 'E[X]', fill: '#818cf8', fontSize: 12, fontWeight: 'bold' }}
                        />

                        {/* StdDev Line (Visualizing spread) */}
                        <ReferenceLine
                            segment={[{ x: mean, y: generateNormalData(mean, stdDev).find(d => d.x === mean)?.y! / 2 }, { x: mean + stdDev, y: generateNormalData(mean, stdDev).find(d => d.x === mean)?.y! / 2 }]}
                            stroke="#fb7185"
                            strokeWidth={2}
                        />
                        <ReferenceLine
                            segment={[{ x: mean, y: generateNormalData(mean, stdDev).find(d => d.x === mean)?.y! / 2 }, { x: mean - stdDev, y: generateNormalData(mean, stdDev).find(d => d.x === mean)?.y! / 2 }]}
                            stroke="#fb7185"
                            strokeWidth={2}
                        />

                    </AreaChart>
                </ResponsiveContainer>

                {/* Standard Deviation Label Helper */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-4 ml-6 pointer-events-none">
                    <span className="text-rose-400 text-xs font-mono font-bold">← √Var(X) →</span>
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-slate-500 text-xs italic">
                    The Normal distribution curve mathematically is defined by its first two moments: <br />The Mean dictates position, and the Variance dictates width/height scale.
                </p>
            </div>

        </div>
    );
}
