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

/* ───────────────────────── 1.4.1 Quiz & Exercise ───────────────────────── */

const MAPPING_QUIZ: QuizQuestion[] = [
    {
        question: "What is the purpose of dividing by $\\sqrt{d_k}$ in scaled dot-product attention?",
        options: [
            "Normalize output to unit norm",
            "Prevent dot products growing too large, keeping softmax well-calibrated",
            "Ensure weights are integers",
            "Speed up matrix multiplication",
        ],
        answer: 1,
        explanation: "Without scaling, dot products in high dimensions have std ≈ √d_k, pushing softmax into saturation where gradients vanish.",
    },
    {
        question: "Which property means attention has no built-in sense of order in the sequence?",
        options: [
            "Linearity in V",
            "Permutation equivariance",
            "Boundedness",
            "Softmax normalization",
        ],
        answer: 1,
        explanation: "Simultaneously permuting Q, K, V rows gives the same permuted output — attention treats the sequence as a set. Positional encodings must provide order information separately.",
    },
];

const MAPPING_EXERCISE = {
    starter: `import numpy as np

def multi_head_attention(X, h, d_model, seed=0):
    """
    Implement multi-head attention.
    X: (n, d_model) input
    h: number of heads
    d_model: model dimension
    Returns output of shape (n, d_model)
    Hint: split X into h heads, attend each, concatenate
    """
    # TODO: implement multi-head attention
    pass
`,
    checks: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attn(Q, K, V):
    return softmax(Q @ K.T / np.sqrt(Q.shape[-1])) @ V

np.random.seed(42)
X = np.random.randn(4, 8)
result = multi_head_attention(X, h=2, d_model=8)
_check("returns correct shape", lambda: result is not None and result.shape == (4, 8))
_check("output is finite", lambda: np.all(np.isfinite(result)))
`,
    solution: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    return softmax(Q @ K.T / np.sqrt(Q.shape[-1])) @ V

def multi_head_attention(X, h, d_model, seed=0):
    n = X.shape[0]
    d_h = d_model // h
    np.random.seed(seed)
    heads = []
    for _ in range(h):
        WQ = np.random.randn(d_model, d_h) * 0.3
        WK = np.random.randn(d_model, d_h) * 0.3
        WV = np.random.randn(d_model, d_h) * 0.3
        heads.append(attention(X @ WQ, X @ WK, X @ WV))
    WO = np.random.randn(d_model, d_model) * 0.3
    return np.concatenate(heads, axis=-1) @ WO
`,
};

/* ───────────────────────── 1.4.2 Quiz & Exercise ───────────────────────── */

const HIGHDIM_QUIZ: QuizQuestion[] = [
    {
        question: "For random unit vectors in $\\mathbb{R}^{512}$, what is the approximate standard deviation of their dot products?",
        options: [
            "1",
            "$\\sqrt{512} \\approx 22.6$",
            "$1/\\sqrt{512} \\approx 0.044$",
            "512",
        ],
        answer: 2,
        explanation: "For unit vectors x,y ∈ ℝ^d, Var[x·y]=1/d, so std = 1/√d = 1/√512 ≈ 0.044. This is why the scaling factor 1/√d_k is used.",
    },
    {
        question: "The Johnson-Lindenstrauss lemma guarantees that $n$ points can be embedded into approximately $O(?)$ dimensions while preserving pairwise distances.",
        options: ["$n$", "$\\log n$", "$\\sqrt{n}$", "$n^2$"],
        answer: 1,
        explanation: "The lemma gives a target dimension of O(log n / ε²) — logarithmic in n — allowing dramatic dimensionality reduction while preserving geometry.",
    },
];

const HIGHDIM_EXERCISE = {
    starter: `import numpy as np

def johnson_lindenstrauss_check(n=100, d_in=500, d_out=20, seed=42):
    """
    Project n points from d_in dimensions to d_out dimensions via a random
    Gaussian matrix (scaled by 1/sqrt(d_out)), then verify that pairwise
    distances are approximately preserved.
    Return the array of ratios: projected_dist / original_dist for all pairs.
    """
    # TODO: implement the projection and compute distance ratios
    pass
`,
    checks: `import numpy as np
ratios = johnson_lindenstrauss_check()
_check("returns array of ratios", lambda: ratios is not None and len(ratios) > 0)
_check("most ratios in [0.5, 2.0]", lambda: np.mean((ratios > 0.5) & (ratios < 2.0)) > 0.8)
`,
    solution: `import numpy as np

def johnson_lindenstrauss_check(n=100, d_in=500, d_out=20, seed=42):
    np.random.seed(seed)
    X = np.random.randn(n, d_in)
    R = np.random.randn(d_in, d_out) / np.sqrt(d_out)
    X_proj = X @ R
    ratios = []
    for i in range(n):
        for j in range(i+1, n):
            d_orig = np.linalg.norm(X[i] - X[j])
            d_proj = np.linalg.norm(X_proj[i] - X_proj[j])
            if d_orig > 0:
                ratios.append(d_proj / d_orig)
    return np.array(ratios)

ratios = johnson_lindenstrauss_check()
print(f"Mean ratio: {ratios.mean():.3f}")
print(f"Std ratio:  {ratios.std():.3f}")
print(f"In [0.7, 1.3]: {np.mean((ratios > 0.7) & (ratios < 1.3))*100:.1f}%")
`,
};

/* ───────────────────────── 1.4.3 Quiz & Exercise ───────────────────────── */

const APPLICATIONS_QUIZ: QuizQuestion[] = [
    {
        question: "In multi-head attention with $h=8$ heads and $d_{\\text{model}}=512$, what is $d_k$ (dimension per head)?",
        options: ["512", "64", "8", "4096"],
        answer: 1,
        explanation: "Each head gets d_k = d_model/h = 512/8 = 64 dimensions for its Q, K, V projections. Total parameter count stays at 4d² regardless of h.",
    },
    {
        question: "Why do residual connections help with metric preservation across transformer layers?",
        options: [
            "They remove all attention computation",
            "They bound geometry change per layer — output stays close to input",
            "They double the model's expressivity",
            "They normalize the attention weights",
        ],
        answer: 1,
        explanation: "With x_out = x + Attention(x), the output representation can't stray far from the input — the geometry shifts by at most the magnitude of the attention term, preserving overall structure.",
    },
];

const APPLICATIONS_EXERCISE = {
    starter: `import numpy as np

def measure_metric_distortion(X, h=4, seed=0):
    """
    Apply multi-head self-attention + residual connection to X.
    Compute pairwise distance ratios (output_dist / input_dist) for all pairs.
    Return (pairs, in_dists, out_dists) where pairs is a list of (i,j) tuples.
    """
    # TODO: implement self-attention + residual and compute distance ratios
    pass
`,
    checks: `import numpy as np
np.random.seed(42)
X = np.random.randn(5, 16)
result = measure_metric_distortion(X)
_check("returns 3-tuple", lambda: result is not None and len(result) == 3)
pairs, in_d, out_d = result
_check("correct number of pairs", lambda: len(pairs) == 10)
_check("distances are positive", lambda: all(d > 0 for d in in_d) and all(d > 0 for d in out_d))
`,
    solution: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    return softmax(Q @ K.T / np.sqrt(Q.shape[-1])) @ V

def multi_head_attention(X, h=4, seed=0):
    n, d = X.shape
    d_h = d // h
    np.random.seed(seed)
    heads = []
    for _ in range(h):
        WQ = np.random.randn(d, d_h) * 0.3
        WK = np.random.randn(d, d_h) * 0.3
        WV = np.random.randn(d, d_h) * 0.3
        heads.append(attention(X@WQ, X@WK, X@WV))
    return np.concatenate(heads, axis=-1)

def measure_metric_distortion(X, h=4, seed=0):
    out = multi_head_attention(X, h, seed)
    x_out = X + out  # residual connection
    pairs = [(i,j) for i in range(len(X)) for j in range(i+1,len(X))]
    in_d  = [np.linalg.norm(X[i]-X[j]) for i,j in pairs]
    out_d = [np.linalg.norm(x_out[i]-x_out[j]) for i,j in pairs]
    return pairs, in_d, out_d

np.random.seed(42)
X = np.random.randn(5, 16)
pairs, in_d, out_d = measure_metric_distortion(X)
print("Pair   | Input dist | Output dist | Ratio")
for (i,j), d_in, d_out in zip(pairs, in_d, out_d):
    print(f"({i},{j})    | {d_in:.3f}      | {d_out:.3f}       | {d_out/d_in:.3f}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   1.4.1 — Attention as a Mapping
   ═══════════════════════════════════════════════════════════════════════════ */

export function AttentionAsMappingContent({ mappingLab }: { mappingLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.4.1 · Attention as a Mapping">
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
                                                Attention is a soft database lookup: the query asks a question, keys index entries, values hold the data. Softmax converts raw scores into a probability distribution.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The attention function takes three inputs: queries <Latex>{'$Q$'}</Latex>, keys <Latex>{'$K$'}</Latex>, and values <Latex>{'$V$'}</Latex>. The core formula is:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V$$'}</Latex>
                                                </div>
                                                <p>
                                                    Scaling by <Latex>{'$\\sqrt{d_k}$'}</Latex> prevents dot products from growing too large in high dimensions,
                                                    keeping the softmax well-calibrated. The output is a weighted sum of values; weights are
                                                    non-negative and sum to 1.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Mathematical Properties',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Linearity in values makes attention composable. Permutation equivariance means order only matters through positional encodings — the mechanism itself is order-agnostic.
                                            </Intuition>
                                            <Reading>
                                                <p><strong>Linearity in V:</strong></p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\text{Attention}(Q, K, \\alpha V_1 + \\beta V_2) = \\alpha\\,\\text{Attention}(Q, K, V_1) + \\beta\\,\\text{Attention}(Q, K, V_2)$$'}</Latex>
                                                </div>
                                                <p><strong>Permutation equivariance:</strong> permuting <Latex>{'$Q, K, V$'}</Latex> rows simultaneously permutes the output.</p>
                                                <p><strong>Probabilistic:</strong> weights <Latex>{'$\\alpha_{ij} \\geq 0$'}</Latex> and <Latex>{'$\\sum_j \\alpha_{ij} = 1$'}</Latex> for every query <Latex>{'$i$'}</Latex>.</p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Multi-Head Attention',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Multiple heads are multiple lenses on the data — each captures different relationships: syntax, semantics, position. Concatenating them gives the full picture.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    <Latex>{'$h$'}</Latex> parallel attention heads with separate projections, each operating in <Latex>{'$d_k = d_{\\text{model}}/h$'}</Latex> dimensions:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\text{head}_i = \\text{Attention}(XW_i^Q,\\, XW_i^K,\\, XW_i^V)$$'}</Latex>
                                                </div>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\text{MultiHead}(X) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h)W^O$$'}</Latex>
                                                </div>
                                                <p>
                                                    Total parameter cost: <Latex>{'$4d_{\\text{model}}^2$'}</Latex> per layer, regardless of the number of heads.
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
                        content: mappingLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="attention.py"
                                runnable
                                language="python"
                                code={`import numpy as np

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights /= weights.sum(axis=-1, keepdims=True)
    return weights @ V, weights

np.random.seed(42)
Q = np.random.randn(3, 4)  # 3 tokens, d_k=4
K = np.random.randn(3, 4)
V = np.random.randn(3, 4)

output, weights = scaled_dot_product_attention(Q, K, V)
print("Attention weights (rows sum to 1):")
print(np.round(weights, 3))
print("\\nRow sums:", np.round(weights.sum(axis=1), 4))

# Verify linearity in V
alpha, V2 = 0.6, np.random.randn(3, 4)
out1, _ = scaled_dot_product_attention(Q, K, alpha*V + (1-alpha)*V2)
out2, _ = scaled_dot_product_attention(Q, K, V)
out3, _ = scaled_dot_product_attention(Q, K, V2)
print("\\nLinearity error:", np.max(np.abs(out1 - (alpha*out2 + (1-alpha)*out3))))
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Implement Multi-Head Attention"
                                prompt={<>Split <Latex>{'$Q, K, V$'}</Latex> into <Latex>{'$h$'}</Latex> heads, apply scaled dot-product attention to each, then concatenate and project the outputs.</>}
                                starterCode={MAPPING_EXERCISE.starter}
                                checks={MAPPING_EXERCISE.checks}
                                solution={MAPPING_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={MAPPING_QUIZ} title="Check: Attention as a Mapping" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.4.2 — High-Dimensional Geometry
   ═══════════════════════════════════════════════════════════════════════════ */

export function HighDimGeometryContent({ dimensionalityLab }: { dimensionalityLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.4.2 · High-Dimensional Geometry">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'The Curse of Dimensionality',
                                    content: (
                                        <div>
                                            <Intuition>
                                                In 2D a circle fills most of its bounding square. In 1000D a hypersphere is nearly empty relative to the hypercube — high dimensions are mostly &quot;corners&quot;, and data becomes exponentially sparse.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The volume of the unit <Latex>{'$d$'}</Latex>-ball:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$V_d = \\frac{\\pi^{d/2}}{\\Gamma(d/2 + 1)} \\to 0 \\text{ as } d \\to \\infty$$'}</Latex>
                                                </div>
                                                <p>
                                                    The ratio of sphere to cube volume falls exponentially. K-nearest neighbours breaks down: all pairwise distances concentrate. We need exponentially more data to fill space at the same density.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Distance Concentration',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Random vectors in high dimensions are nearly orthogonal — their dot products concentrate near zero with std <Latex>{'$1/\\sqrt{d}$'}</Latex>. This is why attention scales by <Latex>{'$\\sqrt{d_k}$'}</Latex>: to keep scores in a useful range.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    For random unit vectors <Latex>{'$x, y \\in \\mathbb{R}^d$'}</Latex>:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\mathbb{E}[x \\cdot y] = 0, \\quad \\text{Var}[x \\cdot y] = \\frac{1}{d}$$'}</Latex>
                                                </div>
                                                <p>
                                                    Unscaled dot products <Latex>{'$\\sim \\mathcal{N}(0, \\sqrt{d_k})$'}</Latex> in dimension <Latex>{'$d_k$'}</Latex> — softmax saturates.
                                                    Scaling by <Latex>{'$1/\\sqrt{d_k}$'}</Latex> normalises to std <Latex>{'$\\approx 1$'}</Latex>. All pairwise distances
                                                    also concentrate: <Latex>{'$(d_{\\max} - d_{\\min}) / d_{\\text{avg}} \\to 0$'}</Latex> as <Latex>{'$d \\to \\infty$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Concentration of Measure',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Almost all of a high-dimensional sphere&apos;s surface is near its equator. Functions on high-dimensional distributions become predictable — a surprising gift for learning.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    <strong>Lévy&apos;s lemma:</strong> for 1-Lipschitz <Latex>{'$f$'}</Latex> on <Latex>{'$S^{d-1}$'}</Latex>:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$P\\!\\left(|f(x) - \\mathbb{E}f| > \\varepsilon\\right) \\leq 2\\exp\\!\\left(-\\frac{d\\varepsilon^2}{2}\\right)$$'}</Latex>
                                                </div>
                                                <p>
                                                    <strong>Johnson-Lindenstrauss:</strong> <Latex>{'$n$'}</Latex> points embed into <Latex>{'$O(\\log n / \\varepsilon^2)$'}</Latex> dimensions,
                                                    preserving distances within <Latex>{'$(1 \\pm \\varepsilon)$'}</Latex>. Consequence: random linear projections (like attention
                                                    weight matrices) preserve geometric structure.
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
                        content: dimensionalityLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="high_dim.py"
                                runnable
                                language="python"
                                code={`import numpy as np

np.random.seed(42)
print("Distance concentration in high dimensions:\\n")
for d in [2, 10, 50, 200, 512]:
    n = 500
    X = np.random.randn(n, d)
    X /= np.linalg.norm(X, axis=1, keepdims=True)
    dots = X @ X.T
    mask = ~np.eye(n, dtype=bool)
    off = dots[mask]
    print(f"d={d:4d}: mean={off.mean():.4f}  std={off.std():.4f}  "
          f"(theory: 0.0000, {1/np.sqrt(d):.4f})")

print("\\nConclusion: std ~ 1/sqrt(d). Scaling by 1/sqrt(d_k) keeps attention calibrated.")
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Johnson-Lindenstrauss Check"
                                prompt={<>Project 100 points from 500D to 20D via a random Gaussian matrix, then verify that pairwise distances are approximately preserved (ratios in <Latex>{'$[0.7, 1.3]$'}</Latex>).</>}
                                starterCode={HIGHDIM_EXERCISE.starter}
                                checks={HIGHDIM_EXERCISE.checks}
                                solution={HIGHDIM_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={HIGHDIM_QUIZ} title="Check: High-Dimensional Geometry" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.4.3 — Applications in Transformer Architectures
   ═══════════════════════════════════════════════════════════════════════════ */

export function ApplicationsContent({ preservationLab }: { preservationLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.4.3 · Applications in Transformer Architectures">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Expressivity of Self-Attention',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Self-attention is a Turing-complete operation — with enough heads and layers, transformers can simulate any algorithm. Each head specialises in a different aspect of the data.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    In self-attention, <Latex>{'$Q = K = V = XW^E$'}</Latex> (same sequence projected). Multi-head attention captures syntax (head 1), semantics (head 2), co-reference (head 3), and more.
                                                    Universal approximation for sequences — expressivity grows with <Latex>{'$h$'}</Latex> (heads) and <Latex>{'$L$'}</Latex> (layers).
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Attention as Metric-Preserving Map',
                                    content: (
                                        <div>
                                            <Intuition>
                                                If two tokens are semantically similar going in, they should come out similar. Attention approximately preserves this geometry — with selective distortion that emphasises task-relevant dimensions.
                                            </Intuition>
                                            <Reading>
                                                <p>Output distance bound:</p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\|\\text{Attention}(x_i) - \\text{Attention}(x_j)\\| \\leq C\\,\\|x_i - x_j\\| + \\|\\alpha_i - \\alpha_j\\|_1 M_V$$'}</Latex>
                                                </div>
                                                <p>
                                                    When attention patterns match: isometric-like. When patterns differ: selective contraction.
                                                    Similar tokens get pulled together; distinct tokens maintain separation.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Layer Stacking and Residual Connections',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Skip connections limit geometry distortion per layer. Early layers encode local syntax; later layers encode global semantics. The residual path ensures distances cannot explode.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Residual: <Latex>{'$x_{\\text{out}} = x + \\text{Attention}(x)$'}</Latex> — geometry shifts by at most the attention contribution.
                                                    LayerNorm keeps norms bounded. <Latex>{'$L$'}</Latex> layers give <Latex>{'$L$'}</Latex> chances to refine metric structure.
                                                </p>
                                                <p>
                                                    BERT analysis: lower layers encode syntax, higher layers encode semantics.
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
                        content: preservationLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="expressivity.py"
                                runnable
                                language="python"
                                code={`import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    return softmax(Q @ K.T / np.sqrt(Q.shape[-1])) @ V

def multi_head_attention(X, h=4, seed=0):
    n, d = X.shape
    d_h = d // h
    np.random.seed(seed)
    heads = []
    for _ in range(h):
        WQ = np.random.randn(d, d_h) * 0.3
        WK = np.random.randn(d, d_h) * 0.3
        WV = np.random.randn(d, d_h) * 0.3
        heads.append(attention(X@WQ, X@WK, X@WV))
    return np.concatenate(heads, axis=-1)

np.random.seed(42)
X = np.random.randn(5, 16)  # 5 tokens, 16-dim

# Apply self-attention + residual
out = multi_head_attention(X, h=4)
x_out = X + out  # residual connection

pairs = [(i,j) for i in range(5) for j in range(i+1,5)]
in_d  = [np.linalg.norm(X[i]-X[j]) for i,j in pairs]
out_d = [np.linalg.norm(x_out[i]-x_out[j]) for i,j in pairs]

print("Pair   | Input dist | Output dist | Ratio")
for (i,j), d_in, d_out in zip(pairs, in_d, out_d):
    print(f"({i},{j})    | {d_in:.3f}      | {d_out:.3f}       | {d_out/d_in:.3f}")
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Measure Attention's Metric Distortion"
                                prompt={<>Compute pairwise distance ratios before and after self-attention (with residual connection). Identify which pairs were most distorted and why.</>}
                                starterCode={APPLICATIONS_EXERCISE.starter}
                                checks={APPLICATIONS_EXERCISE.checks}
                                solution={APPLICATIONS_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={APPLICATIONS_QUIZ} title="Check: Applications in Transformers" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Backward-compatibility stubs
   ═══════════════════════════════════════════════════════════════════════════ */

export function AttentionAsMapping() { return null; }
export function AttentionProperties() { return null; }
export function CurseOfDimensionality() { return null; }
export function ConcentrationOfMeasure() { return null; }
export function ModelExpressivity() { return null; }
export function AttentionMetricPreserving() { return null; }
export default function AttentionFoundationsContent() { return null; }
