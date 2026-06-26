"use client";

import React, { useState, useMemo } from 'react';

// ── Schedule types ────────────────────────────────────────────────────────────
type ScheduleType = "step" | "exponential" | "polynomial" | "cosine" | "warmrestart";

interface ScheduleDef {
    name: string;
    description: string;
    color: string;
    compute: (t: number, T: number, eta0: number) => number;
}

const ETA0 = 0.1;
const ETA_MIN = 0.001;
const T_MAX = 100;

const SCHEDULES: Record<ScheduleType, ScheduleDef> = {
    step: {
        name: "Step Decay",
        description: "Drops by γ = 0.5 every 20 epochs",
        color: "#6366f1",
        compute: (t) => ETA0 * Math.pow(0.5, Math.floor(t / 20)),
    },
    exponential: {
        name: "Exponential",
        description: "Smooth exponential reduction (λ = 0.03)",
        color: "#10b981",
        compute: (t) => ETA0 * Math.exp(-0.03 * t),
    },
    polynomial: {
        name: "Polynomial",
        description: "Polynomial decay with p = 2",
        color: "#f59e0b",
        compute: (t, T) => ETA0 * Math.pow(Math.max(0, 1 - t / T), 2),
    },
    cosine: {
        name: "Cosine Annealing",
        description: "Cosine schedule between η_min and η_max",
        color: "#ec4899",
        compute: (t, T) => ETA_MIN + 0.5 * (ETA0 - ETA_MIN) * (1 + Math.cos((t * Math.PI) / T)),
    },
    warmrestart: {
        name: "Warm Restarts",
        description: "Cosine annealing with periodic resets",
        color: "#ef4444",
        compute: (t) => {
            const period = 25;
            const tMod = t % period;
            return ETA_MIN + 0.5 * (ETA0 - ETA_MIN) * (1 + Math.cos((tMod * Math.PI) / period));
        },
    },
};

// ── SVG constants ─────────────────────────────────────────────────────────────
const W = 420;
const H = 220;
const PAD = { left: 50, right: 20, top: 20, bottom: 40 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

function Plot({
    scheduleType,
    epoch,
}: {
    scheduleType: ScheduleType;
    epoch: number;
}) {
    const sched = SCHEDULES[scheduleType];
    const epochs = Array.from({ length: T_MAX + 1 }, (_, i) => i);
    const lrs = epochs.map(t => sched.compute(t, T_MAX, ETA0));
    const yMax = ETA0 * 1.05;
    const yMin = 0;

    const xScale = (t: number) => PAD.left + (t / T_MAX) * PW;
    const yScale = (v: number) => PAD.top + PH - ((v - yMin) / (yMax - yMin)) * PH;

    const points = lrs.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    const currentLR = sched.compute(epoch, T_MAX, ETA0);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Grid lines */}
            {[0, 0.025, 0.05, 0.075, 0.1].map((v, i) => (
                <line
                    key={i}
                    x1={PAD.left} y1={yScale(v)}
                    x2={PAD.left + PW} y2={yScale(v)}
                    stroke="#e2e8f0" strokeWidth={0.5}
                />
            ))}

            {/* Plot area border */}
            <rect x={PAD.left} y={PAD.top} width={PW} height={PH} fill="#f8fafc" stroke="#e2e8f0" />

            {/* Schedule line */}
            <polyline points={points} fill="none" stroke={sched.color} strokeWidth={2} />

            {/* Epoch cursor */}
            <line
                x1={xScale(epoch)} y1={PAD.top}
                x2={xScale(epoch)} y2={PAD.top + PH}
                stroke={sched.color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.7}
            />
            <circle
                cx={xScale(epoch)}
                cy={yScale(currentLR)}
                r={5}
                fill={sched.color}
                stroke="#fff"
                strokeWidth={2}
            />

            {/* Axes labels */}
            <text x={PAD.left + PW / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">
                Epoch (t)
            </text>
            <text x={12} y={PAD.top + PH / 2} textAnchor="middle" fontSize={10} fill="#64748b"
                transform={`rotate(-90, 12, ${PAD.top + PH / 2})`}>
                η (LR)
            </text>

            {/* Y-axis ticks */}
            {[0, 0.05, 0.1].map((v, i) => (
                <text key={i} x={PAD.left - 4} y={yScale(v) + 4} textAnchor="end" fontSize={8} fill="#94a3b8">
                    {v.toFixed(3)}
                </text>
            ))}

            {/* X-axis ticks */}
            {[0, 25, 50, 75, 100].map((v, i) => (
                <text key={i} x={xScale(v)} y={PAD.top + PH + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">
                    {v}
                </text>
            ))}

            {/* Current LR label */}
            <text x={xScale(epoch) + 6} y={yScale(currentLR) - 6} fontSize={9} fill={sched.color} fontWeight="bold">
                η={currentLR.toFixed(4)}
            </text>
        </svg>
    );
}

// ── Simulated loss curve using learning rate schedule ─────────────────────────
function simulateLoss(scheduleType: ScheduleType): number[] {
    const losses: number[] = [];
    let loss = 1.0;
    const noise = 0.015;
    for (let t = 0; t <= T_MAX; t++) {
        const lr = SCHEDULES[scheduleType].compute(t, T_MAX, ETA0);
        // Simplified noisy GD: loss decreases proportional to LR, with noise
        loss = loss * (1 - lr * 0.8) + (Math.random() - 0.5) * noise * Math.sqrt(lr / ETA0);
        loss = Math.max(loss, 0.005);
        losses.push(loss);
    }
    return losses;
}

function LossPlot({ scheduleType, epoch }: { scheduleType: ScheduleType; epoch: number }) {
    const sched = SCHEDULES[scheduleType];
    // Deterministic-ish using useMemo with schedule as key
    const losses = useMemo(() => simulateLoss(scheduleType), [scheduleType]);

    const yMax = 1.05;
    const yMin = 0;
    const xScale = (t: number) => PAD.left + (t / T_MAX) * PW;
    const yScale = (v: number) => PAD.top + PH - ((v - yMin) / (yMax - yMin)) * PH;

    const points = losses.slice(0, epoch + 1).map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    const currentLoss = losses[epoch] ?? losses[losses.length - 1];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <rect x={PAD.left} y={PAD.top} width={PW} height={PH} fill="#f8fafc" stroke="#e2e8f0" />

            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((v, i) => (
                <line key={i} x1={PAD.left} y1={yScale(v)} x2={PAD.left + PW} y2={yScale(v)}
                    stroke="#e2e8f0" strokeWidth={0.5} />
            ))}

            {/* Loss line */}
            {points && (
                <polyline points={points} fill="none" stroke={sched.color} strokeWidth={2} opacity={0.9} />
            )}

            {/* Cursor */}
            {epoch > 0 && (
                <>
                    <line x1={xScale(epoch)} y1={PAD.top} x2={xScale(epoch)} y2={PAD.top + PH}
                        stroke={sched.color} strokeWidth={1} strokeDasharray="3,3" opacity={0.6} />
                    <circle
                        cx={xScale(epoch)} cy={yScale(currentLoss)} r={5}
                        fill={sched.color} stroke="#fff" strokeWidth={2}
                    />
                    <text x={xScale(epoch) + 6} y={yScale(currentLoss) - 6}
                        fontSize={9} fill={sched.color} fontWeight="bold">
                        L={currentLoss.toFixed(4)}
                    </text>
                </>
            )}

            <text x={PAD.left + PW / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">Epoch (t)</text>
            <text x={12} y={PAD.top + PH / 2} textAnchor="middle" fontSize={10} fill="#64748b"
                transform={`rotate(-90, 12, ${PAD.top + PH / 2})`}>Loss</text>

            {[0, 0.5, 1.0].map((v, i) => (
                <text key={i} x={PAD.left - 4} y={yScale(v) + 4} textAnchor="end" fontSize={8} fill="#94a3b8">
                    {v.toFixed(1)}
                </text>
            ))}
            {[0, 25, 50, 75, 100].map((v, i) => (
                <text key={i} x={xScale(v)} y={PAD.top + PH + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">
                    {v}
                </text>
            ))}
        </svg>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LearningRateLab() {
    const [schedule, setSchedule] = useState<ScheduleType>("cosine");
    const [epoch, setEpoch] = useState(50);

    const sched = SCHEDULES[schedule];
    const currentLR = sched.compute(epoch, T_MAX, ETA0);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">Learning Rate Schedule Explorer</h3>
            <p className="text-sm text-slate-600 mb-4">
                Compare how different schedules shape the learning rate — and the resulting loss — over training.
            </p>

            {/* Schedule selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(SCHEDULES) as ScheduleType[]).map(k => (
                    <button
                        key={k}
                        onClick={() => setSchedule(k)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${schedule === k
                            ? 'text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
                            }`}
                        style={schedule === k ? { backgroundColor: SCHEDULES[k].color } : {}}
                    >
                        {SCHEDULES[k].name}
                    </button>
                ))}
            </div>

            <p className="text-xs text-slate-500 mb-3 italic">{sched.description}</p>

            {/* LR Plot */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                <div className="text-xs text-slate-400 font-semibold px-3 pt-2">Learning Rate Schedule</div>
                <Plot scheduleType={schedule} epoch={epoch} />
            </div>

            {/* Loss Plot */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-4">
                <div className="text-xs text-slate-400 font-semibold px-3 pt-2">Simulated Loss Curve</div>
                <LossPlot scheduleType={schedule} epoch={epoch} />
            </div>

            {/* Epoch slider */}
            <div className="mt-2">
                <label className="text-xs text-slate-500 font-semibold">Epoch: {epoch}</label>
                <input type="range" min={0} max={T_MAX} value={epoch}
                    onChange={e => setEpoch(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 mt-1" />
                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                    <span>0</span><span>50</span><span>100</span>
                </div>
            </div>

            {/* Current LR badge */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    η at t={epoch}: {currentLR.toFixed(5)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    η₀ = {ETA0}
                </span>
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
                <strong>Try it:</strong> Scrub the epoch slider and switch schedules to see how each one
                shapes ηₜ over time. Notice how <em>warm restarts</em> periodically spike the rate,
                potentially escaping shallow local minima.
            </div>
        </div>
    );
}
