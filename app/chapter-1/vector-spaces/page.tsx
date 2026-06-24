"use client";

import React from 'react';
import VectorSpacesContent from '@/components/content/VectorSpaces';
import VectorAxiomsLab from '@/components/math-viz/VectorAxiomsLab';
import SubspaceBasisLab from '@/components/math-viz/SubspaceBasisLab';
import 'katex/dist/katex.min.css';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What is a Vector Space?",
        text: `A vector space is a collection of objects called vectors that can be added together and multiplied by numbers called scalars. Formally, a vector space V over a field F is a set equipped with two operations: vector addition and scalar multiplication. These operations must satisfy a set of axioms that generalize the familiar properties of vectors in two or three dimensions. In machine learning, data points like word embeddings, image patches, and audio features are all represented as vectors in high-dimensional spaces.`,
    },
    {
        title: "The Ten Vector Space Axioms",
        text: `Every vector space must satisfy ten axioms, split into two groups. The first eight govern vector addition: closure under addition, commutativity, associativity, existence of a zero vector, and existence of additive inverses. The remaining govern scalar multiplication: closure under scalar multiplication, distributivity of scalars over vector addition, distributivity of vectors over scalar addition, compatibility of scalar multiplication with field multiplication, and the identity element of scalar multiplication. These axioms guarantee that the algebraic operations behave predictably.`,
    },
    {
        title: "Subspaces",
        text: `A subspace is a subset of a vector space that is itself a vector space under the same operations. To verify that a subset W is a subspace of V, you need to check three conditions: W contains the zero vector, W is closed under addition, and W is closed under scalar multiplication. Subspaces are important because they represent the possible outputs of linear transformations. In transformers, the query, key, and value projections map embeddings into subspaces where attention can be computed.`,
    },
    {
        title: "Span and Linear Independence",
        text: `The span of a set of vectors is the collection of all possible linear combinations of those vectors — all the points you can reach by scaling and adding them. Vectors are linearly independent if none of them can be written as a linear combination of the others. Linear independence means each vector contributes genuinely new information. In the context of embeddings, linearly independent dimensions capture distinct semantic features.`,
    },
    {
        title: "Basis and Dimension",
        text: `A basis for a vector space is a set of linearly independent vectors that spans the entire space. The number of vectors in any basis is always the same — this number is called the dimension of the space. Every vector in the space can be uniquely expressed as a linear combination of basis vectors. In transformers, the model dimension d-model represents the dimension of the embedding space, and choosing the right dimension balances expressiveness against computational cost.`,
    },
    {
        title: "Vectors in Transformers",
        text: `Transformers process data by representing words, image patches, or other inputs as vectors in a high-dimensional space, typically with dimensions like 512 or 768. Operations like attention rely on vector arithmetic — dot products measure similarity, weighted sums combine information, and residual connections use vector addition directly. The ten vector space axioms ensure these operations are well-behaved, making vector spaces the mathematical foundation upon which the entire transformer architecture is built.`,
    },
];

export default function VectorSpacesPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="blue" />
            </div>

            <VectorSpacesContent
                axiomsViz={<VectorAxiomsLab />}
                subspacesViz={<SubspaceBasisLab />}
            />
        </LessonLayout>
    );
}
