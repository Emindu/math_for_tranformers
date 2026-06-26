"use client";

import React from 'react';
import { DifferentiationContent } from '@/components/content/MatrixCalculusContent';
import GradientExplorerLab from '@/components/math-viz/GradientExplorerLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

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
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="rose" />
            </div>
            <DifferentiationContent gradientLab={<GradientExplorerLab />} />
        </LessonLayout>
    );
}
