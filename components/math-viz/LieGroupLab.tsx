"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Latex from 'react-latex-next';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function LieGroupLab() {
    const [theta, setTheta] = useState(0); // Angle in radians
    const [isPlaying, setIsPlaying] = useState(false);
    const [showLieAlgebra, setShowLieAlgebra] = useState(false);

    const controls = useAnimation();

    // The vector we are rotating
    const initialVector = { x: 1, y: 0 };

    // Apply rotation matrix
    const rotatedX = initialVector.x * Math.cos(theta) - initialVector.y * Math.sin(theta);
    const rotatedY = initialVector.x * Math.sin(theta) + initialVector.y * Math.cos(theta);

    // Apply infinitesimal rotation (Lie Algebra action)
    // The Lie algebra of SO(2) is the set of skew-symmetric 2x2 matrices
    // Action of generator J on vector v: J*v = [-y, x]
    const lieDerivX = -initialVector.y;
    const lieDerivY = initialVector.x;

    // Position of Lie algebra vector (tangent at current transformed point)
    // X(theta) = R(theta)v
    // d/d(theta) X(theta) = R(theta) J v
    const tangentX = rotatedX * 0 - rotatedY * 1;
    const tangentY = rotatedX * 1 + rotatedY * 0;

    useEffect(() => {
        let animationFrame: number;
        if (isPlaying) {
            const animate = () => {
                setTheta(prev => (prev + 0.01) % (2 * Math.PI));
                animationFrame = requestAnimationFrame(animate);
            };
            animationFrame = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(animationFrame);
    }, [isPlaying]);

    const handleReset = () => {
        setIsPlaying(false);
        setTheta(0);
    };

    // SVG scaling
    const W = 400;
    const H = 400;
    const cx = W / 2;
    const cy = H / 2;
    const scale = 120; // pixels per unit

    const toSvgX = (x: number) => cx + x * scale;
    const toSvgY = (y: number) => cy - y * scale; // Invert Y for SVG

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">SO(2) and its Lie Algebra <Latex>{'$\\mathfrak{so}(2)$'}</Latex></h3>
            <p className="text-sm text-slate-600 mb-6">
                Visualize how a continuous Lie Group acting on a vector correlates with its linear, infinitesimal Lie Algebra (the tangent space).
            </p>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Visualization */}
                <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-hidden relative">
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                        {/* Grid */}
                        <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
                        <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />
                        <circle cx={cx} cy={cy} r={scale} fill="none" stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4,4" />

                        {/* Origin */}
                        <circle cx={cx} cy={cy} r={3} fill="#64748b" />

                        {/* Current Vector (Lie Group Action) */}
                        <line
                            x1={cx} y1={cy}
                            x2={toSvgX(rotatedX)} y2={toSvgY(rotatedY)}
                            stroke="#0f766e" strokeWidth={3}
                        />
                        <polygon
                            points={`${toSvgX(rotatedX)},${toSvgY(rotatedY)} ${toSvgX(rotatedX) - 10},${toSvgY(rotatedY) - 5} ${toSvgX(rotatedX) - 10},${toSvgY(rotatedY) + 5}`}
                            fill="#0f766e"
                            transform={`rotate(${-(theta * 180 / Math.PI)}, ${toSvgX(rotatedX)}, ${toSvgY(rotatedY)})`}
                        />

                        {/* Tangent Vector (Lie Algebra Action) */}
                        {showLieAlgebra && (
                            <g>
                                <line
                                    x1={toSvgX(rotatedX)} y1={toSvgY(rotatedY)}
                                    x2={toSvgX(rotatedX + tangentX * 0.5)} y2={toSvgY(rotatedY + tangentY * 0.5)}
                                    stroke="#ef4444" strokeWidth={2}
                                />
                                <polygon
                                    points={`${toSvgX(rotatedX + tangentX * 0.5)},${toSvgY(rotatedY + tangentY * 0.5)} ${toSvgX(rotatedX + tangentX * 0.5) - 8},${toSvgY(rotatedY + tangentY * 0.5) - 4} ${toSvgX(rotatedX + tangentX * 0.5) - 8},${toSvgY(rotatedY + tangentY * 0.5) + 4}`}
                                    fill="#ef4444"
                                    transform={`rotate(${-((theta + Math.PI / 2) * 180 / Math.PI)}, ${toSvgX(rotatedX + tangentX * 0.5)}, ${toSvgY(rotatedY + tangentY * 0.5)})`}
                                />
                                <text x={toSvgX(rotatedX + tangentX * 0.6)} y={toSvgY(rotatedY + tangentY * 0.6)} fill="#ef4444" fontSize={12} fontWeight="bold">
                                    Tangent (Lie Algebra)
                                </text>
                            </g>
                        )}

                        <text x={toSvgX(rotatedX) + 10} y={toSvgY(rotatedY) + 10} fill="#0f766e" fontSize={12} fontWeight="bold">
                            Rotated Vector
                        </text>

                    </svg>

                    <div className="absolute top-4 left-4 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span className="text-slate-500">Angle (<Latex>{'$\\theta$'}</Latex>)</span>
                        <span className="font-mono text-slate-800">{(theta * 180 / Math.PI).toFixed(1)}°</span>

                        <span className="text-slate-500">Vector</span>
                        <span className="font-mono text-teal-700">[{rotatedX.toFixed(2)}, {rotatedY.toFixed(2)}]</span>
                    </div>
                </div>

                {/* Controls & Math Info */}
                <div className="w-full md:w-64 flex flex-col gap-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-800 text-sm mb-3">Controls</h4>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="flex-1 flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                title="Reset"
                            >
                                <RotateCcw size={16} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-semibold text-slate-700 mb-1 block">Manual Angle</label>
                            <input
                                type="range"
                                min={0}
                                max={2 * Math.PI}
                                step={0.01}
                                value={theta}
                                onChange={(e) => {
                                    setIsPlaying(false);
                                    setTheta(parseFloat(e.target.value));
                                }}
                                className="w-full accent-teal-600"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLieAlgebra}
                                onChange={(e) => setShowLieAlgebra(e.target.checked)}
                                className="accent-red-500 w-4 h-4 rounded"
                            />
                            Show Tangent Vector
                        </label>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-800 text-sm mb-2">The Mathematics</h4>
                        <div className="text-xs text-slate-600 space-y-3">
                            <p>
                                <strong>Lie Group Action:</strong><br />
                                <Latex>{'$R(\\theta) = \\begin{pmatrix} \\cos \\theta & -\\sin \\theta \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix}$'}</Latex>
                            </p>
                            {showLieAlgebra && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <strong>Lie Algebra Generator:</strong><br />
                                    <Latex>{'$J = \\begin{pmatrix} 0 & -1 \\\\ 1 & 0 \\end{pmatrix}$'}</Latex><br />
                                    The tangent vector is calculated as the derivative at <Latex>{'$\\theta$'}</Latex>.<br />
                                    <Latex>{'$\\frac{d}{d\\theta} R(\\theta)v = R(\\theta) J v$'}</Latex>
                                </motion.p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-teal-50 border border-teal-100 rounded-lg text-xs text-teal-800">
                <strong>Connection to Transformers:</strong> If data (like image patches or specific token positions) exhibits rotational or translational symmetries, we can enforce that attention mechanisms remain <em>equivariant</em> to these motions. The Lie algebra allows us to linearize these continuous shifts, making them easier to compute via matrix multiplications within a neural network layer.
            </div>
        </div>
    );
}
