"use client";

import React from 'react';
import VectorSpacesContent from '@/components/content/VectorSpaces';
import VectorAxiomsLab from '@/components/math-viz/VectorAxiomsLab';
import SubspaceBasisLab from '@/components/math-viz/SubspaceBasisLab';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';
import Callout from '@/components/ui/Callout';
import VectorSpacesPythonExamples from '@/components/content/vector-spaces/PythonExamples';
import Quiz, { QuizQuestion } from '@/components/ui/Quiz';

const QUIZ: QuizQuestion[] = [
    {
        question: "How many axioms must a set satisfy to be a vector space?",
        options: ["3", "8", "10", "Infinitely many"],
        answer: 2,
        explanation:
            "Ten axioms in total — eight governing vector addition and two more for scalar multiplication.",
    },
    {
        question: "Which condition is NOT required for a subset $W$ to be a subspace?",
        options: [
            "$W$ contains the zero vector",
            "$W$ is closed under addition",
            "$W$ is closed under scalar multiplication",
            "$W$ contains a basis of the whole space",
        ],
        answer: 3,
        explanation:
            "A subspace only needs the zero vector and closure under addition and scalar multiplication. It need not span the whole space.",
    },
    {
        question: "A set of vectors is linearly independent when:",
        options: [
            "They all have the same length",
            "None can be written as a linear combination of the others",
            "They are mutually orthogonal",
            "Their sum is the zero vector",
        ],
        answer: 1,
        explanation:
            "Independence means no vector is redundant — none is a linear combination of the rest. Orthogonality is sufficient but not necessary.",
    },
    {
        question: "The dimension of a vector space is:",
        options: [
            "The number of vectors in any basis",
            "The largest entry of any vector",
            "The number of axioms it satisfies",
            "Always infinite",
        ],
        answer: 0,
        explanation:
            "Every basis of a space has the same size, and that number is the dimension.",
    },
    {
        question: "Is the set $\\{(x, y) \\in \\mathbb{R}^2 : x \\geq 0\\}$ a subspace?",
        options: ["Yes", "No"],
        answer: 1,
        explanation:
            "No — it isn't closed under scalar multiplication. Multiplying $(1, 0)$ by $-1$ gives $(-1, 0)$, which is outside the set.",
    },
    {
        question: "In a Transformer, the residual connection $x + \\text{Layer}(x)$ is an instance of:",
        options: [
            "Scalar multiplication",
            "Vector addition",
            "The dot product",
            "Matrix inversion",
        ],
        answer: 1,
        explanation:
            "Adding the input back to the layer output is exactly the vector-addition axiom in action.",
    },
];

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
        <LessonLayout>
            <div className="mb-10 max-w-3xl">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="blue" />
            </div>

            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[26rem_minmax(0,1fr)]">
                <div className="min-w-0">
                    <VectorSpacesContent />
                </div>

                <div className="flex flex-col gap-8">
                    <div className="xl:sticky xl:top-20">
                        <VectorAxiomsLab />

                        <Callout>
                            Transformers process data (words, image patches) as <strong>vectors</strong> in a high-dimensional space (<Latex>{"$d_{model} \\approx 512+$"}</Latex>).
                            Operations like <em>Attention</em> rely on vector arithmetic (dot products, weighted sums) grounded in these 10 axioms.
                            The <strong>Residual Connection</strong> (<Latex>{"$x + \\text{Layer}(x)$"}</Latex>) is a direct application of vector addition.
                        </Callout>

                        <div className="mt-8">
                            <SubspaceBasisLab />
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-20 border-t border-[var(--border)] pt-12">
                <VectorSpacesPythonExamples />
            </section>

            <section className="mt-20 max-w-3xl border-t border-[var(--border)] pt-12">
                <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    Practice
                </p>
                <Quiz questions={QUIZ} />
            </section>
        </LessonLayout>
    );
}
