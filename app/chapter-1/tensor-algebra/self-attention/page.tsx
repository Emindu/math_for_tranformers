"use client";

import React from 'react';
import { SelfAttentionTensorContent } from '@/components/content/TensorAlgebraContent';
import SelfAttentionLab from '@/components/math-viz/SelfAttentionLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

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
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="amber" />
            </div>
            <SelfAttentionTensorContent selfAttentionLab={<SelfAttentionLab />} />
        </LessonLayout>
    );
}
