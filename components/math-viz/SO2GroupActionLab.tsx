"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { RotateCw, MoveRight } from 'lucide-react';

export default function SO2GroupActionLab() {
    const [angleDeg, setAngleDeg] = useState(45);

    // Original vector
    const x1 = 1;
    const x2 = 0;

    // Rotation angle in radians
    const theta = (angleDeg * Math.PI) / 180;

    // Rotated vector
    const y1 = x1 * Math.cos(theta) - x2 * Math.sin(theta);
    const y2 = x1 * Math.sin(theta) + x2 * Math.cos(theta);

    // SVG parameters
    const size = 300;
    const center = size / 2;
    const scale = 100; // 1 unit = 100px

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <RotateCw className="text-rose-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Group Action: <Latex>{'$SO(2)$'}</Latex> on <Latex>{'$\\mathbb{R}^2$'}</Latex></h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Visualize how the continuous rotation group <Latex>{'$SO(2)$'}</Latex> acts on a 2D Euclidean manifold.
                The distance from the origin (radius) is preserved, mapping out an <strong>Orbit</strong> that forms a circle.
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                {/* SVG Visualization */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner relative">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                        {/* Grid & Axes */}
                        <line x1={0} y1={center} x2={size} y2={center} stroke="#e2e8f0" strokeWidth={1} />
                        <line x1={center} y1={0} x2={center} y2={size} stroke="#e2e8f0" strokeWidth={1} />

                        {/* Orbit (Circle trajectory) */}
                        <circle cx={center} cy={center} r={scale} fill="none" stroke="#ffe4e6" strokeWidth={2} strokeDasharray="4 4" />

                        {/* Angle Arc */}
                        <path
                            d={`M ${center + 30} ${center} A 30 30 0 ${angleDeg > 180 ? 1 : 0} 0 ${center + 30 * Math.cos(theta)} ${center - 30 * Math.sin(theta)}`}
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth={2}
                        />
                        {angleDeg > 0 && (
                            <text
                                x={center + 45 * Math.cos(theta / 2)}
                                y={center - 45 * Math.sin(theta / 2)}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                className="text-xs font-bold"
                                fill="#f43f5e"
                            >
                                θ
                            </text>
                        )}

                        {/* Original Vector */}
                        <g>
                            <line
                                x1={center}
                                y1={center}
                                x2={center + x1 * scale}
                                y2={center - x2 * scale}
                                stroke="#94a3b8"
                                strokeWidth={3}
                                strokeLinecap="round"
                            />
                            <circle cx={center + x1 * scale} cy={center - x2 * scale} r={4} fill="#94a3b8" />
                            <text x={center + x1 * scale + 10} y={center - x2 * scale + 5} fill="#64748b" className="text-sm font-bold">x</text>
                        </g>

                        {/* Rotated Vector */}
                        <g>
                            <line
                                x1={center}
                                y1={center}
                                x2={center + y1 * scale}
                                y2={center - y2 * scale}
                                stroke="#e11d48"
                                strokeWidth={3}
                                strokeLinecap="round"
                            />
                            <circle cx={center + y1 * scale} cy={center - y2 * scale} r={5} fill="#e11d48" />
                            <text x={center + y1 * scale + 15} y={center - y2 * scale - 5} fill="#e11d48" className="text-sm font-bold">R_θ(x)</text>
                        </g>
                    </svg>
                </div>

                {/* Controls & Math Info */}
                <div className="w-full md:w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">Rotation Angle <Latex>{'$\\theta$'}</Latex></label>
                            <span className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{angleDeg}°</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={angleDeg}
                            onChange={(e) => setAngleDeg(parseInt(e.target.value))}
                            className="w-full accent-rose-600"
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2">Current Group Action:</p>
                        <div className="flex items-center justify-center gap-2 text-sm font-mono text-slate-800">
                            <div className="flex flex-col gap-1 items-center bg-white p-2 border border-slate-200 rounded">
                                <span>{Math.cos(theta).toFixed(2)}</span>
                                <span>{Math.sin(theta).toFixed(2)}</span>
                            </div>
                            <div className="flex flex-col gap-1 items-center bg-white p-2 border border-slate-200 rounded">
                                <span>{(-Math.sin(theta)).toFixed(2)}</span>
                                <span>{Math.cos(theta).toFixed(2)}</span>
                            </div>
                            <MoveRight className="text-rose-400" size={16} />
                            <div className="flex flex-col gap-1 items-center bg-rose-50 border border-rose-200 p-2 rounded text-rose-800 font-bold">
                                <span>{y1.toFixed(2)}</span>
                                <span>{y2.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r">
                        <strong>Stabilizer:</strong> As long as <Latex>{'$x \\neq 0$'}</Latex>, the only rotation that leaves <Latex>{'$x$'}</Latex> unchanged is <Latex>{'$\\theta = 0$'}</Latex>.
                        Therefore, <Latex>{'$\\text{Stab}(x) = \\{e\\}$'}</Latex>.
                    </div>
                </div>

            </div>
        </div>
    );
}
