"use client";

import React, { useState, useRef, useEffect } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

/* ── Math helpers ──────────────────────────────────────────────────────────── */

function applyM(m: number[][], x: number, y: number): [number, number] {
    return [m[0][0] * x + m[0][1] * y, m[1][0] * x + m[1][1] * y];
}

function lerpM(a: number[][], b: number[][], t: number): number[][] {
    return a.map((row, i) => row.map((v, j) => v + (b[i][j] - v) * t));
}

function det(m: number[][]): number {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function easeInOut(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* ── SVG coordinate helpers ────────────────────────────────────────────────── */

const W = 580, H = 500, S = 58;   // viewBox width/height, pixels per unit
const CX = W / 2, CY = H / 2;

/** Math coords → SVG coords */
function sv(x: number, y: number): [number, number] {
    return [CX + x * S, CY - y * S];
}

/** Apply matrix then convert to SVG */
function tv(m: number[][], x: number, y: number): [number, number] {
    const [tx, ty] = applyM(m, x, y);
    return sv(tx, ty);
}

/* ── SVG Arrow ─────────────────────────────────────────────────────────────── */

function Arrow({ x1, y1, x2, y2, color, label, dashed, width = 2.5 }: {
    x1: number; y1: number; x2: number; y2: number;
    color: string; label?: string; dashed?: boolean; width?: number;
}) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 5) return null;

    const ux = dx / len, uy = dy / len;   // unit direction
    const ang = Math.atan2(dy, dx);
    const hs = 11, ha = 0.38;             // arrowhead size and spread

    return (
        <g>
            <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={dashed ? 1.5 : width}
                strokeDasharray={dashed ? "6,4" : undefined}
                strokeLinecap="round"
            />
            {!dashed && (
                <polygon
                    points={`${x2},${y2} ${x2 - hs * Math.cos(ang - ha)},${y2 - hs * Math.sin(ang - ha)} ${x2 - hs * Math.cos(ang + ha)},${y2 - hs * Math.sin(ang + ha)}`}
                    fill={color}
                />
            )}
            {label && (
                <text
                    x={x2 + ux * 16}
                    y={y2 - uy * 8}
                    fill={color}
                    fontSize={12}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {label}
                </text>
            )}
        </g>
    );
}

/* ── Presets ───────────────────────────────────────────────────────────────── */

const PRESETS = [
    { label: 'Identity',    m: [[1, 0], [0, 1]] },
    { label: 'Rotate 45°',  m: [[0.707, -0.707], [0.707, 0.707]] },
    { label: 'Rotate 90°',  m: [[0, -1], [1, 0]] },
    { label: 'Shear X',     m: [[1, 0.8], [0, 1]] },
    { label: 'Scale 2×',    m: [[2, 0], [0, 2]] },
    { label: 'Reflect Y',   m: [[-1, 0], [0, 1]] },
    { label: 'Project X',   m: [[1, 0], [0, 0]] },
    { label: 'Squeeze',     m: [[2, 0], [0, 0.5]] },
];

const GRID_RANGE = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const DURATION   = 680; // ms for morphing animation

/* ── Main component ────────────────────────────────────────────────────────── */

export default function LinearTransformationLab() {
    const [target, setTarget]   = useState<number[][]>([[1, 0], [0, 1]]);
    const [disp,   setDispState] = useState<number[][]>([[1, 0], [0, 1]]);

    // Ref mirrors disp so animation closures always read the latest value
    const dispRef = useRef<number[][]>([[1, 0], [0, 1]]);
    const rafRef  = useRef<number | null>(null);

    const setDisp = (m: number[][]) => {
        dispRef.current = m;
        setDispState(m);
    };

    const animateTo = (to: number[][]) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const from = dispRef.current.map(r => [...r]);
        const t0   = performance.now();

        const tick = (now: number) => {
            const rawT = Math.min(1, (now - t0) / DURATION);
            setDisp(lerpM(from, to, easeInOut(rawT)));
            if (rawT < 1) rafRef.current = requestAnimationFrame(tick);
            else rafRef.current = null;
        };
        rafRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

    const handleMatrix = (m: number[][]) => {
        setTarget(m.map(r => [...r]));
        animateTo(m);
    };

    /* ── Derived geometry ────────────────────────────────────────────────── */

    const d = det(disp);

    // Origin in SVG
    const [ox, oy] = sv(0, 0);

    // Unit parallelogram corners: (0,0)→(1,0)→(1,1)→(0,1)
    const corners: [number, number][] = [[0,0],[1,0],[1,1],[0,1]];
    const tCorners = corners.map(([x, y]) => tv(disp, x, y));
    const paraPath = tCorners.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + 'Z';

    // Transformed basis vectors
    const [te1x, te1y] = tv(disp, 1, 0);
    const [te2x, te2y] = tv(disp, 0, 1);
    const [e1x,  e1y]  = sv(1, 0);
    const [e2x,  e2y]  = sv(0, 1);

    // Color scheme based on determinant
    const detPositive = d > 0.05;
    const detNegative = d < -0.05;
    const paraColor   = detPositive ? '#6366f1' : detNegative ? '#ef4444' : '#94a3b8';

    /* ── Render ──────────────────────────────────────────────────────────── */

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Controls panel ── */}
            <div className="w-full lg:w-60 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Linear Transformation Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Edit the matrix and watch space morph.</p>
                </div>

                {/* Matrix inputs */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        Matrix <Latex>{'$[T]$'}</Latex>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {[0, 1].map(r => [0, 1].map(c => (
                            <input
                                key={`${r}${c}`}
                                type="number"
                                value={+target[r][c].toFixed(3)}
                                onChange={e => {
                                    const m = target.map(row => [...row]);
                                    m[r][c] = parseFloat(e.target.value) || 0;
                                    handleMatrix(m);
                                }}
                                className="border border-slate-200 rounded-lg px-2 py-1.5 text-center text-sm font-mono focus:outline-none focus:border-indigo-400"
                                step={0.1}
                            />
                        )))}
                    </div>
                </div>

                {/* Presets */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Presets</p>
                    <div className="flex flex-col gap-1">
                        {PRESETS.map(p => (
                            <button
                                key={p.label}
                                onClick={() => handleMatrix(p.m)}
                                className="w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Determinant card */}
                <div className={`rounded-xl border p-4 text-sm transition-colors ${
                    Math.abs(d) < 0.05
                        ? 'border-slate-200 bg-slate-100 text-slate-600'
                        : d < 0
                        ? 'border-rose-200 bg-rose-50 text-rose-800'
                        : 'border-indigo-100 bg-indigo-50 text-indigo-800'
                }`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Determinant</p>
                    <p className="text-2xl font-bold font-mono">{d.toFixed(2)}</p>
                    <p className="text-xs mt-1 opacity-70">
                        {Math.abs(d) < 0.05
                            ? 'Collapses space — singular'
                            : d < 0
                            ? 'Flips orientation'
                            : `Area scales by ${d.toFixed(2)}×`}
                    </p>
                </div>
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 min-h-[480px] bg-white rounded-xl border border-slate-200 overflow-hidden relative">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${W} ${H}`}
                    style={{ display: 'block' }}
                >
                    {/* ── Original grid (faint ghost) ── */}
                    <g opacity="0.22">
                        {GRID_RANGE.map(y => {
                            const [x1, y1] = sv(-4.5, y), [x2, y2] = sv(4.5, y);
                            return (
                                <line key={`og-h${y}`}
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke={y === 0 ? '#475569' : '#cbd5e1'}
                                    strokeWidth={y === 0 ? 1.5 : 0.7}
                                />
                            );
                        })}
                        {GRID_RANGE.map(x => {
                            const [x1, y1] = sv(x, -4.5), [x2, y2] = sv(x, 4.5);
                            return (
                                <line key={`og-v${x}`}
                                    x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke={x === 0 ? '#475569' : '#cbd5e1'}
                                    strokeWidth={x === 0 ? 1.5 : 0.7}
                                />
                            );
                        })}
                    </g>

                    {/* ── Original basis vectors (dashed, gray) ── */}
                    <Arrow x1={ox} y1={oy} x2={e1x} y2={e1y} color="#94a3b8" dashed label="e₁" />
                    <Arrow x1={ox} y1={oy} x2={e2x} y2={e2y} color="#94a3b8" dashed label="e₂" />

                    {/* ── Unit parallelogram (det visualization) ── */}
                    <path d={paraPath} fill={paraColor} opacity={0.13} />
                    <path d={paraPath} fill="none" stroke={paraColor} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.55} />

                    {/* ── Transformed horizontal grid lines (indigo) ── */}
                    {GRID_RANGE.map(y => {
                        const [x1, y1] = tv(disp, -4.5, y);
                        const [x2, y2] = tv(disp,  4.5, y);
                        const isAxis   = y === 0;
                        return (
                            <line key={`th${y}`}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={isAxis ? '#6366f1' : '#c7d2fe'}
                                strokeWidth={isAxis ? 2 : 0.85}
                            />
                        );
                    })}

                    {/* ── Transformed vertical grid lines (rose) ── */}
                    {GRID_RANGE.map(x => {
                        const [x1, y1] = tv(disp, x, -4.5);
                        const [x2, y2] = tv(disp, x,  4.5);
                        const isAxis   = x === 0;
                        return (
                            <line key={`tv${x}`}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={isAxis ? '#e11d48' : '#fecdd3'}
                                strokeWidth={isAxis ? 2 : 0.85}
                            />
                        );
                    })}

                    {/* ── Transformed basis vectors ── */}
                    <Arrow x1={ox} y1={oy} x2={te1x} y2={te1y} color="#6366f1" label="T(e₁)" width={3} />
                    <Arrow x1={ox} y1={oy} x2={te2x} y2={te2y} color="#e11d48" label="T(e₂)" width={3} />

                    {/* ── Det label inside parallelogram ── */}
                    {Math.abs(d) > 0.2 && (() => {
                        // Centroid of the parallelogram
                        const cx = tCorners.reduce((s, [x]) => s + x, 0) / 4;
                        const cy = tCorners.reduce((s, [, y]) => s + y, 0) / 4;
                        return (
                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
                                fill={paraColor} fontSize={11} fontWeight="700" opacity={0.8}>
                                {d.toFixed(2)}
                            </text>
                        );
                    })()}

                    {/* ── Origin dot ── */}
                    <circle cx={ox} cy={oy} r={4} fill="#1e293b" />
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[11px] bg-white/90 rounded-lg px-3 py-1.5 border border-slate-100 pointer-events-none">
                    <span className="text-slate-400">ghost = original</span>
                    <span className="text-indigo-500 font-medium">— T(horizontal)</span>
                    <span className="text-rose-500 font-medium">— T(vertical)</span>
                    <span style={{ color: paraColor }} className="font-medium">▪ det</span>
                </div>
            </div>
        </div>
    );
}
