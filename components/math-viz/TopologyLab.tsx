"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── SVG constants ───────────────────────────────────────────────────────────
const W = 420;
const H = 400;
const RANGE = 5;
const SCALE = W / (2 * RANGE);
const toSVG = (v: number) => W / 2 + v * SCALE;
const fromSVG = (px: number, total: number) => (px / total) * 2 * RANGE - RANGE;

type TabKey = "open_closed" | "continuity";

// ── Open/Closed Sets Visualization ──────────────────────────────────────────
function OpenClosedTab() {
    const [center, setCenter] = useState<[number, number]>([0, 0]);
    const [radius, setRadius] = useState(2);
    const [showBoundary, setShowBoundary] = useState(true);
    const [setType, setSetType] = useState<"open" | "closed">("open");

    // Grid
    const gridLines = useMemo(() => {
        const lines = [];
        for (let i = -RANGE; i <= RANGE; i++) {
            lines.push(
                <line key={`v${i}`} x1={toSVG(i)} y1={0} x2={toSVG(i)} y2={H}
                    stroke={i === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={i === 0 ? 1.5 : 0.5} />
            );
            lines.push(
                <line key={`h${i}`} x1={0} y1={toSVG(i)} x2={W} y2={toSVG(i)}
                    stroke={i === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={i === 0 ? 1.5 : 0.5} />
            );
        }
        return lines;
    }, []);

    // Sample points
    const samplePoints = useMemo(() => {
        const pts: { x: number; y: number; inside: boolean }[] = [];
        for (let x = -RANGE + 0.5; x <= RANGE - 0.5; x += 1) {
            for (let y = -RANGE + 0.5; y <= RANGE - 0.5; y += 1) {
                const dist = Math.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2);
                const inside = setType === "open" ? dist < radius : dist <= radius;
                pts.push({ x, y, inside });
            }
        }
        return pts;
    }, [center, radius, setType]);

    // Interior point with ε-ball
    const [hoverPt, setHoverPt] = useState<{ x: number; y: number } | null>(null);
    const hoverDist = hoverPt ? Math.sqrt((hoverPt.x - center[0]) ** 2 + (hoverPt.y - center[1]) ** 2) : 0;
    const hoverInside = hoverPt ? (setType === "open" ? hoverDist < radius : hoverDist <= radius) : false;
    const hoverEps = hoverPt && hoverInside ? (radius - hoverDist) * 0.8 : 0;

    return (
        <div>
            {/* Controls */}
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => setSetType("open")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${setType === "open" ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                >
                    Open Set B(x, r)
                </button>
                <button
                    onClick={() => setSetType("closed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${setType === "closed" ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                >
                    Closed Set B̄(x, r)
                </button>
            </div>

            {/* SVG */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 380 }}>
                    {gridLines}

                    {/* The set region */}
                    <circle
                        cx={toSVG(center[0])}
                        cy={toSVG(-center[1])}
                        r={radius * SCALE}
                        fill={setType === "open" ? "#6366f1" : "#10b981"}
                        fillOpacity={0.12}
                        stroke={setType === "open" ? "#6366f1" : "#10b981"}
                        strokeWidth={2}
                        strokeDasharray={setType === "open" ? "6,4" : "none"}
                    />

                    {/* Boundary label */}
                    {showBoundary && (
                        <text
                            x={toSVG(center[0]) + radius * SCALE + 5}
                            y={toSVG(-center[1]) - 5}
                            fontSize={10}
                            fill={setType === "open" ? "#6366f1" : "#10b981"}
                            fontWeight="bold"
                        >
                            r = {radius.toFixed(1)}
                            {setType === "open" ? " (dashed = excluded)" : " (solid = included)"}
                        </text>
                    )}

                    {/* Sample points */}
                    {samplePoints.map((pt, i) => (
                        <circle
                            key={i}
                            cx={toSVG(pt.x)}
                            cy={toSVG(-pt.y)}
                            r={pt.inside ? 4 : 3}
                            fill={pt.inside ? (setType === "open" ? "#6366f1" : "#10b981") : "#cbd5e1"}
                            opacity={pt.inside ? 0.7 : 0.3}
                            onMouseEnter={() => setHoverPt({ x: pt.x, y: pt.y })}
                            onMouseLeave={() => setHoverPt(null)}
                            style={{ cursor: "pointer" }}
                        />
                    ))}

                    {/* ε-ball around hovered interior point */}
                    {hoverPt && hoverInside && hoverEps > 0 && (
                        <motion.circle
                            cx={toSVG(hoverPt.x)}
                            cy={toSVG(-hoverPt.y)}
                            r={hoverEps * SCALE}
                            fill="#f59e0b"
                            fillOpacity={0.15}
                            stroke="#f59e0b"
                            strokeWidth={1.5}
                            strokeDasharray="4,3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}

                    {/* Center point */}
                    <circle cx={toSVG(center[0])} cy={toSVG(-center[1])} r={6}
                        fill="#ef4444" stroke="#fff" strokeWidth={2} />
                    <text x={toSVG(center[0])} y={toSVG(-center[1]) - 12}
                        textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight="bold">
                        center
                    </text>
                </svg>
            </div>

            {/* Radius slider */}
            <div className="mt-3">
                <label className="text-xs text-slate-500 font-semibold">Radius (r)</label>
                <input type="range" min={0.5} max={4} step={0.1} value={radius}
                    onChange={e => setRadius(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 mt-1" />
                <span className="text-xs text-slate-400">{radius.toFixed(1)}</span>
            </div>

            {/* Info */}
            <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-xs text-indigo-800">
                    <strong>{setType === "open" ? "Open set:" : "Closed set:"}</strong>{" "}
                    {setType === "open"
                        ? "Boundary is excluded (dashed). Hover an interior point to see its ε-neighborhood — it fits entirely inside the set."
                        : "Boundary is included (solid). The set contains all its limit points."}
                </p>
            </div>
        </div>
    );
}

// ── Continuity Visualization ────────────────────────────────────────────────
function ContinuityTab() {
    const [funcType, setFuncType] = useState<"continuous" | "discontinuous">("continuous");
    const [inputX, setInputX] = useState(2);
    const [epsilon, setEpsilon] = useState(0.8);

    // Functions
    const f = funcType === "continuous"
        ? (x: number) => 0.5 * x + 0.5
        : (x: number) => (x < 2 ? 0.5 * x + 0.5 : 0.5 * x + 1.5);

    const fLabel = funcType === "continuous" ? "f(x) = 0.5x + 0.5" : "f(x) = 0.5x + 0.5 (x<2), 0.5x + 1.5 (x≥2)";

    const fx = f(inputX);

    // Compute delta: find how far we can go from inputX while staying within epsilon of f(inputX)
    const delta = funcType === "continuous"
        ? epsilon / 0.5 // linear, so delta = epsilon / slope
        : (inputX < 2 ? Math.min(epsilon / 0.5, 2 - inputX) : epsilon / 0.5);

    // Plot bounds
    const xMin = -1, xMax = 5, yMin = -1, yMax = 5;
    const PW = W;
    const PH = 300;
    const xToSvg = (x: number) => ((x - xMin) / (xMax - xMin)) * PW;
    const yToSvg = (y: number) => PH - ((y - yMin) / (yMax - yMin)) * PH;

    // Curve path
    const curvePts: string[] = [];
    const step = 0.05;
    for (let x = xMin; x <= xMax; x += step) {
        curvePts.push(`${xToSvg(x).toFixed(1)},${yToSvg(f(x)).toFixed(1)}`);
    }

    // For discontinuous, draw two segments
    const curveLeft: string[] = [];
    const curveRight: string[] = [];
    if (funcType === "discontinuous") {
        for (let x = xMin; x < 2; x += step) {
            curveLeft.push(`${xToSvg(x).toFixed(1)},${yToSvg(0.5 * x + 0.5).toFixed(1)}`);
        }
        for (let x = 2; x <= xMax; x += step) {
            curveRight.push(`${xToSvg(x).toFixed(1)},${yToSvg(0.5 * x + 1.5).toFixed(1)}`);
        }
    }

    return (
        <div>
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => { setFuncType("continuous"); setInputX(2); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${funcType === "continuous" ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                >
                    Continuous
                </button>
                <button
                    onClick={() => { setFuncType("discontinuous"); setInputX(2); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${funcType === "discontinuous" ? 'bg-red-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                >
                    Discontinuous
                </button>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <svg viewBox={`0 0 ${PW} ${PH}`} className="w-full" style={{ maxHeight: 300 }}>
                    {/* Background */}
                    <rect width={PW} height={PH} fill="#f8fafc" />

                    {/* Grid */}
                    {Array.from({ length: 7 }, (_, i) => i - 1).map(v => (
                        <React.Fragment key={v}>
                            <line x1={xToSvg(v)} y1={0} x2={xToSvg(v)} y2={PH}
                                stroke={v === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={v === 0 ? 1 : 0.5} />
                            <line x1={0} y1={yToSvg(v)} x2={PW} y2={yToSvg(v)}
                                stroke={v === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={v === 0 ? 1 : 0.5} />
                        </React.Fragment>
                    ))}

                    {/* ε-band (horizontal) around f(x₀) */}
                    <rect x={0} y={yToSvg(fx + epsilon)} width={PW}
                        height={yToSvg(fx - epsilon) - yToSvg(fx + epsilon)}
                        fill="#f59e0b" fillOpacity={0.1}
                        stroke="#f59e0b" strokeWidth={0.5} strokeDasharray="4,3" />
                    <text x={PW - 5} y={yToSvg(fx + epsilon) - 3}
                        textAnchor="end" fontSize={8} fill="#f59e0b">ε = {epsilon.toFixed(2)}</text>

                    {/* δ-band (vertical) around x₀ */}
                    <rect x={xToSvg(inputX - delta)} y={0}
                        width={xToSvg(inputX + delta) - xToSvg(inputX - delta)}
                        height={PH}
                        fill="#6366f1" fillOpacity={0.08}
                        stroke="#6366f1" strokeWidth={0.5} strokeDasharray="4,3" />
                    <text x={xToSvg(inputX + delta) + 3} y={PH - 5}
                        fontSize={8} fill="#6366f1">δ = {delta.toFixed(2)}</text>

                    {/* Function curve */}
                    {funcType === "continuous" ? (
                        <polyline points={curvePts.join(" ")} fill="none"
                            stroke="#6366f1" strokeWidth={2} />
                    ) : (
                        <>
                            <polyline points={curveLeft.join(" ")} fill="none"
                                stroke="#6366f1" strokeWidth={2} />
                            <polyline points={curveRight.join(" ")} fill="none"
                                stroke="#ef4444" strokeWidth={2} />
                            {/* Open/closed circles at jump */}
                            <circle cx={xToSvg(2)} cy={yToSvg(0.5 * 2 + 0.5)} r={4}
                                fill="#fff" stroke="#6366f1" strokeWidth={2} />
                            <circle cx={xToSvg(2)} cy={yToSvg(0.5 * 2 + 1.5)} r={4}
                                fill="#ef4444" stroke="#ef4444" strokeWidth={2} />
                        </>
                    )}

                    {/* Point x₀, f(x₀) */}
                    <line x1={xToSvg(inputX)} y1={0} x2={xToSvg(inputX)} y2={PH}
                        stroke="#ef4444" strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />
                    <line x1={0} y1={yToSvg(fx)} x2={PW} y2={yToSvg(fx)}
                        stroke="#ef4444" strokeWidth={1} strokeDasharray="3,3" opacity={0.4} />
                    <circle cx={xToSvg(inputX)} cy={yToSvg(fx)} r={5}
                        fill="#ef4444" stroke="#fff" strokeWidth={2} />
                    <text x={xToSvg(inputX)} y={yToSvg(fx) - 10}
                        textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight="bold">
                        ({inputX.toFixed(1)}, {fx.toFixed(1)})
                    </text>
                </svg>
            </div>

            {/* Controls */}
            <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-slate-500 font-semibold">x₀</label>
                    <input type="range" min={0} max={4} step={0.1} value={inputX}
                        onChange={e => setInputX(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600 mt-1" />
                    <span className="text-xs text-slate-400">{inputX.toFixed(1)}</span>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-semibold">ε</label>
                    <input type="range" min={0.1} max={2} step={0.05} value={epsilon}
                        onChange={e => setEpsilon(parseFloat(e.target.value))}
                        className="w-full accent-amber-600 mt-1" />
                    <span className="text-xs text-slate-400">{epsilon.toFixed(2)}</span>
                </div>
            </div>

            {/* Info */}
            <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                <p className="text-xs text-indigo-800">
                    <strong>ε-δ continuity:</strong>{" "}
                    {funcType === "continuous"
                        ? `For every ε = ${epsilon.toFixed(2)}, we find δ = ${delta.toFixed(2)} such that points within δ of x₀ map within ε of f(x₀).`
                        : `At x = 2, no δ works — the jump discontinuity means f(x) "breaks" no matter how small δ is.`}
                </p>
            </div>
        </div>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────
export default function TopologyLab() {
    const [tab, setTab] = useState<TabKey>("open_closed");

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Topology Explorer</h3>
            <p className="text-sm text-slate-600 mb-4">Visualize open/closed sets and ε-δ continuity</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-slate-200 rounded-lg p-1">
                <button
                    onClick={() => setTab("open_closed")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "open_closed" ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                        }`}
                >
                    Open & Closed Sets
                </button>
                <button
                    onClick={() => setTab("continuity")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "continuity" ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                        }`}
                >
                    ε-δ Continuity
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {tab === "open_closed" ? <OpenClosedTab /> : <ContinuityTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
