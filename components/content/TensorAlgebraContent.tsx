"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Section 1: Introduction to Tensors ───────────────────────────────────────
export function IntroductionToTensors() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-violet-700 border-b-2 border-violet-200 pb-2 mb-4">
                Introduction to Tensors
            </h2>

            <p>
                Tensor algebra is a powerful mathematical framework that extends linear algebra
                to higher dimensions, enabling the manipulation of multi-dimensional arrays called
                <strong> tensors</strong>. Tensors generalize vectors and matrices and are central to
                mathematics, physics, and machine learning. In transformers, tensors represent and
                process high-dimensional data such as word embeddings and attention scores.
            </p>

            <p>
                A tensor of order <Latex>{'$k$'}</Latex> (a <Latex>{'$k$'}</Latex>-tensor) over a
                vector space <Latex>{'$V$'}</Latex> is an element of the tensor product
                of <Latex>{'$k$'}</Latex> copies of <Latex>{'$V$'}</Latex>. Let <Latex>{'$V$'}</Latex> be
                a finite-dimensional vector space over a field <Latex>{'$F$'}</Latex> with
                basis <Latex>{'$\\{e_1, e_2, \\ldots, e_n\\}$'}</Latex>. A tensor of
                order <Latex>{'$k$'}</Latex> on <Latex>{'$V$'}</Latex> is an element of:
            </p>

            <div className="bg-violet-50 p-4 rounded-lg my-4 border border-violet-200 text-center">
                <Latex>{'$V^{\\otimes k} = \\underbrace{V \\otimes V \\otimes \\cdots \\otimes V}_{k \\text{ factors}}$'}</Latex>
            </div>

            <p>
                If <Latex>{'$T$'}</Latex> is a tensor of order <Latex>{'$k$'}</Latex>, it can be expressed as:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$T = \\sum_{i_1, i_2, \\ldots, i_k} T_{i_1 i_2 \\cdots i_k}\\, e_{i_1} \\otimes e_{i_2} \\otimes \\cdots \\otimes e_{i_k}$'}</Latex>
            </div>

            <p>
                where <Latex>{'$T_{i_1 i_2 \\cdots i_k}$'}</Latex> are the <strong>components</strong> of the
                tensor with respect to the chosen basis, and <Latex>{'$\\otimes$'}</Latex> denotes the
                tensor product. The components form a <Latex>{'$k$'}</Latex>-dimensional array (hypermatrix),
                where each index <Latex>{'$i_j$'}</Latex> ranges from 1 to <Latex>{'$n$'}</Latex>.
            </p>

            {/* Tensor Orders */}
            <h3 className="text-xl font-bold text-violet-700 border-b border-violet-200 pb-1 mt-8 mb-4">
                Tensor Orders
            </h3>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-violet-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">0</span>
                    <h4 className="font-bold text-slate-800 m-0">Scalars (Order 0)</h4>
                </div>
                <p className="text-sm text-slate-700">
                    A scalar is a single numerical value — a tensor with no indices.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-violet-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Vectors (Order 1)</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    A one-dimensional array of numbers:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$v = \\sum_i v_i\\, e_i$'}</Latex>
                </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-violet-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Matrices (Order 2)</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    A two-dimensional array of numbers:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$M = \\sum_{i,j} M_{ij}\\, e_i \\otimes e_j$'}</Latex>
                </div>
            </div>

            <p>
                Higher-order tensors can be visualized as multi-dimensional arrays, but
                their manipulation requires careful attention to the indices and the rules
                of tensor algebra.
            </p>
        </div>
    );
}

// ── Section 2: Tensor Products and Contractions ──────────────────────────────
export function TensorProductsAndContractions() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-violet-700 border-b-2 border-violet-200 pb-2 mb-4">
                Tensor Products and Contractions
            </h2>

            <h3 className="text-xl font-bold text-violet-700 border-b border-violet-200 pb-1 mt-4 mb-4">
                Tensor Products
            </h3>

            <p>
                The tensor product constructs higher-order tensors from lower-order ones.
                Given <Latex>{'$A \\in V^{\\otimes k}$'}</Latex> and <Latex>{'$B \\in W^{\\otimes l}$'}</Latex>,
                their tensor product <Latex>{'$A \\otimes B$'}</Latex> is a tensor of
                order <Latex>{'$k + l$'}</Latex> with components:
            </p>

            <div className="bg-violet-50 p-4 rounded-lg my-4 border border-violet-200 text-center">
                <Latex>{'$(A \\otimes B)_{i_1 i_2 \\cdots i_k j_1 j_2 \\cdots j_l} = A_{i_1 i_2 \\cdots i_k}\\, B_{j_1 j_2 \\cdots j_l}$'}</Latex>
            </div>

            <p>
                The tensor product is <strong>bilinear</strong>:
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="space-y-2 text-center">
                    <div><Latex>{'$(A + B) \\otimes C = A \\otimes C + B \\otimes C$'}</Latex></div>
                    <div><Latex>{'$A \\otimes (B + C) = A \\otimes B + A \\otimes C$'}</Latex></div>
                    <div><Latex>{'$\\alpha(A \\otimes B) = (\\alpha A) \\otimes B = A \\otimes (\\alpha B)$'}</Latex></div>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                    for any scalar <Latex>{'$\\alpha \\in F$'}</Latex>
                </p>
            </div>

            <h3 className="text-xl font-bold text-violet-700 border-b border-violet-200 pb-1 mt-8 mb-4">
                Tensor Contraction
            </h3>

            <p>
                Contraction reduces the order of a tensor by summing over one or more pairs
                of indices — analogous to matrix multiplication. Given a
                tensor <Latex>{'$T \\in V^{\\otimes k}$'}</Latex>, contraction over
                indices <Latex>{'$i_j$'}</Latex> and <Latex>{'$i_l$'}</Latex> yields a tensor
                of order <Latex>{'$k - 2$'}</Latex>:
            </p>

            <div className="bg-violet-50 p-4 rounded-lg my-4 border border-violet-200 text-center">
                <Latex>{'$S_{i_1 \\cdots \\hat{i}_j \\cdots \\hat{i}_l \\cdots i_k} = \\sum_{i_j} T_{i_1 i_2 \\cdots i_j \\cdots i_l \\cdots i_k}$'}</Latex>
            </div>

            <p>
                For two tensors <Latex>{'$A \\in V \\otimes W$'}</Latex> and <Latex>{'$B \\in W^* \\otimes U$'}</Latex>,
                the contraction over the common index space <Latex>{'$W$'}</Latex> gives <Latex>{'$C \\in V \\otimes U$'}</Latex>:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Contraction as Matrix Multiplication</p>
                <div className="text-center">
                    <Latex>{'$C_{iu} = \\sum_j A_{ij}\\, B_{ju}$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-3">
                    This operation is exactly matrix multiplication — the product of matrices corresponds
                    to the contraction of their associated tensors.
                </p>
            </div>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-5 my-6">
                <p className="font-semibold text-violet-800 mb-2">Relevance to Transformers</p>
                <p className="text-sm text-violet-800">
                    In self-attention mechanisms, tensor products and contractions compute the attention
                    scores, where the query, key, and value tensors interact through tensor operations.
                    These operations allow the model to dynamically adjust focus on different parts of
                    the input sequence, capturing complex dependencies and patterns.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Role of Matrix Multiplication ─────────────────────────────────
export function RoleOfMatrixMultiplication() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-cyan-700 border-b-2 border-cyan-200 pb-2 mb-4">
                Algebraic Structures in Transformers
            </h2>

            <p>
                The algebraic structures underlying transformers are crucial for understanding how
                these models manipulate data. Among these structures, <strong>matrix multiplication</strong>,
                <strong> Kronecker products</strong>, and <strong>tensor factorization</strong> play key roles,
                particularly in attention scores and efficient representation of high-dimensional data.
            </p>

            <h3 className="text-xl font-bold text-cyan-700 border-b border-cyan-200 pb-1 mt-8 mb-4">
                The Role of Matrix Multiplication
            </h3>

            <p>
                Consider the basic operation in a transformer layer where an input
                matrix <Latex>{'$X \\in \\mathbb{R}^{n \\times d}$'}</Latex>, representing a sequence
                of <Latex>{'$n$'}</Latex> input vectors of dimension <Latex>{'$d$'}</Latex>, is transformed by
                a weight matrix <Latex>{'$W \\in \\mathbb{R}^{d \\times d}$'}</Latex>:
            </p>

            <div className="bg-cyan-50 p-4 rounded-lg my-4 border border-cyan-200 text-center">
                <Latex>{'$Y = XW$'}</Latex>
            </div>

            <p>
                Here, <Latex>{'$Y$'}</Latex> applies the linear transformation defined
                by <Latex>{'$W$'}</Latex> to each vector in the sequence, projecting input vectors into
                different spaces where specific patterns may be more easily captured.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-cyan-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Attention Score Computation</h4>
                </div>
                <p className="text-sm text-slate-700 mb-3">
                    In self-attention, matrix multiplication computes the dot-product attention scores:
                </p>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$\\text{Attention}(Q, K, V) = \\text{Softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    <Latex>{'$QK^\\top$'}</Latex> produces an <Latex>{'$n \\times n$'}</Latex> matrix where each entry
                    is the similarity between a query and a key vector.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-cyan-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Information Blending</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Matrix multiplication facilitates the blending of information across the input sequence.
                    By multiplying matrices, the model combines contributions from various elements,
                    effectively <em>attending</em> to multiple parts simultaneously — essential for
                    understanding long-range dependencies in translation and summarization tasks.
                </p>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-5 my-6">
                <p className="font-semibold text-cyan-800 mb-2">Key Insight</p>
                <p className="text-sm text-cyan-800">
                    Matrix multiplication in transformers is often combined with bias addition and
                    non-linear activation functions (ReLU, GELU) to create more complex and
                    expressive transformations — key to the model&apos;s capacity to learn intricate patterns.
                </p>
            </div>
        </div>
    );
}

// ── Section 4: Kronecker Products and Factorization ──────────────────────────
export function KroneckerProductsAndFactorization() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-cyan-700 border-b-2 border-cyan-200 pb-2 mb-4">
                Kronecker Products and Factorization
            </h2>

            <p>
                The Kronecker product extends matrix multiplication to higher-dimensional
                structures. Given <Latex>{'$A \\in \\mathbb{R}^{m \\times n}$'}</Latex> and <Latex>{'$B \\in \\mathbb{R}^{p \\times q}$'}</Latex>,
                their Kronecker product <Latex>{'$A \\otimes B$'}</Latex> is a block matrix
                of dimensions <Latex>{'$mp \\times nq$'}</Latex>:
            </p>

            <div className="bg-cyan-50 p-4 rounded-lg my-4 border border-cyan-200 text-center">
                <Latex>{'$A \\otimes B = \\begin{pmatrix} a_{11}B & a_{12}B & \\cdots & a_{1n}B \\\\ a_{21}B & a_{22}B & \\cdots & a_{2n}B \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ a_{m1}B & a_{m2}B & \\cdots & a_{mn}B \\end{pmatrix}$'}</Latex>
            </div>

            <p>
                Each block is a scaled version of <Latex>{'$B$'}</Latex> by the corresponding entry
                in <Latex>{'$A$'}</Latex>. The Kronecker product inherits distributivity over addition and
                associativity, but also introduces the ability to model interactions between different
                dimensions.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-cyan-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Efficient Interaction Encoding</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Instead of explicitly constructing a large matrix to capture all pairwise interactions
                    between two feature sets <Latex>{'$A$'}</Latex> and <Latex>{'$B$'}</Latex>,
                    the Kronecker product <Latex>{'$A \\otimes B$'}</Latex> provides a compact and structured encoding.
                </p>
            </div>

            <h3 className="text-xl font-bold text-cyan-700 border-b border-cyan-200 pb-1 mt-8 mb-4">
                Kronecker Factorization
            </h3>

            <p>
                Factorization techniques decompose a large matrix <Latex>{'$M$'}</Latex> into
                smaller matrices, reducing parameters and computational cost:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Kronecker Decomposition</p>
                <div className="text-center">
                    <Latex>{'$M \\approx A \\otimes B$'}</Latex>
                </div>
                <p className="text-xs text-amber-800 mt-3">
                    This allows the model to approximate large matrix operations using smaller, more
                    efficient operations — applicable to weight matrices, attention scores, and other components.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-cyan-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Multi-Head Attention Factorization</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Attention weights across heads can be factorized to share information while
                    allowing individual specialization. This leads to a more efficient parameter
                    representation and can help prevent overfitting by reducing model capacity
                    without sacrificing expressivity.
                </p>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-400 p-5 my-6">
                <p className="font-semibold text-cyan-800 mb-2">Scalability</p>
                <p className="text-sm text-cyan-800">
                    Kronecker product-based factorization enables transformers to scale to larger models
                    and longer sequences by reducing the memory footprint and computational cost
                    of key matrix operations while preserving the model&apos;s ability to capture
                    complex dependencies.
                </p>
            </div>
        </div>
    );
}

// ── Section 5: Self-Attention Mechanism ──────────────────────────────────────
export function SelfAttentionMechanism() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-amber-700 border-b-2 border-amber-200 pb-2 mb-4">
                Self-Attention Mechanisms
            </h2>

            <p>
                The central theme is computing a <strong>weighted combination</strong> of input features,
                where the weights reflect the relevance of each feature to the others.
                Let <Latex>{'$X = \\{x_1, x_2, \\ldots, x_n\\}$'}</Latex> be a sequence of input vectors,
                where each <Latex>{'$x_i \\in \\mathbb{R}^d$'}</Latex>. The self-attention mechanism
                transforms this into output <Latex>{'$Z = \\{z_1, z_2, \\ldots, z_n\\}$'}</Latex>.
            </p>

            <h3 className="text-xl font-bold text-amber-700 border-b border-amber-200 pb-1 mt-8 mb-4">
                Query, Key, and Value Matrices
            </h3>

            <p>
                Three matrices are derived from the input <Latex>{'$X$'}</Latex> using learned weight matrices:
            </p>

            <div className="bg-amber-50 p-4 rounded-lg my-4 border border-amber-200 text-center">
                <Latex>{'$Q = XW^Q, \\quad K = XW^K, \\quad V = XW^V$'}</Latex>
            </div>

            <p>
                where <Latex>{'$W^Q, W^K, W^V \\in \\mathbb{R}^{d \\times d_k}$'}</Latex> are learned
                weight matrices and <Latex>{'$d_k$'}</Latex> is the dimensionality of the key vectors.
            </p>

            <h3 className="text-xl font-bold text-amber-700 border-b border-amber-200 pb-1 mt-8 mb-4">
                Attention Weights
            </h3>

            <p>
                Each output vector <Latex>{'$z_i$'}</Latex> is a weighted sum of value vectors:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$z_i = \\sum_{j=1}^{n} \\alpha_{ij}\\, v_j$'}</Latex>
            </div>

            <p>
                where the attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> are defined by the softmax of similarity scores:
            </p>

            <div className="bg-amber-50 p-5 rounded-lg my-6 border border-amber-200">
                <div className="space-y-3 text-center">
                    <div><Latex>{'$\\alpha_{ij} = \\frac{\\exp(S_{ij})}{\\sum_{k=1}^{n} \\exp(S_{ik})}$'}</Latex></div>
                    <div><Latex>{'$S_{ij} = \\frac{\\langle q_i, k_j \\rangle}{\\sqrt{d_k}}$'}</Latex></div>
                </div>
                <p className="text-xs text-amber-700 mt-3 text-center">
                    The scaling factor <Latex>{'$\\frac{1}{\\sqrt{d_k}}$'}</Latex> mitigates the effect of
                    large dot products in high-dimensional spaces.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-amber-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Compact Matrix Form</h4>
                </div>
                <div className="text-center bg-white p-3 rounded border border-slate-100">
                    <Latex>{'$Z = \\text{Softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    This formulation highlights three core operations: pairwise similarities (dot products),
                    normalization (softmax), and weighted aggregation of values.
                </p>
            </div>
        </div>
    );
}

// ── Section 6: Multi-Head Self-Attention ─────────────────────────────────────
export function MultiHeadSelfAttention() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-amber-700 border-b-2 border-amber-200 pb-2 mb-4">
                Multi-Head Self-Attention
            </h2>

            <p>
                Multi-head self-attention extends the basic mechanism by allowing the model
                to focus on <strong>different aspects</strong> of the input simultaneously.
                With <Latex>{'$h$'}</Latex> attention heads operating in parallel, each with its own
                learned weights, the model captures various types of dependencies.
            </p>

            <h3 className="text-xl font-bold text-amber-700 border-b border-amber-200 pb-1 mt-8 mb-4">
                Per-Head Computation
            </h3>

            <p>
                For each head <Latex>{'$i$'}</Latex>:
            </p>

            <div className="bg-amber-50 p-4 rounded-lg my-4 border border-amber-200 text-center">
                <Latex>{'$Q_i = XW_i^Q, \\quad K_i = XW_i^K, \\quad V_i = XW_i^V$'}</Latex>
            </div>

            <p>
                where <Latex>{'$W_i^Q, W_i^K, W_i^V \\in \\mathbb{R}^{d \\times d_k}$'}</Latex> are
                per-head weight matrices. Each head computes:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$Z_i = \\text{Softmax}\\!\\left(\\frac{Q_i K_i^\\top}{\\sqrt{d_k}}\\right)V_i$'}</Latex>
            </div>

            <h3 className="text-xl font-bold text-amber-700 border-b border-amber-200 pb-1 mt-8 mb-4">
                Concatenation and Projection
            </h3>

            <p>
                The outputs are concatenated and projected back to dimension <Latex>{'$d$'}</Latex>:
            </p>

            <div className="bg-amber-50 p-4 rounded-lg my-4 border border-amber-200 text-center">
                <Latex>{'$Z = \\text{Concat}(Z_1, Z_2, \\ldots, Z_h)\\, W^O$'}</Latex>
            </div>

            <p>
                where <Latex>{'$W^O \\in \\mathbb{R}^{hd_k \\times d}$'}</Latex> projects the concatenated
                output back to the original dimensionality.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-amber-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Short-Range Dependencies</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Some heads specialize in attending to adjacent tokens, capturing local syntactic patterns.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-amber-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Long-Range Dependencies</h4>
                </div>
                <p className="text-sm text-slate-700">
                    Other heads attend to distant tokens, capturing semantic relationships and co-reference across the sequence.
                </p>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Expressivity</p>
                <p className="text-sm text-amber-800">
                    The parallel processing of multiple attention heads enhances the model&apos;s
                    expressivity and allows it to capture the full complexity of input data —
                    each head acts as an independent feature detector operating over the
                    entire sequence simultaneously.
                </p>
            </div>
        </div>
    );
}
