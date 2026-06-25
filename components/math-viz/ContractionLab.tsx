"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── SVG constants ───────────────────────────────────────────────────────────
const W = 420;
const H = 360;
const PAD = { left: 50, right: 30, top: 30, bottom: 40 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

type MappingType = "contraction" | "isometry" | "expansion";

interface MappingDef {
    name: string;
    description: string;
    fn: (x: number) => number;
    c: number; // Lipschitz constant
    fixedPoint: number | null;
    color: string;
}

const MAPPINGS: Record<MappingType, MappingDef> = {
    contraction: {
        name: "Contraction: f(x) = 0.5x + 1",
        description: "c = 0.5 < 1 → converges to unique fixed point x* = 2",
        fn: (x: number) => 0.5 * x + 1,
        c: 0.5,
        fixedPoint: 2,
        color: "#6366f1",
    },
    isometry: {
        name: "Isometry: f(x) = x + 1",
        description: "Distances preserved (c = 1). Translation — no fixed point",
        fn: (x: number) => x + 1,
        c: 1,
        fixedPoint: null,
        color: "#10b981",
    },
    expansion: {
        name: "Expansion: f(x) = 1.5x - 1",
        description: "c = 1.5 > 1 → distances grow, sequence diverges",
        fn: (x: number) => 1.5 * x - 1,
        c: 1.5,
        fixedPoint: 2, // fixed point exists but is unstable
        color: "#ef4444",
    },
};

export default function ContractionLab() {
    const [mapType, setMapType] = useState<MappingType>("contraction");
    const [x0, setX0] = useState(0);
    const [numIter, setNumIter] = useState(10);
    const [animating, setAnimating] = useState(false);
    const [animatedN, setAnimatedN] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const mapping = MAPPINGS[mapType];

    // Generate iteration sequence
    const iterations = (() => {
        const pts: number[] = [x0];
        let x = x0;
        for (let i = 0; i < numIter; i++) {
            x = mapping.fn(x);
            if (Math.abs(x) > 100) { pts.push(x); break; } // prevent overflow
            pts.push(x);
        }
        return pts;
    })();

    // Plot bounds
    const allVals = iterations.filter(v => Math.abs(v) < 100);
    if (mapping.fixedPoint !== null) allVals.push(mapping.fixedPoint);
    allVals.push(x0);
    const yMin = Math.min(...allVals) - 1;
    const yMax = Math.max(...allVals) + 1;

    const xScale = (n: number) => PAD.left + (n / Math.max(numIter, 1)) * PW;
    const yScale = (v: number) => PAD.top + PH - ((v - yMin) / (yMax - yMin || 1)) * PH;

    // Animation
    const startAnimation = useCallback(() => {
        setAnimating(true);
        setAnimatedN(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        let n = 0;
        intervalRef.current = setInterval(() => {
            n++;
            setAnimatedN(n);
            if (n >= iterations.length - 1) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setAnimating(false);
            }
        }, 300);
    }, [iterations.length]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    useEffect(() => {
        setAnimatedN(iterations.length - 1);
        setAnimating(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [mapType, x0, numIter, iterations.length]);

    const displayN = animating ? animatedN + 1 : iterations.length;
    const displayPts = iterations.slice(0, displayN);

    // Cobweb data: for each iteration, we need (x_n, x_n) -> (x_n, f(x_n)) -> (f(x_n), f(x_n))
    const cobwebLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < Math.min(displayPts.length - 1, 20); i++) {
        const xn = displayPts[i];
        const fxn = displayPts[i + 1];
        if (Math.abs(xn) > 50 || Math.abs(fxn) > 50) break;
        // Vertical: (xn, xn) -> (xn, f(xn))
        cobwebLines.push({ x1: xn, y1: xn, x2: xn, y2: fxn });
        // Horizontal: (xn, f(xn)) -> (f(xn), f(xn))
        cobwebLines.push({ x1: xn, y1: fxn, x2: fxn, y2: fxn });
    }

    // Cobweb plot scaling (square)
    const cbMin = Math.min(yMin, ...allVals) - 0.5;
    const cbMax = Math.max(yMax, ...allVals) + 0.5;
    const cbScale = (v: number) => PAD.top + PH - ((v - cbMin) / (cbMax - cbMin || 1)) * PH;
    const cbXScale = (v: number) => PAD.left + ((v - cbMin) / (cbMax - cbMin || 1)) * PW;

    // Function curve for cobweb
    const fnCurve: string[] = [];
    const step = (cbMax - cbMin) / 80;
    for (let x = cbMin; x <= cbMax; x += step) {
        const y = mapping.fn(x);
        if (y >= cbMin - 2 && y <= cbMax + 2) {
            fnCurve.push(`${cbXScale(x).toFixed(1)},${cbScale(y).toFixed(1)}`);
        }
    }

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Contraction Mapping Lab</h3>
            <p className="text-sm text-slate-600 mb-4">Watch iterations converge (or not) to a fixed point</p>

            {/* Mapping selector */}
            <div className="flex flex-wrap gap-2 mb-3">
                {(Object.keys(MAPPINGS) as MappingType[]).map(k => (
                    <button
                        key={k}
                        onClick={() => setMapType(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${mapType === k
                                ? 'text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                            }`}
                        style={mapType === k ? { backgroundColor: MAPPINGS[k].color } : {}}
                    >
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-500 mb-3 italic">{mapping.description}</p>

            {/* Cobweb diagram */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 340 }}>
                    <rect x={PAD.left} y={PAD.top} width={PW} height={PH} fill="#f8fafc" stroke="#e2e8f0" />

                    {/* Grid */}
                    {Array.from({ length: 9 }, (_, i) => {
                        const v = cbMin + (i / 8) * (cbMax - cbMin);
                        return (
                            <React.Fragment key={i}>
                                <line x1={cbXScale(v)} y1={PAD.top} x2={cbXScale(v)} y2={PAD.top + PH}
                                    stroke="#e2e8f0" strokeWidth={0.5} />
                                <line x1={PAD.left} y1={cbScale(v)} x2={PAD.left + PW} y2={cbScale(v)}
                                    stroke="#e2e8f0" strokeWidth={0.5} />
                            </React.Fragment>
                        );
                    })}

                    {/* y = x line (identity) */}
                    <line x1={cbXScale(cbMin)} y1={cbScale(cbMin)} x2={cbXScale(cbMax)} y2={cbScale(cbMax)}
                        stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
                    <text x={cbXScale(cbMax) - 2} y={cbScale(cbMax) - 5}
                        fontSize={9} fill="#94a3b8" textAnchor="end">y = x</text>

                    {/* Function curve */}
                    {fnCurve.length > 1 && (
                        <polyline points={fnCurve.join(" ")} fill="none"
                            stroke={mapping.color} strokeWidth={2} />
                    )}
                    <text x={PAD.left + PW - 5} y={PAD.top + 15}
                        fontSize={9} fill={mapping.color} textAnchor="end" fontWeight="bold">
                        y = f(x)
                    </text>

                    {/* Cobweb lines */}
                    {cobwebLines.map((line, i) => (
                        <line
                            key={i}
                            x1={cbXScale(line.x1)} y1={cbScale(line.y1)}
                            x2={cbXScale(line.x2)} y2={cbScale(line.y2)}
                            stroke="#f59e0b"
                            strokeWidth={1.5}
                            opacity={0.7}
                        />
                    ))}

                    {/* Fixed point */}
                    {mapping.fixedPoint !== null && cbXScale(mapping.fixedPoint) > PAD.left && cbXScale(mapping.fixedPoint) < PAD.left + PW && (
                        <>
                            <circle cx={cbXScale(mapping.fixedPoint)} cy={cbScale(mapping.fixedPoint)}
                                r={6} fill="none" stroke="#ef4444" strokeWidth={2} />
                            <text x={cbXScale(mapping.fixedPoint) + 10} y={cbScale(mapping.fixedPoint) - 5}
                                fontSize={9} fill="#ef4444" fontWeight="bold">x* = {mapping.fixedPoint}</text>
                        </>
                    )}

                    {/* Starting point */}
                    <circle cx={cbXScale(x0)} cy={cbScale(x0)} r={5}
                        fill={mapping.color} stroke="#fff" strokeWidth={2} />

                    {/* Axis labels */}
                    <text x={PAD.left + PW / 2} y={H - 5} textAnchor="middle" fontSize={10} fill="#64748b">x</text>
                    <text x={12} y={PAD.top + PH / 2} textAnchor="middle" fontSize={10} fill="#64748b"
                        transform={`rotate(-90, 12, ${PAD.top + PH / 2})`}>f(x)</text>

                    {/* Tick labels */}
                    {[cbMin, (cbMin + cbMax) / 2, cbMax].map((v, i) => (
                        <React.Fragment key={i}>
                            <text x={PAD.left - 4} y={cbScale(v) + 4} textAnchor="end" fontSize={8} fill="#94a3b8">
                                {v.toFixed(1)}
                            </text>
                            <text x={cbXScale(v)} y={PAD.top + PH + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">
                                {v.toFixed(1)}
                            </text>
                        </React.Fragment>
                    ))}
                </svg>
            </div>

            {/* Controls */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-slate-500 font-semibold">Starting point x₀</label>
                    <input type="range" min={-3} max={5} step={0.5} value={x0}
                        onChange={e => setX0(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 mt-1" />
                    <span className="text-xs text-slate-400">{x0.toFixed(1)}</span>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-semibold">Iterations</label>
                    <input type="range" min={3} max={20} value={numIter}
                        onChange={e => setNumIter(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 mt-1" />
                    <span className="text-xs text-slate-400">{numIter}</span>
                </div>
            </div>

            {/* Animate button */}
            <button
                onClick={startAnimation}
                disabled={animating}
                className="mt-3 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                {animating ? `Iterating... (${animatedN + 1}/${iterations.length})` : "▶ Animate Iterations"}
            </button>

            {/* Iteration table */}
            <div className="mt-4 max-h-32 overflow-y-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="text-left py-1 text-slate-500 font-semibold">n</th>
                            <th className="text-left py-1 text-slate-500 font-semibold">xₙ</th>
                            {mapping.fixedPoint !== null && (
                                <th className="text-left py-1 text-slate-500 font-semibold">|xₙ - x*|</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {displayPts.map((v, i) => (
                            <tr key={i} className="border-b border-slate-100">
                                <td className="py-0.5 text-slate-600">{i}</td>
                                <td className="py-0.5 font-mono" style={{ color: mapping.color }}>{v.toFixed(4)}</td>
                                {mapping.fixedPoint !== null && (
                                    <td className="py-0.5 font-mono text-slate-400">
                                        {Math.abs(v - mapping.fixedPoint).toFixed(4)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status badges */}
            <div className="mt-3 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mapping.c < 1 ? 'bg-emerald-100 text-emerald-700' : mapping.c === 1 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                    c = {mapping.c} {mapping.c < 1 ? '< 1 (contraction)' : mapping.c === 1 ? '= 1 (isometry)' : '> 1 (expansion)'}
                </span>
                {mapping.fixedPoint !== null && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                        x* = {mapping.fixedPoint}
                    </span>
                )}
            </div>

            <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
                <strong>Cobweb diagram:</strong> The orange staircase shows iterations bouncing between
                y = f(x) and y = x. For contractions (c &lt; 1), the staircase spirals inward to the fixed point.
                Try switching to expansion to see divergence.
            </div>
        </div>
    );
}
