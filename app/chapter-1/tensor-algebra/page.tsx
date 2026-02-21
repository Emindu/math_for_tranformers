"use client";

import React from 'react';
import { ChevronLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';

const subsections = [
    {
        number: "1.5.1",
        title: "Introduction to Tensors",
        description: "Tensor definitions, order and rank, tensor products, and notation conventions used throughout transformer literature.",
        href: "/chapter-1/tensor-algebra/introduction-to-tensors",
        color: "violet",
    },
    {
        number: "1.5.2",
        title: "Algebraic Structures in Transformers",
        description: "How tensor algebra underpins the key operations in transformer models — from embedding layers to feed-forward networks.",
        href: "/chapter-1/tensor-algebra/algebraic-structures",
        color: "cyan",
    },
    {
        number: "1.5.3",
        title: "Self-Attention Mechanisms",
        description: "A tensor-algebraic perspective on self-attention, multi-head attention, and the computational graph of transformers.",
        href: "/chapter-1/tensor-algebra/self-attention",
        color: "amber",
    },
];

export default function TensorAlgebraPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-violet-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.5: Tensor Algebra and Notation</p>
                    <p className="text-slate-600 mt-4 max-w-3xl">
                        Tensors are the fundamental data structures of deep learning. This section develops
                        the algebraic framework needed to rigorously describe how transformers manipulate
                        multi-dimensional arrays of numbers — from basic tensor operations to the full
                        self-attention mechanism expressed in tensor notation.
                    </p>
                </div>

                {/* Subsection Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subsections.map((sub) => {
                        const colorMap: Record<string, { bg: string; text: string; border: string; hover: string; badge: string }> = {
                            violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', hover: 'hover:border-violet-300', badge: 'bg-violet-100' },
                            cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', hover: 'hover:border-cyan-300', badge: 'bg-cyan-100' },
                            amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hover: 'hover:border-amber-300', badge: 'bg-amber-100' },
                        };
                        const c = colorMap[sub.color] || colorMap.violet;

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
