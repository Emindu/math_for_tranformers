import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MoveRight } from 'lucide-react';
import { BayesianInferenceIntro, BayesianNeuralNetworks } from '@/components/content/chapter-1/probabilistic-perspectives/bayesian-inference/BayesianInferenceContent';
import BNNDropoutLab from '@/components/math-viz/BNNDropoutLab';

export default function BayesianInferencePage() {
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
                        Chapter 1.14.1
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pt-12">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-4">
                        Chapter 1.14.1
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Bayesian Inference in Transformers
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Transitioning from deterministic point estimates to full probability distributions over network weights to quantify uncertainty.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <BayesianInferenceIntro />
                        <BayesianNeuralNetworks />
                    </div>

                    <div className="lg:sticky lg:top-24 space-y-8">
                        <div className="h-[650px]">
                            <BNNDropoutLab />
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Up Next</h3>
                            <p className="text-slate-600 mb-4">
                                Explore how these Bayesian techniques translate into rigorous bounds on generalization error using the PAC-Bayes framework.
                            </p>
                            <Link
                                href="/chapter-1/probabilistic-perspectives/pac-bayes"
                                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                            >
                                1.14.2 PAC-Bayes Generalization Bounds <MoveRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
