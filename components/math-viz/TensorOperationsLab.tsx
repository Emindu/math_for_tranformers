"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────── Helpers ─────────────── */

function outerProduct(a: number[], b: number[]): number[][] {
    return a.map(ai => b.map(bj => ai * bj));
}

function matMul(A: number[][], B: number[][]): number[][] {
    const rows = A.length;
    const cols = B[0].length;
    const inner = B.length;
    const C: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < inner; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

function trace(M: number[][]): number {
    let sum = 0;
    for (let i = 0; i < Math.min(M.length, M[0].length); i++) sum += M[i][i];
    return sum;
}

/* ─────────────── Presets ─────────────── */

interface Preset {
    name: string;
    vectorA: number[];
    vectorB: number[];
    matrixA: number[][];
    matrixB: number[][];
}

const PRESETS: Preset[] = [
    {
        name: "Simple",
        vectorA: [1, 2],
        vectorB: [3, 4],
        matrixA: [[1, 2], [3, 4]],
        matrixB: [[5, 6], [7, 8]],
    },
    {
        name: "Identity",
        vectorA: [1, 0],
        vectorB: [0, 1],
        matrixA: [[1, 0], [0, 1]],
        matrixB: [[2, 3], [4, 5]],
    },
    {
        name: "Embeddings",
        vectorA: [0.5, -0.3],
        vectorB: [0.8, 0.6],
        matrixA: [[0.5, -0.3], [0.8, 0.6]],
        matrixB: [[0.2, 0.9], [-0.4, 0.7]],
    },
];

/* ─────────────── Cell Component ─────────────── */

function Cell({ value, highlight }: { value: number; highlight?: boolean }) {
    return (
        <div className={`w-14 h-10 flex items-center justify-center font-mono text-xs rounded border transition-all ${highlight ? 'bg-violet-100 border-violet-300 text-violet-800 font-bold' : 'bg-white border-slate-200 text-slate-700'}`}>
            {Number.isInteger(value) ? value : value.toFixed(2)}
        </div>
    );
}

/* ─────────────── Main Component ─────────────── */

export default function TensorOperationsLab() {
    const [preset, setPreset] = useState(0);
    const [tab, setTab] = useState<'product' | 'contraction'>('product');

    const { vectorA, vectorB, matrixA, matrixB } = PRESETS[preset];

    // Tensor product: outer product of two vectors → matrix
    const tensorProduct = useMemo(() => outerProduct(vectorA, vectorB), [vectorA, vectorB]);

    // Contraction: matrix multiplication A × B
    const contraction = useMemo(() => matMul(matrixA, matrixB), [matrixA, matrixB]);

    // Trace (full contraction)
    const traceA = useMemo(() => trace(matrixA), [matrixA]);

    const handlePreset = useCallback((i: number) => setPreset(i), []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Tensor Operations Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                Explore tensor products and contractions interactively
            </p>

            {/* Presets */}
            <div className="flex gap-2 mb-4">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePreset(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${preset === i ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
                <button
                    onClick={() => setTab('product')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'product' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Tensor Product (Outer)
                </button>
                <button
                    onClick={() => setTab('contraction')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'contraction' ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Contraction (MatMul)
                </button>
            </div>

            {tab === 'product' ? (
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Outer Product: a ⊗ b → Matrix
                    </p>

                    {/* Vector A */}
                    <div className="mb-3">
                        <span className="text-[10px] text-slate-400 font-semibold">Vector a</span>
                        <div className="flex gap-1 mt-1">
                            {vectorA.map((v, i) => <Cell key={i} value={v} />)}
                        </div>
                    </div>

                    {/* Vector B */}
                    <div className="mb-3">
                        <span className="text-[10px] text-slate-400 font-semibold">Vector b</span>
                        <div className="flex gap-1 mt-1">
                            {vectorB.map((v, i) => <Cell key={i} value={v} />)}
                        </div>
                    </div>

                    {/* Result */}
                    <div className="mb-3">
                        <span className="text-[10px] text-slate-400 font-semibold">Result: a ⊗ b (order 2 tensor)</span>
                        <div className="mt-1 space-y-1">
                            {tensorProduct.map((row, i) => (
                                <div key={i} className="flex gap-1">
                                    {row.map((v, j) => <Cell key={j} value={v} highlight />)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-3">
                        Each entry <em>(i,j)</em> =  a[i] × b[j]. A rank-1 matrix is always the result
                        of a single vector outer product.
                    </p>
                </div>
            ) : (
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                        Contraction: A × B → C  (sum over shared index)
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                        {/* Matrix A */}
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold">Matrix A</span>
                            <div className="mt-1 space-y-1">
                                {matrixA.map((row, i) => (
                                    <div key={i} className="flex gap-1">
                                        {row.map((v, j) => <Cell key={j} value={v} />)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Matrix B */}
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold">Matrix B</span>
                            <div className="mt-1 space-y-1">
                                {matrixB.map((row, i) => (
                                    <div key={i} className="flex gap-1">
                                        {row.map((v, j) => <Cell key={j} value={v} />)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result C */}
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold">C = A × B</span>
                            <div className="mt-1 space-y-1">
                                {contraction.map((row, i) => (
                                    <div key={i} className="flex gap-1">
                                        {row.map((v, j) => <Cell key={j} value={v} highlight />)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trace */}
                    <div className="bg-violet-50 p-3 rounded-lg border border-violet-100 mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-violet-700 font-semibold">Trace(A)</span>
                            <span className="text-sm font-mono text-violet-800 font-bold">{Number.isInteger(traceA) ? traceA : traceA.toFixed(2)}</span>
                            <span className="text-[10px] text-violet-500">← full contraction (sum of diagonal)</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                        C[i,u] = Σⱼ A[i,j] × B[j,u]. This is exactly matrix multiplication —
                        the contraction of two order-2 tensors over their shared index.
                    </p>
                </div>
            )}

            <div className="mt-4 bg-violet-50 p-3 rounded-lg border border-violet-100">
                <p className="text-[10px] text-violet-700 font-semibold mb-1">Key Takeaway</p>
                <p className="text-[10px] text-violet-600">
                    The <strong>tensor product</strong> builds higher-order tensors (vectors → matrices → 3-tensors → ...),
                    while <strong>contraction</strong> reduces order by summing over indices. In transformers, Q·K<sup>T</sup> is
                    a contraction, and the outer product appears in attention score computation.
                </p>
            </div>
        </div>
    );
}
