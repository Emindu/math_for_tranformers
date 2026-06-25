"use client";

import React, { useState, useCallback, useRef } from 'react';

// ── Metric functions ────────────────────────────────────────────────────────
function euclidean(p1: [number, number], p2: [number, number]): number {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}
function manhattan(p1: [number, number], p2: [number, number]): number {
    return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}
function chebyshev(p1: [number, number], p2: [number, number]): number {
    return Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]));
}
function cosineDistance(p1: [number, number], p2: [number, number]): number {
    const dot = p1[0] * p2[0] + p1[1] * p2[1];
    const m1 = Math.sqrt(p1[0] ** 2 + p1[1] ** 2);
    const m2 = Math.sqrt(p2[0] ** 2 + p2[1] ** 2);
    if (m1 === 0 || m2 === 0) return 1;
    return 1 - dot / (m1 * m2);
}

type MetricKey = "euclidean" | "manhattan" | "chebyshev" | "cosine";

const METRICS: Record<MetricKey, { name: string; fn: (a: [number, number], b: [number, number]) => number; formula: string; ballLabel: string; color: string }> = {
    euclidean: { name: "Euclidean (L²)", fn: euclidean, formula: "√(Δx² + Δy²)", ballLabel: "Circle", color: "#6366f1" },
    manhattan: { name: "Manhattan (L¹)", fn: manhattan, formula: "|Δx| + |Δy|", ballLabel: "Diamond", color: "#f59e0b" },
    chebyshev: { name: "Chebyshev (L∞)", fn: chebyshev, formula: "max(|Δx|, |Δy|)", ballLabel: "Square", color: "#10b981" },
    cosine: { name: "Cosine Distance", fn: cosineDistance, formula: "1 − (x·y)/(‖x‖‖y‖)", ballLabel: "Angular", color: "#ec4899" },
};

// ── Unit ball path for different metrics ─────────────────────────────────────
function unitBallPath(metric: MetricKey, cx: number, cy: number, r: number): string {
    const pts: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
        const θ = (2 * Math.PI * i) / steps;
        let px: number, py: number;
        if (metric === "euclidean") {
            px = cx + r * Math.cos(θ);
            py = cy + r * Math.sin(θ);
        } else if (metric === "manhattan") {
            // |x|+|y|=1 → diamond
            const c = Math.cos(θ), s = Math.sin(θ);
            const scale = r / (Math.abs(c) + Math.abs(s));
            px = cx + scale * c;
            py = cy + scale * s;
        } else if (metric === "chebyshev") {
            // max(|x|,|y|)=1 → square
            const c = Math.cos(θ), s = Math.sin(θ);
            const scale = r / Math.max(Math.abs(c), Math.abs(s));
            px = cx + scale * c;
            py = cy + scale * s;
        } else {
            // Cosine — no meaningful 2D unit ball; draw a circle
            px = cx + r * Math.cos(θ);
            py = cy + r * Math.sin(θ);
        }
        pts.push(`${px.toFixed(2)},${py.toFixed(2)}`);
    }
    return `M${pts.join("L")}Z`;
}

// ── SVG constants ───────────────────────────────────────────────────────────
const SVG_W = 400;
const SVG_H = 400;
const GRID_RANGE = 5; // -5 to 5
const SCALE = SVG_W / (2 * GRID_RANGE);

function toSVG(v: number): number { return SVG_W / 2 + v * SCALE; }
function fromSVG(px: number): number { return (px - SVG_W / 2) / SCALE; }

// ── Draggable Point ─────────────────────────────────────────────────────────
function DraggablePoint({ pos, setPos, color, label }: {
    pos: [number, number];
    setPos: (p: [number, number]) => void;
    color: string;
    label: string;
}) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const dragging = useRef(false);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!dragging.current) return;
        const svg = (e.target as Element).closest("svg");
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const x = fromSVG(((e.clientX - rect.left) / rect.width) * SVG_W);
        const y = -fromSVG(((e.clientY - rect.top) / rect.height) * SVG_H);
        const clamp = (v: number) => Math.max(-GRID_RANGE + 0.5, Math.min(GRID_RANGE - 0.5, v));
        setPos([Math.round(clamp(x) * 2) / 2, Math.round(clamp(y) * 2) / 2]);
    }, [setPos]);

    const handlePointerUp = useCallback(() => { dragging.current = false; }, []);

    return (
        <g
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ cursor: "grab" }}
        >
            <circle cx={toSVG(pos[0])} cy={toSVG(-pos[1])} r={14} fill={color} opacity={0.2} />
            <circle cx={toSVG(pos[0])} cy={toSVG(-pos[1])} r={8} fill={color} stroke="#fff" strokeWidth={2} />
            <text x={toSVG(pos[0])} y={toSVG(-pos[1]) - 18} textAnchor="middle" fontSize={11} fontWeight="bold" fill={color}>{label}</text>
        </g>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────
export default function MetricSpaceLab() {
    const [pointA, setPointA] = useState<[number, number]>([2, 3]);
    const [pointB, setPointB] = useState<[number, number]>([-1, -2]);
    const [metric, setMetric] = useState<MetricKey>("euclidean");
    const [showBall, setShowBall] = useState(true);

    const m = METRICS[metric];
    const dist = m.fn(pointA, pointB);

    // Grid lines
    const gridLines = [];
    for (let i = -GRID_RANGE; i <= GRID_RANGE; i++) {
        gridLines.push(
            <line key={`v${i}`} x1={toSVG(i)} y1={0} x2={toSVG(i)} y2={SVG_H}
                stroke={i === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={i === 0 ? 1.5 : 0.5} />
        );
        gridLines.push(
            <line key={`h${i}`} x1={0} y1={toSVG(i)} x2={SVG_W} y2={toSVG(i)}
                stroke={i === 0 ? "#94a3b8" : "#e2e8f0"} strokeWidth={i === 0 ? 1.5 : 0.5} />
        );
    }

    // Distance visualization line
    const linePoints = metric === "manhattan" ? (
        <>
            <line x1={toSVG(pointA[0])} y1={toSVG(-pointA[1])} x2={toSVG(pointB[0])} y2={toSVG(-pointA[1])}
                stroke={m.color} strokeWidth={2} strokeDasharray="6,3" opacity={0.6} />
            <line x1={toSVG(pointB[0])} y1={toSVG(-pointA[1])} x2={toSVG(pointB[0])} y2={toSVG(-pointB[1])}
                stroke={m.color} strokeWidth={2} strokeDasharray="6,3" opacity={0.6} />
        </>
    ) : (
        <line x1={toSVG(pointA[0])} y1={toSVG(-pointA[1])} x2={toSVG(pointB[0])} y2={toSVG(-pointB[1])}
            stroke={m.color} strokeWidth={2} strokeDasharray="6,3" opacity={0.6} />
    );

    // Midpoint for distance label
    const midX = (toSVG(pointA[0]) + toSVG(pointB[0])) / 2;
    const midY = (toSVG(-pointA[1]) + toSVG(-pointB[1])) / 2;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Metric Space Explorer</h3>
            <p className="text-sm text-slate-600 mb-4">Drag the points and switch metrics to see how distance changes</p>

            {/* Metric selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(METRICS) as MetricKey[]).map(k => (
                    <button
                        key={k}
                        onClick={() => setMetric(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${metric === k
                                ? 'text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                            }`}
                        style={metric === k ? { backgroundColor: METRICS[k].color } : {}}
                    >
                        {METRICS[k].name}
                    </button>
                ))}
            </div>

            {/* SVG Canvas */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxHeight: 400 }}>
                    {/* Grid */}
                    {gridLines}

                    {/* Unit ball at origin */}
                    {showBall && metric !== "cosine" && (
                        <path
                            key={metric}
                            d={unitBallPath(metric, SVG_W / 2, SVG_H / 2, SCALE)}
                            fill={m.color}
                            fillOpacity={0.08}
                            stroke={m.color}
                            strokeWidth={1.5}
                            strokeDasharray="4,3"
                        />
                    )}

                    {/* Distance line */}
                    {linePoints}

                    {/* Distance label */}
                    <rect x={midX - 28} y={midY - 22} width={56} height={18} rx={4}
                        fill={m.color} opacity={0.9} />
                    <text x={midX} y={midY - 10} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">
                        {dist.toFixed(2)}
                    </text>

                    {/* Draggable points */}
                    <DraggablePoint pos={pointA} setPos={setPointA} color="#6366f1" label="A" />
                    <DraggablePoint pos={pointB} setPos={setPointB} color="#f97316" label="B" />
                </svg>
            </div>

            {/* Info panel */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-indigo-600 font-semibold">Point A</span>
                    <div className="font-mono text-sm text-indigo-800 mt-1">({pointA[0]}, {pointA[1]})</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <span className="text-xs text-orange-600 font-semibold">Point B</span>
                    <div className="font-mono text-sm text-orange-800 mt-1">({pointB[0]}, {pointB[1]})</div>
                </div>
            </div>

            <div className="mt-3 p-3 rounded-lg text-center" style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}30` }}>
                <div className="text-xs font-semibold mb-1" style={{ color: m.color }}>{m.name}</div>
                <div className="font-mono text-sm text-slate-800">d(A, B) = {m.formula} = <strong>{dist.toFixed(4)}</strong></div>
            </div>

            {/* Unit ball toggle */}
            <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="checkbox" checked={showBall} onChange={() => setShowBall(!showBall)}
                        className="accent-indigo-600" />
                    Show unit ball at origin
                </label>
                <span className="text-xs text-slate-400">
                    {showBall && metric !== "cosine" ? `Shape: ${m.ballLabel}` : ""}
                </span>
            </div>
        </div>
    );
}
