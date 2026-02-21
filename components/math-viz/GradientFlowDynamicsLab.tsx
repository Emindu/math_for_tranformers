"use client";

import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

export default function GradientFlowDynamicsLab() {
    const numLayers = 5;

    // Hyperparameters
    const [activation, setActivation] = useState<'sigmoid' | 'relu'>('sigmoid');
    const [weightVar, setWeightVar] = useState<number>(0.8); // Equivalent to average ||W||
    const [applyClipping, setApplyClipping] = useState<boolean>(false);
    const [clipThreshold, setClipThreshold] = useState<number>(1.0);
    const [applyXavier, setApplyXavier] = useState<boolean>(false);

    // Initial Gradient at Output (dL/dy)
    const initialGradient = 1.0;

    const [gradients, setGradients] = useState<number[]>(Array(numLayers).fill(initialGradient));

    useEffect(() => {
        const newGradients = [initialGradient];

        // Effective Weight depending on Xavier
        // Xavier tries to balance variance such that ||W|| ≈ 1 effectively across forward/backward
        const effectiveWeightVar = applyXavier ? 1.0 : weightVar;

        let currentGradient = initialGradient;

        // Propagate backwards (L to 1)
        for (let l = numLayers - 1; l >= 1; l--) {
            // Assume average derivative of activation func
            // Sigmoid: max 0.25, heavily squashes. Let's say average is 0.15
            // ReLU: 1 (if > 0, 0 if < 0). Let's say 0.5 expected value. 
            const actDeriv = activation === 'sigmoid' ? 0.15 : 0.6;

            // Multiply by Jacobian ||W|| * sigma'
            currentGradient = currentGradient * (effectiveWeightVar * actDeriv);

            // Apply Gradient Clipping
            if (applyClipping) {
                if (Math.abs(currentGradient) > clipThreshold) {
                    currentGradient = clipThreshold * (currentGradient / Math.abs(currentGradient));
                }
            }

            newGradients.unshift(currentGradient);
        }

        setGradients(newGradients);
    }, [activation, weightVar, applyClipping, clipThreshold, applyXavier]);

    // Diagnostics
    const finalGrad = Math.abs(gradients[0]);
    const isVanishing = finalGrad < 0.001;
    const isExploding = finalGrad > 10.0 && !applyClipping;

    return (
        <div className="w-full min-h-[600px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 flex justify-between items-start z-20 relative">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Activity className="text-emerald-400" size={20} />
                        Gradient Flow Dynamics
                    </h3>
                    <p className="text-slate-400 text-sm">Visualizing <span className="font-mono text-xs">||∂L/∂W_l||</span> across a {numLayers}-Layer Network</p>
                </div>

                {/* Status Indicator */}
                <div className="flex flex-col items-end">
                    {isVanishing && (
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            <TrendingDown size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Vanishing </span>
                        </div>
                    )}
                    {isExploding && (
                        <div className="flex items-center gap-1 text-rose-400 bg-rose-950 px-3 py-1 rounded-full border border-rose-900">
                            <TrendingUp size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Exploding </span>
                        </div>
                    )}
                    {!isVanishing && !isExploding && (
                        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-900">
                            <CheckCircle2 size={14} />
                            <span className="text-xs font-bold uppercase tracking-wider">Stable</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-6 z-20">
                {/* Base Settings */}
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Architecture</h4>

                    <div className="flex flex-col mb-4">
                        <label className="text-xs text-sky-400 font-semibold mb-2">Activation Func σ(x)</label>
                        <div className="flex bg-slate-900 p-1 rounded-lg">
                            <button onClick={() => setActivation('sigmoid')} className={`flex-1 py-1 text-xs rounded transition-all ${activation === 'sigmoid' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>Sigmoid (Squashes)</button>
                            <button onClick={() => setActivation('relu')} className={`flex-1 py-1 text-xs rounded transition-all ${activation === 'relu' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>ReLU (Linear)</button>
                        </div>
                    </div>

                    <div className="flex flex-col opacity-100 transition-opacity" style={{ opacity: applyXavier ? 0.4 : 1.0, pointerEvents: applyXavier ? 'none' : 'auto' }}>
                        <div className="flex justify-between">
                            <label className="text-xs text-indigo-400 font-semibold mb-2">Avg Weight Norm ||W||</label>
                            <span className="text-xs text-indigo-300 font-mono">{weightVar.toFixed(1)}</span>
                        </div>
                        <input type="range" min="0.1" max="5.0" step="0.1" value={weightVar} onChange={(e) => setWeightVar(Number(e.target.value))} className="accent-indigo-500" />
                        <span className="text-[10px] text-slate-500 mt-1">&gt; 1 can cause explosions</span>
                    </div>
                </div>

                {/* Mitigations */}
                <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-900/50">
                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-1"><ShieldAlert size={14} /> Mitigations</h4>

                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                        <input type="checkbox" checked={applyXavier} onChange={(e) => setApplyXavier(e.target.checked)} className="peer hidden" />
                        <div className="w-5 h-5 rounded border-2 border-slate-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                            {applyXavier && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Apply Xavier Initialization</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group mb-2">
                        <input type="checkbox" checked={applyClipping} onChange={(e) => setApplyClipping(e.target.checked)} className="peer hidden" />
                        <div className="w-5 h-5 rounded border-2 border-slate-600 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-colors">
                            {applyClipping && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Apply Gradient Clipping</span>
                    </label>

                    <div className="flex flex-col opacity-100 transition-opacity pl-8" style={{ opacity: applyClipping ? 1.0 : 0.4, pointerEvents: applyClipping ? 'auto' : 'none' }}>
                        <div className="flex justify-between">
                            <label className="text-[10px] text-slate-400 font-semibold mb-1">Threshold c</label>
                            <span className="text-[10px] text-slate-300 font-mono">{clipThreshold.toFixed(1)}</span>
                        </div>
                        <input type="range" min="0.1" max="5.0" step="0.1" value={clipThreshold} onChange={(e) => setClipThreshold(Number(e.target.value))} className="accent-emerald-500 h-1" />
                    </div>
                </div>
            </div>

            {/* Visualizer Log Scale Chart */}
            <div className="flex-1 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-end relative h-[300px]">

                {/* Log scale lines */}
                <div className="absolute inset-x-0 bottom-6 border-t border-slate-800 border-dashed z-0 flex items-center px-2">
                    <span className="text-[9px] text-slate-600 bg-slate-950 px-1 -translate-y-1/2">0.001 (Vanishing)</span>
                </div>
                <div className="absolute inset-x-0 bottom-[50%] border-t border-slate-800 border-dashed z-0 flex items-center px-2">
                    <span className="text-[9px] text-slate-600 bg-slate-950 px-1 -translate-y-1/2">1.0 (Stable)</span>
                </div>
                <div className="absolute inset-x-0 top-6 border-t border-rose-900/30 border-dashed z-0 flex items-center px-2">
                    <span className="text-[9px] text-rose-900/50 bg-slate-950 px-1 -translate-y-1/2">100.0 (Exploding)</span>
                </div>

                <div className="flex justify-between items-end h-full relative z-10 px-4">
                    {gradients.map((grad, i) => {
                        const layerNum = i + 1;
                        // For visualization, we use heavily compressed logarithmic scale to show tiny vanishing numbers and massive explosions within the same view.
                        // Base height mapping: 1.0 = 50% height.
                        let vizHeight = 50;
                        if (grad > 0) {
                            // mapping log10(grad) to percentage shift from 50
                            const logVal = Math.log10(grad);
                            vizHeight = 50 + (logVal * 15); // Scale arbitrary for display
                        }
                        vizHeight = Math.max(2, Math.min(100, vizHeight)); // clamp

                        const isClipped = applyClipping && grad >= clipThreshold && i !== numLayers - 1;

                        let colorClass = "bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]";
                        if (grad < 0.001) colorClass = "bg-slate-600 shadow-none"; // Vanishing
                        if (grad > 10.0 && !isClipped) colorClass = "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"; // Exploding
                        if (isClipped) colorClass = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] border-t-4 border-emerald-300"; // Clipped

                        return (
                            <div key={`layer-${layerNum}`} className="flex flex-col items-center gap-2 group w-full px-2">
                                <div className="text-[10px] text-slate-400 font-mono absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded">
                                    {grad.toExponential(2)}
                                </div>
                                <div className="w-full flex justify-center items-end h-full">
                                    <div
                                        className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${colorClass}`}
                                        style={{ height: `${vizHeight}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs font-bold text-slate-500 mt-2">
                                    {i === numLayers - 1 ? 'L5 (Out)' : `L${layerNum}`}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="text-center mt-3 text-xs text-slate-500 font-medium">
                Gradients backpropagate from <span className="text-slate-300">Right (Output)</span> to <span className="text-slate-300">Left (Input Layer)</span>.
            </div>

        </div>
    );
}
