import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Helper to generate a normal distribution curve
function normalPdf(x: number, mean: number, variance: number) {
    const stdDev = Math.sqrt(variance);
    const exponent = -((x - mean) ** 2) / (2 * variance);
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export default function BayesianInferenceLab() {
    // Prior parameters: Belief before seeing evidence
    const [priorMean, setPriorMean] = useState<number>(0);
    const priorVariance = 2;

    // Likelihood parameters: The evidence observed
    const [likelihoodMean, setLikelihoodMean] = useState<number>(5);
    const likelihoodVariance = 1.5;

    // Calculate Posterior parameters analytically (product of two Gaussians)
    // Posterior Variance = 1 / (1/PriorVar + 1/LikeVar)
    // Posterior Mean = PostVar * (PriorMean/PriorVar + LikeMean/LikeVar)
    const posteriorVariance = 1 / ((1 / priorVariance) + (1 / likelihoodVariance));
    const posteriorMean = posteriorVariance * ((priorMean / priorVariance) + (likelihoodMean / likelihoodVariance));

    const data = useMemo(() => {
        const d = [];
        for (let x = -10; x <= 15; x += 0.5) {
            d.push({
                x: Number(x.toFixed(1)),
                prior: normalPdf(x, priorMean, priorVariance),
                // Scale likelihood simply for visual comparison so it fits on same chart well
                likelihood: normalPdf(x, likelihoodMean, likelihoodVariance) * 0.8,
                posterior: normalPdf(x, posteriorMean, posteriorVariance)
            });
        }
        return d;
    }, [priorMean, likelihoodMean, posteriorMean, posteriorVariance]);

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6">
                <h3 className="text-white font-bold text-lg">Bayesian Inference</h3>
                <p className="text-slate-400 text-sm">Visualizing Bayes' Theorem: P(A|B) ∝ P(B|A) · P(A)</p>
            </div>

            {/* Controls Layer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Prior Belief */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-indigo-500/30">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-indigo-400 text-sm font-bold flex items-center gap-2">
                            Prior Belief <span className="bg-slate-900 px-1 py-0.5 rounded text-xs font-mono border border-slate-700">P(A)</span>
                        </label>
                        <span className="text-indigo-300 font-mono text-lg">{priorMean.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        Where you initially believe the true value lies before seeing any data.
                    </p>
                    <input
                        type="range"
                        min="-5" max="5" step="0.5"
                        value={priorMean}
                        onChange={(e) => setPriorMean(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500"
                    />
                </div>

                {/* Likelihood (Evidence) */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-amber-500/30">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-amber-400 text-sm font-bold flex items-center gap-2">
                            Observed Evidence <span className="bg-slate-900 px-1 py-0.5 rounded text-xs font-mono border border-slate-700">P(B|A)</span>
                        </label>
                        <span className="text-amber-300 font-mono text-lg">{likelihoodMean.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 h-8">
                        The new incoming data. Adjust to see how it "pulls" your prior belief.
                    </p>
                    <input
                        type="range"
                        min="-5" max="10" step="0.5"
                        value={likelihoodMean}
                        onChange={(e) => setLikelihoodMean(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                    />
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrior" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLike" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="x"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8' }}
                            domain={[-10, 15]}
                            type="number"
                        />
                        <YAxis hide={true} domain={[0, 0.6]} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                            formatter={(value: number, name: string) => [value.toFixed(3), name]}
                        />
                        <Legend verticalAlign="top" height={36} />

                        {/* The Curves */}
                        <Area type="monotone" dataKey="prior" name="Prior P(A)" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorPrior)" />
                        <Area type="monotone" dataKey="likelihood" name="Likelihood P(B|A)" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorLike)" />
                        <Area type="monotone" dataKey="posterior" name="Posterior P(A|B)" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPost)" />

                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center bg-emerald-900/30 p-3 rounded-lg border border-emerald-500/20">
                <p className="text-emerald-400 font-bold mb-1">
                    Posterior Mean: {posteriorMean.toFixed(2)}
                </p>
                <p className="text-emerald-300 text-xs italic">
                    The Posterior is a compromise between the Prior and the Likelihood. <br />
                    Notice how the Posterior curve is taller and narrower—certainty increases when you combine information!
                </p>
            </div>

        </div>
    );
}
