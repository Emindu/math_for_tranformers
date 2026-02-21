"use client";

import React from 'react';
import { EigenIntroContent, SpectralTheoremContent, DiagonalizationContent } from '@/components/content/EigenvaluesEigenvectors';
import EigenvalueLab from '@/components/math-viz/EigenvalueLab';
import SpectralTheoremLab from '@/components/math-viz/SpectralTheoremLab';
import DiagonalizationLab from '@/components/math-viz/DiagonalizationLab';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What are Eigenvalues and Eigenvectors?",
        text: `An eigenvector of a linear transformation is a non-zero vector that, when the transformation is applied, only gets scaled — its direction doesn't change. The scaling factor is called the eigenvalue. Formally, if A is a matrix and v is an eigenvector with eigenvalue lambda, then A times v equals lambda times v. Eigenvectors reveal the "natural axes" of a transformation, the directions along which it acts most simply. This concept is fundamental to understanding how data is stretched, compressed, or rotated by neural network layers.`,
    },
    {
        title: "Finding Eigenvalues",
        text: `To find eigenvalues, we solve the characteristic equation: the determinant of A minus lambda times the identity matrix equals zero. This gives a polynomial in lambda called the characteristic polynomial. Its roots are the eigenvalues. For a 2-by-2 matrix, this is a quadratic equation. For larger matrices, numerical methods are typically used. The eigenvalues can be real or complex, and they carry geometric meaning — positive eigenvalues preserve direction, negative eigenvalues reverse it, and complex eigenvalues indicate rotation.`,
    },
    {
        title: "The Spectral Theorem",
        text: `The spectral theorem is one of the most beautiful results in linear algebra. It states that every real symmetric matrix can be diagonalized by an orthogonal matrix — meaning it can be decomposed as Q times Lambda times Q-transpose, where Q is orthogonal and Lambda is diagonal. The columns of Q are orthonormal eigenvectors, and the diagonal entries of Lambda are the corresponding eigenvalues. This decomposition reveals the principal axes of the transformation.`,
    },
    {
        title: "Applications of the Spectral Theorem",
        text: `The spectral theorem is the mathematical foundation of Principal Component Analysis, or PCA. In PCA, we compute the eigenvalues and eigenvectors of the covariance matrix to find the directions of maximum variance in the data. The eigenvectors become the principal components, and the eigenvalues tell us how much variance each component captures. This technique is used for dimensionality reduction, data visualization, and feature extraction across all of machine learning.`,
    },
    {
        title: "Diagonalization",
        text: `A matrix is diagonalizable if it can be written as P times D times P-inverse, where D is a diagonal matrix of eigenvalues and P is a matrix whose columns are the corresponding eigenvectors. Diagonalization simplifies many computations — for example, raising a diagonal matrix to a power is just raising each diagonal entry to that power. Not every matrix is diagonalizable, but symmetric matrices always are. Diagonalization connects to how transformers decompose complex operations into simpler, independent components.`,
    },
    {
        title: "Eigenvalues in Transformers",
        text: `In transformers, eigenvalue analysis helps understand the behavior of attention matrices and the stability of training. The eigenvalues of the attention weight matrix reveal how information is distributed across input tokens. Large eigenvalues indicate concentrated attention, while small eigenvalues suggest diffuse attention. During training, monitoring the eigenvalues of weight matrices helps detect vanishing or exploding gradients. The spectral properties of these matrices are key to understanding why transformers can capture long-range dependencies so effectively.`,
    },
];

export default function EigenvaluesEigenvectorsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1: Representing Data as Vectors</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="orange" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Eigenvalues */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <EigenIntroContent />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <EigenvalueLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Spectral Theorem */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <SpectralTheoremContent />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SpectralTheoremLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Diagonalization */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <DiagonalizationContent />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <DiagonalizationLab />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
