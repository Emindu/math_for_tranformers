"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { SelfAttentionMechanism, MultiHeadSelfAttention } from '@/components/content/TensorAlgebraContent';
import SelfAttentionLab from '@/components/math-viz/SelfAttentionLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "The Core Idea",
        text: `The central idea of self-attention is elegantly simple: compute a weighted combination of input features, where the weights reflect how relevant each feature is to every other feature. Given a sequence of input vectors — like word embeddings — self-attention transforms each one into a new vector that incorporates information from the entire sequence. The magic is in the weights: they are computed dynamically from the data itself, not fixed in advance.`,
    },
    {
        title: "Query, Key, and Value",
        text: `Self-attention uses three learned projections of the input: queries, keys, and values. The query matrix Q, the key matrix K, and the value matrix V are all computed by multiplying the input X by learned weight matrices. You can think of queries as "what am I looking for?", keys as "what do I contain?", and values as "what information do I carry?". The interaction between queries and keys determines the attention weights, which then select from the values.`,
    },
    {
        title: "Computing Attention Weights",
        text: `Each output vector z-i is computed as a weighted sum of all value vectors, where the weight alpha-ij measures how much token j should contribute to the output of token i. These weights come from the dot product of query i with key j, scaled by the square root of the key dimension to prevent the dot products from growing too large. The softmax function then normalizes these scores into a valid probability distribution that sums to one.`,
    },
    {
        title: "The Matrix Formulation",
        text: `In compact matrix form, self-attention is Z equals softmax of Q times K-transpose divided by square root d-k, times V. This single expression captures the entire computation: pairwise similarities between all queries and keys via the dot product, normalization through softmax, and weighted aggregation of values through the final matrix multiplication. This formulation also makes implementation highly efficient on modern GPUs, since it reduces to a series of matrix operations.`,
    },
    {
        title: "Multi-Head Attention",
        text: `Multi-head attention runs multiple self-attention mechanisms in parallel, each with its own set of learned weight matrices. Each head can specialize in capturing different types of patterns — some might attend to nearby tokens for local syntax, while others attend to distant tokens for long-range semantic relationships. The outputs of all heads are concatenated and projected back to the original dimension through a learned output matrix.`,
    },
    {
        title: "Why Multiple Heads Matter",
        text: `The advantage of multiple heads is expressivity. A single attention head computes one set of attention weights — one way of mixing information. With h heads, the model has h different perspectives on the same input. This parallel processing allows the transformer to simultaneously capture diverse dependency types: subject-verb agreement, co-reference resolution, positional patterns, and more. The final linear projection learns how to best combine these diverse perspectives into a unified representation.`,
    },
];

export default function SelfAttentionPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/tensor-algebra" className="inline-flex items-center text-slate-500 hover:text-amber-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Tensor Algebra
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.5.3: Self-Attention Mechanisms</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="amber" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Self-Attention Mechanism */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <SelfAttentionMechanism />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SelfAttentionLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Multi-Head Self-Attention */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <MultiHeadSelfAttention />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SelfAttentionLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/tensor-algebra/algebraic-structures"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 font-semibold transition-colors">
                        ← Previous: Algebraic Structures
                    </Link>
                    <Link href="/chapter-1/tensor-algebra"
                        className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Back to Tensor Algebra Overview →
                    </Link>
                </div>
            </div>
        </main>
    );
}
