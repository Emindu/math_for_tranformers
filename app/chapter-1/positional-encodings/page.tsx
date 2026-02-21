"use client";

import React from 'react';
import { ChevronLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';

type Subsection = {
    number: string;
    title: string;
    description: string;
    href: string;
    color: string;
    comingSoon?: boolean;
};

const subsections: Subsection[] = [
    {
        number: "1.7.1",
        title: "Fourier Analysis of Positional Encodings",
        description: "Viewing positional encodings through the lens of Fourier analysis and continuous representations.",
        href: "/chapter-1/positional-encodings/fourier-analysis",
        color: "blue",
    },
    {
        number: "1.7.2",
        title: "Lie Groups and Lie Algebras",
        description: "The continuous symmetries of transformers, explored via Lie theory.",
        href: "/chapter-1/positional-encodings/lie-groups",
        color: "teal",
    },
    {
        number: "1.7.3",
        title: "Harmonic Analysis of Groups",
        description: "Generalizing Fourier analysis to non-commutative spaces and group representations.",
        href: "/chapter-1/positional-encodings/harmonic-analysis",
        color: "cyan",
    },
];

export default function PositionalEncodingsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.7: Positional Encodings: A Mathematical Perspective</p>
                    <p className="text-slate-600 mt-4 max-w-3xl">
                        Because self-attention is naturally permutation-equivariant, models require mechanisms to
                        inject sequence order into representations. This section rigorously explores positional
                        encodings using deep mathematical frameworks like Fourier Analysis, Lie Groups, and Harmonic Analysis.
                    </p>
                </div>

                {/* Subsection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {subsections.map((sub) => {
                        const colorMap: Record<string, { bg: string; text: string; border: string; hover: string; badge: string }> = {
                            blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hover: 'hover:border-blue-300', badge: 'bg-blue-100' },
                            teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hover: 'hover:border-teal-300', badge: 'bg-teal-100' },
                            cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', hover: 'hover:border-cyan-300', badge: 'bg-cyan-100' },
                        };
                        const c = colorMap[sub.color] || colorMap.blue;

                        if (sub.comingSoon) {
                            return (
                                <div key={sub.number} className="block bg-white border border-slate-200 rounded-2xl p-6 opacity-60">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`${c.badge} ${c.text} text-xs font-bold px-3 py-1 rounded-full`}>{sub.number}</span>
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Coming Soon</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4">{sub.description}</p>
                                </div>
                            );
                        }

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
