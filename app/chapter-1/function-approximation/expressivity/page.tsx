"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ExpressivityInTransformers } from '@/components/content/FunctionApproximationContent';
import TransformerExpressivityLab from '@/components/math-viz/TransformerExpressivityLab';
import NonLinearityRoleLab from '@/components/math-viz/NonLinearityRoleLab';

export default function ExpressivityPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/chapter-1/function-approximation" className="inline-flex items-center text-slate-500 hover:text-emerald-700 mb-8 transition-colors">
                    <ChevronLeft size={16} /> Back to Function Approximation
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-8">
                    <div className="mb-8">
                        <h2 className="text-sm font-bold text-emerald-600 tracking-wider uppercase mb-1">Section 1.9.3</h2>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Expressivity in Transformer Models</h1>
                    </div>

                    <TransformerExpressivityLab />

                    <ExpressivityInTransformers />

                    <NonLinearityRoleLab />
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-start items-center mb-8">
                    <Link href="/chapter-1/function-approximation/universal-approximation"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700 font-semibold transition-colors py-2 px-4 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100">
                        ← Previous: Universal Approximation Theorems
                    </Link>
                </div>
            </div>
        </main>
    );
}
