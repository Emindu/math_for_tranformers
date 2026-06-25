"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { BookOpen, Shapes, Code2, Dumbbell, ListChecks } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import ConceptStepper from '@/components/ui/ConceptStepper';
import Intuition from '@/components/ui/Intuition';
import CodeBlock from '@/components/ui/CodeBlock';
import Quiz, { QuizQuestion } from '@/components/ui/Quiz';
import CodingExercise from '@/components/ui/CodingExercise';

/* ───────────────────────── Icons ───────────────────────── */

const conceptIcon   = <BookOpen   size={15} />;
const visualizeIcon = <Shapes     size={15} />;
const codeIcon      = <Code2      size={15} />;
const exerciseIcon  = <Dumbbell   size={15} />;
const quizIcon      = <ListChecks size={15} />;

/* ───────────────────────── Layout helpers ───────────────────────── */

function Card({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-[var(--foreground)]">{title}</h2>
            {children}
        </section>
    );
}

function Reading({ children }: { children: React.ReactNode }) {
    return (
        <article className="prose prose-slate" style={{ maxWidth: 'none' }}>
            {children}
        </article>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.1 — Introduction to Tensors — Quiz & Exercise data
   ═══════════════════════════════════════════════════════════════════════════ */

const TENSORS_QUIZ: QuizQuestion[] = [
    {
        question: "A 3rd-order tensor with shape (4, 5, 6) has how many components?",
        options: ["15", "120", "60", "24"],
        answer: 1,
        explanation: "The number of components is the product of the dimensions: 4 × 5 × 6 = 120.",
    },
    {
        question: "Which operation reduces a tensor's order by summing over index pairs?",
        options: ["Tensor product", "Contraction", "Outer product", "Reshape"],
        answer: 1,
        explanation: "Tensor contraction reduces a tensor's order by summing over paired indices, generalising matrix multiplication and trace.",
    },
];

const TENSORS_EXERCISE = {
    starter: `import numpy as np

def batched_attention_scores(Q, K):
    """
    Compute scaled attention scores using np.einsum.
    Q: (batch, n, dk) — query tensor
    K: (batch, n, dk) — key tensor
    Returns scores of shape (batch, n, n)
    Hint: use np.einsum with 'bik,bjk->bij' and scale by sqrt(dk)
    """
    # TODO: implement using np.einsum
    pass
`,
    checks: `import numpy as np
np.random.seed(42)
Q = np.random.randn(2, 4, 8)
K = np.random.randn(2, 4, 8)
result = batched_attention_scores(Q, K)
_check("returns correct shape", lambda: result is not None and result.shape == (2, 4, 4))
_check("matches einsum", lambda: np.allclose(result, np.einsum('bik,bjk->bij', Q, K) / np.sqrt(8), atol=1e-6))
`,
    solution: `import numpy as np

def batched_attention_scores(Q, K):
    dk = Q.shape[-1]
    return np.einsum('bik,bjk->bij', Q, K) / np.sqrt(dk)

np.random.seed(42)
Q = np.random.randn(2, 4, 8)
K = np.random.randn(2, 4, 8)
scores = batched_attention_scores(Q, K)
print(f"Scores shape: {scores.shape}")
print(f"Sample scores (batch 0):\\n{np.round(scores[0], 3)}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.2 — Algebraic Structures — Quiz & Exercise data
   ═══════════════════════════════════════════════════════════════════════════ */

const ALGEBRAIC_QUIZ: QuizQuestion[] = [
    {
        question: "Given $A\\in\\mathbb{R}^{2\\times3}$ and $B\\in\\mathbb{R}^{4\\times5}$, what is the shape of $A\\otimes B$?",
        options: ["(6,15)", "(8,15)", "(6,8)", "(8,15)"],
        answer: 1,
        explanation: "The Kronecker product A⊗B has shape (mp × nq) = (2·4 × 3·5) = (8 × 15).",
    },
    {
        question: "Why does matrix multiplication in attention use a scaling factor $1/\\sqrt{d_k}$?",
        options: [
            "For numerical stability in high dimensions",
            "To make weights sum to 1",
            "To reduce compute cost",
            "For positional encoding",
        ],
        answer: 0,
        explanation: "Without scaling, dot products in high dimensions have std ≈ √d_k, pushing softmax into saturation where gradients vanish. Dividing by √d_k keeps std ≈ 1.",
    },
];

const ALGEBRAIC_EXERCISE = {
    starter: `import numpy as np

def multi_head_attention_einsum(X, h=4, seed=0):
    """
    Implement multi-head attention using np.einsum.
    X: (n, d) input matrix
    h: number of attention heads
    Returns output of shape (n, d)
    """
    # TODO: implement multi-head attention using einsum
    pass
`,
    checks: `import numpy as np
np.random.seed(42)
X = np.random.randn(6, 16)
result = multi_head_attention_einsum(X, h=4, seed=0)
_check("returns correct shape", lambda: result is not None and result.shape == (6, 16))
_check("output is finite", lambda: result is not None and np.all(np.isfinite(result)))
`,
    solution: `import numpy as np

def softmax(x, axis=-1):
    e = np.exp(x - x.max(axis=axis, keepdims=True))
    return e / e.sum(axis=axis, keepdims=True)

def multi_head_attention_einsum(X, h=4, seed=0):
    n, d = X.shape
    dk = d // h
    np.random.seed(seed)
    outputs = []
    for _ in range(h):
        WQ = np.random.randn(d, dk) * 0.1
        WK = np.random.randn(d, dk) * 0.1
        WV = np.random.randn(d, dk) * 0.1
        Q = np.einsum('nd,dk->nk', X, WQ)
        K = np.einsum('nd,dk->nk', X, WK)
        V = np.einsum('nd,dk->nk', X, WV)
        scores = np.einsum('ik,jk->ij', Q, K) / np.sqrt(dk)
        weights = softmax(scores)
        Z_h = np.einsum('ij,jk->ik', weights, V)
        outputs.append(Z_h)
    concat = np.concatenate(outputs, axis=-1)
    WO = np.random.randn(h * dk, d) * 0.1
    return np.einsum('nd,do->no', concat, WO)

np.random.seed(42)
X = np.random.randn(6, 16)
Z = multi_head_attention_einsum(X, h=4)
print(f"Input shape:  {X.shape}")
print(f"Output shape: {Z.shape}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.3 — Self-Attention — Quiz & Exercise data
   ═══════════════════════════════════════════════════════════════════════════ */

const SELFATTN_QUIZ: QuizQuestion[] = [
    {
        question: "What does the softmax in self-attention ensure?",
        options: [
            "Attention weights are non-negative and sum to 1",
            "Output values are bounded between 0 and 1",
            "Keys and queries have equal magnitude",
            "Gradients don't vanish",
        ],
        answer: 0,
        explanation: "Softmax maps the raw dot-product scores to a valid probability distribution: each weight is non-negative and all weights for a given query sum to 1.",
    },
    {
        question: "In multi-head attention with $h$ heads and $d_k$-dimensional heads, what is the shape of the concatenated output before the final projection?",
        options: ["$(n, h\\times d_k)$", "$(n, d_k)$", "$(h, n, d_k)$", "$(n, d)$"],
        answer: 0,
        explanation: "Each of the h heads produces an (n, dk) output. Concatenating along the last axis gives (n, h×dk), which is then projected back to (n, d) by W^O.",
    },
];

const SELFATTN_EXERCISE = {
    starter: `import numpy as np

def causal_self_attention(X, WQ, WK, WV):
    """
    Implement causal (masked) self-attention.
    Each token can only attend to itself and previous tokens (no future look-ahead).
    X:  (n, d)
    WQ, WK, WV: (d, dk)
    Returns output of shape (n, dk)
    Hint: create a boolean upper-triangular mask and set those positions to -inf before softmax
    """
    # TODO: implement causal attention
    pass
`,
    checks: `import numpy as np
np.random.seed(42)
n, d, dk = 5, 8, 4
X = np.random.randn(n, d)
WQ = np.random.randn(d, dk) * 0.1
WK = np.random.randn(d, dk) * 0.1
WV = np.random.randn(d, dk) * 0.1
result = causal_self_attention(X, WQ, WK, WV)
_check("returns correct shape", lambda: result is not None and result.shape == (n, dk))
_check("output is finite", lambda: result is not None and np.all(np.isfinite(result)))
X2 = X.copy(); X2[3:] = np.random.randn(2, d)
result2 = causal_self_attention(X2, WQ, WK, WV)
_check("causal: early tokens unaffected by future changes", lambda: np.allclose(result[:3], result2[:3], atol=1e-6))
`,
    solution: `import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def causal_self_attention(X, WQ, WK, WV):
    Q = X @ WQ
    K = X @ WK
    V = X @ WV
    n, dk = Q.shape
    scores = Q @ K.T / np.sqrt(dk)           # (n, n)
    mask = np.triu(np.ones((n, n), dtype=bool), k=1)
    scores[mask] = -np.inf                    # mask future positions
    weights = softmax(scores)                 # (n, n)
    return weights @ V                        # (n, dk)

np.random.seed(42)
n, d, dk = 6, 8, 4
X  = np.random.randn(n, d)
WQ = np.random.randn(d, dk) * 0.1
WK = np.random.randn(d, dk) * 0.1
WV = np.random.randn(d, dk) * 0.1
Z  = causal_self_attention(X, WQ, WK, WV)
print(f"Output shape: {Z.shape}")

# Verify causality
def get_weights(X, WQ, WK):
    Q = X @ WQ; K = X @ WK; n, dk = Q.shape
    scores = Q @ K.T / np.sqrt(dk)
    mask = np.triu(np.ones((n, n), dtype=bool), k=1)
    scores[mask] = -np.inf
    e = np.exp(scores - scores.max(axis=-1, keepdims=True)); return e / e.sum(axis=-1, keepdims=True)

W = get_weights(X, WQ, WK)
print(f"Attention weights (lower triangular):\\n{np.round(W, 3)}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.1 — Introduction to Tensors
   ═══════════════════════════════════════════════════════════════════════════ */

export function IntroToTensorsContent({ tensorLab }: { tensorLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.5.1 · Introduction to Tensors">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'What is a Tensor?',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A scalar is a 0-tensor (one number). A vector is a 1-tensor (a list). A matrix is a 2-tensor (a grid). A 3-tensor is a cube of numbers. Each step up multiplies the indices needed to locate one component.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    An order-<Latex>{'$k$'}</Latex> tensor over a vector space <Latex>{'$V$'}</Latex> is an element of the tensor product <Latex>{'$V^{\\otimes k}$'}</Latex>:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$T = \\sum_{i_1,\\ldots,i_k} T_{i_1 \\cdots i_k}\\, e_{i_1} \\otimes \\cdots \\otimes e_{i_k}$$'}</Latex>
                                                </div>
                                                <p>
                                                    The components <Latex>{'$T_{i_1 \\cdots i_k}$'}</Latex> form a <Latex>{'$k$'}</Latex>-dimensional hypermatrix — each index <Latex>{'$i_j$'}</Latex> ranges from 1 to <Latex>{'$n = \\dim V$'}</Latex>.
                                                    A scalar is a 0-tensor, a vector is a 1-tensor, and a matrix is a 2-tensor.
                                                    In transformers, word embeddings are 1-tensors and weight matrices are 2-tensors; batched activations are 3-tensors (batch × sequence × dimension).
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Tensor Products',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The tensor product builds bigger tensors from smaller ones. If <Latex>{'$A$'}</Latex> has order <Latex>{'$k$'}</Latex> and <Latex>{'$B$'}</Latex> has order <Latex>{'$l$'}</Latex>, their product <Latex>{'$A \\otimes B$'}</Latex> has order <Latex>{'$k+l$'}</Latex> with components that are products of individual components.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Given <Latex>{'$A \\in V^{\\otimes k}$'}</Latex> and <Latex>{'$B \\in W^{\\otimes l}$'}</Latex>, the tensor product <Latex>{'$A \\otimes B$'}</Latex> is an order-<Latex>{'$(k+l)$'}</Latex> tensor with components:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$(A \\otimes B)_{i_1 \\cdots i_k j_1 \\cdots j_l} = A_{i_1 \\cdots i_k}\\, B_{j_1 \\cdots j_l}$$'}</Latex>
                                                </div>
                                                <p>
                                                    The tensor product is <strong>bilinear</strong>: <Latex>{'$(A+B) \\otimes C = A \\otimes C + B \\otimes C$'}</Latex>.
                                                    This distributivity is used in transformer embedding layers to compose token and position representations.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Tensor Contraction',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Contraction is the inverse of the tensor product — it reduces order by summing over index pairs. Matrix multiplication is contraction. The trace is the simplest contraction (order 2 → scalar).
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Contracting two tensors over a shared index reduces order by 2. For matrices this is exactly matrix multiplication:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$C_{iu} = \\sum_j A_{ij}\\, B_{ju}$$'}</Latex>
                                                </div>
                                                <p>
                                                    The trace is the simplest contraction — an order-2 tensor reduced to a scalar by setting <Latex>{'$i = j$'}</Latex> and summing.
                                                    In self-attention, <Latex>{'$QK^\\top$'}</Latex> is a contraction over the <Latex>{'$d_k$'}</Latex> index, producing an <Latex>{'$n \\times n$'}</Latex> similarity matrix.
                                                    <code>np.einsum</code> expresses arbitrary contractions in a single line.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: tensorLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="tensors.py"
                                runnable
                                language="python"
                                code={`import numpy as np

# Order-0: scalar
s = 5.0
print(f"Scalar (order 0): {s}")

# Order-1: vector
v = np.array([1.0, 2.0, 3.0])
print(f"Vector (order 1): {v}")

# Order-2: matrix
M = np.array([[1, 2], [3, 4]])
print(f"Matrix (order 2):\\n{M}")

# Order-3 tensor
T = np.random.randn(3, 4, 5)
print(f"Tensor (order 3) shape: {T.shape}")

# Tensor product (outer product)
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0])
outer = np.outer(a, b)
print(f"Outer product shape: {outer.shape}")  # (3, 2)

# Tensor contraction (matrix multiplication)
A = np.random.randn(4, 3)
B = np.random.randn(3, 5)
C = np.einsum('ij,jk->ik', A, B)  # contraction over j
print(f"Contraction result shape: {C.shape}")  # (4, 5)

# Trace (simplest contraction)
square = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
trace = np.einsum('ii->', square)
print(f"Trace: {trace}")  # 15
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Batched Attention Scores with einsum"
                                prompt={<>Use <Latex>{'$\\texttt{np.einsum}$'}</Latex> to compute batched scaled attention scores <Latex>{'$QK^\\top / \\sqrt{d_k}$'}</Latex> for input tensors of shape <Latex>{'$(\\text{batch}, n, d_k)$'}</Latex>.</>}
                                starterCode={TENSORS_EXERCISE.starter}
                                checks={TENSORS_EXERCISE.checks}
                                solution={TENSORS_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={TENSORS_QUIZ} title="Check: Introduction to Tensors" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.2 — Algebraic Structures in Transformers
   ═══════════════════════════════════════════════════════════════════════════ */

export function AlgebraicStructuresContent({ kroneckerLab }: { kroneckerLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.5.2 · Algebraic Structures in Transformers">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Matrix Multiplication as Linear Map',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Every row of <Latex>{'$X$'}</Latex> is an input token. Multiplying by <Latex>{'$W$'}</Latex> projects all tokens in parallel into a new space — the same transformation for each. In attention, <Latex>{'$QK^\\top$'}</Latex> then computes all pairwise similarities at once.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The operation <Latex>{'$Y = XW$'}</Latex> transforms each row of <Latex>{'$X \\in \\mathbb{R}^{n \\times d}$'}</Latex> by the same linear map <Latex>{'$W \\in \\mathbb{R}^{d \\times d_k}$'}</Latex>.
                                                    In attention, <Latex>{'$QK^\\top$'}</Latex> produces an <Latex>{'$n \\times n$'}</Latex> similarity matrix — each entry is the dot product between a query vector and a key vector:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$S_{ij} = q_i \\cdot k_j = (XW^Q)_i \\cdot (XW^K)_j$$'}</Latex>
                                                </div>
                                                <p>
                                                    The entire similarity matrix is computed in one batched matrix multiplication — efficient on modern hardware.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Kronecker Products',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The Kronecker product <Latex>{'$A \\otimes B$'}</Latex> replaces each entry <Latex>{'$a_{ij}$'}</Latex> with a scaled copy of <Latex>{'$B$'}</Latex>. The result encodes all pairwise interactions between rows/columns of <Latex>{'$A$'}</Latex> and <Latex>{'$B$'}</Latex> without enumerating them explicitly.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    For <Latex>{'$A \\in \\mathbb{R}^{m \\times n}$'}</Latex> and <Latex>{'$B \\in \\mathbb{R}^{p \\times q}$'}</Latex>, the Kronecker product <Latex>{'$A \\otimes B$'}</Latex> is a block matrix of size <Latex>{'$mp \\times nq$'}</Latex>:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$(A \\otimes B)_{ij} = a_{\\lceil i/p \\rceil,\\, \\lceil j/q \\rceil} \\cdot B_{(i-1\\!\\mod p)+1,\\,(j-1\\!\\mod q)+1}$$'}</Latex>
                                                </div>
                                                <p>
                                                    This models interactions between two feature sets without explicitly constructing a large interaction matrix. It appears in structured weight parameterisations for transformer layers.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Kronecker Factorization',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Instead of storing a huge weight matrix <Latex>{'$M$'}</Latex>, approximate it as <Latex>{'$A \\otimes B$'}</Latex> with two small matrices. Parameters collapse from <Latex>{'$mn$'}</Latex> to <Latex>{'$m_1 n_1 + m_2 n_2$'}</Latex> — dramatic compression at modest accuracy loss.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Kronecker factorization decomposes a large matrix <Latex>{'$M \\approx A \\otimes B$'}</Latex> into two smaller matrices, reducing parameter count:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$M \\in \\mathbb{R}^{mp \\times nq} \\approx A \\otimes B, \\quad A \\in \\mathbb{R}^{m \\times n}, B \\in \\mathbb{R}^{p \\times q}$$'}</Latex>
                                                </div>
                                                <p>
                                                    Multi-head attention heads can share factored weights, reducing parameters while preserving expressivity.
                                                    This technique is crucial for scaling transformers to long sequences, as it reduces both memory footprint and compute cost.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: kroneckerLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="kronecker.py"
                                runnable
                                language="python"
                                code={`import numpy as np

# Matrix multiplication in attention
n, d, dk = 4, 8, 4
X = np.random.randn(n, d)
WQ = np.random.randn(d, dk)
WK = np.random.randn(d, dk)
WV = np.random.randn(d, dk)

Q = X @ WQ  # (n, dk)
K = X @ WK  # (n, dk)
V = X @ WV  # (n, dk)

scores = Q @ K.T / np.sqrt(dk)  # (n, n) — attention scores
print(f"Attention scores shape: {scores.shape}")

# Kronecker product
A = np.array([[1, 2], [3, 4]])
B = np.array([[0, 5], [6, 7]])
kron = np.kron(A, B)
print(f"Kronecker product:\\n{kron}")
print(f"Shape: {kron.shape}")  # (4, 4)

# Kronecker factorization approximation
# A large matrix approx as Kronecker product of two smaller ones
M = np.random.randn(4, 4)
# Factorize: find A (2x2) and B (2x2) such that A⊗B ≈ M
# Simple demo: reconstruct from known factors
A_true = np.array([[1.0, 2.0], [3.0, 4.0]])
B_true = np.array([[0.1, 0.2], [0.3, 0.4]])
M_approx = np.kron(A_true, B_true)
print(f"Factored approximation shape: {M_approx.shape}")
print(f"Parameters: {A_true.size + B_true.size} vs full: {M_approx.size}")
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Multi-Head Attention with einsum"
                                prompt={<>Implement multi-head attention using <Latex>{'$\\texttt{np.einsum}$'}</Latex> for each matrix multiplication. Verify the output shape matches the input shape <Latex>{'$(n, d)$'}</Latex>.</>}
                                starterCode={ALGEBRAIC_EXERCISE.starter}
                                checks={ALGEBRAIC_EXERCISE.checks}
                                solution={ALGEBRAIC_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={ALGEBRAIC_QUIZ} title="Check: Algebraic Structures" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.5.3 — Self-Attention Mechanisms
   ═══════════════════════════════════════════════════════════════════════════ */

export function SelfAttentionTensorContent({ selfAttentionLab }: { selfAttentionLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.5.3 · Self-Attention Mechanisms">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'The QKV Formulation',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Queries ask "what am I looking for?", keys say "what do I contain?", and values carry "what information do I have?". The learned projections <Latex>{'$W^Q, W^K, W^V$'}</Latex> allow each role to specialise independently.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    From an input sequence <Latex>{'$X \\in \\mathbb{R}^{n \\times d}$'}</Latex>, three matrices are computed via learned weight matrices:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$Q = XW^Q, \\quad K = XW^K, \\quad V = XW^V$$'}</Latex>
                                                </div>
                                                <p>
                                                    where <Latex>{'$W^Q, W^K, W^V \\in \\mathbb{R}^{d \\times d_k}$'}</Latex> are learned projections.
                                                    Each projection allows the model to transform the same input into a role-specific representation,
                                                    enabling the model to specialise queries for search and keys for indexing independently.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Attention Weight Computation',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The attention weights <Latex>{'$\\alpha_{ij}$'}</Latex> form a probability distribution for each query — non-negative and summing to 1. Token <Latex>{'$i$'}</Latex> attends to token <Latex>{'$j$'}</Latex> in proportion to how well their query and key align.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Scaled dot-product attention computes similarity scores <Latex>{'$S_{ij} = \\langle q_i, k_j \\rangle / \\sqrt{d_k}$'}</Latex>, then normalises:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\alpha_{ij} = \\text{softmax}(S_{ij}), \\qquad z_i = \\sum_j \\alpha_{ij} v_j$$'}</Latex>
                                                </div>
                                                <p>
                                                    In compact matrix form: <Latex>{'$Z = \\text{softmax}(QK^\\top / \\sqrt{d_k})\\, V$'}</Latex>.
                                                    The weights <Latex>{'$\\alpha_{ij} \\geq 0$'}</Latex> and <Latex>{'$\\sum_j \\alpha_{ij} = 1$'}</Latex> — they form a probability distribution over the sequence for every query.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Multi-Head Attention',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Multiple heads are multiple lenses on the same data. Some heads attend locally (syntax), others globally (semantics). Concatenating all views gives a richer representation than any single head could provide.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    With <Latex>{'$h$'}</Latex> heads, each head <Latex>{'$i$'}</Latex> has its own projections <Latex>{'$W_i^Q, W_i^K, W_i^V$'}</Latex> and produces an independent output <Latex>{'$Z_i$'}</Latex>. The outputs are concatenated and projected:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$Z = \\text{Concat}(Z_1, \\ldots, Z_h)\\, W^O, \\quad W^O \\in \\mathbb{R}^{h d_k \\times d}$$'}</Latex>
                                                </div>
                                                <p>
                                                    Each head specialises: some capture local syntactic patterns, others capture long-range semantic dependencies.
                                                    The final projection <Latex>{'$W^O$'}</Latex> learns how to best combine these diverse perspectives into a unified representation.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: selfAttentionLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="self_attention.py"
                                runnable
                                language="python"
                                code={`import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def self_attention(X, WQ, WK, WV):
    """Single-head self-attention."""
    Q = X @ WQ
    K = X @ WK
    V = X @ WV
    dk = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(dk)
    weights = softmax(scores)  # (n, n)
    return weights @ V, weights

def multi_head_attention(X, heads=4, dk=None):
    """Multi-head attention."""
    n, d = X.shape
    dk = dk or d // heads
    outputs = []
    for _ in range(heads):
        WQ = np.random.randn(d, dk) * 0.1
        WK = np.random.randn(d, dk) * 0.1
        WV = np.random.randn(d, dk) * 0.1
        Z_h, _ = self_attention(X, WQ, WK, WV)
        outputs.append(Z_h)
    concat = np.concatenate(outputs, axis=-1)  # (n, h*dk)
    WO = np.random.randn(heads * dk, d) * 0.1
    return concat @ WO  # (n, d)

# Demo
n, d = 6, 16
X = np.random.randn(n, d)
Z = multi_head_attention(X, heads=4)
print(f"Input shape:  {X.shape}")
print(f"Output shape: {Z.shape}")  # same as input
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Causal (Masked) Self-Attention"
                                prompt={<>Implement causal self-attention where each token can only attend to itself and <em>previous</em> tokens. Apply an upper-triangular mask of <Latex>{'$-\\infty$'}</Latex> before softmax to prevent future look-ahead.</>}
                                starterCode={SELFATTN_EXERCISE.starter}
                                checks={SELFATTN_EXERCISE.checks}
                                solution={SELFATTN_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={SELFATTN_QUIZ} title="Check: Self-Attention Mechanisms" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Backward-compatibility stubs (keep existing export names)
   ═══════════════════════════════════════════════════════════════════════════ */

export function IntroductionToTensors() { return null; }
export function TensorProductsAndContractions() { return null; }
export function RoleOfMatrixMultiplication() { return null; }
export function KroneckerProductsAndFactorization() { return null; }
export function SelfAttentionMechanism() { return null; }
export function MultiHeadSelfAttention() { return null; }

export default function TensorAlgebraContent() { return null; }
