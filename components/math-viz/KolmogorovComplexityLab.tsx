"use client";

import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, Binary, Zap } from 'lucide-react';

export default function KolmogorovComplexityLab() {
    // We visualize compressibility. 
    // Two modes: Pattern (Low K) vs Random (High K)
    const [mode, setMode] = useState<'pattern' | 'random'>('pattern');
    const [stringLength, setStringLength] = useState(64);

    const [patternOutput, setPatternOutput] = useState('');
    const [randomOutput, setRandomOutput] = useState('');

    useEffect(() => {
        // Generate a patterned string (e.g. 010101...)
        let pat = '';
        const patternUnit = '01';
        for (let i = 0; i < stringLength / 2; i++) {
            pat += patternUnit;
        }
        setPatternOutput(pat);

        // Generate a random string
        let rand = '';
        for (let i = 0; i < stringLength; i++) {
            rand += Math.random() > 0.5 ? '1' : '0';
        }
        setRandomOutput(rand);
    }, [stringLength]);

    const activeString = mode === 'pattern' ? patternOutput : randomOutput;

    // Simulate program length (compression)
    // For pattern: print("01" * N) => size is roughly constant + log(N)
    const patternProgramSize = 15;

    // For random: print("...") => size is roughly N + constant
    const randomProgramSize = stringLength + 10;

    const programSize = mode === 'pattern' ? patternProgramSize : randomProgramSize;

    return (
        <div className="w-full h-full min-h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Binary className="text-indigo-400" size={20} />
                        Compressibility Simulator
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Comparing K(x) for patterned vs random strings</p>
                </div>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setMode('pattern')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${mode === 'pattern' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Patterned
                    </button>
                    <button
                        onClick={() => setMode('random')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${mode === 'random' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Random
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>String Length (n = {stringLength})</span>
                </div>
                <input
                    type="range"
                    min="16"
                    max="256"
                    step="16"
                    value={stringLength}
                    onChange={(e) => setStringLength(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {/* Data Source visual */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 relative overflow-hidden group">
                    <h4 className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-slate-500" />
                        Target Object <span className="text-slate-500 font-mono">x</span>
                    </h4>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm break-all leading-relaxed text-indigo-300 h-[100px] overflow-y-auto custom-scrollbar border border-slate-800 shadow-inner">
                        {activeString}
                    </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-slate-700/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600 shadow-lg flex items-center gap-2 group cursor-pointer hover:bg-slate-600 transition-colors">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-slate-200 text-xs font-bold uppercase tracking-wider">Universal Turing Machine U(p)</span>
                    </div>
                </div>

                {/* Program Size visual */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 relative overflow-hidden">
                    <h4 className="text-slate-300 text-sm font-semibold mb-3 flex items-center gap-2">
                        <Binary size={16} className="text-slate-500" />
                        Shortest Program <span className="text-slate-500 font-mono">p</span>
                    </h4>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm border border-slate-800 shadow-inner min-h-[100px] flex items-center relative overflow-hidden">
                        {mode === 'pattern' ? (
                            <div className="flex flex-col gap-2 w-full text-emerald-400">
                                <div><span className="text-slate-500">for</span> i <span className="text-slate-500">in</span> <span className="text-pink-400">range</span>({stringLength / 2}):</div>
                                <div className="pl-4"><span className="text-slate-500">print</span>(<span className="text-amber-300">"01"</span>)</div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 w-full text-rose-400 overflow-hidden">
                                <div className="truncate w-full"><span className="text-slate-500">print</span>(<span className="text-amber-300">"{activeString.substring(0, 40)}{activeString.length > 40 ? '...' : ''}"</span>)</div>
                            </div>
                        )}

                        {/* Compression bar visualization */}
                        <div className="absolute right-4 top-4 bottom-4 w-12 bg-slate-800 rounded-lg flex flex-col justify-end overflow-hidden border border-slate-700">
                            <div
                                className={`w-full transition-all duration-700 ease-in-out flex flex-col justify-end items-center pb-2 ${mode === 'pattern' ? 'bg-emerald-500/80' : 'bg-rose-500/80'}`}
                                style={{ height: `${Math.min(100, Math.max(10, (programSize / (stringLength + 10)) * 100))}%` }}
                            >
                                <span className="text-[10px] font-bold text-white shadow-sm mt-1">|p|</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                <div>
                    <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Kolmogorov Complexity K(x)</span>
                    <span className="text-white font-mono text-xl">{programSize} <span className="text-slate-500 text-sm">bits</span></span>
                </div>
                <div className="text-right">
                    <span className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Compression Ratio</span>
                    <span className={`font-mono text-xl ${mode === 'pattern' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {(stringLength / programSize).toFixed(2)}x
                    </span>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                    border-radius: 20px;
                }
            `}</style>
        </div >
    );
}
