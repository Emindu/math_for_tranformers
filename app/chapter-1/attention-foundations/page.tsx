"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

const subsections = [
    {
        number: "1.4.1",
        title: "Attention as a Mapping",
        description: "Formulation of scaled dot-product attention, Q/K/V matrices, softmax normalization, and key mathematical properties.",
        href: "/chapter-1/attention-foundations/attention-as-mapping",
        color: "indigo",
    },
    {
        number: "1.4.2",
        title: "The Geometry of High-Dimensional Spaces",
        description: "Curse of dimensionality, concentration of measure, and geometric intuitions for attention in high dimensions.",
        href: "/chapter-1/attention-foundations/high-dimensional-geometry",
        color: "rose",
    },
    {
        number: "1.4.3",
        title: "Applications in Transformer Architectures",
        description: "Multi-head attention, cross-attention, encoder-decoder patterns, and architectural design principles.",
        href: "/chapter-1/attention-foundations/applications",
        color: "emerald",
    },
];

export default function AttentionFoundationsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.4: Mathematical Foundations of Attention</p>
                    <p className="text-slate-600 mt-4 max-w-3xl">
                        Dive deep into the mathematical structures that make attention mechanisms work.
                        From the formulation of attention as a mapping to the geometric properties of
                        high-dimensional spaces, this section builds the rigorous foundation needed to
                        understand modern transformer architectures.
                    </p>
                </div>

                {/* Subsection Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subsections.map((sub) => {
                        const colorMap: Record<string, { bg: string; text: string; border: string; hover: string; badge: string }> = {
                            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hover: 'hover:border-indigo-300', badge: 'bg-indigo-100' },
                            rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hover: 'hover:border-rose-300', badge: 'bg-rose-100' },
                            emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hover: 'hover:border-emerald-300', badge: 'bg-emerald-100' },
                        };
                        const c = colorMap[sub.color] || colorMap.indigo;

                        return (
                            <Link key={sub.number} href={sub.href}
                                className={`group block bg-white border ${c.border} rounded-2xl p-6 hover:shadow-xl ${c.hover} transition-all`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`${c.badge} ${c.text} text-xs font-bold px-3 py-1 rounded-full`}>{sub.number}</span>
                                    <MoveRight className={`text-slate-400 group-hover:${c.text} group-hover:translate-x-1 transition-all`} size={20} />
                                </div>
                                <h3 className={`text-xl font-bold text-slate-900 mb-2 group-hover:${c.text} transition-colors`}>{sub.title}</h3>
                                <p className="text-slate-500 text-sm mb-4">{sub.description}</p>
                                <div className={`flex items-center gap-2 text-sm ${c.text} font-medium`}>
                                    Start Chapter
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
