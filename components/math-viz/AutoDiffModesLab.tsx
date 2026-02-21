"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, SkipForward, ArrowRight, Activity, ArrowLeft } from 'lucide-react';

export default function AutoDiffModesLab() {
    // We visualize f(x1, x2) = sin(x1) + x1 * x2^2
    const [x1, setX1] = useState(1.0);
    const [x2, setX2] = useState(2.0);
    const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
    const [step, setStep] = useState(0);

    // Forward Computations (Primal variables)
    const z1 = Math.sin(x1);
    const z2 = x1;
    const z3 = Math.pow(x2, 2);
    const z4 = z2 * z3; // x1 * x2^2
    const f = z1 + z4;  // sin(x1) + x1 * x2^2

    // Target for Forward Mode (Derivative w.r.t x1)
    const dot_x1 = 1;
    const dot_x2 = 0;
    const dot_z1 = Math.cos(x1) * dot_x1; // dz1/dx1
    const dot_z2 = dot_x1;                // dz2/dx1 = 1
    const dot_z3 = 2 * x2 * dot_x2;       // dz3/dx1 = 0
    const dot_z4 = dot_z2 * z3 + z2 * dot_z3; // d(x1*x2^2)/dx1
    const dot_f = dot_z1 + dot_z4;        // df/dx1 = cos(x1) + x2^2

    // Targets for Reverse Mode (Adjoints bar_z)
    const bar_f = 1;
    const bar_z1 = bar_f * 1;
    const bar_z4 = bar_f * 1;
    const bar_z2 = bar_z4 * z3;   // bar_f * \partial(z2*z3)/\partial z2
    const bar_z3 = bar_z4 * z2;   // bar_f * \partial(z2*z3)/\partial z3
    const bar_x1 = bar_z1 * Math.cos(x1) + bar_z2 * 1; // df/dx1
    const bar_x2 = bar_z3 * (2 * x2);                  // df/dx2

    const maxSteps = mode === 'forward' ? 4 : 4;

    useEffect(() => {
        setStep(0); // Reset animation step when mode changes
    }, [mode]);

    const handleNextStep = () => {
        if (step < maxSteps) setStep(s => s + 1);
    };

    const handleReset = () => {
        setStep(0);
    };

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 flex justify-between items-center z-20 relative">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Activity className="text-cyan-400" size={20} />
                        AutoDiff Mechanism
                    </h3>
                    <p className="text-slate-400 text-sm font-mono">f(x₁, x₂) = sin(x₁) + x₁ x₂²</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-slate-800 p-1 rounded-full border border-slate-700">
                    <button
                        onClick={() => setMode('forward')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'forward' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                        Forward Mode (x₁)
                    </button>
                    <button
                        onClick={() => setMode('reverse')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mode === 'reverse' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                        Reverse Mode
                    </button>
                </div>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-2 gap-6 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 z-20 relative">
                <div className="flex flex-col">
                    <label className="text-xs text-slate-300 font-semibold mb-2">Input x₁ (radians)</label>
                    <input type="range" min="0" max="6.28" step="0.1" value={x1} onChange={(e) => { setX1(Number(e.target.value)); setStep(0); }} className="accent-slate-400" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{x1.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs text-slate-300 font-semibold mb-2">Input x₂</label>
                    <input type="range" min="-5" max="5" step="0.1" value={x2} onChange={(e) => { setX2(Number(e.target.value)); setStep(0); }} className="accent-slate-400" />
                    <span className="text-slate-200 mt-1 font-mono text-sm">{x2.toFixed(2)}</span>
                </div>
            </div>

            {/* Graph Visualization */}
            <div className="flex-1 relative bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden py-10">

                {/* Visualizing Edges with SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Layer 1 to 2 */}
                    <path d="M 15% 30% L 35% 20%" stroke={mode === 'forward' && step >= 1 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 4 ? "4 4" : ""} fill="none" className="transition-all duration-500" />
                    <path d="M 15% 30% L 35% 50%" stroke={mode === 'forward' && step >= 1 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 4 ? "4 4" : ""} fill="none" className="transition-all duration-500" />
                    <path d="M 15% 70% L 35% 80%" stroke={mode === 'forward' && step >= 1 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 3 ? "4 4" : ""} fill="none" className="transition-all duration-500" />

                    {/* Layer 2 to 3 */}
                    <path d="M 35% 50% L 60% 65%" stroke={mode === 'forward' && step >= 2 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 3 ? "4 4" : ""} fill="none" className="transition-all duration-500" />
                    <path d="M 35% 80% L 60% 65%" stroke={mode === 'forward' && step >= 2 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 3 ? "4 4" : ""} fill="none" className="transition-all duration-500" />

                    {/* Layer 3 to Out */}
                    <path d="M 35% 20% L 80% 50%" stroke={mode === 'forward' && step >= 3 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 2 ? "4 4" : ""} fill="none" className="transition-all duration-500" />
                    <path d="M 60% 65% L 80% 50%" stroke={mode === 'forward' && step >= 3 ? "#0ea5e9" : "#475569"} strokeWidth="2" strokeDasharray={mode === 'reverse' && step >= 2 ? "4 4" : ""} fill="none" className="transition-all duration-500" />
                </svg>

                {/* Nodes Layout */}
                <div className="absolute inset-0 z-10 font-mono text-sm w-full h-full">

                    {/* Input x1 */}
                    <div className="absolute left-[15%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-500 flex items-center justify-center shadow-lg pointer-events-auto cursor-help">
                            <span className="text-slate-300 font-bold text-lg">x₁</span>
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            <div className="text-slate-400 font-bold mb-1">Val: {x1.toFixed(2)}</div>
                            {mode === 'forward' && step >= 0 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded animate-pulse">ḃ x₁ = {dot_x1}</div>}
                            {mode === 'reverse' && step >= 4 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded animate-pulse">x̄₁ = {bar_x1.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Input x2 */}
                    <div className="absolute left-[15%] top-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-500 flex items-center justify-center shadow-lg pointer-events-auto cursor-help">
                            <span className="text-slate-300 font-bold text-lg">x₂</span>
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            <div className="text-slate-400 font-bold mb-1">Val: {x2.toFixed(2)}</div>
                            {mode === 'forward' && step >= 0 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded -mt-2">ḃ x₂ = {dot_x2}</div>}
                            {mode === 'reverse' && step >= 4 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded animate-pulse">x̄₂ = {bar_x2.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Node z1 = sin(x1) */}
                    <div className="absolute left-[35%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500 flex flex-col items-center justify-center shadow-lg pointer-events-auto cursor-help relative">
                            <span className="text-indigo-300 font-bold text-sm">sin</span>
                            <span className="text-[10px] text-slate-500">z₁</span>
                        </div>
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs tracking-wider z-20 w-max pointer-events-none">
                            <span className="text-indigo-300">Val:</span> {z1.toFixed(2)}
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            {mode === 'forward' && step >= 1 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded animate-pulse">ḃ z₁ = {dot_z1.toFixed(3)}</div>}
                            {mode === 'reverse' && step >= 3 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded">z̄₁ = {bar_z1.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Node z2 = x1 (Pass-through to maintain tree structure easily) */}
                    <div className="absolute left-[35%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500 flex flex-col items-center justify-center shadow-lg pointer-events-auto cursor-help relative group-hover:bg-slate-700 transition-colors">
                            <span className="text-[10px] text-slate-500">z₂=x₁</span>
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            {mode === 'forward' && step >= 1 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded">ḃ z₂ = {dot_z2.toFixed(3)}</div>}
                            {mode === 'reverse' && step >= 3 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded">z̄₂ = {bar_z2.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Node z3 = x2^2 */}
                    <div className="absolute left-[35%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-indigo-500 flex flex-col items-center justify-center shadow-lg pointer-events-auto cursor-help relative group-hover:bg-slate-700 transition-colors">
                            <span className="text-indigo-300 font-bold text-[11px]">(·)²</span>
                            <span className="text-[10px] text-slate-500">z₃</span>
                        </div>
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs tracking-wider z-20 w-max pointer-events-none">
                            <span className="text-indigo-300">Val:</span> {z3.toFixed(2)}
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            {mode === 'forward' && step >= 1 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded animate-pulse">ḃ z₃ = {dot_z3.toFixed(3)}</div>}
                            {mode === 'reverse' && step >= 3 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded">z̄₃ = {bar_z3.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Node z4 = z2 * z3 (Multiplying x1 * x2^2) */}
                    <div className="absolute left-[60%] top-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-violet-500 flex flex-col items-center justify-center shadow-lg pointer-events-auto cursor-help relative">
                            <span className="text-violet-300 font-bold text-lg">×</span>
                            <span className="text-[10px] text-slate-500">z₄</span>
                        </div>
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs tracking-wider z-20 w-max pointer-events-none">
                            <span className="text-violet-300">Val:</span> {z4.toFixed(2)}
                        </div>
                        <div className="absolute top-full mt-2 w-max text-center">
                            {mode === 'forward' && step >= 2 && <div className="text-sky-400 text-xs bg-sky-950/50 px-2 rounded animate-pulse">ḃ z₄ = {dot_z4.toFixed(3)}</div>}
                            {mode === 'reverse' && step >= 2 && <div className="text-rose-400 text-xs bg-rose-950/50 px-2 rounded animate-pulse">z̄₄ = {bar_z4.toFixed(3)}</div>}
                        </div>
                    </div>

                    {/* Output Node f = z1 + z4 */}
                    <div className="absolute left-[80%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group">
                        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] pointer-events-auto cursor-help relative">
                            <span className="text-emerald-400 font-bold text-lg">+</span>
                            <span className="text-[10px] text-slate-500 font-bold mt-1">f</span>
                        </div>
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-3 py-1 rounded-lg text-xs tracking-wider z-20 w-max pointer-events-none">
                            <span className="text-emerald-400">Total f:</span> {f.toFixed(2)}
                        </div>
                        <div className="absolute top-full mt-3 w-max text-center">
                            {mode === 'forward' && step >= 3 && <div className="text-sky-400 font-bold bg-sky-950 px-3 py-1 rounded animate-pulse border border-sky-800 shadow-lg">df/dx₁ = {dot_f.toFixed(3)}</div>}
                            {mode === 'reverse' && step >= 1 && <div className="text-rose-400 text-xs bg-rose-950 px-2 rounded mb-1 animate-pulse">f̄ = 1.000</div>}
                        </div>
                    </div>
                </div>

            </div>

            {/* Stepper Controls Bottom */}
            <div className="mt-6 flex justify-between items-center bg-slate-800/80 p-4 rounded-xl border border-slate-700 z-20 relative">
                <div className="text-sm font-mono text-slate-400">
                    Step: <span className="text-white font-bold">{step} / {maxSteps}</span>
                </div>

                <div className="flex-1 px-8 text-center text-sm font-medium">
                    {mode === 'forward' && step === 0 && <span className="text-slate-400">1. Initialize inputs for ∂/∂x₁</span>}
                    {mode === 'forward' && step === 1 && <span className="text-sky-400">2. Compute derivatives of z₁, z₂, z₃ w.r.t x₁</span>}
                    {mode === 'forward' && step === 2 && <span className="text-sky-400">3. Compute derivative of z₄ (Product Rule) w.r.t x₁</span>}
                    {mode === 'forward' && step === 3 && <span className="text-emerald-400 font-bold">4. Final output: Sum gradients df/dx₁</span>}

                    {mode === 'reverse' && step === 0 && <span className="text-slate-400">1. Initialize reverse pass</span>}
                    {mode === 'reverse' && step === 1 && <span className="text-rose-400">2. Seed output adjoint: f̄ = 1</span>}
                    {mode === 'reverse' && step === 2 && <span className="text-rose-400">3. Propagate to z₄ and z₁</span>}
                    {mode === 'reverse' && step === 3 && <span className="text-rose-400">4. Propagate to z₃ and z₂ via Product Rule logic</span>}
                    {mode === 'reverse' && step === 4 && <span className="text-emerald-400 font-bold">5. Aggregate adjoints at Inputs!</span>}
                </div>

                <div className="flex gap-2">
                    <button onClick={handleReset} className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" title="Reset">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={handleNextStep}
                        disabled={step >= maxSteps}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all ${step >= maxSteps ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : mode === 'forward' ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg'}`}
                    >
                        {mode === 'forward' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                        Step {mode === 'forward' ? 'Forward' : 'Backward'}
                    </button>
                </div>
            </div>

        </div>
    );
}
