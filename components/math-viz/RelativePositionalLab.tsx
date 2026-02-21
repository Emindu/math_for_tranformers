"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import { Ruler, ArrowRight } from 'lucide-react';

export default function RelativePositionalLab() {
    const [shiftConfig, setShiftConfig] = useState(0); // 0 to 4
    const [queryTokenIdx, setQueryTokenIdx] = useState(2); // relative to the original unshifted data

    // Original tokens
    const tokens = ["The", "quick", "brown", "fox", "jumps", "over"];

    // The viewing window has size 10.
    const viewSize = 10;

    // We pad the array based on the shift
    const currentTokens = Array(viewSize).fill(null).map((_, i) => {
        if (i >= shiftConfig && i < shiftConfig + tokens.length) {
            return {
                word: tokens[i - shiftConfig],
                absolutePos: i,
                isData: true,
                originalIdx: i - shiftConfig,
            };
        }
        return {
            word: "[PAD]",
            absolutePos: i,
            isData: false,
            originalIdx: null,
        };
    });

    const currentQueryPos = shiftConfig + queryTokenIdx;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Ruler className="text-pink-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Translational Invariance: Relative vs Absolute Positional Encodings</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Select a target query token and shift the sequence. Observe how <strong>Absolute Positions</strong> change entirely when the sequence shifts, effectively destroying translational invariance.
                However, <strong>Relative Positions</strong> (distances from the query) remain perfectly constant for the actual data tokens, ensuring the attention mechanism responds identically regardless of where the sequence begins.
            </p>

            <div className="flex flex-col gap-6">

                {/* Visualizer Frame */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-inner overflow-x-auto">

                    {/* Viewport */}
                    <div className="flex gap-2 mb-8 relative">
                        {currentTokens.map((t, i) => {
                            const isQuery = i === currentQueryPos;
                            return (
                                <motion.div
                                    key={i}
                                    layout
                                    onClick={() => {
                                        if (t.isData) setQueryTokenIdx(t.originalIdx as number);
                                    }}
                                    className={`
                                        flex flex-col items-center justify-center p-3 w-16 h-16 rounded-lg border-2 transition-all cursor-pointer relative
                                        ${t.isData ? 'bg-white shadow-sm hover:border-pink-300' : 'bg-slate-100 border-dashed border-slate-300 opacity-50'}
                                        ${isQuery ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' : 'border-slate-200'}
                                    `}
                                >
                                    {isQuery && (
                                        <div className="absolute -top-3 bg-pink-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            Query
                                        </div>
                                    )}
                                    <span className={`text-xs font-bold ${isQuery ? 'text-pink-700' : 'text-slate-700'}`}>{t.word}</span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Tracks */}
                    <div className="flex flex-col gap-4">
                        {/* Absolute Track */}
                        <div className="flex items-center">
                            <div className="w-32 flex flex-col">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Absolute</span>
                                <span className="text-[10px] text-slate-400">Position ID</span>
                            </div>
                            <div className="flex gap-2">
                                {currentTokens.map((t, i) => (
                                    <div key={`abs-${i}`} className="w-16 flex items-center justify-center">
                                        <span className={`text-sm font-mono ${t.isData ? 'text-slate-800 font-bold' : 'text-slate-300'}`}>
                                            {t.absolutePos}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Relative Track */}
                        <div className="flex items-center">
                            <div className="w-32 flex flex-col">
                                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Relative</span>
                                <span className="text-[10px] text-pink-400">Distance (<Latex>$j - i$</Latex>)</span>
                            </div>
                            <div className="flex gap-2">
                                {currentTokens.map((t, i) => {
                                    const dist = i - currentQueryPos;
                                    const isQuery = i === currentQueryPos;
                                    return (
                                        <div key={`rel-${i}`} className="w-16 flex items-center justify-center relative">
                                            {/* Distance Arc Visual (only for data tokens) */}
                                            {t.isData && !isQuery && (
                                                <svg className="absolute -top-4 w-full h-4 overflow-visible pointer-events-none" style={{ left: dist < 0 ? '50%' : '-50%' }}>
                                                    <path
                                                        d={`M 0 0 Q ${dist < 0 ? 16 : -16} -10 ${dist < 0 ? 32 : -32} 0`}
                                                        fill="none"
                                                        stroke="rgba(244, 63, 94, 0.2)"
                                                        strokeWidth={2}
                                                    />
                                                </svg>
                                            )}
                                            <span className={`
                                                text-sm font-mono font-bold px-2 py-0.5 rounded
                                                ${!t.isData ? 'text-slate-300' :
                                                    isQuery ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50 text-pink-600 border border-pink-100'
                                                }
                                            `}>
                                                {dist > 0 ? `+${dist}` : dist}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Controls Area */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">Sequence Padding Shift (<Latex>{'$t$'}</Latex>)</label>
                            <span className="font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">+{shiftConfig}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={4}
                            step={1}
                            value={shiftConfig}
                            onChange={(e) => setShiftConfig(parseInt(e.target.value))}
                            className="w-full accent-pink-600"
                        />
                    </div>
                </div>

            </div>

            <div className="p-3 bg-pink-50 border-l-4 border-pink-500 rounded-r-lg text-sm text-pink-900 shadow-sm mt-2">
                <strong>Why it matters:</strong> If a model learns that "brown" is closely related to "fox" by associating <strong>Absolute Position 2</strong> with <strong>Absolute Position 3</strong>, moving the sentence will completely break the model's understanding. By computing attention scores conditionally via the <strong>Relative Distance (+1)</strong> instead, the learned patterns become rotationally and translationally immune.
            </div>
        </div>
    );
}
