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
        number: "1.6.1",
        title: "Differentiation of Matrix Functions",
        description: "Derivatives of scalar, vector, and matrix functions — the chain rule for matrices and its role in backpropagation through transformer layers.",
        href: "/chapter-1/matrix-calculus/differentiation",
        color: "rose",
    },
    {
        number: "1.6.2",
        title: "Optimization and Gradient Flow",
        description: "Gradient descent on matrix-valued loss functions, the geometry of optimization landscapes, and how gradients flow through attention layers.",
        href: "/chapter-1/matrix-calculus/gradient-flow",
        color: "indigo",
    },
];

export default function MatrixCalculusPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-rose-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.6: Matrix Calculus in Self-attention</p>
                    <p className="text-slate-600 mt-4 max-w-3xl">
                        Matrix calculus provides the mathematical machinery for training transformers.
                        This section develops the tools for differentiating matrix-valued functions,
                        computing gradients through attention layers, and understanding how optimization
                        shapes the learned representations.
                    </p>
                </div>

                {/* Subsection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {subsections.map((sub) => {
                        const colorMap: Record<string, { bg: string; text: string; border: string; hover: string; badge: string }> = {
                            rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hover: 'hover:border-rose-300', badge: 'bg-rose-100' },
                            indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hover: 'hover:border-indigo-300', badge: 'bg-indigo-100' },
                        };
                        const c = colorMap[sub.color] || colorMap.rose;

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
