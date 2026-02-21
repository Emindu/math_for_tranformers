"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Group definitions for character tables ──────────────────────────────────────
interface CharGroupDef {
    name: string;
    latex: string;
    order: number;
    conjugacyClasses: { label: string; size: number; representative: string }[];
    irrepLabels: string[];
    // Character table: charTable[irrep][class] = character value
    charTable: number[][];
}

const CHAR_GROUPS: Record<string, CharGroupDef> = {
    Z3: {
        name: "ℤ₃",
        latex: "$\\mathbb{Z}_3$",
        order: 3,
        conjugacyClasses: [
            { label: "{0}", size: 1, representative: "0" },
            { label: "{1}", size: 1, representative: "1" },
            { label: "{2}", size: 1, representative: "2" },
        ],
        irrepLabels: ["χ₀", "χ₁", "χ₂"],
        charTable: [
            [1, 1, 1],          // trivial
            [1, -0.5, -0.5],    // approx e^(2πi/3) trace (real part for display)
            [1, -0.5, -0.5],    // approx e^(4πi/3) trace
        ],
    },
    Z4: {
        name: "ℤ₄",
        latex: "$\\mathbb{Z}_4$",
        order: 4,
        conjugacyClasses: [
            { label: "{0}", size: 1, representative: "0" },
            { label: "{1}", size: 1, representative: "1" },
            { label: "{2}", size: 1, representative: "2" },
            { label: "{3}", size: 1, representative: "3" },
        ],
        irrepLabels: ["χ₀", "χ₁", "χ₂", "χ₃"],
        charTable: [
            [1, 1, 1, 1],
            [1, 0, -1, 0],      // i → 0 (real part)
            [1, -1, 1, -1],
            [1, 0, -1, 0],      // -i → 0
        ],
    },
    S3: {
        name: "S₃",
        latex: "$S_3$",
        order: 6,
        conjugacyClasses: [
            { label: "{e}", size: 1, representative: "e" },
            { label: "{(12),(13),(23)}", size: 3, representative: "(12)" },
            { label: "{(123),(132)}", size: 2, representative: "(123)" },
        ],
        irrepLabels: ["trivial", "sign", "standard"],
        charTable: [
            [1, 1, 1],          // trivial
            [1, -1, 1],         // sign
            [2, 0, -1],         // standard (2-dim)
        ],
    },
    D4: {
        name: "D₄",
        latex: "$D_4$",
        order: 8,
        conjugacyClasses: [
            { label: "{e}", size: 1, representative: "e" },
            { label: "{r²}", size: 1, representative: "r²" },
            { label: "{r,r³}", size: 2, representative: "r" },
            { label: "{s,r²s}", size: 2, representative: "s" },
            { label: "{rs,r³s}", size: 2, representative: "rs" },
        ],
        irrepLabels: ["A₁", "A₂", "B₁", "B₂", "E"],
        charTable: [
            [1, 1, 1, 1, 1],
            [1, 1, 1, -1, -1],
            [1, 1, -1, 1, -1],
            [1, 1, -1, -1, 1],
            [2, -2, 0, 0, 0],
        ],
    },
};

// Color scale for character values
function charColor(val: number): string {
    if (val > 0) return `rgba(16, 185, 129, ${Math.min(1, Math.abs(val) / 2 * 0.6 + 0.3)})`;
    if (val < 0) return `rgba(239, 68, 68, ${Math.min(1, Math.abs(val) / 2 * 0.6 + 0.3)})`;
    return "rgba(100, 116, 139, 0.3)";
}

// ── Character Table SVG ─────────────────────────────────────────────────────────
function CharacterTableSVG({ group, highlightedIrrep, highlightedClass }: {
    group: CharGroupDef;
    highlightedIrrep: number | null;
    highlightedClass: number | null;
}) {
    const nR = group.irrepLabels.length;
    const nC = group.conjugacyClasses.length;
    const cellW = 56;
    const cellH = 36;
    const headerH = 44;
    const labelW = 70;
    const totalW = labelW + nC * cellW;
    const totalH = headerH + nR * cellH;

    return (
        <div className="overflow-x-auto">
            <svg width={totalW} height={totalH} className="mx-auto">
                {/* Corner */}
                <rect x={0} y={0} width={labelW} height={headerH} fill="#1e293b" rx={4} />
                <text x={labelW / 2} y={headerH / 2 + 4} textAnchor="middle"
                    fill="#94a3b8" fontSize={10} fontWeight="bold">χ \ C</text>

                {/* Column headers (conjugacy classes) */}
                {group.conjugacyClasses.map((cls, j) => (
                    <g key={`ch-${j}`}>
                        <rect x={labelW + j * cellW} y={0}
                            width={cellW} height={headerH}
                            fill={highlightedClass === j ? "#312e81" : "#1e293b"} rx={2} />
                        <text x={labelW + j * cellW + cellW / 2} y={headerH / 2 - 2}
                            textAnchor="middle" fill="#e2e8f0"
                            fontSize={9} fontWeight="bold">{cls.representative}</text>
                        <text x={labelW + j * cellW + cellW / 2} y={headerH / 2 + 12}
                            textAnchor="middle" fill="#64748b"
                            fontSize={7}>size {cls.size}</text>
                    </g>
                ))}

                {/* Row labels (irreps) */}
                {group.irrepLabels.map((label, i) => (
                    <g key={`rh-${i}`}>
                        <rect x={0} y={headerH + i * cellH}
                            width={labelW} height={cellH}
                            fill={highlightedIrrep === i ? "#312e81" : "#1e293b"} rx={2} />
                        <text x={labelW / 2} y={headerH + i * cellH + cellH / 2 + 4}
                            textAnchor="middle" fill="#e2e8f0"
                            fontSize={10} fontWeight="bold">{label}</text>
                    </g>
                ))}

                {/* Body cells */}
                {group.charTable.map((row, i) =>
                    row.map((val, j) => {
                        const isHighlighted = highlightedIrrep === i || highlightedClass === j;
                        return (
                            <motion.g key={`c-${i}-${j}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: (i * nC + j) * 0.02 }}>
                                <rect
                                    x={labelW + j * cellW + 1}
                                    y={headerH + i * cellH + 1}
                                    width={cellW - 2}
                                    height={cellH - 2}
                                    fill={charColor(val)}
                                    rx={3}
                                    stroke={isHighlighted ? "#818cf8" : "transparent"}
                                    strokeWidth={isHighlighted ? 2 : 0}
                                />
                                <text
                                    x={labelW + j * cellW + cellW / 2}
                                    y={headerH + i * cellH + cellH / 2 + 4}
                                    textAnchor="middle"
                                    fill="#ffffff"
                                    fontSize={12}
                                    fontWeight="700"
                                >
                                    {Number.isInteger(val) ? val : val.toFixed(1)}
                                </text>
                            </motion.g>
                        );
                    })
                )}
            </svg>
        </div>
    );
}

// ── Orthogonality Visualization ─────────────────────────────────────────────────
function OrthogonalityViz({ group, irrepA, irrepB }: {
    group: CharGroupDef;
    irrepA: number;
    irrepB: number;
}) {
    const rowA = group.charTable[irrepA];
    const rowB = group.charTable[irrepB];

    // Compute inner product: (1/|G|) Σ |C_i| χ_a(g_i) conj(χ_b(g_i))
    // For real characters, conj is just the value
    const terms = group.conjugacyClasses.map((cls, i) => ({
        size: cls.size,
        chiA: rowA[i],
        chiB: rowB[i],
        product: cls.size * rowA[i] * rowB[i],
    }));
    const innerProduct = terms.reduce((sum, t) => sum + t.product, 0) / group.order;
    const isOrthogonal = Math.abs(innerProduct) < 1e-6;
    const isSame = irrepA === irrepB;

    const barMaxW = 140;

    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="text-center mb-4">
                <span className="text-slate-300 text-sm">
                    <Latex>{`$\\langle ${group.irrepLabels[irrepA]}, ${group.irrepLabels[irrepB]} \\rangle$`}</Latex>
                    <span className="mx-2">=</span>
                    <Latex>{"$\\frac{1}{|G|} \\sum_{g} \\chi_a(g)\\overline{\\chi_b(g)}$"}</Latex>
                </span>
            </div>

            {/* Term breakdown */}
            <div className="space-y-2 mb-4">
                {terms.map((t, i) => {
                    const val = t.product / group.order;
                    const absVal = Math.abs(val);
                    return (
                        <div key={i} className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400 font-mono w-8 text-right">{group.conjugacyClasses[i].representative}</span>
                            <span className="text-slate-500 w-24">
                                {t.size}×{t.chiA}×{t.chiB} = {t.product}
                            </span>
                            <motion.div
                                className="rounded"
                                style={{
                                    height: 16,
                                    backgroundColor: val >= 0 ? "#10b981" : "#ef4444",
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: Math.max(2, absVal * barMaxW) }}
                                transition={{ delay: i * 0.1 }}
                            />
                            <span className="text-slate-400 text-[10px]">{val.toFixed(3)}</span>
                        </div>
                    );
                })}
            </div>

            {/* Result */}
            <div className="pt-3 border-t border-slate-700 text-center">
                <span className="text-lg font-bold">
                    <span className={isSame ? "text-emerald-400" : isOrthogonal ? "text-blue-400" : "text-amber-400"}>
                        ⟨{group.irrepLabels[irrepA]}, {group.irrepLabels[irrepB]}⟩ = {innerProduct.toFixed(3)}
                    </span>
                </span>
                <div className="mt-1 text-xs">
                    {isSame ? (
                        <span className="text-emerald-300">= 1 (same irrep, normalized)</span>
                    ) : isOrthogonal ? (
                        <span className="text-blue-300">= 0 (orthogonal — different irreps!)</span>
                    ) : (
                        <span className="text-amber-300">≠ 0</span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────────
export default function CharacterTheoryLab() {
    const [groupKey, setGroupKey] = useState<string>("S3");
    const [highlightedIrrep, setHighlightedIrrep] = useState<number | null>(null);
    const [highlightedClass, setHighlightedClass] = useState<number | null>(null);
    const [irrepA, setIrrepA] = useState(0);
    const [irrepB, setIrrepB] = useState(1);
    const [activeTab, setActiveTab] = useState<"table" | "orthogonality">("table");

    const group = CHAR_GROUPS[groupKey];

    const handleGroupChange = (key: string) => {
        setGroupKey(key);
        setHighlightedIrrep(null);
        setHighlightedClass(null);
        setIrrepA(0);
        setIrrepB(1);
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-800">Character Table Explorer</h3>
                <p className="text-sm text-slate-600 mt-1">
                    Explore character tables and verify orthogonality relations
                </p>
            </div>

            {/* Group selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(CHAR_GROUPS).map(([key, g]) => (
                    <button
                        key={key}
                        onClick={() => handleGroupChange(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${groupKey === key
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-5 bg-slate-200 rounded-lg p-1">
                {([
                    { key: "table", label: "Character Table" },
                    { key: "orthogonality", label: "Orthogonality Check" },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === tab.key
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "table" && (
                <div>
                    {/* Highlight controls */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                            <span className="text-xs text-slate-500 font-semibold">Highlight irrep:</span>
                            <div className="flex gap-1 mt-1">
                                <button
                                    onClick={() => setHighlightedIrrep(null)}
                                    className={`px-2 py-1 rounded text-xs ${highlightedIrrep === null ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 border'}`}
                                >
                                    none
                                </button>
                                {group.irrepLabels.map((label, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHighlightedIrrep(i)}
                                        className={`px-2 py-1 rounded text-xs ${highlightedIrrep === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold">Highlight class:</span>
                            <div className="flex gap-1 mt-1">
                                <button
                                    onClick={() => setHighlightedClass(null)}
                                    className={`px-2 py-1 rounded text-xs ${highlightedClass === null ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 border'}`}
                                >
                                    none
                                </button>
                                {group.conjugacyClasses.map((cls, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHighlightedClass(i)}
                                        className={`px-2 py-1 rounded text-xs ${highlightedClass === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border'}`}
                                    >
                                        {cls.representative}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                        <CharacterTableSVG
                            group={group}
                            highlightedIrrep={highlightedIrrep}
                            highlightedClass={highlightedClass}
                        />
                    </div>

                    <div className="mt-3 flex gap-4 justify-center text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(16, 185, 129, 0.7)" }}></span>
                            Positive
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(239, 68, 68, 0.7)" }}></span>
                            Negative
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: "rgba(100, 116, 139, 0.3)" }}></span>
                            Zero
                        </span>
                    </div>
                </div>
            )}

            {activeTab === "orthogonality" && (
                <div>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div>
                            <span className="text-xs text-slate-500 font-semibold">χ_a:</span>
                            <div className="flex gap-1 mt-1">
                                {group.irrepLabels.map((label, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIrrepA(i)}
                                        className={`px-2 py-1 rounded text-xs ${irrepA === i ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-semibold">χ_b:</span>
                            <div className="flex gap-1 mt-1">
                                {group.irrepLabels.map((label, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIrrepB(i)}
                                        className={`px-2 py-1 rounded text-xs ${irrepB === i ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 border'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <OrthogonalityViz group={group} irrepA={irrepA} irrepB={irrepB} />
                </div>
            )}

            {/* Insight */}
            <div className="mt-5 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                <p>
                    <strong>Observation:</strong> In the &ldquo;Orthogonality Check&rdquo; tab, select two <em>different</em> irreps
                    and verify their inner product is 0. Then select the <em>same</em> irrep for both and
                    see it equals 1. This is the <strong>orthogonality relation</strong> — irreducible characters
                    form an orthonormal basis!
                </p>
            </div>
        </div>
    );
}
