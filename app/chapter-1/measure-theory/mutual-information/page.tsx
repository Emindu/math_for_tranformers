"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
    MutualInformationIntro,
    MutualInformationProperties,
    InformationBottleneckContent,
    AttentionMutualInformationContent
} from '@/components/content/MutualInformationContent';
import MutualInfoVennLab from '@/components/math-viz/MutualInfoVennLab';
import DataProcessingLab from '@/components/math-viz/DataProcessingLab';
import InfoBottleneckLab from '@/components/math-viz/InfoBottleneckLab';
import AttentionInfoLab from '@/components/math-viz/AttentionInfoLab';

export default function MutualInformationPage() {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Navigation */}
                <div className="flex items-center space-x-4 mb-10">
                    <Link
                        href="/chapter-1/measure-theory"
                        className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2 font-medium"
                    >
                        <ArrowLeft size={20} />
                        Back to Measure Theory
                    </Link>
                </div>

                {/* Vertically Aligned Grid: Content on Left, Labs on Right */}
                <div className="space-y-24">

                    {/* Section 1. Definition and Entropy Venn */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <section className="sticky top-12">
                            <MutualInformationIntro />
                        </section>
                        <section className="sticky top-12">
                            <MutualInfoVennLab />
                        </section>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Section 2. Properties and DPI */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <section className="sticky top-12">
                            <MutualInformationProperties />
                        </section>
                        <section className="sticky top-12">
                            <DataProcessingLab />
                        </section>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Section 3. Information Bottleneck */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <section className="sticky top-12">
                            <InformationBottleneckContent />
                        </section>
                        <section className="sticky top-12">
                            <InfoBottleneckLab />
                        </section>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Section 4. Attention Heads */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <section className="sticky top-12">
                            <AttentionMutualInformationContent />
                        </section>
                        <section className="sticky top-12">
                            <AttentionInfoLab />
                        </section>
                    </div>

                </div>

                {/* Pagination/Next Section */}
                <div className="mt-20 pt-10 border-t border-slate-200 flex justify-between px-6 bg-slate-50 rounded-2xl">
                    <Link
                        href="/chapter-1/measure-theory/foundations"
                        className="group flex flex-col items-start pb-8"
                    >
                        <span className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                            <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                            Previous
                        </span>
                        <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            1.11.2 Foundations of Measure Theory
                        </span>
                    </Link>

                    <Link
                        href="/chapter-1/measure-theory"
                        className="group flex flex-col items-end pb-8"
                    >
                        <span className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                            Up Next
                            <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            1.11.4 Complexity and Generalization
                        </span>
                    </Link>
                </div>
            </main>
        </div>
    );
}
