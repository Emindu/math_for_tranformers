"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export function EigenIntroContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                1.1.3 Eigenvalues and Eigenvectors
            </h2>

            <p>
                Eigenvalues and eigenvectors are fundamental concepts in linear algebra that provide deep insights
                into the structure of linear transformations. Given a linear transformation <Latex>{'$T : V \\to V$'}</Latex> on
                a vector space <Latex>{'$V$'}</Latex>, an <strong>eigenvector</strong> <Latex>{'$v \\in V$'}</Latex> is a non-zero
                vector that is scaled by <Latex>{'$T$'}</Latex> by a scalar factor known as the <strong>eigenvalue</strong>.
            </p>

            <p>
                Formally, <Latex>{'$v$'}</Latex> is an eigenvector of <Latex>{'$T$'}</Latex> corresponding to the
                eigenvalue <Latex>{'$\\lambda \\in F$'}</Latex> if:
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg my-4 text-center">
                <Latex>{'$$T(v) = \\lambda v$$'}</Latex>
            </div>

            <p>
                This equation indicates that the action of <Latex>{'$T$'}</Latex> on <Latex>{'$v$'}</Latex> does not
                change its <em>direction</em> but only its <em>magnitude</em>. The scalar <Latex>{'$\\lambda$'}</Latex> captures
                the amount of scaling, and the vector <Latex>{'$v$'}</Latex> reveals the direction along which this scaling occurs.
            </p>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-6 mb-3">
                Characteristic Equation
            </h3>

            <p>
                To find the eigenvalues of a linear transformation, one must solve the <strong>characteristic equation</strong>,
                derived from the determinant of the matrix representation of <Latex>{'$T$'}</Latex> minus <Latex>{'$\\lambda$'}</Latex> times
                the identity matrix:
            </p>

            <div className="bg-slate-100 p-4 rounded-lg my-4 text-center">
                <Latex>{'$$\\det([T] - \\lambda I) = 0$$'}</Latex>
            </div>

            <p>
                The solutions to this polynomial equation in <Latex>{'$\\lambda$'}</Latex> give the eigenvalues.
                For each eigenvalue, the corresponding eigenvectors are found by solving:
            </p>

            <div className="bg-slate-100 p-4 rounded-lg my-4 text-center">
                <Latex>{'$$([T] - \\lambda I)v = 0$$'}</Latex>
            </div>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-6 mb-3">
                Geometric Interpretation
            </h3>

            <p>
                The geometric interpretation of eigenvectors is closely tied to <strong>symmetry and invariance</strong>.
                Eigenvectors represent the <em>principal directions</em> of a transformation—directions that remain unchanged
                except for scaling. In quantum mechanics, eigenvectors represent possible states of a system. In mechanical
                systems, they describe principal directions of vibration.
            </p>
        </div>
    );
}

export function SpectralTheoremContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-purple-700 border-b-2 border-purple-300 pb-1 mt-0 mb-4">
                The Spectral Theorem
            </h3>

            <p>
                The spectral theorem is a cornerstone result in linear algebra, particularly in the study of
                <strong> normal operators</strong> on finite-dimensional vector spaces. It provides a powerful tool for
                analyzing linear transformations by decomposing them into simpler components.
            </p>

            <p>
                For a linear operator <Latex>{'$T : V \\to V$'}</Latex> on a finite-dimensional vector space
                <Latex>{'$V$'}</Latex> over <Latex>{'$\\mathbb{C}$'}</Latex>, the spectral theorem states that
                <Latex>{'$T$'}</Latex> is diagonalizable if and only if it is <strong>normal</strong>, meaning:
            </p>

            <div className="bg-purple-50 p-4 rounded-lg my-4 text-center">
                <Latex>{'$$TT^* = T^*T$$'}</Latex>
            </div>

            <p>
                where <Latex>{'$T^*$'}</Latex> is the conjugate transpose of <Latex>{'$T$'}</Latex>. The spectral theorem
                asserts that a normal operator <Latex>{'$T$'}</Latex> can be represented as:
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg my-6 text-center border border-purple-200">
                <Latex>{'$$T = U \\Lambda U^*$$'}</Latex>
                <p className="text-sm text-purple-700 mt-2">
                    The Spectral Decomposition
                </p>
            </div>

            <p>
                where <Latex>{'$U$'}</Latex> is a <strong>unitary matrix</strong> (satisfying <Latex>{'$U^*U = UU^* = I$'}</Latex>),
                and <Latex>{'$\\Lambda$'}</Latex> is a <strong>diagonal matrix</strong> whose entries are the eigenvalues
                of <Latex>{'$T$'}</Latex>. This result generalizes the diagonalization of symmetric matrices to a broader
                class of matrices and operators.
            </p>

            <h4 className="text-lg font-semibold text-purple-700 mt-5 mb-2">
                Geometric Interpretation
            </h4>

            <p>
                The geometric interpretation of the spectral theorem is profound: the transformation <Latex>{'$T$'}</Latex> can
                be understood as a sequence of three operations:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border-l-4 border-purple-400">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li><strong>Rotate into eigenbasis</strong> (<Latex>{'$U^*$'}</Latex>): Transform to the coordinate system aligned with eigenvectors</li>
                    <li><strong>Scale along principal axes</strong> (<Latex>{'$\\Lambda$'}</Latex>): Apply eigenvalue scaling along each orthogonal direction</li>
                    <li><strong>Rotate back</strong> (<Latex>{'$U$'}</Latex>): Return to the original coordinate system</li>
                </ol>
            </div>

            <p>
                This decomposition reveals the <em>intrinsic symmetries</em> of the transformation, which are crucial for
                understanding how systems maintain or break symmetry during processing.
            </p>

            <h4 className="text-lg font-semibold text-purple-700 mt-5 mb-2">
                Applications
            </h4>

            <p>
                The spectral theorem has profound implications across various domains:
            </p>

            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>Quantum Mechanics:</strong> Underpins the spectral decomposition of observables</li>
                <li><strong>Functional Analysis:</strong> Critical for studying compact operators on Hilbert spaces</li>
                <li><strong>Machine Learning:</strong> Symmetries correspond to invariances (rotational, translational) that models must learn</li>
                <li><strong>Transformers:</strong> Analyzing stability and behavior of layers through spectral properties</li>
            </ul>
        </div>
    );
}

export function DiagonalizationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-0 mb-4">
                Diagonalization
            </h3>

            <p>
                Diagonalization is the process of finding a basis for a vector space <Latex>{'$V$'}</Latex> in which the
                matrix representation of a linear transformation <Latex>{'$T$'}</Latex> is diagonal. Formally, a matrix <Latex>{'$A$'}</Latex>
                is said to be diagonalizable if there exists an invertible matrix <Latex>{'$P$'}</Latex> such that:
            </p>

            <div className="bg-slate-100 p-4 rounded-lg my-4 text-center">
                <Latex>{'$$P^{-1}AP = D$$'}</Latex>
            </div>

            <p>
                where <Latex>{'$D$'}</Latex> is a diagonal matrix. The columns of <Latex>{'$P$'}</Latex> are the eigenvectors of <Latex>{'$A$'}</Latex>, and the
                diagonal entries of <Latex>{'$D$'}</Latex> are the corresponding eigenvalues. Diagonalization simplifies
                the analysis of linear transformations by reducing them to scaling operations along
                the eigenvectors, which are the principal directions of the transformation.
            </p>

            <p>
                The process of diagonalization reveals the underlying structure of the transformation
                and allows for the decomposition of complex transformations into simpler, more
                interpretable components. This decomposition is particularly useful in the study of
                dynamical systems, where the long-term behavior of the system can often be understood
                by examining the eigenvalues of the transformation matrix. If the eigenvalues
                are all distinct and non-zero, the transformation is not only diagonalizable but
                also invertible, meaning that the system&apos;s behavior can be fully described by its
                eigenvalues and eigenvectors.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6">
                <p className="font-semibold text-amber-800 mb-2">Why this matters for Transformers</p>
                <p className="text-sm text-amber-900">
                    In the context of transformers, diagonalization can provide insights into the behavior
                    of layers and their ability to propagate information. For instance, in the self-attention
                    mechanism, understanding the eigenvalues and eigenvectors of the attention
                    matrix can reveal how information is weighted and combined across different
                    parts of the input sequence. This understanding is crucial for designing models that
                    effectively capture the hierarchical and symmetric structures in data.
                </p>
            </div>

            <p>
                The process of diagonalization is closely related to the concepts of symmetry
                and invariance. A diagonal matrix is invariant under the change of basis represented
                by its eigenvectors, meaning that the transformation acts independently along each
                of these directions. This invariance is a key feature in many intelligent systems,
                where the ability to recognize and exploit symmetry can lead to more efficient and
                robust models. In particular, transformers, which are designed to process data with
                complex, hierarchical structures, can benefit greatly from the insights provided by
                diagonalization and spectral analysis.
            </p>
        </div>
    );
}

// Default export for backward compatibility
export default function EigenvaluesEigenvectorsContent() {
    return (
        <>
            <EigenIntroContent />
            <SpectralTheoremContent />
            <DiagonalizationContent />
        </>
    );
}
