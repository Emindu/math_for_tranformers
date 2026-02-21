"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────── Helpers ─────────────── */

function kronecker(A: number[][], B: number[][]): number[][] {
    const m = A.length, n = A[0].length;
    const p = B.length, q = B[0].length;
    const result: number[][] = Array.from({ length: m * p }, () => new Array(n * q).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let r = 0; r < p; r++) {
                for (let s = 0; s < q; s++) {
                    result[i * p + r][j * q + s] = A[i][j] * B[r][s];
                }
            }
        }
    }
    return result;
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
    A: number[][];
    B: number[][];
    desc: string;
}

const PRESETS: Preset[] = [
    {
        name: "Simple 2×2",
        A: [[1, 2], [3, 4]],
        B: [[0, 5], [6, 7]],
        desc: "Two 2×2 matrices → 4×4 Kronecker product",
    },
    {
        name: "Identity ⊗ B",
        A: [[1, 0], [0, 1]],
        B: [[2, 3], [4, 5]],
        desc: "Identity ⊗ B produces a block-diagonal matrix",
    },
    {
        name: "Embedding",
        A: [[0.5, -0.3], [0.8, 0.1]],
        B: [[1, 0], [0, 1]],
        desc: "Embedding matrix ⊗ Identity = block-diagonal embedding",
    },
];

/* ─────────────── Cell Component ─────────────── */

function Cell({ value, blockR, blockC }: { value: number; blockR: number; blockC: number }) {
    const colors = [
        ['bg-cyan-50 border-cyan-200 text-cyan-800', 'bg-violet-50 border-violet-200 text-violet-800'],
        ['bg-amber-50 border-amber-200 text-amber-800', 'bg-emerald-50 border-emerald-200 text-emerald-800'],
    ];
    const c = colors[blockR % 2][blockC % 2];
    return (
        <div className={`w-12 h-9 flex items-center justify-center font-mono text-[10px] rounded border transition-all ${c}`}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
        </div>
    );
}

/* ─────────────── Main Component ─────────────── */

export default function KroneckerProductLab() {
    const [preset, setPreset] = useState(0);
    const [tab, setTab] = useState<'kronecker' | 'matmul'>('kronecker');

    const { A, B, desc } = PRESETS[preset];
    const pRows = B.length;
    const qCols = B[0].length;

    const kron = useMemo(() => kronecker(A, B), [A, B]);

    // Standard matmul for comparison
    const product = useMemo(() => matMul(A, B), [A, B]);

    const handlePreset = useCallback((i: number) => setPreset(i), []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Kronecker Product Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                Compare Kronecker products with standard matrix multiplication
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePreset(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === i ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>
            <p className="text-[10px] text-slate-400 mb-4 italic">{desc}</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
                <button onClick={() => setTab('kronecker')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'kronecker' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    Kronecker A ⊗ B
                </button>
                <button onClick={() => setTab('matmul')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'matmul' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    Standard A × B
                </button>
            </div>

            {/* Input Matrices */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold">Matrix A ({A.length}×{A[0].length})</span>
                    <div className="mt-1 space-y-1">
                        {A.map((row, i) => (
                            <div key={i} className="flex gap-1">
                                {row.map((v, j) => (
                                    <div key={j} className="w-12 h-9 flex items-center justify-center font-mono text-[10px] rounded border bg-white border-slate-200 text-slate-700">
                                        {Number.isInteger(v) ? v : v.toFixed(1)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold">Matrix B ({B.length}×{B[0].length})</span>
                    <div className="mt-1 space-y-1">
                        {B.map((row, i) => (
                            <div key={i} className="flex gap-1">
                                {row.map((v, j) => (
                                    <div key={j} className="w-12 h-9 flex items-center justify-center font-mono text-[10px] rounded border bg-white border-slate-200 text-slate-700">
                                        {Number.isInteger(v) ? v : v.toFixed(1)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Result */}
            {tab === 'kronecker' ? (
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                        A ⊗ B ({kron.length}×{kron[0].length}) — color-coded by block
                    </span>
                    <div className="mt-1 space-y-0.5 overflow-x-auto">
                        {kron.map((row, i) => (
                            <div key={i} className="flex gap-0.5">
                                {row.map((v, j) => (
                                    <Cell key={j} value={v}
                                        blockR={Math.floor(i / pRows)}
                                        blockC={Math.floor(j / qCols)} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        Each colored block is <em>a<sub>ij</sub> × B</em>. The Kronecker product creates
                        a {kron.length}×{kron[0].length} matrix from two {A.length}×{A[0].length} inputs.
                    </p>
                </div>
            ) : (
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                        A × B ({product.length}×{product[0].length}) — standard multiplication
                    </span>
                    <div className="mt-1 space-y-1">
                        {product.map((row, i) => (
                            <div key={i} className="flex gap-1">
                                {row.map((v, j) => (
                                    <div key={j} className="w-12 h-9 flex items-center justify-center font-mono text-[10px] rounded border bg-cyan-100 border-cyan-300 text-cyan-800 font-bold">
                                        {Number.isInteger(v) ? v : v.toFixed(1)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                        Standard multiplication preserves dimensions ({A.length}×{B[0].length}).
                        Compare with the Kronecker product which <em>expands</em> dimensions.
                    </p>
                </div>
            )}

            <div className="mt-4 bg-cyan-50 p-3 rounded-lg border border-cyan-100">
                <p className="text-[10px] text-cyan-700 font-semibold mb-1">Key Difference</p>
                <p className="text-[10px] text-cyan-600">
                    <strong>Standard multiply</strong> contracts dimensions (sum over shared index).
                    <strong> Kronecker product</strong> expands dimensions (every pair of elements interacts).
                    In transformers, Kronecker factorization <em>M ≈ A ⊗ B</em> compresses large weight
                    matrices into smaller factors.
                </p>
            </div>
        </div>
    );
}
