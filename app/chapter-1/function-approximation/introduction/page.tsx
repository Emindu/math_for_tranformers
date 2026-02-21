"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    IntroToApproximationTheory
} from '@/components/content/FunctionApproximationContent';
import FunctionApproximationLab from '@/components/math-viz/FunctionApproximationLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Approximating Functions",
        text: `At its core, a neural network is just a giant function approximator. If the universe generates a complex relationship between inputs—say, taking a photograph of a cat and outputting the word 'cat'—that entire relationship is a single mathematical function. The goal of representation learning is to build a sequence of simpler operations that mimic this complex target function.`,
    },
    {
        title: "Polynomial Density",
        text: `The Weierstrass Approximation Theorem gives us profound theoretical comfort: it states that any continuous function, no matter how chaotic, can be uniformly approximated using just polynomials. By adding more and more polynomial terms, we can fit the target function perfectly. This proves that simple basis functions are 'dense' enough to build anything.`,
    },
    {
        title: "Rate of Convergence",
        text: `But there is a catch: how fast does it converge? Jackson's Theorems prove that the smoother your target function is, the fewer terms you need for an accurate approximation. Conversely, if your target function has sharp transitions, anomalies, or lacks smoothness, you need a dramatically higher-degree polynomial—or in deep learning terms, a much larger, deeper, and more parameter-heavy neural network.`,
    },
];

export default function IntroToApproximationPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/function-approximation" className="inline-flex items-center text-slate-500 hover:text-teal-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Function Approximation Theory
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.9.1: Introduction to Approximation Theory</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="teal" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Intro */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 mx-auto">
                            <IntroToApproximationTheory />
                        </div>
                        <div className="flex flex-col gap-8 mt-12 xl:mt-0">
                            <div className="sticky top-8">
                                <FunctionApproximationLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-end">
                    <Link href="/chapter-1/function-approximation/universal-approximation"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next Chapter: Universal Approximation Theorems →
                    </Link>
                </div>
            </div>
        </main>
    );
}
