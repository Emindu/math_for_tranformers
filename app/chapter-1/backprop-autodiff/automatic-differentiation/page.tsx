import React from 'react';
import AutoDiffContent from '@/components/content/AutoDiffContent';
import AutoDiffModesLab from '@/components/math-viz/AutoDiffModesLab';

export default function AutomaticDifferentiationPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.12.2</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Automatic Differentiation
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Exploring the computational techniques for efficiently deriving exact gradients across deep networks, contrasting Forward and Reverse modes.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* Left Column: Theory Text */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <AutoDiffContent />
                    </div>

                    {/* Right Column: Lab */}
                    <div className="xl:sticky xl:top-8 h-fit flex flex-col gap-6">

                        {/* The Visualizer */}
                        <AutoDiffModesLab />

                        {/* Instructor's Box */}
                        <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100">
                            <h4 className="text-sky-900 font-bold mb-2">Lab Instructions</h4>
                            <p className="text-sky-800 text-sm mb-4 leading-relaxed">
                                This lab visualizes the flow of computing derivatives for the example function <span className="font-mono text-indigo-700 font-bold">f(x₁, x₂) = sin(x₁) + x₁ x₂²</span>.
                            </p>
                            <ul className="text-sky-800 text-sm space-y-3 list-disc list-inside">
                                <li><strong>Toggle Modes:</strong> Switch between Forward Mode (tracking primal derivatives like dx₁) and Reverse Mode (tracking adjoints like z̄).</li>
                                <li><strong>Step Mechanism:</strong> Use the <span className="font-semibold bg-sky-200 px-1 rounded">Step Forward/Backward</span> button to move step-by-step through the chain rule evaluations layer-by-layer.</li>
                                <li><strong>Observe Efficiency:</strong> Notice how Forward Mode evaluates df/dx₁ relative to inputs, whereas Reverse Mode flows backwards from the scalar output to compute all input gradients simultaneously in O(n) time.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
