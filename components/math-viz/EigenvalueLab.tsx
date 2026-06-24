"use client";

import React, { useState, useMemo } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

/* ── Math helpers ──────────────────────────────────────────────────────── */

function applyM(m: number[][], x: number, y: number): [number, number] {
    return [m[0][0]*x + m[0][1]*y, m[1][0]*x + m[1][1]*y];
}

function computeEigen(m: number[][]) {
    const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
    const trace = a + d, det = a*d - b*c;
    const disc = trace*trace - 4*det;
    if (disc < 0) {
        return { eigenvalues: [trace/2, Math.sqrt(-disc)/2] as [number,number], eigenvectors: null, isComplex: true };
    }
    const sq = Math.sqrt(disc);
    const λ1 = (trace + sq) / 2, λ2 = (trace - sq) / 2;
    const findEv = (λ: number): [number, number] => {
        const eps = 1e-6;
        const v: [number,number] = Math.abs(b) > eps ? [b, λ-a] : Math.abs(c) > eps ? [λ-d, c] : [1, 0];
        const len = Math.hypot(v[0], v[1]);
        return len > eps ? [v[0]/len, v[1]/len] : [1, 0];
    };
    return { eigenvalues: [λ1, λ2] as [number,number], eigenvectors: [findEv(λ1), findEv(λ2)] as [[number,number],[number,number]], isComplex: false };
}

/* ── SVG helpers ───────────────────────────────────────────────────────── */

const W = 560, H = 460, S = 54, CX = W/2, CY = H/2;

function sv(x: number, y: number): [number, number] {
    return [CX + x*S, CY - y*S];
}

function Arrow({ x1, y1, x2, y2, color, label, width = 2.5, dashed = false }: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; label?: string; dashed?: boolean; width?: number;
}) {
    const dx = x2-x1, dy = y2-y1, len = Math.hypot(dx, dy);
    if (len < 4) return null;
    const ang = Math.atan2(dy, dx), hs = 11, ha = 0.38;
    const ux = dx/len, uy = dy/len;
    return (
        <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color}
                strokeWidth={dashed ? 1.5 : width}
                strokeDasharray={dashed ? "6,4" : undefined} strokeLinecap="round" />
            {!dashed && (
                <polygon fill={color}
                    points={`${x2},${y2} ${x2-hs*Math.cos(ang-ha)},${y2-hs*Math.sin(ang-ha)} ${x2-hs*Math.cos(ang+ha)},${y2-hs*Math.sin(ang+ha)}`} />
            )}
            {label && (
                <text x={x2+ux*18} y={y2-uy*10} fill={color} fontSize={12} fontWeight="700" textAnchor="middle" dominantBaseline="middle">{label}</text>
            )}
        </g>
    );
}

/* ── Presets ───────────────────────────────────────────────────────────── */

const PRESETS = [
    { label: 'Symmetric',    m: [[2, 1], [1, 2]], note: 'λ=3, 1 · 45° axes' },
    { label: 'Scale X',      m: [[2, 0], [0, 1]], note: 'λ=2, 1 · axis-aligned' },
    { label: 'Scale Y',      m: [[1, 0], [0, 3]], note: 'λ=1, 3 · axis-aligned' },
    { label: 'Shear',        m: [[1, 1], [0, 1]], note: 'λ=1,1 · 1 eigenvector' },
    { label: 'Saddle',       m: [[2, 0], [0, 0.5]], note: 'λ=2, 0.5 · expand/shrink' },
    { label: 'Rotation 90°', m: [[0,-1], [1, 0]], note: 'no real eigenvalues' },
];

const GRID = [-4,-3,-2,-1,0,1,2,3,4];

/* ── Main component ────────────────────────────────────────────────────── */

export default function EigenvalueLab() {
    const [matrix, setMatrix] = useState([[2, 1], [1, 2]]);
    const [vecAngle, setVecAngle] = useState(60);
    const VEC_LEN = 1.8;

    const { eigenvalues, eigenvectors, isComplex } = useMemo(() => computeEigen(matrix), [matrix]);

    const ang = vecAngle * Math.PI / 180;
    const vx = VEC_LEN * Math.cos(ang), vy = VEC_LEN * Math.sin(ang);
    const [Avx, Avy] = applyM(matrix, vx, vy);
    const AvLen = Math.hypot(Avx, Avy);
    const cross = vx*Avy - vy*Avx;
    const isOnEigenspace = AvLen > 0.05 && Math.abs(cross) < 0.28 * AvLen;
    const effλ = isOnEigenspace ? (Avx*vx + Avy*vy) / (vx*vx + vy*vy) : null;

    const [ox, oy] = sv(0, 0);
    const [vsx, vsy] = sv(vx, vy);
    const [Avsx, Avsy] = sv(Avx, Avy);

    const vColor  = isOnEigenspace ? '#16a34a' : '#7c3aed';
    const AvColor = isOnEigenspace ? '#16a34a' : '#db2777';

    const evLine = (ev: [number, number]) => {
        const [ex, ey] = ev;
        const [x1,y1] = sv(-ex*5, -ey*5);
        const [x2,y2] = sv(ex*5, ey*5);
        return { x1, y1, x2, y2 };
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Eigenvalue Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Rotate the test vector to discover eigendirections.</p>
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
                                    m[r][c] = parseFloat(e.target.value) || 0;
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
                            <button key={p.label} onClick={() => setMatrix(p.m)}
                                className="text-left px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                                <span className="font-semibold text-sm block">{p.label}</span>
                                <span className="text-slate-400">{p.note}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Eigenvalues */}
                <div className={`rounded-xl border p-4 ${isComplex ? 'bg-purple-50 border-purple-200' : 'bg-indigo-50 border-indigo-100'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Eigenvalues</p>
                    {isComplex ? (
                        <>
                            <p className="font-mono text-sm text-purple-700 font-bold">λ = {eigenvalues[0].toFixed(2)} ± {eigenvalues[1].toFixed(2)}i</p>
                            <p className="text-xs text-purple-600 mt-1">Complex — no real eigenvectors. The matrix rotates all vectors.</p>
                        </>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="bg-blue-100 rounded-lg px-3 py-1.5 flex justify-between items-center">
                                <span className="text-sm font-mono font-bold text-blue-700">λ₁ = {eigenvalues[0].toFixed(3)}</span>
                                {eigenvectors && <span className="text-[10px] text-blue-500">({eigenvectors[0][0].toFixed(2)}, {eigenvectors[0][1].toFixed(2)})</span>}
                            </div>
                            <div className="bg-red-100 rounded-lg px-3 py-1.5 flex justify-between items-center">
                                <span className="text-sm font-mono font-bold text-red-700">λ₂ = {eigenvalues[1].toFixed(3)}</span>
                                {eigenvectors && <span className="text-[10px] text-red-500">({eigenvectors[1][0].toFixed(2)}, {eigenvectors[1][1].toFixed(2)})</span>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Angle slider */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Test Vector Angle</p>
                    <input type="range" min={0} max={359} step={1}
                        value={vecAngle} onChange={e => setVecAngle(parseInt(e.target.value))}
                        className="w-full accent-violet-600" />
                    <p className="text-center text-sm font-mono mt-2 font-bold" style={{ color: vColor }}>
                        {vecAngle}°{isOnEigenspace ? ` ← Eigenvector! (λ≈${effλ?.toFixed(2)})` : ''}
                    </p>
                </div>

                {/* Eigenspace indicator */}
                {isOnEigenspace ? (
                    <div className="bg-green-50 border border-green-300 rounded-xl p-3">
                        <p className="text-sm font-bold text-green-700">✓ Found an eigenvector!</p>
                        <p className="text-xs text-green-600 mt-1">
                            A·v ≈ {effλ?.toFixed(2)}·v<br/>
                            <span className="opacity-70">v and Av point the same direction — only scale changes.</span>
                        </p>
                    </div>
                ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500">
                        <strong className="text-slate-700 block mb-1">How to use:</strong>
                        Drag the slider. When <span style={{color:'#7c3aed'}} className="font-bold">v</span> and <span style={{color:'#db2777'}} className="font-bold">Av</span> align, you've found an eigendirection.
                    </div>
                )}
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 min-h-[460px] bg-white rounded-xl border border-slate-200 overflow-hidden relative">
                <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

                    {/* Ghost grid */}
                    <g opacity="0.18">
                        {GRID.map(y => { const [x1,y1]=sv(-4.5,y),[x2,y2]=sv(4.5,y); return <line key={`gh${y}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={y===0?'#475569':'#cbd5e1'} strokeWidth={y===0?1.5:0.7}/> })}
                        {GRID.map(x => { const [x1,y1]=sv(x,-4.5),[x2,y2]=sv(x,4.5); return <line key={`gv${x}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={x===0?'#475569':'#cbd5e1'} strokeWidth={x===0?1.5:0.7}/> })}
                    </g>

                    {/* Eigenvector lines (full extent) */}
                    {!isComplex && eigenvectors && (() => {
                        const l1 = evLine(eigenvectors[0]);
                        const l2 = evLine(eigenvectors[1]);
                        return <>
                            <line {...l1} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="9,5" opacity={0.6} />
                            <line {...l2} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="9,5" opacity={0.6} />
                        </>;
                    })()}

                    {/* Eigenvector arrows */}
                    {!isComplex && eigenvectors && (() => {
                        const [e1x,e1y]=sv(eigenvectors[0][0]*1.6, eigenvectors[0][1]*1.6);
                        const [e2x,e2y]=sv(eigenvectors[1][0]*1.6, eigenvectors[1][1]*1.6);
                        return <>
                            <Arrow x1={ox} y1={oy} x2={e1x} y2={e1y} color="#3b82f6" label={`v₁ (λ=${eigenvalues[0].toFixed(1)})`} width={2.5} />
                            <Arrow x1={ox} y1={oy} x2={e2x} y2={e2y} color="#ef4444" label={`v₂ (λ=${eigenvalues[1].toFixed(1)})`} width={2.5} />
                        </>;
                    })()}

                    {/* Image vector Av */}
                    {AvLen > 0.05 && <Arrow x1={ox} y1={oy} x2={Avsx} y2={Avsy} color={AvColor} label="Av" width={3.5} />}

                    {/* Test vector v */}
                    <Arrow x1={ox} y1={oy} x2={vsx} y2={vsy} color={vColor} label="v" width={3.5} />

                    {/* Eigenspace highlight ring */}
                    {isOnEigenspace && <circle cx={ox} cy={oy} r={22} fill="none" stroke="#16a34a" strokeWidth={2.5} strokeDasharray="5,3" opacity={0.7} />}

                    {/* Complex notice */}
                    {isComplex && (
                        <text x={CX} y={CY} textAnchor="middle" fill="#7c3aed" fontSize={14} fontWeight="700">
                            Complex eigenvalues — no real eigendirections.
                        </text>
                    )}

                    {/* Origin dot */}
                    <circle cx={ox} cy={oy} r={4.5} fill="#1e293b" />

                    {/* Instruction */}
                    <text x={W-10} y={15} textAnchor="end" fill="#94a3b8" fontSize={11}>← adjust angle slider to rotate v</text>

                    {/* Legend */}
                    <g transform={`translate(8, ${H-76})`}>
                        <rect width={265} height={70} rx={6} fill="white" fillOpacity={0.94} stroke="#e2e8f0" />
                        <line x1={10} y1={18} x2={30} y2={18} stroke="#3b82f6" strokeWidth={2} strokeDasharray="7,4" />
                        <text x={36} y={22} fill="#3b82f6" fontSize={11} fontWeight="600">v₁ — eigendirection (λ₁)</text>
                        <line x1={10} y1={38} x2={30} y2={38} stroke="#ef4444" strokeWidth={2} strokeDasharray="7,4" />
                        <text x={36} y={42} fill="#ef4444" fontSize={11} fontWeight="600">v₂ — eigendirection (λ₂)</text>
                        <line x1={10} y1={57} x2={30} y2={57} stroke="#7c3aed" strokeWidth={3} />
                        <text x={36} y={61} fill="#7c3aed" fontSize={11} fontWeight="600">v — test vector</text>
                        <line x1={148} y1={57} x2={168} y2={57} stroke="#db2777" strokeWidth={3} />
                        <text x={174} y={61} fill="#db2777" fontSize={11} fontWeight="600">Av — image</text>
                    </g>
                </svg>
            </div>
        </div>
    );
}
