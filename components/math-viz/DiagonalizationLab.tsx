"use client";

import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';

/* ── Math helpers ──────────────────────────────────────────────────────── */

function applyM(m: number[][], x: number, y: number): [number, number] {
    return [m[0][0]*x + m[0][1]*y, m[1][0]*x + m[1][1]*y];
}

function computeDecomp(m: number[][]) {
    const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
    const trace = a + d, det = a*d - b*c;
    const disc = trace*trace - 4*det;
    if (disc < 0) return null;

    const sq = Math.sqrt(Math.max(0, disc));
    const λ1 = (trace + sq) / 2, λ2 = (trace - sq) / 2;

    const findEv = (λ: number): [number, number] => {
        const eps = 1e-6;
        const v: [number,number] = Math.abs(b) > eps ? [b, λ-a] : Math.abs(c) > eps ? [λ-d, c] : [1, 0];
        const len = Math.hypot(v[0], v[1]);
        return len > eps ? [v[0]/len, v[1]/len] : [1, 0];
    };

    const v1 = findEv(λ1), v2 = findEv(λ2);
    const detP = v1[0]*v2[1] - v1[1]*v2[0];
    const isDefective = Math.abs(detP) < 0.01;

    // P = eigenvector matrix, P⁻¹
    const P = [[v1[0], v2[0]], [v1[1], v2[1]]];
    const invDetP = isDefective ? 0 : 1/detP;
    const Pinv = [[ v2[1]*invDetP, -v2[0]*invDetP],
                  [-v1[1]*invDetP,  v1[0]*invDetP]];

    return { λ1, λ2, v1, v2, P, Pinv, isDefective };
}

/* ── SVG helpers ───────────────────────────────────────────────────────── */

const W = 560, H = 420, S = 52, CX = W/2, CY = H/2;

function sv(x: number, y: number): [number, number] {
    return [CX + x*S, CY - y*S];
}

function Arrow({ x1, y1, x2, y2, color, label, width = 2.5, dashed = false, opacity = 1 }: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; label?: string; dashed?: boolean; width?: number; opacity?: number;
}) {
    const dx = x2-x1, dy = y2-y1, len = Math.hypot(dx, dy);
    if (len < 4) return null;
    const ang = Math.atan2(dy, dx), hs = 11, ha = 0.38;
    const ux = dx/len, uy = dy/len;
    return (
        <g opacity={opacity}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color}
                strokeWidth={dashed ? 1.5 : width}
                strokeDasharray={dashed ? "6,4" : undefined} strokeLinecap="round" />
            {!dashed && (
                <polygon fill={color}
                    points={`${x2},${y2} ${x2-hs*Math.cos(ang-ha)},${y2-hs*Math.sin(ang-ha)} ${x2-hs*Math.cos(ang+ha)},${y2-hs*Math.sin(ang+ha)}`} />
            )}
            {label && (
                <text x={x2+ux*20} y={y2-uy*10} fill={color} fontSize={12} fontWeight="700" textAnchor="middle" dominantBaseline="middle">{label}</text>
            )}
        </g>
    );
}

/* ── Presets ───────────────────────────────────────────────────────────── */

const PRESETS = [
    { name: 'Symmetric',   m: [[1.5, 0.5], [0.5, 1.5]], desc: 'λ=2,1 · orthogonal eigenvectors' },
    { name: 'Diagonal',    m: [[2,   0  ], [0,   0.5]], desc: 'λ=2,0.5 · already diagonal' },
    { name: 'Shear-like',  m: [[2,   1  ], [0,   0.5]], desc: 'λ=2,0.5 · non-symmetric' },
    { name: 'Expand Y',    m: [[1,   0  ], [0.5, 3  ]], desc: 'λ=1,3 · strong Y expansion' },
];

/* ── Power demonstration ───────────────────────────────────────────────── */

function matPow(m: number[][], k: number): number[][] {
    let res = [[1,0],[0,1]];
    for (let i = 0; i < k; i++) {
        res = [
            [res[0][0]*m[0][0]+res[0][1]*m[1][0], res[0][0]*m[0][1]+res[0][1]*m[1][1]],
            [res[1][0]*m[0][0]+res[1][1]*m[1][0], res[1][0]*m[0][1]+res[1][1]*m[1][1]],
        ];
    }
    return res;
}

/* ── Main component ────────────────────────────────────────────────────── */

export default function DiagonalizationLab() {
    const [matrix, setMatrix] = useState([[1.5, 0.5], [0.5, 1.5]]);
    const [c1, setC1] = useState(1.2);
    const [c2, setC2] = useState(0.8);
    const [power, setPower] = useState(1);
    const [mode, setMode] = useState<'decomp' | 'power'>('decomp');

    const decomp = useMemo(() => computeDecomp(matrix), [matrix]);

    const [ox, oy] = sv(0, 0);

    if (!decomp || decomp.isDefective) {
        return (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 font-semibold">This matrix has complex or repeated eigenvalues and cannot be diagonalized over ℝ.</p>
                <p className="text-amber-600 text-sm mt-1">Try a symmetric or non-shear matrix.</p>
            </div>
        );
    }

    const { λ1, λ2, v1, v2, P, Pinv } = decomp;

    // Vector v = c1*v1 + c2*v2
    const vx = c1*v1[0] + c2*v2[0];
    const vy = c1*v1[1] + c2*v2[1];

    // Component vectors
    const comp1: [number,number] = [c1*v1[0], c1*v1[1]];
    const comp2: [number,number] = [c2*v2[0], c2*v2[1]];

    // Av = c1*λ1*v1 + c2*λ2*v2
    const Avx = c1*λ1*v1[0] + c2*λ2*v2[0];
    const Avy = c1*λ1*v1[1] + c2*λ2*v2[1];
    const Avcomp1: [number,number] = [c1*λ1*v1[0], c1*λ1*v1[1]];
    const Avcomp2: [number,number] = [c2*λ2*v2[0], c2*λ2*v2[1]];

    // Power mode: A^k * v
    const Ak = matPow(matrix, power);
    const [Akvx, Akvy] = applyM(Ak, vx, vy);
    const AkLen = Math.hypot(Akvx, Akvy);
    // Clamp display for large powers
    const AkScale = AkLen > 4 ? 4/AkLen : 1;

    // SVG positions
    const [v1sx, v1sy] = sv(v1[0]*1.5, v1[1]*1.5);
    const [v2sx, v2sy] = sv(v2[0]*1.5, v2[1]*1.5);
    const [vsx, vsy] = sv(vx, vy);
    const [Avsx, Avsy] = sv(Avx, Avy);
    const [c1sx, c1sy] = sv(comp1[0], comp1[1]);
    const [c2sx, c2sy] = sv(comp2[0], comp2[1]);
    const [Avc1sx, Avc1sy] = sv(Avcomp1[0], Avcomp1[1]);
    const [Avc2sx, Avc2sy] = sv(Avcomp2[0], Avcomp2[1]);
    const [Akvsx, Akvsy] = sv(Akvx*AkScale, Akvy*AkScale);

    // Eigenvector full lines
    const evLine = (ev: [number,number]) => {
        const [a,b]=sv(-ev[0]*5,-ev[1]*5), [c,d]=sv(ev[0]*5,ev[1]*5);
        return {x1:a,y1:b,x2:c,y2:d};
    };
    const el1 = evLine(v1), el2 = evLine(v2);

    const GRID = [-4,-3,-2,-1,0,1,2,3,4];

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Diagonalization Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Explore A = PDP⁻¹ — how any vector decomposes along eigenvectors.</p>
                </div>

                {/* Mode toggle */}
                <div className="flex gap-1 bg-slate-200 rounded-lg p-1">
                    <button onClick={() => setMode('decomp')}
                        className={`flex-1 text-xs py-1.5 rounded-md font-semibold transition-colors ${mode==='decomp' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                        Decomposition
                    </button>
                    <button onClick={() => setMode('power')}
                        className={`flex-1 text-xs py-1.5 rounded-md font-semibold transition-colors ${mode==='power' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
                        Matrix Powers
                    </button>
                </div>

                {/* Matrix inputs */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Matrix [A]</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[0,1].map(r => [0,1].map(c => (
                            <input key={`${r}${c}`} type="number"
                                value={+matrix[r][c].toFixed(3)}
                                onChange={e => {
                                    const m = matrix.map(row => [...row]);
                                    m[r][c] = parseFloat(e.target.value)||0;
                                    setMatrix(m);
                                }}
                                className="border border-slate-200 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:border-indigo-400"
                                step={0.5}
                            />
                        )))}
                    </div>
                </div>

                {/* Presets */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Presets</p>
                    <div className="flex flex-col gap-1">
                        {PRESETS.map(p => (
                            <button key={p.name} onClick={() => setMatrix(p.m)}
                                className="text-left px-3 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                <span className="text-sm font-semibold block">{p.name}</span>
                                <span className="text-[10px] text-slate-400">{p.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {mode === 'decomp' ? (
                    <>
                        {/* Eigenbasis coordinates */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Eigenbasis Coords (c₁, c₂)</p>
                            <p className="text-[10px] text-slate-400 mb-3">v = c₁·v₁ + c₂·v₂</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-mono text-xs w-6">c₁</span>
                                    <input type="range" min={-3} max={3} step={0.1} value={c1}
                                        onChange={e => setC1(parseFloat(e.target.value))} className="flex-1 accent-blue-600" />
                                    <span className="text-xs font-mono w-10 text-right">{c1.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-mono text-xs w-6">c₂</span>
                                    <input type="range" min={-3} max={3} step={0.1} value={c2}
                                        onChange={e => setC2(parseFloat(e.target.value))} className="flex-1 accent-red-500" />
                                    <span className="text-xs font-mono w-10 text-right">{c2.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Eigenvalues */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 space-y-1.5 text-xs font-mono">
                            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Eigenvalues</p>
                            <div className="flex justify-between"><span className="text-blue-600 font-bold">λ₁ = {λ1.toFixed(3)}</span><span className="text-slate-500">v₁=({v1[0].toFixed(2)}, {v1[1].toFixed(2)})</span></div>
                            <div className="flex justify-between"><span className="text-red-600 font-bold">λ₂ = {λ2.toFixed(3)}</span><span className="text-slate-500">v₂=({v2[0].toFixed(2)}, {v2[1].toFixed(2)})</span></div>
                            <div className="mt-2 pt-2 border-t border-indigo-100 text-slate-600">
                                Av = {c1.toFixed(1)}·{λ1.toFixed(2)}·v₁ + {c2.toFixed(1)}·{λ2.toFixed(2)}·v₂
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Power slider */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Power k</p>
                            <p className="text-[10px] text-slate-400 mb-3">A^k · v = P · D^k · P⁻¹ · v</p>
                            <input type="range" min={0} max={10} step={1} value={power}
                                onChange={e => setPower(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                            <p className="text-center font-mono font-bold text-emerald-700 mt-1">k = {power}</p>
                        </div>

                        {/* Eigenbasis coords for power mode */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Test Vector (c₁, c₂)</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600 font-mono text-xs w-6">c₁</span>
                                    <input type="range" min={-2} max={2} step={0.1} value={c1}
                                        onChange={e => setC1(parseFloat(e.target.value))} className="flex-1 accent-blue-600" />
                                    <span className="text-xs font-mono w-10 text-right">{c1.toFixed(1)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-mono text-xs w-6">c₂</span>
                                    <input type="range" min={-2} max={2} step={0.1} value={c2}
                                        onChange={e => setC2(parseFloat(e.target.value))} className="flex-1 accent-red-500" />
                                    <span className="text-xs font-mono w-10 text-right">{c2.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs font-mono">
                            <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Key insight</p>
                            <p className="text-emerald-800">A^k·v = c₁·<span className="text-blue-600 font-bold">λ₁^{power}</span>·v₁ + c₂·<span className="text-red-600 font-bold">λ₂^{power}</span>·v₂</p>
                            <p className="text-emerald-600 mt-1 font-sans">λ₁^k={λ1.toFixed(2)}^{power}={Math.pow(λ1,power).toFixed(2)}</p>
                            <p className="text-emerald-600 font-sans">λ₂^k={λ2.toFixed(2)}^{power}={Math.pow(λ2,power).toFixed(2)}</p>
                        </div>
                    </>
                )}
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 min-h-[420px] bg-white rounded-xl border border-slate-200 overflow-hidden">
                <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

                    {/* Ghost grid */}
                    <g opacity="0.18">
                        {GRID.map(y => { const [x1,y1]=sv(-4.5,y),[x2,y2]=sv(4.5,y); return <line key={`gh${y}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={y===0?'#475569':'#cbd5e1'} strokeWidth={y===0?1:0.7}/> })}
                        {GRID.map(x => { const [x1,y1]=sv(x,-4.5),[x2,y2]=sv(x,4.5); return <line key={`gv${x}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={x===0?'#475569':'#cbd5e1'} strokeWidth={x===0?1:0.7}/> })}
                    </g>

                    {/* Eigenvector lines (full) */}
                    <line {...el1} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="8,5" opacity={0.5} />
                    <line {...el2} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="8,5" opacity={0.5} />

                    {/* Eigenvector arrows */}
                    <Arrow x1={ox} y1={oy} x2={v1sx} y2={v1sy} color="#3b82f6" label={`v₁(λ=${λ1.toFixed(1)})`} width={2.5} />
                    <Arrow x1={ox} y1={oy} x2={v2sx} y2={v2sy} color="#ef4444" label={`v₂(λ=${λ2.toFixed(1)})`} width={2.5} />

                    {mode === 'decomp' ? (
                        <>
                            {/* Parallelogram construction: dashed comp vectors */}
                            <Arrow x1={ox} y1={oy} x2={c1sx} y2={c1sy} color="#3b82f6" width={1.5} dashed opacity={0.7} />
                            <Arrow x1={ox} y1={oy} x2={c2sx} y2={c2sy} color="#ef4444" width={1.5} dashed opacity={0.7} />
                            {/* Parallelogram sides for v */}
                            <line x1={c1sx} y1={c1sy} x2={vsx} y2={vsy} stroke="#ef4444" strokeWidth={1} strokeDasharray="4,3" opacity={0.45} />
                            <line x1={c2sx} y1={c2sy} x2={vsx} y2={vsy} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,3" opacity={0.45} />

                            {/* Av parallelogram */}
                            <Arrow x1={ox} y1={oy} x2={Avc1sx} y2={Avc1sy} color="#3b82f6" width={1.5} dashed opacity={0.5} />
                            <Arrow x1={ox} y1={oy} x2={Avc2sx} y2={Avc2sy} color="#ef4444" width={1.5} dashed opacity={0.5} />
                            <line x1={Avc1sx} y1={Avc1sy} x2={Avsx} y2={Avsy} stroke="#ef4444" strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />
                            <line x1={Avc2sx} y1={Avc2sy} x2={Avsx} y2={Avsy} stroke="#3b82f6" strokeWidth={1} strokeDasharray="4,3" opacity={0.35} />

                            {/* v and Av */}
                            <Arrow x1={ox} y1={oy} x2={Avsx} y2={Avsy} color="#16a34a" label="Av" width={4} />
                            <Arrow x1={ox} y1={oy} x2={vsx} y2={vsy} color="#7c3aed" label="v" width={4} />
                        </>
                    ) : (
                        <>
                            {/* Original v */}
                            <Arrow x1={ox} y1={oy} x2={vsx} y2={vsy} color="#7c3aed" label="v" width={3} opacity={0.6} dashed />
                            {/* A^k v */}
                            <Arrow x1={ox} y1={oy} x2={Akvsx} y2={Akvsy} color="#16a34a" label={`A^${power}·v${AkScale < 1 ? ' (scaled)' : ''}`} width={4} />
                        </>
                    )}

                    {/* Origin */}
                    <circle cx={ox} cy={oy} r={4.5} fill="#1e293b" />

                    {/* Instruction label */}
                    <text x={W-10} y={15} textAnchor="end" fill="#94a3b8" fontSize={11}>
                        {mode==='decomp' ? 'Adjust c₁, c₂ to control v in eigenbasis' : 'Adjust k to see A^k applied to v'}
                    </text>

                    {/* Legend */}
                    <g transform={`translate(8, ${H-76})`}>
                        <rect width={270} height={70} rx={6} fill="white" fillOpacity={0.94} stroke="#e2e8f0" />
                        <line x1={10} y1={14} x2={28} y2={14} stroke="#3b82f6" strokeWidth={2} strokeDasharray="7,4" />
                        <text x={34} y={18} fill="#3b82f6" fontSize={11} fontWeight="600">v₁ — eigendirection (λ₁)</text>
                        <line x1={10} y1={34} x2={28} y2={34} stroke="#ef4444" strokeWidth={2} strokeDasharray="7,4" />
                        <text x={34} y={38} fill="#ef4444" fontSize={11} fontWeight="600">v₂ — eigendirection (λ₂)</text>
                        <line x1={10} y1={54} x2={28} y2={54} stroke="#7c3aed" strokeWidth={3} />
                        <text x={34} y={58} fill="#7c3aed" fontSize={11} fontWeight="600">v = c₁v₁ + c₂v₂</text>
                        <line x1={148} y1={54} x2={166} y2={54} stroke="#16a34a" strokeWidth={3} />
                        <text x={172} y={58} fill="#16a34a" fontSize={11} fontWeight="600">
                            {mode==='decomp' ? 'Av (scaled components)' : `A^${power}·v`}
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
