"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { TopologyOfMetricSpaces } from '@/components/content/MetricSpacesContent';
import TopologyLab from '@/components/math-viz/TopologyLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Introduction to Topology",
        text: `Topology provides a framework for understanding the structure and properties of metric spaces beyond mere distances. While a metric tells us how far apart two points are, topology tells us about the shape and connectivity of the space itself. These concepts are crucial for studying the geometry, symmetry, and continuity properties leveraged in the design of intelligent systems like transformers.`,
    },
    {
        title: "Open Sets",
        text: `An open set in a metric space is a subset where every point has a little breathing room around it. Formally, for every point x in an open set U, there exists a small radius epsilon such that the entire open ball around x fits inside U. Think of it like standing in a field — you can take a small step in any direction and still be in the field. Open sets satisfy three important axioms: the union of any collection of open sets is open, the intersection of finitely many open sets is open, and both the empty set and the whole space are open.`,
    },
    {
        title: "Closed Sets",
        text: `A closed set is the complement of an open set. Equivalently, a set is closed if it contains all its limit points — points that can be approximated arbitrarily closely by elements of the set. The key distinction is about boundary inclusion: an open ball excludes its boundary (shown with a dashed circle), while a closed ball includes it (shown with a solid circle). In the interactive lab, you can toggle between these two to see the visual difference.`,
    },
    {
        title: "Continuity",
        text: `A function between metric spaces is continuous if nearby points map to nearby points. The formal epsilon-delta definition says: for every epsilon greater than zero, there exists a delta greater than zero such that whenever the distance between x and x-naught is less than delta, the distance between f of x and f of x-naught is less than epsilon. The topological definition is equivalent but more elegant: a function is continuous if the preimage of every open set is open. The interactive lab lets you visualize epsilon-delta continuity by adjusting the epsilon band and seeing the corresponding delta band.`,
    },
    {
        title: "Compactness and Heine-Borel Theorem",
        text: `A subset K of a metric space is compact if every open cover of K has a finite subcover. The famous Heine-Borel theorem tells us that in Euclidean space, a subset is compact if and only if it is closed and bounded. Compact sets guarantee that every sequence has a convergent subsequence, and that continuous functions attain their maximum and minimum values. These properties are essential in optimization.`,
    },
    {
        title: "Applications in Machine Learning",
        text: `In machine learning and attention mechanisms, compactness ensures the existence of solutions when optimizing over compact parameter sets. The Arzelà-Ascoli theorem provides conditions under which a family of continuous functions is relatively compact — meaning any sequence within the family has a uniformly convergent subsequence. This helps understand how neural networks approximate functions and generalize to unseen data, ensuring that the transformation of data through the network preserves essential properties.`,
    },
];

export default function TopologyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/metric-spaces" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Metric Spaces
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.3.2: Topology of Metric Spaces</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="cyan" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section: Topology of Metric Spaces */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <TopologyOfMetricSpaces />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <TopologyLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/metric-spaces/definition"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                        ← Previous: Definition
                    </Link>
                    <Link href="/chapter-1/metric-spaces/mappings"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next: Mappings Between Metric Spaces →
                    </Link>
                </div>
            </div>
        </main>
    );
}
