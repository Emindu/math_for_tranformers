import React from 'react';
import RademacherContent from '@/components/content/RademacherContent';
import RademacherNoiseFitLab from '@/components/math-viz/RademacherNoiseFitLab';
import TransformerRademacherBoundLab from '@/components/math-viz/TransformerRademacherBoundLab';

export default function RademacherComplexityPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.13.3</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Rademacher Complexity
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Measuring a model&#39;s true capacity by its ability to perfectly memorize and fit random noise.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* Left Column: Theory Text */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <RademacherContent />
                    </div>

                    {/* Right Column: Labs */}
                    <div className="flex flex-col gap-6">

                        {/* Lab 1: Fitting Random Noise */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
                            <RademacherNoiseFitLab />
                        </div>

                        {/* Lab 2: Transformer Bound */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                            <TransformerRademacherBoundLab />
                        </div>

                        {/* Instructor's Box */}
                        <div className="bg-fuchsia-50 rounded-2xl p-6 border border-fuchsia-100">
                            <h4 className="text-fuchsia-900 font-bold mb-2">Instructor Notes</h4>
                            <p className="text-fuchsia-800 text-sm mb-4 leading-relaxed">
                                VC Dimension is a theoretical worst-case. Rademacher Complexity measures the capacity against your <strong>actual dataset distribution</strong>.
                            </p>
                            <ul className="text-fuchsia-800 text-sm space-y-3 list-disc list-inside">
                                <li><strong>Fitting Noise Lab:</strong> Generate random labels, then increase the hypothesis capacity. Notice how a simple model naturally resists overfitting noise (Accuracy stays near ~50%), but a complex model contorts itself to achieve 100% accuracy on pure randomness.</li>
                                <li><strong>Transformer Generalization Gap:</strong> Observe the delicate balance in the Generalization Bound. If you double the network depth ($L$), the Rademacher capacity penalty destroys the True Risk bound. You must inject massive amounts of data ($n$) to combat it.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
