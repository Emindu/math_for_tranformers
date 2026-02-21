import React from 'react';
import StatLearningFoundationContent from '@/components/content/StatLearningFoundationContent';
import EmpiricalRiskLab from '@/components/math-viz/EmpiricalRiskLab';
import HoeffdingBoundLab from '@/components/math-viz/HoeffdingBoundLab';

export default function StatLearningFoundationPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.13.1</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Foundations of Statistical Learning
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Theoretical tools to ensure models not only fit the training data but generalize well to unseen data.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* Left Column: Theory Text */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <StatLearningFoundationContent />
                    </div>

                    {/* Right Column: Labs */}
                    <div className="flex flex-col gap-6">

                        {/* Lab 1: ERM */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                            <EmpiricalRiskLab />
                        </div>

                        {/* Lab 2: Hoeffding's Inequality */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
                            <HoeffdingBoundLab />
                        </div>

                        {/* Instructor's Box */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h4 className="text-emerald-900 font-bold mb-2">Lab Instructions</h4>
                            <p className="text-emerald-800 text-sm mb-4 leading-relaxed">
                                Statistical Learning balances fitting data (Empirical Risk) against performing well broadly (True Risk).
                            </p>
                            <ul className="text-emerald-800 text-sm space-y-3 list-disc list-inside">
                                <li><strong>Empirical vs True Risk:</strong> In the first lab, increase the <strong>Model Capacity</strong> to max while keeping <strong>Sample Size</strong> low. Watch the Empirical Risk drop to near $0$, while the True Risk spikes (Overfitting).</li>
                                <li><strong>Hoeffding's Inequality:</strong> In the second lab, observe the <strong>Probability Bound</strong> curve. Even with a strict Error Margin ($\epsilon$), increasing the Sample Size ($n$) exponentially tightens our confidence that Empirical Risk $\approx$ True Risk.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
