"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    EmbeddingSpacesAndManifolds,
    HighDimensionalEmbeddings
} from '@/components/content/GeometricStructuresContent';
import CurseOfDimensionalityLab from '@/components/math-viz/CurseOfDimensionalityLab';
import ManifoldUnrollingLab from '@/components/math-viz/ManifoldUnrollingLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "The Shape of Data",
        text: `In a neural network, everything is a list of numbers—a vector. When you plot these vectors, they live in an 'embedding space'. Even though this space has hundreds or thousands of dimensions, real data like text or images isn't just randomly scattered everywhere. It usually sits neatly on a curved, lower-dimensional structure folded inside that massive space. We call this structure a manifold.`,
    },
    {
        title: "Manifold Learning",
        text: `The goal of representation learning is essentially 'manifold learning': discovering how to unfold, flatten, or map this complex curved surface so that the data makes linear sense. Techniques like Isomap or LLE try to preserve the local geometry—the 'geodesics' or paths along the curve—while projecting it down into flat, useful embeddings.`,
    },
    {
        title: "The Curse of Dimensionality",
        text: `Transformers operate in very high-dimensional spaces, bringing severe geometric anomalies. In thousands of dimensions, almost all the volume of a sphere sits exactly at its paper-thin crust. If a model isn't careful, every single data point ends up essentially the exact same distance away from every other point. Understanding this 'curse' explains why mechanisms like LayerNorm and careful attention scaling are absolutely critical for structural stability.`,
    },
];

export default function EmbeddingSpacesPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/geometric-structures" className="inline-flex items-center text-slate-500 hover:text-fuchsia-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Geometric Structures
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.8.1: Embedding Spaces and Manifolds</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="fuchsia" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Embedding Spaces and Manifolds */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mt-12">
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 mx-auto">
                            <EmbeddingSpacesAndManifolds />
                        </div>
                        <div className="flex flex-col gap-8 mt-12 xl:mt-0">
                            <div className="sticky top-8">
                                <ManifoldUnrollingLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: High Dimensional Embeddings */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <HighDimensionalEmbeddings />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <CurseOfDimensionalityLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/geometric-structures"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-fuchsia-600 font-semibold transition-colors">
                        ← Previous: Geometric Structures Overview
                    </Link>
                    <Link href="/chapter-1/geometric-structures/symmetries"
                        className="inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next: Symmetries and Transformations → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
