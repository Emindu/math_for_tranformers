"use client";

import React, { useState } from 'react';
import { Target } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function VCDimensionShatterLab() {
    // We are simulating shattering 3 points vs failing to shatter 4 points.
    // Combinations for 3 points: 2^3 = 8
    // Combinations for 4 points: 2^4 = 16

    const [numPoints, setNumPoints] = useState<3 | 4>(3);
    const [comboIndex, setComboIndex] = useState<number>(0);

    // Coordinate positions in an SVG 300x300 space
    // 3 points in a triangle
    const points3 = [
        { x: 150, y: 70 },
        { x: 80, y: 220 },
        { x: 220, y: 220 }
    ];
    // 4 points in a square (creates XOR which is non-linearly separable)
    const points4 = [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 100, y: 200 },
        { x: 200, y: 200 }
    ];

    const currentPoints = numPoints === 3 ? points3 : points4;
    const maxCombos = Math.pow(2, numPoints);

    // The combination dictates the color (0 = blue, 1 = red) of each point
    // Convert comboIndex to binary string, pad to numPoints length
    const comboBinary = comboIndex.toString(2).padStart(numPoints, '0');

    // Check if the current combination is linearly separable
    // For 3 points (triangle): Always Yes.
    // For 4 points (square): The XOR patterns (0110 and 1001) are NOT linearly separable.
    const isXOR = numPoints === 4 && (comboBinary === '0110' || comboBinary === '1001');
    const isSeparable = !isXOR;

    // Simulate drawing a separation boundary via CSS polygon/path
    const getSeparationLine = () => {
        if (!isSeparable) return null; // No line possible!

        // Hard-coded approximation bounds for visual demonstration
        if (numPoints === 3) {
            switch (comboBinary) {
                case '000': return "M 0,30 L 300,30"; // All blue, draw outside
                case '111': return "M 0,30 L 300,30"; // All red, draw outside
                case '100': return "M 0,150 L 300,150"; // Top red
                case '011': return "M 0,150 L 300,150"; // Bottom red
                case '010': return "M 150,0 L 50,300"; // Bottom-Left red
                case '101': return "M 150,0 L 50,300"; // Top & Bottom-Right red
                case '001': return "M 150,0 L 250,300"; // Bottom-Right red
                case '110': return "M 150,0 L 250,300"; // Top & Bottom-Left red
                default: return "M 0,0 L 0,0";
            }
        } else {
            switch (comboBinary) {
                case '0000': return "M 0,30 L 300,30";
                case '1111': return "M 0,30 L 300,30";
                case '1100': return "M 0,150 L 300,150"; // Top half red
                case '0011': return "M 0,150 L 300,150"; // Bottom half red
                case '1010': return "M 150,0 L 150,300"; // Left half red
                case '0101': return "M 150,0 L 150,300"; // Right half red
                case '1000': return "M 0,150 L 150,0"; // Top left red (diagonal)
                case '0111': return "M 0,150 L 150,0";
                case '0100': return "M 300,150 L 150,0"; // Top right red
                case '1011': return "M 300,150 L 150,0";
                case '0010': return "M 0,150 L 150,300"; // Bottom left red
                case '1101': return "M 0,150 L 150,300";
                case '0001': return "M 300,150 L 150,300"; // Bottom right red
                case '1110': return "M 300,150 L 150,300";
                default: return null;
            }
        }
    };

    const nextCombo = () => setComboIndex((comboIndex + 1) % maxCombos);
    const prevCombo = () => setComboIndex((comboIndex - 1 + maxCombos) % maxCombos);

    const togglePoints = (n: 3 | 4) => {
        setNumPoints(n);
        setComboIndex(0); // reset combinations
    }

    return (
        <div className="w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col h-full text-slate-200 p-6 relative">
            <div className="mb-4 z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                        <Target className="text-sky-400" />
                        Linear Shattering Visualizer
                    </h3>
                    <p className="text-slate-400 text-sm">Testing the VC Dimension of a Linear Classifier (<Latex>{'$\\mathbb{R}^2$'}</Latex>)</p>
                </div>
            </div>

            {/* Toggle Configuration */}
            <div className="flex bg-slate-800 rounded-xl p-1 mb-6 border border-slate-700 max-w-sm z-10 mx-auto">
                <button
                    onClick={() => togglePoints(3)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${numPoints === 3 ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                    3 Points (Shatterable)
                </button>
                <button
                    onClick={() => togglePoints(4)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${numPoints === 4 ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                    4 Points (XOR Failure)
                </button>
            </div>

            {/* Main Interactive Canvas */}
            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center z-10">

                {/* SVG Visualizer */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 aspect-square max-h-[300px] w-full max-w-[300px] relative overflow-hidden shadow-inner">
                    <svg width="100%" height="100%" viewBox="0 0 300 300" className="absolute inset-0">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid2" width="50" height="50" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid2)" />

                        {/* The Separation Hyperplane / Line */}
                        {isSeparable ? (
                            <path
                                d={getSeparationLine() || ""}
                                stroke="#38bdf8"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition-all duration-300"
                            />
                        ) : (
                            // Draw an "X" or warning
                            <g className="opacity-30">
                                <path d="M 50,50 L 250,250" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 10" />
                                <path d="M 250,50 L 50,250" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" strokeDasharray="10 10" />
                            </g>
                        )}

                        {/* Points */}
                        {currentPoints.map((pt, i) => {
                            const bit = comboBinary[i];
                            const isRed = bit === '1';
                            return (
                                <g key={i} className="transition-all duration-500" transform={`translate(${pt.x}, ${pt.y})`}>
                                    <circle
                                        cx="0" cy="0" r="10"
                                        fill={isRed ? "#f43f5e" : "#818cf8"} // Rose vs Indigo
                                        className="drop-shadow-lg"
                                    />
                                    <circle cx="0" cy="0" r="3" fill="#ffffff" className="opacity-50" />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Right Panel Controls */}
                <div className="flex flex-col gap-6 w-full max-w-[250px]">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">State Configuration</div>
                        <div className="text-sm font-mono text-white mb-2">Combination {comboIndex + 1} / {maxCombos}</div>
                        <div className="flex items-center justify-center gap-2 mb-4 font-mono text-lg bg-slate-900 px-3 py-1 rounded border border-slate-700">
                            {comboBinary.split('').map((bit, idx) => (
                                <span key={idx} className={bit === '1' ? 'text-rose-400' : 'text-indigo-400'}>{bit}</span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={prevCombo} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 transition-colors">&larr;</button>
                            <button onClick={nextCombo} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 transition-colors">&rarr;</button>
                        </div>
                    </div>

                    <div className={`p-4 rounded-xl border text-center font-bold ${isSeparable ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' : 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse'}`}>
                        {isSeparable ? (
                            <div>✓ Linearly Separable</div>
                        ) : (
                            <div>✗ NOT Separable (Shatter Failed)</div>
                        )}
                        <p className="text-xs font-normal opacity-80 mt-1">
                            {isSeparable ? "A straight line can successfully divide the red and blue points." : "An XOR pattern cannot be drawn through with a single straight line."}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}
