"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// ── Section 1: Fourier Analysis of Positional Encodings ──────────────────────
export function FourierAnalysisOfPositionalEncodings() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Fourier Analysis of Positional Encodings
            </h2>

            <p>
                Positional encodings are essential for certain tasks in transformer models because
                they provide a way to incorporate the order of elements in a sequence, which is crucial
                for tasks like language modeling and translation. Unlike recurrent neural networks,
                transformers process input sequences in parallel, and thus require a method to inject
                sequential information into the model. This is achieved through positional encodings,
                which are often formulated using sinusoidal functions, providing a natural connection
                to Fourier analysis.
            </p>

            <p>
                Fourier analysis is a powerful mathematical tool that decomposes functions into their
                constituent frequencies. It is particularly useful for analyzing periodic functions,
                which are central to the construction of positional encodings in transformers. The
                use of sinusoidal functions in positional encodings can be understood through the
                lens of Fourier series and transforms, which allow us to express a function as a sum
                of sines and cosines, capturing both local and global features of the sequence.
            </p>

            <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-1 mt-8 mb-4">
                Fourier Series and Transforms
            </h3>

            <p>
                The Fourier series is a way to represent a periodic function <Latex>{'$f(x)$'}</Latex> defined on the
                interval <Latex>{'$[0, 2\\pi]$'}</Latex> (or equivalently on any interval <Latex>{'$[a, a + 2\\pi]$'}</Latex>) as an infinite sum of
                sines and cosines. Specifically, if <Latex>{'$f(x)$'}</Latex> is a periodic function with period <Latex>{'$2\\pi$'}</Latex>, its
                Fourier series is given by:
            </p>

            <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-200 text-center">
                <Latex>{'$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left(a_n \\cos(nx) + b_n \\sin(nx)\\right)$'}</Latex>
            </div>

            <p>
                where the coefficients <Latex>{'$a_n$'}</Latex> and <Latex>{'$b_n$'}</Latex> are determined by:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center flex flex-col items-center gap-2">
                <Latex>{'$a_n = \\frac{1}{\\pi} \\int_0^{2\\pi} f(x) \\cos(nx) \\,dx$'}</Latex>
                <Latex>{'$b_n = \\frac{1}{\\pi} \\int_0^{2\\pi} f(x) \\sin(nx) \\,dx$'}</Latex>
            </div>

            <p>
                The Fourier series expresses the function as a superposition of harmonics, where
                each term corresponds to a specific frequency component of the original function. For
                functions that are not inherently periodic, the Fourier transform generalizes this idea
                to express the function in terms of continuous frequencies. The Fourier transform of
                a function <Latex>{'$f(x)$'}</Latex> is defined as:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)e^{-2\\pi i\\xi x} \\,dx$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\hat{f}(\\xi)$'}</Latex> represents the amplitude of the frequency component <Latex>{'$\\xi$'}</Latex>. The inverse
                Fourier transform allows us to reconstruct the original function from its frequency
                components:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)e^{2\\pi i\\xi x} \\,d\\xi$'}</Latex>
            </div>

            <p>
                In the context of positional encodings, the use of Fourier series or transforms is
                motivated by the desire to represent the position of each element in a sequence as
                a combination of sinusoidal functions. These functions naturally encode positional
                information in a way that is smooth and periodic, capturing the relative positions of
                elements in the sequence.
            </p>
        </div>
    );
}

// ── Section 2: Periodic Functions and Signal Processing ──────────────────────
export function PeriodicFunctionsAndSignalProcessing() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">
                Periodic Functions and Signal Processing
            </h2>

            <p>
                The sinusoidal functions used in positional encodings are periodic, meaning they
                repeat their values at regular intervals. This periodicity is particularly useful in representing
                the positions within a sequence, as it allows the model to capture both
                local and global positional relationships through different frequency components. In
                signal processing, periodic functions like sines and cosines are fundamental because
                they serve as the basic building blocks for more complex signals. By decomposing
                a signal into its constituent frequencies using Fourier analysis, we can analyze and
                manipulate the signal in an intuitive way.
            </p>

            <p>
                In transformers, the positional encoding for a given position <Latex>{'$p$'}</Latex> and dimension <Latex>{'$i$'}</Latex> is typically defined as:
            </p>

            <div className="bg-blue-50 p-4 rounded-lg my-4 border border-blue-200 text-center flex flex-col items-center gap-3">
                <Latex>{'$\\text{PE}(p, 2i) = \\sin\\left(\\frac{p}{10000^{2i/d}}\\right)$'}</Latex>
                <Latex>{'$\\text{PE}(p, 2i + 1) = \\cos\\left(\\frac{p}{10000^{2i/d}}\\right)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$d$'}</Latex> is the dimensionality of the model. These encodings are designed so that
                each dimension of the positional encoding corresponds to a different frequency
                component, with higher dimensions encoding higher frequencies.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-5 my-6">
                <p className="text-sm text-blue-800">
                    The periodic nature of these functions ensures that positional encodings are
                    smooth and continuous, allowing the model to generalize well to unseen positions.
                    Moreover, the combination of sines and cosines at different frequencies enables
                    the model to capture a wide range of positional relationships, from short-range
                    dependencies to long-range interactions.
                </p>
            </div>

            <h3 className="text-xl font-bold text-blue-700 border-b border-blue-200 pb-1 mt-8 mb-4">
                Positional Encoding Vector Representation
            </h3>

            <p>
                Consider a simple sequence of positions <Latex>{'$p = 0, 1, 2, \\dots, N - 1$'}</Latex>. The
                positional encoding for the position <Latex>{'$p$'}</Latex> can be represented as a vector:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 overflow-x-auto">
                <div className="flex justify-center min-w-max px-4">
                    <Latex>{'$\\text{PE}(p) = \\left[ \\sin\\left(\\frac{p}{10000^{0/d}}\\right), \\cos\\left(\\frac{p}{10000^{0/d}}\\right), \\sin\\left(\\frac{p}{10000^{2/d}}\\right), \\cos\\left(\\frac{p}{10000^{2/d}}\\right), \\dots \\right]$'}</Latex>
                </div>
            </div>

            <p>
                This encoding scheme ensures that each position is mapped to a unique point in
                the high-dimensional space, with the difference between positions being captured
                by the differences in their sinusoidal components. The periodicity of these functions
                means that the encodings will eventually repeat, which can be advantageous for tasks
                that involve cyclic or repetitive patterns.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <h4 className="font-bold text-slate-800 m-0 mb-2">Connection to Neural Networks</h4>
                <p className="text-sm text-slate-700 m-0">
                    The use of Fourier analysis in positional encodings highlights the deep connection
                    between signal processing and neural networks, where the goal is to encode information
                    in a way that preserves important features while allowing for efficient computation
                    and generalization. By leveraging the mathematical properties of Fourier
                    series and transforms, transformers can effectively represent the order of elements
                    in a sequence, enabling them to perform well on a wide range of tasks that require
                    understanding of sequential data.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Lie Groups and Lie Algebras ───────────────────────────────────
export function LieGroupsAndAlgebras() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-2 mb-4">
                Lie Groups and Lie Algebras
            </h2>

            <p>
                Lie groups and Lie algebras form a deep mathematical framework for understanding continuous symmetries,
                which are prevalent in many areas of mathematics and physics. Their application to transformers,
                particularly in understanding symmetries in data and model architecture, provides a foundation for
                analyzing and designing these models.
            </p>

            <p>
                Lie groups are mathematical structures that combine the properties of groups (algebraic operations)
                with the properties of smooth manifolds (geometric structures). They are used to describe continuous
                symmetries, such as rotations, translations, and scalings. The corresponding Lie algebras provide a
                linearized approximation of these symmetries, making them powerful tools for analysis.
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Basic Definitions and Properties
            </h3>

            <p>
                A Lie group is a group <Latex>{'$G$'}</Latex> that is also a smooth manifold, meaning that the group
                operations are smooth (differentiable) maps. Formally, a Lie group <Latex>{'$G$'}</Latex> is a
                set with two operations:
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <ol className="list-decimal list-outside ml-4 mt-0 mb-0 space-y-2 text-slate-700 text-sm">
                    <li>
                        A binary operation (group multiplication) <Latex>{'$\\cdot : G \\times G \\to G$'}</Latex>, which is smooth.
                    </li>
                    <li>
                        An inversion operation <Latex>{'$\\text{inv} : G \\to G, g \\mapsto g^{-1}$'}</Latex>, which is also smooth.
                    </li>
                </ol>
            </div>

            <div className="bg-teal-50 p-4 rounded-lg my-4 text-sm text-teal-800">
                <strong>Example:</strong> The set of <Latex>{'$n \\times n$'}</Latex> invertible matrices <Latex>{'$\\text{GL}(n, \\mathbb{R})$'}</Latex>, known as the
                general linear group, is a Lie group. The group operations are matrix multiplication and
                matrix inversion, both of which are smooth maps on the manifold of <Latex>{'$n \\times n$'}</Latex> matrices.
            </div>

            <p>
                The <strong>Lie algebra</strong> associated with a Lie group <Latex>{'$G$'}</Latex> is a vector space that captures the
                infinitesimal symmetries of the group. It can be thought of as the tangent space to
                the Lie group at the identity element. The Lie algebra <Latex>{'$\\mathfrak{g}$'}</Latex> of a Lie group <Latex>{'$G$'}</Latex> is defined
                as the set of all tangent vectors at the identity element of <Latex>{'$G$'}</Latex>, with a bilinear operation
                called the <strong>Lie bracket</strong>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center flex flex-col items-center gap-3">
                <Latex>{'$\\mathfrak{g} = T_e G$'}</Latex>
                <Latex>{'$[X, Y] = \\frac{\\partial}{\\partial t} \\bigg|_{t=0} \\left( \\exp(tX) \\cdot \\exp(tY) \\cdot \\exp(-tX) \\cdot \\exp(-tY) \\right)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\exp : \\mathfrak{g} \\to G$'}</Latex> is the exponential map that connects the Lie algebra to the Lie group.
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Properties of the Lie Bracket
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">1. Closure</h4>
                    <p className="text-xs text-slate-600">
                        For any two elements <Latex>{'$X, Y \\in \\mathfrak{g}$'}</Latex>, their Lie bracket <Latex>{'$[X, Y]$'}</Latex> is also in <Latex>{'$\\mathfrak{g}$'}</Latex>.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">2. Antisymmetry</h4>
                    <p className="text-xs text-slate-600 mb-2">
                        The Lie bracket is antisymmetric:
                    </p>
                    <div className="text-center text-xs">
                        <Latex>{'$[X, Y] = -[Y, X]$'}</Latex>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">3. Bilinearity</h4>
                    <p className="text-xs text-slate-600 mb-2">
                        For any scalars <Latex>{'$a, b \\in \\mathbb{R}$'}</Latex> and elements <Latex>{'$X, Y, Z \\in \\mathfrak{g}$'}</Latex>:
                    </p>
                    <div className="text-center text-xs flex flex-col gap-1">
                        <Latex>{'$[aX + bY, Z] = a[X, Z] + b[Y, Z]$'}</Latex>
                        <Latex>{'$[Z, aX + bY] = a[Z, X] + b[Z, Y]$'}</Latex>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-2">4. Jacobi Identity</h4>
                    <p className="text-xs text-slate-600 mb-2">
                        The Lie bracket satisfies the Jacobi identity:
                    </p>
                    <div className="text-center text-xs">
                        <Latex>{'$[X, [Y, Z]] + [Y, [Z, X]] + [Z, [X, Y]] = 0$'}</Latex>
                    </div>
                </div>
            </div>

            <p>
                These properties define the structure of the Lie algebra, making it a fundamental
                object in the study of continuous symmetries.
            </p>
        </div>
    );
}

// ── Section 4: Representations and Applications to Transformers ──────────────
export function LieRepresentationsAndApplications() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-2 mb-4">
                Representations of Lie Groups
            </h2>

            <p>
                A representation of a Lie group <Latex>{'$G$'}</Latex> on a vector space <Latex>{'$V$'}</Latex> is a homomorphism{' '}
                <Latex>{'$\\rho : G \\to \\text{GL}(V)$'}</Latex> from <Latex>{'$G$'}</Latex> to the general linear group <Latex>{'$\\text{GL}(V)$'}</Latex> of all
                invertible linear transformations on <Latex>{'$V$'}</Latex>. This representation allows the elements of
                the Lie group to be expressed as matrices, enabling the study of group actions in a
                linear algebraic framework.
            </p>

            <p>
                The corresponding representation of a Lie algebra <Latex>{'$\\mathfrak{g}$'}</Latex> is a homomorphism{' '}
                <Latex>{'$\\phi : \\mathfrak{g} \\to \\text{End}(V)$'}</Latex>, where <Latex>{'$\\text{End}(V)$'}</Latex> is the space of all linear endomorphisms
                (linear maps from <Latex>{'$V$'}</Latex> to itself). The representation <Latex>{'$\\phi$'}</Latex> satisfies:
            </p>

            <div className="bg-teal-50 p-4 rounded-lg my-4 border border-teal-200 text-center">
                <Latex>{'$\\phi([X, Y]) = \\phi(X)\\phi(Y) - \\phi(Y)\\phi(X)$'}</Latex>
            </div>

            <p>
                for all <Latex>{'$X, Y \\in \\mathfrak{g}$'}</Latex>.
            </p>

            <div className="bg-teal-50 p-4 rounded-lg my-4 text-sm text-teal-800">
                <strong>Example:</strong> Consider the Lie group <Latex>{'$\\text{SO}(3)$'}</Latex>, the group of rotations in three-dimensional
                space. The corresponding Lie algebra <Latex>{'$\\mathfrak{so}(3)$'}</Latex> consists of all skew-symmetric <Latex>{'$3 \\times 3$'}</Latex> matrices.
                A representation of <Latex>{'$\\text{SO}(3)$'}</Latex> on <Latex>{'$\\mathbb{R}^3$'}</Latex> is given by the action of rotation matrices on vectors
                in <Latex>{'$\\mathbb{R}^3$'}</Latex>. The corresponding representation of <Latex>{'$\\mathfrak{so}(3)$'}</Latex> is given by the action of the
                skew-symmetric matrices on vectors in <Latex>{'$\\mathbb{R}^3$'}</Latex>.
            </div>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Applications to Transformers
            </h3>

            <p>
                In the context of transformers, Lie groups and their representations can be used to
                model and exploit symmetries in the data and the model architecture:
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-teal-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Symmetries in Data</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    Many types of data, such as images, signals, and sequences, exhibit symmetries that can be
                    modeled using Lie groups. For instance, rotational symmetry in images can be described by the
                    Lie group <Latex>{'$\\text{SO}(2)$'}</Latex>, and translational symmetry can be described by the Euclidean group.
                </p>
                <p className="text-sm text-slate-700">
                    By understanding and incorporating these symmetries into the model, transformers can be designed
                    to be more robust and efficient. In natural language processing, certain grammatical structures
                    exhibit symmetries that can be modeled using Lie groups (e.g., active to passive voice transformations).
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-teal-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Symmetries in Model Architecture</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    The attention mechanism in transformers can be analyzed through the lens of Lie groups, particularly
                    in understanding how different transformations of the input data affect the output. By designing
                    the attention mechanism to be equivariant or invariant under certain group actions, the model
                    can be made more robust.
                </p>
                <p className="text-sm text-slate-700">
                    The concept of <em>Lie algebraic layers</em>—where transformations applied in each layer correspond
                    to elements of a Lie algebra—provides a framework for designing architectures that respect certain
                    symmetries.
                </p>
            </div>

            <div className="bg-teal-50 border-l-4 border-teal-400 p-5 my-6">
                <p className="text-sm text-teal-800">
                    <strong>Example:</strong> Consider a transformer intended for processing images with rotational symmetry.
                    The model can be made rotation-equivariant by incorporating a representation of the rotation group <Latex>{'$\\text{SO}(2)$'}</Latex> into
                    the attention mechanism, or by using Lie algebraic layers that inherently respect this symmetry.
                </p>
            </div>
        </div>
    );
}

// ── Section 5: Harmonic Analysis on Groups ───────────────────────────────────
export function HarmonicAnalysisOfGroups() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-cyan-700 border-b-2 border-cyan-200 pb-2 mb-4">
                Harmonic Analysis on Groups
            </h2>

            <p>
                Harmonic analysis on groups extends the ideas of Fourier analysis to more general
                settings, where the underlying space is not the real line or Euclidean space but rather
                a group, often a Lie group. This extension is crucial for understanding how functions
                can be decomposed into basic, symmetric components, particularly in the context
                of rotational symmetries and other transformations.
            </p>

            <p>
                The tools of harmonic analysis, such as spherical harmonics and Wigner-D functions, provide a deep mathematical
                framework for studying symmetries in data, which can be exploited in transformer
                architectures to enhance model expressivity and robustness. Harmonic analysis on
                groups involves representing functions defined on a group as a sum or integral of
                basic functions that respect the group’s structure.
            </p>

            <div className="bg-cyan-50 p-4 rounded-lg my-4 text-sm text-cyan-800 border border-cyan-100">
                This approach generalizes classical Fourier analysis to functions defined on more complex domains,
                such as spheres or rotation groups. The study of such representations is fundamental in physics,
                chemistry, and signal processing, and has important implications in machine learning for incorporating
                symmetries into models like transformers.
            </div>

            <h3 className="text-xl font-bold text-cyan-700 border-b border-cyan-200 pb-1 mt-8 mb-4">
                Spherical Harmonics
            </h3>

            <p>
                Spherical harmonics are special functions defined on the surface of a sphere
                that form an orthogonal basis for the space of square-integrable functions on the
                sphere <Latex>{'$S^2$'}</Latex>. Mathematically, spherical harmonics are the eigenfunctions of the Laplace operator on the sphere.
            </p>

            <p>
                Let <Latex>{'$Y_\\ell^m(\\theta, \\phi)$'}</Latex> denote the spherical harmonic of degree <Latex>{'$\\ell$'}</Latex> and order <Latex>{'$m$'}</Latex>, where{' '}
                <Latex>{'$\\theta \\in [0, \\pi]$'}</Latex> is the polar angle, and <Latex>{'$\\phi \\in [0, 2\\pi]$'}</Latex> is the azimuthal angle. The spherical
                harmonics are defined as:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$Y_\\ell^m(\\theta, \\phi) = \\sqrt{\\frac{(2\\ell + 1)(\\ell - m)!}{4\\pi(\\ell + m)!}} P_\\ell^m(\\cos \\theta) e^{im\\phi}$'}</Latex>
            </div>

            <p>
                where <Latex>{'$P_\\ell^m(x)$'}</Latex> are the associated Legendre polynomials. The indices <Latex>{'$\\ell$'}</Latex> and <Latex>{'$m$'}</Latex> satisfy{' '}
                <Latex>{'$\\ell \\geq 0$'}</Latex> and <Latex>{'$-\\ell \\leq m \\leq \\ell$'}</Latex>.
            </p>

            <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Properties of Spherical Harmonics</h4>

            <div className="space-y-4 my-4">
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">1. Orthogonality</h5>
                    <p className="text-sm text-slate-600 mb-2">
                        Spherical harmonics satisfy an orthogonality condition over the sphere:
                    </p>
                    <div className="text-center">
                        <Latex>{'$\\int_0^{2\\pi} \\int_0^\\pi Y_\\ell^m(\\theta, \\phi) \\overline{Y_{\\ell\'}^{m\'}(\\theta, \\phi)} \\sin \\theta \\,d\\theta \\,d\\phi = \\delta_{\\ell\\ell\'} \\delta_{mm\'}$'}</Latex>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">2. Completeness</h5>
                    <p className="text-sm text-slate-600 mb-2">
                        Any square-integrable function <Latex>{'$f(\\theta, \\phi)$'}</Latex> on the sphere can be expanded as a series:
                    </p>
                    <div className="text-center flex flex-col gap-2">
                        <Latex>{'$f(\\theta, \\phi) = \\sum_{\\ell=0}^\\infty \\sum_{m=-\\ell}^\\ell c_\\ell^m Y_\\ell^m(\\theta, \\phi)$'}</Latex>
                        <span className="text-xs text-slate-500">where coefficients are:</span>
                        <Latex>{'$c_\\ell^m = \\int_0^{2\\pi} \\int_0^\\pi f(\\theta, \\phi) \\overline{Y_\\ell^m(\\theta, \\phi)} \\sin \\theta \\,d\\theta \\,d\\phi$'}</Latex>
                    </div>
                </div>
            </div>

            <p>
                In transformer models dealing with 3D data, incorporating spherical harmonics helps the model process
                patterns that are invariant under rotations, leading to better generalization.
                The attention mechanism can focus on features important regardless of the object's orientation.
            </p>
        </div>
    );
}

// ── Section 6: Wigner-D Functions and Applications ───────────────────────────
export function WignerDFunctions() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-cyan-700 border-b-2 border-cyan-200 pb-2 mb-4">
                Wigner-D Functions
            </h2>

            <p>
                Wigner-D functions generalize the concept of spherical harmonics to more
                complex group actions, particularly in the context of the rotation group <Latex>{'$\\text{SO}(3)$'}</Latex>. They
                are used to represent the rotations of quantum states and are essential in the study of
                angular momentum in quantum mechanics. In harmonic analysis, Wigner-D functions provide a way to
                express the action of the rotation group on functions defined on the sphere.
            </p>

            <p>
                Let <Latex>{'$D_{m\'m}^j(\\alpha, \\beta, \\gamma)$'}</Latex> denote the Wigner-D function for a rotation parameterized by
                Euler angles <Latex>{'$(\\alpha, \\beta, \\gamma)$'}</Latex>, where <Latex>{'$j$'}</Latex> is the total angular momentum quantum number, and{' '}
                <Latex>{'$m, m\'$'}</Latex> are magnetic quantum numbers. The Wigner-D function is defined as:
            </p>

            <div className="bg-cyan-50 p-4 rounded-lg my-4 border border-cyan-200 text-center">
                <Latex>{'$D_{m\'m}^j(\\alpha, \\beta, \\gamma) = e^{-im\'\\alpha} d_{m\'m}^j(\\beta) e^{-im\\gamma}$'}</Latex>
            </div>

            <p>
                where <Latex>{'$d_{m\'m}^j(\\beta)$'}</Latex> are the Wigner small d-matrices, which depend only on the angle <Latex>{'$\\beta$'}</Latex>.
            </p>

            <p>
                The Wigner-D functions satisfy important orthogonality relations over the rotation group space:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 overflow-x-auto text-sm">
                <div className="flex justify-center min-w-max px-4">
                    <Latex>{'$\\int_0^{2\\pi} \\int_0^\\pi \\int_0^{2\\pi} D_{m\'m}^j(\\alpha, \\beta, \\gamma) \\overline{D_{m\'\'m\'\'\'}^{j\'}(\\alpha, \\beta, \\gamma)} \\sin \\beta \\,d\\alpha \\,d\\beta \\,d\\gamma = \\frac{8\\pi^2}{2j + 1} \\delta_{jj\'} \\delta_{m\'m\'\'} \\delta_{mm\'\'\'}$'}</Latex>
                </div>
            </div>

            <h3 className="text-xl font-bold text-cyan-700 border-b border-cyan-200 pb-1 mt-8 mb-4">
                Role in Transformer Architectures
            </h3>

            <p>
                Wigner-D functions are essential for representing and analyzing data that is subject to rotations,
                particularly in 3D spaces. In transformer models, these functions can be used to design
                attention mechanisms that are invariant to rotations, which is critical in fields like
                robotics, molecular dynamics, and computer graphics.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <p className="text-sm text-slate-700 mb-0">
                    For instance, in a transformer model designed to process 3D point clouds, Wigner-D
                    functions can be used to ensure that the attention mechanism correctly accounts for
                    the rotational symmetries of the input data. By incorporating Wigner-D functions into
                    the model, one can achieve <strong>rotational invariance</strong>, meaning that the model's output
                    remains consistent regardless of how the input is rotated.
                </p>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-5 mt-6 border border-cyan-100 rounded-r-lg">
                <p className="text-sm text-cyan-900 m-0">
                    <strong>Summary: </strong>
                    The use of Wigner-D functions and spherical harmonics in transformers extends
                    the model's capability to understand and exploit the symmetries inherent in the
                    data. These tools provide a mathematical framework for analyzing how the model
                    processes data with continuous symmetries, leading to more robust and intelligent architectures.
                </p>
            </div>
        </div>
    );
}
