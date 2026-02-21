"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { IntroductionToTensors, TensorProductsAndContractions } from '@/components/content/TensorAlgebraContent';
import TensorOperationsLab from '@/components/math-viz/TensorOperationsLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

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
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/tensor-algebra" className="inline-flex items-center text-slate-500 hover:text-violet-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Tensor Algebra
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Language of Computation</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.5.1: Introduction to Tensors</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="violet" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Tensor Definitions */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <IntroductionToTensors />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <TensorOperationsLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Tensor Products & Contractions */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <TensorProductsAndContractions />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <TensorOperationsLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-end">
                    <Link href="/chapter-1/tensor-algebra/algebraic-structures"
                        className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next: Algebraic Structures →
                    </Link>
                </div>
            </div>
        </main>
    );
}
