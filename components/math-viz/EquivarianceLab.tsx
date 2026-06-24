"use client";

import React, { useState, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   Equivariance Lab — pure SVG, no framer-motion, no Three.js
   Shows equivariance vs invariance with a 2D input point and transformation T.
   ──────────────────────────────────────────────────────────────────────────── */

const W = 500, H = 400, CX = 250, CY = 200, S = 55;

function toSvg(x: number, y: number): [number, number] {
    return [CX + x * S, CY - y * S];
}

type Matrix2 = [[number, number], [number, number]];

function applyMat(M: Matrix2, x: number, y: number): [number, number] {
    return [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
}

function rotatePoint(angle: number, x: number, y: number): [number, number] {
    const c = Math.cos(angle), s = Math.sin(angle);
    return [c * x - s * y, s * x + c * y];
}

const TRANSFORMS: { label: string; M: Matrix2; equivariant: boolean; note: string }[] = [
    {
        label: 'Uniform Scale (λI)',
        M: [[2, 0], [0, 2]],
        equivariant: true,
        note: 'Uniform scaling commutes with rotation — T(gp) = g·T(p)',
    },
    {
        label: 'Rotation (90°)',
        M: [[0, -1], [1, 0]],
        equivariant: true,
        note: 'Rotations compose — T(gp) = g·T(p) always holds',
    },
    {
        label: 'Shear',
        M: [[1, 1], [0, 1]],
        equivariant: false,
        note: 'Shear does NOT commute with rotation — T(gp) ≠ g·T(p)',
    },
    {
        label: 'Asymmetric Scale',
        M: [[2, 0], [0, 0.5]],
        equivariant: false,
        note: 'Stretching one axis breaks rotational equivariance',
    },
    {
        label: 'Reflection (x-axis)',
        M: [[1, 0], [0, -1]],
        equivariant: false,
        note: 'Reflection does not commute with general rotation',
    },
];

function Arrow({
    x1, y1, x2, y2, color, label, dashed = false, width = 2,
}: { x1: number; y1: number; x2: number; y2: number; color: string; label?: string; dashed?: boolean; width?: number }) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    if (len < 4) return null;
    const ang = Math.atan2(dy, dx), hs = 10, ha = 0.4;
    const ux = dx / len, uy = dy / len;
    return (
        <g>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth={dashed ? 1.5 : width}
                strokeDasharray={dashed ? '5,4' : undefined} strokeLinecap="round" />
            {!dashed && (
                <polygon fill={color}
                    points={`${x2},${y2} ${x2 - hs * Math.cos(ang - ha)},${y2 - hs * Math.sin(ang - ha)} ${x2 - hs * Math.cos(ang + ha)},${y2 - hs * Math.sin(ang + ha)}`} />
            )}
            {label && (
                <text x={x2 + ux * 14} y={y2 - uy * 8} fill={color} fontSize={11} fontWeight="700" textAnchor="middle" dominantBaseline="middle">{label}</text>
            )}
        </g>
    );
}

export default function EquivarianceLab() {
    const [transformIdx, setTransformIdx] = useState(0);
    const [pAngle, setPAngle] = useState(45);       // input point angle (deg)
    const [gAngle, setGAngle] = useState(90);       // group rotation angle (deg)
    const [mode, setMode] = useState<'equivariance' | 'invariance'>('equivariance');

    const T = TRANSFORMS[transformIdx];
    const M = T.M;
    const pRad = pAngle * Math.PI / 180;
    const gRad = gAngle * Math.PI / 180;
    const FIXED_R = 2.0;   // radius of input point

    const px = FIXED_R * Math.cos(pRad);
    const py = FIXED_R * Math.sin(pRad);

    /* T(p) */
    const [Tpx, Tpy] = applyMat(M, px, py);

    /* g·p (rotate input by gAngle) */
    const [gpx, gpy] = rotatePoint(gRad, px, py);

    /* T(g·p) */
    const [Tgpx, Tgpy] = applyMat(M, gpx, gpy);

    /* g·T(p) */
    const [gTpx, gTpy] = rotatePoint(gRad, Tpx, Tpy);

    const match = useMemo(() => {
        const dx = Tgpx - gTpx, dy = Tgpy - gTpy;
        return Math.hypot(dx, dy) < 0.05;
    }, [Tgpx, Tgpy, gTpx, gTpy]);

    const [ox, oy] = toSvg(0, 0);
    const [psx, psy] = toSvg(px, py);
    const [Tpsx, Tpsy] = toSvg(Tpx, Tpy);
    const [gpsx, gpsy] = toSvg(gpx, gpy);
    const [Tgpsx, Tgpsy] = toSvg(Tgpx, Tgpy);
    const [gTpsx, gTpsy] = toSvg(gTpx, gTpy);

    const grid = [-3, -2, -1, 0, 1, 2, 3];

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Equivariance Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Compare T(g·p) vs g·T(p). Green = equivariant, Red = not.
                    </p>
                </div>

                {/* Mode toggle */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Mode</p>
                    <div className="grid grid-cols-2 gap-2">
                        {(['equivariance', 'invariance'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`rounded-lg border py-2 text-xs font-semibold capitalize transition-colors ${mode === m
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transform selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Transformation T</p>
                    <div className="flex flex-col gap-1.5">
                        {TRANSFORMS.map((t, i) => (
                            <button
                                key={i}
                                onClick={() => setTransformIdx(i)}
                                className={`rounded-lg border px-3 py-2 text-xs text-left font-medium transition-colors ${transformIdx === i
                                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300'
                                    }`}
                            >
                                <span className="block font-semibold">{t.label}</span>
                                <span className={`text-[10px] ${t.equivariant ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {t.equivariant ? '✓ equivariant' : '✗ not equivariant'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sliders */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Input angle θ = {pAngle}°</p>
                        <input type="range" min={0} max={359} value={pAngle} onChange={e => setPAngle(+e.target.value)} className="w-full accent-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Group rotation g = {gAngle}°</p>
                        <input type="range" min={0} max={359} value={gAngle} onChange={e => setGAngle(+e.target.value)} className="w-full accent-violet-600" />
                    </div>
                </div>

                {/* Result indicator */}
                {mode === 'equivariance' && (
                    <div className={`rounded-xl border p-3 ${match ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'}`}>
                        <p className={`text-sm font-bold ${match ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {match ? '✓ T(g·p) = g·T(p)' : '✗ T(g·p) ≠ g·T(p)'}
                        </p>
                        <p className={`text-xs mt-1 ${match ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {T.note}
                        </p>
                    </div>
                )}

                {mode === 'invariance' && (
                    <div className="rounded-xl border bg-amber-50 border-amber-300 p-3">
                        <p className="text-sm font-bold text-amber-700">Invariance test</p>
                        <p className="text-xs mt-1 text-amber-600">
                            |T(p)| = {Math.hypot(Tpx, Tpy).toFixed(3)}<br/>
                            |T(g·p)| = {Math.hypot(Tgpx, Tgpy).toFixed(3)}<br/>
                            {Math.abs(Math.hypot(Tpx, Tpy) - Math.hypot(Tgpx, Tgpy)) < 0.01
                                ? '✓ Norm is invariant to rotation'
                                : 'Norm may differ'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[400px]">
                <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

                    {/* Grid */}
                    <g opacity={0.15}>
                        {grid.map(y => {
                            const [x1, y1] = toSvg(-3.5, y), [x2, y2] = toSvg(3.5, y);
                            return <line key={`gh${y}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={y === 0 ? '#475569' : '#cbd5e1'} strokeWidth={y === 0 ? 1.5 : 0.7} />;
                        })}
                        {grid.map(x => {
                            const [x1, y1] = toSvg(x, -3.5), [x2, y2] = toSvg(x, 3.5);
                            return <line key={`gv${x}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={x === 0 ? '#475569' : '#cbd5e1'} strokeWidth={x === 0 ? 1.5 : 0.7} />;
                        })}
                    </g>

                    {mode === 'equivariance' && (
                        <>
                            {/* p — blue */}
                            <Arrow x1={ox} y1={oy} x2={psx} y2={psy} color="#3b82f6" label="p" width={3} />

                            {/* T(p) — orange */}
                            <Arrow x1={ox} y1={oy} x2={Tpsx} y2={Tpsy} color="#f97316" label="T(p)" width={3} />

                            {/* g·p — violet dashed */}
                            <Arrow x1={ox} y1={oy} x2={gpsx} y2={gpsy} color="#7c3aed" label="g·p" dashed width={2.5} />

                            {/* T(g·p) — solid violet */}
                            <Arrow x1={ox} y1={oy} x2={Tgpsx} y2={Tgpsy} color="#7c3aed" label="T(g·p)" width={3} />

                            {/* g·T(p) — solid green or red */}
                            <Arrow x1={ox} y1={oy} x2={gTpsx} y2={gTpsy} color={match ? '#16a34a' : '#dc2626'} label="g·T(p)" width={3} />

                            {/* Match ring */}
                            {match && <circle cx={ox} cy={oy} r={18} fill="none" stroke="#16a34a" strokeWidth={2} strokeDasharray="4,3" opacity={0.7} />}
                        </>
                    )}

                    {mode === 'invariance' && (
                        <>
                            {/* p */}
                            <Arrow x1={ox} y1={oy} x2={psx} y2={psy} color="#3b82f6" label="p" width={3} />

                            {/* g·p */}
                            <Arrow x1={ox} y1={oy} x2={gpsx} y2={gpsy} color="#7c3aed" label="g·p" width={3} />

                            {/* T(p) — shows norm */}
                            <Arrow x1={ox} y1={oy} x2={Tpsx} y2={Tpsy} color="#f97316" label="T(p)" width={3} />

                            {/* T(g·p) */}
                            <Arrow x1={ox} y1={oy} x2={Tgpsx} y2={Tgpsy} color="#f97316" label="T(g·p)" dashed width={2.5} />
                        </>
                    )}

                    {/* Origin */}
                    <circle cx={ox} cy={oy} r={4} fill="#1e293b" />

                    {/* Legend */}
                    {mode === 'equivariance' && (
                        <g transform={`translate(8,${H - 60})`}>
                            <rect width={280} height={54} rx={6} fill="white" fillOpacity={0.94} stroke="#e2e8f0" />
                            <line x1={10} y1={12} x2={30} y2={12} stroke="#3b82f6" strokeWidth={2.5} />
                            <text x={36} y={16} fill="#3b82f6" fontSize={10} fontWeight="600">p (input)</text>
                            <line x1={10} y1={28} x2={30} y2={28} stroke="#7c3aed" strokeWidth={2.5} />
                            <text x={36} y={32} fill="#7c3aed" fontSize={10} fontWeight="600">T(g·p)  [rotate then transform]</text>
                            <line x1={10} y1={44} x2={30} y2={44} stroke={match ? '#16a34a' : '#dc2626'} strokeWidth={2.5} />
                            <text x={36} y={48} fill={match ? '#16a34a' : '#dc2626'} fontSize={10} fontWeight="600">g·T(p)  [transform then rotate]</text>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}
