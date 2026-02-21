"use client";

import React, { useState, useMemo } from 'react';

/* ─────────────── Math helpers ─────────────── */

// Stirling approximation for log-gamma
function logGamma(x: number): number {
    if (x <= 0) return 0;
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
    x -= 1;
    const g = 7;
    const c = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ];
    let sum = c[0];
    for (let i = 1; i < g + 2; i++) sum += c[i] / (x + i);
    const t = x + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(sum);
}

function gamma(x: number): number {
    return Math.exp(logGamma(x));
}

// Volume of d-dimensional unit ball (r=0.5)
function hypersphereVolume(d: number): number {
    const r = 0.5;
    return (Math.pow(Math.PI, d / 2) / gamma(d / 2 + 1)) * Math.pow(r, d);
}

// Ratio Vsphere / Vcube
function volumeRatio(d: number): number {
    return hypersphereVolume(d); // cube volume is 1
}

// Distance concentration: std(dist)/mean(dist) for uniform random in [0,1]^d
function distanceConcentration(d: number): number {
    // For uniform distribution in [0,1]^d:
    // E[||x-y||^2] = d/6, Var[||x-y||^2] ≈ 7d/180
    // coefficient of variation ≈ 1/sqrt(d) * constant
    const mean = Math.sqrt(d / 6);
    const stdApprox = Math.sqrt(7 / 180) / (2 * Math.sqrt(d / 6)) * Math.sqrt(d);
    return stdApprox / mean;
}

/* ─────────────── Bar component ─────────────── */

function Bar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
    const width = Math.max(0.5, (value / maxValue) * 100);
    return (
        <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-slate-500 w-10 text-right font-mono">{label}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${width}%` }}
                />
            </div>
            <span className="text-[10px] text-slate-500 font-mono w-16 text-right">
                {value < 0.0001 ? value.toExponential(1) : value.toFixed(4)}
            </span>
        </div>
    );
}

/* ─────────────── Main component ─────────────── */

export default function DimensionalityLab() {
    const [maxDim, setMaxDim] = useState(20);
    const [tab, setTab] = useState<'volume' | 'distance'>('volume');

    // Volume ratio data
    const volumeData = useMemo(() => {
        const data: { d: number; ratio: number }[] = [];
        for (let d = 1; d <= maxDim; d++) {
            data.push({ d, ratio: volumeRatio(d) });
        }
        return data;
    }, [maxDim]);

    // Distance concentration data
    const distanceData = useMemo(() => {
        const data: { d: number; cv: number }[] = [];
        for (let d = 1; d <= maxDim; d++) {
            data.push({ d, cv: distanceConcentration(d) });
        }
        return data;
    }, [maxDim]);

    const maxVol = Math.max(...volumeData.map(d => d.ratio));
    const maxCV = Math.max(...distanceData.map(d => d.cv));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">High-Dimensional Geometry Lab</h3>
            <p className="text-sm text-slate-500 mb-4">
                Visualize how geometry changes as dimensions grow
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setTab('volume')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'volume' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Sphere vs Cube Volume
                </button>
                <button
                    onClick={() => setTab('distance')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${tab === 'distance' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                    Distance Concentration
                </button>
            </div>

            {/* Dimension slider */}
            <div className="flex items-center gap-3 mb-5">
                <span className="text-xs text-slate-500">Max dimension</span>
                <input
                    type="range" min={5} max={50} value={maxDim}
                    onChange={e => setMaxDim(Number(e.target.value))}
                    className="flex-1 accent-rose-600"
                />
                <span className="text-xs font-mono text-slate-700 w-6">{maxDim}</span>
            </div>

            {tab === 'volume' ? (
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Volume Ratio: V<sub>sphere</sub>(r=½) / V<sub>cube</sub> per dimension
                    </p>
                    <div className="max-h-[320px] overflow-y-auto pr-1">
                        {volumeData.map(({ d, ratio }) => (
                            <Bar
                                key={d}
                                label={`d=${d}`}
                                value={ratio}
                                maxValue={maxVol}
                                color="bg-gradient-to-r from-rose-400 to-rose-600"
                            />
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 text-center">
                        The inscribed sphere&apos;s volume vanishes exponentially — most volume is in the corners
                    </p>
                </div>
            ) : (
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Coefficient of Variation of pairwise distances (lower = more concentrated)
                    </p>
                    <div className="max-h-[320px] overflow-y-auto pr-1">
                        {distanceData.map(({ d, cv }) => (
                            <Bar
                                key={d}
                                label={`d=${d}`}
                                value={cv}
                                maxValue={maxCV}
                                color="bg-gradient-to-r from-amber-400 to-amber-600"
                            />
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 text-center">
                        As dimensions grow, all pairwise distances converge to the same value
                    </p>
                </div>
            )}

            <div className="mt-4 bg-rose-50 p-3 rounded-lg border border-rose-100">
                <p className="text-[10px] text-rose-700 font-semibold mb-1">Key Takeaway</p>
                <p className="text-[10px] text-rose-600">
                    In high dimensions, the inscribed sphere essentially vanishes and all distances become
                    nearly equal. This is why transformers use the <strong>scaling factor</strong> √d<sub>k</sub> in
                    attention — to counteract the concentration effect on dot products.
                </p>
            </div>
        </div>
    );
}
