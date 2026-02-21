"use client";

import React, { useState, useMemo, useCallback } from 'react';

/* ─────────────── Helpers ─────────────── */

function numericalGradient(
    f: (X: number[][]) => number,
    X: number[][],
    eps = 1e-5
): number[][] {
    const rows = X.length, cols = X[0].length;
    const grad: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const Xp = X.map(r => [...r]);
            const Xm = X.map(r => [...r]);
            Xp[i][j] += eps;
            Xm[i][j] -= eps;
            grad[i][j] = (f(Xp) - f(Xm)) / (2 * eps);
        }
    }
    return grad;
}

function trace(A: number[][]): number {
    let s = 0;
    for (let i = 0; i < Math.min(A.length, A[0].length); i++) s += A[i][i];
    return s;
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

function transpose(A: number[][]): number[][] {
    const rows = A.length, cols = A[0].length;
    const T: number[][] = Array.from({ length: cols }, () => new Array(rows).fill(0));
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            T[j][i] = A[i][j];
    return T;
}

function frobeniusNorm2(X: number[][]): number {
    let s = 0;
    for (const row of X) for (const v of row) s += v * v;
    return s;
}

/* ─────────────── Presets ─────────────── */

interface Preset {
    name: string;
    label: string;
    funcName: string;
    formula: string;
    gradientFormula: string;
    X: number[][];
    A?: number[][];
    func: (X: number[][], A?: number[][]) => number;
    analyticGrad: (X: number[][], A?: number[][]) => number[][];
}

const PRESETS: Preset[] = [
    {
        name: "trace_ax",
        label: "tr(AX)",
        funcName: "f(X) = tr(AX)",
        formula: "tr(AX)",
        gradientFormula: "∇f = Aᵀ",
        X: [[1, 2], [3, 4]],
        A: [[2, 0], [1, 3]],
        func: (X, A) => trace(matMul(A!, X)),
        analyticGrad: (_X, A) => transpose(A!),
    },
    {
        name: "frobenius",
        label: "‖X‖²",
        funcName: "f(X) = ‖X‖²F",
        formula: "‖X‖²F = tr(XᵀX)",
        gradientFormula: "∇f = 2X",
        X: [[1, -1], [2, 0.5]],
        func: (X) => frobeniusNorm2(X),
        analyticGrad: (X) => X.map(row => row.map(v => 2 * v)),
    },
    {
        name: "trace_xtx",
        label: "tr(XᵀX)",
        funcName: "f(X) = tr(XᵀX)",
        formula: "tr(XᵀX)",
        gradientFormula: "∇f = 2X",
        X: [[0.5, 1.5], [-1, 2]],
        func: (X) => trace(matMul(transpose(X), X)),
        analyticGrad: (X) => X.map(row => row.map(v => 2 * v)),
    },
    {
        name: "trace_x2",
        label: "tr(X²)",
        funcName: "f(X) = tr(X²)",
        formula: "tr(X²)",
        gradientFormula: "∇f = 2Xᵀ",
        X: [[1, 2], [0, 3]],
        func: (X) => trace(matMul(X, X)),
        analyticGrad: (X) => transpose(X).map(row => row.map(v => 2 * v)),
    },
];

/* ─────────────── Component ─────────────── */

export default function GradientExplorerLab() {
    const [presetIdx, setPresetIdx] = useState(0);
    const [editableX, setEditableX] = useState<number[][]>(PRESETS[0].X.map(r => [...r]));
    const [highlightCell, setHighlightCell] = useState<[number, number] | null>(null);

    const preset = PRESETS[presetIdx];

    const handlePreset = useCallback((i: number) => {
        setPresetIdx(i);
        setEditableX(PRESETS[i].X.map(r => [...r]));
        setHighlightCell(null);
    }, []);

    const handleCellChange = useCallback((i: number, j: number, val: string) => {
        const num = parseFloat(val);
        if (isNaN(num)) return;
        setEditableX(prev => {
            const next = prev.map(r => [...r]);
            next[i][j] = num;
            return next;
        });
    }, []);

    // Compute
    const fVal = useMemo(() => preset.func(editableX, preset.A), [editableX, preset]);
    const analyticGrad = useMemo(() => preset.analyticGrad(editableX, preset.A), [editableX, preset]);
    const numericGrad = useMemo(() => numericalGradient((X) => preset.func(X, preset.A), editableX), [editableX, preset]);

    // Max gradient for color intensity
    const maxGrad = useMemo(() => {
        let m = 0;
        for (const row of analyticGrad) for (const v of row) m = Math.max(m, Math.abs(v));
        return m || 1;
    }, [analyticGrad]);

    const getGradColor = (val: number) => {
        const norm = Math.abs(val) / maxGrad;
        if (val >= 0) return `rgba(225, 29, 72, ${0.1 + norm * 0.6})`; // rose
        return `rgba(99, 102, 241, ${0.1 + norm * 0.6})`; // indigo for negative
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Gradient Explorer</h3>
            <p className="text-sm text-slate-500 mb-4">
                See analytic vs numerical gradients for common matrix functions
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-5">
                {PRESETS.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => handlePreset(i)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${presetIdx === i ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Function info */}
            <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 mb-4">
                <div className="text-xs text-rose-600 font-semibold mb-1">{preset.funcName}</div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-rose-500">Gradient rule: <strong>{preset.gradientFormula}</strong></span>
                    <span className="text-sm font-mono font-bold text-rose-700">f(X) = {fVal.toFixed(4)}</span>
                </div>
            </div>

            {/* Input Matrix X (editable) */}
            <div className="mb-4">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Input Matrix X (editable)</span>
                <div className="mt-1 inline-block">
                    {editableX.map((row, i) => (
                        <div key={i} className="flex gap-1 mb-1">
                            {row.map((val, j) => (
                                <input
                                    key={j}
                                    type="number"
                                    step="0.5"
                                    value={val}
                                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                                    className="w-16 h-9 text-center text-xs font-mono font-semibold border border-slate-200 rounded bg-slate-50 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* A matrix (if applicable) */}
            {preset.A && (
                <div className="mb-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Fixed Matrix A</span>
                    <div className="mt-1 inline-block">
                        {preset.A.map((row, i) => (
                            <div key={i} className="flex gap-1 mb-1">
                                {row.map((val, j) => (
                                    <div key={j} className="w-16 h-9 flex items-center justify-center text-xs font-mono font-semibold border border-slate-200 rounded bg-slate-100 text-slate-500">
                                        {val}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gradient comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Analytic Gradient</span>
                    <div className="mt-1">
                        {analyticGrad.map((row, i) => (
                            <div key={i} className="flex gap-1 mb-1">
                                {row.map((val, j) => (
                                    <div
                                        key={j}
                                        className="w-16 h-9 flex items-center justify-center text-[10px] font-mono font-bold rounded border border-slate-200 cursor-pointer transition-transform hover:scale-105"
                                        style={{ backgroundColor: getGradColor(val) }}
                                        onMouseEnter={() => setHighlightCell([i, j])}
                                        onMouseLeave={() => setHighlightCell(null)}
                                    >
                                        {val.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Numerical Gradient</span>
                    <div className="mt-1">
                        {numericGrad.map((row, i) => (
                            <div key={i} className="flex gap-1 mb-1">
                                {row.map((val, j) => (
                                    <div
                                        key={j}
                                        className={`w-16 h-9 flex items-center justify-center text-[10px] font-mono font-bold rounded border transition-all ${highlightCell && highlightCell[0] === i && highlightCell[1] === j
                                            ? 'border-rose-500 ring-2 ring-rose-200'
                                            : 'border-slate-200'}`}
                                        style={{ backgroundColor: getGradColor(val) }}
                                    >
                                        {val.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[9px] text-slate-400 mb-3">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(225, 29, 72, 0.5)' }}></div>
                    Positive gradient
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 0.5)' }}></div>
                    Negative gradient
                </div>
            </div>

            <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                <p className="text-[10px] text-rose-700 font-semibold mb-1">Analytic vs Numerical</p>
                <p className="text-[10px] text-rose-600">
                    The analytic gradient is computed using closed-form rules (e.g. ∇tr(AX) = Aᵀ).
                    The numerical gradient uses finite differences: ∂f/∂Xᵢⱼ ≈ [f(X+εeᵢⱼ) − f(X−εeᵢⱼ)] / 2ε.
                    Both should match — try editing X to see them update in sync.
                </p>
            </div>
        </div>
    );
}
