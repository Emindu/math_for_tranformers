"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    SymmetriesAndGroupActions,
    SymmetriesInTransformers
} from '@/components/content/GeometricStructuresContent';
import SO2GroupActionLab from '@/components/math-viz/SO2GroupActionLab';
import EquivarianceLab from '@/components/math-viz/EquivarianceLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "The Power of Symmetry",
        text: `Symmetry isn't just about things looking pretty; in math, symmetry means 'invariance under transformation'—it means you can do something to an object, and some core property of that object doesn't change. When neural networks learn to understand and exploit symmetries, they become incredibly powerful, robust, and capable of generalizing far beyond their training data.`,
    },
    {
        title: "Group Actions",
        text: `Consider rotating a 2D vector. We use a 'Group Action' to mathematically define what happens when a group, like the rotation group SO(2), 'acts' upon a space, like the Euclidean plane. By defining an orbit—the path a point traces out when you apply all possible rotations to it—we can systematically inject these geometric guarantees directly into a model's architecture.`,
    },
    {
        title: "Equivariance in Attention",
        text: `Why does this matter for transformers? Imagine a transformer analyzing a 3D molecule. If you rotate the molecule, the model shouldn't have to relearn its structure from scratch! By designing 'Symmetry-Aware' or 'Equivariant' attention mechanisms, the output of the transformer will systematically rotate in exact correlation with the input—massively improving efficiency and zero-shot robustness in scientific AI.`,
    },
];

export default function SymmetriesPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/geometric-structures" className="inline-flex items-center text-slate-500 hover:text-rose-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Geometric Structures
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.8.2: Symmetries and Transformations</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="rose" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Symmetries and Group Actions */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <SymmetriesAndGroupActions />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SO2GroupActionLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Equivariance in Transformers */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
                        <div className="flex flex-col gap-8 mt-12 xl:mt-0">
                            <div className="sticky top-8">
                                <EquivarianceLab />
                            </div>
                        </div>
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 mx-auto">
                            <SymmetriesInTransformers />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/geometric-structures/embedding-spaces"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 font-semibold transition-colors">
                        ← Previous: Embedding Spaces and Manifolds
                    </Link>
                    <Link href="/chapter-1/geometric-structures/model-design"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next: Implications for Model Design → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
