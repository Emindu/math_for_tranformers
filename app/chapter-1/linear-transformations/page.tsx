"use client";

import React from 'react';
import LinearTransformationsContent from '@/components/content/LinearTransformations';
import LinearTransformationLab from '@/components/math-viz/LinearTransformationLab';
import KernelImageLab from '@/components/math-viz/KernelImageLab';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function LinearTransformationsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1: Representing Data as Vectors</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Left: Content */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <LinearTransformationsContent />
                    </div>

                    {/* Right: Viz */}
                    <div className="flex flex-col gap-8">
                        <div className="sticky top-8">
                            <LinearTransformationLab />

                            <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <h3 className="font-semibold text-indigo-900 mb-2">Why this matters for Transformers?</h3>
                                <p className="text-sm text-indigo-800">
                                    In Transformers, the <strong>Query (Q)</strong>, <strong>Key (K)</strong>, and <strong>Value (V)</strong> matrices are linear transformations applied to input embeddings.
                                    The Attention mechanism itself is a composition of these transformations, projecting data into subspaces where similarity can be computed.
                                    Understanding how matrices transform space helps demystify the inner workings of <Latex>{'$\\text{Softmax}(QK^T/\\sqrt{d_k})V$'}</Latex>.
                                </p>
                            </div>

                            <KernelImageLab />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
