"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Section 1: Attention as a Mapping ─────────────────────────────────────────
export function AttentionAsMapping() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Attention as a Mapping
            </h2>

            <p>
                Attention mechanisms are at the heart of modern transformer architectures, providing
                a powerful method for dynamically focusing on relevant parts of the input data.
                Mathematically, attention can be understood as a <strong>mapping</strong> that transforms input
                features into output features by assigning different weights to different parts of the
                input. This mapping is central to the model&apos;s ability to capture dependencies and
                relationships across different elements in the input sequence.
            </p>

            {/* ─── Formulation ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Formulation of Attention as a Function
            </h3>

            <p>
                Let <Latex>{'$X = \\{x_1, x_2, \\ldots, x_n\\}$'}</Latex> be a set of input vectors,
                where each <Latex>{'$x_i \\in \\mathbb{R}^d$'}</Latex> represents a feature vector in
                a <Latex>{'$d$'}</Latex>-dimensional space. The goal of the attention mechanism is to produce
                a weighted combination of these input vectors, emphasizing those that are most relevant
                to a particular context or query.
            </p>

            <p>
                This process can be mathematically formulated as a function{' '}
                <Latex>{'$A : \\mathbb{R}^{n \\times d} \\times \\mathbb{R}^{n \\times d} \\times \\mathbb{R}^{n \\times d} \\to \\mathbb{R}^{n \\times d}$'}</Latex>,
                where the first argument <Latex>{'$Q$'}</Latex> represents the <strong>query matrix</strong> (composed
                of <Latex>{'$n$'}</Latex> query vectors), the second argument <Latex>{'$K$'}</Latex> represents
                the <strong>key matrix</strong>, and the third argument <Latex>{'$V$'}</Latex> represents
                the <strong>value matrix</strong>.
            </p>

            <p>
                The attention function <Latex>{'$A(Q, K, V)$'}</Latex> is defined by first computing
                the <strong>attention scores</strong> as a similarity measure between the query and key vectors.
                A common choice is the <strong>scaled dot product</strong>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$S_{ij} = \\frac{\\langle q_i, k_j \\rangle}{\\sqrt{d_k}}$'}</Latex>
            </div>

            <p>
                where <Latex>{'$q_i$'}</Latex> and <Latex>{'$k_j$'}</Latex> are the <Latex>{'$i$'}</Latex>th
                query vector and <Latex>{'$j$'}</Latex>th key vector respectively, <Latex>{'$d_k$'}</Latex> is
                the dimensionality of the key vectors, and <Latex>{'$\\langle q_i, k_j \\rangle$'}</Latex> denotes
                the dot product. The scaling factor <Latex>{'$\\frac{1}{\\sqrt{d_k}}$'}</Latex> is introduced
                to mitigate the effect of increasing dimensionality, ensuring that the magnitude of the
                dot products remains stable as <Latex>{'$d_k$'}</Latex> grows.
            </p>

            <p>
                The attention scores <Latex>{'$S_{ij}$'}</Latex> are then normalized using
                the <strong>softmax function</strong> to produce the attention weights:
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg my-4 border border-indigo-200 text-center">
                <Latex>{'$\\alpha_{ij} = \\frac{\\exp(S_{ij})}{\\sum_{k=1}^{n} \\exp(S_{ik})}$'}</Latex>
            </div>

            <p>
                These attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> indicate the relative importance of
                the <Latex>{'$j$'}</Latex>th input vector to the <Latex>{'$i$'}</Latex>th query vector. The
                final output of the attention mechanism is computed as a <strong>weighted sum</strong> of the
                value vectors:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$z_i = \\sum_{j=1}^{n} \\alpha_{ij} v_j$'}</Latex>
            </div>

            <p>
                The complete attention mapping can be expressed compactly as:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Scaled Dot-Product Attention</p>
                <div className="text-center">
                    <Latex>{'$A(Q, K, V) = \\text{Softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-3">
                    This formulation highlights the role of attention as a mapping that transforms the
                    input sequence <Latex>{'$X$'}</Latex> into a new sequence <Latex>{'$Z = \\{z_1, z_2, \\ldots, z_n\\}$'}</Latex> by
                    focusing on the most relevant components of the input based on the learned similarity structure.
                </p>
            </div>
        </div>
    );
}

// ── Section 2: Properties of Attention Mappings ──────────────────────────────
export function AttentionProperties() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Properties of Attention Mappings
            </h2>

            <p>
                The attention mapping{' '}
                <Latex>{'$A : \\mathbb{R}^{n \\times d} \\times \\mathbb{R}^{n \\times d} \\times \\mathbb{R}^{n \\times d} \\to \\mathbb{R}^{n \\times d}$'}</Latex>{' '}
                possesses several key properties that are essential for understanding its behavior
                and effectiveness in capturing relationships within the data. These properties can be
                analyzed in terms of geometry, symmetry, and stability.
            </p>

            {/* Property 1 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Linearity in Value Vectors</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The attention mechanism is linear with respect to the value vectors <Latex>{'$V$'}</Latex>.
                    Given a linear combination of value matrices <Latex>{'$V_1$'}</Latex> and <Latex>{'$V_2$'}</Latex> with
                    corresponding scalars <Latex>{'$\\alpha$'}</Latex> and <Latex>{'$\\beta$'}</Latex>:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$A(Q, K, \\alpha V_1 + \\beta V_2) = \\alpha\\, A(Q, K, V_1) + \\beta\\, A(Q, K, V_2)$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This linearity allows the attention mechanism to combine different sets of value vectors
                    in a controlled manner, making it suitable for aggregating information from different sources.
                </p>
            </div>

            {/* Property 2 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Invariance Under Permutations</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The attention mechanism is invariant under simultaneous permutations of the input
                    sequence. For any permutation <Latex>{'$\\sigma$'}</Latex> of the
                    indices <Latex>{'$\\{1, 2, \\ldots, n\\}$'}</Latex>:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$A(Q_\\sigma, K_\\sigma, V_\\sigma) = A(Q, K, V)_\\sigma$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This reflects that attention does not impose any fixed order on the input sequence,
                    allowing it to capture dependencies regardless of position.
                </p>
            </div>

            {/* Property 3 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Commutativity of Attention Heads</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    In multi-head self-attention, the order in which attention heads are applied does
                    not affect the final output:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$(Z_{\\sigma(1)}, Z_{\\sigma(2)}, \\ldots, Z_{\\sigma(h)})W^O = (Z_1, Z_2, \\ldots, Z_h)W^O$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This allows the model to process different attention heads in parallel,
                    contributing to the efficiency and scalability of transformers.
                </p>
            </div>

            {/* Property 4 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <h4 className="font-bold text-slate-800 m-0">Boundedness and Stability</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The attention mapping is bounded and stable under small perturbations.
                    Let <Latex>{'$\\delta Q$'}</Latex>, <Latex>{'$\\delta K$'}</Latex>,
                    and <Latex>{'$\\delta V$'}</Latex> be small perturbations:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$\\|A(Q+\\delta Q, K+\\delta K, V+\\delta V) - A(Q,K,V)\\| \\leq C(\\|\\delta Q\\| + \\|\\delta K\\| + \\|\\delta V\\|)$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This ensures the attention mechanism is robust to noise and variations in the data.
                </p>
            </div>

            {/* Property 5 */}
            <div className="bg-emerald-50 p-5 rounded-lg my-6 border border-emerald-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <h4 className="font-bold text-slate-800 m-0">Non-negativity and Probability Interpretation</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> are non-negative and sum to 1
                    for each query vector:
                </p>
                <div className="text-center bg-white p-3 rounded border border-emerald-100">
                    <Latex>{'$\\alpha_{ij} \\geq 0 \\quad \\text{and} \\quad \\sum_{j=1}^{n} \\alpha_{ij} = 1$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This gives the attention mechanism a <strong>probabilistic interpretation</strong>, where the
                    weights <Latex>{'$\\alpha_{ij}$'}</Latex> represent the probability of selecting
                    the <Latex>{'$j$'}</Latex>th value vector for constructing the output.
                    This probabilistic nature is crucial for tasks requiring soft selection of relevant
                    information, such as language modeling and translation.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Curse of Dimensionality ───────────────────────────────────────
export function CurseOfDimensionality() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                The Geometry of High-Dimensional Spaces
            </h2>

            <p>
                As attention mechanisms and transformers often operate in high-dimensional spaces,
                understanding the geometric properties of these spaces is crucial for analyzing how
                these models function and why they are effective. The study of high-dimensional
                spaces introduces unique challenges and opportunities, particularly concerning the
                phenomena known as the <strong>curse of dimensionality</strong> and the <strong>concentration of measure</strong>.
            </p>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                Curse of Dimensionality
            </h3>

            <p>
                The curse of dimensionality refers to various phenomena that arise when working in
                high-dimensional spaces that make intuitive concepts from low-dimensional spaces fail
                to generalize. Consider the unit hypercube in <Latex>{'$\\mathbb{R}^d$'}</Latex>, defined as:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$C = \\{x \\in \\mathbb{R}^d \\mid 0 \\leq x_i \\leq 1,\\; i = 1, 2, \\ldots, d\\}$'}</Latex>
            </div>

            <p>
                The volume of this hypercube is always <Latex>{'$1^d = 1$'}</Latex>. However, consider a
                hypersphere inscribed within it with radius <Latex>{'$r = \\frac{1}{2}$'}</Latex>.
                The volume of this hypersphere is:
            </p>

            <div className="bg-rose-50 p-4 rounded-lg my-4 border border-rose-200 text-center">
                <Latex>{'$V_d(S) = \\frac{\\pi^{d/2}}{\\Gamma\\!\\left(\\frac{d}{2} + 1\\right)} \\left(\\frac{1}{2}\\right)^{\\!d}$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\Gamma$'}</Latex> is the Gamma function. As <Latex>{'$d$'}</Latex> increases,
                the volume of the hypersphere decreases <strong>exponentially</strong> compared to
                the hypercube. This implies that in high-dimensional spaces, most of the volume of the
                hypercube is concentrated near its <em>corners</em>, not uniformly distributed throughout.
            </p>

            {/* Implications */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Sparse Data</h4>
                </div>
                <p className="text-sm text-slate-700">
                    In high-dimensional spaces, data points tend to be sparsely distributed, making it
                    difficult to find close neighbors or meaningful clusters. Algorithms like k-nearest
                    neighbors or clustering may perform poorly without appropriate dimensionality reduction.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Distance Concentration</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The relative distances between points become less informative. The ratio of the
                    distance between random points to the mean distance approaches 1:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$\\lim_{d \\to \\infty} \\frac{\\|x_1 - x_2\\|}{E[\\|x_1 - x_2\\|]} = 1$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This makes it challenging to distinguish between points based on distance alone,
                    requiring alternative measures or embeddings.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Dimensionality Reduction</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Techniques like <strong>Principal Component Analysis (PCA)</strong> and <strong>t-Distributed
                        Stochastic Neighbor Embedding (t-SNE)</strong> project high-dimensional data onto
                    lower-dimensional subspaces where the data&apos;s essential structure is preserved.
                </p>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-400 p-5 my-6">
                <p className="font-semibold text-rose-800 mb-2">Relevance to Transformers</p>
                <p className="text-sm text-rose-800">
                    The self-attention mechanism inherently mitigates some challenges of the curse of
                    dimensionality by focusing on specific subsets of the input data, thereby reducing
                    the effective dimensionality that the model needs to process.
                </p>
            </div>
        </div>
    );
}

// ── Section 4: Concentration of Measure ──────────────────────────────────────
export function ConcentrationOfMeasure() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                Concentration of Measure
            </h2>

            <p>
                The concentration of measure phenomenon is another critical aspect of high-dimensional
                geometry. It refers to the fact that in high-dimensional spaces, most of the mass of a
                probability distribution tends to concentrate in a small region near the mean or median.
                This effect is closely related to isoperimetric inequalities, which describe how the
                &ldquo;surface area&rdquo; of a set relates to its &ldquo;volume&rdquo; in high dimensions.
            </p>

            <p>
                Consider a high-dimensional sphere <Latex>{'$S^{d-1}$'}</Latex> in <Latex>{'$\\mathbb{R}^d$'}</Latex> with
                radius <Latex>{'$r$'}</Latex>. As the dimension <Latex>{'$d$'}</Latex> increases, the volume of the
                sphere&apos;s equatorial region becomes overwhelmingly large compared to the volume near
                the poles. For a Lipschitz function <Latex>{'$f : S^{d-1} \\to \\mathbb{R}$'}</Latex>, the
                concentration of measure theorem states that for any <Latex>{'$\\epsilon > 0$'}</Latex>:
            </p>

            <div className="bg-rose-50 p-4 rounded-lg my-4 border border-rose-200 text-center">
                <Latex>{'$P\\!\\left(|f(x) - E[f]| \\geq \\epsilon\\right) \\leq 2\\exp\\!\\left(-C\\epsilon^2 d\\right)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$C$'}</Latex> is a constant depending on the Lipschitz constant
                of <Latex>{'$f$'}</Latex>. As dimensionality <Latex>{'$d$'}</Latex> increases, the probability that a
                function deviates significantly from its expected value decreases <strong>exponentially</strong>.
            </p>

            {/* Implications */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Robustness of Features</h4>
                </div>
                <p className="text-sm text-slate-700">
                    In high-dimensional spaces, most points are close to the &ldquo;average&rdquo; behavior of a
                    function, meaning deviations are rare. Models trained on high-dimensional data
                    may exhibit robust performance even under slight perturbations of the input.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Random Projections &amp; Johnson–Lindenstrauss Lemma</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    The concentration of measure justifies random projections for dimensionality reduction.
                    The <strong>Johnson–Lindenstrauss lemma</strong> states that for any set
                    of <Latex>{'$n$'}</Latex> points in <Latex>{'$\\mathbb{R}^d$'}</Latex> and
                    any <Latex>{'$0 < \\epsilon < 1$'}</Latex>, there exists a linear
                    map <Latex>{'$f: \\mathbb{R}^d \\to \\mathbb{R}^k$'}</Latex> with <Latex>{'$k = O\\!\\left(\\frac{\\log n}{\\epsilon^2}\\right)$'}</Latex> such that:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$(1-\\epsilon)\\|x_i - x_j\\|^2 \\leq \\|f(x_i) - f(x_j)\\|^2 \\leq (1+\\epsilon)\\|x_i - x_j\\|^2$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This result is crucial for reducing dimensionality while preserving the essential
                    geometric properties of the data.
                </p>
            </div>

            <div className="bg-emerald-50 p-5 rounded-lg my-6 border border-emerald-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Implications for Model Design</h4>
                </div>
                <p className="text-sm text-slate-700">
                    In transformer design, concentration of measure suggests that high-dimensional
                    feature spaces can be effectively managed by focusing on the most significant
                    components of the data. Attention mechanisms naturally leverage this principle by
                    assigning higher weights to the most relevant parts of the input, thereby concentrating
                    the &ldquo;measure&rdquo; of attention on critical features.
                </p>
            </div>
        </div>
    );
}

// ── Section 5: Implications for Model Expressivity ───────────────────────────
export function ModelExpressivity() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                Applications in Transformer Architectures
            </h2>

            <p>
                The mathematical properties of attention mechanisms, viewed through the lens of
                geometry, symmetry, and metric spaces, offer profound insights into the expressivity
                and robustness of transformer models. By understanding attention as a mapping within
                a high-dimensional space, we can explore its implications for <strong>model expressivity</strong> and
                its role as a <strong>metric-preserving map</strong>.
            </p>

            <h3 className="text-xl font-bold text-emerald-700 border-b border-emerald-200 pb-1 mt-8 mb-4">
                Implications for Model Expressivity
            </h3>

            <p>
                Expressivity refers to the model&apos;s ability to capture and represent a wide range
                of functions within the input data. The self-attention mechanism can be viewed as an
                operator <Latex>{'$A : \\mathcal{H} \\to \\mathcal{H}$'}</Latex> on a Hilbert
                space <Latex>{'$\\mathcal{H}$'}</Latex> of functions defined on the input
                space <Latex>{'$X$'}</Latex>. For any function <Latex>{'$f \\in \\mathcal{H}$'}</Latex>, the
                operator produces a new function <Latex>{'$g = A(f)$'}</Latex>:
            </p>

            <div className="bg-emerald-50 p-4 rounded-lg my-4 border border-emerald-200 text-center">
                <Latex>{'$g(x_i) = \\sum_{j=1}^{n} \\alpha_{ij}\\, f(x_j)$'}</Latex>
            </div>

            <p>
                where the attention weights are computed as:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\alpha_{ij} = \\frac{\\exp\\!\\left(\\langle q_i, k_j \\rangle / \\sqrt{d_k}\\right)}{\\sum_{k=1}^{n} \\exp\\!\\left(\\langle q_i, k_k \\rangle / \\sqrt{d_k}\\right)}$'}</Latex>
            </div>

            {/* Factor 1 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Diversity of Attention Heads</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    In multi-head attention, multiple operators <Latex>{'$A_1, A_2, \\ldots, A_h$'}</Latex> are
                    applied in parallel with different parameterizations. The combined output is:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$g(x_i) = \\left(A_1(f)(x_i),\\, A_2(f)(x_i),\\, \\ldots,\\, A_h(f)(x_i)\\right) W^O$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    where <Latex>{'$W^O$'}</Latex> is a learned weight matrix. Multiple heads effectively
                    increase the dimensionality of the function space <Latex>{'$\\mathcal{H}$'}</Latex> the model can represent.
                </p>
            </div>

            {/* Factor 2 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Non-linearity and Depth</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Non-linear activation functions (ReLU) and stacking multiple self-attention layers further
                    enhances expressivity. According to the <strong>universal approximation theorem</strong>,
                    this combination can approximate any continuous function on a compact domain to
                    arbitrary accuracy, provided the network is sufficiently deep and wide.
                </p>
            </div>

            {/* Factor 3 */}
            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Attention Weight Diversity</h4>
                </div>
                <p className="text-sm text-slate-700">
                    The diversity of attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> across different
                    queries allows the model to focus on different parts of the input sequence for different
                    contexts. This adaptability is crucial for capturing long-range dependencies essential
                    for translation, summarization, and question answering.
                </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-5 my-6">
                <p className="font-semibold text-emerald-800 mb-2">Key Insight</p>
                <p className="text-sm text-emerald-800">
                    Transformers, through their attention mechanisms, possess a high degree of expressivity
                    that allows them to model complex relationships within data that would be challenging
                    for models lacking such flexible and adaptive attention mechanisms.
                </p>
            </div>
        </div>
    );
}

// ── Section 6: Attention as a Metric-Preserving Map ──────────────────────────
export function AttentionMetricPreserving() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-emerald-700 border-b-2 border-emerald-200 pb-2 mb-4">
                Attention as a Metric-Preserving Map
            </h2>

            <p>
                In a metric space <Latex>{'$(X, d)$'}</Latex>, a
                map <Latex>{'$\\varphi : X \\to Y$'}</Latex> is said to <strong>preserve the metric</strong> if
                it approximately maintains distances between points:
            </p>

            <div className="bg-emerald-50 p-4 rounded-lg my-4 border border-emerald-200 text-center">
                <Latex>{'$d_Y\\!\\left(\\varphi(x_1),\\, \\varphi(x_2)\\right) \\approx d_X(x_1, x_2)$'}</Latex>
            </div>

            <p>
                In the context of transformers, we analyze the attention mechanism as a mapping from
                the space of input embeddings <Latex>{'$\\mathbb{R}^{n \\times d}$'}</Latex> to an output
                space <Latex>{'$\\mathbb{R}^{n \\times d}$'}</Latex>. The output vectors after applying
                attention are:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$z_i = \\sum_{j=1}^{n} \\alpha_{ij}\\, v_j \\quad \\text{for } i = 1, 2$'}</Latex>
            </div>

            <p>
                The distance between output vectors can be analyzed using the Euclidean norm:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Output Distance</p>
                <div className="text-center">
                    <Latex>{'$\\|z_1 - z_2\\|_2 = \\left\\|\\sum_{j=1}^{n} (\\alpha_{1j} - \\alpha_{2j})\\, v_j \\right\\|_2$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-3">
                    If the attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> do not vary significantly
                    between <Latex>{'$x_1$'}</Latex> and <Latex>{'$x_2$'}</Latex>, then the output
                    distance <Latex>{'$\\|z_1 - z_2\\|_2$'}</Latex> will be close to the input
                    distance <Latex>{'$\\|x_1 - x_2\\|_2$'}</Latex>, implying approximate metric preservation.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Structural Integrity</h4>
                </div>
                <p className="text-sm text-slate-700">
                    When attention operates as a metric-preserving map, the transformed data retains
                    its structural integrity. This preservation is critical for language modeling, where
                    maintaining semantic relationships between words is essential.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Adaptive Metric Preservation</h4>
                </div>
                <p className="text-sm text-slate-700">
                    In cases where non-linearity is significant, exact metric preservation may not hold.
                    However, the mechanism captures meaningful relationships through <strong>selective
                        focus</strong> — dynamically adjusting the metric to emphasize the most informative features.
                    This can be understood as <em>adaptive metric preservation</em>, where the attention
                    mechanism concentrates on the dimensions that matter most for the task at hand.
                </p>
            </div>

            <div className="bg-emerald-50 border-l-4 border-emerald-400 p-5 my-6">
                <p className="font-semibold text-emerald-800 mb-2">Significance</p>
                <p className="text-sm text-emerald-800">
                    The metric-preserving property is particularly important in high-dimensional spaces,
                    where relationships between data points can be complex and sensitive to perturbations.
                    By approximately preserving distances, the attention mechanism ensures that the
                    geometric structure of the input is leveraged effectively by downstream layers.
                </p>
            </div>
        </div>
    );
}
