"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { Sparkles, MoveRight } from 'lucide-react';

export default function TranslationalInvarianceLab() {
    const [offset, setOffset] = useState(0);

    // Initial sequence data (simulating an image strip or 1D sequence)
    const sequence = [
        { id: 0, val: 0, color: "bg-slate-100" },
        { id: 1, val: 0, color: "bg-slate-100" },
        { id: 2, val: 1, color: "bg-pink-400" },
        { id: 3, val: 1, color: "bg-pink-400" },
        { id: 4, val: 0, color: "bg-slate-100" },
        { id: 5, val: 0, color: "bg-slate-100" },
        { id: 6, val: 0, color: "bg-slate-100" },
        { id: 7, val: 0, color: "bg-slate-100" },
    ];

    // length of the sequence
    const N = sequence.length;

    // Apply translation shift (with wraparound for visualization purposes)
    const shiftedSequence = sequence.map((_, i) => {
        const originalIndex = (i - offset + N) % N;
        return sequence[originalIndex];
    });

    // Convolutional Filter (Edge detector [1, -1])
    const filter = [1, -1];

    // Applying convolution
    const applyFilter = (seq: typeof sequence) => {
        return seq.map((item, i) => {
            if (i === seq.length - 1) return 0; // Padding handling
            return (item.val * filter[0]) + (seq[i + 1].val * filter[1]);
        });
    };

    const originalOutput = applyFilter(sequence);
    const shiftedOutput = applyFilter(shiftedSequence);

    // Color mapper for output
    const getOutputColor = (val: number) => {
        if (val === 1) return "bg-emerald-400";
        if (val === -1) return "bg-rose-400";
        return "bg-slate-100";
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Sparkles className="text-pink-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Translational Equivariance in Action</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Observe how an operation (like convolution acting as our "Geometric Prior") responds when the input data is translated.
                Because the filter is applied uniformly across space, shifting the input simply shifts the output by the exact same amount.
            </p>

            <div className="flex flex-col gap-6">

                {/* Visualizer Area */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-inner overflow-x-auto">

                    {/* Convolution Filter Display */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-sm font-bold text-slate-700 w-24">Filter <Latex>{'$\\sigma$'}</Latex></span>
                        <div className="flex gap-1">
                            {filter.map((val, i) => (
                                <div key={i} className="w-10 h-10 flex items-center justify-center font-mono font-bold border-2 border-slate-800 bg-slate-50 rounded">
                                    {val}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-slate-500 italic ml-2">(Edge Detector)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Original Unshifted */}
                        <div className="flex flex-col gap-4 opacity-50 transition-opacity hover:opacity-100">
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Original Input <Latex>{'$x$'}</Latex></span>
                                <div className="flex gap-1">
                                    {sequence.map((item, i) => (
                                        <div key={i} className={`w-8 h-8 rounded border border-slate-300 ${item.color}`} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Output <Latex>{'$f(x)$'}</Latex></span>
                                <div className="flex gap-1">
                                    {originalOutput.map((val, i) => (
                                        <div key={i} className={`w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-xs font-bold text-white ${getOutputColor(val)}`}>
                                            {val !== 0 ? val : ""}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shifted View */}
                        <div className="flex flex-col gap-4 border-l-2 border-dashed border-pink-200 pl-8">
                            <div>
                                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 block">Shifted Input <Latex>{'$x + t$'}</Latex></span>
                                <div className="flex gap-1 relative">
                                    {shiftedSequence.map((item, i) => (
                                        <motion.div
                                            key={`in-${i}`}
                                            layout
                                            className={`w-8 h-8 rounded border border-slate-300 ${item.color}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-2 block">Output <Latex>{'$f(x + t)$'}</Latex></span>
                                <div className="flex gap-1 relative">
                                    {shiftedOutput.map((val, i) => (
                                        <motion.div
                                            key={`out-${i}`}
                                            layout
                                            className={`w-8 h-8 rounded border border-slate-300 flex items-center justify-center text-xs font-bold text-white ${getOutputColor(val)}`}
                                        >
                                            {val !== 0 ? val : ""}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Controls Area */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">Translation Amount (<Latex>{'$t$'}</Latex>)</label>
                            <span className="font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">+{offset} units</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={N - 1}
                            step={1}
                            value={offset}
                            onChange={(e) => setOffset(parseInt(e.target.value))}
                            className="w-full accent-pink-600"
                        />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-700 font-mono flex items-center gap-3">
                        <div className="flex flex-col items-center">
                            <Latex>{'$f(x + t)$'}</Latex>
                            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Shift then apply</span>
                        </div>
                        <MoveRight className="text-pink-500" size={16} />
                        <div className="flex flex-col items-center">
                            <Latex>{'$f(x) + t$'}</Latex>
                            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Apply then shift</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="p-3 bg-pink-50 border-l-4 border-pink-500 rounded-lg text-sm text-pink-900 shadow-sm mt-2">
                <strong>Why it matters for Transformers:</strong> Standard fully-connected layers destroy this spacing information. To achieve this equivariance in a Transformer, we abandon absolute position tracking entirely and instead supply the Attention mechanism with <strong>Relative Positional Encodings</strong>, ensuring the model only computes weights based on the <em>distance</em> between tokens, not their absolute coordinates in the sequence.
            </div>
        </div>
    );
}
