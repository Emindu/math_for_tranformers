"use client";

import React, { useState } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   D₃ Symmetry Group Lab — pure SVG, no Three.js
   Shows the 6 elements of the dihedral group D₃ acting on an equilateral
   triangle with coloured vertices.
   ──────────────────────────────────────────────────────────────────────────── */

type Perm = [number, number, number];

/* Fixed slot positions (top, right, left) in SVG */
const SLOT_POS: [number, number][] = [
    [150, 32],   // slot 0 — top
    [268, 212],  // slot 1 — bottom-right
    [32,  212],  // slot 2 — bottom-left
];

const VERTEX_COLORS = ['#ef4444', '#3b82f6', '#22c55e'];
const VERTEX_LABELS = ['1', '2', '3'];

/* D₃ operations: perm[slot] = which original vertex is at that slot after op */
const OPERATIONS: { id: string; label: string; perm: Perm; desc: string }[] = [
    { id: 'e',  label: 'e',   perm: [0, 1, 2], desc: 'Identity — do nothing' },
    { id: 'r',  label: 'r',   perm: [2, 0, 1], desc: 'Rotate 120° CCW' },
    { id: 'r2', label: 'r²',  perm: [1, 2, 0], desc: 'Rotate 240° CCW' },
    { id: 's1', label: 's₁',  perm: [0, 2, 1], desc: 'Reflect over top axis' },
    { id: 's2', label: 's₂',  perm: [2, 1, 0], desc: 'Reflect over right axis' },
    { id: 's3', label: 's₃',  perm: [1, 0, 2], desc: 'Reflect over left axis' },
];

/* Compose: apply nextOp on top of the current state */
function applyOp(current: Perm, op: Perm): Perm {
    return [current[op[0]], current[op[1]], current[op[2]]] as Perm;
}

function findLabel(p: Perm): string {
    const op = OPERATIONS.find(o => o.perm.every((v, i) => v === p[i]));
    return op ? op.label : '?';
}

export default function SymmetryGroupLab() {
    const [state, setState] = useState<Perm>([0, 1, 2]);
    const [lastOp, setLastOp] = useState<{ label: string; desc: string }>({ label: 'e', desc: 'Identity — do nothing' });
    const [history, setHistory] = useState<string[]>([]);

    const handleOp = (op: typeof OPERATIONS[0]) => {
        setState(prev => applyOp(prev, op.perm));
        setLastOp({ label: op.label, desc: op.desc });
        setHistory(prev => [...prev.slice(-4), op.label]);
    };

    const reset = () => {
        setState([0, 1, 2]);
        setLastOp({ label: 'e', desc: 'Identity — do nothing' });
        setHistory([]);
    };

    const slotNames = ['top', 'right', 'left'];

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">

            {/* ── Left panel ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">D₃ Symmetry Group</h3>
                    <p className="text-xs text-slate-500 mt-1">Apply operations to explore how symmetries compose.</p>
                </div>

                {/* Operation buttons */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Apply Operation</p>
                    <div className="grid grid-cols-3 gap-2">
                        {OPERATIONS.map(op => (
                            <button
                                key={op.id}
                                onClick={() => handleOp(op)}
                                className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-3 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50"
                            >
                                <span className="text-base font-bold text-slate-700">{op.label}</span>
                                <span className="text-[9px] text-slate-400 mt-0.5">
                                    {op.id === 'e' ? 'identity' : op.id.startsWith('r') ? 'rotation' : 'reflect'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Current vertex state */}
                <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Vertex State</p>
                    <div className="space-y-1.5">
                        {slotNames.map((name, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-10">{name}:</span>
                                <span
                                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ background: VERTEX_COLORS[state[i]] }}
                                >
                                    {VERTEX_LABELS[state[i]]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 border-t border-indigo-200 pt-2">
                        <p className="text-xs text-indigo-700">
                            Net: <strong>{findLabel(state)}</strong>
                        </p>
                    </div>
                </div>

                {/* History */}
                {history.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">History</p>
                        <p className="text-sm font-mono text-slate-600">{history.join(' → ')}</p>
                        <p className="text-xs text-slate-400 mt-1">Net: <strong className="text-slate-600">{findLabel(state)}</strong></p>
                    </div>
                )}

                <button
                    onClick={reset}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                    Reset to Identity
                </button>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-1">Last applied</p>
                    <p className="text-sm font-bold text-amber-800">{lastOp.label}</p>
                    <p className="text-xs text-amber-700 mt-1">{lastOp.desc}</p>
                </div>
            </div>

            {/* ── SVG canvas ── */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[300px]">
                <svg width="300" height="260" viewBox="0 0 300 260" style={{ display: 'block' }}>

                    {/* Triangle fill */}
                    <polygon
                        points={SLOT_POS.map(([x, y]) => `${x},${y}`).join(' ')}
                        fill="#eef2ff"
                        stroke="#818cf8"
                        strokeWidth={2}
                    />

                    {/* Vertex circles */}
                    {slotNames.map((_, slotIdx) => {
                        const [px, py] = SLOT_POS[slotIdx];
                        const orig = state[slotIdx];
                        return (
                            <g key={slotIdx}>
                                <circle cx={px} cy={py} r={22} fill={VERTEX_COLORS[orig]} stroke="white" strokeWidth={3} />
                                <text x={px} y={py} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={14} fontWeight="bold">
                                    {VERTEX_LABELS[orig]}
                                </text>
                            </g>
                        );
                    })}

                    {/* Centroid label */}
                    <text x={150} y={152} textAnchor="middle" dominantBaseline="middle" fill="#818cf8" fontSize={12} fontStyle="italic">D₃</text>

                    {/* Legend */}
                    <g transform="translate(6,228)">
                        <rect width={288} height={26} rx={5} fill="white" stroke="#e2e8f0" />
                        {VERTEX_COLORS.map((c, i) => (
                            <g key={i} transform={`translate(${10 + i * 93}, 4)`}>
                                <circle cx={8} cy={9} r={7} fill={c} />
                                <text x={19} y={13} fill="#475569" fontSize={10} fontWeight="600">Vertex {i + 1}</text>
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        </div>
    );
}
