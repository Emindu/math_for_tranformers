"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { BookOpen, Shapes, Code2, Dumbbell, ListChecks } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import ConceptStepper from '@/components/ui/ConceptStepper';
import Intuition from '@/components/ui/Intuition';
import Callout from '@/components/ui/Callout';
import CodeBlock from '@/components/ui/CodeBlock';
import Quiz, { QuizQuestion } from '@/components/ui/Quiz';
import CodingExercise from '@/components/ui/CodingExercise';

type Props = {
    introLab?: React.ReactNode;
    spectralLab?: React.ReactNode;
    diagonalizationLab?: React.ReactNode;
};

const conceptIcon   = <BookOpen size={15} />;
const visualizeIcon = <Shapes   size={15} />;
const codeIcon      = <Code2    size={15} />;
const exerciseIcon  = <Dumbbell size={15} />;
const quizIcon      = <ListChecks size={15} />;

/* ───────────────────────── Quizzes & Exercises ───────────────────────── */

const INTRO_QUIZ: QuizQuestion[] = [
    {
        question: "If $v$ is an eigenvector of $A$ with eigenvalue $\\lambda$, what is $A v$?",
        options: ["$A$", "$\\lambda$", "$\\lambda v$", "$0$"],
        answer: 2,
        explanation: "By definition, the action of the matrix on an eigenvector is simply scalar multiplication by the eigenvalue."
    },
    {
        question: "How do you find the eigenvalues of a matrix $A$?",
        options: [
            "Solve $\\det(A - \\lambda I) = 0$",
            "Compute the trace of $A$",
            "Multiply $A$ by its transpose",
            "Invert $A$"
        ],
        answer: 0,
        explanation: "The characteristic equation $\\det(A - \\lambda I) = 0$ gives a polynomial whose roots are the eigenvalues."
    }
];

const INTRO_EXERCISE = {
    starter: `import numpy as np

def compute_eigen(M):
    """
    Return the eigenvalues and eigenvectors of the square matrix M.
    Hint: Use np.linalg.eig
    """
    # TODO: compute and return (eigenvalues, eigenvectors)
    pass
`,
    checks: `_check("returns a tuple of length 2",
       lambda: len(compute_eigen([[1,0],[0,1]])) == 2)
vals, vecs = compute_eigen([[2, 0], [0, 3]])
_check("finds correct eigenvalues",
       lambda: np.allclose(sorted(vals), [2.0, 3.0]))
`,
    solution: `import numpy as np

def compute_eigen(M):
    return np.linalg.eig(M)
`
};

const SPECTRAL_QUIZ: QuizQuestion[] = [
    {
        question: "According to the Spectral Theorem, a real symmetric matrix always has:",
        options: [
            "Complex eigenvalues",
            "Orthogonal eigenvectors",
            "A zero determinant",
            "Rank 1"
        ],
        answer: 1,
        explanation: "A real symmetric matrix is guaranteed to have real eigenvalues and a full set of orthogonal eigenvectors."
    },
    {
        question: "In the spectral decomposition $T = U \\Lambda U^*$, the matrix $U$ represents:",
        options: [
            "Scaling along principal axes",
            "A rotation into the eigenbasis",
            "A projection onto a lower dimension",
            "The identity matrix"
        ],
        answer: 1,
        explanation: "$U^*$ rotates the input into the coordinate system of eigenvectors, $\\Lambda$ scales them, and $U$ rotates them back."
    }
];

const SPECTRAL_EXERCISE = {
    starter: `import numpy as np

def reconstruct_symmetric(eigenvalues, eigenvectors):
    """
    Given an array of real eigenvalues and an orthogonal matrix of eigenvectors,
    reconstruct the original symmetric matrix A = Q * Lambda * Q.T
    """
    # TODO: construct and return A
    pass
`,
    checks: `vals = np.array([3.0, 1.0])
vecs = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
A = reconstruct_symmetric(vals, vecs)
_check("reconstructs symmetric matrix",
       lambda: np.allclose(A, A.T))
_check("eigenvalues match",
       lambda: np.allclose(np.linalg.eigvalsh(A), sorted(vals)))
`,
    solution: `import numpy as np

def reconstruct_symmetric(eigenvalues, eigenvectors):
    Lambda = np.diag(eigenvalues)
    Q = eigenvectors
    return Q @ Lambda @ Q.T
`
};

const DIAG_QUIZ: QuizQuestion[] = [
    {
        question: "If $A$ is diagonalizable such that $A = P D P^{-1}$, then $A^3$ equals:",
        options: [
            "$P D^3 P^{-1}$",
            "$P^3 D^3 P^{-3}$",
            "$D^3$",
            "$P^3 D P^{-1}$"
        ],
        answer: 0,
        explanation: "When multiplying $A$ by itself, the inner $P^{-1} P$ terms cancel out, leaving just $P D^3 P^{-1}$."
    },
    {
        question: "Why is spectral analysis useful in transformers?",
        options: [
            "It computes the softmax faster",
            "It helps analyze the stability and information flow of attention matrices",
            "It replaces the positional encoding",
            "It compresses the input text"
        ],
        answer: 1,
        explanation: "Bounding the eigenvalues of weight matrices is crucial for avoiding exploding/vanishing gradients and stabilizing deep networks."
    }
];

const DIAG_EXERCISE = {
    starter: `import numpy as np

def matrix_power_fast(P, D_diag, invP, k):
    """
    Compute A^k efficiently given its eigendecomposition A = P * D * P^{-1}.
    
    P: matrix of eigenvectors
    D_diag: 1D array of eigenvalues (the diagonal of D)
    invP: inverse of P
    k: the power to raise A to
    """
    # TODO: return A^k
    pass
`,
    checks: `P = np.array([[1, 1], [0, 1]])
D_diag = np.array([2.0, 3.0])
invP = np.linalg.inv(P)
A_3 = matrix_power_fast(P, D_diag, invP, 3)
A = P @ np.diag(D_diag) @ invP
_check("matches A @ A @ A",
       lambda: np.allclose(A_3, A @ A @ A))
_check("fast diagonal power",
       lambda: np.allclose(matrix_power_fast(P, np.array([1, 1]), invP, 100), np.eye(2)))
`,
    solution: `import numpy as np

def matrix_power_fast(P, D_diag, invP, k):
    D_k = np.diag(D_diag ** k)
    return P @ D_k @ invP
`
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

export default function EigenvaluesEigenvectorsContent({ introLab, spectralLab, diagonalizationLab }: Props) {
    return (
        <div className="space-y-10">

            {/* ══ Card 1: Eigenvalues and Eigenvectors ══ */}
            <Card title="1.1.3 Eigenvalues and Eigenvectors">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'The Core Idea',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Most vectors get knocked off their original span when a transformation is applied. An eigenvector is special: the transformation acts on it like a simple scalar stretch or squash. It doesn't change direction.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    Given a linear transformation <Latex>{'$T : V \\to V$'}</Latex> on
                                                    a vector space <Latex>{'$V$'}</Latex>, an <strong>eigenvector</strong> <Latex>{'$v \\in V$'}</Latex> is a non-zero
                                                    vector that is scaled by <Latex>{'$T$'}</Latex> by a scalar factor known as the <strong>eigenvalue</strong>.
                                                </p>
                                                <p>
                                                    Formally, <Latex>{'$v$'}</Latex> is an eigenvector of <Latex>{'$T$'}</Latex> corresponding to the
                                                    eigenvalue <Latex>{'$\\lambda \\in F$'}</Latex> if:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$T(v) = \\lambda v$$'}</Latex>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Characteristic Equation',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    To find the eigenvalues of a linear transformation, one must solve the <strong>characteristic equation</strong>,
                                                    derived from the determinant of the matrix representation of <Latex>{'$T$'}</Latex> minus <Latex>{'$\\lambda$'}</Latex> times
                                                    the identity matrix:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$\\det([T] - \\lambda I) = 0$$'}</Latex>
                                                </div>
                                                <p>
                                                    The solutions to this polynomial equation in <Latex>{'$\\lambda$'}</Latex> give the eigenvalues.
                                                    For each eigenvalue, the corresponding eigenvectors are found by solving the null space:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$([T] - \\lambda I)v = 0$$'}</Latex>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Geometric Interpretation',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Eigenvectors represent the <em>principal directions</em> of a transformation—the "natural axes" of the system.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The geometric interpretation of eigenvectors is closely tied to <strong>symmetry and invariance</strong>.
                                                    They are directions that remain unchanged except for scaling. 
                                                </p>
                                                <p>
                                                    In machine learning and neural networks, these vectors often correspond to independent, uncorrelated features in the data. Discovering them allows a model to untangle complex, coupled interactions into simple, independent scaling factors.
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
                        content: introLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>
                                    In NumPy, we use <code>np.linalg.eig</code> to compute eigenvalues and eigenvectors.
                                </p>
                                <CodeBlock title="eigenvalues.py" runnable code={`import numpy as np

# A 2x2 matrix
A = np.array([[2, 1], 
              [0, 3]])

# Compute eigenvalues and eigenvectors
eigenvalues, eigenvectors = np.linalg.eig(A)

print("Eigenvalues:", eigenvalues)
print("Eigenvectors:\\n", eigenvectors)

# Verify A*v = lambda*v for the first eigenvector
v1 = eigenvectors[:, 0]
lambda1 = eigenvalues[0]

print("\\nA * v1:", A @ v1)
print("lambda1 * v1:", lambda1 * v1)
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Compute Eigenvalues"
                                prompt={<>Use NumPy to compute the eigenvalues and eigenvectors of a matrix.</>}
                                starterCode={INTRO_EXERCISE.starter}
                                checks={INTRO_EXERCISE.checks}
                                solution={INTRO_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={INTRO_QUIZ} title="Check: Eigenvalues & Eigenvectors" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 2: The Spectral Theorem ══ */}
            <Card title="The Spectral Theorem">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Normal Operators',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    The spectral theorem is a cornerstone result in linear algebra. It provides a powerful tool for
                                                    analyzing linear transformations by decomposing them into simpler components.
                                                </p>
                                                <p>
                                                    For a linear operator <Latex>{'$T : V \\to V$'}</Latex>, the spectral theorem states that
                                                    <Latex>{'$T$'}</Latex> is diagonalizable by an orthogonal/unitary matrix if and only if it is <strong>normal</strong>, meaning it commutes with its transpose:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$TT^* = T^*T$$'}</Latex>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Decomposition',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Symmetric matrices (a subset of normal operators) are incredibly well-behaved. They always have real eigenvalues, and their eigenvectors form a perfectly orthogonal grid.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    The spectral theorem asserts that a normal operator <Latex>{'$T$'}</Latex> can be represented as:
                                                </p>
                                                <div className="bg-gradient-to-r from-[var(--accent-soft)] to-transparent p-6 rounded-lg my-6 text-center border border-[var(--border)]">
                                                    <Latex>{'$$T = U \\Lambda U^*$$'}</Latex>
                                                    <p className="text-sm font-semibold text-[var(--accent)] mt-2">
                                                        The Spectral Decomposition
                                                    </p>
                                                </div>
                                                <p>
                                                    where <Latex>{'$U$'}</Latex> is a unitary (or orthogonal) matrix,
                                                    and <Latex>{'$\\Lambda$'}</Latex> is a diagonal matrix whose entries are the eigenvalues
                                                    of <Latex>{'$T$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Geometric Meaning',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    The geometric interpretation of the spectral theorem is profound: the transformation <Latex>{'$T$'}</Latex> can
                                                    be understood as a sequence of three operations:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-6 rounded-xl my-4 border-l-4 border-[var(--accent)]">
                                                    <ol className="list-decimal list-inside space-y-3 text-sm">
                                                        <li><strong>Rotate into eigenbasis</strong> (<Latex>{'$U^*$'}</Latex>): Transform to the coordinate system aligned with the eigenvectors.</li>
                                                        <li><strong>Scale along principal axes</strong> (<Latex>{'$\\Lambda$'}</Latex>): Apply the eigenvalue scaling independently along each orthogonal direction.</li>
                                                        <li><strong>Rotate back</strong> (<Latex>{'$U$'}</Latex>): Return to the original coordinate system.</li>
                                                    </ol>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Applications',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    The spectral theorem has profound implications across various domains:
                                                </p>
                                                <ul className="list-disc list-inside space-y-2 text-sm ml-4 text-[var(--muted)]">
                                                    <li><strong className="text-[var(--foreground)]">Principal Component Analysis (PCA):</strong> The foundation for finding directions of maximum variance in data.</li>
                                                    <li><strong className="text-[var(--foreground)]">Quantum Mechanics:</strong> Underpins the spectral decomposition of observables.</li>
                                                    <li><strong className="text-[var(--foreground)]">Transformers:</strong> Analyzing stability and behavior of attention weight matrices through their spectral properties.</li>
                                                </ul>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    {
                        id: 'visualize', label: 'Visualize', icon: visualizeIcon,
                        content: spectralLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>
                                    For a real symmetric matrix, we can use <code>np.linalg.eigh</code> (note the 'h' for Hermitian) which is optimized and guarantees real eigenvalues.
                                </p>
                                <CodeBlock title="spectral.py" runnable code={`import numpy as np

# A symmetric matrix (A = A.T)
A = np.array([[2, 1], 
              [1, 2]])

# Use eigh for symmetric/Hermitian matrices
eigenvalues, Q = np.linalg.eigh(A)

print("Eigenvalues (real):", eigenvalues)
print("Orthogonal Eigenvectors (Q):\\n", Q)

# Verify Q is orthogonal (Q * Q^T = I)
print("\\nQ @ Q.T (should be Identity):\\n", np.round(Q @ Q.T, 4))

# Reconstruct A = Q * Lambda * Q^T
Lambda = np.diag(eigenvalues)
A_reconstructed = Q @ Lambda @ Q.T

print("\\nReconstructed A:\\n", np.round(A_reconstructed, 4))
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Reconstruct Matrix"
                                prompt={<>Given eigenvalues and orthogonal eigenvectors, use the Spectral Decomposition formula to reconstruct the original symmetric matrix.</>}
                                starterCode={SPECTRAL_EXERCISE.starter}
                                checks={SPECTRAL_EXERCISE.checks}
                                solution={SPECTRAL_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={SPECTRAL_QUIZ} title="Check: The Spectral Theorem" />,
                    },
                ]} />
            </Card>

            {/* ══ Card 3: Diagonalization ══ */}
            <Card title="Diagonalization">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Diagonalizing a Matrix',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Diagonal matrices are trivial to compute with — raising them to a power just means raising their diagonal entries to that power. Diagonalization is the process of converting a complicated matrix into a simple diagonal one by changing our perspective (basis).
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A matrix <Latex>{'$A$'}</Latex> is diagonalizable if there exists an invertible matrix <Latex>{'$P$'}</Latex> such that:
                                                </p>
                                                <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
                                                    <Latex>{'$$P^{-1}AP = D$$'}</Latex>
                                                </div>
                                                <p>
                                                    where <Latex>{'$D$'}</Latex> is a diagonal matrix. The columns of <Latex>{'$P$'}</Latex> are the eigenvectors of <Latex>{'$A$'}</Latex>, and the
                                                    diagonal entries of <Latex>{'$D$'}</Latex> are the corresponding eigenvalues. 
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'In Transformers',
                                    content: (
                                        <div>
                                            <Callout>
                                                <strong>Why this matters:</strong> In transformers, understanding the eigenvalues and eigenvectors of the self-attention matrix can reveal how information is weighted and combined across different parts of the sequence.
                                            </Callout>
                                            <Reading>
                                                <p>
                                                    The process of diagonalization reveals the underlying structure of the transformation
                                                    and allows for the decomposition of complex transformations into simpler, more
                                                    interpretable components.
                                                </p>
                                                <p>
                                                    This invariance is a key feature in intelligent systems. Transformers, which are designed to process data with complex, hierarchical structures, benefit greatly from the insights provided by spectral analysis, allowing researchers to stabilize deep networks by bounding their largest eigenvalues.
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
                        content: diagonalizationLab,
                    },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <p>
                                    Diagonalization makes matrix powers incredibly efficient. Instead of repeatedly multiplying <Latex>{'$A$'}</Latex>, we just power the diagonal elements.
                                </p>
                                <CodeBlock title="matrix_power.py" runnable code={`import numpy as np

A = np.array([[1.5, 0.5], 
              [0.5, 1.5]])

# 1. Standard (slow) way to compute A^10
A_10_slow = np.linalg.matrix_power(A, 10)

# 2. Diagonalization (fast) way
eigenvalues, P = np.linalg.eig(A)
P_inv = np.linalg.inv(P)

# Power the diagonal
D_10 = np.diag(eigenvalues ** 10)

# Reconstruct: P * D^10 * P^-1
A_10_fast = P @ D_10 @ P_inv

print("A^10 (Standard):\\n", np.round(A_10_slow, 2))
print("\\nA^10 (Diagonalized):\\n", np.round(A_10_fast, 2))
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Fast Matrix Powers"
                                prompt={<>Use the eigendecomposition $A = P D P^{-1}$ to compute $A^k$ efficiently by only raising the diagonal eigenvalues to the power $k$.</>}
                                starterCode={DIAG_EXERCISE.starter}
                                checks={DIAG_EXERCISE.checks}
                                solution={DIAG_EXERCISE.solution}
                            />
                        ),
                    },
                    {
                        id: 'quiz', label: 'Quiz', icon: quizIcon,
                        content: <Quiz bare questions={DIAG_QUIZ} title="Check: Diagonalization" />,
                    },
                ]} />
            </Card>

        </div>
    );
}
