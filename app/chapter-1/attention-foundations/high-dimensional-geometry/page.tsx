"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { CurseOfDimensionality, ConcentrationOfMeasure } from '@/components/content/AttentionFoundationsContent';
import DimensionalityLab from '@/components/math-viz/DimensionalityLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Why High Dimensions Matter",
        text: `Attention mechanisms and transformers operate in high-dimensional spaces — typically 512 or 768 dimensions. Understanding the geometric properties of these spaces is crucial because high dimensions behave very differently from our everyday three-dimensional intuition. Two key phenomena — the curse of dimensionality and the concentration of measure — explain both the challenges and the surprising effectiveness of transformer architectures.`,
    },
    {
        title: "The Curse of Dimensionality",
        text: `The curse of dimensionality refers to phenomena that make intuitive concepts from low dimensions fail in high dimensions. Consider a hypersphere inscribed inside a unit hypercube. In 2D, the circle takes up about 78% of the square. But as dimensions increase, the sphere's volume shrinks exponentially — in 20 dimensions, it's essentially zero! This means most of the volume is concentrated in the corners of the hypercube, not the center. Data becomes incredibly sparse.`,
    },
    {
        title: "Distance Concentration",
        text: `One of the most surprising effects of high dimensionality is distance concentration. In high-dimensional spaces, the ratio of the distance between any two random points to the mean distance between all pairs of points approaches one. In other words, all points become roughly equidistant from each other! This makes distance-based algorithms like k-nearest neighbors less useful and explains why transformers need the scaling factor — the square root of d-k — in the attention formula to keep dot products from becoming meaningless.`,
    },
    {
        title: "Concentration of Measure",
        text: `The concentration of measure phenomenon states that in high-dimensional spaces, most of the mass of a probability distribution concentrates near its mean. For a Lipschitz function on a high-dimensional sphere, the probability of deviating from the expected value by epsilon decreases exponentially with the dimension. This means functions become increasingly predictable in high dimensions — a property that makes high-dimensional learning surprisingly tractable.`,
    },
    {
        title: "Random Projections and Johnson-Lindenstrauss",
        text: `The concentration of measure has a powerful practical consequence: the Johnson–Lindenstrauss lemma. It states that any set of n points in high-dimensional space can be embedded into a space of only O of log-n over epsilon-squared dimensions, with all pairwise distances preserved up to a factor of 1 plus or minus epsilon. This is why random projections work as a dimensionality reduction technique — you can dramatically reduce dimensions while preserving the geometric structure that matters.`,
    },
    {
        title: "Implications for Transformer Design",
        text: `These geometric properties have direct implications for how transformers are designed. The curse of dimensionality underscores why attention mechanisms are so valuable — by focusing on relevant subsets of the input, they reduce the effective dimensionality the model must handle. Concentration of measure explains why high-dimensional feature spaces can be effectively managed: attention naturally concentrates its weighting on the most critical features, leveraging the same principle that makes measure concentrate in high dimensions.`,
    },
];

export default function HighDimensionalGeometryPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/attention-foundations" className="inline-flex items-center text-slate-500 hover:text-rose-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Attention Foundations
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.4.2: The Geometry of High-Dimensional Spaces</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="rose" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Curse of Dimensionality */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <CurseOfDimensionality />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <DimensionalityLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Concentration of Measure */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <ConcentrationOfMeasure />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <DimensionalityLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/attention-foundations/attention-as-mapping"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                        ← Previous: Attention as a Mapping
                    </Link>
                    <Link href="/chapter-1/attention-foundations/applications"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next: Applications →
                    </Link>
                </div>
            </div>
        </main>
    );
}
