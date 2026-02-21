"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { RotateCw, ArrowRight, ArrowDown } from 'lucide-react';

export default function EquivarianceLab() {
    const [viewMode, setViewMode] = useState<'equivariant' | 'invariant'>('equivariant');

    // 3x3 Grid Data
    const [grid, setGrid] = useState([
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
    ]);

    // Group Action: Rotate 90 degrees clockwise
    const rotate90 = (g: number[][]) => {
        return [
            [g[2][0], g[1][0], g[0][0]],
            [g[2][1], g[1][1], g[0][1]],
            [g[2][2], g[1][2], g[0][2]],
        ];
    };

    const toggleCell = (r: number, c: number) => {
        const newGrid = [...grid.map(row => [...row])];
        newGrid[r][c] = newGrid[r][c] ? 0 : 1;
        setGrid(newGrid);
    };

    const rotatedGrid = rotate90(grid);

    // Invariant Function: Sum all pixels
    const computeInvariant = (g: number[][]) => {
        let sum = 0;
        g.forEach(row => row.forEach(val => sum += val));
        return sum;
    };

    // Equivariant Function: Simple edge filter (just invert colors for visualization, or a shift)
    // To make it obviously equivariant and visually distinct, let's do a basic convolution a 3x3 invert:
    // f(x) = 1 - x
    const computeEquivariant = (g: number[][]) => {
        return g.map(row => row.map(val => (val === 1 ? 0.2 : 0.8))); // representing inverted pixel values
    };

    const GridRenderer = ({ data, interactive = false }: { data: number[][] | number, interactive?: boolean }) => {
        if (typeof data === 'number') {
            return (
                <div className="w-24 h-24 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-slate-300 shadow-inner">
                    <span className="text-3xl font-bold text-slate-700">{data}</span>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200 rounded-lg w-24 h-24 border border-slate-300">
                {data.map((row, r) =>
                    row.map((val, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => interactive && toggleCell(r, c)}
                            className={`rounded-sm transition-colors ${interactive ? 'cursor-pointer hover:opacity-80' : ''}`}
                            style={{ backgroundColor: `rgba(244, 63, 94, ${val})` }}
                        />
                    ))
                )}
            </div>
        );
    };

    const getMathText = () => {
        if (viewMode === 'invariant') {
            return {
                title: "Invariant Function",
                formula: "$f(\\phi(g, x)) = f(x)$",
                desc: "The output (the total sum of activated pixels) remains exactly the same, regardless of how the input is rotated. The orientation information is intentionally lost."
            };
        } else {
            return {
                title: "Equivariant Function",
                formula: "$f(\\phi(g, x)) = \\phi(g, f(x))$",
                desc: "The output feature map (an inverted filter in this case) rotates in the exact same manner as the original input. The orientation data structure is perfectly preserved."
            };
        }
    };

    const mathText = getMathText();

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <RotateCw className="text-rose-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Equivariance vs. Invariance</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Click the squares on the input grid to draw a shape. Observe how the <strong>Commutative Diagram</strong> resolves
                whether you apply the transformation first, or the function first.
            </p>

            {/* Toggle Modes */}
            <div className="flex bg-slate-200 p-1 rounded-lg w-full max-w-sm mx-auto">
                <button
                    onClick={() => setViewMode('equivariant')}
                    className={`flex-1 py-1.5 px-4 rounded-md text-sm font-semibold transition-all ${viewMode === 'equivariant' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Equivariant (Filter)
                </button>
                <button
                    onClick={() => setViewMode('invariant')}
                    className={`flex-1 py-1.5 px-4 rounded-md text-sm font-semibold transition-all ${viewMode === 'invariant' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Invariant (Pooling)
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-inner">

                {/* Visual Diagram */}
                <div className="relative w-full max-w-md aspect-square flex flex-col justify-between">

                    {/* Top Row: Input -> Function -> Output */}
                    <div className="flex justify-between items-center w-full px-8">
                        <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest"><Latex>$x$</Latex> (Input)</span>
                            <GridRenderer data={grid} interactive={true} />
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-xs text-rose-600 font-mono mb-1"><Latex>$f(x)$</Latex></span>
                            <ArrowRight className="text-rose-400" size={32} />
                        </div>

                        <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output 1</span>
                            <GridRenderer data={viewMode === 'invariant' ? computeInvariant(grid) : computeEquivariant(grid)} />
                        </div>
                    </div>

                    {/* Vertical Arrows: Rotations */}
                    <div className="flex justify-between items-center w-full px-16 -my-4 z-0 pointer-events-none">
                        <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-xs font-mono"><Latex>{'$\\phi(R_{90}, x)$'}</Latex></span>
                            <ArrowDown size={32} />
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <ArrowDown size={32} />
                            <span className="text-xs font-mono"><Latex>{viewMode === 'equivariant' ? '$\\phi(R_{90}, y)$' : '$Invariant$'}</Latex></span>
                        </div>
                    </div>

                    {/* Bottom Row: Rotated Input -> Function -> Rotated Output */}
                    <div className="flex justify-between items-center w-full px-8">
                        <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest"><Latex>{'$R_{90}(x)$'}</Latex></span>
                            <GridRenderer data={rotatedGrid} />
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-xs text-rose-600 font-mono mb-1"><Latex>{'$f(R_{90}(x))$'}</Latex></span>
                            <ArrowRight className="text-rose-400" size={32} />
                        </div>

                        <div className="flex flex-col items-center gap-2 z-10">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output 2</span>
                            <GridRenderer data={viewMode === 'invariant' ? computeInvariant(rotatedGrid) : computeEquivariant(rotatedGrid)} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Explanation box */}
            <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                <h4 className="font-bold text-rose-900 mb-1">{mathText.title}</h4>
                <div className="font-mono text-rose-800 bg-white inline-block px-2 py-1 rounded shadow-sm border border-rose-100 mb-2">
                    <Latex>{mathText.formula}</Latex>
                </div>
                <p className="text-sm text-slate-700">
                    {mathText.desc}
                </p>
            </div>

        </div>
    );
}
