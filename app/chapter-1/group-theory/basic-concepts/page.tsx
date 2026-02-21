"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BasicGroupConcepts, GroupsSubgroupsCosets, GroupHomomorphisms } from '@/components/content/GroupTheoryContent';
import SymmetryGroupLab from '@/components/math-viz/SymmetryGroupLab';
import SubgroupCosetLab from '@/components/math-viz/SubgroupCosetLab';
import HomomorphismLab from '@/components/math-viz/HomomorphismLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What is a Group?",
        text: `A group is one of the most fundamental structures in abstract algebra. It consists of a set G together with a binary operation that combines any two elements to produce a third element. Think of it like a system of transformations where you can always combine transformations, undo them, and there's always a "do nothing" transformation. Groups capture the essence of symmetry — the ways you can transform an object and leave it looking the same.`,
    },
    {
        title: "The Four Group Axioms",
        text: `Every group must satisfy four axioms. First, closure: combining any two elements in the group produces another element in the group. Second, associativity: the order in which you perform combinations doesn't matter, as long as the sequence stays the same. Third, identity: there exists a special element, usually called e, that leaves any element unchanged when combined with it. Fourth, inverse: every element has a partner that, when combined with it, produces the identity element. These four axioms are deceptively simple but incredibly powerful.`,
    },
    {
        title: "Subgroups",
        text: `A subgroup is a subset of a group that is itself a group under the same operation. For example, the even integers form a subgroup of all integers under addition. To check if a subset H is a subgroup of G, you need to verify that H is closed under the group operation and under taking inverses. Subgroups reveal the internal structure of groups and help us decompose complex symmetries into simpler ones.`,
    },
    {
        title: "Cosets and Lagrange's Theorem",
        text: `Given a subgroup H of a group G, a coset is what you get by multiplying every element of H by a fixed element from G. Left cosets have the form g times H, and they partition the group into non-overlapping pieces of equal size. Lagrange's theorem is a beautiful result that follows: the order of any subgroup must divide the order of the group. This means if your group has 12 elements, subgroups can only have 1, 2, 3, 4, 6, or 12 elements — never 5 or 7.`,
    },
    {
        title: "Group Homomorphisms",
        text: `A homomorphism is a function between two groups that preserves the group structure. If f is a homomorphism from G to H, then f of a times b equals f of a times f of b. Homomorphisms are the "structure-preserving maps" of group theory. The kernel of a homomorphism — the set of elements that map to the identity — tells us about the information lost in the mapping. An isomorphism is a bijective homomorphism, meaning the two groups are essentially the same in structure.`,
    },
    {
        title: "Groups in Machine Learning",
        text: `Group theory has deep connections to machine learning. Symmetry groups describe the invariances we want our models to learn — for example, a image classifier should recognize a cat regardless of rotation or translation. Equivariant neural networks are designed so their outputs transform predictably under group actions. In transformers, the permutation symmetry of the attention mechanism can be understood through group theory, providing insights into why these architectures are so effective.`,
    },
];

export default function BasicConceptsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/chapter-1/group-theory" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Group Theory
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.2.1: Basic Concepts of Group Theory</p>
                </div>

                {/* Audio Explainer */}
                <div className="mb-12 max-w-3xl">
                    <AudioExplainer sections={AUDIO_SECTIONS} accentColor="pink" />
                </div>

                <div className="flex flex-col gap-24">
                    {/* Basic Group Axioms */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <BasicGroupConcepts />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SymmetryGroupLab />
                            </div>
                        </div>
                    </div>

                    {/* Groups, Subgroups, and Cosets */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <GroupsSubgroupsCosets />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SubgroupCosetLab />
                            </div>
                        </div>
                    </div>

                    {/* Group Homomorphisms */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <GroupHomomorphisms />
                        </div>
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <HomomorphismLab />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Chapter Navigation */}
                <div className="mt-16 flex justify-end">
                    <Link href="/chapter-1/group-theory/representation-theory"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
                        Next: Representation Theory →
                    </Link>
                </div>
            </div>
        </main>
    );
}
