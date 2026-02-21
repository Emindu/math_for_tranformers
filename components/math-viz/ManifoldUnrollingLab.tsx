"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function ManifoldUnrollingLab() {
    const [unrollProgress, setUnrollProgress] = useState(0);

    // Generate points along an S-curve (1D manifold embedded in 2D)
    const numPoints = 150;

    // The intrinsic 1D coordinate is t (from -Math.PI to Math.PI)
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i < numPoints; i++) {
            const t = -Math.PI + (i / (numPoints - 1)) * 2 * Math.PI;

            // "Folded" 2D coordinates (S-curve)
            const foldedX = Math.sin(t) * (Math.abs(t) + 1) * 30;
            const foldedY = -t * 40;

            // "Unrolled" 1D coordinates projected into 2D display space
            const unrolledX = t * 60;
            const unrolledY = 0;

            // Color based on intrinsic coordinate t
            const hue = ((t + Math.PI) / (2 * Math.PI)) * 280; // color gradient

            pts.push({ t, foldedX, foldedY, unrolledX, unrolledY, hue });
        }
        return pts;
    }, []);

    const size = 300;
    const center = size / 2;

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Compass className="text-fuchsia-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Manifold Learning: Unrolling the Curve</h3>
            </div>
            <p className="text-sm text-slate-600 -mt-4">
                Algorithms like Isomap attempt to "unroll" the manifold to find the intrinsic lower-dimensional space.
                Notice how the <strong>Euclidean distance</strong> between the red and purple tips is small when folded, but their actual <strong>Geodesic distance</strong> (along the curve) is much larger.
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">

                {/* SVG Visualization */}
                <div className="bg-white p-4 justify-center items-center flex rounded-xl border border-slate-200 shadow-inner">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                        {/* Grid */}
                        <line x1={0} y1={center} x2={size} y2={center} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth={1} />
                        <line x1={center} y1={0} x2={center} y2={size} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth={1} />

                        {/* Render points */}
                        {points.map((p, i) => {
                            // Interpolate between folded and unrolled state based on slider
                            const currentX = p.foldedX * (1 - unrollProgress) + p.unrolledX * unrollProgress;
                            const currentY = p.foldedY * (1 - unrollProgress) + p.unrolledY * unrollProgress;

                            // Draw connections (edges) to visualize the manifold surface
                            let edgeLine = null;
                            if (i > 0) {
                                const prev = points[i - 1];
                                const prevX = prev.foldedX * (1 - unrollProgress) + prev.unrolledX * unrollProgress;
                                const prevY = prev.foldedY * (1 - unrollProgress) + prev.unrolledY * unrollProgress;
                                edgeLine = (
                                    <line
                                        x1={center + prevX}
                                        y1={center + prevY}
                                        x2={center + currentX}
                                        y2={center + currentY}
                                        stroke={`hsl(${p.hue}, 80%, 70%)`}
                                        strokeWidth={3}
                                    />
                                );
                            }

                            return (
                                <g key={i}>
                                    {edgeLine}
                                    {i % 5 === 0 && ( // plot dots sparsely
                                        <circle
                                            cx={center + currentX}
                                            cy={center + currentY}
                                            r={3}
                                            fill={`hsl(${p.hue}, 80%, 50%)`}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Euclidean Short-circuit visualizer (only show when folded) */}
                        {unrollProgress < 0.2 && (
                            <motion.line
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 - (unrollProgress * 5) }} // fade out as it unrolls
                                x1={center + points[0].foldedX}
                                y1={center + points[0].foldedY}
                                x2={center + points[points.length - 1].foldedX}
                                y2={center + points[points.length - 1].foldedY}
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                            />
                        )}
                        {unrollProgress < 0.2 && (
                            <motion.text
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 - (unrollProgress * 5) }}
                                x={center}
                                y={center}
                                className="text-xs font-bold"
                                fill="#94a3b8"
                                textAnchor="middle"
                            >
                                Euclidean Shortcut
                            </motion.text>
                        )}
                    </svg>
                </div>

                {/* Controls */}
                <div className="w-full md:w-64 bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 justify-center">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-slate-700">Unroll Manifold</label>
                            <span className="font-mono text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded border border-fuchsia-100">{(unrollProgress * 100).toFixed(0)}%</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={unrollProgress}
                            onChange={(e) => setUnrollProgress(parseFloat(e.target.value))}
                            className="w-full accent-fuchsia-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>High-Dim Folded</span>
                            <span>Intrinsic 1D</span>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 bg-fuchsia-50 border-l-4 border-fuchsia-500 p-3 rounded-r">
                        <strong>The Goal of Embeddings:</strong> We want models to map this complex 2D S-curve into a simple straight line (the intrinsic 1D space) so that linear operations (like dot products in self-attention) accurately reflect the true data relationships.
                    </div>
                </div>

            </div>
        </div>
    );
}
