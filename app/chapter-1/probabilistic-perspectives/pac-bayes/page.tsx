import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MoveRight } from 'lucide-react';
import { PACBayesIntro, PACBayesTransformers } from '@/components/content/chapter-1/probabilistic-perspectives/pac-bayes/PACBayesContent';
import PACBayesBoundLab from '@/components/math-viz/PACBayesBoundLab';

export default function PACBayesPage() {
    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/chapter-1/probabilistic-perspectives"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Probabilistic Perspectives</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-400">
                        Chapter 1.14.2
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pt-12">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-4">
                        Chapter 1.14.2
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        PAC-Bayes Generalization Bounds
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Bridging Probably Approximately Correct (PAC) learning with Bayesian priors to derive rigorous bounds on the true risk of large models like Transformers.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <PACBayesIntro />
                        <PACBayesTransformers />
                    </div>

                    <div className="lg:sticky lg:top-24 space-y-8">
                        <div className="h-[650px]">
                            <PACBayesBoundLab />
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Up Next</h3>
                            <p className="text-slate-600 mb-4">
                                We'll tie everything together to analyze how these probabilistic models behave in the real world—examining Grokking, Scaling Laws, and Double Descent.
                            </p>
                            <Link
                                href="/chapter-1/probabilistic-perspectives/generalization-practice"
                                className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                1.14.3 Generalization in Practice <MoveRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
