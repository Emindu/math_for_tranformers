import React from 'react';
import { ChainRuleContent, ErrorPropagationContent } from '@/components/content/BackpropagationContent';
import BackpropComputationalGraphLab from '@/components/math-viz/BackpropComputationalGraphLab';

export default function BackpropagationPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.12</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Backpropagation
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Applying the chain rule of calculus to systematically compute gradients backward through the network layers.
                    </p>
                </div>

                <div className="flex flex-col gap-12">

                    {/* Row 1: Chain Rule & Computational Graph */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Left Column: Theory */}
                        <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                            <ChainRuleContent />
                        </div>

                        {/* Right Column: Lab */}
                        <div className="xl:sticky xl:top-8 h-fit">
                            <BackpropComputationalGraphLab />
                            <div className="mt-6 bg-sky-50 rounded-2xl p-6 border border-sky-100">
                                <h4 className="text-sky-900 font-bold mb-2">Lab Instructions</h4>
                                <ul className="text-sky-800 text-sm space-y-2 list-disc list-inside">
                                    <li>Adjust the sliders for <strong className="font-semibold text-sky-700">Input <span className="font-mono">x</span></strong>, <strong className="font-semibold text-indigo-600">Weight <span className="font-mono">W₁</span></strong>, <strong className="font-semibold text-violet-600">Weight <span className="font-mono">W₂</span></strong>, and <strong className="font-semibold text-emerald-600">Target <span className="font-mono">ŷ</span></strong>.</li>
                                    <li>Trace the dashed blue lines to see how the inputs linearly transform and activate forward through the computational graph.</li>
                                    <li>Hover over the nodes <span className="font-mono text-indigo-700 font-bold">h</span> and <span className="font-mono text-violet-700 font-bold">y</span> to reveal the internal mathematical equations and computed intermediate values.</li>
                                    <li>Trace the solid red line to see how the Loss gradient <span className="font-mono text-rose-600 font-bold">∂L/∂y</span> flows backward, cascading via the chain rule to update internal weights.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Error Propagation (Full Width since it's math heavy block text) */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <ErrorPropagationContent />
                    </div>

                </div>

            </div>
        </div>
    );
}
