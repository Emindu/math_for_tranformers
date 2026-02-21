"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    LieGroupsAndAlgebras,
    LieRepresentationsAndApplications
} from '@/components/content/PositionalEncodingsContent';
import LieGroupLab from '@/components/math-viz/LieGroupLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Continuous Transformations",
        text: `Unlike discrete groups which just hop from state A to B, Lie Groups represent smooth, continuous transformations. Think of rotating a dial smoothly rather than clicking a switch. In models, data like images inherently possess continuous symmetries—an object is still the same object even if you rotate it slightly.`,
    },
    {
        title: "The Magic of Lie Algebras",
        text: `The Lie Algebra is the most powerful concept here. It represents the 'tangent space' or infinitesimal generator of a Lie Group. Instead of dealing with complex, non-linear rotation matrices, the Lie algebra provides a linearized 'velocity' matrix. You can essentially add these linear components together and then use an 'exponential map' to recover the full, complex transformation.`,
    },
    {
        title: "Why Transformers Care",
        text: `Transformers process elements in a permutation-invariant manner, relying on positional encodings to understand sequence order. By interpreting these encodings through Lie groups, we can force the attention mechanism to inherently 'understand' translations or rotations without having to learn them from scratch. If layer weights are constrained cleanly to a Lie Algebra, the transformer guarantees mathematical equivariance.`,
    },
];

export default function LieGroupsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/positional-encodings" className="inline-flex items-center text-slate-500 hover:text-teal-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Positional Encodings
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.7.2: Lie Groups and Lie Algebras</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="teal" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Lie Groups */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <LieGroupsAndAlgebras />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <LieGroupLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Representations */}
                    <div className="mt-12">
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                            <LieRepresentationsAndApplications />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/positional-encodings/fourier-analysis"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 font-semibold transition-colors">
                        ← Previous: Fourier Analysis
                    </Link>
                    <Link href="/chapter-1/positional-encodings/harmonic-analysis"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next: Harmonic Analysis of Groups → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
