"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    HarmonicAnalysisOfGroups,
    WignerDFunctions
} from '@/components/content/PositionalEncodingsContent';
import SphericalHarmonicsLab from '@/components/math-viz/SphericalHarmonicsLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Beyond the Circle",
        text: `Fourier analysis works perfectly for sequences like sentences or audio waves that move in one direction. But what if your data is a 3D molecule, a globe, or a point cloud? A simple 1D sine wave isn't enough to capture the symmetries of 3-dimensional space. We need a way to wrap frequencies around a sphere.`,
    },
    {
        title: "Spherical Harmonics",
        text: `Enter Spherical Harmonics. Just as sine waves are the fundamental frequencies of a 1D line, Spherical Harmonics are the fundamental frequencies of the surface of a 3D sphere. By defining 'degree' (l) and 'order' (m), we can describe any pattern on a sphere as a combination of these symmetrical, bulbous shapes.`,
    },
    {
        title: "Wigner-D and the Transformer",
        text: `While Spherical Harmonics describe the static shape on the sphere, Wigner-D functions describe how these shapes *rotate*. In advanced Transformer architectures like AlphaFold or 3D vision models, ensuring that the attention mechanism mathematically understands 3D rotation without destroying the data is crucial. Harmonic analysis on groups gives us the exact matrices needed to achieve this 'Rotational Invariance'.`,
    },
];

export default function HarmonicAnalysisPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/positional-encodings" className="inline-flex items-center text-slate-500 hover:text-cyan-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Positional Encodings
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.7.3: Harmonic Analysis of Groups</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="cyan" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Harmonic Analysis + Spherical Harmonics */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <HarmonicAnalysisOfGroups />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SphericalHarmonicsLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Wigner-D Functions */}
                    <div className="mt-12">
                        <div className="bg-white p-8 xl:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                            <WignerDFunctions />
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/positional-encodings/lie-groups"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 font-semibold transition-colors">
                        ← Previous: Lie Groups and Lie Algebras
                    </Link>
                    <Link href="/chapter-1/geometric-structures"
                        className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next Chapter: 1.8 Geometric Structures → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
