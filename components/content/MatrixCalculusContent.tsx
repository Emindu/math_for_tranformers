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
   Backward-compat stubs — kept so existing imports don't break
   ═══════════════════════════════════════════════════════════════════════════ */

export function DifferentiationOfMatrixFunctions() { return null; }
export function ConvergenceAnalysis() { return null; }
export function LearningRateSchedules() { return null; }
export function JacobianAndHessianMatrices() { return null; }
export default function MatrixCalculusContent() { return null; }

/* ═══════════════════════════════════════════════════════════════════════════
   Quiz & Exercise data — DifferentiationContent
   ═══════════════════════════════════════════════════════════════════════════ */

const DIFF_QUIZ: QuizQuestion[] = [
    {
        question: "What is the gradient of tr(AX) with respect to X?",
        options: ["A", "Aᵀ", "2A", "2X"],
        answer: 1,
        explanation: "By the trace identity tr(AX) = Σ_{ij} A_{ji} X_{ij}, so ∂tr(AX)/∂X_{ij} = A_{ji}, giving Aᵀ.",
    },
    {
        question: "The Jacobian of f: ℝ^{m×n} → ℝ^p has shape:",
        options: ["(p, mn)", "(m, n)", "(p, p)", "(mn, mn)"],
        answer: 0,
        explanation: "Each of the p output components has a gradient of shape (m,n), so the Jacobian is p rows by mn columns.",
    },
];

const DIFF_EXERCISE = {
    starter: `import numpy as np

def numerical_gradient(f, X, eps=1e-5):
    """
    Compute the gradient of scalar function f with respect to matrix X
    using centered finite differences.
    Returns a matrix of the same shape as X.
    """
    # TODO: implement centered-difference numerical gradient
    pass
`,
    checks: `import numpy as np

def frobenius_sq(X):
    return float(np.sum(X ** 2))

X = np.array([[1.0, 2.0], [3.0, 4.0]])
grad = numerical_gradient(frobenius_sq, X)
_check("returns correct shape", lambda: grad is not None and grad.shape == X.shape)
_check("matches analytical 2X", lambda: grad is not None and np.allclose(grad, 2 * X, atol=1e-4))
`,
    solution: `import numpy as np

def numerical_gradient(f, X, eps=1e-5):
    grad = np.zeros_like(X)
    for i in range(X.shape[0]):
        for j in range(X.shape[1]):
            Xp = X.copy(); Xm = X.copy()
            Xp[i, j] += eps; Xm[i, j] -= eps
            grad[i, j] = (f(Xp) - f(Xm)) / (2 * eps)
    return grad

def frobenius_sq(X):
    return float(np.sum(X ** 2))

X = np.array([[1.0, 2.0], [3.0, 4.0]])
grad = numerical_gradient(frobenius_sq, X)
print(f"Numerical gradient:\\n{grad}")
print(f"Analytical 2X:\\n{2 * X}")
print(f"Max error: {np.abs(grad - 2 * X).max():.2e}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   Quiz & Exercise data — GradientFlowContent
   ═══════════════════════════════════════════════════════════════════════════ */

const FLOW_QUIZ: QuizQuestion[] = [
    {
        question: "For gradient descent with Lipschitz constant L, the maximum safe learning rate is:",
        options: ["2/L", "1/L", "L/2", "L"],
        answer: 0,
        explanation: "The condition 0 < η < 2/L ensures the descent step doesn't overshoot. At η = 1/L you get the tightest convergence guarantee for strongly convex functions.",
    },
    {
        question: "Which learning rate schedule periodically resets η to help escape shallow local minima?",
        options: ["Warm Restarts", "Step Decay", "Exponential Decay", "Polynomial Decay"],
        answer: 0,
        explanation: "Warm restarts (SGDR) periodically raise η back to a high value following a cosine curve, allowing the optimizer to explore new regions of the loss landscape.",
    },
];

const FLOW_EXERCISE = {
    starter: `import numpy as np

def adam_step(theta, grad, m, v, t, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8):
    """
    Perform one Adam optimizer step with bias correction.
    Returns updated (theta, m, v).
    """
    # TODO: implement Adam update
    pass
`,
    checks: `import numpy as np

theta = np.array([1.0, -1.0])
grad  = np.array([0.5,  0.5])
m = np.zeros_like(theta)
v = np.zeros_like(theta)
t = 1
theta2, m2, v2 = adam_step(theta, grad, m, v, t)
_check("returns three values", lambda: theta2 is not None and m2 is not None and v2 is not None)
_check("theta updated", lambda: not np.allclose(theta2, theta))
_check("m updated correctly", lambda: np.allclose(m2, 0.9 * m + 0.1 * grad, atol=1e-6))
`,
    solution: `import numpy as np

def adam_step(theta, grad, m, v, t, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8):
    m = beta1 * m + (1 - beta1) * grad
    v = beta2 * v + (1 - beta2) * grad ** 2
    m_hat = m / (1 - beta1 ** t)
    v_hat = v / (1 - beta2 ** t)
    theta = theta - lr * m_hat / (np.sqrt(v_hat) + eps)
    return theta, m, v

# Example
theta = np.array([1.0, -1.0])
grad  = np.array([0.5,  0.5])
m = np.zeros_like(theta)
v = np.zeros_like(theta)
for t in range(1, 11):
    theta, m, v = adam_step(theta, grad, m, v, t)
print(f"After 10 Adam steps: theta = {np.round(theta, 4)}")
`,
};

/* ═══════════════════════════════════════════════════════════════════════════
   1.6.1 — Differentiation of Matrix Functions
   ═══════════════════════════════════════════════════════════════════════════ */

export function DifferentiationContent({ gradientLab }: { gradientLab?: React.ReactNode }) {
    return (
        <div className="space-y-10">
            <Card title="1.6.1 · Differentiation of Matrix Functions">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Matrix Derivatives',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Think of the gradient as the matrix of slopes — each entry says how much the loss changes when you nudge that weight slightly.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A matrix function <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}^{p \\times q}$'}</Latex>; its full derivative is a 4th-order tensor.
                                                    For scalar output <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}$'}</Latex>, the gradient <Latex>{'$\\nabla_X f$'}</Latex> is a matrix:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$(\\nabla_X f)_{ij} = \\frac{\\partial f}{\\partial X_{ij}}$$'}</Latex>
                                                </div>
                                                <p>
                                                    Key identities: <Latex>{'$\\nabla_X \\operatorname{tr}(AX) = A^\\top$'}</Latex> and <Latex>{'$\\nabla_X \\|X\\|_F^2 = 2X$'}</Latex>.
                                                    These appear directly in computing weight updates for <Latex>{'$W^Q, W^K, W^V$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Jacobian Matrix',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The Jacobian is the &ldquo;sensitivity matrix&rdquo; — entry (i,j) tells how much output i changes when input j moves.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The Jacobian generalizes the gradient to vector-valued <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}^p$'}</Latex>;
                                                    it is <Latex>{'$J_f(X) \\in \\mathbb{R}^{p \\times (mn)}$'}</Latex> where each row is the gradient of one output component.
                                                </p>
                                                <p>
                                                    Softmax Jacobian:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$(J_{\\text{softmax}}(S))_{ij,kl} = \\alpha_{ij}(\\delta_{jk} - \\alpha_{ik})$$'}</Latex>
                                                </div>
                                                <p>
                                                    where <Latex>{'$\\delta$'}</Latex> is the Kronecker delta. This Jacobian determines exactly how gradients flow backward through the softmax layer in attention.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Hessian Matrix',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The Hessian tells you the shape of the loss landscape around the current point — bowl, ridge, or saddle.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The second-order derivative <Latex>{'$H_f(X) \\in \\mathbb{R}^{(mn) \\times (mn)}$'}</Latex> for scalar <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}$'}</Latex> encodes curvature.
                                                    Large eigenvalues mean sharp valleys (need small steps); small eigenvalues mean flat regions (can take bigger steps).
                                                </p>
                                                <p>
                                                    A positive definite Hessian signals a local minimum; an indefinite Hessian signals a saddle point.
                                                    Used in Newton&apos;s method and second-order optimizers; directly relates to stability of training.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="matrix_grad.py"
                                runnable
                                language="python"
                                code={`import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def softmax_jacobian(s):
    """Analytical Jacobian of softmax."""
    a = softmax(s)
    return np.diag(a) - np.outer(a, a)

# Gradient of trace(AX) w.r.t. X
n = 3
A = np.random.randn(n, n)
X = np.random.randn(n, n)
grad_trace = A.T
print(f"grad tr(AX) = A^T sample:\\n{np.round(grad_trace, 3)}")

# Gradient of Frobenius norm squared
grad_frob = 2 * X
print(f"grad ||X||_F^2 = 2X sample:\\n{np.round(grad_frob, 3)}")

# Softmax Jacobian
s = np.array([1.0, 2.0, 0.5])
J = softmax_jacobian(s)
print(f"\\nSoftmax Jacobian (shape {J.shape}):\\n{np.round(J, 4)}")

# Numerical gradient check
eps = 1e-5
J_num = np.zeros((len(s), len(s)))
for j in range(len(s)):
    sp, sm = s.copy(), s.copy()
    sp[j] += eps; sm[j] -= eps
    J_num[:, j] = (softmax(sp) - softmax(sm)) / (2 * eps)
print(f"Max |analytical - numerical|: {np.abs(J - J_num).max():.2e}")
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Numerical Gradient Check"
                                prompt={<>Implement <code>numerical_gradient(f, X, eps=1e-5)</code> that computes the gradient of a scalar function <Latex>{'$f$'}</Latex> with respect to matrix <Latex>{'$X$'}</Latex> using centered finite differences. Verify it matches the analytical gradient <Latex>{'$\\nabla_X \\|X\\|_F^2 = 2X$'}</Latex>.</>}
                                starterCode={DIFF_EXERCISE.starter}
                                checks={DIFF_EXERCISE.checks}
                                solution={DIFF_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={DIFF_QUIZ} title="Check: Differentiation of Matrix Functions" />,
                    },
                ]} />
            </Card>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1.6.2 — Optimization & Gradient Flow
   ═══════════════════════════════════════════════════════════════════════════ */

export function GradientFlowContent({
    convergenceLab,
    learningRateLab,
}: {
    convergenceLab?: React.ReactNode;
    learningRateLab?: React.ReactNode;
}) {
    return (
        <div className="space-y-10">
            <Card title="1.6.2 · Optimization & Gradient Flow">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Gradient Descent Convergence',
                                    content: (
                                        <div>
                                            <Intuition>
                                                The Lipschitz condition says the loss surface can&apos;t bend too sharply — this bounds how large a step we can safely take.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Update rule: <Latex>{'$\\theta_{t+1} = \\theta_t - \\eta \\nabla \\mathcal{L}(\\theta_t)$'}</Latex>.
                                                    Smoothness (Lipschitz gradient): <Latex>{'$\\|\\nabla \\mathcal{L}(\\theta_1) - \\nabla \\mathcal{L}(\\theta_2)\\| \\leq L\\|\\theta_1 - \\theta_2\\|$'}</Latex>.
                                                    Safe learning rate: <Latex>{'$0 < \\eta < 2/L$'}</Latex>.
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-3 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\mathcal{L}(\\theta_t) - \\mathcal{L}(\\theta^*) \\leq (1 - \\eta\\mu)^t\\bigl(\\mathcal{L}(\\theta_0) - \\mathcal{L}(\\theta^*)\\bigr)$$'}</Latex>
                                                </div>
                                                <p>
                                                    Linear convergence rate (strongly convex). In practice (non-convex): convergence to a stationary point, not global minimum.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Learning Rate Schedules',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Starting with large steps explores broadly; shrinking the rate later allows precise fine-tuning near a minimum.
                                            </Intuition>
                                            <Reading>
                                                <p>Common schedules:</p>
                                                <ul>
                                                    <li>Step decay: <Latex>{'$\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/T \\rfloor}$'}</Latex></li>
                                                    <li>Exponential: <Latex>{'$\\eta_t = \\eta_0 \\cdot \\exp(-\\lambda t)$'}</Latex></li>
                                                    <li>Polynomial: <Latex>{'$\\eta_t = \\eta_0 \\cdot (1 - t/T_{\\max})^p$'}</Latex></li>
                                                    <li>Cosine annealing: <Latex>{'$\\eta_t = \\eta_{\\min} + \\tfrac{1}{2}(\\eta_{\\max} - \\eta_{\\min})(1 + \\cos(t\\pi/T_{\\max}))$'}</Latex></li>
                                                    <li>Warm restarts: cosine with periodic resets every <Latex>{'$T_{\\text{restart}}$'}</Latex> epochs</li>
                                                </ul>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Loss Landscape Geometry',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A saddle point looks like a minimum along one axis but a maximum along another — first-order methods can get stuck there, but noise from stochastic gradients usually escapes them.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The non-convex loss surface contains local minima, saddle points, and ridges.
                                                    Saddle points satisfy <Latex>{'$\\nabla \\mathcal{L} = 0$'}</Latex> but the Hessian has both positive and negative eigenvalues.
                                                </p>
                                                <p>
                                                    Narrow valleys (ill-conditioned Hessian) cause gradient oscillation; adaptive methods (Adam, RMSprop) scale each parameter by its gradient history.
                                                    Residual connections in transformers (<Latex>{'$x + F(x)$'}</Latex>) flatten the loss landscape, aiding convergence.
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
                        content: (
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--muted)] mb-3">Convergence</p>
                                    {convergenceLab}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[var(--muted)] mb-3">Learning Rate Schedules</p>
                                    {learningRateLab}
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <CodeBlock
                                title="gradient_flow.py"
                                runnable
                                language="python"
                                code={`import numpy as np

def loss(theta):
    return 0.5 * float(np.dot(theta, theta))

def grad_loss(theta):
    return theta.copy()

def step_decay(t, eta0=0.1, gamma=0.5, period=20):
    return eta0 * gamma ** (t // period)

def cosine_annealing(t, T, eta_min=0.001, eta_max=0.1):
    return eta_min + 0.5 * (eta_max - eta_min) * (1 + np.cos(np.pi * t / T))

def warm_restarts(t, period=25, eta_min=0.001, eta_max=0.1):
    t_mod = t % period
    return eta_min + 0.5 * (eta_max - eta_min) * (1 + np.cos(np.pi * t_mod / period))

np.random.seed(42)
theta0 = np.array([3.0, 2.0])
T = 100

print(f"{'Schedule':<14} | {'Final LR':>10} | {'Final Loss':>12}")
print("-" * 44)
schedules = [
    ("Step Decay",    lambda t: step_decay(t)),
    ("Cosine",        lambda t: cosine_annealing(t, T)),
    ("Warm Restart",  lambda t: warm_restarts(t)),
]
for name, sched in schedules:
    th = theta0.copy()
    for t in range(T):
        th = th - sched(t) * grad_loss(th)
    print(f"{name:<14} | {sched(T-1):>10.6f} | {loss(th):>12.8f}")
`}
                            />
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise
                                bare
                                title="Adam Optimizer Step"
                                prompt={<>Implement <code>adam_step(theta, grad, m, v, t, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8)</code> that returns updated <code>(theta, m, v)</code> using the Adam update rule with bias correction.</>}
                                starterCode={FLOW_EXERCISE.starter}
                                checks={FLOW_EXERCISE.checks}
                                solution={FLOW_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={FLOW_QUIZ} title="Check: Optimization & Gradient Flow" />,
                    },
                ]} />
            </Card>
        </div>
    );
}
