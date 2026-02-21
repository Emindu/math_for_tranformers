import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MoveRight } from 'lucide-react';
import { GeneralizationIntro, GeneralizationRegularization } from '@/components/content/chapter-1/probabilistic-perspectives/generalization-practice/GeneralizationPracticeContent';
import ModelComplexityGeneralizationLab from '@/components/math-viz/ModelComplexityGeneralizationLab';

export default function GeneralizationPracticePage() {
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
                        Chapter 1.14.3
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 pt-12">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-4">
                        Chapter 1.14.3
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Generalization Performance in Practice
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Transitioning from theoretical bounds to empirical reality. How Model Capacity, Regularization constraints, and Dataset Sizes mathematically govern the boundary between underfitting and overfitting.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        <GeneralizationIntro />
                        <GeneralizationRegularization />
                    </div>

                    <div className="lg:sticky lg:top-24 space-y-8">
                        <div className="h-[650px]">
                            <ModelComplexityGeneralizationLab />
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 border border-indigo-800 shadow-xl text-white">
                            <h3 className="text-xl font-bold mb-2">Chapter 1 Complete</h3>
                            <p className="text-slate-300 mb-6">
                                You have successfully completed Chapter 1: Foundations of Representation Theory. You are now equipped with the rigorous mathematical tools underpinning modern deep learning models!
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-xl transition-all w-full"
                            >
                                Return to Modules
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
