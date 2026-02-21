"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

interface Subsection {
    number: string;
    title: string;
    description: string;
    href: string;
    color: string;
    comingSoon?: boolean;
}

const subsections: Subsection[] = [
    {
        number: "1.10.1",
        title: "Gradient Descent and Variants",
        description: "The foundational algorithms for minimizing loss, including SGD and Adam.",
        href: "/chapter-1/optimization-techniques/gradient-descent",
        color: "indigo",
    },
    {
        number: "1.10.2",
        title: "Saddle Points and Local Minima",
        description: "Navigating high-dimensional non-convex loss landscapes.",
        href: "/chapter-1/optimization-techniques/saddle-points",
        color: "purple",
    },
    {
        number: "1.10.3",
        title: "Convergence Analysis",
        description: "Theoretical guarantees for optimization methods in deep learning.",
        href: "/chapter-1/optimization-techniques/convergence",
        color: "fuchsia",
    },
];

export default function OptimizationTechniquesPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
                    <ChevronLeft size={16} /> Back to Table of Contents
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                            <Activity className="text-indigo-600" size={32} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-indigo-600 tracking-wider uppercase mb-1">Section 1.10</h2>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Optimization Techniques</h1>
                        </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                        Optimization techniques are central to training machine learning models, including transformers. These techniques involve adjusting the model parameters to minimize a loss function, which measures the discrepancy between the model's predictions and the actual outcomes.
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <Activity size={18} className="text-indigo-500" />
                        <p>Complete these subsections in order to build a solid mathematical foundation.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 px-1">Subsections</h3>
                    {subsections.map((sub) => (
                        sub.comingSoon ? (
                            <div key={sub.number} className="group relative bg-white/50 border border-slate-200 rounded-2xl p-6 transition-all overflow-hidden text-left w-full flex items-center justify-between">
                                <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                                    <span className="bg-white/90 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-slate-100 backdrop-blur-md">
                                        Coming Soon
                                    </span>
                                </div>
                                <div className="flex items-center gap-6 opacity-40">
                                    <div className={`w-16 h-16 rounded-2xl bg-${sub.color}-50 flex items-center justify-center flex-shrink-0`}>
                                        <span className={`font-bold text-${sub.color}-600`}>{sub.number.split('.').pop()}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.title}</h3>
                                        <p className="text-slate-500 leading-relaxed">{sub.description}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href={sub.href} key={sub.number} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all text-left w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-2xl bg-${sub.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <span className={`font-bold text-${sub.color}-600`}>{sub.number.split('.').pop()}</span>
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold text-slate-900 mb-2 group-hover:text-${sub.color}-600 transition-colors`}>{sub.title}</h3>
                                            <p className="text-slate-500 leading-relaxed">{sub.description}</p>
                                        </div>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-${sub.color}-50 transition-colors`}>
                                        <ChevronRight size={20} className={`text-slate-400 group-hover:text-${sub.color}-600`} />
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </div>
            </div>
        </main>
    );
}
