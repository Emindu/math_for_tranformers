"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Homomorphism definitions ────────────────────────────────────────────────────
interface HomDef {
    name: string;
    latex: string;
    domainName: string;
    domainLatex: string;
    codomainName: string;
    codomainLatex: string;
    domain: string[];
    codomain: string[];
    map: number[];        // map[i] = index in codomain that domain[i] maps to
    kernelIndices: number[];   // indices in domain that map to identity
    isInjective: boolean;
    isSurjective: boolean;
}

const HOMOMORPHISMS: Record<string, HomDef> = {
    mod3: {
        name: "φ: ℤ₆ → ℤ₃",
        latex: "$\\varphi: \\mathbb{Z}_6 \\to \\mathbb{Z}_3$",
        domainName: "ℤ₆",
        domainLatex: "$\\mathbb{Z}_6$",
        codomainName: "ℤ₃",
        codomainLatex: "$\\mathbb{Z}_3$",
        domain: ["0", "1", "2", "3", "4", "5"],
        codomain: ["0", "1", "2"],
        map: [0, 1, 2, 0, 1, 2],           // φ(x) = x mod 3
        kernelIndices: [0, 3],              // ker = {0, 3}
        isInjective: false,
        isSurjective: true,
    },
    mod2: {
        name: "φ: ℤ₆ → ℤ₂",
        latex: "$\\varphi: \\mathbb{Z}_6 \\to \\mathbb{Z}_2$",
        domainName: "ℤ₆",
        domainLatex: "$\\mathbb{Z}_6$",
        codomainName: "ℤ₂",
        codomainLatex: "$\\mathbb{Z}_2$",
        domain: ["0", "1", "2", "3", "4", "5"],
        codomain: ["0", "1"],
        map: [0, 1, 0, 1, 0, 1],           // φ(x) = x mod 2
        kernelIndices: [0, 2, 4],           // ker = {0, 2, 4}
        isInjective: false,
        isSurjective: true,
    },
    embed: {
        name: "φ: ℤ₃ → ℤ₆",
        latex: "$\\varphi: \\mathbb{Z}_3 \\to \\mathbb{Z}_6$",
        domainName: "ℤ₃",
        domainLatex: "$\\mathbb{Z}_3$",
        codomainName: "ℤ₆",
        codomainLatex: "$\\mathbb{Z}_6$",
        domain: ["0", "1", "2"],
        codomain: ["0", "1", "2", "3", "4", "5"],
        map: [0, 2, 4],                    // φ(x) = 2x
        kernelIndices: [0],                 // ker = {0} (injective)
        isInjective: true,
        isSurjective: false,
    },
    identity: {
        name: "φ: ℤ₄ → ℤ₄",
        latex: "$\\varphi: \\mathbb{Z}_4 \\to \\mathbb{Z}_4$",
        domainName: "ℤ₄",
        domainLatex: "$\\mathbb{Z}_4$",
        codomainName: "ℤ₄",
        codomainLatex: "$\\mathbb{Z}_4$",
        domain: ["0", "1", "2", "3"],
        codomain: ["0", "1", "2", "3"],
        map: [0, 1, 2, 3],                 // identity isomorphism
        kernelIndices: [0],
        isInjective: true,
        isSurjective: true,
    },
};

// Color palettes
const DOMAIN_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#c084fc",
    "#818cf8", "#7c3aed", "#6d28d9", "#5b21b6",
];
const CODOMAIN_COLORS = [
    "#10b981", "#34d399", "#6ee7b7", "#a7f3d0",
    "#059669", "#047857",
];
const KERNEL_COLOR = "#ef4444";

// ── Arrow Diagram ───────────────────────────────────────────────────────────────
function ArrowDiagram({ hom, hoveredDomain, setHoveredDomain }: {
    hom: HomDef;
    hoveredDomain: number | null;
    setHoveredDomain: (i: number | null) => void;
}) {
    const domN = hom.domain.length;
    const codN = hom.codomain.length;
    const maxN = Math.max(domN, codN);

    const width = 420;
    const height = Math.max(200, maxN * 46 + 60);
    const domX = 80;
    const codX = width - 80;
    const startY = 40;
    const domSpacing = (height - 2 * startY) / Math.max(domN - 1, 1);
    const codSpacing = (height - 2 * startY) / Math.max(codN - 1, 1);

    const domPositions = hom.domain.map((_, i) => ({
        x: domX,
        y: startY + i * domSpacing,
    }));
    const codPositions = hom.codomain.map((_, i) => ({
        x: codX,
        y: startY + i * codSpacing,
    }));

    // Compute image set
    const imageSet = new Set(hom.map);

    return (
        <svg width={width} height={height} className="mx-auto">
            {/* Labels */}
            <text x={domX} y={18} textAnchor="middle" fill="#94a3b8" fontSize={13} fontWeight="bold">
                {hom.domainName}
            </text>
            <text x={codX} y={18} textAnchor="middle" fill="#94a3b8" fontSize={13} fontWeight="bold">
                {hom.codomainName}
            </text>

            {/* Ellipse outlines */}
            <ellipse cx={domX} cy={height / 2} rx={48} ry={height / 2 - 10}
                fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="4 3" />
            <ellipse cx={codX} cy={height / 2} rx={48} ry={height / 2 - 10}
                fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="4 3" />

            {/* Arrows */}
            {hom.domain.map((_, i) => {
                const from = domPositions[i];
                const to = codPositions[hom.map[i]];
                const isKernel = hom.kernelIndices.includes(i);
                const isHovered = hoveredDomain === i;
                const dimmed = hoveredDomain !== null && !isHovered;

                // Cubic bezier for a nice curve
                const cx1 = from.x + 80;
                const cx2 = to.x - 80;

                return (
                    <motion.path
                        key={`arrow-${i}`}
                        d={`M ${from.x + 18} ${from.y} C ${cx1} ${from.y}, ${cx2} ${to.y}, ${to.x - 18} ${to.y}`}
                        fill="none"
                        stroke={isKernel ? KERNEL_COLOR : (isHovered ? "#f59e0b" : "#475569")}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        strokeDasharray={isKernel ? "6 3" : "none"}
                        opacity={dimmed ? 0.15 : 1}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, opacity: dimmed ? 0.15 : 1 }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        markerEnd="url(#arrowHead)"
                    />
                );
            })}

            {/* Arrow marker */}
            <defs>
                <marker id="arrowHead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                    <path d="M0,0 L8,3 L0,6 Z" fill="#475569" />
                </marker>
            </defs>

            {/* Domain nodes */}
            {hom.domain.map((el, i) => {
                const pos = domPositions[i];
                const isKernel = hom.kernelIndices.includes(i);
                const isHovered = hoveredDomain === i;
                return (
                    <g key={`dom-${i}`}
                        onMouseEnter={() => setHoveredDomain(i)}
                        onMouseLeave={() => setHoveredDomain(null)}
                        style={{ cursor: "pointer" }}
                    >
                        <motion.circle
                            cx={pos.x} cy={pos.y} r={16}
                            fill={isKernel ? KERNEL_COLOR : DOMAIN_COLORS[i % DOMAIN_COLORS.length]}
                            stroke={isHovered ? "#f59e0b" : "transparent"}
                            strokeWidth={3}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05, type: "spring" }}
                        />
                        <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                            fill="white" fontSize={12} fontWeight="bold" pointerEvents="none">
                            {el}
                        </text>
                    </g>
                );
            })}

            {/* Codomain nodes */}
            {hom.codomain.map((el, i) => {
                const pos = codPositions[i];
                const inImage = imageSet.has(i);
                const isTarget = hoveredDomain !== null && hom.map[hoveredDomain] === i;
                return (
                    <g key={`cod-${i}`}>
                        <motion.circle
                            cx={pos.x} cy={pos.y} r={16}
                            fill={inImage ? CODOMAIN_COLORS[i % CODOMAIN_COLORS.length] : "#334155"}
                            stroke={isTarget ? "#f59e0b" : (inImage ? "transparent" : "#475569")}
                            strokeWidth={isTarget ? 3 : 1.5}
                            strokeDasharray={!inImage ? "3 2" : "none"}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05, type: "spring" }}
                        />
                        <text x={pos.x} y={pos.y + 4} textAnchor="middle"
                            fill="white" fontSize={12} fontWeight="bold" pointerEvents="none">
                            {el}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

// ── First Isomorphism Theorem Visualization ─────────────────────────────────────
function IsomorphismTheoremViz({ hom }: { hom: HomDef }) {
    const imageSize = new Set(hom.map).size;
    const kernelSize = hom.kernelIndices.length;
    const quotientOrder = hom.domain.length / kernelSize;

    // Build cosets of the kernel
    const visited = new Set<number>();
    const cosets: number[][] = [];
    for (let g = 0; g < hom.domain.length; g++) {
        if (visited.has(g)) continue;
        const coset = hom.kernelIndices.map(k => (g + k) % hom.domain.length);
        const unique = [...new Set(coset)].sort((a, b) => a - b);
        unique.forEach(el => visited.add(el));
        cosets.push(unique);
    }

    const barMaxW = 180;

    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="text-center mb-4">
                <span className="text-slate-300 text-sm font-medium">
                    <Latex>{"$G / \\ker(\\varphi) \\cong \\text{Im}(\\varphi)$"}</Latex>
                </span>
            </div>

            <div className="space-y-3">
                {/* G/ker(φ) */}
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-20 shrink-0">G/ker(φ)</span>
                    <div className="flex gap-1">
                        {cosets.map((coset, ci) => (
                            <motion.div
                                key={ci}
                                className="flex items-center justify-center rounded text-xs font-bold"
                                style={{
                                    width: Math.max(28, barMaxW / cosets.length - 2),
                                    height: 28,
                                    backgroundColor: DOMAIN_COLORS[ci % DOMAIN_COLORS.length],
                                    color: "#fff",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: ci * 0.08, type: "spring" }}
                            >
                                {`{${coset.map(i => hom.domain[i]).join(",")}}`}
                            </motion.div>
                        ))}
                    </div>
                    <span className="text-indigo-300 font-bold text-sm">{quotientOrder}</span>
                </div>

                {/* ≅ */}
                <div className="text-center text-slate-400 text-lg font-bold">≅</div>

                {/* Im(φ) */}
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono w-20 shrink-0">Im(φ)</span>
                    <div className="flex gap-1">
                        {[...new Set(hom.map)].sort((a, b) => a - b).map((idx, i) => (
                            <motion.div
                                key={i}
                                className="flex items-center justify-center rounded text-xs font-bold"
                                style={{
                                    width: Math.max(28, barMaxW / imageSize - 2),
                                    height: 28,
                                    backgroundColor: CODOMAIN_COLORS[idx % CODOMAIN_COLORS.length],
                                    color: "#fff",
                                }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
                            >
                                {hom.codomain[idx]}
                            </motion.div>
                        ))}
                    </div>
                    <span className="text-emerald-300 font-bold text-sm">{imageSize}</span>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700">
                <div className="flex justify-center gap-6 text-xs">
                    <span className="text-slate-400">
                        |ker(φ)| = <span className="text-red-400 font-bold">{kernelSize}</span>
                    </span>
                    <span className="text-slate-400">
                        |Im(φ)| = <span className="text-emerald-400 font-bold">{imageSize}</span>
                    </span>
                    <span className="text-slate-400">
                        |G| = <span className="text-indigo-400 font-bold">{hom.domain.length}</span> = {kernelSize} × {imageSize}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Equivariance Layer Diagram ──────────────────────────────────────────────────
function EquivarianceDiagram() {
    const [step, setStep] = useState(0);
    const maxStep = 3;

    const stages = [
        { label: "Input x", desc: "Original data point in X" },
        { label: "φ(x)", desc: "Embedded into feature space V" },
        { label: "ρ(g)φ(x)", desc: "Group action applied in V" },
        { label: "T₁(ρ(g)φ(x))", desc: "Layer preserves equivariance" },
    ];

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Equivariance Through Layers
            </h4>
            <p className="text-xs text-slate-500 mb-4">
                How group homomorphisms ensure symmetry preservation through transformer layers
            </p>

            <div className="flex items-center justify-between gap-2 mb-4">
                {stages.map((s, i) => (
                    <motion.div
                        key={i}
                        className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${i <= step
                                ? 'border-indigo-400 bg-indigo-50'
                                : 'border-slate-200 bg-slate-50'
                            }`}
                        animate={{ opacity: i <= step ? 1 : 0.4 }}
                    >
                        <div className={`text-xs font-bold ${i <= step ? 'text-indigo-700' : 'text-slate-400'}`}>
                            {s.label}
                        </div>
                        <div className={`text-[10px] mt-1 ${i <= step ? 'text-indigo-500' : 'text-slate-400'}`}>
                            {s.desc}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Arrows between stages */}
            <div className="flex justify-center gap-4 mb-4">
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        className="text-lg"
                        animate={{ opacity: i < step ? 1 : 0.2, color: i < step ? "#6366f1" : "#cbd5e1" }}
                    >
                        →
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map(i => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${step === i
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
                <Latex>{"$\\varphi(\\alpha_g(x)) = \\rho(g)\\varphi(x)$"}</Latex>
                <span className="mx-2">—</span>
                The equivariance condition
            </div>
        </div>
    );
}

// ── Main Lab Component ──────────────────────────────────────────────────────────
export default function HomomorphismLab() {
    const [homKey, setHomKey] = useState<string>("mod3");
    const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<"map" | "theorem" | "equivariance">("map");

    const hom = HOMOMORPHISMS[homKey];

    const typeLabel = useMemo(() => {
        if (hom.isInjective && hom.isSurjective) return { text: "Isomorphism", color: "bg-emerald-100 text-emerald-700" };
        if (hom.isInjective) return { text: "Injective (Monomorphism)", color: "bg-blue-100 text-blue-700" };
        if (hom.isSurjective) return { text: "Surjective (Epimorphism)", color: "bg-amber-100 text-amber-700" };
        return { text: "Homomorphism", color: "bg-slate-100 text-slate-700" };
    }, [hom]);

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800">Homomorphism Explorer</h3>
                <p className="text-sm text-slate-600 mt-1">
                    Visualize group homomorphisms, kernels, and the First Isomorphism Theorem
                </p>
            </div>

            {/* Homomorphism selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(HOMOMORPHISMS).map(([key, h]) => (
                    <button
                        key={key}
                        onClick={() => { setHomKey(key); setHoveredDomain(null); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${homKey === key
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        {h.name}
                    </button>
                ))}
            </div>

            {/* Type badge */}
            <div className="flex items-center gap-3 mb-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeLabel.color}`}>
                    {typeLabel.text}
                </span>
                <span className="text-xs text-slate-500">
                    ker(φ) = {"{"}{hom.kernelIndices.map(i => hom.domain[i]).join(", ")}{"}"}
                </span>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-5 bg-slate-200 rounded-lg p-1">
                {([
                    { key: "map", label: "Arrow Diagram" },
                    { key: "theorem", label: "1st Isomorphism Thm" },
                    { key: "equivariance", label: "Equivariance" },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-3 py-2 rounded-md text-xs font-semibold transition-all ${activeTab === tab.key
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === "map" && (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 overflow-x-auto">
                            <ArrowDiagram
                                hom={hom}
                                hoveredDomain={hoveredDomain}
                                setHoveredDomain={setHoveredDomain}
                            />
                        </div>
                        <div className="mt-3 flex gap-4 justify-center text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: KERNEL_COLOR }}></span>
                                Kernel elements
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-slate-400 border border-dashed border-slate-500"></span>
                                Not in image
                            </span>
                        </div>
                    </motion.div>
                )}

                {activeTab === "theorem" && (
                    <motion.div
                        key="theorem"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <IsomorphismTheoremViz hom={hom} />
                    </motion.div>
                )}

                {activeTab === "equivariance" && (
                    <motion.div
                        key="equivariance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <EquivarianceDiagram />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Insight box */}
            <div className="mt-6 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800">
                <p>
                    <strong>Observation:</strong> Hover over domain elements to trace where they map.
                    Elements in <span className="text-red-600 font-bold">red</span> form the <strong>kernel</strong> — they
                    all collapse to the identity. The First Isomorphism Theorem tells us that the
                    &ldquo;collapsed&rdquo; group <Latex>{"$G/\\ker(\\varphi)$"}</Latex> is structurally identical to the image.
                </p>
            </div>
        </div>
    );
}
