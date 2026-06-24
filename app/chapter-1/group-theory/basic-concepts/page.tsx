"use client";

import React from 'react';
import { BasicConceptsContent } from '@/components/content/GroupTheoryContent';
import SymmetryGroupLab from '@/components/math-viz/SymmetryGroupLab';
import SubgroupCosetLab from '@/components/math-viz/SubgroupCosetLab';
import HomomorphismLab from '@/components/math-viz/HomomorphismLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

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
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="pink" />
            </div>

            <BasicConceptsContent
                groupAxiomsLab={<SymmetryGroupLab />}
                subgroupLab={<SubgroupCosetLab />}
                homomorphismLab={<HomomorphismLab />}
            />
        </LessonLayout>
    );
}
