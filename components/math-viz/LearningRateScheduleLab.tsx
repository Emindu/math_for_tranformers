"use client";

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import Latex from 'react-latex-next';

type ScheduleType = 'step' | 'exponential' | 'polynomial' | 'cosine';

export default function LearningRateScheduleLab() {
    const [schedule, setSchedule] = useState<ScheduleType>('cosine');
    const [initialLr, setInitialLr] = useState<number>(0.1);

    // Schedule specific parameters
    const [gamma, setGamma] = useState<number>(0.5); // For Step decay
    const [stepSize, setStepSize] = useState<number>(20); // For Step decay
    const [decayRate, setDecayRate] = useState<number>(0.05); // For Exponential
    const [power, setPower] = useState<number>(2); // For Polynomial
    const [minLr, setMinLr] = useState<number>(0.001); // For Cosine

    const totalEpochs = 100;

    const data = useMemo(() => {
        const points = [];
        for (let t = 0; t <= totalEpochs; t++) {
            let lr = initialLr;

            if (schedule === 'step') {
                lr = initialLr * Math.pow(gamma, Math.floor(t / stepSize));
            } else if (schedule === 'exponential') {
                lr = initialLr * Math.exp(-decayRate * t);
            } else if (schedule === 'polynomial') {
                lr = initialLr * Math.pow(1 - (t / totalEpochs), power);
            } else if (schedule === 'cosine') {
                lr = minLr + 0.5 * (initialLr - minLr) * (1 + Math.cos(Math.PI * t / totalEpochs));
            }

            points.push({
                epoch: t,
                lr: Math.max(lr, 0), // prevent negative LR visually if power gets weird
            });
        }
        return points;
    }, [schedule, initialLr, gamma, stepSize, decayRate, power, minLr]);

    return (
        <div className="w-full flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Activity className="text-teal-400" size={20} />
                    <h3 className="text-white font-semibold">Learning Rate Schedules Explorer</h3>
                </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-slate-800 border-b border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-200">

                {/* Schedule Selector */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-slate-400">Schedule Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['step', 'exponential', 'polynomial', 'cosine'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setSchedule(type)}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${schedule === type ? 'bg-teal-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Parameters */}
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Initial LR (<Latex>{`$\\eta_0$`}</Latex>)</span>
                            <span className="font-mono text-teal-400">{initialLr.toFixed(3)}</span>
                        </div>
                        <input
                            type="range" min="0.01" max="0.5" step="0.01"
                            value={initialLr} onChange={(e) => setInitialLr(parseFloat(e.target.value))}
                            className="w-full accent-teal-500"
                        />
                    </div>

                    {schedule === 'step' && (
                        <>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Drop Factor (<Latex>{`$\\gamma$`}</Latex>)</span>
                                    <span className="font-mono text-teal-400">{gamma.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="0.9" step="0.1"
                                    value={gamma} onChange={(e) => setGamma(parseFloat(e.target.value))}
                                    className="w-full accent-teal-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Step Size (<Latex>{`$T$`}</Latex>)</span>
                                    <span className="font-mono text-teal-400">{stepSize} epochs</span>
                                </div>
                                <input
                                    type="range" min="5" max="50" step="5"
                                    value={stepSize} onChange={(e) => setStepSize(parseInt(e.target.value))}
                                    className="w-full accent-teal-500"
                                />
                            </div>
                        </>
                    )}

                    {schedule === 'exponential' && (
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Decay Rate (<Latex>{`$\\lambda$`}</Latex>)</span>
                                <span className="font-mono text-teal-400">{decayRate.toFixed(3)}</span>
                            </div>
                            <input
                                type="range" min="0.01" max="0.2" step="0.005"
                                value={decayRate} onChange={(e) => setDecayRate(parseFloat(e.target.value))}
                                className="w-full accent-teal-500"
                            />
                        </div>
                    )}

                    {schedule === 'polynomial' && (
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Power (<Latex>{`$p$`}</Latex>)</span>
                                <span className="font-mono text-teal-400">{power.toFixed(1)}</span>
                            </div>
                            <input
                                type="range" min="0.5" max="5" step="0.5"
                                value={power} onChange={(e) => setPower(parseFloat(e.target.value))}
                                className="w-full accent-teal-500"
                            />
                        </div>
                    )}

                    {schedule === 'cosine' && (
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Min LR (<Latex>{`$\\eta_{min}$`}</Latex>)</span>
                                <span className="font-mono text-teal-400">{minLr.toFixed(4)}</span>
                            </div>
                            <input
                                type="range" min="0.0001" max="0.05" step="0.001"
                                value={minLr} onChange={(e) => setMinLr(parseFloat(e.target.value))}
                                className="w-full accent-teal-500"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="p-6 h-[400px] w-full bg-slate-900">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                            dataKey="epoch"
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Training Epochs (t)', position: 'bottom', fill: '#94a3b8' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8' }}
                            label={{ value: 'Learning Rate (η)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#2dd4bf' }}
                            labelStyle={{ color: '#94a3b8' }}
                            formatter={(value: number) => [value.toFixed(4), 'Learning Rate']}
                        />
                        <Line
                            type="monotone"
                            dataKey="lr"
                            stroke="#2dd4bf"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#1e293b', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
