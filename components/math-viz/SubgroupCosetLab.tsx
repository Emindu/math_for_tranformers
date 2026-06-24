"use client";

import React, { useState, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Subgroup & Coset Lab — pure SVG, no framer-motion, no Three.js
   Shows cyclic group coset partitions with Lagrange's theorem verification.
   ──────────────────────────────────────────────────────────────────────────── */

interface GroupDef {
    name: string;
    n: number;
    subgroups: { label: string; indices: number[] }[];
}

const GROUPS: Record<string, GroupDef> = {
    Z4: {
        name: 'ℤ₄', n: 4,
        subgroups: [
            { label: '{0}',       indices: [0] },
            { label: '{0,2}',     indices: [0, 2] },
            { label: 'ℤ₄',        indices: [0, 1, 2, 3] },
        ],
    },
    Z6: {
        name: 'ℤ₆', n: 6,
        subgroups: [
            { label: '{0}',       indices: [0] },
            { label: '{0,3}',     indices: [0, 3] },
            { label: '{0,2,4}',   indices: [0, 2, 4] },
            { label: 'ℤ₆',        indices: [0, 1, 2, 3, 4, 5] },
        ],
    },
    Z8: {
        name: 'ℤ₈', n: 8,
        subgroups: [
            { label: '{0}',         indices: [0] },
            { label: '{0,4}',       indices: [0, 4] },
            { label: '{0,2,4,6}',   indices: [0, 2, 4, 6] },
            { label: 'ℤ₈',          indices: [0, 1, 2, 3, 4, 5, 6, 7] },
        ],
    },
    Z12: {
        name: 'ℤ₁₂', n: 12,
        subgroups: [
            { label: '{0}',             indices: [0] },
            { label: '{0,6}',           indices: [0, 6] },
            { label: '{0,4,8}',         indices: [0, 4, 8] },
            { label: '{0,3,6,9}',       indices: [0, 3, 6, 9] },
            { label: '{0,2,4,6,8,10}',  indices: [0, 2, 4, 6, 8, 10] },
            { label: 'ℤ₁₂',             indices: [0,1,2,3,4,5,6,7,8,9,10,11] },
        ],
    },
};

const COSET_COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444',
    '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16',
];

function computeCosets(n: number, h: number[]): number[][] {
    const visited = new Set<number>();
    const cosets: number[][] = [];
    for (let g = 0; g < n; g++) {
        if (visited.has(g)) continue;
        const coset = [...new Set(h.map(hi => (g + hi) % n))].sort((a, b) => a - b);
        coset.forEach(el => visited.add(el));
        cosets.push(coset);
    }
    return cosets;
}

const W = 400, H = 400, CX = 200, CY = 200, R = 155, R_CIRCLE = 22;

export default function SubgroupCosetLab() {
    const [groupKey, setGroupKey] = useState('Z6');
    const [subgroupIdx, setSubgroupIdx] = useState(1);
    const [hovered, setHovered] = useState<number | null>(null);

    const group = GROUPS[groupKey];
    const subgroup = group.subgroups[Math.min(subgroupIdx, group.subgroups.length - 1)];

    const cosets = useMemo(() => computeCosets(group.n, subgroup.indices), [group, subgroup]);

    /* Assign each element to a coset index */
    const elementCoset = useMemo(() => {
        const map = new Map<number, number>();
        cosets.forEach((c, ci) => c.forEach(el => map.set(el, ci)));
        return map;
    }, [cosets]);

    const handleGroupChange = (key: string) => {
        setGroupKey(key);
        setSubgroupIdx(1);
    };

    /* SVG element positions arranged in a ring */
    const elements = Array.from({ length: group.n }, (_, i) => {
        const angle = (2 * Math.PI * i) / group.n - Math.PI / 2;
        return { idx: i, x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle) };
    });

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Subgroup &amp; Coset Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Select a group and subgroup to see coset partitions.</p>
                </div>

                {/* Group selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Group</p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(GROUPS).map(key => (
                            <button
                                key={key}
                                onClick={() => handleGroupChange(key)}
                                className={`rounded-lg border py-2 text-sm font-semibold transition-colors ${groupKey === key
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                                    }`}
                            >
                                {GROUPS[key].name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subgroup selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Subgroup H</p>
                    <div className="flex flex-col gap-1.5">
                        {group.subgroups.map((sg, i) => (
                            <button
                                key={i}
                                onClick={() => setSubgroupIdx(i)}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-mono text-left transition-colors ${subgroupIdx === i
                                    ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-300'
                                    }`}
                            >
                                {sg.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lagrange display */}
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Lagrange's Theorem</p>
                    <p className="text-2xl font-bold text-amber-900 text-center">
                        {group.n} = {subgroup.indices.length} × {cosets.length}
                    </p>
                    <p className="text-xs text-amber-700 text-center mt-1">
                        |G| = |H| × [G:H]
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-amber-800">
                        <div className="flex justify-between"><span>|G| =</span><strong>{group.n}</strong></div>
                        <div className="flex justify-between"><span>|H| =</span><strong>{subgroup.indices.length}</strong></div>
                        <div className="flex justify-between"><span>[G:H] =</span><strong>{cosets.length} cosets</strong></div>
                    </div>
                </div>

                {/* Coset legend */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Cosets</p>
                    <div className="space-y-1.5">
                        {cosets.map((coset, ci) => (
                            <div key={ci} className="flex items-center gap-2">
                                <span className="inline-block w-3 h-3 rounded-full" style={{ background: COSET_COLORS[ci % COSET_COLORS.length] }} />
                                <span className="text-xs font-mono text-slate-600">{'{' + coset.join(',') + '}'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[400px]">
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
                    {/* Ring guide */}
                    <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4,4" />

                    {/* Element circles */}
                    {elements.map(({ idx, x, y }) => {
                        const ci = elementCoset.get(idx) ?? 0;
                        const color = COSET_COLORS[ci % COSET_COLORS.length];
                        const isHovered = hovered === idx;
                        const inSubgroup = subgroup.indices.includes(idx);
                        return (
                            <g key={idx} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}>
                                <circle
                                    cx={x} cy={y} r={R_CIRCLE}
                                    fill={color}
                                    stroke={inSubgroup ? '#1e293b' : 'white'}
                                    strokeWidth={inSubgroup ? 3 : 2}
                                    opacity={isHovered ? 1 : 0.85}
                                />
                                <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={12} fontWeight="bold">
                                    {idx}
                                </text>
                                {inSubgroup && (
                                    <circle cx={x} cy={y} r={R_CIRCLE + 5} fill="none" stroke="#1e293b" strokeWidth={1.5} strokeDasharray="3,2" />
                                )}
                            </g>
                        );
                    })}

                    {/* Center label */}
                    <text x={CX} y={CY - 10} textAnchor="middle" fill="#94a3b8" fontSize={13} fontWeight="600">{group.name}</text>
                    <text x={CX} y={CY + 8} textAnchor="middle" fill="#94a3b8" fontSize={10}>{cosets.length} cosets</text>

                    {/* Hover tooltip */}
                    {hovered !== null && (
                        <g>
                            <rect x={CX - 60} y={CY + 30} width={120} height={28} rx={6} fill="#1e293b" fillOpacity={0.92} />
                            <text x={CX} y={CY + 49} textAnchor="middle" fill="white" fontSize={11}>
                                {hovered} ∈ coset {'{' + (cosets[elementCoset.get(hovered) ?? 0] ?? []).join(',') + '}'}
                            </text>
                        </g>
                    )}

                    {/* Subgroup legend marker */}
                    <g transform="translate(10,10)">
                        <circle cx={8} cy={8} r={8} fill="#6366f1" stroke="#1e293b" strokeWidth={2} />
                        <text x={20} y={12} fill="#475569" fontSize={10}>= in subgroup H</text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
