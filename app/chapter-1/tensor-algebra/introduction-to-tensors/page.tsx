"use client";

import React from 'react';
import { IntroToTensorsContent } from '@/components/content/TensorAlgebraContent';
import TensorOperationsLab from '@/components/math-viz/TensorOperationsLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What Are Tensors?",
        text: `A tensor is a multi-dimensional array of numerical values that generalizes the concepts of scalars, vectors, and matrices. A scalar is a single number — a 0th order tensor. A vector is a one-dimensional array — a 1st order tensor. A matrix is a two-dimensional grid — a 2nd order tensor. And it keeps going: a 3rd order tensor is like a cube of numbers, and higher orders form even more complex structures. In deep learning, every piece of data flowing through a neural network is a tensor.`,
    },
    {
        title: "Formal Definition",
        text: `Formally, a tensor of order k over a vector space V is an element of the tensor product of k copies of V. If you have a basis for V — say e1 through e-n — then any tensor T can be written as a sum of products of basis vectors, weighted by the tensor's components. These components T sub i1 i2 dot dot dot ik form a k-dimensional array, or hypermatrix. Each index ranges from 1 to n, where n is the dimension of the vector space.`,
    },
    {
        title: "Tensor Products",
        text: `The tensor product is the fundamental operation for building higher-order tensors from lower-order ones. Given a tensor A of order k and a tensor B of order l, their tensor product A tensor B gives a new tensor of order k plus l. The components of the product are simply the products of the individual components. Importantly, the tensor product is bilinear, meaning it distributes over addition and scalar multiplication. This is analogous to how multiplication of polynomials works.`,
    },
    {
        title: "Tensor Contraction",
        text: `Tensor contraction is the inverse operation to the tensor product — it reduces order by summing over pairs of indices. This is exactly how matrix multiplication works: when you multiply two matrices A and B, you're contracting over the shared index, computing C sub iu equals the sum over j of A sub ij times B sub ju. The trace of a matrix — the sum of diagonal elements — is the simplest contraction, reducing an order-2 tensor to a scalar.`,
    },
    {
        title: "Connection to Transformers",
        text: `In transformer architectures, tensor operations are everywhere. The computation of attention scores — Q times K transpose — is a tensor contraction. The outer product appears when computing the attention matrix. The value aggregation — multiplying attention weights by V — is another contraction. Understanding these operations as tensor algebra gives you a unified framework for reasoning about every computation inside a transformer, from embedding layers through self-attention to the final output projection.`,
    },
];

export default function IntroductionToTensorsPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="violet" />
            </div>
            <IntroToTensorsContent tensorLab={<TensorOperationsLab />} />
        </LessonLayout>
    );
}
