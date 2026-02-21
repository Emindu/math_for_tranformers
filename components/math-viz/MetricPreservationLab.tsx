"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────── Helpers ─────────────── */

function softmax(values: number[]): number[] {
    const max = Math.max(...values);
    const exps = values.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}

function dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function euclideanDist(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

/* ─────────────── Presets ─────────────── */

interface Preset {
    name: string;
    tokens: string[];
    embeddings: number[][];
    description: string;
}

const PRESETS: Preset[] = [
    {
        name: "Similar Tokens",
        tokens: ["king", "queen", "castle"],
        embeddings: [[0.9, 0.8], [0.85, 0.75], [0.1, 0.3]],
        description: '"king" and "queen" are close; "castle" is far',
    },
    {
        name: "Uniform Spread",
        tokens: ["cat", "dog", "fish"],
        embeddings: [[1, 0], [0, 1], [-0.7, -0.7]],
        description: "Three tokens spread roughly equally apart",
    },
    {
        name: "Cluster + Outlier",
        tokens: ["relu", "gelu", "dropout"],
        embeddings: [[0.5, 0.5], [0.55, 0.45], [-0.8, 0.2]],
        description: '"relu" and "gelu" cluster together; "dropout" is distant',
    },
];

/* ─────────────── Main component ─────────────── */

export default function MetricPreservationLab() {
    const [preset, setPreset] = useState(0);
    const [dk, setDk] = useState(2);
    const [numHeads, setNumHeads] = useState(1);

    const { tokens, embeddings, description } = PRESETS[preset];
    const n = tokens.length;
    const dim = embeddings[0].length;

    // Q = K = V = embeddings (self-attention)
    const Q = embeddings;
    const K = embeddings;
    const V = embeddings;

    // Compute per-head attention (simulate multiple heads by rotating Q slightly)
    const headOutputs = useMemo(() => {
        const outputs: number[][][] = [];
        for (let h = 0; h < numHeads; h++) {
            const angle = (h * Math.PI) / (numHeads * 4); // slight rotation per head
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            const rotatedQ = Q.map(q => [
                q[0] * cosA - q[1] * sinA,
                q[0] * sinA + q[1] * cosA,
            ]);

            // Compute scores and weights
            const headOutput: number[][] = [];
            for (let i = 0; i < n; i++) {
                const scores = K.map(k => dotProduct(rotatedQ[i], k) / Math.sqrt(dk));
                const weights = softmax(scores);
                const out = new Array(dim).fill(0);
                for (let j = 0; j < n; j++) {
                    for (let d = 0; d < dim; d++) {
                        out[d] += weights[j] * V[j][d];
                    }
                }
                headOutput.push(out);
            }
            outputs.push(headOutput);
        }
        return outputs;
    }, [Q, K, V, n, dim, dk, numHeads]);

    // Average all head outputs (simplified multi-head concat + W_O)
    const finalOutput = useMemo(() => {
        return Array.from({ length: n }, (_, i) =>
            Array.from({ length: dim }, (_, d) =>
                headOutputs.reduce((sum, head) => sum + head[i][d], 0) / numHeads
            )
        );
    }, [headOutputs, n, dim, numHeads]);

    // Pairwise distances
    const inputDists = useMemo(() => {
        const dists: { pair: string; dist: number }[] = [];
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                dists.push({ pair: `${tokens[i]}–${tokens[j]}`, dist: euclideanDist(embeddings[i], embeddings[j]) });
            }
        }
        return dists;
    }, [embeddings, tokens, n]);

    const outputDists = useMemo(() => {
        const dists: { pair: string; dist: number }[] = [];
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                dists.push({ pair: `${tokens[i]}–${tokens[j]}`, dist: euclideanDist(finalOutput[i], finalOutput[j]) });
            }
        }
        return dists;
    }, [finalOutput, tokens, n]);

    // Distortion ratio
    const distortions = useMemo(() =>
        inputDists.map((inp, idx) => ({
            pair: inp.pair,
            inputDist: inp.dist,
            outputDist: outputDists[idx].dist,
            ratio: inp.dist > 0 ? outputDists[idx].dist / inp.dist : 1,
        })),
        [inputDists, outputDists]
    );

    const handlePreset = useCallback((i: number) => setPreset(i), []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Metric Preservation Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                See how attention transforms pairwise distances between tokens
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePreset(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === i ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            <p className="text-[10px] text-slate-400 mb-4 italic">{description}</p>

            {/* Controls */}
            <div className="flex items-center gap-6 mb-5">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">d<sub>k</sub></span>
                    <input type="range" min={1} max={8} value={dk}
                        onChange={e => setDk(Number(e.target.value))}
                        className="w-16 accent-emerald-600" />
                    <span className="text-xs font-mono text-slate-700 w-3">{dk}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Heads</span>
                    <input type="range" min={1} max={4} value={numHeads}
                        onChange={e => setNumHeads(Number(e.target.value))}
                        className="w-16 accent-emerald-600" />
                    <span className="text-xs font-mono text-slate-700 w-3">{numHeads}</span>
                </div>
            </div>

            {/* Token embeddings */}
            <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Input Embeddings
                </p>
                <div className="flex gap-2">
                    {tokens.map((t, i) => (
                        <div key={i} className="bg-emerald-50 rounded-lg border border-emerald-200 px-3 py-1.5 text-center">
                            <span className="text-xs font-semibold text-emerald-700 block">{t}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                                [{embeddings[i].map(v => v.toFixed(2)).join(', ')}]
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Output embeddings */}
            <div className="mb-5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Output (after Attention)
                </p>
                <div className="flex gap-2">
                    {tokens.map((t, i) => (
                        <div key={i} className="bg-amber-50 rounded-lg border border-amber-200 px-3 py-1.5 text-center">
                            <span className="text-xs font-semibold text-amber-700 block">{t}</span>
                            <span className="text-[10px] font-mono text-slate-500">
                                [{finalOutput[i].map(v => v.toFixed(2)).join(', ')}]
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distance comparison table */}
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pairwise Distance Comparison
            </p>
            <table className="w-full border-collapse mb-3">
                <thead>
                    <tr>
                        <th className="text-left text-[10px] text-slate-500 font-semibold pb-1 pr-2">Pair</th>
                        <th className="text-center text-[10px] text-slate-500 font-semibold pb-1">Input dist</th>
                        <th className="text-center text-[10px] text-slate-500 font-semibold pb-1">Output dist</th>
                        <th className="text-center text-[10px] text-slate-500 font-semibold pb-1">Ratio</th>
                        <th className="text-center text-[10px] text-slate-500 font-semibold pb-1">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {distortions.map(({ pair, inputDist, outputDist, ratio }) => {
                        const preserved = ratio > 0.5 && ratio < 2.0;
                        return (
                            <tr key={pair} className="border-t border-slate-100">
                                <td className="text-xs text-slate-700 py-1.5 pr-2 font-medium">{pair}</td>
                                <td className="text-center text-xs font-mono text-slate-600 py-1.5">{inputDist.toFixed(3)}</td>
                                <td className="text-center text-xs font-mono text-slate-600 py-1.5">{outputDist.toFixed(3)}</td>
                                <td className="text-center text-xs font-mono py-1.5">
                                    <span className={preserved ? 'text-emerald-600' : 'text-rose-600'}>
                                        {ratio.toFixed(2)}×
                                    </span>
                                </td>
                                <td className="text-center py-1.5">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${preserved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {preserved ? '≈ preserved' : 'distorted'}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <p className="text-[10px] text-emerald-700 font-semibold mb-1">Observation</p>
                <p className="text-[10px] text-emerald-600">
                    Similar tokens get pulled closer after attention (metric contraction), while distant
                    tokens may maintain their separation. Try adjusting <strong>d<sub>k</sub></strong> and <strong>heads</strong> to
                    see how scaling and multi-head diversity affect metric preservation.
                </p>
            </div>
        </div>
    );
}
