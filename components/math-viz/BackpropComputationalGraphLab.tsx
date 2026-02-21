"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

export default function BackpropComputationalGraphLab() {
    // 1-Hidden Layer Network Simulation
    // x -> W1 -> z1 -> ReLU -> h -> W2 -> y -> L
    const [x, setX] = useState(2.0);
    const [w1, setW1] = useState(1.5);
    const [w2, setW2] = useState(-0.5);
    const [yTarget, setYTarget] = useState(1.0);

    // Forward Pass
    const z1 = w1 * x;
    const h = Math.max(0, z1); // ReLU
    const y = w2 * h;
    const loss = 0.5 * Math.pow(y - yTarget, 2);

    // Backward Pass
    const dL_dy = y - yTarget;
    const dy_dh = w2;
    const dL_dh = dL_dy * dy_dh;
    const dh_dz1 = z1 > 0 ? 1 : 0; // ReLU derivative
    const dL_dz1 = dL_dh * dh_dz1; // delta^(1)

    const dL_dw2 = dL_dy * h;
    const dL_dw1 = dL_dz1 * x;

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Layers className="text-sky-400" size={20} />
                        Computational Graph Flow
                    </h3>
                    <p className="text-slate-400 text-sm">Visualizing the Chain Rule across passes.</p>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-slate-400 text-xs uppercase tracking-wider">Total Loss (MSE)</span>
                    <span className="text-2xl font-mono text-rose-400 font-bold">{loss.toFixed(4)}</span>
                </div>
            </div>

            {/* Network Controls */}
            <div className="grid grid-cols-4 gap-4 mb-10 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                <div className="flex flex-col">
                    <label className="text-xs text-sky-400 font-semibold mb-2">Input x</label>
                    <input type="range" min="-5" max="5" step="0.1" value={x} onChange={(e) => setX(Number(e.target.value))} className="accent-sky-500" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{x.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-indigo-400 font-semibold mb-2">Weight W₁</label>
                    <input type="range" min="-3" max="3" step="0.1" value={w1} onChange={(e) => setW1(Number(e.target.value))} className="accent-indigo-500" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{w1.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-violet-400 font-semibold mb-2">Weight W₂</label>
                    <input type="range" min="-3" max="3" step="0.1" value={w2} onChange={(e) => setW2(Number(e.target.value))} className="accent-violet-500" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{w2.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-emerald-400 font-semibold mb-2">Target ŷ</label>
                    <input type="range" min="-5" max="5" step="0.1" value={yTarget} onChange={(e) => setYTarget(Number(e.target.value))} className="accent-emerald-500" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{yTarget.toFixed(2)}</span>
                </div>
            </div>

            {/* The Graph Layout */}
            <div className="flex-1 relative bg-slate-800/30 rounded-2xl border border-slate-700/50 flex flex-col justify-center overflow-hidden">

                {/* Connection Lines (Forward Map) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Forward Pass Lines (Blue) */}
                    <path d="M 12% 50% L 35% 50%" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-40" />
                    <path d="M 35% 50% L 65% 50%" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-40" />
                    <path d="M 65% 50% L 88% 50%" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-40" />

                    {/* Gradient Lines (Red, curving below) */}
                    <path d="M 88% 55% Q 76% 80% 65% 55%" stroke="#f43f5e" strokeWidth="2" fill="none" className="opacity-60" markerEnd="url(#arrow-red)" />
                    <path d="M 65% 55% Q 50% 80% 35% 55%" stroke="#f43f5e" strokeWidth="2" fill="none" className="opacity-60" markerEnd="url(#arrow-red)" />

                    <defs>
                        <marker id="arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse">
                            <path d="M 0 0 L 6 3 L 0 6 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                </svg>

                {/* Nodes Container */}
                <div className="absolute inset-0 flex items-center justify-between px-8 z-10 font-mono text-sm">

                    {/* Node 1: Input x */}
                    <div className="flex flex-col items-center group relative">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 flex flex-col items-center justify-center shadow-lg group-hover:border-sky-500 transition-colors">
                            <span className="text-sky-300 font-bold text-lg">x</span>
                        </div>
                        <div className="mt-3 text-sky-400 font-bold">{x.toFixed(2)}</div>
                    </div>

                    {/* Node 2: Hidden h */}
                    <div className="flex flex-col items-center group relative">
                        <div className="absolute -top-16 text-center w-40 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-2 rounded border border-slate-700 pointer-events-none">
                            <div className="text-xs text-sky-300">z₁ = W₁*x = {z1.toFixed(2)}</div>
                            <div className="text-xs text-sky-400 mt-1">h = ReLU(z₁)</div>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-indigo-500 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <span className="text-indigo-300 font-bold text-lg mb-1">h</span>
                            <span className="text-[10px] text-slate-400 font-sans tracking-wide">ReLU</span>
                        </div>
                        <div className="mt-3 text-indigo-400 font-bold">{h.toFixed(2)}</div>

                        {/* Backprop Gradients Box below */}
                        <div className="absolute top-32 w-48 bg-rose-950/40 border border-rose-900 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-[10px] text-rose-300 font-sans mb-1">Backprop to W₁</span>
                            <div className="text-rose-400 text-xs">δ₁ = (y-ŷ)*W₂*σ'(z₁)</div>
                            <div className="text-rose-400 font-bold mt-1 text-[11px]">∂L/∂W₁ = {dL_dw1.toFixed(4)}</div>
                        </div>
                    </div>

                    {/* Node 3: Output y */}
                    <div className="flex flex-col items-center group relative">
                        <div className="absolute -top-12 text-center w-32 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 p-2 rounded border border-slate-700 pointer-events-none">
                            <div className="text-xs text-violet-300">y = W₂*h</div>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-violet-500 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                            <span className="text-violet-300 font-bold text-lg">y</span>
                        </div>
                        <div className="mt-3 text-violet-400 font-bold">{y.toFixed(2)}</div>

                        {/* Backprop Gradients Box below */}
                        <div className="absolute top-32 w-48 bg-rose-950/40 border border-rose-900 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-[10px] text-rose-300 font-sans mb-1">Backprop to W₂</span>
                            <div className="text-rose-400 text-xs">∂L/∂y = (y-ŷ) = {dL_dy.toFixed(2)}</div>
                            <div className="text-rose-400 font-bold mt-1 text-[11px]">∂L/∂W₂ = {dL_dw2.toFixed(4)}</div>
                        </div>
                    </div>

                    {/* Node 4: Loss L */}
                    <div className="flex flex-col items-center group relative">
                        <div className="w-16 h-16 rounded bg-slate-800 border-2 border-rose-500 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)] rotate-45 group-hover:scale-110 transition-transform">
                            <span className="text-rose-300 font-bold text-lg -rotate-45">L</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Legend Footer */}
            <div className="mt-4 flex justify-between items-center text-xs px-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0 border-t-2 border-sky-500 border-dashed"></div>
                        <span className="text-sky-300 font-medium">Forward Pass (Activations)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-0 border-t-2 border-rose-500"></div>
                        <span className="text-rose-400 font-medium">Backward Pass (Gradients)</span>
                    </div>
                </div>
                <div className="text-slate-500 italic">Hover nodes for internal equations</div>
            </div>

        </div>
    );
}
