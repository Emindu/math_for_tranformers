"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
    BasicProbabilityIntro,
    ProbabilitySpacesContent,
    RandomVariablesContent,
    LlnCltContent,
    EntropyContent,
    BayesianContent,
    KLDivergenceContent
} from '@/components/content/MeasureTheoryContent';

import ProbabilityMeasureLab from '@/components/math-viz/ProbabilityMeasureLab';
import RandomVariablesLab from '@/components/math-viz/RandomVariablesLab';
import LawOfLargeNumbersLab from '@/components/math-viz/LawOfLargeNumbersLab';
import BayesianInferenceLab from '@/components/math-viz/BayesianInferenceLab';
import EntropyLab from '@/components/math-viz/EntropyLab';
import KLDivergenceLab from '@/components/math-viz/KLDivergenceLab';

export default function BasicProbabilityPage() {

    // Force math typesetting on unmount/mount to ensure all new dynamic content renders correctly
    useEffect(() => {
        if (typeof window !== 'undefined' && window.MathJax) {
            window.MathJax.typesetPromise();
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/chapter-1/measure-theory"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Measure Theory
                    </Link>
                </div>

                {/* Page Intro header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-12">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                        Chapter 1.11.1
                    </span>
                    <BasicProbabilityIntro />
                </div>

                {/* Concept 1: Probability Spaces aligned with Measure Lab */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <ProbabilitySpacesContent />
                    </div>
                    <div className="sticky top-8">
                        <ProbabilityMeasureLab />
                    </div>
                </div>

                {/* Concept 2: Random Variables & Moments */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <RandomVariablesContent />
                    </div>
                    <div className="sticky top-8">
                        <RandomVariablesLab />
                    </div>
                </div>

                {/* Concept 3: Law of Large Numbers & CLT */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <LlnCltContent />
                    </div>
                    <div className="sticky top-8">
                        <LawOfLargeNumbersLab />
                    </div>
                </div>

                {/* Concept 4: Shannon Entropy */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <EntropyContent />
                    </div>
                    <div className="sticky top-8">
                        <EntropyLab />
                    </div>
                </div>

                {/* Concept 5: Bayesian Inference */}
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <BayesianContent />
                    </div>
                    <div className="sticky top-8">
                        <BayesianInferenceLab />
                    </div>
                </div>

                {/* Concept 6: KL Divergence & Cross Entropy */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                        <KLDivergenceContent />
                    </div>
                    <div className="sticky top-8">
                        <KLDivergenceLab />
                    </div>
                </div>

            </div>
        </div>
    );
}
