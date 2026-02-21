"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { GradientDescentContent } from '@/components/content/OptimizationContent';
import GradientDescentVariantsLab from '@/components/math-viz/GradientDescentVariantsLab';
import LearningRateScheduleLab from '@/components/math-viz/LearningRateScheduleLab';

export default function GradientDescentPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <Link href="/chapter-1/optimization-techniques" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ChevronLeft size={16} /> Back to Optimization Techniques
                </Link>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Content Section (Left) */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 h-fit">
                        <GradientDescentContent />
                    </div>

                    {/* Interactive Lab Section (Right) */}
                    <div className="flex flex-col gap-12 pt-8">
                        <div>
                            <GradientDescentVariantsLab />
                        </div>
                        <div>
                            <LearningRateScheduleLab />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-end items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <Link href="/chapter-1/optimization-techniques/saddle-points"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next Chapter: Saddle Points and Local Minima → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
