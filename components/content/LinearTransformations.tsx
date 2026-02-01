"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function LinearTransformationsContent() {
    return (
        <article className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2">1.1.2 Linear Transformations</h2>
            <p>
                Linear transformations, also known as linear maps, are the backbone of linear algebra
                and play a pivotal role in understanding the geometric and algebraic structure of
                vector spaces. A linear transformation <Latex>$T$</Latex> from a vector space <Latex>$V$</Latex> over a field <Latex>$F$</Latex> to
                another vector space <Latex>$W$</Latex> over the same field is a function <Latex>{'$T : V \\rightarrow W$'}</Latex> that preserves
                vector addition and scalar multiplication. Formally, for all <Latex>{'$u, v \\in V$'}</Latex> and <Latex>{'$\\alpha \\in F$'}</Latex>, the
                map <Latex>$T$</Latex> satisfies the following properties:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
                <li><Latex>{'$T(u + v) = T(u) + T(v)$'}</Latex></li>
                <li><Latex>{'$T(\\alpha u) = \\alpha T(u)$'}</Latex></li>
            </ol>
            <p className="mt-4">
                These properties ensure that the transformation <Latex>$T$</Latex> respects the linear structure
                of the vector space <Latex>$V$</Latex>, making <Latex>$T$</Latex> an essential tool for analyzing and manipulating
                vectors in <Latex>$V$</Latex>. The concept of linear transformations generalizes the idea of matrix
                multiplication and encompasses many operations in both pure and applied mathematics,
                including the transformations used in neural networks and, specifically, in
                the architecture of transformers.
            </p>
            <p className="mt-4">
                The geometric interpretation of a linear transformation is that it maps lines to lines
                and preserves the origin. This geometric perspective is crucial in understanding how
                linear transformations can be used to represent symmetries and invariances, which are
                fundamental in the design of intelligent systems such as transformers.
            </p>

            <h2 className="mt-8 text-3xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2">Kernels and Images</h2>
            <p>
                Given a linear transformation <Latex>{'$T : V \\rightarrow W$'}</Latex>, two subspaces of particular interest are
                the kernel and the image of <Latex>$T$</Latex>. The kernel of <Latex>$T$</Latex>, denoted <Latex>{'$\\ker(T)$'}</Latex>, is the set of all
                vectors in <Latex>$V$</Latex> that are mapped to the zero vector in <Latex>$W$</Latex>:
            </p>
            <p className="my-4 text-center">
                <Latex>{'$\\ker(T) = \\{v \\in V \\mid T(v) = 0\\}$'}</Latex>
            </p>
            <p>
                The kernel is a subspace of <Latex>$V$</Latex> because it satisfies the conditions for a subspace: it
                contains the zero vector, is closed under vector addition, and is closed under scalar
                multiplication. The dimension of the kernel, known as the nullity of <Latex>$T$</Latex>, provides
                important information about the linear dependence among the vectors in <Latex>$V$</Latex>.
            </p>
            <p className="mt-4">
                The image of <Latex>$T$</Latex>, denoted <Latex>{'$\\text{Im}(T)$'}</Latex>, is the set of all vectors in <Latex>$W$</Latex> that can be expressed
                as <Latex>{'$T(v)$'}</Latex> for some <Latex>{'$v \\in V$'}</Latex>:
            </p>
            <p className="my-4 text-center">
                <Latex>{'$\\text{Im}(T) = \\{w \\in W \\mid w = T(v) \\text{ for some } v \\in V\\}$'}</Latex>
            </p>
            <p>
                The image is a subspace of <Latex>$W$</Latex>, and its dimension is called the rank of <Latex>$T$</Latex>.
            </p>

            <h3 className="mt-6 text-xl font-semibold text-slate-800">Rank-Nullity Theorem</h3>
            <p>
                The Rank-Nullity Theorem is a fundamental result in linear algebra that relates the dimensions of the kernel and image of a linear
                transformation:
            </p>
            <div className="my-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="font-semibold text-indigo-900">Theorem 1.1 (Rank-Nullity Theorem)</p>
                <p className="text-indigo-800 mt-2">
                    Let <Latex>$V$</Latex> and <Latex>$W$</Latex> be vector spaces over a field <Latex>$F$</Latex>, and let <Latex>{'$T : V \\rightarrow W$'}</Latex> be a linear transformation. Then the dimension of the vector
                    space <Latex>$V$</Latex> is equal to the sum of the rank of <Latex>$T$</Latex> and the nullity of <Latex>$T$</Latex>:
                </p>
                <p className="text-center my-3">
                    <Latex>{'$\\dim(V) = \\text{rank}(T) + \\text{nullity}(T)$'}</Latex>
                </p>
            </div>

            <h2 className="mt-8 text-3xl font-bold text-indigo-700 border-b-2 border-indigo-100 pb-2">Matrix Representations</h2>
            <p>
                Every linear transformation <Latex>{'$T : V \\rightarrow W$'}</Latex> can be represented by a matrix once bases
                for <Latex>$V$</Latex> and <Latex>$W$</Latex> are chosen. If <Latex>{'$\\{v_1, v_2, \\ldots, v_n\\}$'}</Latex> is a basis for <Latex>$V$</Latex> and <Latex>{'$\\{w_1, w_2, \\ldots, w_m\\}$'}</Latex> is
                a basis for <Latex>$W$</Latex>, then the matrix representation of <Latex>$T$</Latex>, denoted <Latex>{'$[T]$'}</Latex>, is the <Latex>{'$m \\times n$'}</Latex> matrix
                whose <Latex>$j$</Latex>th column is the vector of coordinates of <Latex>{'$T(v_j)$'}</Latex> with respect to the basis <Latex>{'$\\{w_i\\}$'}</Latex>.
            </p>
            <p className="mt-4">
                The matrix representation provides a bridge between
                abstract linear algebra and concrete numerical methods. For instance, the composition
                of two linear transformations corresponds to the multiplication of their respective
                matrices.
            </p>
            <p className="mt-4">
                Matrices also have a natural geometric interpretation. For example, in <Latex>{'$\\mathbb{R}^2$'}</Latex>, a
                rotation matrix <Latex>{'$R(\\theta)$'}</Latex> represents a rotation by an angle <Latex>{'$\\theta$'}</Latex> about the origin:
            </p>
            <p className="my-4 text-center">
                <Latex>{'$R(\\theta) = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}$'}</Latex>
            </p>
            <p className="mt-4">
                In the context of transformers, matrix representations are used extensively to
                describe the operations within the network. The weights of the layers
                can be viewed as matrices that transform input vectors into output
                vectors. Understanding these matrices provides deep insights into the model's behavior.
            </p>
        </article>
    );
}
