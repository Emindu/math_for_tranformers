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

/* ─── Layout helpers ─────────────────────────────────────────────────────── */

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

/* ─── Tab icons ──────────────────────────────────────────────────────────── */

const conceptIcon  = <BookOpen   size={14} />;
const vizIcon      = <Shapes     size={14} />;
const codeIcon     = <Code2      size={14} />;
const exerciseIcon = <Dumbbell   size={14} />;
const quizIcon     = <ListChecks size={14} />;

/* ─── Quiz data ──────────────────────────────────────────────────────────── */

const DEF_QUIZ: QuizQuestion[] = [
    {
        question: "Which property distinguishes a closed ball from an open ball?",
        options: [
            "Closed has a larger radius",
            "Closed includes the boundary",
            "Closed has more interior points",
            "Closed is always bounded",
        ],
        answer: 1,
        explanation:
            "A closed ball B̄(x,r) includes all points at distance ≤ r, including the boundary sphere. An open ball B(x,r) only includes points at distance strictly < r.",
    },
    {
        question: "A sequence xₙ = 1/n in ℝ. For ε = 0.01, what is the smallest N such that all xₙ with n > N satisfy |xₙ - 0| < ε?",
        options: ["N = 10", "N = 50", "N = 100", "N = 1000"],
        answer: 2,
        explanation:
            "We need 1/n < 0.01, so n > 100. The smallest such N is 100 (since x₁₀₁ = 1/101 < 0.01).",
    },
];

const TOPO_QUIZ: QuizQuestion[] = [
    {
        question: "Which correctly describes an open set U in a metric space?",
        options: [
            "Contains the boundary of every ball",
            "Every point has a neighborhood entirely inside U",
            "Is always bounded",
            "Contains all its limit points",
        ],
        answer: 1,
        explanation:
            "A set U is open if every point x ∈ U has some ε > 0 such that the entire ball B(x,ε) ⊆ U — every interior point has breathing room.",
    },
    {
        question: "According to Heine-Borel, which subset of ℝ² is compact?",
        options: [
            "{(x,y): x²+y² < 1}",
            "{(x,y): x²+y² ≤ 1}",
            "All of ℝ²",
            "{(x,y): x > 0}",
        ],
        answer: 1,
        explanation:
            "By Heine-Borel, a subset of ℝⁿ is compact iff it is closed AND bounded. The closed unit disk {x²+y²≤1} is both; the open disk excludes its boundary so is not closed.",
    },
];

const MAP_QUIZ: QuizQuestion[] = [
    {
        question: "A function f(x) = 0.7x + 2 is iterated from x₀ = 0. Where does the sequence converge?",
        options: ["x* = 2", "x* = 20/3 ≈ 6.667", "Diverges", "x* = 0.7"],
        answer: 1,
        explanation:
            "Fixed point: x* = 0.7x* + 2 → 0.3x* = 2 → x* = 20/3 ≈ 6.667. Since c = 0.7 < 1 it's a contraction, so Banach guarantees convergence.",
    },
    {
        question: "What conditions does the Banach Fixed-Point Theorem require?",
        options: [
            "f must be differentiable",
            "The space must be complete and f must be a contraction",
            "The fixed point must be known in advance",
            "f must be linear",
        ],
        answer: 1,
        explanation:
            "Banach's theorem needs: (1) a complete metric space — every Cauchy sequence converges; and (2) f is a contraction — d(f(x),f(y)) ≤ c·d(x,y) for some c < 1.",
    },
];

/* ═══════════════════════════════════════════════════════════════════════════
   1. DefinitionContent
   ═══════════════════════════════════════════════════════════════════════════ */

export function DefinitionContent({
    metricLab,
    convergenceLab,
}: {
    metricLab: React.ReactNode;
    convergenceLab: React.ReactNode;
}) {
    return (
        <div className="space-y-10">
            <Card title="1.3.1 · Metric Space Definition">
                <Tabs
                    tabs={[
                        {
                            id: 'concept',
                            label: 'Concept',
                            icon: conceptIcon,
                            content: (
                                <ConceptStepper
                                    steps={[
                                        {
                                            label: 'What is a Metric?',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        A metric formalizes distance. Once you have d(x,y), you automatically get
                                                        convergence, continuity, and all of analysis — for free.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A <strong>metric space</strong> is a pair{' '}
                                                            <Latex>{'$(X, d)$'}</Latex> where{' '}
                                                            <Latex>{'$X$'}</Latex> is a set and{' '}
                                                            <Latex>{'$d : X \\times X \\to \\mathbb{R}_{\\geq 0}$'}</Latex>{' '}
                                                            satisfies four axioms for all{' '}
                                                            <Latex>{'$x, y, z \\in X$'}</Latex>:
                                                        </p>
                                                        <ol>
                                                            <li>
                                                                <strong>Non-negativity:</strong>{' '}
                                                                <Latex>{'$d(x,y) \\geq 0$'}</Latex>
                                                            </li>
                                                            <li>
                                                                <strong>Identity:</strong>{' '}
                                                                <Latex>{'$d(x,y) = 0 \\iff x = y$'}</Latex>
                                                            </li>
                                                            <li>
                                                                <strong>Symmetry:</strong>{' '}
                                                                <Latex>{'$d(x,y) = d(y,x)$'}</Latex>
                                                            </li>
                                                            <li>
                                                                <strong>Triangle inequality:</strong>{' '}
                                                                <Latex>{'$d(x,z) \\leq d(x,y) + d(y,z)$'}</Latex>
                                                            </li>
                                                        </ol>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Common Metrics',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        Different metrics see the world differently — Manhattan counts city blocks,
                                                        cosine ignores length and only cares about angle.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            For vectors{' '}
                                                            <Latex>{'$x, y \\in \\mathbb{R}^n$'}</Latex>:
                                                        </p>
                                                        <ul>
                                                            <li>
                                                                <strong>Euclidean (L²):</strong>{' '}
                                                                <Latex>{'$d(x,y) = \\sqrt{\\sum_i (x_i - y_i)^2}$'}</Latex>{' '}
                                                                — unit ball is a circle/sphere
                                                            </li>
                                                            <li>
                                                                <strong>Manhattan (L¹):</strong>{' '}
                                                                <Latex>{'$d(x,y) = \\sum_i |x_i - y_i|$'}</Latex>{' '}
                                                                — unit ball is a diamond
                                                            </li>
                                                            <li>
                                                                <strong>Chebyshev (L∞):</strong>{' '}
                                                                <Latex>{'$d(x,y) = \\max_i |x_i - y_i|$'}</Latex>{' '}
                                                                — unit ball is a square
                                                            </li>
                                                            <li>
                                                                <strong>Cosine:</strong>{' '}
                                                                <Latex>{'$d(x,y) = 1 - \\frac{x \\cdot y}{\\|x\\|\\|y\\|}$'}</Latex>{' '}
                                                                — measures angular separation
                                                            </li>
                                                        </ul>
                                                        <p>
                                                            In NLP, cosine distance is preferred because word embeddings&apos;{' '}
                                                            <em>direction</em> encodes meaning, not magnitude.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Convergence & Completeness',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        Completeness is a guarantee: if a sequence&apos;s terms get arbitrarily close
                                                        to each other, there must be a limit point <em>inside</em> the space.
                                                        The rationals ℚ fail this — sequences there can converge &quot;toward&quot; √2,
                                                        which isn&apos;t rational.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A sequence <Latex>{'$(x_n)$'}</Latex> <strong>converges</strong> to{' '}
                                                            <Latex>{'$L$'}</Latex> if{' '}
                                                            <Latex>{'$\\forall \\varepsilon > 0\\; \\exists N: n > N \\Rightarrow d(x_n, L) < \\varepsilon$'}</Latex>.
                                                        </p>
                                                        <p>
                                                            A <strong>Cauchy sequence</strong> has{' '}
                                                            <Latex>{'$d(x_m, x_n) \\to 0$'}</Latex> as{' '}
                                                            <Latex>{'$m, n \\to \\infty$'}</Latex>.
                                                        </p>
                                                        <p>
                                                            A metric space is <strong>complete</strong> if every Cauchy sequence converges
                                                            to a point in <Latex>{'$X$'}</Latex>. <Latex>{'$\\mathbb{R}$'}</Latex> is
                                                            complete; <Latex>{'$\\mathbb{Q}$'}</Latex> is not.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            ),
                        },
                        {
                            id: 'visualize',
                            label: 'Visualize',
                            icon: vizIcon,
                            content: (
                                <div className="flex flex-col gap-6">
                                    {metricLab}
                                    {convergenceLab}
                                </div>
                            ),
                        },
                        {
                            id: 'code',
                            label: 'Code',
                            icon: codeIcon,
                            content: (
                                <CodeBlock
                                    title="metrics.py"
                                    runnable
                                    language="python"
                                    code={`import numpy as np

def euclidean(x, y): return np.sqrt(np.sum((x - y)**2))
def manhattan(x, y): return np.sum(np.abs(x - y))
def chebyshev(x, y): return np.max(np.abs(x - y))
def cosine_dist(x, y):
    return 1 - np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

a = np.array([3.0, 4.0])
b = np.array([0.0, 0.0])

for name, fn in [("Euclidean", euclidean), ("Manhattan", manhattan),
                 ("Chebyshev", chebyshev), ("Cosine", cosine_dist)]:
    print(f"{name:12}: {fn(a, b):.4f}")

# Verify triangle inequality for random points
np.random.seed(42)
x, y, z = np.random.randn(3, 5)
dxy, dyz, dxz = euclidean(x, y), euclidean(y, z), euclidean(x, z)
print(f"\\nd(x,z) = {dxz:.4f} <= d(x,y) + d(y,z) = {dxy+dyz:.4f}: {dxz <= dxy + dyz + 1e-9}")`}
                                />
                            ),
                        },
                        {
                            id: 'exercise',
                            label: 'Exercise',
                            icon: exerciseIcon,
                            content: (
                                <CodingExercise
                                    bare
                                    title="Verify Metric Axioms"
                                    prompt={
                                        <>
                                            Implement all 4 metric axioms as checks and verify them for the Euclidean
                                            metric on 3 random points in ℝ⁴.
                                        </>
                                    }
                                    starterCode={`import numpy as np

def euclidean(x, y):
    return np.sqrt(np.sum((x - y)**2))

def verify_metric_axioms(d, points):
    """
    Verify the 4 metric axioms for function d on a list of points.
    Returns a dict of {axiom: True/False}.
    """
    x, y, z = points
    results = {}
    # TODO: check non-negativity d(x,y) >= 0
    # TODO: check identity d(x,y)==0 iff x==y
    # TODO: check symmetry d(x,y)==d(y,x)
    # TODO: check triangle inequality d(x,z) <= d(x,y) + d(y,z)
    return results

np.random.seed(0)
pts = [np.random.randn(4) for _ in range(3)]
results = verify_metric_axioms(euclidean, pts)
for axiom, ok in results.items():
    print(f"{axiom}: {'OK' if ok else 'FAIL'}")`}
                                    checks={`_check("returns a dict", lambda: isinstance(verify_metric_axioms(euclidean, pts), dict))
r = verify_metric_axioms(euclidean, pts)
_check("non-negativity check present", lambda: "Non-negativity" in r)
_check("non-negativity is True", lambda: r.get("Non-negativity") == True)
_check("symmetry is True", lambda: r.get("Symmetry") == True)
_check("triangle inequality is True", lambda: r.get("Triangle inequality") == True)`}
                                    solution={`import numpy as np

def euclidean(x, y):
    return np.sqrt(np.sum((x - y)**2))

def verify_metric_axioms(d, points):
    x, y, z = points
    results = {}
    dxy = d(x, y); dyx = d(y, x); dxz = d(x, z); dyz = d(y, z)
    dxx = d(x, x)
    results["Non-negativity"] = dxy >= 0 and dxz >= 0 and dyz >= 0
    results["Identity"] = dxx < 1e-10 and dxy > 1e-10
    results["Symmetry"] = abs(dxy - dyx) < 1e-10
    results["Triangle inequality"] = dxz <= dxy + dyz + 1e-9
    return results

np.random.seed(0)
pts = [np.random.randn(4) for _ in range(3)]
results = verify_metric_axioms(euclidean, pts)
for axiom, ok in results.items():
    print(f"{axiom}: {'OK' if ok else 'FAIL'}")`}
                                />
                            ),
                        },
                        {
                            id: 'quiz',
                            label: 'Quiz',
                            icon: quizIcon,
                            content: <Quiz bare questions={DEF_QUIZ} title="Check: Metric Spaces" />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. TopologyContent
   ═══════════════════════════════════════════════════════════════════════════ */

export function TopologyContent({ topologyLab }: { topologyLab: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.3.2 · Topology of Metric Spaces">
                <Tabs
                    tabs={[
                        {
                            id: 'concept',
                            label: 'Concept',
                            icon: conceptIcon,
                            content: (
                                <ConceptStepper
                                    steps={[
                                        {
                                            label: 'Open & Closed Sets',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        Open sets are the &quot;breathing room&quot; of mathematics: every point inside
                                                        an open set can wiggle a little and still stay inside. Closed sets are
                                                        their complement — they contain their own edges.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A set <Latex>{'$U \\subseteq X$'}</Latex> is <strong>open</strong> if
                                                            every point has a small ball that fits entirely inside it:
                                                        </p>
                                                        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                            <Latex>{'$\\forall\\, x \\in U,\\; \\exists\\, \\varepsilon > 0 : B(x, \\varepsilon) \\subseteq U$'}</Latex>
                                                        </div>
                                                        <p>
                                                            A set <Latex>{'$C$'}</Latex> is <strong>closed</strong> if its complement is open,
                                                            equivalently if it contains all its limit points. The open ball{' '}
                                                            <Latex>{'$B(x,r) = \\{y : d(x,y) < r\\}$'}</Latex> excludes the
                                                            boundary; the closed ball{' '}
                                                            <Latex>{'$\\bar{B}(x,r) = \\{y : d(x,y) \\leq r\\}$'}</Latex>{' '}
                                                            includes it.
                                                        </p>
                                                        <p>
                                                            Open sets obey three axioms: arbitrary unions of open sets are open;
                                                            finite intersections of open sets are open; and both{' '}
                                                            <Latex>{'$\\varnothing$'}</Latex> and <Latex>{'$X$'}</Latex> are open.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Continuity',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        Continuity means &quot;no jumps&quot;. Formally: for any desired output precision
                                                        ε, you can find an input tolerance δ such that inputs within δ of x₀
                                                        map to outputs within ε of f(x₀).
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A function{' '}
                                                            <Latex>{'$f : (X, d_X) \\to (Y, d_Y)$'}</Latex> is{' '}
                                                            <strong>continuous</strong> at <Latex>{'$x_0$'}</Latex> if:
                                                        </p>
                                                        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                            <Latex>{'$\\forall\\, \\varepsilon > 0\\; \\exists\\, \\delta > 0 : d_X(x, x_0) < \\delta \\Rightarrow d_Y(f(x), f(x_0)) < \\varepsilon$'}</Latex>
                                                        </div>
                                                        <p>
                                                            The topological characterization is more elegant: <Latex>{'$f$'}</Latex> is
                                                            continuous if and only if the preimage of every open set in{' '}
                                                            <Latex>{'$Y$'}</Latex> is open in <Latex>{'$X$'}</Latex>.
                                                        </p>
                                                        <p>
                                                            In ML, continuity of loss functions with respect to parameters is what
                                                            makes gradient descent meaningful — small parameter changes lead to small
                                                            loss changes.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Compactness & Heine-Borel',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        A compact set is &quot;finite in spirit&quot; even if it contains infinitely many
                                                        points. Every sequence in it has a convergent subsequence — you can never
                                                        escape to infinity.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A subset <Latex>{'$K \\subseteq X$'}</Latex> is <strong>compact</strong> if
                                                            every open cover has a finite subcover. In{' '}
                                                            <Latex>{'$\\mathbb{R}^n$'}</Latex>, the{' '}
                                                            <strong>Heine-Borel theorem</strong> gives a clean characterization:
                                                        </p>
                                                        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                            <Latex>{'$K \\subseteq \\mathbb{R}^n \\text{ compact} \\iff K \\text{ is closed and bounded}$'}</Latex>
                                                        </div>
                                                        <p>Compact sets guarantee two fundamental results:</p>
                                                        <ul>
                                                            <li>
                                                                <strong>Bolzano-Weierstrass:</strong> every sequence in{' '}
                                                                <Latex>{'$K$'}</Latex> has a convergent subsequence.
                                                            </li>
                                                            <li>
                                                                <strong>Extreme Value Theorem:</strong> any continuous{' '}
                                                                <Latex>{'$f : K \\to \\mathbb{R}$'}</Latex> attains its max and min on{' '}
                                                                <Latex>{'$K$'}</Latex>.
                                                            </li>
                                                        </ul>
                                                        <p>
                                                            In optimization, working over compact parameter sets guarantees that a
                                                            minimum actually exists — critical for certifying neural network training.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            ),
                        },
                        {
                            id: 'visualize',
                            label: 'Visualize',
                            icon: vizIcon,
                            content: topologyLab,
                        },
                        {
                            id: 'code',
                            label: 'Code',
                            icon: codeIcon,
                            content: (
                                <CodeBlock
                                    title="topology.py"
                                    runnable
                                    language="python"
                                    code={`import numpy as np

# ε-δ continuity check for f : R → R
def check_continuity(f, x0, epsilon, n_samples=1000):
    """
    Find the largest delta such that |x - x0| < delta => |f(x) - f(x0)| < epsilon.
    Uses a grid search over candidate deltas.
    """
    fx0 = f(x0)
    # Try deltas from small to large
    for delta_exp in np.linspace(-4, 1, 200):
        delta = 10 ** delta_exp
        # Sample points near x0
        xs = x0 + np.random.uniform(-delta, delta, n_samples)
        fxs = np.array([f(x) for x in xs])
        # Check that all satisfy |f(x) - f(x0)| < epsilon
        if np.all(np.abs(fxs - fx0) < epsilon):
            continue
        else:
            # Return the previous (working) delta
            prev_delta = 10 ** (delta_exp - (1/200)*5)
            return prev_delta
    return 10.0  # large delta works

np.random.seed(42)
f_cont = lambda x: 0.5 * x + 1   # continuous
f_disc = lambda x: np.where(x < 0, 0.0, 1.0)  # step function (discontinuous at 0)

x0, eps = 1.0, 0.5
print(f"Continuous f at x=1:  delta ≈ {check_continuity(f_cont, x0, eps):.4f}")
print(f"Discontinuous f at 0: delta ≈ {check_continuity(f_disc, 0.0, 0.1):.4f}")`}
                                />
                            ),
                        },
                        {
                            id: 'exercise',
                            label: 'Exercise',
                            icon: exerciseIcon,
                            content: (
                                <CodingExercise
                                    bare
                                    title="Find Delta for Linear Function"
                                    prompt={
                                        <>
                                            For a linear function <Latex>{'$f(x) = mx + b$'}</Latex>, the ε-δ relationship is
                                            exact: <Latex>{'$\\delta = \\varepsilon / |m|$'}</Latex>. Implement a function that
                                            computes the required δ given ε and the slope m.
                                        </>
                                    }
                                    starterCode={`import numpy as np

def delta_for_linear(m, epsilon):
    """
    Given slope m (non-zero) and epsilon > 0,
    return the largest delta satisfying the epsilon-delta definition
    for f(x) = m*x + b (b cancels out).
    """
    # TODO: return epsilon / |m|
    pass

# Test cases
print(f"m=2, eps=1.0: delta = {delta_for_linear(2, 1.0)}")
print(f"m=0.5, eps=0.1: delta = {delta_for_linear(0.5, 0.1)}")
print(f"m=-3, eps=0.3: delta = {delta_for_linear(-3, 0.3)}")`}
                                    checks={`_check("m=2, eps=1 => delta=0.5", lambda: abs(delta_for_linear(2, 1.0) - 0.5) < 1e-9)
_check("m=0.5, eps=0.1 => delta=0.2", lambda: abs(delta_for_linear(0.5, 0.1) - 0.2) < 1e-9)
_check("m=-3, eps=0.3 => delta=0.1", lambda: abs(delta_for_linear(-3, 0.3) - 0.1) < 1e-9)`}
                                    solution={`import numpy as np

def delta_for_linear(m, epsilon):
    return epsilon / abs(m)

print(f"m=2, eps=1.0: delta = {delta_for_linear(2, 1.0)}")
print(f"m=0.5, eps=0.1: delta = {delta_for_linear(0.5, 0.1)}")
print(f"m=-3, eps=0.3: delta = {delta_for_linear(-3, 0.3)}")`}
                                />
                            ),
                        },
                        {
                            id: 'quiz',
                            label: 'Quiz',
                            icon: quizIcon,
                            content: <Quiz bare questions={TOPO_QUIZ} title="Check: Topology" />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. MappingsContent
   ═══════════════════════════════════════════════════════════════════════════ */

export function MappingsContent({
    contractionLab,
    preservationLab,
}: {
    contractionLab: React.ReactNode;
    preservationLab: React.ReactNode;
}) {
    return (
        <div className="space-y-10">
            <Card title="1.3.3 · Mappings Between Metric Spaces">
                <Tabs
                    tabs={[
                        {
                            id: 'concept',
                            label: 'Concept',
                            icon: conceptIcon,
                            content: (
                                <ConceptStepper
                                    steps={[
                                        {
                                            label: 'Isometries',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        An isometry is the ultimate distance-preserving map. Rotations,
                                                        reflections, and translations in ℝ² are all isometries — they move
                                                        points around but never stretch or shrink distances.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A map <Latex>{'$f : (X, d_X) \\to (Y, d_Y)$'}</Latex> is an{' '}
                                                            <strong>isometry</strong> if it preserves all distances:
                                                        </p>
                                                        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                            <Latex>{'$d_Y(f(x_1), f(x_2)) = d_X(x_1, x_2) \\quad \\forall\\, x_1, x_2 \\in X$'}</Latex>
                                                        </div>
                                                        <p>
                                                            Isometries are automatically injective (one-to-one) because{' '}
                                                            <Latex>{'$f(x_1) = f(x_2)$'}</Latex> implies{' '}
                                                            <Latex>{'$d_X(x_1, x_2) = 0$'}</Latex>, hence{' '}
                                                            <Latex>{'$x_1 = x_2$'}</Latex>.
                                                        </p>
                                                        <p>
                                                            In neural networks, layers that act as near-isometries (like orthogonal
                                                            weight matrices) avoid information loss and vanishing gradients — preserving
                                                            the geometric structure of the input.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Contraction Mappings',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        A contraction is a map that brings points closer together on every
                                                        application. Iterate it repeatedly and all starting points funnel
                                                        toward the same fixed destination.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            A map <Latex>{'$f : X \\to X$'}</Latex> is a{' '}
                                                            <strong>contraction</strong> if there exists{' '}
                                                            <Latex>{'$0 \\leq c < 1$'}</Latex> such that:
                                                        </p>
                                                        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                            <Latex>{'$d(f(x_1), f(x_2)) \\leq c \\cdot d(x_1, x_2) \\quad \\forall\\, x_1, x_2 \\in X$'}</Latex>
                                                        </div>
                                                        <p>
                                                            The constant <Latex>{'$c$'}</Latex> is the <strong>Lipschitz constant</strong>.
                                                            For <Latex>{'$c < 1$'}</Latex> (contraction), every iteration reduces
                                                            distance by at least a factor of <Latex>{'$c$'}</Latex>:
                                                        </p>
                                                        <ul>
                                                            <li>
                                                                <strong>c &lt; 1</strong> — contraction: distances shrink, unique fixed point guaranteed
                                                            </li>
                                                            <li>
                                                                <strong>c = 1</strong> — isometry: distances preserved, no guaranteed fixed point
                                                            </li>
                                                            <li>
                                                                <strong>c &gt; 1</strong> — expansion: distances grow, iterations diverge
                                                            </li>
                                                        </ul>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: 'Banach Fixed-Point Theorem',
                                            content: (
                                                <div>
                                                    <Intuition>
                                                        The Banach theorem is a convergence guarantee machine: given a complete
                                                        space and a contraction, you always find the unique fixed point — no
                                                        matter where you start. This is the mathematical engine behind iterative
                                                        solvers and many optimization algorithms.
                                                    </Intuition>
                                                    <Reading>
                                                        <p>
                                                            <strong>Theorem (Banach, 1922).</strong> Let{' '}
                                                            <Latex>{'$(X, d)$'}</Latex> be a <em>complete</em> metric space and{' '}
                                                            <Latex>{'$f : X \\to X$'}</Latex> a contraction with constant{' '}
                                                            <Latex>{'$c < 1$'}</Latex>. Then:
                                                        </p>
                                                        <ol>
                                                            <li>
                                                                <Latex>{'$f$'}</Latex> has a <strong>unique fixed point</strong>{' '}
                                                                <Latex>{'$x^* \\in X$'}</Latex> with{' '}
                                                                <Latex>{'$f(x^*) = x^*$'}</Latex>.
                                                            </li>
                                                            <li>
                                                                For any <Latex>{'$x_0 \\in X$'}</Latex>, the sequence{' '}
                                                                <Latex>{'$x_{n+1} = f(x_n)$'}</Latex> converges to{' '}
                                                                <Latex>{'$x^*$'}</Latex>.
                                                            </li>
                                                            <li>
                                                                Error bound:{' '}
                                                                <Latex>{'$d(x_n, x^*) \\leq \\frac{c^n}{1-c} d(x_0, x_1)$'}</Latex>.
                                                            </li>
                                                        </ol>
                                                        <p>
                                                            In ML, if a gradient-descent update rule is a contraction on parameter
                                                            space, Banach guarantees convergence to a unique optimum — providing the
                                                            rigorous foundation for why iterative training works.
                                                        </p>
                                                    </Reading>
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            ),
                        },
                        {
                            id: 'visualize',
                            label: 'Visualize',
                            icon: vizIcon,
                            content: (
                                <div className="flex flex-col gap-6">
                                    {contractionLab}
                                    {preservationLab}
                                </div>
                            ),
                        },
                        {
                            id: 'code',
                            label: 'Code',
                            icon: codeIcon,
                            content: (
                                <CodeBlock
                                    title="banach.py"
                                    runnable
                                    language="python"
                                    code={`import numpy as np

def banach_iterate(f, x0, tol=1e-8, max_iter=200):
    """
    Apply Banach fixed-point iteration: x_{n+1} = f(x_n).
    Returns (fixed_point, iterations, history).
    """
    x = x0
    history = [x]
    for i in range(max_iter):
        x_new = f(x)
        history.append(x_new)
        if abs(x_new - x) < tol:
            return x_new, i + 1, history
        x = x_new
    return x, max_iter, history

# Example: f(x) = 0.5x + 1, fixed point x* = 2
f = lambda x: 0.5 * x + 1
x_star, n_iter, hist = banach_iterate(f, x0=0.0)
print(f"Fixed point: {x_star:.8f}  (exact: 2.0)")
print(f"Converged in {n_iter} iterations")

# Error bound using Banach formula: c^n / (1-c) * d(x0, x1)
c = 0.5
x0, x1 = hist[0], hist[1]
for n in [5, 10, 20]:
    bound = (c**n / (1 - c)) * abs(x1 - x0)
    actual = abs(hist[min(n, len(hist)-1)] - x_star)
    print(f"n={n:2d}: bound={bound:.6f}, actual={actual:.6f}")`}
                                />
                            ),
                        },
                        {
                            id: 'exercise',
                            label: 'Exercise',
                            icon: exerciseIcon,
                            content: (
                                <CodingExercise
                                    bare
                                    title="Verify Contraction and Find Fixed Point"
                                    prompt={
                                        <>
                                            Given <Latex>{'$f(x) = 0.7x + 2$'}</Latex>, verify it is a contraction on{' '}
                                            <Latex>{'$\\mathbb{R}$'}</Latex> and find its unique fixed point by iteration.
                                        </>
                                    }
                                    starterCode={`import numpy as np

def is_contraction(f, x_samples, c_bound=1.0):
    """
    Empirically check if f is a contraction with Lipschitz constant < c_bound.
    Sample many pairs and check d(f(x),f(y)) <= c_bound * d(x,y).
    """
    # TODO: check all pairs of samples
    pass

def find_fixed_point(f, x0=0.0, tol=1e-8, max_iter=500):
    """
    Banach iteration: return the fixed point x* such that f(x*) = x*.
    """
    # TODO: iterate until convergence
    pass

f = lambda x: 0.7 * x + 2
print("Is contraction (c<1)?", is_contraction(f, np.linspace(-10, 10, 100), c_bound=1.0))
print("Fixed point:", find_fixed_point(f))`}
                                    checks={`f = lambda x: 0.7 * x + 2
_check("is_contraction returns True", lambda: is_contraction(f, np.linspace(-10,10,100), 1.0) == True)
fp = find_fixed_point(f)
_check("fixed point near 20/3", lambda: abs(fp - 20/3) < 1e-5)`}
                                    solution={`import numpy as np

def is_contraction(f, x_samples, c_bound=1.0):
    n = len(x_samples)
    for i in range(n):
        for j in range(i+1, n):
            dx = abs(x_samples[i] - x_samples[j])
            if dx < 1e-12:
                continue
            dfx = abs(f(x_samples[i]) - f(x_samples[j]))
            if dfx > c_bound * dx + 1e-9:
                return False
    return True

def find_fixed_point(f, x0=0.0, tol=1e-8, max_iter=500):
    x = x0
    for _ in range(max_iter):
        x_new = f(x)
        if abs(x_new - x) < tol:
            return x_new
        x = x_new
    return x

f = lambda x: 0.7 * x + 2
print("Is contraction (c<1)?", is_contraction(f, np.linspace(-10, 10, 100), c_bound=1.0))
print("Fixed point:", find_fixed_point(f))`}
                                />
                            ),
                        },
                        {
                            id: 'quiz',
                            label: 'Quiz',
                            icon: quizIcon,
                            content: <Quiz bare questions={MAP_QUIZ} title="Check: Mappings & Banach" />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
}

/* ─── Legacy named exports (kept for backward compatibility) ─────────────── */

export function MetricSpaceDefinition() { return null; }
export function MetricSpaceExamples() { return null; }
export function ConvergenceCompleteness() { return null; }
export function TopologyOfMetricSpaces() { return null; }
export function MappingsBetweenMetricSpaces() { return null; }

export default function MetricSpacesContent() {
    return null; // backwards compat
}
