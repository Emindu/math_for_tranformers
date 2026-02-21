"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { DifferentiationOfMatrixFunctions, JacobianAndHessianMatrices } from '@/components/content/MatrixCalculusContent';
import GradientExplorerLab from '@/components/math-viz/GradientExplorerLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Why Matrix Calculus?",
        text: `Matrix calculus is a vital tool in the optimization and analysis of neural networks. The ability to compute gradients, Jacobians, and Hessians efficiently is crucial for training transformer models, as these quantities guide the optimization process. Without matrix calculus, we could not perform backpropagation — the algorithm that makes deep learning possible.`,
    },
    {
        title: "Matrix Functions and Their Derivatives",
        text: `Matrix calculus extends ordinary calculus to functions that take matrices as inputs and produce matrices as outputs. The derivative of such a function is — in full generality — a fourth-order tensor. In practice, we focus on specific cases: the gradient for scalar outputs, the Jacobian for vector outputs, and the Hessian for curvature information. Each provides increasingly detailed information about how the function responds to changes in its input.`,
    },
    {
        title: "Gradient Computation",
        text: `The gradient of a scalar function with respect to a matrix X is itself a matrix of partial derivatives. Two essential results are: the gradient of trace A X equals A transpose, and the gradient of the Frobenius norm squared equals 2 X. These rules extend scalar calculus to matrix operations and are used to compute weight updates in self-attention layers during training.`,
    },
    {
        title: "The Jacobian Matrix",
        text: `The Jacobian generalizes the gradient to vector-valued functions. In self-attention, the Jacobian of the softmax function is particularly important. It describes how small changes in the similarity scores S affect the attention weights alpha. The softmax Jacobian has a specific structure involving the attention weights themselves and the Kronecker delta, and it determines exactly how gradients flow backward through the softmax layer during backpropagation.`,
    },
    {
        title: "The Hessian Matrix",
        text: `The Hessian matrix captures second-order derivative information — the curvature of a function. For a scalar function of a matrix, the Hessian is a block matrix of second-order partial derivatives. It tells us whether the loss landscape is flat, steeply curved, or has saddle points. If the loss function has large Hessian eigenvalues, gradient descent steps must be carefully calibrated to avoid overshooting or oscillating around the minimum.`,
    },
    {
        title: "Practical Impact on Training",
        text: `These mathematical tools directly impact how transformers are trained. Gradients determine the direction of weight updates. The Jacobian tells us how errors propagate through each layer. And the Hessian reveals the geometry of the optimization landscape — whether we're approaching a minimum, stuck on a saddle point, or navigating a narrow valley. Understanding these quantities leads to more efficient and stable training of transformer models.`,
    },
];

export default function DifferentiationPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/matrix-calculus" className="inline-flex items-center text-slate-500 hover:text-rose-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Matrix Calculus
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.6.1: Differentiation of Matrix Functions</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="rose" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Differentiation of Matrix Functions */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <DifferentiationOfMatrixFunctions />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <GradientExplorerLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Jacobian and Hessian */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <JacobianAndHessianMatrices />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <GradientExplorerLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/matrix-calculus"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-rose-600 font-semibold transition-colors">
                        ← Back to Matrix Calculus
                    </Link>
                    <Link href="/chapter-1/matrix-calculus/gradient-flow"
                        className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full font-semibold transition-colors opacity-50 pointer-events-none">
                        Next: Optimization and Gradient Flow → (Coming Soon)
                    </Link>
                </div>
            </div>
        </main>
    );
}
