"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Sequence generators ─────────────────────────────────────────────────────
type SequenceType = "convergent" | "cauchy_complete" | "cauchy_incomplete" | "oscillating";

interface SeqDef {
    name: string;
    description: string;
    generator: (n: number) => number;
    limit: number | null;
    isCauchy: boolean;
    converges: boolean;
    color: string;
}

const SEQUENCES: Record<SequenceType, SeqDef> = {
    convergent: {
        name: "1/n → 0",
        description: "Classic convergent sequence in ℝ (complete space)",
        generator: (n: number) => 1 / n,
        limit: 0,
        isCauchy: true,
        converges: true,
        color: "#6366f1",
    },
    cauchy_complete: {
        name: "Σ1/2ⁿ → 2",
        description: "Partial sums converging to 2 in ℝ (complete)",
        generator: (n: number) => {
            let sum = 0;
            for (let k = 0; k < n; k++) sum += 1 / Math.pow(2, k);
            return sum;
        },
        limit: 2,
        isCauchy: true,
        converges: true,
        color: "#10b981",
    },
    cauchy_incomplete: {
        name: "→ √2 in ℚ",
        description: "Cauchy in ℚ but limit √2 ∉ ℚ (incomplete space)",
        generator: (n: number) => {
            // Newton's method for √2 starting from 1
            let x = 1;
            for (let i = 0; i < n; i++) x = (x + 2 / x) / 2;
            return x;
        },
        limit: Math.SQRT2,
        isCauchy: true,
        converges: false, // doesn't converge IN Q
        color: "#ef4444",
    },
    oscillating: {
        name: "(-1)ⁿ/n",
        description: "Alternating sequence converging to 0",
        generator: (n: number) => (n === 0 ? 1 : (Math.pow(-1, n)) / n),
        limit: 0,
        isCauchy: true,
        converges: true,
        color: "#f59e0b",
    },
};

// ── SVG Constants ───────────────────────────────────────────────────────────
const W = 420;
const H = 260;
const PAD = { left: 50, right: 20, top: 30, bottom: 40 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

export default function ConvergenceLab() {
    const [seqType, setSeqType] = useState<SequenceType>("convergent");
    const [numTerms, setNumTerms] = useState(15);
    const [epsilon, setEpsilon] = useState(0.3);
    const [animating, setAnimating] = useState(false);
    const [animatedN, setAnimatedN] = useState(numTerms);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const seq = SEQUENCES[seqType];
    const terms = Array.from({ length: numTerms }, (_, i) => seq.generator(i + 1));

    // Compute y-range
    const allVals = [...terms, seq.limit ?? 0];
    const yMin = Math.min(...allVals) - 0.5;
    const yMax = Math.max(...allVals) + 0.5;

    const xScale = (n: number) => PAD.left + ((n - 1) / Math.max(numTerms - 1, 1)) * PLOT_W;
    const yScale = (v: number) => PAD.top + PLOT_H - ((v - yMin) / (yMax - yMin)) * PLOT_H;

    // Find N_epsilon: first n where all subsequent terms are within epsilon of limit
    const nEpsilon = seq.limit !== null ? (() => {
        for (let start = 0; start < terms.length; start++) {
            let allInside = true;
            for (let k = start; k < terms.length; k++) {
                if (Math.abs(terms[k] - seq.limit!) >= epsilon) {
                    allInside = false;
                    break;
                }
            }
            if (allInside) return start + 1;
        }
        return null;
    })() : null;

    // Animation
    const startAnimation = useCallback(() => {
        setAnimating(true);
        setAnimatedN(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
        let n = 0;
        intervalRef.current = setInterval(() => {
            n++;
            setAnimatedN(n);
            if (n >= numTerms) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setAnimating(false);
            }
        }, 200);
    }, [numTerms]);

    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    useEffect(() => {
        setAnimatedN(numTerms);
        setAnimating(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [seqType, numTerms]);

    const displayN = animating ? animatedN : numTerms;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Convergence Explorer</h3>
            <p className="text-sm text-slate-600 mb-4">Visualize sequences converging (or not) in metric spaces</p>

            {/* Sequence selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(SEQUENCES) as SequenceType[]).map(k => (
                    <button
                        key={k}
                        onClick={() => setSeqType(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${seqType === k
                                ? 'text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                            }`}
                        style={seqType === k ? { backgroundColor: SEQUENCES[k].color } : {}}
                    >
                        {SEQUENCES[k].name}
                    </button>
                ))}
            </div>

            <p className="text-xs text-slate-500 mb-3 italic">{seq.description}</p>

            {/* SVG Plot */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
                    {/* Plot area bg */}
                    <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H}
                        fill="#f8fafc" stroke="#e2e8f0" />

                    {/* ε-band around limit */}
                    {seq.limit !== null && (
                        <rect
                            x={PAD.left}
                            y={yScale(seq.limit + epsilon)}
                            width={PLOT_W}
                            height={yScale(seq.limit - epsilon) - yScale(seq.limit + epsilon)}
                            fill={seq.color}
                            opacity={0.08}
                            stroke={seq.color}
                            strokeWidth={0.5}
                            strokeDasharray="4,3"
                        />
                    )}

                    {/* Limit line */}
                    {seq.limit !== null && (
                        <>
                            <line x1={PAD.left} y1={yScale(seq.limit)} x2={PAD.left + PLOT_W} y2={yScale(seq.limit)}
                                stroke={seq.color} strokeWidth={1.5} strokeDasharray="6,3" opacity={0.5} />
                            <text x={PAD.left + PLOT_W + 3} y={yScale(seq.limit) + 4}
                                fontSize={9} fill={seq.color} fontWeight="bold">L={seq.limit.toFixed(3)}</text>
                        </>
                    )}

                    {/* N_epsilon marker */}
                    {nEpsilon !== null && nEpsilon <= displayN && (
                        <>
                            <line x1={xScale(nEpsilon)} y1={PAD.top} x2={xScale(nEpsilon)} y2={PAD.top + PLOT_H}
                                stroke="#ef4444" strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
                            <text x={xScale(nEpsilon)} y={PAD.top - 5} textAnchor="middle"
                                fontSize={8} fill="#ef4444" fontWeight="bold">N={nEpsilon}</text>
                        </>
                    )}

                    {/* Axis labels */}
                    <text x={PAD.left + PLOT_W / 2} y={H - 5} textAnchor="middle" fontSize={10} fill="#64748b">n</text>
                    <text x={12} y={PAD.top + PLOT_H / 2} textAnchor="middle" fontSize={10} fill="#64748b"
                        transform={`rotate(-90, 12, ${PAD.top + PLOT_H / 2})`}>xₙ</text>

                    {/* Y-axis ticks */}
                    {[yMin, (yMin + yMax) / 2, yMax].map((v, i) => (
                        <text key={i} x={PAD.left - 4} y={yScale(v) + 4} textAnchor="end" fontSize={8} fill="#94a3b8">
                            {v.toFixed(1)}
                        </text>
                    ))}

                    {/* X-axis ticks */}
                    {Array.from({ length: Math.min(numTerms, 10) }, (_, i) => {
                        const n = Math.round(1 + (i / 9) * (numTerms - 1));
                        return (
                            <text key={i} x={xScale(n)} y={PAD.top + PLOT_H + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">
                                {n}
                            </text>
                        );
                    })}

                    {/* Sequence points */}
                    {terms.slice(0, displayN).map((val, i) => {
                        const isInsideEpsilon = seq.limit !== null && Math.abs(val - seq.limit) < epsilon;
                        return (
                            <motion.circle
                                key={i}
                                cx={xScale(i + 1)}
                                cy={yScale(val)}
                                r={4}
                                fill={isInsideEpsilon ? seq.color : "#94a3b8"}
                                stroke="#fff"
                                strokeWidth={1.5}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: animating ? 0 : i * 0.02 }}
                            />
                        );
                    })}

                    {/* Connect points */}
                    {terms.slice(0, displayN).length > 1 && (
                        <polyline
                            points={terms.slice(0, displayN).map((v, i) => `${xScale(i + 1)},${yScale(v)}`).join(" ")}
                            fill="none"
                            stroke={seq.color}
                            strokeWidth={1}
                            opacity={0.3}
                        />
                    )}

                    {/* ε label */}
                    {seq.limit !== null && (
                        <text x={PAD.left + 5} y={yScale(seq.limit + epsilon) - 3}
                            fontSize={8} fill={seq.color} opacity={0.7}>
                            ε = {epsilon.toFixed(2)}
                        </text>
                    )}
                </svg>
            </div>

            {/* Controls */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-500 font-semibold">Terms (n)</label>
                    <input type="range" min={5} max={50} value={numTerms}
                        onChange={e => setNumTerms(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 mt-1" />
                    <span className="text-xs text-slate-400">{numTerms}</span>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-semibold">ε (epsilon)</label>
                    <input type="range" min={0.01} max={1} step={0.01} value={epsilon}
                        onChange={e => setEpsilon(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 mt-1" />
                    <span className="text-xs text-slate-400">{epsilon.toFixed(2)}</span>
                </div>
            </div>

            {/* Animate button */}
            <button
                onClick={startAnimation}
                disabled={animating}
                className="mt-3 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                {animating ? `Animating... (${animatedN}/${numTerms})` : "▶ Animate Sequence"}
            </button>

            {/* Status badges */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${seq.isCauchy ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {seq.isCauchy ? "✓ Cauchy" : "✗ Not Cauchy"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${seq.converges ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {seq.converges ? "✓ Converges" : "✗ Limit ∉ space"}
                </span>
                {nEpsilon !== null && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                        N(ε) = {nEpsilon}
                    </span>
                )}
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
                <strong>Try it:</strong> Reduce ε to see how N must increase — the sequence must
                eventually stay within the shrinking band. For the &ldquo;→ √2 in ℚ&rdquo; sequence, the limit
                exists but lies <em>outside</em> the rational numbers — demonstrating an incomplete space.
            </div>
        </div>
    );
}
