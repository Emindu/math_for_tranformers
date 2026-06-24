"use client";

import React, { useState, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Character Theory Lab — pure SVG/HTML, no framer-motion, no Three.js
   Shows interactive character tables with orthogonality check.
   ──────────────────────────────────────────────────────────────────────────── */

interface CharGroup {
    name: string;
    order: number;
    classes: string[];
    classSizes: number[];
    irrepLabels: string[];
    table: number[][];   // table[irrep][class] = character value (real approx)
}

const CHAR_GROUPS: Record<string, CharGroup> = {
    Z3: {
        name: 'ℤ₃', order: 3,
        classes: ['{0}', '{1}', '{2}'],
        classSizes: [1, 1, 1],
        irrepLabels: ['χ₀', 'χ₁', 'χ₂'],
        table: [
            [1,  1,    1  ],
            [1, -0.5, -0.5],
            [1, -0.5, -0.5],
        ],
    },
    Z4: {
        name: 'ℤ₄', order: 4,
        classes: ['{0}', '{1}', '{2}', '{3}'],
        classSizes: [1, 1, 1, 1],
        irrepLabels: ['χ₀', 'χ₁', 'χ₂', 'χ₃'],
        table: [
            [1,  1,  1,  1],
            [1,  0, -1,  0],
            [1, -1,  1, -1],
            [1,  0, -1,  0],
        ],
    },
    S3: {
        name: 'S₃', order: 6,
        classes: ['{e}', '{(12),(13),(23)}', '{(123),(132)}'],
        classSizes: [1, 3, 2],
        irrepLabels: ['χ_triv', 'χ_sign', 'χ_std'],
        table: [
            [1,  1,  1],
            [1, -1,  1],
            [2,  0, -1],
        ],
    },
    Z5: {
        name: 'ℤ₅', order: 5,
        classes: ['{0}', '{1}', '{2}', '{3}', '{4}'],
        classSizes: [1, 1, 1, 1, 1],
        irrepLabels: ['χ₀', 'χ₁', 'χ₂', 'χ₃', 'χ₄'],
        table: Array.from({ length: 5 }, (_, k) =>
            Array.from({ length: 5 }, (_, j) => Math.round(1000 * Math.cos(2 * Math.PI * k * j / 5)) / 1000)
        ),
    },
};

/* Inner product ⟨χᵢ, χⱼ⟩ = (1/|G|) Σ_c |c| · χᵢ(c) · χⱼ(c) */
function innerProduct(g: CharGroup, i: number, j: number): number {
    let sum = 0;
    for (let c = 0; c < g.classes.length; c++) {
        sum += g.classSizes[c] * g.table[i][c] * g.table[j][c];
    }
    return Math.round((sum / g.order) * 100) / 100;
}

function cellColor(val: number): string {
    if (val === 0) return '#f1f5f9';
    if (val > 0) {
        const t = Math.min(val / 2, 1);
        const b = Math.round(255 - t * 120);
        return `rgb(${b},${b},255)`;
    }
    const t = Math.min(-val / 2, 1);
    const g = Math.round(255 - t * 120);
    return `rgb(255,${g},${g})`;
}

function fmt(v: number): string {
    if (Math.abs(v - Math.round(v)) < 0.01) return String(Math.round(v));
    return v.toFixed(2);
}

export default function CharacterTheoryLab() {
    const [groupKey, setGroupKey] = useState('S3');
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [showOrtho, setShowOrtho] = useState(false);

    const g = CHAR_GROUPS[groupKey];
    const numIrreps = g.irrepLabels.length;
    const numClasses = g.classes.length;

    const orthoMatrix = useMemo(() => {
        return Array.from({ length: numIrreps }, (_, i) =>
            Array.from({ length: numIrreps }, (_, j) => innerProduct(g, i, j))
        );
    }, [g, numIrreps]);

    const selectedVal = selected ? g.table[selected[0]][selected[1]] : null;

    return (
        <div className="flex flex-col gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-slate-800">Character Theory Lab</h3>
                <p className="text-xs text-slate-500 mt-1">Click cells to inspect values. Check orthogonality of irreducible characters.</p>
            </div>

            {/* Group selector */}
            <div className="flex flex-wrap gap-2">
                {Object.keys(CHAR_GROUPS).map(key => (
                    <button
                        key={key}
                        onClick={() => { setGroupKey(key); setSelected(null); setShowOrtho(false); }}
                        className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors ${groupKey === key
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                            }`}
                    >
                        {CHAR_GROUPS[key].name}
                    </button>
                ))}
                <button
                    onClick={() => setShowOrtho(v => !v)}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition-colors ml-auto ${showOrtho
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                        }`}
                >
                    {showOrtho ? 'Hide' : 'Check'} Orthogonality
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Character table */}
                <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Character Table — {g.name}  (|G| = {g.order})
                    </p>
                    <div className="overflow-x-auto">
                        <table className="text-sm border-collapse w-full">
                            <thead>
                                <tr>
                                    <th className="border border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs text-slate-500 font-semibold">Irrep \ Class</th>
                                    {g.classes.map((cls, c) => (
                                        <th key={c} className="border border-slate-200 bg-slate-100 px-3 py-2 text-center text-xs text-slate-600 font-semibold">
                                            {cls}
                                            <span className="block text-[9px] text-slate-400 font-normal">size {g.classSizes[c]}</span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {g.irrepLabels.map((label, i) => (
                                    <tr key={i}>
                                        <td className="border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">{label}</td>
                                        {Array.from({ length: numClasses }, (_, c) => {
                                            const val = g.table[i][c];
                                            const isSel = selected && selected[0] === i && selected[1] === c;
                                            return (
                                                <td
                                                    key={c}
                                                    onClick={() => setSelected([i, c])}
                                                    className="border border-slate-200 px-3 py-2 text-center text-sm font-mono font-bold cursor-pointer transition-all"
                                                    style={{
                                                        background: isSel ? '#6366f1' : cellColor(val),
                                                        color: isSel ? 'white' : val === 0 ? '#94a3b8' : '#1e293b',
                                                        outline: isSel ? '2px solid #4f46e5' : undefined,
                                                    }}
                                                >
                                                    {fmt(val)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Selected cell explanation */}
                    {selected && (
                        <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-xl p-3">
                            <p className="text-xs font-bold text-indigo-700 mb-1">
                                {g.irrepLabels[selected[0]]}({g.classes[selected[1]]}) = {fmt(selectedVal ?? 0)}
                            </p>
                            <p className="text-xs text-indigo-600">
                                This is the trace of the representing matrix for elements in conjugacy class {g.classes[selected[1]]}
                                under irreducible representation {g.irrepLabels[selected[0]]}.
                            </p>
                        </div>
                    )}
                </div>

                {/* Orthogonality matrix */}
                {showOrtho && (
                    <div className="lg:w-72">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Inner Product Matrix ⟨χᵢ, χⱼ⟩
                        </p>
                        <div className="overflow-x-auto">
                            <table className="text-xs border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-200 bg-slate-100 px-2 py-1.5 text-slate-500"> </th>
                                        {g.irrepLabels.map((l, j) => (
                                            <th key={j} className="border border-slate-200 bg-slate-100 px-2 py-1.5 text-slate-600 font-semibold">{l}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {g.irrepLabels.map((label, i) => (
                                        <tr key={i}>
                                            <td className="border border-slate-200 bg-slate-50 px-2 py-1.5 font-bold text-slate-700">{label}</td>
                                            {Array.from({ length: numIrreps }, (_, j) => {
                                                const ip = orthoMatrix[i][j];
                                                const isOne = Math.abs(ip - 1) < 0.05;
                                                const isZero = Math.abs(ip) < 0.05;
                                                return (
                                                    <td key={j} className="border border-slate-200 px-2 py-1.5 text-center font-mono font-bold"
                                                        style={{
                                                            background: isOne ? '#d1fae5' : isZero ? '#f0fdf4' : '#fef2f2',
                                                            color: isOne ? '#065f46' : isZero ? '#166534' : '#991b1b',
                                                        }}
                                                    >
                                                        {fmt(ip)}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="inline-block w-3 h-3 rounded bg-emerald-200 border border-emerald-400" />
                                1 = same irrep (norm = 1)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="inline-block w-3 h-3 rounded bg-green-50 border border-green-300" />
                                0 = orthogonal irreps
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                            Row orthogonality: (1/|G|) Σ_g χᵢ(g)·χⱼ(g) = δᵢⱼ
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
