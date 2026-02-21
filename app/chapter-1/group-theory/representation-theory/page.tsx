"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { RepresentationTheory, CharacterTheory } from '@/components/content/GroupTheoryContent';
import RepresentationTheoryLab from '@/components/math-viz/RepresentationTheoryLab';
import CharacterTheoryLab from '@/components/math-viz/CharacterTheoryLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What is a Group Representation?",
        text: `A representation of a group is a way to express the abstract group elements as concrete matrices acting on a vector space. Formally, a representation is a homomorphism from the group G to the general linear group GL of V — the group of invertible matrices. This lets us study groups using the powerful tools of linear algebra. Every group element becomes a matrix, and the group operation becomes matrix multiplication.`,
    },
    {
        title: "Why Representations Matter",
        text: `Representations bridge abstract algebra and geometry. They allow us to visualize how symmetry groups act on spaces. For example, the rotation group SO(3) can be represented by 3-by-3 rotation matrices acting on three-dimensional vectors. In physics, representations classify elementary particles. In machine learning, they help us build neural networks that respect the symmetries of the data.`,
    },
    {
        title: "Irreducible Representations",
        text: `A representation is irreducible if it has no proper invariant subspaces. Think of it as the "atomic" or "indivisible" building block — you can't break it down into smaller representations. Every representation can be decomposed into a direct sum of irreducible representations. This decomposition is like expressing a number as a product of primes — it reveals the fundamental structure.`,
    },
    {
        title: "Characters of Representations",
        text: `The character of a representation is the function that assigns to each group element the trace of its representing matrix. Characters are incredibly useful because they capture essential information about the representation in a single number for each group element. Two representations are equivalent if and only if they have the same character. This makes characters a powerful tool for classification.`,
    },
    {
        title: "Orthogonality Relations",
        text: `Characters of irreducible representations satisfy beautiful orthogonality relations. When you take the inner product of two different irreducible characters — summing over all group elements — you get zero. When you take the inner product of a character with itself, you get the order of the group. These orthogonality relations are the foundation of Fourier analysis on groups and generalize the familiar orthogonality of sine and cosine functions.`,
    },
    {
        title: "Applications to Neural Networks",
        text: `Representation theory provides the mathematical framework for equivariant neural networks. When we want a network to be equivariant under a group of transformations — meaning the output transforms predictably when the input is transformed — we need to understand how features transform under group representations. The irreducible representations determine the possible types of equivariant linear maps, constraining the network architecture in a principled way.`,
    },
];

export default function RepresentationTheoryPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/group-theory" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Group Theory
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.2.2: Representation Theory of Finite Groups</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="violet" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Representation Theory */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <RepresentationTheory />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <RepresentationTheoryLab />
                            </div>
                        </div>
                    </div>

                    {/* Character Theory */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <CharacterTheory />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <CharacterTheoryLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-16 flex justify-between">
                    <Link href="/chapter-1/group-theory/basic-concepts"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                        ← Previous: Basic Concepts
                    </Link>
                    <Link href="/chapter-1/group-theory/applications"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next: Applications →
                    </Link>
                </div>
            </div>
        </main>
    );
}
