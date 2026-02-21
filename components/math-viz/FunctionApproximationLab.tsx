"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { LineChart, Activity } from 'lucide-react';

export default function TaylorSeriesLab() {
    const [terms, setTerms] = useState(1);
    const [viewMode, setViewMode] = useState<'sine' | 'absolute'>('sine'); // 'sine' or 'absolute'

    // Number of points to render the curve
    const resolution = 100;
    const range = Math.PI * 1.5; // -1.5π to 1.5π

    // Generate coordinate data
    const data = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= resolution; i++) {
            const x = -range + (i / resolution) * (2 * range);

            let targetY = 0;
            let approxY = 0;

            if (viewMode === 'sine') {
                targetY = Math.sin(x);
                // Compute Taylor Series for sin(x)
                // sin(x) ≈ x - x^3/3! + x^5/5! - x^7/7! ...
                let currentTerm = x;
                approxY = currentTerm;
                let sign = -1;

                for (let k = 1; k < terms; k++) {
                    const power = 2 * k + 1;

                    // compute factorial
                    let fact = 1;
                    for (let f = 2; f <= power; f++) fact *= f;

                    currentTerm = Math.pow(x, power) / fact;
                    approxY += sign * currentTerm;
                    sign *= -1;
                }
            } else {
                targetY = Math.abs(x);

                // For demonstration of Jackson's Theorems regarding |x| on [-1, 1], it's not a simple Maclaurin series since |x| is not smooth at 0.
                // We'll use a standard polynomial approximation sequence (Fourier cosine series for |x| over [-pi, pi])
                // |x| ≈ pi/2 - 4/pi * sum(cos((2k-1)x) / (2k-1)^2)
                approxY = Math.PI / 2;
                for (let k = 1; k <= terms; k++) {
                    const n = 2 * k - 1;
                    approxY -= (4 / Math.PI) * (Math.cos(n * x) / (n * n));
                }
            }

            pts.push({ x, targetY, approxY });
        }
        return pts;
    }, [terms, viewMode, range]);

    // SVG Drawing helpers
    const width = 500;
    const height = 300;
    const scaleX = width / (2 * range);
    // Keep Y scale fixed for sine, but zoom out slightly for |x| since it grows
    const scaleY = viewMode === 'sine' ? height / 4 : height / 6;

    // Centers
    const cx = width / 2;
    const cy = height / 2;

    const toSvgCoords = (x: number, y: number) => {
        return {
            svgX: cx + x * scaleX,
            svgY: cy - y * scaleY // svg Y goes down
        };
    };

    // Build SVG paths
    const targetPath = data.map((p, i) => {
        const coord = toSvgCoords(p.x, p.targetY);
        return `${i === 0 ? 'M' : 'L'} ${coord.svgX} ${coord.svgY}`;
    }).join(" ");

    const approxPath = data.map((p, i) => {
        const coord = toSvgCoords(p.x, p.approxY);
        // clamp Y heavily to prevent massive svg blowouts from high-degree polynomial divergence
        const clampedY = Math.max(-height * 2, Math.min(height * 2, coord.svgY));
        return `${i === 0 ? 'M' : 'L'} ${coord.svgX} ${clampedY}`;
    }).join(" ");

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <LineChart className="text-teal-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Weierstrass & Jackson: Function Approximation</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Increase the number of terms (or network capacity) to see how the simpler basis functions conform to the target function.
            </p>

            {/* Toggle Target Function */}
            <div className="flex bg-slate-200 p-1 rounded-lg w-full max-w-sm mx-auto">
                <button
                    onClick={() => { setViewMode('sine'); setTerms(1); }}
                    className={`flex-1 py-1.5 px-4 rounded-md text-sm font-semibold transition-all ${viewMode === 'sine' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Smooth <Latex>$f(x) = \sin(x)$</Latex>
                </button>
                <button
                    onClick={() => { setViewMode('absolute'); setTerms(1); }}
                    className={`flex-1 py-1.5 px-4 rounded-md text-sm font-semibold transition-all ${viewMode === 'absolute' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Non-Smooth <Latex>$f(x) = |x|$</Latex>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                {/* Graph View */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner overflow-hidden w-full max-w-[500px]">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-hidden">

                        {/* Axes */}
                        <line x1={0} y1={cy} x2={width} y2={cy} stroke="#cbd5e1" strokeWidth={1} />
                        <line x1={cx} y1={0} x2={cx} y2={height} stroke="#cbd5e1" strokeWidth={1} />

                        {/* Target Function */}
                        <path
                            d={targetPath}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth={3}
                            strokeDasharray="6 6"
                        />

                        {/* Approximation Function */}
                        <path
                            d={approxPath}
                            fill="none"
                            stroke="rgba(13, 148, 136, 0.8)"
                            strokeWidth={3}
                            style={{ transition: 'd 0.3s ease-in-out' }}
                        />

                        {/* Legend */}
                        <g transform={`translate(20, 20)`}>
                            <line x1={0} y1={0} x2={20} y2={0} stroke="#94a3b8" strokeWidth={3} strokeDasharray="4 4" />
                            <text x={25} y={4} fontSize="12" fill="#64748b" className="font-mono">Target</text>

                            <line x1={0} y1={20} x2={20} y2={20} stroke="rgba(13, 148, 136, 0.8)" strokeWidth={3} />
                            <text x={25} y={24} fontSize="12" fill="#0f766e" className="font-mono">Approximation <Latex>$P_n(x)$</Latex></text>
                        </g>

                    </svg>
                </div>

                {/* Controls */}
                <div className="w-full md:w-64 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 justify-center">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">Polynomial Terms (<Latex>{'$n$'}</Latex>)</label>
                            <span className="font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{terms}</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={viewMode === 'sine' ? 9 : 20}
                            step={1}
                            value={terms}
                            onChange={(e) => setTerms(parseInt(e.target.value))}
                            className="w-full accent-teal-600"
                        />
                    </div>

                    <div className="text-sm text-slate-600 bg-teal-50 border-l-4 border-teal-500 p-3 rounded-r flex flex-col gap-2">
                        {viewMode === 'sine' ? (
                            <>
                                <strong>Taylor Polynomials:</strong> Notice how rapidly <Latex>$\sin(x)$</Latex> converges around $x=0$. Because sine is perfectly smooth (infinitely differentiable), a very small $N$ achieves high accuracy over a wide range.
                            </>
                        ) : (
                            <>
                                <strong>Jackson's Rate of Convergence:</strong> Notice the sharp corner at $x=0$. Because <Latex>$|x|$</Latex> is not smooth (non-differentiable at 0), the approximation struggles and converges much slower (order $1/n$), requiring significantly more terms to lock in.
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
