"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Group definitions ──────────────────────────────────────────────────────────
interface GroupDef {
    name: string;
    latex: string;
    elements: string[];
    op: (a: number, b: number) => number;          // returns element index
    subgroups: { label: string; latex: string; indices: number[] }[];
}

const GROUPS: Record<string, GroupDef> = {
    Z6: {
        name: "ℤ₆",
        latex: "$\\mathbb{Z}_6$",
        elements: ["0", "1", "2", "3", "4", "5"],
        op: (a, b) => (a + b) % 6,
        subgroups: [
            { label: "{0}", latex: "$\\{0\\}$", indices: [0] },
            { label: "{0,3}", latex: "$\\{0, 3\\}$", indices: [0, 3] },
            { label: "{0,2,4}", latex: "$\\{0, 2, 4\\}$", indices: [0, 2, 4] },
            { label: "ℤ₆", latex: "$\\mathbb{Z}_6$", indices: [0, 1, 2, 3, 4, 5] },
        ],
    },
    Z8: {
        name: "ℤ₈",
        latex: "$\\mathbb{Z}_8$",
        elements: ["0", "1", "2", "3", "4", "5", "6", "7"],
        op: (a, b) => (a + b) % 8,
        subgroups: [
            { label: "{0}", latex: "$\\{0\\}$", indices: [0] },
            { label: "{0,4}", latex: "$\\{0, 4\\}$", indices: [0, 4] },
            { label: "{0,2,4,6}", latex: "$\\{0, 2, 4, 6\\}$", indices: [0, 2, 4, 6] },
            { label: "ℤ₈", latex: "$\\mathbb{Z}_8$", indices: [0, 1, 2, 3, 4, 5, 6, 7] },
        ],
    },
    Z12: {
        name: "ℤ₁₂",
        latex: "$\\mathbb{Z}_{12}$",
        elements: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
        op: (a, b) => (a + b) % 12,
        subgroups: [
            { label: "{0}", latex: "$\\{0\\}$", indices: [0] },
            { label: "{0,6}", latex: "$\\{0, 6\\}$", indices: [0, 6] },
            { label: "{0,4,8}", latex: "$\\{0, 4, 8\\}$", indices: [0, 4, 8] },
            { label: "{0,3,6,9}", latex: "$\\{0, 3, 6, 9\\}$", indices: [0, 3, 6, 9] },
            { label: "{0,2,4,6,8,10}", latex: "$\\{0,2,4,6,8,10\\}$", indices: [0, 2, 4, 6, 8, 10] },
        ],
    },
};

// Coset color palette — each coset gets a distinct hue
const COSET_COLORS = [
    { bg: "#6366f1", text: "#ffffff" },   // indigo
    { bg: "#f59e0b", text: "#ffffff" },   // amber
    { bg: "#10b981", text: "#ffffff" },   // emerald
    { bg: "#ef4444", text: "#ffffff" },   // red
    { bg: "#8b5cf6", text: "#ffffff" },   // violet
    { bg: "#06b6d4", text: "#ffffff" },   // cyan
    { bg: "#ec4899", text: "#ffffff" },   // pink
    { bg: "#84cc16", text: "#ffffff" },   // lime
];

// ── Helpers ─────────────────────────────────────────────────────────────────────
function computeCosets(group: GroupDef, subgroupIndices: number[]) {
    const visited = new Set<number>();
    const cosets: number[][] = [];

    for (let g = 0; g < group.elements.length; g++) {
        if (visited.has(g)) continue;
        const coset = subgroupIndices.map(h => group.op(g, h));
        const unique = [...new Set(coset)].sort((a, b) => a - b);
        unique.forEach(el => visited.add(el));
        cosets.push(unique);
    }
    return cosets;
}

function elementToCosetIndex(cosets: number[][]): Map<number, number> {
    const map = new Map<number, number>();
    cosets.forEach((coset, ci) => {
        coset.forEach(el => map.set(el, ci));
    });
    return map;
}

// ── Cayley Table Component ──────────────────────────────────────────────────────
function CayleyTable({ group, cosetMap }: { group: GroupDef; cosetMap: Map<number, number> }) {
    const n = group.elements.length;
    const cellSize = n <= 8 ? 40 : 30;
    const headerSize = cellSize;
    const totalW = headerSize + n * cellSize;
    const totalH = headerSize + n * cellSize;

    return (
        <div className="overflow-x-auto">
            <svg width={totalW} height={totalH} className="mx-auto">
                {/* Header label */}
                <rect x={0} y={0} width={headerSize} height={headerSize}
                    fill="#1e293b" rx={4} />
                <text x={headerSize / 2} y={headerSize / 2 + 4}
                    textAnchor="middle" fill="#94a3b8" fontSize={n <= 8 ? 12 : 9} fontWeight="bold">·</text>

                {/* Column headers */}
                {group.elements.map((el, j) => (
                    <g key={`ch-${j}`}>
                        <rect x={headerSize + j * cellSize} y={0}
                            width={cellSize} height={headerSize} fill="#1e293b" rx={2} />
                        <text x={headerSize + j * cellSize + cellSize / 2}
                            y={headerSize / 2 + 4}
                            textAnchor="middle" fill="#e2e8f0"
                            fontSize={n <= 8 ? 11 : 8} fontWeight="bold">{el}</text>
                    </g>
                ))}

                {/* Row headers */}
                {group.elements.map((el, i) => (
                    <g key={`rh-${i}`}>
                        <rect x={0} y={headerSize + i * cellSize}
                            width={headerSize} height={cellSize} fill="#1e293b" rx={2} />
                        <text x={headerSize / 2}
                            y={headerSize + i * cellSize + cellSize / 2 + 4}
                            textAnchor="middle" fill="#e2e8f0"
                            fontSize={n <= 8 ? 11 : 8} fontWeight="bold">{el}</text>
                    </g>
                ))}

                {/* Body cells */}
                {group.elements.map((_, i) =>
                    group.elements.map((_, j) => {
                        const result = group.op(i, j);
                        const ci = cosetMap.get(result) ?? 0;
                        const color = COSET_COLORS[ci % COSET_COLORS.length];
                        return (
                            <motion.g key={`c-${i}-${j}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: (i * n + j) * 0.003 }}>
                                <rect
                                    x={headerSize + j * cellSize + 1}
                                    y={headerSize + i * cellSize + 1}
                                    width={cellSize - 2}
                                    height={cellSize - 2}
                                    fill={color.bg}
                                    rx={3}
                                    opacity={0.85}
                                />
                                <text
                                    x={headerSize + j * cellSize + cellSize / 2}
                                    y={headerSize + i * cellSize + cellSize / 2 + 4}
                                    textAnchor="middle"
                                    fill={color.text}
                                    fontSize={n <= 8 ? 11 : 8}
                                    fontWeight="600"
                                >
                                    {group.elements[result]}
                                </text>
                            </motion.g>
                        );
                    })
                )}
            </svg>
        </div>
    );
}

// ── Coset Partition Chips ───────────────────────────────────────────────────────
function CosetPartitionView({ group, cosets }: { group: GroupDef; cosets: number[][] }) {
    return (
        <div className="space-y-3">
            <AnimatePresence mode="wait">
                {cosets.map((coset, ci) => {
                    const color = COSET_COLORS[ci % COSET_COLORS.length];
                    // Determine a representative g for the label
                    const rep = coset[0];
                    return (
                        <motion.div
                            key={`coset-${ci}-${coset.join(',')}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: ci * 0.08 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-xs font-mono text-slate-500 w-16 shrink-0">
                                {ci === 0 ? "H" : `${group.elements[rep]}H`}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {coset.map(elIdx => (
                                    <motion.span
                                        key={elIdx}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold shadow-sm"
                                        style={{ backgroundColor: color.bg, color: color.text }}
                                    >
                                        {group.elements[elIdx]}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

// ── Lagrange Theorem Visual ─────────────────────────────────────────────────────
function LagrangeVisual({ groupOrder, subgroupOrder, numCosets }: {
    groupOrder: number;
    subgroupOrder: number;
    numCosets: number;
}) {
    const barMaxW = 220;
    const barH = 28;

    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="text-center mb-4">
                <span className="text-slate-300 text-sm font-medium">
                    <Latex>{"$|G| = |H| \\times [G : H]$"}</Latex>
                </span>
            </div>

            {/* |G| bar */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-10">|G|</span>
                    <motion.div
                        className="rounded-md"
                        style={{ height: barH, backgroundColor: "#6366f1" }}
                        initial={{ width: 0 }}
                        animate={{ width: barMaxW }}
                        transition={{ duration: 0.6 }}
                    />
                    <span className="text-white font-bold text-sm">{groupOrder}</span>
                </div>

                {/* |H| × [G:H] bars stacked */}
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-10">|H|</span>
                    <motion.div
                        className="rounded-md"
                        style={{ height: barH, backgroundColor: "#10b981" }}
                        initial={{ width: 0 }}
                        animate={{ width: barMaxW * (subgroupOrder / groupOrder) }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    />
                    <span className="text-emerald-300 font-bold text-sm">{subgroupOrder}</span>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-10">[G:H]</span>
                    <div className="flex gap-1">
                        {Array.from({ length: numCosets }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="rounded"
                                style={{
                                    height: barH,
                                    width: Math.max(12, (barMaxW / numCosets) - 2),
                                    backgroundColor: COSET_COLORS[i % COSET_COLORS.length].bg,
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
                            />
                        ))}
                    </div>
                    <span className="text-amber-300 font-bold text-sm">{numCosets}</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 text-center">
                <span className="text-lg font-bold text-white">
                    {groupOrder} = {subgroupOrder} × {numCosets}
                </span>
                <span className="text-emerald-400 ml-3 text-sm">✓ Divides evenly</span>
            </div>
        </div>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────────
export default function SubgroupCosetLab() {
    const [groupKey, setGroupKey] = useState<string>("Z6");
    const [subgroupIdx, setSubgroupIdx] = useState<number>(1);

    const group = GROUPS[groupKey];
    const subgroup = group.subgroups[subgroupIdx] ?? group.subgroups[0];

    const cosets = useMemo(
        () => computeCosets(group, subgroup.indices),
        [group, subgroup]
    );
    const cosetMap = useMemo(() => elementToCosetIndex(cosets), [cosets]);

    // Reset subgroup when switching groups
    const handleGroupChange = (key: string) => {
        setGroupKey(key);
        setSubgroupIdx(1);
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800">Subgroup & Coset Explorer</h3>
                <p className="text-sm text-slate-600 mt-1">
                    Select a group and subgroup to visualize coset partitioning and Lagrange&apos;s theorem
                </p>
            </div>

            {/* Group selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(GROUPS).map(([key, g]) => (
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

            {/* Subgroup selector */}
            <div className="mb-6">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Subgroup <Latex>{subgroup.latex}</Latex>
                </label>
                <div className="flex flex-wrap gap-2">
                    {group.subgroups.map((sg, i) => (
                        <button
                            key={i}
                            onClick={() => setSubgroupIdx(i)}
                            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all ${subgroupIdx === i
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                                }`}
                        >
                            {sg.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {/* Coset partition view */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Coset Partition of <Latex>{group.latex}</Latex> by <Latex>{subgroup.latex}</Latex>
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                        Each row is a left coset <Latex>{"$gH$"}</Latex>. Together they partition <Latex>{group.latex}</Latex> into {cosets.length} disjoint {cosets.length === 1 ? "set" : "sets"}.
                    </p>
                    <CosetPartitionView group={group} cosets={cosets} />
                </div>

                {/* Cayley table */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        Cayley Table — colors show coset membership of results
                    </h4>
                    <CayleyTable group={group} cosetMap={cosetMap} />
                </div>

                {/* Lagrange's theorem */}
                <div>
                    <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Lagrange&apos;s Theorem
                    </h4>
                    <LagrangeVisual
                        groupOrder={group.elements.length}
                        subgroupOrder={subgroup.indices.length}
                        numCosets={cosets.length}
                    />
                </div>
            </div>

            {/* Insight box */}
            <div className="mt-6 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                <p>
                    <strong>Observation:</strong> The order of every subgroup <Latex>{"$|H|$"}</Latex> divides the
                    order of the group <Latex>{"$|G|$"}</Latex>. Try selecting different subgroups — you&apos;ll see
                    that the group always partitions into equal-sized cosets with no leftovers. This is <strong>Lagrange&apos;s Theorem</strong> in action!
                </p>
            </div>
        </div>
    );
}
