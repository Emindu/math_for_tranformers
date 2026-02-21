import React from 'react';
import VCDimensionContent from '@/components/content/VCDimensionContent';
import VCDimensionShatterLab from '@/components/math-viz/VCDimensionShatterLab';
import NetworkCapacityLab from '@/components/math-viz/NetworkCapacityLab';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function VCDimensionPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.13.2</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        VC Dimension and Capacity Control
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Measuring the flexibility of models, from simple 2D linear classifiers to massively parmeterized deep neural networks.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* Left Column: Theory Text */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <VCDimensionContent />
                    </div>

                    {/* Right Column: Labs */}
                    <div className="flex flex-col gap-6">

                        {/* Lab 1: 2D Shattering */}
                        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
                            <VCDimensionShatterLab />
                        </div>

                        {/* Lab 2: Network Capacity */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                            <NetworkCapacityLab />
                        </div>

                        {/* Instructor's Box */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h4 className="text-emerald-900 font-bold mb-2">Lab Instructions</h4>
                            <p className="text-emerald-800 text-sm mb-4 leading-relaxed">
                                Ensure you understand exactly how Capacity defines a model&#39;s ability to express complex relationships.
                            </p>
                            <ul className="text-emerald-800 text-sm space-y-3 list-disc list-inside">
                                <li><strong>Linear Shattering Visualizer:</strong> Try toggling between 3 Points and 4 Points. Notice how the linear SVM successfully finds boundaries for every combination of 3 points (Shatterable), but completely fails on an XOR pattern for 4 points. Hence, the VC Dimension of lines in 2D is 3.</li>
                                <li><strong>Network Capacity Scaling:</strong> To see why deep Transformer models overfit easily, push the Network Depth (<Latex>{'$L$'}</Latex>) and Hidden Width (<Latex>{'$d_{\\text{model}}$'}</Latex>) sliders to the maximum. Observe how the <Latex>{'$O(W \\log W)$'}</Latex> VC capacity bound exponentially explodes into the billions compared to basic linear models.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
