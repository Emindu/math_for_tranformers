"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Cyclic Group Representation Data ────────────────────────────────────────────
interface CyclicGroupDef {
    n: number;
    name: string;
    latex: string;
    elements: string[];
}

const CYCLIC_GROUPS: CyclicGroupDef[] = [
    { n: 3, name: "C₃", latex: "$C_3$", elements: ["e", "g", "g²"] },
    { n: 4, name: "C₄", latex: "$C_4$", elements: ["e", "g", "g²", "g³"] },
    { n: 6, name: "C₆", latex: "$C_6$", elements: ["e", "g", "g²", "g³", "g⁴", "g⁵"] },
    { n: 8, name: "C₈", latex: "$C_8$", elements: ["e", "g", "g²", "g³", "g⁴", "g⁵", "g⁶", "g⁷"] },
];

// Colors for elements
const ELEMENT_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
    "#f43f5e", "#f59e0b", "#10b981", "#06b6d4",
];

// ── Complex Plane Visualization ─────────────────────────────────────────────────
function ComplexPlaneViz({ n, selectedK, hoveredElement }: {
    n: number;
    selectedK: number;
    hoveredElement: number | null;
}) {
    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 110;

    // Compute nth roots of unity for representation k: ρ_k(g^j) = e^(2πijk/n)
    const points = useMemo(() => {
        return Array.from({ length: n }, (_, j) => {
            const angle = (2 * Math.PI * j * selectedK) / n;
            return {
                x: cx + radius * Math.cos(angle - Math.PI / 2),
                y: cy + radius * Math.sin(angle - Math.PI / 2),
                angle,
                real: Math.cos(angle),
                imag: Math.sin(angle),
            };
        });
    }, [n, selectedK, cx, cy]);

    return (
        <svg width={size} height={size} className="mx-auto">
            {/* Background */}
            <rect width={size} height={size} fill="#0f172a" rx={12} />

            {/* Grid lines */}
            <line x1={cx} y1={10} x2={cx} y2={size - 10} stroke="#1e293b" strokeWidth={1} />
            <line x1={10} y1={cy} x2={size - 10} y2={cy} stroke="#1e293b" strokeWidth={1} />

            {/* Unit circle */}
            <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="4 3" />

            {/* Axis labels */}
            <text x={size - 18} y={cy - 8} fill="#64748b" fontSize={10} textAnchor="middle">Re</text>
            <text x={cx + 12} y={18} fill="#64748b" fontSize={10} textAnchor="start">Im</text>

            {/* Connecting polygon */}
            {n > 1 && (
                <motion.polygon
                    points={points.map(p => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth={1}
                    strokeOpacity={0.4}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {/* Arrow from origin to hovered point */}
            {hoveredElement !== null && (
                <motion.line
                    x1={cx} y1={cy}
                    x2={points[hoveredElement].x}
                    y2={points[hoveredElement].y}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    markerEnd="url(#repArrow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}

            {/* Arrow marker */}
            <defs>
                <marker id="repArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
                </marker>
            </defs>

            {/* Points */}
            {points.map((p, i) => {
                const isHovered = hoveredElement === i;
                const color = ELEMENT_COLORS[i % ELEMENT_COLORS.length];
                return (
                    <motion.g key={`${n}-${selectedK}-${i}`}>
                        <motion.circle
                            cx={p.x} cy={p.y} r={isHovered ? 10 : 7}
                            fill={color}
                            stroke={isHovered ? "#f59e0b" : "transparent"}
                            strokeWidth={2.5}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05, type: "spring" }}
                        />
                        {isHovered && (
                            <text x={p.x} y={p.y - 16}
                                textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight="bold">
                                {p.real.toFixed(2)} + {p.imag.toFixed(2)}i
                            </text>
                        )}
                    </motion.g>
                );
            })}

            {/* Title */}
            <text x={cx} y={size - 10} textAnchor="middle" fill="#94a3b8" fontSize={10}>
                ρ_{selectedK}(g) = e^(2πi·{selectedK}/{n})
            </text>
        </svg>
    );
}

// ── Matrix Display ──────────────────────────────────────────────────────────────
function MatrixRepView({ n, selectedK, hoveredElement }: {
    n: number;
    selectedK: number;
    hoveredElement: number | null;
}) {
    const activeIdx = hoveredElement ?? 0;
    const angle = (2 * Math.PI * activeIdx * selectedK) / n;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const fmt = (v: number) => {
        if (Math.abs(v) < 1e-10) return "0";
        if (Math.abs(v - 1) < 1e-10) return "1";
        if (Math.abs(v + 1) < 1e-10) return "-1";
        return v.toFixed(3);
    };

    return (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-center text-slate-400 text-xs mb-3">
                2D Rotation Matrix for <span className="text-white font-bold">
                    g{activeIdx > 0 ? `^${activeIdx}` : " (identity)"}
                </span>
            </div>
            <div className="flex justify-center">
                <div className="relative">
                    {/* Matrix brackets */}
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-2xl font-light">[</span>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <motion.span
                                key={`cos-${activeIdx}`}
                                className="text-emerald-400 font-mono text-sm text-right"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {fmt(cos)}
                            </motion.span>
                            <motion.span
                                key={`nsin-${activeIdx}`}
                                className="text-rose-400 font-mono text-sm text-right"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {fmt(-sin)}
                            </motion.span>
                            <motion.span
                                key={`sin-${activeIdx}`}
                                className="text-rose-400 font-mono text-sm text-right"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {fmt(sin)}
                            </motion.span>
                            <motion.span
                                key={`cos2-${activeIdx}`}
                                className="text-emerald-400 font-mono text-sm text-right"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {fmt(cos)}
                            </motion.span>
                        </div>
                        <span className="text-slate-400 text-2xl font-light">]</span>
                    </div>
                </div>
            </div>
            <div className="text-center text-slate-500 text-[10px] mt-3">
                θ = 2π · {activeIdx} · {selectedK} / {n} = {(angle * 180 / Math.PI).toFixed(1)}°
            </div>
        </div>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────────
export default function RepresentationTheoryLab() {
    const [groupIdx, setGroupIdx] = useState(1); // default C₄
    const [selectedK, setSelectedK] = useState(1);
    const [hoveredElement, setHoveredElement] = useState<number | null>(null);

    const group = CYCLIC_GROUPS[groupIdx];

    // Reset k when switching groups
    const handleGroupChange = (idx: number) => {
        setGroupIdx(idx);
        setSelectedK(1);
        setHoveredElement(null);
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-800">Representation Explorer</h3>
                <p className="text-sm text-slate-600 mt-1">
                    Visualize how cyclic group elements map to rotations in the complex plane
                </p>
            </div>

            {/* Group selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {CYCLIC_GROUPS.map((g, i) => (
                    <button
                        key={i}
                        onClick={() => handleGroupChange(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${groupIdx === i
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            {/* Representation k selector */}
            <div className="mb-5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Representation <Latex>{`$\\rho_{${selectedK}}$`}</Latex>
                    <span className="text-slate-400 font-normal lowercase ml-1">(k = {selectedK})</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: group.n }, (_, k) => (
                        <button
                            key={k}
                            onClick={() => { setSelectedK(k); setHoveredElement(null); }}
                            className={`w-8 h-8 rounded-md text-xs font-bold transition-all ${selectedK === k
                                    ? 'bg-violet-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
                                }`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>

            {/* Complex plane */}
            <div className="mb-4">
                <ComplexPlaneViz n={group.n} selectedK={selectedK} hoveredElement={hoveredElement} />
            </div>

            {/* Element list */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4">
                <div className="text-xs font-semibold text-slate-500 mb-2">Group Elements — hover to highlight</div>
                <div className="flex flex-wrap gap-1.5">
                    {group.elements.map((el, i) => (
                        <motion.button
                            key={i}
                            onMouseEnter={() => setHoveredElement(i)}
                            onMouseLeave={() => setHoveredElement(null)}
                            className="px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all border"
                            style={{
                                backgroundColor: hoveredElement === i ? ELEMENT_COLORS[i % ELEMENT_COLORS.length] : '#f8fafc',
                                color: hoveredElement === i ? '#fff' : '#475569',
                                borderColor: hoveredElement === i ? ELEMENT_COLORS[i % ELEMENT_COLORS.length] : '#e2e8f0',
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {el}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Matrix representation */}
            <MatrixRepView n={group.n} selectedK={selectedK} hoveredElement={hoveredElement} />

            {/* Insight */}
            <div className="mt-5 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                <p>
                    <strong>Observation:</strong> When <Latex>{"$k = 0$"}</Latex>, every element maps to
                    the identity — the <em>trivial representation</em>. When <Latex>{"$k = 1$"}</Latex>, you get
                    the <em>standard representation</em> where <Latex>{"$g$"}</Latex> rotates
                    by <Latex>{`$2\\pi/${group.n}$`}</Latex>. Try different values of <em>k</em> to see how
                    the same group can be represented in multiple ways!
                </p>
            </div>
        </div>
    );
}
