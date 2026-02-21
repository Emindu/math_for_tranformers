"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    GeometricPriorsInModelArchitectures,
    RotationalAndTranslationalInvariances
} from '@/components/content/GeometricStructuresContent';
import TranslationalInvarianceLab from '@/components/math-viz/TranslationalInvarianceLab';
import RelativePositionalLab from '@/components/math-viz/RelativePositionalLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Building in Geometry",
        text: `If you know the rules of the universe your data lives in, you shouldn't force your model to guess them from scratch. Geometric Priors are structural assumptions planted directly into a model's architecture. By formally mathematicalizing the symmetries of the data—say, ensuring spherical convolutions for planetary data—the model's hypothesis space shrinks massively, vastly accelerating learning and boosting generalization.`,
    },
    {
        title: "Translational Invariance",
        text: `When you're looking for a dog in a picture, it doesn't matter if the dog is in the top left or the bottom right. A translationally invariant system yields the exact same feature map regardless of position. Convolutional Neural Networks achieve this by sliding the same filter across an entire image. But standard Transformers? They see sequence positions as absolute points in space, which fundamentally breaks this invariance.`,
    },
    {
        title: "Relative Positional Encoding",
        text: `To make Transformers geometrically robust for things like images, time-series, or physical simulation, we have to enforce these invariances artificially. Instead of telling the attention mechanism that Token A is directly at position 4 and Token B is at position 10, we instead tell the model that Token B is exactly '+6 units' away from Token A. This Relative Positional Encoding forces the attention layer to respect translational symmetry, evaluating the physical relationship between tokens rather than their arbitrary coordinates.`,
    },
];

export default function ModelDesignPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/geometric-structures" className="inline-flex items-center text-slate-500 hover:text-pink-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Geometric Structures
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.8.3: Implications for Model Design</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="pink" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Geometric Priors */}
                    <div className="">
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                            <GeometricPriorsInModelArchitectures />
                        </div>
                    </div>

                    {/* Section 2: Rotational and Translational Invariance */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8 flex flex-col gap-8">
                                <TranslationalInvarianceLab />
                                <RelativePositionalLab />
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <RotationalAndTranslationalInvariances />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/geometric-structures/symmetries"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-pink-600 font-semibold transition-colors">
                        ← Previous: Symmetries and Transformations
                    </Link>
                    <Link href="/chapter-1/function-approximation"
                        className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next Chapter: Function Approximation Theory → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
