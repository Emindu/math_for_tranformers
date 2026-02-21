"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
    FourierAnalysisOfPositionalEncodings,
    PeriodicFunctionsAndSignalProcessing
} from '@/components/content/PositionalEncodingsContent';
import FourierPositionalLab from '@/components/math-viz/FourierPositionalLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "The Problem of Position",
        text: `Unlike Recurrent Neural Networks which process text word by word, Transformers process entire sequences simultaneously. This makes them incredibly fast, but creates a massive problem: they are naturally 'permutation equivariant'. Without explicitly telling the model where words are, "The dog bit the man" and "The man bit the dog" look computationally identical to the attention mechanism.`,
    },
    {
        title: "Fourier's Superposition",
        text: `To solve this, we borrow a brilliant idea from Signal Processing and Fourier Analysis. Fourier proved that any function can be represented as a sum of sines and cosines at different frequencies. Instead of just giving each position a single number, we represent its position as an entire spectrum of frequencies.`,
    },
    {
        title: "The Clock Analogy",
        text: `Think of positional encodings like the hands on a clock. The first few dimensions of the encoding vector are like the second hand — they spin rapidly, changing drastically from one word to the next, helping the model distinguish immediate neighbors. The deeper dimensions are like the hour hand — they barely move over short distances but provide a sense of global location in the sentence. By combining all these 'hands', every position gets a uniquely identifiable continuous signature.`,
    },
];

export default function FourierAnalysisPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/positional-encodings" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Positional Encodings
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.7.1: Fourier Analysis of Positional Encodings</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="blue" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Fourier Analysis */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <FourierAnalysisOfPositionalEncodings />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <FourierPositionalLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Periodic Functions */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <PeriodicFunctionsAndSignalProcessing />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <FourierPositionalLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/positional-encodings"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                        ← Back to Positional Encodings
                    </Link>
                    <Link href="/chapter-1/positional-encodings/lie-groups"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next: Lie Groups and Lie Algebras → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
