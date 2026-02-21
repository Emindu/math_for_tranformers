"use client";

import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function DataProcessingLab() {
    // Noise parameters (loss of information)
    const [noiseY, setNoiseY] = useState(0.2); // Noise from X to Y
    const [noiseZ, setNoiseZ] = useState(0.4); // Noise from Y to Z

    // Simple multiplicative model for information structural visualization
    // Max information = 1.0 (100% bits)
    const mutualXY = 1.0 * (1 - noiseY);
    const mutualYZ = 1.0 * (1 - noiseZ);
    // Markov chain implies I(X;Z) <= I(X;Y)
    const mutualXZ = mutualXY * (1 - noiseZ);

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">

            <div className="mb-6 z-10">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <ShieldAlert className="text-amber-400" size={20} />
                    Data Processing Inequality
                </h3>
                <p className="text-slate-400 text-sm">Visualizing information loss in a Markov Chain (X → Y → Z)</p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 z-10">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                            Noise (X → Y)
                        </label>
                        <span className="text-amber-400 font-mono text-sm">{Math.round(noiseY * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="0.99" step="0.01"
                        value={noiseY}
                        onChange={(e) => setNoiseY(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                    />
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-slate-300 text-[11px] font-bold uppercase tracking-wider">
                            Noise (Y → Z)
                        </label>
                        <span className="text-amber-400 font-mono text-sm">{Math.round(noiseZ * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="0.99" step="0.01"
                        value={noiseZ}
                        onChange={(e) => setNoiseZ(parseFloat(e.target.value))}
                        className="w-full accent-amber-500"
                    />
                </div>
            </div>

            {/* Visualizer Area */}
            <div className="flex-1 flex flex-col justify-center items-center relative py-12">

                {/* The Chain */}
                <div className="flex items-center justify-between w-full max-w-lg relative z-10">

                    {/* Node X */}
                    <div className="relative flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] z-10">
                            <span className="text-white font-bold text-2xl font-mono">X</span>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-blue-200 font-mono font-bold">1.00</span>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Original Source</div>
                        </div>
                    </div>

                    {/* Arrow X -> Y */}
                    <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            {/* Fill representing passed info */}
                            <div
                                className="h-full bg-amber-500 transition-all duration-300 ease-in-out"
                                style={{ width: `${mutualXY * 100}%` }}
                            />
                        </div>
                        <ArrowRight className="absolute text-slate-600 top-1/2 -translate-y-1/2" size={24} />
                    </div>

                    {/* Node Y */}
                    <div className="relative flex flex-col items-center">
                        {/* Opacity mimics information retained */}
                        <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 border-2 border-purple-400 flex items-center justify-center z-10 transition-all duration-300 ease-in-out"
                            style={{ opacity: 0.2 + (mutualXY * 0.8), boxShadow: `0 0 ${mutualXY * 30}px rgba(168,85,247,0.5)` }}
                        >
                            <span className="text-white font-bold text-2xl font-mono">Y</span>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-purple-300 font-mono font-bold tracking-wider">{mutualXY.toFixed(2)}</span>
                            <div className="text-[10px] text-purple-400/70 uppercase tracking-widest mt-1 bg-purple-900/40 px-2 py-0.5 rounded">I(X;Y)</div>
                        </div>
                    </div>

                    {/* Arrow Y -> Z */}
                    <div className="flex-1 flex flex-col items-center justify-center relative px-2">
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                            {/* Fill representing passed info */}
                            <div
                                className="h-full bg-rose-500 transition-all duration-300 ease-in-out"
                                style={{ width: `${mutualYZ * 100}%` }} // Thickness based on Y to Z channel capacity
                            />
                        </div>
                        <ArrowRight className="absolute text-slate-600 top-1/2 -translate-y-1/2" size={24} />
                    </div>

                    {/* Node Z */}
                    <div className="relative flex flex-col items-center">
                        <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 border-2 border-pink-400 flex items-center justify-center z-10 transition-all duration-300 ease-in-out"
                            style={{ opacity: 0.2 + (mutualXZ * 0.8), boxShadow: `0 0 ${mutualXZ * 30}px rgba(236,72,153,0.5)` }}
                        >
                            <span className="text-white font-bold text-2xl font-mono">Z</span>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-pink-300 font-mono font-bold tracking-wider">{mutualXZ.toFixed(2)}</span>
                            <div className="text-[10px] text-pink-400/70 uppercase tracking-widest mt-1 bg-pink-900/40 px-2 py-0.5 rounded">I(X;Z)</div>
                        </div>
                    </div>
                </div>

                {/* The "Inequality" Arc connecting X to Z directly */}
                <svg className="absolute w-full h-full pointer-events-none top-0 left-0">
                    <path
                        d="M 120, 160 Q 250, 40 380, 160" // Adjusted for approx positions
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="opacity-50"
                    />
                </svg>

            </div>

            {/* Footer Alert */}
            <div className="bg-slate-800/80 mt-auto p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                <div className="bg-slate-900 p-2 rounded-lg">
                    <Cpu className="text-slate-400" size={20} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-mono text-emerald-400 font-bold">
                        I(X; Z) ≤ I(X; Y)
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Information cannot increase through processing. The final representation <span className="text-pink-300 font-mono tracking-tighter">Z</span> can never know more about the source <span className="text-blue-300 font-mono tracking-tighter">X</span> than the intermediate state <span className="text-purple-300 font-mono tracking-tighter">Y</span> does. ({mutualXZ.toFixed(2)} ≤ {mutualXY.toFixed(2)})
                    </p>
                </div>
            </div>

        </div>
    );
}
