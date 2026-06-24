"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';

/* ── Math helpers ──────────────────────────────────────────────────────── */

function applyM(m: number[][], x: number, y: number): [number, number] {
    return [m[0][0]*x + m[0][1]*y, m[1][0]*x + m[1][1]*y];
}

/* ── SVG helpers ───────────────────────────────────────────────────────── */

const W = 560, H = 420, S = 50, CX = W/2, CY = H/2;

function sv(x: number, y: number): [number, number] {
    return [CX + x*S, CY - y*S];
}

function applyAndSv(m: number[][], x: number, y: number): [number, number] {
    const [tx, ty] = applyM(m, x, y);
    return sv(tx, ty);
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
                <text x={x2+ux*18} y={y2-uy*10} fill={color} fontSize={12} fontWeight="700" textAnchor="middle" dominantBaseline="middle">{label}</text>
            )}
        </g>
    );
}

/* ── Grid renderer ─────────────────────────────────────────────────────── */

const GRID = [-4,-3,-2,-1,0,1,2,3,4];

function Grid({ matrix, opacity = 1, ghost = false }: { matrix: number[][], opacity?: number, ghost?: boolean }) {
    return (
        <g opacity={opacity}>
            {GRID.map(y => {
                const [x1,y1] = ghost ? sv(-4.5,y) : applyAndSv(matrix, -4.5, y);
                const [x2,y2] = ghost ? sv(4.5,y) : applyAndSv(matrix, 4.5, y);
                const isAxis = y === 0;
                return <line key={`h${y}`} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={ghost ? '#cbd5e1' : (isAxis ? '#6366f1' : '#c7d2fe')}
                    strokeWidth={isAxis ? (ghost ? 1 : 1.8) : 0.7} />;
            })}
            {GRID.map(x => {
                const [x1,y1] = ghost ? sv(x,-4.5) : applyAndSv(matrix, x, -4.5);
                const [x2,y2] = ghost ? sv(x,4.5) : applyAndSv(matrix, x, 4.5);
                const isAxis = x === 0;
                return <line key={`v${x}`} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={ghost ? '#cbd5e1' : (isAxis ? '#e11d48' : '#fecdd3')}
                    strokeWidth={isAxis ? (ghost ? 1 : 1.8) : 0.7} />;
            })}
        </g>
    );
}

/* ── Step descriptions ─────────────────────────────────────────────────── */

const STEP_INFO = [
    { title: 'Start: v in standard basis', desc: 'Your input vector v lives in the standard x-y coordinate system.', color: '#6366f1' },
    { title: 'Step 1 — Rotate into eigenbasis (U*)', desc: 'U* rotates v to align with the eigenvectors. In this new frame, the transformation is just scaling.', color: '#f59e0b' },
    { title: 'Step 2 — Scale along each axis (Λ)', desc: 'Λ independently scales the x-component by λ₁ and y-component by λ₂. No mixing!', color: '#ec4899' },
    { title: 'Step 3 — Rotate back (U)', desc: 'U rotates back to the standard basis. This is the final result T(v).', color: '#0891b2' },
];

/* ── Presets ───────────────────────────────────────────────────────────── */

const PRESETS = [
    { name: 'Stretch',       λ1: 2,   λ2: 0.5,  θ: 45 },
    { name: 'Big Stretch',   λ1: 3,   λ2: 0.3,  θ: 30 },
    { name: 'Uniform Scale', λ1: 1.5, λ2: 1.5,  θ: 0  },
    { name: 'Squeeze',       λ1: 2,   λ2: 0.25, θ: 60 },
    { name: 'Reflect',       λ1: -1,  λ2: 1,    θ: 45 },
    { name: 'Contract',      λ1: 0.5, λ2: 0.5,  θ: 20 },
];

/* ── Main component ────────────────────────────────────────────────────── */

export default function SpectralTheoremLab() {
    const [λ1, setλ1] = useState(2);
    const [λ2, setλ2] = useState(0.5);
    const [θDeg, setθDeg] = useState(45);
    const [step, setStep] = useState(3);
    const [testAngle, setTestAngle] = useState(30); // degrees for test vector
    const [isAnimating, setIsAnimating] = useState(false);
    const rafRef = useRef<number | null>(null);

    const θ = θDeg * Math.PI / 180;
    const cosθ = Math.cos(θ), sinθ = Math.sin(θ);

    // U = rotation by θ, U* = rotation by -θ
    const U  = [[cosθ, -sinθ], [sinθ, cosθ]];
    const Ut = [[cosθ, sinθ], [-sinθ, cosθ]];
    const Λ  = [[λ1, 0], [0, λ2]];

    // T = U Λ U*
    const T = useMemo(() => {
        // T = U * Λ * U*
        const ΛUt = [[λ1*Ut[0][0], λ1*Ut[0][1]], [λ2*Ut[1][0], λ2*Ut[1][1]]];
        return [
            [U[0][0]*ΛUt[0][0]+U[0][1]*ΛUt[1][0], U[0][0]*ΛUt[0][1]+U[0][1]*ΛUt[1][1]],
            [U[1][0]*ΛUt[0][0]+U[1][1]*ΛUt[1][0], U[1][0]*ΛUt[0][1]+U[1][1]*ΛUt[1][1]],
        ];
    }, [λ1, λ2, θ]);

    // Eigenvectors (columns of U)
    const ev1: [number,number] = [U[0][0], U[1][0]]; // first col
    const ev2: [number,number] = [U[0][1], U[1][1]]; // second col

    // Test vector
    const tAng = testAngle * Math.PI / 180;
    const TEST_LEN = 1.5;
    const v0: [number,number] = [TEST_LEN*Math.cos(tAng), TEST_LEN*Math.sin(tAng)];
    const v1r: [number,number] = applyM(Ut, v0[0], v0[1]); // after U*
    const v2r: [number,number] = [λ1*v1r[0], λ2*v1r[1]];  // after Λ
    const v3r: [number,number] = applyM(U, v2r[0], v2r[1]);// after U (= T*v)

    // Which vector to show based on step
    const displayV = [v0, v1r, v2r, v3r][step];
    const stepColor = STEP_INFO[step].color;

    // Which grid to use
    const gridMatrix = step === 0 ? [[1,0],[0,1]]
        : step === 1 ? Ut
        : step === 2 ? [[λ1,0],[0,λ2]]
        : T;

    const [ox, oy] = sv(0, 0);
    const [dvx, dvy] = sv(displayV[0], displayV[1]);

    // Eigenvector arrows (always show in eigenbasis step + final)
    const [ev1x, ev1y] = sv(ev1[0]*1.5, ev1[1]*1.5);
    const [ev2x, ev2y] = sv(ev2[0]*1.5, ev2[1]*1.5);

    // Animate through steps
    const animate = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setStep(0);
        let s = 0;
        const next = () => {
            s++;
            setStep(s);
            if (s < 3) rafRef.current = window.setTimeout(next, 1100) as unknown as number;
            else setIsAnimating(false);
        };
        rafRef.current = window.setTimeout(next, 900) as unknown as number;
    };
    useEffect(() => () => { if (rafRef.current) clearTimeout(rafRef.current); }, []);

    // Matrix formatter
    const fmt = (m: number[][]) => m.map(r => r.map(v => v.toFixed(2)));

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left controls ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Spectral Theorem Lab</h3>
                    <p className="text-xs text-slate-500 mt-1">Explore T = UΛU* — rotate, scale, rotate back.</p>
                </div>

                {/* Eigenvalues */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Eigenvalues (Λ)</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-mono text-xs w-6">λ₁</span>
                            <input type="range" min={-2} max={3} step={0.1} value={λ1}
                                onChange={e => setλ1(parseFloat(e.target.value))} className="flex-1 accent-blue-600" />
                            <span className="text-xs font-mono w-10 text-right text-blue-600">{λ1.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 font-mono text-xs w-6">λ₂</span>
                            <input type="range" min={-2} max={3} step={0.1} value={λ2}
                                onChange={e => setλ2(parseFloat(e.target.value))} className="flex-1 accent-red-500" />
                            <span className="text-xs font-mono w-10 text-right text-red-600">{λ2.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                {/* Rotation angle */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Eigenbasis Angle (θ)</p>
                    <input type="range" min={0} max={180} step={1} value={θDeg}
                        onChange={e => setθDeg(parseInt(e.target.value))} className="w-full accent-violet-600" />
                    <p className="text-center text-sm font-mono mt-1">{θDeg}° rotation of eigenvectors</p>
                </div>

                {/* Test vector angle */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Test Vector Angle</p>
                    <input type="range" min={0} max={359} step={1} value={testAngle}
                        onChange={e => setTestAngle(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                    <p className="text-center text-xs font-mono mt-1 text-slate-500">{testAngle}°</p>
                </div>

                {/* Presets */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Presets</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {PRESETS.map(p => (
                            <button key={p.name} onClick={() => { setλ1(p.λ1); setλ2(p.λ2); setθDeg(p.θ); }}
                                className="px-2 py-1.5 text-xs font-medium bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition-colors">
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Matrix breakdown */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs font-mono space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1 font-sans">Decomposition T = UΛU*</p>
                    {[['U', fmt(U)], ['Λ', fmt(Λ)], ['T', fmt(T)]].map(([name, m]) => (
                        <div key={name as string} className="flex items-center gap-2">
                            <span className="text-indigo-600 font-bold w-4">{name as string}</span>
                            <span className="text-slate-600">[{(m as string[][])[0].join(', ')}]</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right: SVG + step controls ── */}
            <div className="flex-1 flex flex-col gap-4">

                {/* Step pills */}
                <div className="flex gap-2 flex-wrap">
                    {STEP_INFO.map((s, i) => (
                        <button key={i} onClick={() => setStep(i)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${step === i
                                ? 'text-white border-transparent shadow-sm'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                            style={step === i ? { background: s.color } : {}}>
                            {i === 0 ? 'Start' : `Step ${i}`}
                        </button>
                    ))}
                    <button onClick={animate} disabled={isAnimating}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors">
                        {isAnimating ? 'Playing…' : '▶ Animate'}
                    </button>
                </div>

                {/* Step description */}
                <div className="rounded-xl border p-4" style={{ borderColor: stepColor + '40', background: stepColor + '08' }}>
                    <p className="text-sm font-bold mb-0.5" style={{ color: stepColor }}>{STEP_INFO[step].title}</p>
                    <p className="text-xs text-slate-600">{STEP_INFO[step].desc}</p>
                </div>

                {/* SVG visualization */}
                <div className="flex-1 min-h-[420px] bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>

                        {/* Ghost grid */}
                        <Grid matrix={[[1,0],[0,1]]} opacity={0.15} ghost />

                        {/* Current step grid */}
                        <Grid matrix={gridMatrix} opacity={step === 0 ? 0 : 0.85} />

                        {/* Eigenvector lines (always visible) */}
                        {(() => {
                            const [a1,b1]=sv(-ev1[0]*5,-ev1[1]*5), [c1,d1]=sv(ev1[0]*5,ev1[1]*5);
                            const [a2,b2]=sv(-ev2[0]*5,-ev2[1]*5), [c2,d2]=sv(ev2[0]*5,ev2[1]*5);
                            return <>
                                <line x1={a1} y1={b1} x2={c1} y2={d1} stroke="#3b82f6" strokeWidth={1.2} strokeDasharray="7,5" opacity={0.5} />
                                <line x1={a2} y1={b2} x2={c2} y2={d2} stroke="#ef4444" strokeWidth={1.2} strokeDasharray="7,5" opacity={0.5} />
                            </>;
                        })()}

                        {/* Eigenvector arrows */}
                        <Arrow x1={ox} y1={oy} x2={ev1x} y2={ev1y} color="#3b82f6" label={`v₁(λ=${λ1.toFixed(1)})`} width={2.5} />
                        <Arrow x1={ox} y1={oy} x2={ev2x} y2={ev2y} color="#ef4444" label={`v₂(λ=${λ2.toFixed(1)})`} width={2.5} />

                        {/* Original v (ghost when moved) */}
                        {step > 0 && (() => {
                            const [x1,y1]=sv(v0[0], v0[1]);
                            return <Arrow x1={ox} y1={oy} x2={x1} y2={y1} color="#6366f1" label="v" width={2} dashed opacity={0.5} />;
                        })()}

                        {/* Current step vector */}
                        <Arrow x1={ox} y1={oy} x2={dvx} y2={dvy} color={stepColor} label={['v', 'U*v', 'ΛU*v', 'T(v)'][step]} width={4} />

                        {/* Origin */}
                        <circle cx={ox} cy={oy} r={4.5} fill="#1e293b" />

                        {/* Step label in canvas */}
                        <text x={CX} y={18} textAnchor="middle" fill={stepColor} fontSize={12} fontWeight="700">
                            {['v (input)', 'After U* — rotate into eigenbasis', 'After Λ — scale axes', 'After U — T(v) final result'][step]}
                        </text>

                        {/* Legend */}
                        <g transform={`translate(8, ${H-52})`}>
                            <rect width={270} height={46} rx={6} fill="white" fillOpacity={0.94} stroke="#e2e8f0" />
                            <line x1={10} y1={14} x2={28} y2={14} stroke="#3b82f6" strokeWidth={2} strokeDasharray="7,4" />
                            <text x={34} y={18} fill="#3b82f6" fontSize={11} fontWeight="600">v₁ eigendirection (λ₁)</text>
                            <line x1={10} y1={34} x2={28} y2={34} stroke="#ef4444" strokeWidth={2} strokeDasharray="7,4" />
                            <text x={34} y={38} fill="#ef4444" fontSize={11} fontWeight="600">v₂ eigendirection (λ₂)</text>
                            <line x1={148} y1={14} x2={166} y2={14} stroke="#6366f1" strokeWidth={2.5} />
                            <text x={172} y={18} fill="#6366f1" fontSize={11} fontWeight="600">v input (ghost)</text>
                            <line x1={148} y1={34} x2={166} y2={34} stroke={stepColor} strokeWidth={3} />
                            <text x={172} y={38} fontSize={11} fontWeight="600" fill={stepColor}>current step</text>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}
