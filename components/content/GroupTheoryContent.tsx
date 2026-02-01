"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export function BasicGroupConcepts() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                1.2.1 Basic Concepts of Group Theory
            </h2>

            <p>
                Group theory is a branch of abstract algebra that studies algebraic structures known
                as groups. Groups are fundamental in understanding the concept of symmetry in
                mathematics, physics, and various other disciplines, including the study of neural
                networks and transformers. A group <Latex>{'$G$'}</Latex> is a set equipped with a binary operation <Latex>{'$\\cdot$'}</Latex>
                (often called multiplication) that combines any two elements <Latex>{'$a$'}</Latex> and <Latex>{'$b$'}</Latex> in <Latex>{'$G$'}</Latex> to form
                another element <Latex>{'$a \\cdot b$'}</Latex> in <Latex>{'$G$'}</Latex>. The group operation must satisfy the following axioms:
            </p>

            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200">
                <ol className="list-decimal list-inside space-y-3 text-slate-800">
                    <li>
                        <strong>Closure:</strong> For all <Latex>{'$a, b \\in G$'}</Latex>, the product <Latex>{'$a \\cdot b \\in G$'}</Latex>.
                    </li>
                    <li>
                        <strong>Associativity:</strong> For all <Latex>{'$a, b, c \\in G$'}</Latex>, <Latex>{'$(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$'}</Latex>.
                    </li>
                    <li>
                        <strong>Identity Element:</strong> There exists an element <Latex>{'$e \\in G$'}</Latex> such that for all <Latex>{'$a \\in G$'}</Latex>,
                        <Latex>{'$e \\cdot a = a \\cdot e = a$'}</Latex>. This element <Latex>{'$e$'}</Latex> is called the identity element of the group.
                    </li>
                    <li>
                        <strong>Inverse Element:</strong> For each <Latex>{'$a \\in G$'}</Latex>, there exists an element <Latex>{'$a^{-1} \\in G$'}</Latex> such that
                        <Latex>{'$a \\cdot a^{-1} = a^{-1} \\cdot a = e$'}</Latex>, where <Latex>{'$e$'}</Latex> is the identity element.
                    </li>
                </ol>
            </div>

            <p>
                The study of groups is motivated by the need to understand symmetry in a structured way.
                For example, the set of all rotations of a regular polygon forms a group
                under the operation of composition, reflecting the symmetrical properties of the
                shape. This group encapsulates the geometric symmetries of the polygon and allows
                for a deep understanding of how these symmetries interact.
            </p>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-6 mb-4">
                Subgroups and Cosets
            </h3>

            <p>
                A subgroup <Latex>{'$H$'}</Latex> of a group <Latex>{'$G$'}</Latex> is a subset of <Latex>{'$G$'}</Latex> that is itself a group under the operation
                of <Latex>{'$G$'}</Latex>. Subgroups allow us to study the internal structure of groups. For example, the rotations of a square form a subgroup of all symmetries (which include reflections).
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Coset Partitioning</p>
                <p className="text-sm text-indigo-900">
                    Given a subgroup <Latex>{'$H$'}</Latex>, we can partition the entire group <Latex>{'$G$'}</Latex> into distinct <strong>cosets</strong>.
                    A left coset is <Latex>{'$gH = \\{g \\cdot h \\mid h \\in H\\}$'}</Latex>. Cosets explain why Lagrange's Theorem holds:
                    the size of a subgroup must divide the size of the group, because the group is perfectly tiled by these cosets.
                </p>
            </div>
        </div>
    );
}

export function RepresentationTheory() {
    return (
        <div className="prose prose-slate max-w-none mt-12">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                1.2.2 Representation Theory of Finite Groups
            </h2>

            <p>
                While abstract groups describe symmetries, <strong>representation theory</strong> describes how these abstract symmetries generally act on vector spaces. This is crucial for machine learning, as our data usually lives in a vector space (like <Latex>{'$\\mathbb{R}^d$'}</Latex>).
            </p>

            <p className="mt-4">
                Formally, a <strong>representation</strong> of a group <Latex>{'$G$'}</Latex> on a vector space <Latex>{'$V$'}</Latex> is a group homomorphism <Latex>{'$\\rho: G \\to \\text{GL}(V)$'}</Latex>.
                This means for every group element <Latex>{'$g$'}</Latex>, we assign an invertible matrix <Latex>{'$\\rho(g)$'}</Latex> such that the group structure is preserved:
            </p>

            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200 text-center">
                <Latex>{'$\\rho(g \\cdot h) = \\rho(g) \\cdot \\rho(h)$'}</Latex>
            </div>

            <p>
                This allows us to translate abstract algebraic rules into concrete linear algebra operations (matrix multiplications) that we can compute and utilize in neural networks.
            </p>

            <h3 className="text-xl font-semibold text-indigo-700 mt-6 mb-3">Key Concepts</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>
                    <strong>Faithful Representation:</strong> If different group elements always map to different matrices (the kernel is trivial), the representation is faithful. It fully preserves the group's information.
                </li>
                <li>
                    <strong>Irreducible Representations ("Irreps"):</strong> A representation is irreducible if there are no non-trivial subspaces <Latex>{'$W \\subset V$'}</Latex> that are invariant under all matrices <Latex>{'$\\rho(g)$'}</Latex>.
                    Irreps are the "atoms" of representation theory; any finite group representation can be decomposed into a direct sum of irreps.
                </li>
                <li>
                    <strong>Character Theory:</strong> The character of a representation is the trace of the matrices, <Latex>{'$\\chi(g) = \\text{Tr}(\\rho(g))$'}</Latex>. Characters provide a powerful, coordinate-independent way to study representations.
                </li>
            </ul>
        </div>
    );
}

export function TransformerApplications() {
    return (
        <div className="prose prose-slate max-w-none mt-12">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                1.2.3 Applications to Transformers
            </h2>

            <p>
                Why do we care about groups and representations in Transformers? The answer lies in <strong>invariance</strong> and <strong>equivariance</strong>.
                If our data has an underlying symmetry (like permutation invariance in a set of objects, or translation invariance in an image), we want our neural network to understand and respect that symmetry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <h4 className="font-bold text-amber-800 mb-2">Positional Encodings</h4>
                    <p className="text-sm text-amber-900">
                        In standard Transformers, the self-attention mechanism is permutation equivariant: it treats the sequence as a set. To handle sequential data (where order matters), we inject positional information.
                        From a group theory perspective, this breaks the full permutation symmetry <Latex>{'$S_n$'}</Latex> allowing the model to distinguish positions.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2">Equivariant Self-Attention</h4>
                    <p className="text-sm text-blue-900">
                        Recent research explores <strong>Group Equivariant Transformers</strong>. Instead of just scalar features, the neurons transform according to a specific group representation (e.g., rotation group <Latex>{'$SO(3)$'}</Latex> for 3D point clouds).
                        This guarantees that if the input rotates, the internal features simply rotate accordingly without distortion.
                    </p>
                </div>
            </div>

            <p>
                By defining the attention mechanism as a map between representation spaces, we can mathematically prove constraints on the weight matrices (like <Latex>{'$W_Q, W_K, W_V$'}</Latex>) that enforce these symmetries, leading to more data-efficient and robust models.
            </p>
        </div>
    );
}

export default function GroupTheoryContent() {
    return (
        <div className="space-y-12">
            <BasicGroupConcepts />
            <RepresentationTheory />
            <TransformerApplications />
        </div>
    );
}
