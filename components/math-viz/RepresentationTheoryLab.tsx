"use client";

import React, { useState, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Representation Theory Lab — pure SVG, no framer-motion, no Three.js
   Shows cyclic group representations on the complex plane.
   ──────────────────────────────────────────────────────────────────────────── */

const CYCLIC_GROUPS = [
    { n: 3, name: 'C₃', elements: ['e', 'g', 'g²'] },
    { n: 4, name: 'C₄', elements: ['e', 'g', 'g²', 'g³'] },
    { n: 5, name: 'C₅', elements: ['e', 'g', 'g²', 'g³', 'g⁴'] },
    { n: 6, name: 'C₆', elements: ['e', 'g', 'g²', 'g³', 'g⁴', 'g⁵'] },
];

const POINT_COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#ef4444', '#06b6d4', '#8b5cf6', '#84cc16',
];

const W = 360, H = 360, CX = 180, CY = 180, RADIUS = 130;

function polarToSvg(angle: number): [number, number] {
    return [CX + RADIUS * Math.cos(angle), CY - RADIUS * Math.sin(angle)];
}

export default function RepresentationTheoryLab() {
    const [groupIdx, setGroupIdx] = useState(0);
    const [k, setK] = useState(1);
    const [hovered, setHovered] = useState<number | null>(null);

    const group = CYCLIC_GROUPS[groupIdx];
    const n = group.n;
    const kClamped = Math.min(k, n - 1);

    /* ρ_k(g^j) = e^(2πijk/n) */
    const points = useMemo(() => {
        return Array.from({ length: n }, (_, j) => {
            const angle = (2 * Math.PI * j * kClamped) / n;
            const re = Math.cos(angle);
            const im = Math.sin(angle);
            const [sx, sy] = polarToSvg(angle);
            return { j, re, im, sx, sy, angle };
        });
    }, [n, kClamped]);

    const handleGroupChange = (idx: number) => {
        setGroupIdx(idx);
        setK(1);
        setHovered(null);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Representation Theory Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Explore ρ_k: C_n → GL(ℂ) — cyclic group reps on the complex plane.
                    </p>
                </div>

                {/* Group selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Group</p>
                    <div className="grid grid-cols-2 gap-2">
                        {CYCLIC_GROUPS.map((g, i) => (
                            <button
                                key={i}
                                onClick={() => handleGroupChange(i)}
                                className={`rounded-lg border py-2 text-sm font-bold transition-colors ${groupIdx === i
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                                    }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* k slider */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Representation ρ_k  (k = {kClamped})
                    </p>
                    <input
                        type="range" min={0} max={n - 1} step={1}
                        value={kClamped}
                        onChange={e => setK(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>k=0 (trivial)</span><span>k={n - 1}</span>
                    </div>
                    <div className="mt-3 bg-indigo-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-indigo-700 font-mono">
                            ρ_{kClamped}(g^j) = e^(2πij·{kClamped}/{n})
                        </p>
                    </div>
                </div>

                {/* Representation table */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Values</p>
                    <div className="space-y-1">
                        {points.map(pt => (
                            <div
                                key={pt.j}
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${hovered === pt.j ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                onMouseEnter={() => setHovered(pt.j)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <span
                                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ background: POINT_COLORS[pt.j % POINT_COLORS.length] }}
                                />
                                <span className="font-mono text-slate-600 w-8">{group.elements[pt.j]}</span>
                                <span className="font-mono text-slate-500 text-[10px]">
                                    {pt.re.toFixed(3)}{pt.im >= 0 ? '+' : ''}{pt.im.toFixed(3)}i
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {kClamped === 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs font-bold text-amber-700">Trivial representation</p>
                        <p className="text-xs text-amber-600 mt-1">All elements map to 1. Every group has this as irrep ρ₀.</p>
                    </div>
                )}
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[360px]">
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

                    {/* Axes */}
                    <line x1={10} y1={CY} x2={W - 10} y2={CY} stroke="#e2e8f0" strokeWidth={1} />
                    <line x1={CX} y1={10} x2={CX} y2={H - 10} stroke="#e2e8f0" strokeWidth={1} />

                    {/* Axis labels */}
                    <text x={W - 15} y={CY - 6} textAnchor="end" fill="#94a3b8" fontSize={10}>Re</text>
                    <text x={CX + 6} y={16} fill="#94a3b8" fontSize={10}>Im</text>

                    {/* Unit circle */}
                    <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth={1.5} />

                    {/* Unit labels on axes */}
                    <text x={CX + RADIUS + 4} y={CY + 4} fill="#94a3b8" fontSize={9}>1</text>
                    <text x={CX - RADIUS - 4} y={CY + 4} textAnchor="end" fill="#94a3b8" fontSize={9}>-1</text>
                    <text x={CX + 3} y={CY - RADIUS - 4} fill="#94a3b8" fontSize={9}>i</text>
                    <text x={CX + 3} y={CY + RADIUS + 12} fill="#94a3b8" fontSize={9}>-i</text>

                    {/* Lines from origin to each point */}
                    {points.map(pt => {
                        const color = POINT_COLORS[pt.j % POINT_COLORS.length];
                        const hl = hovered === pt.j;
                        return (
                            <line
                                key={pt.j}
                                x1={CX} y1={CY} x2={pt.sx} y2={pt.sy}
                                stroke={color}
                                strokeWidth={hl ? 2.5 : 1.5}
                                opacity={hovered !== null && !hl ? 0.25 : 0.7}
                            />
                        );
                    })}

                    {/* Points */}
                    {points.map(pt => {
                        const color = POINT_COLORS[pt.j % POINT_COLORS.length];
                        const hl = hovered === pt.j;
                        return (
                            <g
                                key={pt.j}
                                onMouseEnter={() => setHovered(pt.j)}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle
                                    cx={pt.sx} cy={pt.sy} r={hl ? 12 : 9}
                                    fill={color}
                                    stroke="white" strokeWidth={2}
                                    opacity={hovered !== null && !hl ? 0.3 : 1}
                                />
                                <text x={pt.sx} y={pt.sy} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={9} fontWeight="bold">
                                    {group.elements[pt.j]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Origin dot */}
                    <circle cx={CX} cy={CY} r={4} fill="#475569" />

                    {/* Hover label */}
                    {hovered !== null && (() => {
                        const pt = points[hovered];
                        return (
                            <g>
                                <rect x={CX - 90} y={H - 35} width={180} height={26} rx={6} fill="#1e293b" fillOpacity={0.88} />
                                <text x={CX} y={H - 17} textAnchor="middle" fill="white" fontSize={10}>
                                    {group.elements[pt.j]}: {pt.re.toFixed(3)}{pt.im >= 0 ? '+' : ''}{pt.im.toFixed(3)}i
                                </text>
                            </g>
                        );
                    })()}

                    {/* Title */}
                    <text x={CX} y={15} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight="600">
                        ρ_{kClamped} on {group.name}
                    </text>
                </svg>
            </div>
        </div>
    );
}
