"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────── Helpers ─────────────── */

function softmax(arr: number[]): number[] {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}

function dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

function matMul(A: number[][], B: number[][]): number[][] {
    const rows = A.length, cols = B[0].length, inner = B.length;
    const C: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            for (let k = 0; k < inner; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}

/* ─────────────── Presets ─────────────── */

interface Preset {
    name: string;
    tokens: string[];
    X: number[][];  // input embeddings (n × d)
    dk: number;
}

const PRESETS: Preset[] = [
    {
        name: "Cat sat mat",
        tokens: ["The", "cat", "sat", "on"],
        X: [
            [1.0, 0.2, -0.5, 0.8],
            [0.3, 0.9, 0.1, -0.2],
            [-0.1, 0.4, 0.8, 0.5],
            [0.7, -0.3, 0.2, 0.6],
        ],
        dk: 2,
    },
    {
        name: "King Queen",
        tokens: ["king", "queen", "man"],
        X: [
            [0.8, 0.6, -0.2, 0.9],
            [0.7, 0.8, -0.1, 0.85],
            [0.5, 0.1, 0.3, 0.4],
        ],
        dk: 2,
    },
    {
        name: "Hello World",
        tokens: ["Hello", "world", "!"],
        X: [
            [0.5, -0.3, 0.8, 0.1],
            [0.2, 0.6, -0.4, 0.7],
            [-0.1, 0.1, 0.3, -0.5],
        ],
        dk: 2,
    },
];

// Simple fixed weight matrices for demo
const WQ: number[][] = [[0.5, 0.3], [-0.2, 0.8], [0.4, -0.1], [0.1, 0.6]];
const WK: number[][] = [[0.3, -0.4], [0.7, 0.2], [-0.1, 0.5], [0.6, 0.3]];
const WV: number[][] = [[0.2, 0.5], [0.4, -0.3], [0.8, 0.1], [-0.2, 0.7]];

/* ─────────────── Main Component ─────────────── */

export default function SelfAttentionLab() {
    const [preset, setPreset] = useState(0);
    const [selectedQuery, setSelectedQuery] = useState(0);

    const { tokens, X, dk } = PRESETS[preset];
    const n = X.length;

    // Q = X × WQ, K = X × WK, V = X × WV
    const Q = useMemo(() => matMul(X, WQ), [X]);
    const K = useMemo(() => matMul(X, WK), [X]);
    const V = useMemo(() => matMul(X, WV), [X]);

    // Attention scores: S_ij = (q_i · k_j) / sqrt(dk)
    const scores = useMemo(() => {
        const S: number[][] = [];
        for (let i = 0; i < n; i++) {
            const row: number[] = [];
            for (let j = 0; j < n; j++) {
                row.push(dotProduct(Q[i], K[j]) / Math.sqrt(dk));
            }
            S.push(row);
        }
        return S;
    }, [Q, K, n, dk]);

    // Attention weights: softmax per row
    const weights = useMemo(() => scores.map(row => softmax(row)), [scores]);

    // Output: Z = weights × V
    const Z = useMemo(() => matMul(weights, V), [weights, V]);

    const handlePreset = useCallback((i: number) => { setPreset(i); setSelectedQuery(0); }, []);

    // Color intensity for heatmap
    const getHeatColor = (val: number) => {
        const intensity = Math.round(val * 255);
        return `rgb(${255 - intensity}, ${200 + Math.round(intensity * 0.2)}, ${255 - intensity * 0.5})`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Self-Attention Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                Watch how Q, K, V matrices produce attention weights and outputs
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-5">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePreset(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === i ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            {/* Select query token */}
            <div className="mb-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Select a query token to inspect</span>
                <div className="flex gap-2 mt-1">
                    {tokens.map((t, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedQuery(i)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${selectedQuery === i
                                ? 'bg-amber-100 border-amber-400 text-amber-800'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Attention Weight Heatmap */}
            <div className="mb-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Attention Weights for &quot;{tokens[selectedQuery]}&quot; (row {selectedQuery})
                </span>
                <div className="mt-2 flex gap-1">
                    {weights[selectedQuery].map((w, j) => (
                        <div key={j} className="flex flex-col items-center gap-1">
                            <div
                                className="w-16 h-12 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold border border-slate-200"
                                style={{ backgroundColor: getHeatColor(w) }}
                            >
                                {w.toFixed(3)}
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">{tokens[j]}</span>
                        </div>
                    ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                    Brighter = higher attention. Weights sum to 1.00
                </p>
            </div>

            {/* Full Attention Matrix */}
            <div className="mb-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Full Attention Matrix (softmax scores)
                </span>
                <div className="mt-2 overflow-x-auto">
                    <table className="text-[10px] font-mono">
                        <thead>
                            <tr>
                                <th className="p-1 text-slate-400"></th>
                                {tokens.map((t, j) => (
                                    <th key={j} className="p-1 text-slate-500 font-semibold">{t}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weights.map((row, i) => (
                                <tr key={i} className={i === selectedQuery ? 'bg-amber-50' : ''}>
                                    <td className="p-1 text-slate-500 font-semibold">{tokens[i]}</td>
                                    {row.map((w, j) => (
                                        <td key={j} className="p-1">
                                            <div
                                                className="w-12 h-7 rounded flex items-center justify-center font-bold"
                                                style={{ backgroundColor: getHeatColor(w) }}
                                            >
                                                {w.toFixed(2)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Output for selected query */}
            <div className="mb-3">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Output z[{selectedQuery}] for &quot;{tokens[selectedQuery]}&quot;
                </span>
                <div className="flex gap-1 mt-1">
                    {Z[selectedQuery].map((v, j) => (
                        <div key={j} className="w-16 h-9 flex items-center justify-center font-mono text-[10px] rounded border bg-amber-100 border-amber-300 text-amber-800 font-bold">
                            {v.toFixed(3)}
                        </div>
                    ))}
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                    z[i] = Σⱼ α[i,j] × v[j] — weighted blend of value vectors
                </p>
            </div>

            <div className="mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <p className="text-[10px] text-amber-700 font-semibold mb-1">How It Works</p>
                <p className="text-[10px] text-amber-600">
                    Each token&apos;s query vector is compared (dot product) against all key vectors.
                    The softmax normalizes these scores into probabilities. The output is a
                    weighted sum of value vectors — tokens that are more &quot;relevant&quot; contribute more
                    to the output.
                </p>
            </div>
        </div>
    );
}
