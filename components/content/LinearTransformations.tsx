"use client";

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { BookOpen, ChevronDown, Code2, Dumbbell, ListChecks, Shapes } from 'lucide-react';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import Tabs from '@/components/ui/Tabs';
import Quiz, { QuizQuestion } from '@/components/ui/Quiz';
import CodingExercise from '@/components/ui/CodingExercise';
import ConceptStepper from '@/components/ui/ConceptStepper';
import Intuition from '@/components/ui/Intuition';

type Props = {
    transformLab?: React.ReactNode;
    kernelLab?: React.ReactNode;
};

const conceptIcon   = <BookOpen   size={15} />;
const visualizeIcon = <Shapes     size={15} />;
const codeIcon      = <Code2      size={15} />;
const exerciseIcon  = <Dumbbell   size={15} />;
const quizIcon      = <ListChecks size={15} />;

/* ──────────── Expand-card shared with axiom-style facts ──────────── */

function FactCard({ n, name, formula, example }: {
    n?: number;
    name: string;
    formula: React.ReactNode;
    example: string;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(o => !o)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => !o); } }}
            className={`cursor-pointer select-none rounded-xl border p-3.5 transition-all hover:shadow-sm ${
                open ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] hover:border-[var(--accent)]'
            }`}
        >
            <div className="flex items-start gap-3">
                {n !== undefined && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">
                        {n}
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">{name}</p>
                    <div className="mt-0.5 text-sm text-[var(--foreground)]">{formula}</div>
                </div>
                <ChevronDown size={13} className={`mt-0.5 shrink-0 text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <p className="mt-2.5 border-t border-[var(--border)] pt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                    {example}
                </p>
            )}
        </div>
    );
}

/* ────── Two-column property card (no toggle, content always visible) ──── */

function PropertyCard({ name, formula, meaning, example }: {
    name: string;
    formula: React.ReactNode;
    meaning: string;
    example: string;
}) {
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">{name}</p>
            <div className="mt-1 text-sm font-medium text-[var(--foreground)]">{formula}</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{meaning}</p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-[var(--surface-2)] p-2.5 font-mono text-[11px] text-[var(--foreground)] whitespace-pre-wrap">
                {example}
            </pre>
        </div>
    );
}

/* ───────────────────────── Per-subsection quizzes ───────────────────────── */

const LT_QUIZ: QuizQuestion[] = [
    {
        question: "A function $T: V \\to W$ is linear when it satisfies:",
        options: [
            "Additivity only: $T(u + v) = T(u) + T(v)$",
            "Homogeneity only: $T(\\alpha v) = \\alpha T(v)$",
            "Both additivity and homogeneity",
            "Neither — linearity means $T(v) = v$",
        ],
        answer: 2,
        explanation: "Both must hold: additivity $T(u+v)=T(u)+T(v)$ and homogeneity $T(\\alpha v)=\\alpha T(v)$. Together: $T(\\alpha u + \\beta v) = \\alpha T(u) + \\beta T(v)$.",
    },
    {
        question: "Every linear transformation $T: \\mathbb{R}^n \\to \\mathbb{R}^m$ can be written as:",
        options: [
            "A polynomial in $v$",
            "A matrix multiplication $Mv$",
            "The dot product $v \\cdot w$",
            "An affine shift $v + b$",
        ],
        answer: 1,
        explanation: "The columns of matrix $M$ record where each basis vector is sent, so $T(v) = Mv$ for all $v$.",
    },
    {
        question: "If $T$ is a linear transformation, then $T(\\mathbf{0}) =$",
        options: ["$\\mathbf{0}$", "$\\mathbf{1}$", "$T(\\mathbf{1})$", "Undefined"],
        answer: 0,
        explanation: "$T(\\mathbf{0}) = T(0 \\cdot v) = 0 \\cdot T(v) = \\mathbf{0}$ by homogeneity. The zero vector always maps to zero.",
    },
];

const KERNEL_QUIZ: QuizQuestion[] = [
    {
        question: "The kernel of $T: V \\to W$ contains all vectors $v \\in V$ such that:",
        options: ["$T(v) = v$", "$T(v) = 1$", "$T(v) = \\mathbf{0}$", "$T(v)$ is undefined"],
        answer: 2,
        explanation: "The kernel (null space) is exactly the set of vectors collapsed to zero by $T$. Its size measures information loss.",
    },
    {
        question: "The Rank-Nullity Theorem states that for $T: V \\to W$:",
        options: [
            "$\\text{rank}(T) = \\text{nullity}(T)$",
            "$\\dim(V) = \\text{rank}(T) + \\text{nullity}(T)$",
            "$\\dim(W) = \\text{rank}(T)$",
            "$\\text{nullity}(T) = \\dim(W)$",
        ],
        answer: 1,
        explanation: "What $T$ preserves (rank) plus what it loses (nullity) always equals the input dimension.",
    },
    {
        question: "If $T: \\mathbb{R}^4 \\to \\mathbb{R}^3$ has rank 2, what is $\\text{nullity}(T)$?",
        options: ["0", "1", "2", "3"],
        answer: 2,
        explanation: "By rank-nullity: $\\text{nullity} = \\dim(V) - \\text{rank} = 4 - 2 = 2$.",
    },
];

const TRANSFORMER_LT_QUIZ: QuizQuestion[] = [
    {
        question: "In transformers, the Query, Key, and Value matrices each perform:",
        options: [
            "A non-linear activation of embeddings",
            "A linear projection of input embeddings",
            "A softmax normalization",
            "Positional encoding",
        ],
        answer: 1,
        explanation: "$Q = XW_Q$, $K = XW_K$, $V = XW_V$ — each is a matrix multiplication, i.e. a linear transformation.",
    },
    {
        question: "Composing two linear transformations $A$ and $B$ corresponds to:",
        options: [
            "Adding their matrices $A + B$",
            "Multiplying their matrices $AB$",
            "Transposing: $A^T$",
            "The Hadamard product",
        ],
        answer: 1,
        explanation: "Applying $B$ first then $A$ equals multiplying by $AB$. Matrix multiplication is the right operation for composition.",
    },
    {
        question: "What does $\\det(M) = 0$ imply about the transformation $M$?",
        options: [
            "It is the identity",
            "It is invertible",
            "It collapses the space to a lower dimension",
            "It is a rotation",
        ],
        answer: 2,
        explanation: "When $\\det = 0$ the matrix is singular — the kernel is non-trivial and information is lost.",
    },
];

/* ──────────────────────── Per-subsection exercises ──────────────────────── */

const APPLY_TRANSFORM_EXERCISE = {
    starter: `import numpy as np

def apply_transform(M, v):
    """Apply transformation matrix M to vector v.

    M: a list-of-lists or 2D array (m x n)
    v: a list or 1D array (n-vector)
    Return M @ v as a numpy array.
    """
    # TODO: compute and return M @ v as a numpy array
    pass
`,
    checks: `_check("identity maps [3, 4] to itself",
       lambda: np.allclose(apply_transform([[1,0],[0,1]], [3,4]), [3,4]))
_check("90° rotation: [1, 0] → [0, 1]",
       lambda: np.allclose(apply_transform([[0,-1],[1,0]], [1,0]), [0,1]))
_check("scale [[2,0],[0,3]] @ [1,1] == [2,3]",
       lambda: np.allclose(apply_transform([[2,0],[0,3]], [1,1]), [2,3]))
_check("returns a numpy array",
       lambda: isinstance(apply_transform([[1,0],[0,1]], [1,2]), np.ndarray))
`,
    solution: `import numpy as np

def apply_transform(M, v):
    return np.array(M, dtype=float) @ np.array(v, dtype=float)
`,
};

const COMPOSE_EXERCISE = {
    starter: `import numpy as np

def compose(A, B):
    """Return the matrix for applying B first, then A.

    A: 2D array (m x k)
    B: 2D array (k x n)
    Return the m x n matrix A @ B as a numpy array.
    """
    # TODO: return A @ B as a numpy array
    pass
`,
    checks: `I    = [[1,0],[0,1]]
R90  = [[0,-1],[1,0]]    # 90° counter-clockwise
R180 = [[-1,0],[0,-1]]  # 180° rotation
_check("I ∘ R90 == R90",
       lambda: np.allclose(compose(I, R90), R90))
_check("R90 ∘ R90 == R180  (two 90° = 180°)",
       lambda: np.allclose(compose(R90, R90), R180))
_check("[[2,0],[0,2]] ∘ I == [[2,0],[0,2]]",
       lambda: np.allclose(compose([[2,0],[0,2]], I), [[2,0],[0,2]]))
_check("returns a numpy array",
       lambda: isinstance(compose(I, I), np.ndarray))
`,
    solution: `import numpy as np

def compose(A, B):
    return np.array(A, dtype=float) @ np.array(B, dtype=float)
`,
};

const ATTENTION_SCORE_EXERCISE = {
    starter: `import numpy as np

def attention_score(q, k):
    """Compute the scaled dot-product attention score.

    q: query vector (1D array of dimension d_k)
    k: key   vector (1D array of dimension d_k)
    Return  q · k / sqrt(d_k)  as a float.
    """
    # TODO: compute and return the scaled attention score
    pass
`,
    checks: `_check("parallel [1,0]·[1,0]/√2 ≈ 0.7071",
       lambda: np.isclose(attention_score(np.array([1.0,0.0]), np.array([1.0,0.0])), 1/np.sqrt(2)))
_check("perpendicular vectors → score is 0",
       lambda: np.isclose(attention_score(np.array([1.0,0.0]), np.array([0.0,1.0])), 0.0))
_check("score scales with magnitude",
       lambda: np.isclose(attention_score(np.array([2.0,0.0]), np.array([1.0,0.0])), 2/np.sqrt(2)))
`,
    solution: `import numpy as np

def attention_score(q, k):
    q = np.array(q, dtype=float)
    k = np.array(k, dtype=float)
    return float(np.dot(q, k) / np.sqrt(len(k)))
`,
};

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
   Main export
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LinearTransformationsContent({ transformLab, kernelLab }: Props) {
    return (
        <div className="space-y-10">

            {/* ══ Card 1: Linear Transformations ══ */}
            <Card title="1.1.2 Linear Transformations">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'The Idea',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A linear transformation reshapes the vector space without bending it. Parallel lines stay parallel, the origin stays fixed. You can rotate, scale, shear, or project — but never translate, square, or add a constant.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A function <Latex>{'$T: V \\to W$'}</Latex> is a <strong>linear transformation</strong> when it respects both vector operations. Adding then transforming gives the same result as transforming then adding; scaling then transforming equals transforming then scaling:
                                                </p>
                                                <ol className="list-decimal pl-6 space-y-1">
                                                    <li><Latex>{'$T(u + v) = T(u) + T(v)$'}</Latex></li>
                                                    <li><Latex>{'$T(\\alpha u) = \\alpha T(u)$'}</Latex></li>
                                                </ol>
                                                <p>
                                                    <Latex>{'$T(v) = Mv$'}</Latex> (matrix multiplication) is always linear. <Latex>{'$T(v) = v^2$'}</Latex> is not. <Latex>{'$T(v) = v + c$'}</Latex> is not — it shifts the origin and is called <em>affine</em>, not linear.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Two Rules',
                                    content: (
                                        <div>
                                            <p className="mb-4 text-sm text-[var(--muted)]">
                                                Both must hold simultaneously. Together they collapse to one condition: <Latex>{'$T(\\alpha u + \\beta v) = \\alpha T(u) + \\beta T(v)$'}</Latex>.
                                            </p>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <PropertyCard
                                                    name="Additivity"
                                                    formula={<Latex>{'$T(u + v) = T(u) + T(v)$'}</Latex>}
                                                    meaning="Adding then transforming = transforming then adding."
                                                    example={"Let M = [[2,0],[0,3]], u = [1,0], v = [0,1]\nT(u+v) = M·[1,1] = [2,3]\nT(u)+T(v) = [2,0]+[0,3] = [2,3]  ✓"}
                                                />
                                                <PropertyCard
                                                    name="Homogeneity"
                                                    formula={<Latex>{'$T(\\alpha u) = \\alpha T(u)$'}</Latex>}
                                                    meaning="Scaling then transforming = transforming then scaling."
                                                    example={"Let M = [[2,0],[0,3]], α = 4, u = [1,2]\nT(4·[1,2]) = M·[4,8] = [8,24]\n4·T([1,2]) = 4·[2,6] = [8,24]  ✓"}
                                                />
                                            </div>
                                            <Intuition>
                                                An immediate consequence: <Latex>{'$T(\\mathbf{0}) = \\mathbf{0}$'}</Latex>. If your transformation moves the origin, it isn&apos;t linear — this is why translations in computer graphics are handled separately with homogeneous coordinates.
                                            </Intuition>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Matrix Representation',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The deep fact: every linear transformation between finite-dimensional spaces is exactly matrix multiplication. The matrix columns encode where the transformation sends each basis vector.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    If <Latex>{'$\\{v_1, \\ldots, v_n\\}$'}</Latex> is a basis for <Latex>{'$V$'}</Latex>, the <Latex>{'$j$'}</Latex>th column of <Latex>{'$[T]$'}</Latex> is <Latex>{'$T(v_j)$'}</Latex>. Then <Latex>{'$T(v) = [T]\\,v$'}</Latex> for every <Latex>{'$v$'}</Latex>.
                                                </p>
                                                <p>
                                                    A 90° counter-clockwise rotation maps <Latex>{'$e_1=[1,0] \\to [0,1]$'}</Latex> and <Latex>{'$e_2=[0,1] \\to [-1,0]$'}</Latex>:
                                                </p>
                                                <p className="text-center my-4">
                                                    <Latex>{'$R_{90°} = \\begin{pmatrix}0 & -1 \\\\ 1 & 0\\end{pmatrix}$'}</Latex>
                                                </p>
                                                <p>
                                                    <strong>Composition = matrix multiplication.</strong> Applying <Latex>{'$B$'}</Latex> then <Latex>{'$A$'}</Latex> equals multiplying by <Latex>{'$AB$'}</Latex>. This is the algebraic reason neural network layers chain with matrix products.
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
                        content: transformLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>In NumPy, a linear transformation is just <code>M @ v</code>. We can verify both axioms numerically.</p>
                                <CodeBlock title="linearity_check.py" runnable code={`import numpy as np

M = np.array([[2, 1], [0, 3]], dtype=float)
T = lambda v: M @ v

u = np.array([1.0, 0.0])
v = np.array([0.0, 1.0])
alpha = 3.0

# Additivity: T(u + v) == T(u) + T(v)
assert np.allclose(T(u + v), T(u) + T(v))
print("Additivity:", T(u + v))

# Homogeneity: T(alpha * u) == alpha * T(u)
assert np.allclose(T(alpha * u), alpha * T(u))
print("Homogeneity:", T(alpha * u))
print("Both axioms hold!")`} />
                                <p>Composition of transformations is matrix multiplication — applying <Latex>{'$B$'}</Latex> first then <Latex>{'$A$'}</Latex> equals <Latex>{'$AB$'}</Latex>:</p>
                                <CodeBlock title="composition.py" runnable code={`import numpy as np

R90 = np.array([[0, -1], [1, 0]], dtype=float)   # rotate 90°
Ref = np.array([[-1, 0], [0, 1]], dtype=float)   # reflect over y-axis

# Composition: first R90, then Ref  ==>  Ref @ R90
composed = Ref @ R90

v = np.array([1.0, 0.0])
print("v:             ", v)
print("After R90:     ", R90 @ v)
print("After Ref∘R90: ", composed @ v)`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: apply a transformation"
                                prompt={<>Every linear transformation is a matrix multiplication. Implement <code>apply_transform(M, v)</code> that applies matrix <code>M</code> to vector <code>v</code> and returns the result as a numpy array.</>}
                                starterCode={APPLY_TRANSFORM_EXERCISE.starter}
                                checks={APPLY_TRANSFORM_EXERCISE.checks}
                                solution={APPLY_TRANSFORM_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={LT_QUIZ} title="Check: linear transformations" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 2: Kernels and Images ══ */}
            <Card title="Kernels and Images">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'The Kernel',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The kernel is the transformation&apos;s blind spot — all vectors it flattens to zero. A big kernel means the transformation is lossy: many distinct inputs collapse to the same output, and information is permanently lost.
                                            </Intuition>
                                            <Reading>
                                                <p className="my-4 text-center">
                                                    <Latex>{'$\\ker(T) = \\{\\, v \\in V \\mid T(v) = \\mathbf{0}\\,\\}$'}</Latex>
                                                </p>
                                                <p>
                                                    It is always a subspace of <Latex>{'$V$'}</Latex>. Its dimension is the <em>nullity</em> of <Latex>{'$T$'}</Latex>.
                                                </p>
                                                <p>
                                                    <strong>Example.</strong> The projection <Latex>{'$M = \\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}$'}</Latex> maps <Latex>{'$[x, y] \\to [x, 0]$'}</Latex>. Any vector <Latex>{'$[0, y]$'}</Latex> maps to <Latex>{'$[0, 0]$'}</Latex>, so <Latex>{'$\\ker(M) = \\text{span}\\{[0,1]\\}$'}</Latex> — a line. Nullity = 1.
                                                </p>
                                                <p>
                                                    A transformation is <em>injective</em> (one-to-one) if and only if <Latex>{'$\\ker(T) = \\{\\mathbf{0}\\}$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Image',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The image is the transformation&apos;s shadow — the full set of reachable outputs. A transformation with a small image is projecting the whole space onto a lower-dimensional surface, discarding everything off that surface.
                                            </Intuition>
                                            <Reading>
                                                <p className="my-4 text-center">
                                                    <Latex>{'$\\text{Im}(T) = \\{\\, T(v) \\mid v \\in V\\,\\}$'}</Latex>
                                                </p>
                                                <p>
                                                    It is always a subspace of <Latex>{'$W$'}</Latex>. Its dimension is the <em>rank</em> of <Latex>{'$T$'}</Latex>.
                                                </p>
                                                <p>
                                                    <strong>Same example.</strong> <Latex>{'$M$'}</Latex> can only output vectors of the form <Latex>{'$[x, 0]$'}</Latex>, so <Latex>{'$\\text{Im}(M)$'}</Latex> = the x-axis. Rank = 1.
                                                </p>
                                                <p>
                                                    A transformation is <em>surjective</em> (onto) if and only if <Latex>{'$\\text{Im}(T) = W$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Rank-Nullity',
                                    content: (
                                        <div>
                                            <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
                                                <p className="font-semibold text-indigo-900 dark:text-indigo-200">Rank-Nullity Theorem</p>
                                                <p className="mt-3 text-center text-base text-indigo-800 dark:text-indigo-300">
                                                    <Latex>{'$\\dim(V) = \\text{rank}(T) + \\text{nullity}(T)$'}</Latex>
                                                </p>
                                            </div>
                                            <Intuition>
                                                The dimensions you lose (nullity — collapsed into the kernel) plus the dimensions you keep (rank — visible in the image) always add up to where you started. Information is conserved in this accounting.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    <strong>Example.</strong> <Latex>{'$T: \\mathbb{R}^4 \\to \\mathbb{R}^3$'}</Latex> with rank 2. By the theorem: nullity = 4 − 2 = 2. The transformation has a 2-D kernel (loses 2 dimensions) and produces a 2-D image.
                                                </p>
                                            </Reading>
                                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                                <FactCard name="dim(V) = 4" formula={<span className="text-base font-bold">4</span>} example="The input space is 4-dimensional." />
                                                <FactCard name="rank(T) = 2" formula={<span className="text-base font-bold text-[var(--accent)]">2</span>} example="The image is a 2-D plane — 2 dimensions survive." />
                                                <FactCard name="nullity(T) = 2" formula={<span className="text-base font-bold text-rose-500">2</span>} example="The kernel is a 2-D plane — 2 dimensions are lost." />
                                            </div>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: kernelLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>NumPy computes rank directly; nullity follows from the rank-nullity theorem.</p>
                                <CodeBlock title="rank_nullity.py" runnable code={`import numpy as np

# Rank-1 projection onto the x-axis
M = np.array([[1, 0], [0, 0]], dtype=float)

rank    = np.linalg.matrix_rank(M)
nullity = M.shape[1] - rank

print(f"rank = {rank},  nullity = {nullity}")
print(f"dim(V) = {rank} + {nullity} = {rank + nullity}")

# Vector in ker(M) — maps to zero
v_ker = np.array([0.0, 5.0])
print("M @ ker vector:", M @ v_ker)   # [0. 0.]

# The image is the x-axis
v = np.array([3.0, 7.0])
print("M @ v:", M @ v)                # [3. 0.]`} />
                                <p>The determinant gives a quick rank check for square matrices:</p>
                                <CodeBlock title="determinant.py" runnable code={`import numpy as np

A = np.array([[1, 2], [3, 4]], dtype=float)       # full rank
B = np.array([[1, 2], [2, 4]], dtype=float)       # rank 1

print("det(A):", round(np.linalg.det(A), 4))      # -2.0
print("det(B):", round(np.linalg.det(B), 4))      # 0.0
print("rank(A):", np.linalg.matrix_rank(A))       # 2
print("rank(B):", np.linalg.matrix_rank(B))       # 1`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: compose two transformations"
                                prompt={<>Composing transformations is matrix multiplication. Implement <code>compose(A, B)</code> that returns the matrix representing "apply <code>B</code> first, then <code>A</code>" — i.e. <code>A&nbsp;@&nbsp;B</code> — as a numpy array.</>}
                                starterCode={COMPOSE_EXERCISE.starter}
                                checks={COMPOSE_EXERCISE.checks}
                                solution={COMPOSE_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={KERNEL_QUIZ} title="Check: kernel & image" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 3: Transformers ══ */}
            <Card title="Why it matters: Transformers">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <div>
                                <Intuition>
                                    Every matrix multiply in a transformer — Q, K, V projections, the FFN layers, the output projection — is a linear transformation. Understanding what these maps do geometrically (which dimensions they collapse, which they preserve) is key to interpreting model behaviour.
                                </Intuition>
                                <article className="prose prose-slate" style={{ maxWidth: 'none' }}>
                                    <p>
                                        Linear transformations are the backbone of the transformer architecture. Each attention head applies three separate linear projections to the input embeddings — Query, Key, and Value — then combines results via another linear map.
                                    </p>
                                    <p>
                                        The entire attention formula is a composition of linear transformations:
                                    </p>
                                    <p className="text-center my-4">
                                        <Latex>{'$\\text{Attention}(Q,K,V) = \\text{Softmax}\\!\\left(\\dfrac{QK^T}{\\sqrt{d_k}}\\right)V$'}</Latex>
                                    </p>
                                    <p>
                                        The <strong>rank</strong> of each weight matrix controls the information bottleneck. Techniques like LoRA exploit this by fine-tuning low-rank updates, compressing learning into a small subspace.
                                    </p>
                                </article>
                                <Callout>
                                    <strong>Q, K, V projections</strong> are linear transformations (<Latex>{'$XW_Q, XW_K, XW_V$'}</Latex>) applied to input embeddings. Attention composes these projections, a scaled dot product, and a weighted sum — all grounded in linear algebra. The <strong>rank</strong> of each weight matrix determines the information bottleneck.
                                </Callout>
                            </div>
                        ),
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>A minimal QKV projection and scaled dot-product attention score:</p>
                                <CodeBlock title="qkv_attention.py" runnable code={`import numpy as np

d_model, d_k = 4, 2

# Projection matrices — columns encode where basis vectors go
W_Q = np.random.randn(d_model, d_k)
W_K = np.random.randn(d_model, d_k)
W_V = np.random.randn(d_model, d_k)

x1 = np.random.randn(d_model)   # token embedding 1
x2 = np.random.randn(d_model)   # token embedding 2

# Linear projections (these are linear transformations)
q1, q2 = x1 @ W_Q, x2 @ W_Q
k1, k2 = x1 @ W_K, x2 @ W_K

# Scaled dot-product: how much x1 attends to x2
score = np.dot(q1, k2) / np.sqrt(d_k)
print(f"Attention score (x1 → x2): {score:.3f}")`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: scaled dot-product score"
                                prompt={<>The attention score between query <code>q</code> and key <code>k</code> is their dot product divided by <code>√d_k</code>. Implement <code>attention_score(q, k)</code> returning <code>q·k / √d_k</code> as a float.</>}
                                starterCode={ATTENTION_SCORE_EXERCISE.starter}
                                checks={ATTENTION_SCORE_EXERCISE.checks}
                                solution={ATTENTION_SCORE_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={TRANSFORMER_LT_QUIZ} title="Check: linear transformations in Transformers" />,
                    },
                ]} />
            </Card>

        </div>
    );
}
