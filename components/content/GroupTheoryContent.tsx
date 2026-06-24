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

const conceptIcon   = <BookOpen size={15} />;
const visualizeIcon = <Shapes   size={15} />;
const codeIcon      = <Code2    size={15} />;
const exerciseIcon  = <Dumbbell size={15} />;
const quizIcon      = <ListChecks size={15} />;

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

function FormulaBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[var(--surface-2)] p-4 rounded-lg my-4 text-center border border-[var(--border)]">
            {children}
        </div>
    );
}

function TheoremBox({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6 rounded-r-xl">
            <p className="font-semibold text-amber-800 mb-2">{title}</p>
            <div className="text-sm text-amber-900">{children}</div>
        </div>
    );
}

/* ── Quiz & Exercise data ── */

const AXIOMS_QUIZ: QuizQuestion[] = [
    {
        question: 'Which axiom guarantees combining two group elements produces another group element?',
        options: ['Associativity', 'Closure', 'Identity', 'Inverse'],
        answer: 1,
        explanation: 'The closure axiom states that for all $a, b \\in G$, the product $a \\cdot b$ is also in $G$.',
    },
    {
        question: 'Which set is NOT a group under the usual operation?',
        options: [
            'Integers under addition',
            'Non-zero reals under multiplication',
            'All $2 \\times 2$ matrices under multiplication',
            'Rotations of a square under composition',
        ],
        answer: 2,
        explanation: 'Not all $2\\times2$ matrices are invertible (e.g., zero matrix). You must exclude singular matrices to form $GL_2(\\mathbb{R})$.',
    },
];

const AXIOMS_EXERCISE = {
    starter: `def is_group(elements, op):
    """
    Return True if (elements, op) satisfies all four group axioms.
    op(a, b) returns the result of combining a and b.
    """
    # TODO: check closure, associativity, identity, inverse
    pass
`,
    checks: `elements = [0, 1, 2, 3]
op = lambda a, b: (a + b) % 4
result = is_group(elements, op)
_check("Z_4 is a group", lambda: result == True)

elements2 = [0, 1, 2]
op2 = lambda a, b: (a * b) % 3
result2 = is_group(elements2, op2)
_check("{0,1,2} under mult is not a group", lambda: result2 == False)
`,
    solution: `def is_group(elements, op):
    elem_set = set(elements)
    for a in elements:
        for b in elements:
            if op(a, b) not in elem_set:
                return False
    for a in elements:
        for b in elements:
            for c in elements:
                if op(op(a, b), c) != op(a, op(b, c)):
                    return False
    identity = None
    for e in elements:
        if all(op(e, a) == a and op(a, e) == a for a in elements):
            identity = e
            break
    if identity is None:
        return False
    for a in elements:
        if not any(op(a, b) == identity for b in elements):
            return False
    return True
`,
};

const SUBGROUP_QUIZ: QuizQuestion[] = [
    {
        question: "Lagrange's Theorem states that for finite group $G$ with subgroup $H$:",
        options: ['$|H|$ must equal $|G|/2$', '$|H|$ divides $|G|$', '$|G|$ divides $|H|$', '$|H| = \\sqrt{|G|}$'],
        answer: 1,
        explanation: "Lagrange's Theorem: $|G| = |H| \\times [G:H]$, so $|H|$ divides $|G|$.",
    },
    {
        question: 'Left cosets $gH$ of subgroup $H$ in $G$:',
        options: ['May overlap', 'Always equal $H$', 'Partition $G$ into disjoint equal-sized subsets', 'Are always subgroups'],
        answer: 2,
        explanation: 'Cosets are either identical or disjoint, covering all of $G$, each of size $|H|$.',
    },
];

const SUBGROUP_EXERCISE = {
    starter: `def left_cosets(n, subgroup):
    """
    Compute left cosets of subgroup H in Z_n.
    Returns: list of sorted cosets.
    """
    # TODO: compute left cosets gH for each g in Z_n
    pass
`,
    checks: `cosets = left_cosets(6, [0, 2, 4])
_check("returns 2 cosets", lambda: len(cosets) == 2)
_check("cosets cover all elements", lambda: set(e for c in cosets for e in c) == {0,1,2,3,4,5})

cosets2 = left_cosets(12, [0, 4, 8])
_check("Z_12 / {0,4,8} has 4 cosets", lambda: len(cosets2) == 4)
`,
    solution: `def left_cosets(n, subgroup):
    visited = set()
    cosets = []
    for g in range(n):
        if g in visited:
            continue
        coset = sorted(set((g + h) % n for h in subgroup))
        for el in coset:
            visited.add(el)
        cosets.append(coset)
    return cosets
`,
};

const HOMO_QUIZ: QuizQuestion[] = [
    {
        question: 'A group homomorphism $\\varphi: G \\to H$ satisfies:',
        options: ['$\\varphi(a + b) = \\varphi(a) \\times \\varphi(b)$', '$\\varphi(a \\cdot b) = \\varphi(a) \\cdot \\varphi(b)$', '$\\varphi(a) = \\varphi(b)$ for all $a,b$', '$\\varphi(e_G) = e_H + 1$'],
        answer: 1,
        explanation: 'A homomorphism preserves the group operation: $\\varphi(a \\cdot b) = \\varphi(a) \\cdot \\varphi(b)$.',
    },
    {
        question: 'The kernel of $\\varphi: G \\to H$ is:',
        options: ['The image of $\\varphi$', 'Elements of $H$ that are reached', 'Elements of $G$ mapping to the identity of $H$', 'Always equal to $G$'],
        answer: 2,
        explanation: '$\\ker(\\varphi) = \\{g \\in G \\mid \\varphi(g) = e_H\\}$. Always a normal subgroup of $G$.',
    },
];

const HOMO_EXERCISE = {
    starter: `def is_homomorphism(n_domain, n_codomain, phi):
    """Check phi is a group homomorphism from Z_n_domain to Z_n_codomain."""
    # TODO: verify phi(a+b) = phi(a)+phi(b) mod n for all a,b
    pass

def kernel(n, phi):
    """Return elements of Z_n that map to 0 under phi."""
    # TODO: return list of elements mapping to identity
    pass
`,
    checks: `phi_mod3 = lambda x: x % 3
_check("x mod 3 is homomorphism Z6->Z3", lambda: is_homomorphism(6, 3, phi_mod3) == True)

ker = kernel(6, phi_mod3)
_check("kernel is {0,3}", lambda: sorted(ker) == [0, 3])

phi_not = lambda x: (x + 1) % 3
_check("x+1 mod 3 is not a homomorphism", lambda: is_homomorphism(6, 3, phi_not) == False)
`,
    solution: `def is_homomorphism(n_domain, n_codomain, phi):
    for a in range(n_domain):
        for b in range(n_domain):
            if phi((a + b) % n_domain) % n_codomain != (phi(a) + phi(b)) % n_codomain:
                return False
    return True

def kernel(n, phi):
    return [a for a in range(n) if phi(a) % n == 0]
`,
};

const REP_QUIZ: QuizQuestion[] = [
    {
        question: 'A representation of group $G$ is a homomorphism $\\rho: G \\to ?$',
        options: ['$\\mathbb{R}$', '$\\text{GL}(V)$ — group of invertible linear maps on a vector space', '$G$ itself', 'The symmetric group $S_n$'],
        answer: 1,
        explanation: 'A representation maps group elements to invertible matrices, preserving group structure: $\\rho(g_1 g_2) = \\rho(g_1)\\rho(g_2)$.',
    },
    {
        question: 'The 1D representations of cyclic group $C_n$ are:',
        options: ['$\\rho_k(g^j) = j$', '$\\rho_k(g^j) = e^{2\\pi i jk/n}$', '$\\rho_k(g^j) = k$', '$\\rho_k(g^j) = 0$ unless $j=0$'],
        answer: 1,
        explanation: 'The $n$ distinct 1D irreps of $C_n$ send the generator $g$ to $\\omega^k$ where $\\omega = e^{2\\pi i/n}$.',
    },
];

const REP_EXERCISE = {
    starter: `import numpy as np

def cyclic_rep(n, k, j):
    """
    Compute rho_k(g^j) = e^(2*pi*i*j*k/n) for cyclic group C_n.
    """
    # TODO: return the complex value
    pass

def verify_homomorphism_property(n, k):
    """Verify rho_k(g^a * g^b) = rho_k(g^a) * rho_k(g^b) for all a,b."""
    # TODO: check multiplication property
    pass
`,
    checks: `_check("rho_0 is trivial", lambda: abs(cyclic_rep(4, 0, 1) - 1.0) < 1e-9)
_check("rho_1(g^1) = i for C4", lambda: abs(cyclic_rep(4, 1, 1) - 1j) < 1e-9)
_check("rho_1(g^2) = -1 for C4", lambda: abs(cyclic_rep(4, 1, 2) - (-1)) < 1e-9)
_check("homomorphism property holds", lambda: verify_homomorphism_property(6, 2) == True)
`,
    solution: `import numpy as np

def cyclic_rep(n, k, j):
    return np.exp(2j * np.pi * j * k / n)

def verify_homomorphism_property(n, k):
    for a in range(n):
        for b in range(n):
            if abs(cyclic_rep(n, k, (a+b)%n) - cyclic_rep(n,k,a)*cyclic_rep(n,k,b)) > 1e-9:
                return False
    return True
`,
};

const CHAR_QUIZ: QuizQuestion[] = [
    {
        question: 'The character $\\chi(g)$ of a representation $\\rho$ is:',
        options: ['$\\det(\\rho(g))$', '$\\text{Tr}(\\rho(g))$', '$\\|\\rho(g)\\|$', '$\\rho(g)^{-1}$'],
        answer: 1,
        explanation: 'The character $\\chi(g) = \\text{Tr}(\\rho(g))$ is the trace of the representing matrix. Constant on conjugacy classes.',
    },
    {
        question: 'Row orthogonality of irreducible characters states:',
        options: [
            '$\\sum_{g} \\chi_i(g) = 0$ always',
            '$\\frac{1}{|G|} \\sum_{g} \\chi_i(g)\\overline{\\chi_j(g)} = \\delta_{ij}$',
            '$\\chi_i(g) = \\chi_j(g)$ for all $g$',
            '$\\sum_i \\chi_i(g) = |G|$',
        ],
        answer: 1,
        explanation: 'Irreps form an orthonormal basis: $\\langle \\chi_i, \\chi_j \\rangle = \\delta_{ij}$.',
    },
];

const CHAR_EXERCISE = {
    starter: `import numpy as np

S3_CHARS = np.array([[1, 1, 1], [1, -1, 1], [2, 0, -1]])
CLASS_SIZES = np.array([1, 3, 2])
ORDER = 6

def inner_product(chi_i, chi_j, class_sizes, group_order):
    """<chi_i, chi_j> = (1/|G|) sum_c |c| chi_i(c) conj(chi_j(c))"""
    # TODO: compute inner product
    pass

def check_orthogonality(char_table, class_sizes, order):
    """Return the Gram matrix gram[i][j] = <chi_i, chi_j>."""
    # TODO: build the Gram matrix
    pass
`,
    checks: `ip = inner_product(S3_CHARS[0], S3_CHARS[0], CLASS_SIZES, ORDER)
_check("<chi_0, chi_0> = 1", lambda: abs(ip - 1.0) < 1e-9)

ip2 = inner_product(S3_CHARS[0], S3_CHARS[1], CLASS_SIZES, ORDER)
_check("<chi_0, chi_1> = 0", lambda: abs(ip2) < 1e-9)

gram = check_orthogonality(S3_CHARS, CLASS_SIZES, ORDER)
_check("Gram matrix is identity", lambda: np.allclose(gram, np.eye(3)))
`,
    solution: `import numpy as np

def inner_product(chi_i, chi_j, class_sizes, group_order):
    return np.real(np.sum(class_sizes * chi_i * np.conj(chi_j))) / group_order

def check_orthogonality(char_table, class_sizes, order):
    n = len(char_table)
    return np.array([[inner_product(char_table[i], char_table[j], class_sizes, order)
                      for j in range(n)] for i in range(n)])
`,
};

const APPS_QUIZ: QuizQuestion[] = [
    {
        question: 'Standard self-attention in transformers is:',
        options: [
            'Invariant to input permutations',
            'Equivariant to input permutations',
            'Neither invariant nor equivariant',
            'Only for fixed-length sequences',
        ],
        answer: 1,
        explanation: 'Self-attention is permutation equivariant: permuting input tokens correspondingly permutes outputs.',
    },
    {
        question: 'A layer $f$ is equivariant under group $G$ if:',
        options: ['$f(g \\cdot x) = f(x)$', '$f(g \\cdot x) = g \\cdot f(x)$', '$f(x) = g$', '$f(g \\cdot x) = g^{-1} \\cdot f(x)$'],
        answer: 1,
        explanation: 'Equivariance: $f(g \\cdot x) = g \\cdot f(x)$. Invariance would be $f(g \\cdot x) = f(x)$.',
    },
];

const APPS_EXERCISE = {
    starter: `import numpy as np

def is_permutation_equivariant(f, n_tokens, n_trials=50):
    """
    Test if f: R^(n_tokens x 2) -> R^(n_tokens x 2) is permutation equivariant.
    Check f(Px) = P f(x) for random permutations P.
    """
    # TODO: test equivariance with random inputs and permutations
    pass

def row_linear(x):
    W = np.array([[2.0, -1.0], [0.5, 1.5]])
    return x @ W.T

def mean_pooled(x):
    return np.tile(x.mean(axis=0), (x.shape[0], 1))
`,
    checks: `_check("row_linear is equivariant", lambda: is_permutation_equivariant(row_linear, 4))
_check("mean_pooled is not equivariant", lambda: not is_permutation_equivariant(mean_pooled, 4))
`,
    solution: `import numpy as np

def is_permutation_equivariant(f, n_tokens, n_trials=50):
    rng = np.random.default_rng(42)
    for _ in range(n_trials):
        x = rng.standard_normal((n_tokens, 2))
        perm = rng.permutation(n_tokens)
        if not np.allclose(f(x)[perm], f(x[perm]), atol=1e-9):
            return False
    return True
`,
};

/* ════════════════════════════════════════════════════════════════════════════
   Exported content components
   ════════════════════════════════════════════════════════════════════════════ */

type BasicConceptsProps = {
    groupAxiomsLab?: React.ReactNode;
    subgroupLab?: React.ReactNode;
    homomorphismLab?: React.ReactNode;
};

export function BasicConceptsContent({ groupAxiomsLab, subgroupLab, homomorphismLab }: BasicConceptsProps) {
    return (
        <div className="space-y-10">
            <Card title="Group Axioms">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'What is a Group?',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Think of a group as a collection of symmetry operations that can be combined, reversed, and always include a do-nothing option. Rotating a triangle, shuffling cards, adding numbers — these are all the same mathematical structure.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A <strong>group</strong> <Latex>{'$(G, \\cdot)$'}</Latex> is a set <Latex>{'$G$'}</Latex> equipped with a binary operation
                                                    that combines any two elements to produce another. Groups are the mathematical language of symmetry.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Four Axioms',
                                    content: (
                                        <div>
                                            <Reading>
                                                <div className="bg-[var(--surface-2)] p-5 rounded-xl my-4 border border-[var(--border)] space-y-3">
                                                    <div className="border-l-4 border-indigo-400 pl-4">
                                                        <p className="font-bold text-sm">1. Closure</p>
                                                        <Latex>{'$\\forall a, b \\in G :\; a \\cdot b \\in G$'}</Latex>
                                                    </div>
                                                    <div className="border-l-4 border-violet-400 pl-4">
                                                        <p className="font-bold text-sm">2. Associativity</p>
                                                        <Latex>{'$(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$'}</Latex>
                                                    </div>
                                                    <div className="border-l-4 border-emerald-400 pl-4">
                                                        <p className="font-bold text-sm">3. Identity</p>
                                                        <Latex>{'$\\exists e \\in G :\; e \\cdot a = a \\cdot e = a$'}</Latex>
                                                    </div>
                                                    <div className="border-l-4 border-rose-400 pl-4">
                                                        <p className="font-bold text-sm">4. Inverse</p>
                                                        <Latex>{'$\\forall a \\in G,\; \\exists a^{-1} :\; a \\cdot a^{-1} = e$'}</Latex>
                                                    </div>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Examples',
                                    content: (
                                        <div>
                                            <Reading>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                                                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                                                        <p className="font-bold text-sm mb-1">Integers under addition</p>
                                                        <p className="text-xs text-[var(--muted)]"><Latex>{'$(\\mathbb{Z}, +)$'}</Latex>: identity = 0, inverse of <Latex>{'$n$'}</Latex> is <Latex>{'$-n$'}</Latex>.</p>
                                                    </div>
                                                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                                                        <p className="font-bold text-sm mb-1">Triangle symmetries</p>
                                                        <p className="text-xs text-[var(--muted)]"><Latex>{'$D_3$'}</Latex>: 6 symmetries (3 rotations + 3 reflections).</p>
                                                    </div>
                                                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                                                        <p className="font-bold text-sm mb-1">Permutations</p>
                                                        <p className="text-xs text-[var(--muted)]"><Latex>{'$S_n$'}</Latex>: all reorderings of <Latex>{'$n$'}</Latex> objects. <Latex>{'$|S_n|=n!$'}</Latex></p>
                                                    </div>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: groupAxiomsLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="group_axioms.py" runnable code={`D3 = {
    'e':  [0, 1, 2],
    'r':  [2, 0, 1],
    'r2': [1, 2, 0],
    's1': [0, 2, 1],
    's2': [2, 1, 0],
    's3': [1, 0, 2],
}

def compose(a, b):
    return [b[a[i]] for i in range(3)]

def find_op(perm, group):
    for name, p in group.items():
        if p == perm:
            return name

perms = list(D3.values())
for p1 in perms:
    for p2 in perms:
        result = compose(p1, p2)
        assert result in perms

print("D3 is closed under composition")
print("Order:", len(D3))

pairs = [('r', 's1'), ('s1', 'r'), ('r', 'r2')]
for a_name, b_name in pairs:
    c = compose(D3[a_name], D3[b_name])
    print(f"{a_name} o {b_name} = {find_op(c, D3)}")
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Verify Group Axioms"
                                prompt="Implement a function that checks whether a finite set with a binary operation satisfies all four group axioms."
                                starterCode={AXIOMS_EXERCISE.starter}
                                checks={AXIOMS_EXERCISE.checks}
                                solution={AXIOMS_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={AXIOMS_QUIZ} title="Check: Group Axioms" /> },
                ]} />
            </Card>

            <Card title="Subgroups &amp; Cosets">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Subgroups',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A subgroup is a group living inside a larger group — a self-contained subset under the same operation.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A subset <Latex>{'$H \\subseteq G$'}</Latex> is a <strong>subgroup</strong> (<Latex>{'$H \\leq G$'}</Latex>) if
                                                    <Latex>{'$e \\in H$'}</Latex>, and <Latex>{'$H$'}</Latex> is closed under the operation and inverses.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Cosets',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    Given <Latex>{'$H \\leq G$'}</Latex> and <Latex>{'$g \\in G$'}</Latex>, the <strong>left coset</strong> is:
                                                </p>
                                                <FormulaBox>
                                                    <Latex>{'$$gH = \\{g \\cdot h \\mid h \\in H\\}$$'}</Latex>
                                                </FormulaBox>
                                                <p>Cosets are either identical or disjoint, partitioning <Latex>{'$G$'}</Latex> into equal-sized pieces.</p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: "Lagrange's Theorem",
                                    content: (
                                        <div>
                                            <TheoremBox title="Lagrange's Theorem">
                                                <div className="text-center my-2">
                                                    <Latex>{'$$|G| = |H| \\times [G : H]$$'}</Latex>
                                                </div>
                                                <p>The order of any subgroup divides the order of the group.</p>
                                            </TheoremBox>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: subgroupLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="subgroups_cosets.py" runnable code={`def cosets(n, H):
    visited = set()
    result = []
    for g in range(n):
        if g in visited:
            continue
        coset = sorted({(g + h) % n for h in H})
        result.append(coset)
        for el in coset:
            visited.add(el)
    return result

G_order = 12
H = [0, 4, 8]
partition = cosets(G_order, H)
print(f"|G|={G_order}, |H|={len(H)}, cosets={len(partition)}")
print(f"Lagrange: {G_order} = {len(H)} x {len(partition)}")
for i, c in enumerate(partition):
    print(f"  Coset {i}: {c}")
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Compute Cosets"
                                prompt="Compute all left cosets of a subgroup H in the cyclic group Z_n."
                                starterCode={SUBGROUP_EXERCISE.starter}
                                checks={SUBGROUP_EXERCISE.checks}
                                solution={SUBGROUP_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={SUBGROUP_QUIZ} title="Check: Subgroups & Cosets" /> },
                ]} />
            </Card>

            <Card title="Group Homomorphisms">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Structure-Preserving Maps',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A homomorphism is a function between groups that respects how elements combine — it preserves the algebraic shape.
                                            </Intuition>
                                            <Reading>
                                                <p>
                                                    A function <Latex>{'$\\varphi: G \\to H$'}</Latex> is a <strong>group homomorphism</strong> if:
                                                </p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\varphi(a \\cdot b) = \\varphi(a) \\cdot \\varphi(b)$$'}</Latex>
                                                </FormulaBox>
                                                <p>A bijective homomorphism is an <strong>isomorphism</strong>: <Latex>{'$G \\cong H$'}</Latex>.</p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Kernel & Image',
                                    content: (
                                        <div>
                                            <Reading>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                                                        <p className="font-bold text-sm mb-2">Kernel</p>
                                                        <Latex>{'$\\ker(\\varphi) = \\{g \\mid \\varphi(g) = e_H\\}$'}</Latex>
                                                        <p className="text-xs text-amber-800 mt-2">Elements mapped to identity. Normal subgroup of G.</p>
                                                    </div>
                                                    <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-xl">
                                                        <p className="font-bold text-sm mb-2">Image</p>
                                                        <Latex>{'$\\text{Im}(\\varphi) = \\{\\varphi(g) \\mid g \\in G\\}$'}</Latex>
                                                        <p className="text-xs text-emerald-800 mt-2">All outputs. Subgroup of H.</p>
                                                    </div>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Equivariance Connection',
                                    content: (
                                        <div>
                                            <Callout title="Why this matters for Transformers">
                                                Equivariant neural network layers are homomorphisms between representation spaces.
                                                The First Isomorphism Theorem reveals what information is preserved vs discarded.
                                            </Callout>
                                            <TheoremBox title="First Isomorphism Theorem">
                                                <div className="text-center my-2">
                                                    <Latex>{'$$G / \\ker(\\varphi) \\cong \\text{Im}(\\varphi)$$'}</Latex>
                                                </div>
                                            </TheoremBox>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: homomorphismLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="homomorphisms.py" runnable code={`def check_hom(m, n, phi):
    for a in range(m):
        for b in range(m):
            if phi((a+b)%m)%n != (phi(a)+phi(b))%n:
                return False
    return True

phi = lambda x: x % 3
print("phi(x) = x mod 3  (Z_6 -> Z_3)")
print("Is homomorphism:", check_hom(6, 3, phi))

ker = [a for a in range(6) if phi(a) % 3 == 0]
img = sorted(set(phi(a) % 3 for a in range(6)))
print(f"Kernel: {ker}  size={len(ker)}")
print(f"Image:  {img}  size={len(img)}")
print(f"First Iso: 6/{len(ker)} = {6//len(ker)} = {len(img)}")
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Check Homomorphisms"
                                prompt="Implement functions to verify the homomorphism property and compute the kernel."
                                starterCode={HOMO_EXERCISE.starter}
                                checks={HOMO_EXERCISE.checks}
                                solution={HOMO_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={HOMO_QUIZ} title="Check: Homomorphisms" /> },
                ]} />
            </Card>
        </div>
    );
}

type RepresentationTheoryProps = {
    representationLab?: React.ReactNode;
    characterLab?: React.ReactNode;
};

export function RepresentationTheoryContent({ representationLab, characterLab }: RepresentationTheoryProps) {
    return (
        <div className="space-y-10">
            <Card title="Group Representations">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'What is a Representation?',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A representation makes an abstract group concrete by turning each element into a matrix. We can then use all of linear algebra to study the group.
                                            </Intuition>
                                            <Reading>
                                                <p>A <strong>representation</strong> of <Latex>{'$G$'}</Latex> on vector space <Latex>{'$V$'}</Latex> is a homomorphism:</p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\rho: G \\to \\text{GL}(V)$$'}</Latex>
                                                </FormulaBox>
                                                <p>Since <Latex>{'$\\rho$'}</Latex> is a homomorphism: <Latex>{'$\\rho(g_1 g_2) = \\rho(g_1)\\rho(g_2)$'}</Latex>.</p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Irreducible Representations',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    A representation is <strong>irreducible</strong> if it has no proper invariant subspaces.
                                                    Every representation decomposes uniquely as a direct sum of irreps:
                                                </p>
                                                <FormulaBox>
                                                    <Latex>{'$$V \\cong V_1^{\\oplus m_1} \\oplus V_2^{\\oplus m_2} \\oplus \\cdots$$'}</Latex>
                                                </FormulaBox>
                                                <Callout title="Schur's Lemma">
                                                    Any equivariant linear map between two irreps is either zero or an isomorphism.
                                                    This constrains which weight matrices are possible in equivariant networks.
                                                </Callout>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'The Cyclic Group',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    <Latex>{'$C_n$'}</Latex> has exactly <strong>n distinct 1D irreps</strong>:
                                                </p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\rho_k(g^j) = e^{2\\pi i jk/n} = \\omega^{jk}$$'}</Latex>
                                                </FormulaBox>
                                                <p>
                                                    The Discrete Fourier Transform is precisely the decomposition of a function on
                                                    <Latex>{'$\\mathbb{Z}_n$'}</Latex> into these irreps.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: representationLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="representations.py" runnable code={`import numpy as np

def cyclic_rep(n, k):
    """k-th 1D irrep of C_n at each element g^j."""
    j = np.arange(n)
    return np.exp(2j * np.pi * j * k / n)

n = 6
print(f"C_{n} representations (real parts):")
for k in range(n):
    rho = cyclic_rep(n, k)
    print(f"  rho_{k}: {np.round(rho.real, 3)}")

print()
rho2 = cyclic_rep(n, 2)
print("Verify homomorphism: rho_2(g^3) = rho_2(g)^3 ?")
print(f"  rho_2(g^3) = {rho2[3]:.4f}")
print(f"  rho_2(g)^3 = {rho2[1]**3:.4f}")
print(f"  Match: {np.isclose(rho2[3], rho2[1]**3)}")
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Cyclic Group Representations"
                                prompt="Implement the k-th 1D representation of C_n and verify the homomorphism property."
                                starterCode={REP_EXERCISE.starter}
                                checks={REP_EXERCISE.checks}
                                solution={REP_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={REP_QUIZ} title="Check: Group Representations" /> },
                ]} />
            </Card>

            <Card title="Character Theory">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Characters',
                                    content: (
                                        <div>
                                            <Intuition>
                                                A character condenses a whole matrix representation into a single number per group element — the trace. Like a fingerprint, it uniquely identifies the representation.
                                            </Intuition>
                                            <Reading>
                                                <p>The <strong>character</strong> of representation <Latex>{'$\\rho$'}</Latex>:</p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\chi(g) = \\text{Tr}(\\rho(g))$$'}</Latex>
                                                </FormulaBox>
                                                <p>Two representations are equivalent iff they have the same character.</p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Class Functions',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    Characters are <strong>class functions</strong> — constant on conjugacy classes.
                                                    If <Latex>{'$g_1 = h g_2 h^{-1}$'}</Latex>:
                                                </p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\chi(g_1) = \\chi(g_2)$$'}</Latex>
                                                </FormulaBox>
                                                <p>
                                                    This means the character table is <Latex>{'$k \\times k$'}</Latex> where <Latex>{'$k$'}</Latex> is
                                                    the number of conjugacy classes — often much smaller than <Latex>{'$|G|$'}</Latex>.
                                                </p>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Orthogonality',
                                    content: (
                                        <div>
                                            <TheoremBox title="Row Orthogonality">
                                                <div className="text-center my-2">
                                                    <Latex>{'$$\\frac{1}{|G|} \\sum_{g \\in G} \\chi_i(g) \\overline{\\chi_j(g)} = \\delta_{ij}$$'}</Latex>
                                                </div>
                                                <p>Irreducible characters form an orthonormal basis for class functions.</p>
                                            </TheoremBox>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: characterLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="characters.py" runnable code={`import numpy as np

S3 = np.array([[1,1,1],[1,-1,1],[2,0,-1]])
class_sizes = np.array([1,3,2])
order = 6

def ip(ci, cj):
    return np.real(np.dot(class_sizes*ci, np.conj(cj)))/order

print("S_3 Character Table:")
print(S3)
print()

n = len(S3)
gram = [[ip(S3[i], S3[j]) for j in range(n)] for i in range(n)]
print("Gram matrix:")
for row in gram:
    print([round(v, 3) for v in row])
print("Is identity?", np.allclose(gram, np.eye(n)))
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Character Orthogonality"
                                prompt="Compute the character inner product and verify orthonormality for S_3."
                                starterCode={CHAR_EXERCISE.starter}
                                checks={CHAR_EXERCISE.checks}
                                solution={CHAR_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={CHAR_QUIZ} title="Check: Character Theory" /> },
                ]} />
            </Card>
        </div>
    );
}

type ApplicationsProps = {
    equivarianceLab?: React.ReactNode;
};

export function ApplicationsContent({ equivarianceLab }: ApplicationsProps) {
    return (
        <div className="space-y-10">
            <Card title="Symmetry in Transformers">
                <Tabs tabs={[
                    {
                        id: 'concept', label: 'Concept', icon: conceptIcon,
                        content: (
                            <ConceptStepper steps={[
                                {
                                    label: 'Invariance vs Equivariance',
                                    content: (
                                        <div>
                                            <Intuition>
                                                Invariance: output does not change when input is transformed. Equivariance: output transforms in the same way. Classification is invariant; pose estimation is equivariant.
                                            </Intuition>
                                            <Reading>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                                                        <p className="font-bold text-sm mb-2">Invariant</p>
                                                        <Latex>{'$f(g \\cdot x) = f(x)$'}</Latex>
                                                        <p className="text-xs text-[var(--muted)] mt-2">For classification heads, global pooling.</p>
                                                    </div>
                                                    <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                                                        <p className="font-bold text-sm mb-2">Equivariant</p>
                                                        <Latex>{'$f(g \\cdot x) = g \\cdot f(x)$'}</Latex>
                                                        <p className="text-xs text-[var(--muted)] mt-2">For intermediate layers that preserve structure.</p>
                                                    </div>
                                                </div>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Self-Attention as Permutation Equivariance',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>Standard self-attention is equivariant under <Latex>{'$S_n$'}</Latex>:</p>
                                                <FormulaBox>
                                                    <Latex>{'$$\\text{Attn}(P\\mathbf{X}) = P\\,\\text{Attn}(\\mathbf{X}) \\quad \\forall P \\in S_n$$'}</Latex>
                                                </FormulaBox>
                                                <p>
                                                    Positional encodings intentionally break this <Latex>{'$S_n$'}</Latex> symmetry when order matters.
                                                </p>
                                                <Callout title="Why equivariance helps">
                                                    Equivariant layers generalize better: the network learns one representation for each
                                                    pattern, valid across all group transformations, rather than one per transformation.
                                                </Callout>
                                            </Reading>
                                        </div>
                                    ),
                                },
                                {
                                    label: 'Equivariant Attention',
                                    content: (
                                        <div>
                                            <Reading>
                                                <p>
                                                    SE(3)-Transformers and Equiformer extend attention to <Latex>{'$SO(3)$'}</Latex> equivariance
                                                    for 3D molecular data. By Schur's Lemma, equivariant weight matrices must have a
                                                    structured sparse form determined by the irrep decomposition.
                                                </p>
                                                <TheoremBox title="Weight Constraints from Schur's Lemma">
                                                    <p>
                                                        A linear map <Latex>{'$W: V_i \\to V_j$'}</Latex> between irrep spaces commutes with the
                                                        group action only if <Latex>{'$\\rho_i \\cong \\rho_j$'}</Latex> (and then <Latex>{'$W = \\lambda I$'}</Latex>).
                                                        This dramatically reduces free parameters.
                                                    </p>
                                                </TheoremBox>
                                            </Reading>
                                        </div>
                                    ),
                                },
                            ]} />
                        ),
                    },
                    { id: 'visualize', label: 'Visualize', icon: visualizeIcon, content: equivarianceLab },
                    {
                        id: 'code', label: 'Code', icon: codeIcon,
                        content: (
                            <Reading>
                                <CodeBlock title="equivariance.py" runnable code={`import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def self_attention(X, Wq, Wk, Wv):
    d = X.shape[-1]
    Q, K, V = X @ Wq, X @ Wk, X @ Wv
    return softmax(Q @ K.T / np.sqrt(d)) @ V

np.random.seed(42)
n, d = 4, 8
X = np.random.randn(n, d)
Wq = np.random.randn(d, d) * 0.3
Wk = np.random.randn(d, d) * 0.3
Wv = np.random.randn(d, d) * 0.3

perm = [2, 0, 3, 1]
out_then_perm = self_attention(X, Wq, Wk, Wv)[perm]
out_after_perm = self_attention(X[perm], Wq, Wk, Wv)

print("Attn(X)[perm] == Attn(X[perm])?",
      np.allclose(out_then_perm, out_after_perm))
print("Self-attention IS permutation equivariant")
`} />
                            </Reading>
                        ),
                    },
                    {
                        id: 'exercise', label: 'Exercise', icon: exerciseIcon,
                        content: (
                            <CodingExercise bare title="Exercise: Test Permutation Equivariance"
                                prompt="Implement a general test for permutation equivariance and apply it to different layer types."
                                starterCode={APPS_EXERCISE.starter}
                                checks={APPS_EXERCISE.checks}
                                solution={APPS_EXERCISE.solution}
                            />
                        ),
                    },
                    { id: 'quiz', label: 'Quiz', icon: quizIcon, content: <Quiz bare questions={APPS_QUIZ} title="Check: Symmetry in Transformers" /> },
                ]} />
            </Card>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════════════════
   Backward-compatible default export
   ════════════════════════════════════════════════════════════════════════════ */

export default function GroupTheoryContent() {
    return (
        <div className="space-y-10">
            <BasicConceptsContent />
            <RepresentationTheoryContent />
            <ApplicationsContent />
        </div>
    );
}
