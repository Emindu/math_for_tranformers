"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ConvergenceAnalysis, LearningRateSchedules } from '@/components/content/MatrixCalculusContent';
import ConvergenceLab from '@/components/math-viz/ConvergenceLab';
import LearningRateLab from '@/components/math-viz/LearningRateLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Optimization and Gradient Flow",
        text: `Optimization is the engine of training. In self-attention and transformers, the goal is to adjust parameters iteratively to minimize the loss function. This happens via gradient descent, where we step in the opposite direction of the gradient on the loss landscape.`,
    },
    {
        title: "Convergence Analysis",
        text: `For gradient descent to reach a minimum, the loss function needs certain mathematical properties like smoothness—meaning gradients don't change too violently—and an appropriately sized learning rate. If the learning rate is too large, the optimizer bounces around or diverges; if it's too small, training takes forever.`,
    },
    {
        title: "Learning Rate Schedules",
        text: `Because a fixed learning rate is rarely optimal throughout training, we use learning rate schedules. We might use step decay, polynomial decay, or a cosine curve to systematically reduce step sizes as we approach a minimum. Techniques like warm restarts occasionally bump the learning rate back up to help the model escape shallow local minima and find better regions of the parameter space.`,
    },
];

export default function GradientFlowPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/matrix-calculus" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Matrix Calculus
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.6.2: Optimization and Gradient Flow</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="indigo" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Convergence Analysis */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <ConvergenceAnalysis />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <ConvergenceLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Learning Rate Schedules */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <LearningRateSchedules />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <LearningRateLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/matrix-calculus/differentiation"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                        ← Back to 1.6.1 Differentiation
                    </Link>
                    {/* Placeholder for next chapter link */}
                    <div></div>
                </div>
            </div>
        </main>
    );
}
