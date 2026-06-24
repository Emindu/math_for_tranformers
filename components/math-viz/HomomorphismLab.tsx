"use client";

import React, { useState } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Homomorphism Lab — pure SVG, no framer-motion, no Three.js
   Shows group homomorphisms as arrows between element sets.
   ──────────────────────────────────────────────────────────────────────────── */

interface HomDef {
    name: string;
    domainName: string;
    codomainName: string;
    domain: string[];
    codomain: string[];
    map: number[];          // map[i] = codomain index that domain[i] maps to
    kernelIndices: number[];
    isInjective: boolean;
    isSurjective: boolean;
    theorem: string;        // e.g. "|G|/|ker| = |Im|"
}

const HOMOMORPHISMS: HomDef[] = [
    {
        name: 'φ: ℤ₆ → ℤ₃  (x mod 3)',
        domainName: 'ℤ₆', codomainName: 'ℤ₃',
        domain: ['0','1','2','3','4','5'],
        codomain: ['0','1','2'],
        map: [0,1,2,0,1,2],
        kernelIndices: [0,3],
        isInjective: false, isSurjective: true,
        theorem: '6 / 2 = 3',
    },
    {
        name: 'φ: ℤ₄ → ℤ₂  (x mod 2)',
        domainName: 'ℤ₄', codomainName: 'ℤ₂',
        domain: ['0','1','2','3'],
        codomain: ['0','1'],
        map: [0,1,0,1],
        kernelIndices: [0,2],
        isInjective: false, isSurjective: true,
        theorem: '4 / 2 = 2',
    },
    {
        name: 'φ: ℤ₆ → ℤ₂  (x mod 2)',
        domainName: 'ℤ₆', codomainName: 'ℤ₂',
        domain: ['0','1','2','3','4','5'],
        codomain: ['0','1'],
        map: [0,1,0,1,0,1],
        kernelIndices: [0,2,4],
        isInjective: false, isSurjective: true,
        theorem: '6 / 3 = 2',
    },
    {
        name: 'φ: ℤ₃ ↪ ℤ₆  (x × 2, injection)',
        domainName: 'ℤ₃', codomainName: 'ℤ₆',
        domain: ['0','1','2'],
        codomain: ['0','1','2','3','4','5'],
        map: [0,2,4],
        kernelIndices: [0],
        isInjective: true, isSurjective: false,
        theorem: '3 / 1 = 3',
    },
];

const SVG_H = 60;   // height per element slot
const LEFT_X = 70;
const RIGHT_X = 310;
const R = 22;

export default function HomomorphismLab() {
    const [homIdx, setHomIdx] = useState(0);
    const [hovered, setHovered] = useState<{ side: 'domain' | 'codomain'; idx: number } | null>(null);

    const hom = HOMOMORPHISMS[homIdx];
    const domainCount = hom.domain.length;
    const codomainCount = hom.codomain.length;

    const totalH = Math.max(domainCount, codomainCount) * SVG_H + 20;

    /* Vertical center of element i in a column of n elements */
    const yOf = (i: number, n: number) =>
        10 + (i + 0.5) * SVG_H + ((Math.max(domainCount, codomainCount) - n) * SVG_H) / 2;

    /* Determine which arrows to highlight on hover */
    const isHighlighted = (di: number, ci: number): boolean => {
        if (!hovered) return false;
        if (hovered.side === 'domain' && hovered.idx === di) return true;
        if (hovered.side === 'codomain' && hovered.idx === ci) return hom.map[di] === ci;
        return false;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Homomorphism Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Arrows show structure-preserving maps. Hover to trace mappings.</p>
                </div>

                {/* Homomorphism selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Select Map</p>
                    <div className="flex flex-col gap-1.5">
                        {HOMOMORPHISMS.map((h, i) => (
                            <button
                                key={i}
                                onClick={() => { setHomIdx(i); setHovered(null); }}
                                className={`rounded-lg border px-3 py-2 text-xs text-left font-mono transition-colors ${homIdx === i
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                                    }`}
                            >
                                {h.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Properties */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Properties</p>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${hom.isInjective ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-700">Injective (one-to-one)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${hom.isSurjective ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-700">Surjective (onto)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${hom.isInjective && hom.isSurjective ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-700">Isomorphism</span>
                    </div>
                </div>

                {/* Kernel */}
                <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-2">Kernel (ker φ)</p>
                    <p className="text-sm font-mono text-amber-800">
                        {'{' + hom.kernelIndices.map(i => hom.domain[i]).join(', ') + '}'}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">|ker φ| = {hom.kernelIndices.length}</p>
                </div>

                {/* First Isomorphism Theorem */}
                <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">First Iso. Theorem</p>
                    <p className="text-xs text-indigo-800">|G| / |ker φ| = |Im φ|</p>
                    <p className="text-base font-bold text-indigo-900 mt-1">{hom.theorem}</p>
                </div>
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center">
                <svg
                    width={400}
                    height={Math.max(totalH, 200)}
                    viewBox={`0 0 400 ${Math.max(totalH, 200)}`}
                    style={{ display: 'block' }}
                >
                    {/* Column labels */}
                    <text x={LEFT_X} y={8} textAnchor="middle" fill="#475569" fontSize={11} fontWeight="700">{hom.domainName}</text>
                    <text x={RIGHT_X} y={8} textAnchor="middle" fill="#475569" fontSize={11} fontWeight="700">{hom.codomainName}</text>

                    {/* Arrows */}
                    {hom.domain.map((_, di) => {
                        const ci = hom.map[di];
                        const x1 = LEFT_X + R;
                        const y1 = yOf(di, domainCount);
                        const x2 = RIGHT_X - R;
                        const y2 = yOf(ci, codomainCount);
                        const isKer = hom.kernelIndices.includes(di);
                        const hl = isHighlighted(di, ci);
                        return (
                            <path
                                key={di}
                                d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                                fill="none"
                                stroke={isKer ? '#f59e0b' : hl ? '#6366f1' : '#cbd5e1'}
                                strokeWidth={hl ? 2.5 : 1.5}
                                strokeDasharray={isKer ? '4,3' : undefined}
                                opacity={hovered && !hl ? 0.25 : 1}
                                markerEnd={`url(#arrow-${isKer ? 'ker' : hl ? 'hl' : 'def'})`}
                            />
                        );
                    })}

                    {/* Arrow markers */}
                    <defs>
                        {[['def','#cbd5e1'], ['hl','#6366f1'], ['ker','#f59e0b']].map(([id, c]) => (
                            <marker key={id} id={`arrow-${id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                <path d="M0,0 L6,3 L0,6 Z" fill={c} />
                            </marker>
                        ))}
                    </defs>

                    {/* Domain elements */}
                    {hom.domain.map((el, di) => {
                        const y = yOf(di, domainCount);
                        const isKer = hom.kernelIndices.includes(di);
                        const hl = hovered?.side === 'domain' && hovered.idx === di;
                        return (
                            <g
                                key={di}
                                onMouseEnter={() => setHovered({ side: 'domain', idx: di })}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle cx={LEFT_X} cy={y} r={R}
                                    fill={isKer ? '#fef3c7' : hl ? '#eef2ff' : '#f8fafc'}
                                    stroke={isKer ? '#f59e0b' : hl ? '#6366f1' : '#cbd5e1'}
                                    strokeWidth={isKer || hl ? 2.5 : 1.5}
                                />
                                <text x={LEFT_X} y={y} textAnchor="middle" dominantBaseline="middle" fill={isKer ? '#b45309' : '#475569'} fontSize={13} fontWeight="700">{el}</text>
                            </g>
                        );
                    })}

                    {/* Codomain elements */}
                    {hom.codomain.map((el, ci) => {
                        const y = yOf(ci, codomainCount);
                        const isImage = hom.map.includes(ci);
                        const hl = hovered?.side === 'codomain' && hovered.idx === ci;
                        return (
                            <g
                                key={ci}
                                onMouseEnter={() => setHovered({ side: 'codomain', idx: ci })}
                                onMouseLeave={() => setHovered(null)}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle cx={RIGHT_X} cy={y} r={R}
                                    fill={isImage ? (hl ? '#eef2ff' : '#f0fdf4') : '#f8fafc'}
                                    stroke={hl ? '#6366f1' : isImage ? '#22c55e' : '#e2e8f0'}
                                    strokeWidth={hl || isImage ? 2.5 : 1.5}
                                />
                                <text x={RIGHT_X} y={y} textAnchor="middle" dominantBaseline="middle" fill={isImage ? '#166534' : '#94a3b8'} fontSize={13} fontWeight="700">{el}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
