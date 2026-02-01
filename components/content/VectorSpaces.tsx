"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function VectorSpacesContent() {
    return (
        <article className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2">1.1.1 Vector Spaces</h2>
            <p>
                A vector space (also called a linear space) is a fundamental concept in mathematics that encapsulates
                the notions of addition and scalar multiplication. Formally, a vector space <Latex>$V$</Latex> over a field <Latex>$F$</Latex> (such as <Latex>{'$\\mathbb{R}$'}</Latex> or <Latex>{'$\\mathbb{C}$'}</Latex>)
                is a set equipped with two operations: vector addition and scalar multiplication.
            </p>

            <h3>The 10 Axioms</h3>
            <p>These operations satisfy the following axioms:</p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>
                    <strong>Closure under addition:</strong> For all <Latex>{'$u, v \\in V$'}</Latex>, the sum <Latex>{'$u + v \\in V$'}</Latex>.
                </li>
                <li>
                    <strong>Associativity of addition:</strong> For all <Latex>{'$u, v, w \\in V$'}</Latex>, <Latex>{'$(u + v) + w = u + (v + w)$'}</Latex>.
                </li>
                <li>
                    <strong>Existence of additive identity:</strong> There exists an element <Latex>{'$0 \\in V$'}</Latex> such that <Latex>{'$v + 0 = v$'}</Latex> for all <Latex>{'$v \\in V$'}</Latex>.
                </li>
                <li>
                    <strong>Existence of additive inverses:</strong> For each <Latex>{'$v \\in V$'}</Latex>, there exists an element <Latex>{'$-v \\in V$'}</Latex> such that <Latex>{'$v + (-v) = 0$'}</Latex>.
                </li>
                <li>
                    <strong>Commutativity of addition:</strong> For all <Latex>{'$u, v \\in V$'}</Latex>, <Latex>{'$u + v = v + u$'}</Latex>.
                </li>
                <li>
                    <strong>Closure under scalar multiplication:</strong> For all <Latex>{'$\\alpha \\in F$'}</Latex> and <Latex>{'$v \\in V$'}</Latex>, <Latex>{'$\\alpha v \\in V$'}</Latex>.
                </li>
                <li>
                    <strong>Distributivity of scalar multiplication w.r.t vector addition:</strong> For all <Latex>{'$\\alpha \\in F$'}</Latex> and <Latex>{'$u, v \\in V$'}</Latex>, <Latex>{'$\\alpha (u + v) = \\alpha u + \\alpha v$'}</Latex>.
                </li>
                <li>
                    <strong>Distributivity of scalar multiplication w.r.t scalar addition:</strong> For all <Latex>{'$\\alpha, \\beta \\in F$'}</Latex> and <Latex>{'$v \\in V$'}</Latex>, <Latex>{'$(\\alpha + \\beta)v = \\alpha v + \\beta v$'}</Latex>.
                </li>
                <li>
                    <strong>Associativity of scalar multiplication:</strong> For all <Latex>{'$\\alpha, \\beta \\in F$'}</Latex> and <Latex>{'$v \\in V$'}</Latex>, <Latex>{'$\\alpha (\\beta v) = (\\alpha \\beta)v$'}</Latex>.
                </li>
                <li>
                    <strong>Existence of multiplicative identity:</strong> For every <Latex>{'$v \\in V$'}</Latex>, <Latex>{'$1 \\cdot v = v$'}</Latex>.
                </li>
            </ol>

            <p className="mt-4">
                These axioms ensure that vector spaces generalize the concept of Euclidean spaces to potentially infinite dimensions.
                They serve as the foundation for many areas of mathematics, including the theory of linear transformations,
                which plays a crucial role in understanding the architecture of transformers in deep learning.
            </p>

            <h2 className="mt-8 text-3xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2">Subspaces and Bases</h2>
            <p>
                A subspace <Latex>$W$</Latex> of a vector space <Latex>$V$</Latex> is a subset of <Latex>$V$</Latex> that is itself a vector space under
                the operations of addition and scalar multiplication inherited from <Latex>$V$</Latex>. Formally, a
                subset <Latex>{'$W \\subseteq V$'}</Latex> is a subspace if it satisfies the following conditions:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>
                    The zero vector of <Latex>$V$</Latex> is in <Latex>$W$</Latex>, i.e., <Latex>{'$\\mathbf{0} \\in W$'}</Latex>.
                </li>
                <li>
                    <Latex>$W$</Latex> is closed under addition: For all <Latex>{'$u, v \\in W$'}</Latex>, <Latex>{'$u + v \\in W$'}</Latex>.
                </li>
                <li>
                    <Latex>$W$</Latex> is closed under scalar multiplication: For all <Latex>{'$\\alpha \\in F$'}</Latex> and <Latex>{'$v \\in W$'}</Latex>, <Latex>{'$\\alpha v \\in W$'}</Latex>.
                </li>
            </ol>
            <p className="mt-4">
                The concept of a subspace is crucial in many areas of mathematics, particularly in linear algebra and geometry.
                For example, the set of all solutions to a homogeneous system of linear equations is a subspace of <Latex>{'$\\mathbb{R}^n$'}</Latex>.
                This subspace, known as the solution space or null space, encapsulates the degrees of freedom within the system.
            </p>

            <h3 className="mt-6">Basis and Linear Independence</h3>
            <p>
                A basis of a vector space <Latex>$V$</Latex> is a set of vectors <Latex>{'$\\{v_1, v_2, \\dots, v_n\\}$'}</Latex> in <Latex>$V$</Latex> that is linearly
                independent and spans <Latex>$V$</Latex>. A set of vectors is said to be linearly independent if no
                vector in the set can be expressed as a linear combination of the others. The span
                of a set of vectors is the set of all possible linear combinations of those vectors.
                Mathematically, a set <Latex>{'$\\{v_1, v_2, \\dots, v_n\\}$'}</Latex> is a basis for <Latex>$V$</Latex> if:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li>
                    The vectors are linearly independent: <Latex>{'$\\sum_{i=1}^n \\alpha_i v_i = 0$'}</Latex> implies <Latex>{'$\\alpha_i = 0$'}</Latex> for all <Latex>$i$</Latex>.
                </li>
                <li>
                    The vectors span <Latex>$V$</Latex>: For every <Latex>{'$v \\in V$'}</Latex>, there exist scalars <Latex>{'$\\alpha_1, \\alpha_2, \\dots, \\alpha_n$'}</Latex> such that
                    <Latex>{'$v = \\sum_{i=1}^n \\alpha_i v_i$'}</Latex>.
                </li>
            </ol>
            <p className="mt-4">
                The number of vectors in a basis is called the dimension of the vector space. In
                the context of transformers, the notion of a basis can be seen as a way of encoding
                the essential features of data in a minimal, yet complete, form. The concept of basis
                extends naturally to function spaces, where Fourier and wavelet bases are particularly
                relevant in understanding the representations used in machine learning models.
            </p>
            <p className="mt-4">
                For instance, in <Latex>{'$\\mathbb{R}^3$'}</Latex>, the standard basis is <Latex>{'$\\{e_1, e_2, e_3\\}$'}</Latex>, where <Latex>$e_i$</Latex> is the vector with
                a 1 in the <Latex>$i$</Latex>-th position and 0 elsewhere. Any vector in <Latex>{'$\\mathbb{R}^3$'}</Latex> can be uniquely expressed
                as a linear combination of these basis vectors. This idea generalizes to infinite-dimensional spaces, where bases may consist of an infinite number of vectors, such
                as the set of functions <Latex>{'$\\{1, x, x^2, x^3, \\dots\\}$'}</Latex> in the vector space of polynomials.
            </p>
            <p className="mt-4">
                Understanding subspaces and bases is fundamental for grasping the structure of
                vector spaces, which in turn is crucial for analyzing the linear algebraic operations
                underlying the mechanisms of transformers. These concepts also pave the way for
                exploring more advanced topics like eigenvectors, eigenspaces, and their role in
                simplifying linear transformations—a theme that recurs in the study of symmetries
                and invariances within transformer models.
            </p>
        </article>
    );
}
