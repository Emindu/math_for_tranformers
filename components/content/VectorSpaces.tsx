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
    axiomsViz?: React.ReactNode;
    subspacesViz?: React.ReactNode;
};

const conceptIcon   = <BookOpen size={15} />;
const visualizeIcon = <Shapes   size={15} />;
const codeIcon      = <Code2    size={15} />;
const exerciseIcon  = <Dumbbell size={15} />;
const quizIcon      = <ListChecks size={15} />;

/* ───────────────── Axiom expand-card (local to this lesson) ─────────────── */

function AxiomCard({ n, name, formula, example }: {
    n: number;
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
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent)]">
                    {n}
                </span>
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

/* ───────────────────────── Per-subsection quizzes ───────────────────────── */

const AXIOM_QUIZ: QuizQuestion[] = [
    {
        question: "How many axioms must a set satisfy to be a vector space?",
        options: ["3", "8", "10", "Infinitely many"],
        answer: 2,
        explanation: "Ten axioms in total — eight governing vector addition and two more for scalar multiplication.",
    },
    {
        question: "A vector space must be closed under which operations?",
        options: [
            "Vector addition only",
            "Scalar multiplication only",
            "Both vector addition and scalar multiplication",
            "Neither — closure is optional",
        ],
        answer: 2,
        explanation: "Closure means adding two vectors, or scaling one, always lands back inside the space.",
    },
    {
        question: "The additive identity axiom guarantees a vector $0$ such that:",
        options: [
            "$v + 0 = v$ for every $v$",
            "$v \\cdot 0 = v$",
            "$0$ is the only vector in $V$",
            "$v + v = 0$",
        ],
        answer: 0,
        explanation: "The zero vector leaves every vector unchanged under addition.",
    },
];

const SUBSPACE_QUIZ: QuizQuestion[] = [
    {
        question: "Which condition is NOT required for a subset $W$ to be a subspace?",
        options: [
            "$W$ contains the zero vector",
            "$W$ is closed under addition",
            "$W$ is closed under scalar multiplication",
            "$W$ contains a basis of the whole space",
        ],
        answer: 3,
        explanation: "A subspace only needs the zero vector and closure under addition and scalar multiplication. It need not span the whole space.",
    },
    {
        question: "A set of vectors is linearly independent when:",
        options: [
            "They all have the same length",
            "None can be written as a linear combination of the others",
            "They are mutually orthogonal",
            "Their sum is the zero vector",
        ],
        answer: 1,
        explanation: "Independence means no vector is redundant — none is a linear combination of the rest. Orthogonality is sufficient but not necessary.",
    },
    {
        question: "The dimension of a vector space is:",
        options: [
            "The number of vectors in any basis",
            "The largest entry of any vector",
            "The number of axioms it satisfies",
            "Always infinite",
        ],
        answer: 0,
        explanation: "Every basis of a space has the same size, and that number is the dimension.",
    },
    {
        question: "Is the set $\\{(x, y) \\in \\mathbb{R}^2 : x \\geq 0\\}$ a subspace?",
        options: ["Yes", "No"],
        answer: 1,
        explanation: "No — it isn't closed under scalar multiplication. Multiplying $(1, 0)$ by $-1$ gives $(-1, 0)$, which is outside the set.",
    },
];

const TRANSFORMER_QUIZ: QuizQuestion[] = [
    {
        question: "In a Transformer, the residual connection $x + \\text{Layer}(x)$ is an instance of:",
        options: [
            "Scalar multiplication",
            "Vector addition",
            "The dot product",
            "Matrix inversion",
        ],
        answer: 1,
        explanation: "Adding the input back to the layer output is exactly the vector-addition axiom in action.",
    },
    {
        question: "A token embedding is best described as:",
        options: [
            "A single scalar",
            "A vector in $\\mathbb{R}^d$",
            "A matrix of attention weights",
            "A probability distribution",
        ],
        answer: 1,
        explanation: "Each token is represented as a vector in a $d$-dimensional embedding space.",
    },
];

/* ──────────────────────── Per-subsection exercises ──────────────────────── */

const VECTOR_OPS_EXERCISE = {
    starter: `import numpy as np

def add(u, v):
    # TODO: return the elementwise sum u + v as a numpy array
    pass

def scale(alpha, v):
    # TODO: return alpha * v as a numpy array
    pass
`,
    checks: `_check("add([1,2,3],[4,5,6]) == [5,7,9]",
       lambda: np.allclose(add([1, 2, 3], [4, 5, 6]), [5, 7, 9]))
_check("add returns a numpy array",
       lambda: isinstance(add([1, 2], [3, 4]), np.ndarray))
_check("scale(2, [1,2,3]) == [2,4,6]",
       lambda: np.allclose(scale(2, [1, 2, 3]), [2, 4, 6]))
_check("addition is commutative: add(u,v) == add(v,u)",
       lambda: np.allclose(add([1, 2], [3, 4]), add([3, 4], [1, 2])))
`,
    solution: `import numpy as np

def add(u, v):
    return np.array(u, dtype=float) + np.array(v, dtype=float)

def scale(alpha, v):
    return alpha * np.array(v, dtype=float)
`,
};

const LINEAR_COMB_EXERCISE = {
    starter: `import numpy as np

def linear_combination(coeffs, vectors):
    """Return the linear combination  c0*v0 + c1*v1 + ...

    coeffs:  list of scalars,         e.g. [2, 3]
    vectors: list of equal-length 1-D vectors, e.g. [[1, 0], [0, 1]]
    Return a numpy array (the resulting vector).
    """
    # TODO: build and return the weighted sum as a numpy array
    pass
`,
    checks: `_check("returns a numpy array",
       lambda: isinstance(linear_combination([1, 1], [[1, 0], [0, 1]]), np.ndarray))
_check("2*e1 + 3*e2 == [2, 3]",
       lambda: np.allclose(linear_combination([2, 3], [[1, 0], [0, 1]]), [2, 3]))
_check("standard-basis combo == [1, 2, 3]",
       lambda: np.allclose(
           linear_combination([1, 2, 3], [[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
           [1, 2, 3]))
_check("handles negative and fractional coefficients",
       lambda: np.allclose(linear_combination([-1, 0.5], [[2, 2], [4, 0]]), [0, -2]))
`,
    solution: `import numpy as np

def linear_combination(coeffs, vectors):
    coeffs = np.array(coeffs, dtype=float)
    vectors = np.array(vectors, dtype=float)
    return coeffs @ vectors
`,
};

const RESIDUAL_EXERCISE = {
    starter: `import numpy as np

def residual(x, layer):
    """Apply a residual connection.

    x:     a 1-D numpy array (the input vector)
    layer: a function mapping a vector to a vector of the same shape
    Return  x + layer(x).
    """
    # TODO: implement the residual connection
    pass
`,
    checks: `_check("identity layer doubles the input",
       lambda: np.allclose(residual(np.array([1.0, 2.0]), lambda z: z), [2.0, 4.0]))
_check("zero layer returns x unchanged",
       lambda: np.allclose(residual(np.array([3.0, -1.0]), lambda z: np.zeros_like(z)), [3.0, -1.0]))
_check("output keeps the same shape as x",
       lambda: residual(np.array([1.0, 2.0, 3.0]), lambda z: z * 0.5).shape == (3,))
`,
    solution: `import numpy as np

def residual(x, layer):
    return x + layer(x)
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

export default function VectorSpacesContent({ axiomsViz, subspacesViz }: Props) {
    return (
        <div className="space-y-10">

            {/* ══ Card 1: Vector Spaces ══ */}
            <Card title="1.1.1 Vector Spaces">
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
                                                Think of a vector space as a collection where you can always safely do two things: add any two members together, and stretch or shrink any member by a number. Both operations must keep you inside the same collection — that is the whole idea.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A <strong>vector space</strong> <Latex>$V$</Latex> over a field <Latex>$F$</Latex> (usually <Latex>{'$\\mathbb{R}$'}</Latex> or <Latex>{'$\\mathbb{C}$'}</Latex>) is a set equipped with two operations: <em>vector addition</em> and <em>scalar multiplication</em>. These must satisfy 10 axioms that guarantee the operations behave consistently no matter which specific vectors you pick.
                                                </p>
                                                <p>
                                                    Familiar examples: <Latex>{'$\\mathbb{R}^n$'}</Latex> (column vectors of length <Latex>$n$</Latex>), polynomials up to degree <Latex>$n$</Latex>, continuous functions on <Latex>$[0,1]$</Latex>, sequences of real numbers. Different objects, same 10 axioms.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: '10 Axioms',
                                    content: (
                                        <div>
                                            <p className="mb-3 text-sm text-[var(--muted)]">
                                                Click any axiom to see a concrete example in <Latex>{'$\\mathbb{R}^2$'}</Latex>.
                                            </p>
                                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--faint)]">
                                                Addition — 5 rules
                                            </p>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-4">
                                                <AxiomCard n={1} name="Closure" formula={<Latex>{'$u + v \\in V$'}</Latex>} example="In ℝ²: [1, 2] + [3, 4] = [4, 6], still in ℝ²." />
                                                <AxiomCard n={2} name="Commutativity" formula={<Latex>{'$u + v = v + u$'}</Latex>} example="[1, 2] + [3, 4] = [3, 4] + [1, 2] = [4, 6]. Order doesn't matter." />
                                                <AxiomCard n={3} name="Associativity" formula={<Latex>{'$(u+v)+w = u+(v+w)$'}</Latex>} example="([1,0]+[0,1])+[1,1] = [1,0]+([0,1]+[1,1]) = [2,2]. Grouping doesn't matter." />
                                                <AxiomCard n={4} name="Zero vector" formula={<Latex>{'$v + \\mathbf{0} = v$'}</Latex>} example="[1, 2] + [0, 0] = [1, 2]. The zero vector leaves everything unchanged." />
                                                <AxiomCard n={5} name="Additive inverse" formula={<Latex>{'$v + (-v) = \\mathbf{0}$'}</Latex>} example="[1, 2] + [−1, −2] = [0, 0]. Every vector has an opposite that cancels it." />
                                            </div>
                                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--faint)]">
                                                Scalar multiplication — 5 rules
                                            </p>
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                <AxiomCard n={6} name="Closure" formula={<Latex>{'$\\alpha v \\in V$'}</Latex>} example="3 · [1, 2] = [3, 6], still in ℝ²." />
                                                <AxiomCard n={7} name="Distributivity" formula={<Latex>{'$\\alpha(u+v) = \\alpha u + \\alpha v$'}</Latex>} example="2([1,0]+[0,1]) = 2[1,0]+2[0,1] = [2,2]." />
                                                <AxiomCard n={8} name="Distributivity" formula={<Latex>{'$(\\alpha+\\beta)v = \\alpha v + \\beta v$'}</Latex>} example="(2+3)[1,0] = 2[1,0]+3[1,0] = [5,0]." />
                                                <AxiomCard n={9} name="Associativity" formula={<Latex>{'$\\alpha(\\beta v) = (\\alpha\\beta)v$'}</Latex>} example="2(3[1,0]) = (2·3)[1,0] = [6,0]." />
                                                <AxiomCard n={10} name="Scalar identity" formula={<Latex>{'$1 \\cdot v = v$'}</Latex>} example="1 · [3, 7] = [3, 7]. Multiplying by 1 does nothing." />
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'In Practice',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    <strong><Latex>{'$\\mathbb{R}^2$'}</Latex> passes all 10 checks.</strong> Any two planar vectors sum to another planar vector. Scaling stays planar. The zero vector <Latex>$[0, 0]$</Latex> exists. Every vector <Latex>$[x, y]$</Latex> has an inverse <Latex>$[-x, -y]$</Latex>. And so on.
                                                </p>
                                                <h3>A counter-example: what fails?</h3>
                                                <p>
                                                    The set <Latex>{'$\\{(x, y) : x \\geq 0\\}$'}</Latex> (the right half-plane) is <em>not</em> a vector space. It fails axiom 6: multiplying <Latex>$[1, 2]$</Latex> by <Latex>$-1$</Latex> gives <Latex>$[-1, -2]$</Latex>, which is outside the set.
                                                </p>
                                                <p>
                                                    This is why the axioms matter — they rule out sets that look vector-like but collapse under one operation.
                                                </p>
                                            </Reading>
                                            <Callout>
                                                In transformers, token embeddings live in <strong><Latex>{'$\\mathbb{R}^d$'}</Latex></strong> — the canonical vector space. Every embedding satisfies all 10 axioms, which is why operations like attention and residual connections are mathematically well-defined.
                                            </Callout>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: axiomsViz,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>
                                    A vector in <Latex>{'$\\mathbb{R}^n$'}</Latex> is just a 1-D array. Addition and scalar
                                    multiplication are element-wise, and the axioms can be checked numerically.
                                </p>
                                <CodeBlock title="vectors_and_axioms.py" runnable code={`import numpy as np

# Vectors live in R^n — here, R^3
u = np.array([1.0, 2.0, 3.0])
v = np.array([4.0, 5.0, 6.0])
alpha = 2.0

# Closure: adding or scaling stays in R^3
print(u + v)        # [5. 7. 9.]
print(alpha * u)    # [2. 4. 6.]

# A few axioms, verified numerically
assert np.allclose(u + v, v + u)                          # commutativity
assert np.allclose(alpha * (u + v), alpha*u + alpha*v)    # distributivity
assert np.allclose(u + np.zeros(3), u)                    # additive identity
print("all axioms hold")`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: the two core operations"
                                prompt={<>Every vector space is built on two operations. Implement <code>add(u, v)</code> (elementwise sum) and <code>scale(alpha, v)</code> (scalar multiple), each returning a numpy array.</>}
                                starterCode={VECTOR_OPS_EXERCISE.starter}
                                checks={VECTOR_OPS_EXERCISE.checks}
                                solution={VECTOR_OPS_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={AXIOM_QUIZ} title="Check: vector spaces & axioms" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 2: Subspaces and Bases ══ */}
            <Card title="Subspaces and Bases">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Subspaces',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A subspace is a vector space nested inside another one — like a line or plane through the origin sitting inside <Latex>{'$\\mathbb{R}^3$'}</Latex>. The key phrase is "through the origin": a plane that misses the origin has no zero vector, so it fails immediately.
                                            </Intuition>
                                            <p className="mb-3 text-sm text-[var(--muted)]">
                                                A subset <Latex>{'$W \\subseteq V$'}</Latex> is a subspace when all three hold — click each to see why it matters:
                                            </p>
                                            <div className="grid gap-2">
                                                <AxiomCard n={1} name="Contains the zero vector" formula={<Latex>{'$\\mathbf{0} \\in W$'}</Latex>} example="The xy-plane in ℝ³ contains [0,0,0]. A plane like z = 1 does not — immediate fail." />
                                                <AxiomCard n={2} name="Closed under addition" formula={<Latex>{'$u, v \\in W \\Rightarrow u + v \\in W$'}</Latex>} example="Two vectors with z = 0 always sum to another with z = 0. The xy-plane passes." />
                                                <AxiomCard n={3} name="Closed under scalar mult." formula={<Latex>{'$v \\in W \\Rightarrow \\alpha v \\in W$'}</Latex>} example="Scaling [1, 2, 0] by any α gives [α, 2α, 0], which still has z = 0. The xy-plane passes." />
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Span & Independence',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Span is everything you can reach by mixing vectors. Linear independence means each vector in a set contributes something genuinely new — none is a scaled copy or sum of the others.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The <strong>span</strong> of <Latex>{'$\\{v_1, \\ldots, v_k\\}$'}</Latex> is all vectors reachable by linear combination: <Latex>{'$\\alpha_1 v_1 + \\cdots + \\alpha_k v_k$'}</Latex>. It is always a subspace.
                                                </p>
                                                <p>
                                                    A set is <strong>linearly independent</strong> if the only solution to <Latex>{'$\\alpha_1 v_1 + \\cdots + \\alpha_k v_k = \\mathbf{0}$'}</Latex> is <Latex>{'$\\alpha_1 = \\cdots = \\alpha_k = 0$'}</Latex>.
                                                </p>
                                                <p>
                                                    In <Latex>{'$\\mathbb{R}^2$'}</Latex>, the vectors <Latex>$[1,0]$</Latex> and <Latex>$[1,1]$</Latex> are independent — neither is a multiple of the other. But <Latex>$[1,0], [0,1], [1,1]$</Latex> are <em>dependent</em>: <Latex>$[1,1] = [1,0]+[0,1]$</Latex>, so the third is redundant.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Basis & Dimension',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A basis is the leanest set that can describe every vector in the space — no redundancy, no gaps. Dimension is simply how many vectors are in any such minimal set. Every basis has the same size.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A <strong>basis</strong> for <Latex>$V$</Latex> is a linearly independent set that spans <Latex>$V$</Latex>. The number of vectors in any basis is always the same — that number is the <strong>dimension</strong> of <Latex>$V$</Latex>.
                                                </p>
                                                <p>
                                                    Standard basis for <Latex>{'$\\mathbb{R}^3$'}</Latex>: <Latex>{'$e_1 = [1,0,0]$'}</Latex>, <Latex>{'$e_2 = [0,1,0]$'}</Latex>, <Latex>{'$e_3 = [0,0,1]$'}</Latex>. Any vector <Latex>$[x,y,z]$</Latex> = <Latex>{'$xe_1 + ye_2 + ze_3$'}</Latex> uniquely. Dimension = 3.
                                                </p>
                                            </Reading>
                                            <Callout>
                                                Transformers use embedding spaces of dimension <strong>d<sub>model</sub> ≈ 512–4 096</strong>. Each dimension is an independent direction of meaning. Adding more dimensions gives the model richer representations — but attention cost scales quadratically, so the choice is a direct engineering trade-off.
                                            </Callout>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: subspacesViz,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>A subspace must contain the zero vector and be closed under addition and scalar multiplication. The <Latex>$xy$</Latex>-plane inside <Latex>{'$\\mathbb{R}^3$'}</Latex> is a classic example.</p>
                                <CodeBlock title="subspaces.py" runnable code={`import numpy as np

# The xy-plane is a subspace of R^3: { (x, y, 0) }
def in_xy_plane(w):
    return np.isclose(w[2], 0.0)

a = np.array([1.0, -2.0, 0.0])
b = np.array([3.0,  4.0, 0.0])

assert in_xy_plane(a + b)        # closed under addition
assert in_xy_plane(5.0 * a)      # closed under scaling
assert in_xy_plane(np.zeros(3))  # contains the zero vector
print("xy-plane is a subspace")`} />
                                <p>Stack vectors as columns; <code>rank</code> tells you how many are independent.</p>
                                <CodeBlock title="independence.py" runnable code={`import numpy as np

v1 = np.array([1.0, 0.0, 0.0])
v2 = np.array([0.0, 1.0, 0.0])
v3 = np.array([1.0, 1.0, 0.0])   # v3 = v1 + v2

M = np.column_stack([v1, v2, v3])
rank = np.linalg.matrix_rank(M)

print(rank)                       # 2
print("independent?", rank == M.shape[1])   # False`} />
                                <CodeBlock title="basis_and_dimension.py" runnable code={`import numpy as np

# Standard basis for R^3
basis = np.eye(3)                       # columns e1, e2, e3
print(np.linalg.matrix_rank(basis))     # 3

# Coordinates of x in this basis: solve  basis @ c = x
x = np.array([2.0, -1.0, 4.0])
coords = np.linalg.solve(basis, x)
print(coords)                           # [ 2. -1.  4.]`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: linear combinations"
                                prompt={<>A linear combination <code>c₀·v₀ + c₁·v₁ + …</code> is the core operation behind span and bases. Implement <code>linear_combination(coeffs, vectors)</code> so it returns the weighted sum as a numpy array.</>}
                                starterCode={LINEAR_COMB_EXERCISE.starter}
                                checks={LINEAR_COMB_EXERCISE.checks}
                                solution={LINEAR_COMB_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={SUBSPACE_QUIZ} title="Check: subspaces & bases" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 3: Transformers ══ */}
            <Card title="Why it matters: vectors in Transformers">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <div>
                                <Intuition>
                                    Every token a transformer touches is a vector. Every layer output is a vector. Every learned weight moves those vectors around the same high-dimensional space. The 10 axioms are the guarantee that all this arithmetic is consistent.
                                </Intuition>
                                <article className="prose prose-slate" style={{ maxWidth: 'none' }}>
                                    <p>
                                        A token embedding is a vector in <Latex>{'$\\mathbb{R}^d$'}</Latex>, and a residual connection is literally vector addition — the same axioms at work. Understanding subspaces and bases is what makes it possible to reason about <em>which directions</em> in embedding space encode meaning, and why projecting into a lower-dimensional subspace (as in multi-head attention) is a well-defined operation.
                                    </p>
                                </article>
                                <Callout>
                                    Transformers process data (words, image patches) as <strong>vectors</strong> in a high-dimensional space (<Latex>{"$d_{\\text{model}} \\approx 512+$"}</Latex>). Operations like <em>Attention</em> rely on vector arithmetic (dot products, weighted sums) grounded in these 10 axioms. The <strong>Residual Connection</strong> (<Latex>{"$x + \\text{Layer}(x)$"}</Latex>) is a direct application of vector addition.
                                </Callout>
                            </div>
                        ),
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>The residual connection adds a layer&apos;s output back to its input — vector addition keeping the result in the same space <Latex>{'$\\mathbb{R}^d$'}</Latex>.</p>
                                <CodeBlock title="transformer_vectors.py" runnable code={`import numpy as np

d_model = 8
x = np.random.randn(d_model)   # a token embedding in R^d

def layer(z):
    W = np.random.randn(d_model, d_model) * 0.1
    return np.tanh(z @ W)

# Residual connection: x + Layer(x) stays in the same vector space
y = x + layer(x)
print(y.shape)                 # (8,)`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: residual connection"
                                prompt={<>The residual connection is just vector addition. Implement <code>residual(x, layer)</code> so it returns <code>x + layer(x)</code>, keeping the result in the same space.</>}
                                starterCode={RESIDUAL_EXERCISE.starter}
                                checks={RESIDUAL_EXERCISE.checks}
                                solution={RESIDUAL_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={TRANSFORMER_QUIZ} title="Check: vectors in Transformers" />,
                    },
                ]} />
            </Card>
        </div>
    );
}
