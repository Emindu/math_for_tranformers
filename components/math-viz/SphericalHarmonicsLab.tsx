"use client";

import React, { useState } from 'react';
import Latex from 'react-latex-next';
import { Globe } from 'lucide-react';

export default function SphericalHarmonicsLab() {
    const [degreeL, setDegreeL] = useState(1);
    const [orderM, setOrderM] = useState(0);
    const [showGrid, setShowGrid] = useState(true);

    // Helper: Valid range for m is -l to l
    const handleLChange = (newL: number) => {
        setDegreeL(newL);
        if (orderM > newL) setOrderM(newL);
        if (orderM < -newL) setOrderM(-newL);
    };

    // ─────────────────────────────────────────────────────────────────
    // Visualization logic: We'll render a pseudo-3D sphere projection 
    // mapped with a color gradient representing the magnitude/phase
    // of the real part of the spherical harmonic Y_l^m.
    // ─────────────────────────────────────────────────────────────────

    // We'll use a 2D grid of (theta, phi) mapped to a circle
    const GRID_SIZE = 40;
    const RADIUS = 140;

    // Quick approximation of Associated Legendre Polynomials P_l^m(cos theta)
    // Only implemented for l=0 to 3 for demo purposes
    const getPlm = (l: number, m: number, x: number): number => {
        const absM = Math.abs(m);
        const y = Math.sqrt(1 - x * x); // sin(theta) if x = cos(theta)

        if (l === 0 && absM === 0) return 1;
        if (l === 1 && absM === 0) return x;
        if (l === 1 && absM === 1) return -y;
        if (l === 2 && absM === 0) return 0.5 * (3 * x * x - 1);
        if (l === 2 && absM === 1) return -3 * x * y;
        if (l === 2 && absM === 2) return 3 * y * y;
        if (l === 3 && absM === 0) return 0.5 * (5 * x * x * x - 3 * x);
        if (l === 3 && absM === 1) return -1.5 * y * (5 * x * x - 1);
        if (l === 3 && absM === 2) return 15 * x * y * y;
        if (l === 3 && absM === 3) return -15 * y * y * y;

        return 0; // Fallback
    };

    // Calculate the real part of Y_l^m (ignoring normalization constants for pure visual shape)
    const computeRealYlm = (l: number, m: number, theta: number, phi: number) => {
        const x = Math.cos(theta);
        const P = getPlm(l, m, x);

        // The real basis is often defined using cos(|m|phi) for m>0, sin(|m|phi) for m<0
        if (m > 0) {
            return P * Math.cos(m * phi);
        } else if (m < 0) {
            return getPlm(l, Math.abs(m), x) * Math.sin(Math.abs(m) * phi);
        } else {
            return P;
        }
    };

    // Color mapper based on value (-1 to 1 relative mapping)
    const getColor = (val: number, maxVal: number) => {
        // Normalize val to -1 to 1 based on an approximate expected max
        const norm = maxVal === 0 ? 0 : Math.max(-1, Math.min(1, val / maxVal));

        if (norm > 0) {
            // Positive -> Cyan
            const intensity = Math.round(norm * 255);
            return `rgb(${255 - intensity}, 255, 255)`; // White to Cyan
        } else {
            // Negative -> Orange/Red
            const intensity = Math.round(-norm * 255);
            return `rgb(255, ${255 - intensity}, ${255 - intensity})`; // White to Red
        }
    };

    // Generate pixels for the sphere
    const pixels = [];
    let maxVal = 0;

    // First pass: find max for normalization
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            // Map grid (i, j) to sphere coordinates
            // Map i, j from -1 to 1
            const nx = (j / (GRID_SIZE - 1)) * 2 - 1;
            const ny = (i / (GRID_SIZE - 1)) * 2 - 1;

            // Only consider points inside the 2D projected circle
            if (nx * nx + ny * ny <= 1) {
                // Determine z coordinate assuming unit sphere x^2 + y^2 + z^2 = 1
                const nz = Math.sqrt(1 - nx * nx - ny * ny);

                // Convert (nx, ny, nz) to spherical coordinates (theta, phi)
                const theta = Math.acos(ny); // polar angle from y-axis
                const phi = Math.atan2(nz, nx); // azimuthal angle

                const val = computeRealYlm(degreeL, orderM, theta, phi);
                if (Math.abs(val) > maxVal) maxVal = Math.abs(val);
            }
        }
    }
    if (maxVal === 0) maxVal = 1;

    // Second pass: generate colored rects
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const nx = (j / (GRID_SIZE - 1)) * 2 - 1;
            const ny = (i / (GRID_SIZE - 1)) * 2 - 1;

            if (nx * nx + ny * ny <= 1) {
                const nz = Math.sqrt(1 - nx * nx - ny * ny);
                const theta = Math.acos(ny);
                const phi = Math.atan2(nz, nx);

                const val = computeRealYlm(degreeL, orderM, theta, phi);

                // Add shading based on z-depth for 3D effect
                // Dim the edges where z is close to 0
                const shading = 0.4 + 0.6 * nz;

                pixels.push({
                    x: j * (2 * RADIUS / GRID_SIZE) - RADIUS,
                    y: i * (2 * RADIUS / GRID_SIZE) - RADIUS,
                    w: (2 * RADIUS / GRID_SIZE) + 0.5,
                    val: val,
                    color: getColor(val, maxVal),
                    opacity: shading
                });
            }
        }
    }

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2 self-start w-full">
                <Globe className="text-cyan-600" size={20} />
                <h3 className="text-xl font-bold text-slate-800">Spherical Harmonics <Latex>{'$Y_\\ell^m$'}</Latex></h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 self-start">
                Visualize the real basis of spherical harmonics defined on the surface of a sphere.
                Red regions are negative, cyan regions are positive.
            </p>

            {/* Visualization */}
            <div className="w-full flex justify-center mb-8 relative">
                <div
                    className="relative bg-black rounded-full shadow-inner overflow-hidden flex items-center justify-center transform transition-transform hover:scale-105"
                    style={{ width: RADIUS * 2, height: RADIUS * 2 }}
                >
                    {/* Render the mapped pixels map */}
                    <div className="absolute inset-0 z-0 opacity-80" style={{ mixBlendMode: 'screen' }}>
                        {pixels.map((p, idx) => (
                            <div
                                key={idx}
                                className="absolute"
                                style={{
                                    left: RADIUS + p.x,
                                    top: RADIUS + p.y,
                                    width: p.w,
                                    height: p.w,
                                    backgroundColor: p.color,
                                    opacity: p.opacity
                                }}
                            />
                        ))}
                    </div>

                    {/* Overlay Grid lines for 3D context */}
                    {showGrid && (
                        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-30">
                            {/* Latitudes */}
                            <ellipse cx={RADIUS} cy={RADIUS} rx={RADIUS} ry={RADIUS * 0.5} fill="none" stroke="white" strokeWidth="0.5" />
                            <ellipse cx={RADIUS} cy={RADIUS} rx={RADIUS} ry={RADIUS * 0.8} fill="none" stroke="white" strokeWidth="0.5" />
                            <line x1={0} y1={RADIUS} x2={RADIUS * 2} y2={RADIUS} stroke="white" strokeWidth="0.5" />

                            {/* Longitudes */}
                            <ellipse cx={RADIUS} cy={RADIUS} rx={RADIUS * 0.5} ry={RADIUS} fill="none" stroke="white" strokeWidth="0.5" />
                            <ellipse cx={RADIUS} cy={RADIUS} rx={RADIUS * 0.8} ry={RADIUS} fill="none" stroke="white" strokeWidth="0.5" />
                            <line x1={RADIUS} y1={0} x2={RADIUS} y2={RADIUS * 2} stroke="white" strokeWidth="0.5" />
                        </svg>
                    )}

                    {/* Lighting highlight */}
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full blur-xl opacity-20 mix-blend-overlay z-20 pointer-events-none"></div>
                </div>

                {/* Legend */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 bg-white/80 p-2 rounded-lg text-[10px] font-mono shadow-sm border border-slate-200">
                    <span>+</span>
                    <div className="w-3 h-24 bg-gradient-to-t from-red-500 via-white to-cyan-400 rounded-sm"></div>
                    <span>-</span>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full bg-white p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Degree l slider */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-slate-700">Degree (<Latex>{'$\\ell$'}</Latex>)</label>
                        <span className="font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">{degreeL}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={3}
                        step={1}
                        value={degreeL}
                        onChange={(e) => handleLChange(parseInt(e.target.value))}
                        className="w-full accent-cyan-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Determines total number of nodal lines</p>
                </div>

                {/* Order m slider */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-slate-700">Order (<Latex>{'$m$'}</Latex>)</label>
                        <span className="font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">{orderM}</span>
                    </div>
                    <input
                        type="range"
                        min={-degreeL}
                        max={degreeL}
                        step={1}
                        value={orderM}
                        onChange={(e) => setOrderM(parseInt(e.target.value))}
                        className="w-full accent-cyan-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Determines longitudinal nodal lines: <Latex>{'$-\\ell \\leq m \\leq \\ell$'}</Latex></p>
                </div>
            </div>

            <div className="w-full flex justify-between items-center mt-4">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-cyan-700 transition-colors">
                    <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="accent-cyan-600 rounded"
                    />
                    Show 3D Sphere Wireframe
                </label>
            </div>
        </div>
    );
}
