"use client";

import React from 'react';
import LinearTransformationsContent from '@/components/content/LinearTransformations';
import LinearTransformationLab from '@/components/math-viz/LinearTransformationLab';
import KernelImageLab from '@/components/math-viz/KernelImageLab';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What are Linear Transformations?",
        text: `A linear transformation is a function between vector spaces that preserves the two fundamental operations: vector addition and scalar multiplication. If T is a linear transformation, then T of u plus v equals T of u plus T of v, and T of c times v equals c times T of v. These two properties mean that linear transformations preserve the structure of the vector space. Every linear transformation can be represented as multiplication by a matrix.`,
    },
    {
        title: "Matrix Representation",
        text: `The key insight of linear algebra is that every linear transformation between finite-dimensional vector spaces can be represented as a matrix. The columns of the matrix tell you where the basis vectors are sent. This means studying linear transformations is equivalent to studying matrices. Matrix multiplication corresponds to composition of transformations — applying one transformation followed by another. This is exactly how neural network layers work: each layer applies a matrix multiplication followed by a nonlinearity.`,
    },
    {
        title: "Geometric Effects of Transformations",
        text: `Linear transformations have beautiful geometric interpretations. They can rotate, scale, shear, reflect, and project vectors. A rotation preserves lengths and angles. Scaling stretches or compresses along axes. Shearing tilts the space. Projection collapses dimensions. The determinant of the transformation matrix tells you how the transformation scales areas and volumes. Understanding these geometric effects helps visualize what neural network layers do to data representations.`,
    },
    {
        title: "Kernel and Image",
        text: `The kernel of a linear transformation, also called the null space, is the set of all vectors that map to zero. The image, also called the range, is the set of all possible outputs. The rank-nullity theorem states that the dimension of the kernel plus the dimension of the image equals the dimension of the input space. This theorem has practical implications: if a transformation has a large kernel, it loses information. In neural networks, the rank of weight matrices determines how much information flows through each layer.`,
    },
    {
        title: "Query, Key, and Value Projections",
        text: `In transformers, the Query, Key, and Value matrices are linear transformations applied to input embeddings. The Query projection asks "what am I looking for?". The Key projection asks "what do I contain?". The Value projection determines "what information do I provide?". Each is a matrix multiplication that projects the embedding into a different subspace. Multi-head attention applies multiple sets of these projections, allowing the model to attend to information from different representational subspaces simultaneously.`,
    },
    {
        title: "Composition and the Attention Formula",
        text: `The attention mechanism is a composition of linear transformations. First, inputs are projected by Q, K, and V matrices. Then, the attention scores are computed as the softmax of Q times K-transpose divided by the square root of the key dimension. Finally, the output is V weighted by these scores. Understanding how matrices transform space demystifies this formula — it's a sequence of projections, similarity computations, and weighted combinations, all grounded in linear algebra.`,
    },
];

export default function LinearTransformationsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1: Representing Data as Vectors</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="emerald" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Left: Content */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <LinearTransformationsContent />
                    </div>

                    {/* Right: Viz */}
                    <div className="flex flex-col gap-8">
                        <div className="sticky top-8">
                            <LinearTransformationLab />

                            <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                <h3 className="font-semibold text-indigo-900 mb-2">Why this matters for Transformers?</h3>
                                <p className="text-sm text-indigo-800">
                                    In Transformers, the <strong>Query (Q)</strong>, <strong>Key (K)</strong>, and <strong>Value (V)</strong> matrices are linear transformations applied to input embeddings.
                                    The Attention mechanism itself is a composition of these transformations, projecting data into subspaces where similarity can be computed.
                                    Understanding how matrices transform space helps demystify the inner workings of <Latex>{'$\\text{Softmax}(QK^T/\\sqrt{d_k})V$'}</Latex>.
                                </p>
                            </div>

                            <KernelImageLab />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
