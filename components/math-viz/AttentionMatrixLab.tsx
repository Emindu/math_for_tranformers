"use client";

import React, { useState, useEffect, useMemo } from 'react';
import katex from 'katex';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { randomVector, dotProduct, softmax } from '@/lib/math-utils';
import { cn } from '@/lib/utils';
import { Play, RefreshCw } from 'lucide-react';

const D_MODEL = 4; // Small dimension for demo

interface AttentionMatrixLabProps {
    initialSentence?: string;
}

export default function AttentionMatrixLab({ initialSentence = "The cat sat on the mat" }: AttentionMatrixLabProps) {
    const [sentence, setSentence] = useState(initialSentence);
    const [tokens, setTokens] = useState<string[]>([]);

    // We store Q, K vectors for each token.
    // In a real transformer, these come from x * W_q, x * W_k.
    // Here we just random gen them for visualization "play".
    const [qVectors, setQVectors] = useState<number[][]>([]);
    const [kVectors, setKVectors] = useState<number[][]>([]);

    const [hoveredIdx, setHoveredIdx] = useState<{ i: number, j: number } | null>(null);
    const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);

    useEffect(() => {
        const t = sentence.trim().split(/\s+/);
        setTokens(t);

        // Regenerate vectors when sentence length changes significantly or on init
        // For stability, usually we keep same vectors key-ed by token index? 
        // But simplifying: just regen all.
        setQVectors(t.map(() => randomVector(D_MODEL)));
        setKVectors(t.map(() => randomVector(D_MODEL)));
    }, [sentence]);

    const regenerateVectors = () => {
        setQVectors(tokens.map(() => randomVector(D_MODEL)));
        setKVectors(tokens.map(() => randomVector(D_MODEL)));
    };

    // Calculate Attention Matrix
    // Score(i, j) = (q_i . k_j) / sqrt(d_k)
    // Attention(i, j) = softmax(Score(i, :))_j

    const attentionMatrix = useMemo(() => {
        if (qVectors.length === 0) return [];

        const n = tokens.length;
        const sqrtD = Math.sqrt(D_MODEL);
        const rawScores: number[][] = []; // [i][j]

        // Compute Raw Dot Products
        for (let i = 0; i < n; i++) {
            const row: number[] = [];
            for (let j = 0; j < n; j++) {
                const score = dotProduct(qVectors[i], kVectors[j]) / sqrtD;
                row.push(score);
            }
            rawScores.push(row);
        }

        // Apply Softmax per row
        const attScores: number[][] = rawScores.map(row => softmax(row));
        return attScores;
    }, [qVectors, kVectors, tokens]);

    // Render Math Formula
    const formulaHtml = useMemo(() => {
        return katex.renderToString(
            `\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V`,
            { throwOnError: false }
        );
    }, []);

    // Helper for color intensity
    const getColor = (score: number) => {
        // Score is 0 to 1. 
        // We can map to a blue or purple scale.
        // Tailwind 'indigo' scale.
        // 0 -> bg-slate-100
        // 1 -> bg-indigo-600
        // We'll use style opacity or raw rgba
        return `rgba(79, 70, 229, ${score})`; // Indigo-600 with opacity
    };

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span>Anatomy of Attention</span>
                <span className="text-sm font-normal text-slate-500 px-2 py-1 bg-slate-200 rounded-md">Chapter 3</span>
            </h2>

            <div
                className="mb-6 text-slate-600 flex justify-center"
                dangerouslySetInnerHTML={{ __html: formulaHtml }}
            />

            <div className="flex flex-col md:flex-row gap-8">
                {/* Controls & Input */}
                <div className="flex-1 space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Input Sentence</span>
                        <input
                            type="text"
                            value={sentence}
                            onChange={(e) => setSentence(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </label>
                    <button
                        onClick={regenerateVectors}
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <RefreshCw size={16} /> Randomize Q/K Vectors
                    </button>

                    <div className="prose prose-sm text-slate-600 mt-4">
                        <p>
                            Enter a sentence to see how the Self-Attention mechanism computes relationships between words.
                            The heatmap shows the attention weight <Latex>{"$\\alpha_{ij}$"}</Latex> representing how much the word <strong>{tokens[hoveredIdx?.i ?? 0] || "..."}</strong> attends to <strong>{tokens[hoveredIdx?.j ?? 0] || "..."}</strong>.
                        </p>
                    </div>
                </div>

                {/* Matrix Visualization */}
                <div className="flex-1 relative">
                    <div
                        className="grid gap-1"
                        style={{
                            gridTemplateColumns: `auto repeat(${tokens.length}, minmax(40px, 1fr))`,
                        }}
                    >
                        {/* Header Row (Keys) */}
                        <div className="h-10"></div> {/* Corner spacer */}
                        {tokens.map((token, j) => (
                            <div key={`head-${j}`} className="flex items-end justify-center pb-2">
                                <span className={cn(
                                    "text-xs font-semibold text-slate-500 transform -rotate-45 origin-bottom-left whitespace-nowrap",
                                    hoveredTokenIdx === j && "text-indigo-600"
                                )}>
                                    {token}
                                </span>
                            </div>
                        ))}

                        {/* Rows (Queries) */}
                        {attentionMatrix.map((row, i) => (
                            <React.Fragment key={`row-${i}`}>
                                {/* Row Label */}
                                <div className="flex items-center justify-end pr-2">
                                    <span
                                        className={cn(
                                            "text-xs font-semibold text-slate-500",
                                            hoveredTokenIdx === i && "text-indigo-600"
                                        )}
                                        onMouseEnter={() => setHoveredTokenIdx(i)}
                                        onMouseLeave={() => setHoveredTokenIdx(null)}
                                    >
                                        {tokens[i]}
                                    </span>
                                </div>

                                {/* Cells */}
                                {row.map((score, j) => (
                                    <div
                                        key={`cell-${i}-${j}`}
                                        className="relative aspect-square rounded-sm border border-slate-100 cursor-pointer group"
                                        style={{ backgroundColor: getColor(score) }}
                                        onMouseEnter={() => setHoveredIdx({ i, j })}
                                        onMouseLeave={() => setHoveredIdx(null)}
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-[10px] px-1 rounded z-20 whitespace-nowrap">
                                            {score.toFixed(3)}
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Connection Visualizer (Optional Extra) */}
            {hoveredTokenIdx !== null && (
                <div className="mt-6 border-t pt-4">
                    <div className="h-32 relative flex justify-between items-center px-8">
                        {/* We could draw bezier curves here using SVG but let's keep it simple for MVP */}
                        <p className="text-center w-full text-sm text-slate-400 italic">
                            Hover over cells to see precise weights. (Visual connection lines to be implemented)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
