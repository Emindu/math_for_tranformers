"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { UniversalApproximationTheorems } from '@/components/content/FunctionApproximationContent';
import UniversalApproximationLab from '@/components/math-viz/UniversalApproximationLab';
import SelfAttentionApproximationLab from '@/components/math-viz/SelfAttentionApproximationLab';

export default function UniversalApproximationPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/chapter-1/function-approximation" className="inline-flex items-center text-slate-500 hover:text-teal-600 mb-8 transition-colors">
                    <ChevronLeft size={16} /> Back to Function Approximation
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-8">
                    <div className="mb-8">
                        <h2 className="text-sm font-bold text-teal-600 tracking-wider uppercase mb-1">Section 1.9.2</h2>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Universal Approximation Theorems</h1>
                    </div>

                    <UniversalApproximationLab />

                    <UniversalApproximationTheorems />

                    <SelfAttentionApproximationLab />
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-between items-center mb-8">
                    <Link href="/chapter-1/function-approximation/introduction"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-700 font-semibold transition-colors py-2 px-4 rounded-xl hover:bg-cyan-50 border border-transparent hover:border-cyan-100">
                        ← Previous: Introduction to Approximation Theory
                    </Link>
                    <Link href="/chapter-1/function-approximation/expressivity"
                        className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next Chapter: Expressivity in Transformer Models →
                    </Link>
                </div>
            </div>
        </main>
    );
}

