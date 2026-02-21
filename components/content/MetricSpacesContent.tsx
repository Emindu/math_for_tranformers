"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Section 1: Definition of Metric Spaces ──────────────────────────────────
export function MetricSpaceDefinition() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Definition of Metric Spaces
            </h2>

            <p>
                A <strong>metric space</strong> is a set equipped with a function that defines a
                notion of distance between any two elements. Formally, a metric space is a
                pair <Latex>{'$(X, d)$'}</Latex>, where <Latex>{'$X$'}</Latex> is a set
                and <Latex>{'$d : X \\times X \\to \\mathbb{R}$'}</Latex> is a function (called
                a <strong>metric</strong> or <strong>distance function</strong>) satisfying the following
                properties for all <Latex>{'$x, y, z \\in X$'}</Latex>:
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200 space-y-3">
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                        <strong>Non-negativity:</strong>{' '}
                        <Latex>{'$d(x, y) \\geq 0$'}</Latex> — the distance between any two points is non-negative.
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                        <strong>Identity of indiscernibles:</strong>{' '}
                        <Latex>{'$d(x, y) = 0$'}</Latex> if and only if <Latex>{'$x = y$'}</Latex> — the distance between two distinct points is positive.
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                        <strong>Symmetry:</strong>{' '}
                        <Latex>{'$d(x, y) = d(y, x)$'}</Latex> — distance is symmetric with respect to its arguments.
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <div>
                        <strong>Triangle inequality:</strong>{' '}
                        <Latex>{'$d(x, z) \\leq d(x, y) + d(y, z)$'}</Latex> — the direct distance is always less than or equal to the sum through a third point.
                    </div>
                </div>
            </div>

            <p>
                These axioms encapsulate the essential properties of distance in a geometric space
                and provide the foundation for many topological concepts. The metric <Latex>{'$d$'}</Latex> induces
                a topology on <Latex>{'$X$'}</Latex>, which allows us to define concepts such as continuity,
                convergence, and compactness.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Metric Spaces in Transformers</p>
                <p className="text-sm text-indigo-900">
                    The importance of metric spaces in the study of attention mechanisms lies in the
                    ability to measure distances between representations (such as word embeddings or
                    image features) and to understand how these distances influence the behavior of
                    the model. In a language model, the distance between two word embeddings might
                    reflect the semantic similarity between the corresponding words, influencing the
                    attention mechanism&apos;s ability to focus on relevant parts of the input sequence.
                </p>
            </div>
        </div>
    );
}

// ── Section 2: Examples of Metric Spaces ────────────────────────────────────
export function MetricSpaceExamples() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Examples of Metric Spaces
            </h2>

            <p>
                The concept of a metric space is quite general and can be instantiated in various ways,
                depending on the nature of the set <Latex>{'$X$'}</Latex> and the
                metric <Latex>{'$d$'}</Latex>. Some common examples of metric spaces include:
            </p>

            {/* ── Euclidean ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                1. Euclidean Space
            </h3>
            <p>
                The most familiar example is the <Latex>{'$n$'}</Latex>-dimensional Euclidean
                space <Latex>{'$\\mathbb{R}^n$'}</Latex> equipped with the Euclidean metric.
                For any two points <Latex>{'$\\mathbf{x} = (x_1, x_2, \\ldots, x_n)$'}</Latex> and <Latex>{'$\\mathbf{y} = (y_1, y_2, \\ldots, y_n)$'}</Latex>:
            </p>
            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(\\mathbf{x}, \\mathbf{y}) = \\sqrt{\\sum_{i=1}^{n} (x_i - y_i)^2}$'}</Latex>
                </div>
                <p className="text-xs text-emerald-800 mt-2">
                    This corresponds to the straight-line distance and is fundamental in geometry and ML — used in clustering, classification, and k-NN.
                </p>
            </div>

            {/* ── Discrete ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                2. Discrete Metric Space
            </h3>
            <p>
                For any set <Latex>{'$X$'}</Latex>, the discrete metric is defined by:
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(x, y) = \\begin{cases} 0 & \\text{if } x = y \\\\ 1 & \\text{if } x \\neq y \\end{cases}$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-2">
                    All distinct points are equidistant. Useful in theoretical analysis of extreme separation between points.
                </p>
            </div>

            {/* ── Manhattan ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                3. Manhattan Distance (Taxicab Metric)
            </h3>
            <p>
                In <Latex>{'$\\mathbb{R}^n$'}</Latex>, the Manhattan distance reflects grid-like paths:
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(\\mathbf{x}, \\mathbf{y}) = \\sum_{i=1}^{n} |x_i - y_i|$'}</Latex>
                </div>
                <p className="text-xs text-blue-800 mt-2">
                    Widely used in image processing with pixel grids and problems where the grid structure is inherent.
                </p>
            </div>

            {/* ── Cosine ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                4. Cosine Distance
            </h3>
            <p>
                In high-dimensional vector spaces, such as word embeddings, cosine similarity is
                often used. The related <strong>cosine distance</strong> is:
            </p>
            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(\\mathbf{x}, \\mathbf{y}) = 1 - \\frac{\\mathbf{x} \\cdot \\mathbf{y}}{\\|\\mathbf{x}\\| \\, \\|\\mathbf{y}\\|}$'}</Latex>
                </div>
                <p className="text-xs text-violet-800 mt-2">
                    Measures the angle between vectors — direction matters more than magnitude. Essential in NLP and information retrieval.
                </p>
            </div>

            {/* ── Hamming ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                5. Hamming Distance
            </h3>
            <p>
                For strings of equal length over a fixed alphabet, the Hamming distance counts the
                number of positions where the corresponding symbols differ:
            </p>
            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(s_1, s_2) = \\sum_{i=1}^{n} \\delta(s_1[i], s_2[i])$'}</Latex>
                </div>
                <p className="text-xs text-pink-800 mt-2">
                    where <Latex>{'$\\delta(a, b) = 1$'}</Latex> if <Latex>{'$a \\neq b$'}</Latex>, and 0 otherwise.
                    Used in coding theory, error correction, and information retrieval.
                </p>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-slate-700">
                    <strong>Choosing the right metric</strong> is crucial in machine learning. The metric determines
                    how the model perceives relationships between data points and how it learns to focus on
                    relevant features. Euclidean distance works well for spatial data, cosine distance excels
                    for high-dimensional embeddings, and Manhattan distance is natural for grid-structured data.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Convergence and Completeness ─────────────────────────────────
export function ConvergenceCompleteness() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Convergence and Completeness
            </h2>

            <p>
                Convergence and completeness are fundamental concepts in the study of metric spaces,
                providing a framework for understanding the behavior of sequences and the structure
                of the space itself.
            </p>

            {/* ── Convergence ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Convergence of Sequences
            </h3>

            <p>
                A sequence <Latex>{'$\\{x_n\\}$'}</Latex> in a metric space <Latex>{'$(X, d)$'}</Latex> is
                said to <strong>converge</strong> to a point <Latex>{'$x \\in X$'}</Latex> if, for
                every <Latex>{'$\\varepsilon > 0$'}</Latex>, there exists an
                integer <Latex>{'$N$'}</Latex> such that for all <Latex>{'$n \\geq N$'}</Latex>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$d(x_n, x) < \\varepsilon$'}</Latex>
            </div>

            <p>
                In other words, the elements of the sequence eventually get arbitrarily close
                to <Latex>{'$x$'}</Latex>, and <Latex>{'$x$'}</Latex> is called the <strong>limit</strong> of
                the sequence, denoted <Latex>{'$\\lim_{n \\to \\infty} x_n = x$'}</Latex>.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-6">
                <p className="font-semibold text-violet-800 mb-2">Convergence in Machine Learning</p>
                <p className="text-sm text-violet-900">
                    This concept is crucial in ML, particularly in the analysis of algorithms that
                    iteratively update models to minimize a loss function. Understanding the conditions
                    under which parameter update sequences converge ensures that the algorithm behaves
                    predictably and leads to an optimal solution.
                </p>
            </div>

            {/* ── Cauchy Sequences ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Cauchy Sequences and Completeness
            </h3>

            <p>
                A sequence <Latex>{'$\\{x_n\\}$'}</Latex> is a <strong>Cauchy sequence</strong> if, for
                every <Latex>{'$\\varepsilon > 0$'}</Latex>, there exists an
                integer <Latex>{'$N$'}</Latex> such that for all <Latex>{'$m, n \\geq N$'}</Latex>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$d(x_m, x_n) < \\varepsilon$'}</Latex>
            </div>

            <p>
                A metric space <Latex>{'$(X, d)$'}</Latex> is said to be <strong>complete</strong> if
                every Cauchy sequence in <Latex>{'$X$'}</Latex> converges to a point
                in <Latex>{'$X$'}</Latex>. Completeness ensures that the space has no &ldquo;holes&rdquo;
                or &ldquo;gaps&rdquo;.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Theorem (Completeness of Metric Spaces)</p>
                <p className="text-sm text-amber-900 mb-2">
                    Let <Latex>{'$(X, d)$'}</Latex> be a metric space.
                    Then <Latex>{'$X$'}</Latex> is complete if and only if every Cauchy sequence
                    in <Latex>{'$X$'}</Latex> has a limit in <Latex>{'$X$'}</Latex>.
                </p>
                <div className="text-center mt-3">
                    <Latex>{'$\\{x_n\\} \\text{ Cauchy} \\implies \\exists\\, x \\in X : \\lim_{n \\to \\infty} x_n = x$'}</Latex>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Complete Spaces</h4>
                    <p className="text-xs text-emerald-900">
                        <Latex>{'$\\mathbb{R}^n$'}</Latex> with the Euclidean metric is complete.
                        Every convergent sequence has its limit within the space.
                        Banach and Hilbert spaces are complete normed and inner product spaces.
                    </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <h4 className="font-bold text-red-800 mb-2 text-sm">Incomplete Spaces</h4>
                    <p className="text-xs text-red-900">
                        <Latex>{'$\\mathbb{Q}$'}</Latex> (rationals) with the standard metric is
                        incomplete — Cauchy sequences can converge to
                        irrational numbers like <Latex>{'$\\sqrt{2}$'}</Latex>, which are not
                        in <Latex>{'$\\mathbb{Q}$'}</Latex>.
                    </p>
                </div>
            </div>

            {/* ── Optimization Context ── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Completeness in Neural Network Optimization
            </h3>

            <p>
                In training deep neural networks, the parameter space is often modeled as a
                high-dimensional metric space, and the completeness of this space ensures that
                sequences of iteratively updated parameters converge to a well-defined limit,
                representing the optimal set of parameters that minimizes the loss function.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Gradient Descent and Completeness</p>
                <p className="text-sm text-indigo-900">
                    Without completeness, the optimization process might diverge or oscillate without
                    reaching a stable solution. The completeness of <Latex>{'$\\mathbb{R}^n$'}</Latex> guarantees
                    that gradient descent trajectories can reach their optimal destination, provided
                    appropriate conditions on the learning rate and loss landscape are met.
                </p>
            </div>
        </div>
    );
}

// ── Section 4: Topology of Metric Spaces ─────────────────────────────────
export function TopologyOfMetricSpaces() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Topology of Metric Spaces
            </h2>

            <p>
                Topology provides a framework for understanding the structure and properties of
                metric spaces beyond mere distances. Here we delve into the fundamental
                topological concepts that are crucial for studying the geometry, symmetry, and
                continuity properties leveraged in the design of intelligent systems like transformers.
            </p>

            {/* ─── Open Sets ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Open Sets
            </h3>

            <p>
                An <strong>open set</strong> in a metric space <Latex>{'$(X, d)$'}</Latex> is a
                subset <Latex>{'$U \\subseteq X$'}</Latex> such that for every
                point <Latex>{'$x \\in U$'}</Latex>, there exists a radius <Latex>{'$\\varepsilon > 0$'}</Latex> for
                which the open ball centered at <Latex>{'$x$'}</Latex> is entirely contained within <Latex>{'$U$'}</Latex>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\forall\\, x \\in U,\\; \\exists\\, \\varepsilon > 0 : B(x, \\varepsilon) = \\{y \\in X \\mid d(x, y) < \\varepsilon\\} \\subseteq U$'}</Latex>
            </div>

            <p>
                Open sets are the building blocks of the topology on <Latex>{'$X$'}</Latex>, satisfying:
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-4 border border-slate-200 space-y-2">
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>The union of any collection of open sets is open.</div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>The intersection of a <em>finite</em> number of open sets is open.</div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>The empty set <Latex>{'$\\varnothing$'}</Latex> and the entire space <Latex>{'$X$'}</Latex> are open.</div>
                </div>
            </div>

            {/* ─── Closed Sets ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Closed Sets
            </h3>

            <p>
                A <strong>closed set</strong> <Latex>{'$C \\subseteq X$'}</Latex> is a subset whose
                complement <Latex>{'$X \\setminus C$'}</Latex> is open. Equivalently, <Latex>{'$C$'}</Latex> contains
                all its limit points:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\text{If } \\{x_n\\} \\subseteq C \\text{ and } \\lim_{n \\to \\infty} x_n = x, \\text{ then } x \\in C$'}</Latex>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
                    <h4 className="font-bold text-indigo-800 mb-2 text-sm">Open Ball (Open Set)</h4>
                    <p className="text-xs text-indigo-900">
                        <Latex>{'$B(x, r) = \\{y : d(x,y) < r\\}$'}</Latex> — boundary points
                        are <em>excluded</em>. Dashed boundary in visualization.
                    </p>
                </div>
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Closed Ball (Closed Set)</h4>
                    <p className="text-xs text-emerald-900">
                        <Latex>{'$\\overline{B}(x, r) = \\{y : d(x,y) \\leq r\\}$'}</Latex> — boundary points
                        are <em>included</em>. Solid boundary in visualization.
                    </p>
                </div>
            </div>

            {/* ─── Continuity ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Continuity
            </h3>

            <p>
                A function <Latex>{'$f : (X, d_X) \\to (Y, d_Y)$'}</Latex> between two metric spaces
                is <strong>continuous</strong> at a point <Latex>{'$x \\in X$'}</Latex> if, for
                every <Latex>{'$\\varepsilon > 0$'}</Latex>, there exists
                a <Latex>{'$\\delta > 0$'}</Latex> such that:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">ε-δ Definition</p>
                <div className="text-center my-2">
                    <Latex>{'$d_X(x, x_0) < \\delta \\implies d_Y(f(x), f(x_0)) < \\varepsilon$'}</Latex>
                </div>
                <p className="text-sm text-amber-900 mt-2">
                    Small changes in input result in small changes in output — no &ldquo;jumps&rdquo; or &ldquo;breaks&rdquo;.
                    In topology, <Latex>{'$f$'}</Latex> is continuous iff the preimage of every open set
                    in <Latex>{'$Y$'}</Latex> is open in <Latex>{'$X$'}</Latex>.
                </p>
            </div>

            {/* ─── Compactness ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Compactness
            </h3>

            <p>
                A subset <Latex>{'$K \\subseteq X$'}</Latex> is <strong>compact</strong> if every open cover
                of <Latex>{'$K$'}</Latex> has a finite subcover. An open cover is a collection of open
                sets <Latex>{'$\\{U_\\alpha\\}$'}</Latex> such
                that <Latex>{'$K \\subseteq \\bigcup_\\alpha U_\\alpha$'}</Latex>.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-6">
                <p className="font-semibold text-violet-800 mb-2">Heine–Borel Theorem</p>
                <p className="text-sm text-violet-900">
                    In <Latex>{'$\\mathbb{R}^n$'}</Latex>, a subset is compact if and only if it
                    is <strong>closed and bounded</strong>. Compact sets guarantee:
                </p>
                <ul className="text-sm text-violet-900 mt-2 space-y-1 list-disc list-inside">
                    <li>Every sequence has a convergent subsequence (sequential compactness)</li>
                    <li>Continuous functions attain their max/min (extreme value theorem)</li>
                </ul>
            </div>

            {/* ─── ML Applications ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Applications in Machine Learning
            </h3>

            <p>
                In the context of ML and attention mechanisms, compactness ensures the existence of
                solutions when optimizing over compact parameter sets. The <strong>Arzelà–Ascoli
                    theorem</strong> provides conditions under which a family of continuous functions is
                relatively compact — any sequence within the family has a uniformly convergent
                subsequence.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Neural Network Stability</p>
                <p className="text-sm text-indigo-900">
                    Continuity and compactness intersect in studying the stability and generalization
                    of ML models. The Arzelà–Ascoli theorem helps understand how neural networks
                    approximate functions and how well they generalize to unseen data — ensuring
                    that the transformation of data through the network preserves essential properties.
                </p>
            </div>
        </div>
    );
}

// ── Section 5: Mappings Between Metric Spaces ───────────────────────────────
export function MappingsBetweenMetricSpaces() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Mappings Between Metric Spaces
            </h2>

            <p>
                Mappings between metric spaces reveal deep insights into the geometry and
                symmetry of spaces, and are foundational to many concepts in analysis, geometry,
                and machine learning. In the context of transformers and attention mechanisms,
                understanding these mappings helps us explore how information is processed and
                how distances between data points are preserved or altered.
            </p>

            {/* ─── Isometries ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Isometries
            </h3>

            <p>
                An <strong>isometry</strong> is a mapping that preserves distances. If <Latex>{'$(X, d_X)$'}</Latex> and <Latex>{'$(Y, d_Y)$'}</Latex> are
                metric spaces, a function <Latex>{'$f : X \\to Y$'}</Latex> is an isometry if for
                all <Latex>{'$x_1, x_2 \\in X$'}</Latex>:
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d_Y(f(x_1), f(x_2)) = d_X(x_1, x_2)$'}</Latex>
                </div>
                <p className="text-xs text-emerald-800 mt-2">
                    The structure of <Latex>{'$X$'}</Latex> is perfectly preserved. In <Latex>{'$\\mathbb{R}^n$'}</Latex>,
                    rotations, translations, and reflections are isometries.
                </p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Isometries in Neural Networks</p>
                <p className="text-sm text-indigo-900">
                    In applications like image processing, it is often desirable that network
                    transformations preserve the spatial relationships between pixels — a type
                    of isometry. This ensures that geometric properties of the data survive
                    through different layers.
                </p>
            </div>

            {/* ─── Contractions ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Contraction Mappings
            </h3>

            <p>
                A <strong>contraction mapping</strong> is a function <Latex>{'$f : X \\to X$'}</Latex> where
                distances are strictly reduced. There exists a constant <Latex>{'$0 \\leq c < 1$'}</Latex> such
                that for all <Latex>{'$x_1, x_2 \\in X$'}</Latex>:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
                <div className="text-center">
                    <Latex>{'$d(f(x_1), f(x_2)) \\leq c \\cdot d(x_1, x_2)$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-2">
                    The constant <Latex>{'$c$'}</Latex> is the <strong>Lipschitz constant</strong>. Contractions
                    bring points closer together, with profound implications for fixed points — points <Latex>{'$x^*$'}</Latex> where <Latex>{'$f(x^*) = x^*$'}</Latex>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3">
                    <h4 className="font-bold text-emerald-800 mb-1 text-sm">c &lt; 1</h4>
                    <p className="text-xs text-emerald-900">Contraction — distances shrink. Converges to unique fixed point.</p>
                </div>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
                    <h4 className="font-bold text-amber-800 mb-1 text-sm">c = 1</h4>
                    <p className="text-xs text-amber-900">Isometry — distances preserved. No guaranteed fixed point.</p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-400 p-3">
                    <h4 className="font-bold text-red-800 mb-1 text-sm">c &gt; 1</h4>
                    <p className="text-xs text-red-900">Expansion — distances grow. Iterations diverge.</p>
                </div>
            </div>

            {/* ─── Banach Theorem ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                The Banach Fixed-Point Theorem
            </h3>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-5 my-6">
                <p className="font-semibold text-violet-800 mb-2">Theorem (Banach Fixed-Point Theorem)</p>
                <p className="text-sm text-violet-900 mb-3">
                    Let <Latex>{'$(X, d)$'}</Latex> be a <strong>complete</strong> metric space
                    and <Latex>{'$f : X \\to X$'}</Latex> a contraction with Lipschitz
                    constant <Latex>{'$c < 1$'}</Latex>. Then:
                </p>
                <div className="bg-white rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-3">
                        <span className="bg-violet-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <div className="text-sm text-violet-900">
                            <Latex>{'$f$'}</Latex> has a <strong>unique fixed point</strong> <Latex>{'$x^* \\in X$'}</Latex> such that <Latex>{'$f(x^*) = x^*$'}</Latex>.
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="bg-violet-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <div className="text-sm text-violet-900">
                            For any <Latex>{'$x_0 \\in X$'}</Latex>, the sequence <Latex>{'$x_{n+1} = f(x_n)$'}</Latex> converges
                            to <Latex>{'$x^*$'}</Latex>.
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── ML Applications ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Applications in Machine Learning
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
                    <h4 className="font-bold text-indigo-800 mb-2 text-sm">Optimization Convergence</h4>
                    <p className="text-xs text-indigo-900">
                        If the parameter update rule in gradient descent is a contraction, the Banach
                        theorem guarantees convergence to a unique optimal parameter set.
                    </p>
                </div>
                <div className="bg-violet-50 border-l-4 border-violet-400 p-4">
                    <h4 className="font-bold text-violet-800 mb-2 text-sm">Attention Weight Refinement</h4>
                    <p className="text-xs text-violet-900">
                        Iterative refinement of attention weights modeled as contractions ensures
                        convergence to stable weights — improving robustness and performance.
                    </p>
                </div>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-400 p-4 my-6">
                <p className="font-semibold text-pink-800 mb-2">RNN Stability</p>
                <p className="text-sm text-pink-900">
                    In recurrent neural networks, ensuring that each step&apos;s transformation is a contraction
                    prevents gradient explosion or vanishing, maintaining stability of the learning process.
                    The Banach fixed-point theorem provides the mathematical guarantee.
                </p>
            </div>
        </div>
    );
}

export default function MetricSpacesContent() {
    return (
        <div className="space-y-12">
            <MetricSpaceDefinition />
            <MetricSpaceExamples />
            <ConvergenceCompleteness />
            <TopologyOfMetricSpaces />
            <MappingsBetweenMetricSpaces />
        </div>
    );
}
