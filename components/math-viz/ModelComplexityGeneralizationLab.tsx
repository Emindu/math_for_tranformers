"use client";
import React, { useState, useMemo } from 'react';
import { GitBranch, Info } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function ModelComplexityGeneralizationLab() {
    const [modelCapacity, setModelCapacity] = useState(50); // x-axis: 0 to 100
    const [lambdaReg, setLambdaReg] = useState(0.01); // Regularization strength
    const [sampleSize, setSampleSize] = useState(100); // Dataset size n

    // SVG Chart Dimensions
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scale functions
    const getX = (capacity: number) => margin.left + (capacity / 100) * innerWidth;
    // Let maximum error be 1.0. Y=0 is at the bottom.
    const getY = (val: number) => margin.top + innerHeight - (Math.min(val, 1.0) * innerHeight);

    // Generate the curves
    const { trainPathStr, testPathStr, currentTrainErr, currentTestErr } = useMemo(() => {

        // Base functions for the curves
        // Training Error goes down monotonically with capacity.
        // It drops faster with more capacity, but regularization limits how low it can go.
        const calcTrainErr = (c: number) => {
            const baseErr = 0.8 * Math.exp(-c / 20); // Exponential decay
            const regFloor = lambdaReg * 0.5; // High lambda raises the minimum possible training error
            return Math.max(baseErr, regFloor);
        };

        // Test error follows the classic U-shape: bias-variance tradeoff
        // Initially drops with train error (reducing bias)
        // Then rises linearly/quadratically with capacity relative to sample size (variance/overfitting)
        // Regularization dampens the variance rise.
        const calcTestErr = (trainErr: number, c: number) => {
            // Overfitting penalty scales with Capacity / SampleSize
            // High lambda exponentially suppresses this penalty
            const capacityPenalty = (c * c) / (sampleSize * 50);
            const regularizationDampening = Math.exp(-lambdaReg * 5);

            const varianceTerm = capacityPenalty * regularizationDampening;

            return trainErr + varianceTerm;
        };

        let trainPoints = [];
        let testPoints = [];

        for (let c = 0; c <= 100; c += 2) {
            const trErr = calcTrainErr(c);
            const teErr = calcTestErr(trErr, c);

            trainPoints.push(`${getX(c)},${getY(trErr)}`);
            testPoints.push(`${getX(c)},${getY(teErr)}`);
        }

        const currentTrain = calcTrainErr(modelCapacity);
        const currentTest = calcTestErr(currentTrain, modelCapacity);

        return {
            trainPathStr: `M ${trainPoints.join(' L ')}`,
            testPathStr: `M ${testPoints.join(' L ')}`,
            currentTrainErr: currentTrain,
            currentTestErr: currentTest
        };
    }, [modelCapacity, lambdaReg, sampleSize]);

    // Determine the zone based on the gap between test and train
    const generalizationGap = currentTestErr - currentTrainErr;
    let zoneLabel = "Optimal Fit";
    let zoneColor = "text-emerald-400";

    if (modelCapacity < 20) {
        zoneLabel = "Underfitting (High Bias)";
        zoneColor = "text-blue-400";
    } else if (generalizationGap > 0.2) {
        zoneLabel = "Overfitting (High Variance)";
        zoneColor = "text-red-400";
    }

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-full shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                    <GitBranch className="text-emerald-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Generalization Optimization</h2>
                    <p className="text-slate-400 text-sm">Balancing Capacity, <Latex>{'$\\lambda$'}</Latex> Regularization, and Sample Size <Latex>{'$n$'}</Latex></p>
                </div>
            </div>

            <div className="flex-1 bg-black rounded-xl border border-slate-800 relative overflow-hidden flex flex-col mb-6">

                {/* Graph Legend */}
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg z-10 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-red-500 rounded-full" />
                        <span className="text-slate-300">Test Error <Latex>{'$\\hat{R}_{test}$'}</Latex></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-0.5 bg-blue-500 rounded-full" />
                        <span className="text-slate-300">Training Error <Latex>{'$\\hat{R}_{train}$'}</Latex></span>
                    </div>
                </div>

                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Grid lines */}
                    <line x1={margin.left} y1={getY(0.25)} x2={width - margin.right} y2={getY(0.25)} className="stroke-slate-800 stroke-dasharray-4" strokeWidth={1} />
                    <line x1={margin.left} y1={getY(0.5)} x2={width - margin.right} y2={getY(0.5)} className="stroke-slate-800 stroke-dasharray-4" strokeWidth={1} />
                    <line x1={margin.left} y1={getY(0.75)} x2={width - margin.right} y2={getY(0.75)} className="stroke-slate-800 stroke-dasharray-4" strokeWidth={1} />

                    {/* Curves */}
                    <path d={testPathStr} fill="none" className="stroke-red-500 transition-all duration-300 ease-out" strokeWidth={3} />
                    <path d={trainPathStr} fill="none" className="stroke-blue-500 transition-all duration-300 ease-out" strokeWidth={3} />

                    {/* Current Capacity Marker */}
                    <line
                        x1={getX(modelCapacity)} y1={margin.top}
                        x2={getX(modelCapacity)} y2={height - margin.bottom}
                        className="stroke-emerald-500/50 stroke-dasharray-4 transition-all duration-300" strokeWidth={2}
                    />

                    {/* Points on lines */}
                    <circle cx={getX(modelCapacity)} cy={getY(currentTestErr)} r={5} className="fill-red-500 transition-all duration-300" />
                    <circle cx={getX(modelCapacity)} cy={getY(currentTrainErr)} r={5} className="fill-blue-500 transition-all duration-300" />

                    {/* Axes Base */}
                    <line x1={margin.left} y1={getY(0)} x2={width - margin.right} y2={getY(0)} className="stroke-slate-600" strokeWidth={1.5} />
                    <line x1={getX(0)} y1={margin.top} x2={getX(0)} y2={height - margin.bottom} className="stroke-slate-600" strokeWidth={1.5} />

                    <text x={width / 2} y={height - 10} className="fill-slate-500 text-[12px] font-semibold text-anchor-middle">Model Capacity (Complexity)</text>
                    <text x={margin.left - 35} y={height / 2} transform={`rotate(-90 ${margin.left - 35} ${height / 2})`} className="fill-slate-500 text-[12px] font-semibold text-anchor-middle">Error Rate</text>
                </svg>

                {/* Dynamic Zone Indicator */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg z-10 transition-colors">
                    <span className={`text-sm font-bold ${zoneColor}`}>{zoneLabel}</span>
                    <div className="text-xs text-slate-400 mt-1">Gap: {generalizationGap.toFixed(3)}</div>
                </div>

            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 space-y-5">

                {/* Capacity Slider */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            Model Capacity
                        </label>
                        <span className="text-emerald-400 text-sm font-mono">{modelCapacity}</span>
                    </div>
                    <input
                        type="range" min="0" max="100" step="1"
                        value={modelCapacity}
                        onChange={(e) => setModelCapacity(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Number of layers, attention heads, and features.</p>
                </div>

                {/* Sub-grid for Lambda and N */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                Regularization (<Latex>{'$\\lambda$'}</Latex>)
                            </label>
                            <span className="text-teal-400 text-sm font-mono">{lambdaReg.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0" max="0.5" step="0.01"
                            value={lambdaReg}
                            onChange={(e) => setLambdaReg(parseFloat(e.target.value))}
                            className="w-full accent-teal-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Weight Decay / Dropout strength. Suppresses the Test Error variance spike.</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                Dataset Size (<Latex>{'$n$'}</Latex>)
                            </label>
                            <span className="text-indigo-400 text-sm font-mono">{sampleSize}</span>
                        </div>
                        <input
                            type="range" min="20" max="1000" step="10"
                            value={sampleSize}
                            onChange={(e) => setSampleSize(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Larger datasets delay overfitting, allowing higher capacities safely.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
