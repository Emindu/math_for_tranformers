import React from 'react';
import Link from 'next/link';
import { Network, Activity, GitBranch, Binary, BrainCircuit } from 'lucide-react';

export default function ProbabilisticPerspectivesPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
                        <span className="text-xl">←</span> Back to Table of Contents
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                            <BrainCircuit className="text-blue-400" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            1.14 Probabilistic Perspectives
                        </h1>
                    </div>
                    <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                        Move beyond deterministic point estimates to fully embrace uncertainty.
                        Explore Bayesian inference for transformer parameters, PAC-Bayes generalization bounds,
                        and how rigorous probabilistic models translate to real-world performance.
                    </p>
                </div>
            </section>

            {/* Topics Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid gap-8">

                        {/* 1.14.1 Bayesian Inference */}
                        <Link href="/chapter-1/probabilistic-perspectives/bayesian-inference" className="group block bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-blue-200 transition-all">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <Network className="text-blue-600" size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full">Chapter 1.14.1</span>
                                        <span className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform hidden md:inline-flex">Start Lab →</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                        Bayesian Inference in Transformers
                                    </h2>
                                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                        How do we know how much a model "doesn't know"? Delve into computing posterior distributions over attention weights, and visualize Epistemic Uncertainty using Variational Inference and Monte Carlo Dropout.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Posterior Distributions</span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Uncertainty Quantification</span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Monte Carlo Dropout</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* 1.14.2 PAC-Bayes */}
                        <Link href="/chapter-1/probabilistic-perspectives/pac-bayes" className="group block bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-purple-200 transition-all">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <Activity className="text-purple-600" size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-purple-100 text-purple-700 text-sm font-bold px-4 py-1.5 rounded-full">Chapter 1.14.2</span>
                                        <span className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform hidden md:inline-flex">Start Lab →</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">
                                        PAC-Bayes Generalization Bounds
                                    </h2>
                                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                        Bridging Probably Approximately Correct (PAC) learning with Bayesian priors. Derive rigorous bounds on true risk that hold uniformly for all possible posterior hypotheses.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">True Risk Bounding</span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">KL Divergence</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* 1.14.3 Generalization in Practice */}
                        <Link href="/chapter-1/probabilistic-perspectives/generalization-practice" className="group block bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-200 transition-all">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                                    <GitBranch className="text-emerald-600" size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full">Chapter 1.14.3</span>
                                        <span className="text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform hidden md:inline-flex">Start Lab →</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                                        Generalization Performance in Practice
                                    </h2>
                                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                        Connecting the theory of VC dimension, Rademacher complexity, and PAC-Bayes directly to the scaling laws, grokking, and double-descent curves observed when training massive modern models.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Cross-Validation</span>
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Hyperparameter Tuning</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>
                </div>
            </section>
        </main>
    );
}
