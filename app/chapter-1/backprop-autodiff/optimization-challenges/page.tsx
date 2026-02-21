import React from 'react';
import OptimizationChallengesContent from '@/components/content/OptimizationChallengesContent';
import GradientFlowDynamicsLab from '@/components/math-viz/GradientFlowDynamicsLab';

export default function OptimizationChallengesPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-sky-100 text-sky-700 font-semibold px-3 py-1 rounded-full text-sm">Chapter 1.12.3</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        Optimization Challenges
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl">
                        Investigating the causes of unstable backpropagation in deep networks, from exponential gradient decay to explosion, and how modern techniques mitigate them.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">

                    {/* Left Column: Theory Text */}
                    <div className="bg-white rounded-3xl p-8 xl:p-12 shadow-sm border border-slate-200">
                        <OptimizationChallengesContent />
                    </div>

                    {/* Right Column: Lab */}
                    <div className="xl:sticky xl:top-8 h-fit flex flex-col gap-6">

                        {/* The Visualizer */}
                        <GradientFlowDynamicsLab />

                        {/* Instructor's Box */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h4 className="text-emerald-900 font-bold mb-2">Lab Instructions</h4>
                            <p className="text-emerald-800 text-sm mb-4 leading-relaxed">
                                This lab visualizes the norm of the gradient $\approx \prod \sigma'(z) \cdot W$ as it flows backwards from the final output layer (L5) to the input layer (L1).
                            </p>
                            <ul className="text-emerald-800 text-sm space-y-3 list-disc list-inside">
                                <li><strong>Vanishing Gradients:</strong> Select the <span className="font-semibold bg-emerald-200 px-1 rounded">Sigmoid</span> activation. Notice how the gradient compresses dramatically (exponential decay) at each layer step backwards.</li>
                                <li><strong>Exploding Gradients:</strong> Select the <span className="font-semibold bg-emerald-200 px-1 rounded">ReLU</span> activation and increase the <span className="font-semibold bg-emerald-200 px-1 rounded">Weight Norm ||W||</span> over 1.0. Notice how the gradient explodes to massive numbers via exponential growth.</li>
                                <li><strong>Mitigation - Xavier:</strong> Check <span className="font-semibold px-1 rounded underline">Apply Xavier Initialization</span> to simulate stabilizing the weight variance near 1.0, restoring a stable, non-exploding/non-vanishing gradient flow.</li>
                                <li><strong>Mitigation - Clipping:</strong> Check <span className="font-semibold px-1 rounded underline">Apply Gradient Clipping</span> against an explosion scenario to watch the nodes artificially cap the gradient norm $c$.</li>
                            </ul>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
