"use client";

import React from 'react';
import { AlgebraicStructuresContent } from '@/components/content/TensorAlgebraContent';
import KroneckerProductLab from '@/components/math-viz/KroneckerProductLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "The Backbone of Transformers",
        text: `Matrix multiplication is the backbone of nearly every computation inside a transformer. When an input matrix X, representing a sequence of n vectors of dimension d, is multiplied by a weight matrix W, the result Y = XW is a linear transformation that projects input vectors into a different space. This simple operation is what allows the model to adjust the dimensionality of data, revealing patterns that might be hidden in the original representation.`,
    },
    {
        title: "Matrix Multiplication in Self-Attention",
        text: `In the self-attention mechanism, matrix multiplication takes center stage. The computation Q times K-transpose produces an n-by-n matrix where each entry measures the similarity between a query vector and a key vector. This matrix is normalized with softmax to produce attention weights, which then multiply the value matrix V. The result is a weighted blend of values, where the weights reflect the relevance of each input token to every other token in the sequence.`,
    },
    {
        title: "Information Blending",
        text: `Beyond computing attention, matrix multiplication enables the blending of information across the entire input sequence. By multiplying matrices together, the model combines contributions from multiple elements simultaneously. This ability to aggregate information from different sources is what gives transformers their power in tasks like translation and summarization, where understanding long-range dependencies is essential.`,
    },
    {
        title: "Kronecker Products",
        text: `The Kronecker product is a powerful extension of matrix multiplication to higher dimensions. Given two matrices A and B, their Kronecker product A tensor B creates a much larger block matrix where each entry of A is replaced by a scaled copy of B. This operation is particularly useful for modeling interactions between different sets of features without explicitly constructing enormous interaction matrices.`,
    },
    {
        title: "Factorization for Efficiency",
        text: `Kronecker factorization decomposes a large matrix M into the product A tensor B, where A and B are much smaller matrices. This decomposition dramatically reduces the number of parameters and computational cost. In transformers, this technique can be applied to weight matrices and attention scores, enabling models to scale to longer sequences and larger architectures without proportional increases in compute requirements.`,
    },
    {
        title: "Multi-Head Attention and Factorization",
        text: `One specific application of Kronecker factorization is in multi-head attention, where the attention weights for different heads can be factorized to share information across heads while still allowing individual specialization. This approach leads to more efficient parameter usage and can help prevent overfitting by reducing model capacity in a structured way — preserving the model's expressivity while controlling its complexity.`,
    },
];

export default function AlgebraicStructuresPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="cyan" />
            </div>
            <AlgebraicStructuresContent kroneckerLab={<KroneckerProductLab />} />
        </LessonLayout>
    );
}
