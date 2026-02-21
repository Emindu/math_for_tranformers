"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────────────── Utils ─────────────────────── */

function dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function softmax(values: number[]): number[] {
    const max = Math.max(...values);
    const exps = values.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}

function matVecProduct(weights: number[], vectors: number[][]): number[] {
    const dim = vectors[0].length;
    const result = new Array(dim).fill(0);
    for (let j = 0; j < vectors.length; j++) {
        for (let d = 0; d < dim; d++) {
            result[d] += weights[j] * vectors[j][d];
        }
    }
    return result;
}

/* ─────────────────────── Presets ─────────────────────── */

const PRESETS: { name: string; queries: number[][]; keys: number[][]; values: number[][] }[] = [
    {
        name: "Uniform Similarity",
        queries: [[1, 0], [0, 1], [1, 1]],
        keys: [[1, 0], [0, 1], [1, 1]],
        values: [[1, 0], [0, 1], [0.5, 0.5]],
    },
    {
        name: "Sharp Focus",
        queries: [[3, 0], [0, 3], [0, 0]],
        keys: [[3, 0], [0, 3], [1, 1]],
        values: [[1, 0], [0, 1], [0.5, 0.5]],
    },
    {
        name: "Orthogonal Q/K",
        queries: [[1, 0], [0, 1], [-1, 0]],
        keys: [[0, 1], [1, 0], [0, -1]],
        values: [[1, 0.5], [0.5, 1], [0, 0]],
    },
];

/* ─────────────────────── Cell renderer ─────────────────────── */

function HeatCell({ value, max }: { value: number; max: number }) {
    const intensity = max > 0 ? value / max : 0;
    const r = Math.round(99 + (255 - 99) * (1 - intensity));
    const g = Math.round(102 + (255 - 102) * (1 - intensity));
    const b = Math.round(241 + (255 - 241) * (1 - intensity));
    return (
        <td
            className="text-center text-xs font-mono py-1.5 px-2 border border-slate-200"
            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, color: intensity > 0.5 ? '#fff' : '#334155' }}
        >
            {value.toFixed(3)}
        </td>
    );
}

/* ─────────────────────── Main component ─────────────────────── */

export default function AttentionMappingLab() {
    const [preset, setPreset] = useState(0);
    const [dk, setDk] = useState(2);
    const [editQ, setEditQ] = useState<number[][] | null>(null);
    const [editK, setEditK] = useState<number[][] | null>(null);
    const [editV, setEditV] = useState<number[][] | null>(null);

    const Q = editQ ?? PRESETS[preset].queries;
    const K = editK ?? PRESETS[preset].keys;
    const V = editV ?? PRESETS[preset].values;
    const n = Q.length;

    // Compute scores
    const scores = useMemo(() => {
        const s: number[][] = [];
        for (let i = 0; i < n; i++) {
            const row: number[] = [];
            for (let j = 0; j < n; j++) {
                row.push(dotProduct(Q[i], K[j]) / Math.sqrt(dk));
            }
            s.push(row);
        }
        return s;
    }, [Q, K, n, dk]);

    // Compute attention weights
    const weights = useMemo(() => scores.map(row => softmax(row)), [scores]);

    // Compute output
    const output = useMemo(() => weights.map(w => matVecProduct(w, V)), [weights, V]);

    const maxWeight = useMemo(() => Math.max(...weights.flat()), [weights]);

    const handlePresetChange = useCallback((idx: number) => {
        setPreset(idx);
        setEditQ(null);
        setEditK(null);
        setEditV(null);
    }, []);

    const handleCellEdit = useCallback((
        matrix: 'Q' | 'K' | 'V',
        row: number, col: number, val: string,
    ) => {
        const num = parseFloat(val);
        if (isNaN(num)) return;
        const setter = matrix === 'Q' ? setEditQ : matrix === 'K' ? setEditK : setEditV;
        const base = matrix === 'Q' ? Q : matrix === 'K' ? K : V;
        const copy = base.map(r => [...r]);
        copy[row][col] = num;
        setter(copy);
    }, [Q, K, V]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Attention Mapping Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                Explore how Q, K, V produce attention weights and outputs
            </p>

            {/* Presets & dk slider */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePresetChange(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === i && !editQ ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.name}
                    </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-slate-500">d<sub>k</sub></span>
                    <input
                        type="range" min={1} max={8} value={dk}
                        onChange={e => setDk(Number(e.target.value))}
                        className="w-20 accent-indigo-600"
                    />
                    <span className="text-xs font-mono text-slate-700 w-4">{dk}</span>
                </div>
            </div>

            {/* Input matrices (editable) */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {(['Q', 'K', 'V'] as const).map(label => {
                    const mat = label === 'Q' ? Q : label === 'K' ? K : V;
                    const colors = label === 'Q'
                        ? { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-600' }
                        : label === 'K'
                            ? { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-600' }
                            : { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-600' };
                    return (
                        <div key={label} className={`${colors.bg} rounded-lg p-2 border ${colors.border}`}>
                            <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${colors.badge} mb-1 inline-block`}>
                                {label}
                            </span>
                            <table className="w-full">
                                <tbody>
                                    {mat.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((val, j) => (
                                                <td key={j} className="p-0.5">
                                                    <input
                                                        type="number"
                                                        step="0.5"
                                                        value={val}
                                                        onChange={e => handleCellEdit(label, i, j, e.target.value)}
                                                        className="w-full text-center text-xs font-mono bg-white rounded border border-slate-200 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>

            {/* Score and Weight matrices side by side */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Scores */}
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Raw Scores (QK<sup>T</sup>/√d<sub>k</sub>)
                    </p>
                    <table className="w-full border-collapse">
                        <tbody>
                            {scores.map((row, i) => (
                                <tr key={i}>
                                    {row.map((val, j) => (
                                        <td key={j} className="text-center text-xs font-mono py-1 px-1.5 border border-slate-200 bg-slate-50">
                                            {val.toFixed(2)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Weights (heatmap) */}
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Attention Weights (Softmax)
                    </p>
                    <table className="w-full border-collapse">
                        <tbody>
                            {weights.map((row, i) => (
                                <tr key={i}>
                                    {row.map((val, j) => (
                                        <HeatCell key={j} value={val} max={maxWeight} />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Output */}
            <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Output Z = Softmax(QK<sup>T</sup>/√d<sub>k</sub>)V
                </p>
                <table className="w-full border-collapse">
                    <tbody>
                        {output.map((row, i) => (
                            <tr key={i}>
                                <td className="text-xs text-slate-400 pr-2 py-1">z<sub>{i + 1}</sub></td>
                                {row.map((val, j) => (
                                    <td key={j} className="text-center text-xs font-mono py-1 px-2 border border-slate-200 bg-indigo-50">
                                        {val.toFixed(3)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-4">
                Edit Q, K, V values above to see how attention weights and outputs change
            </p>
        </div>
    );
}
