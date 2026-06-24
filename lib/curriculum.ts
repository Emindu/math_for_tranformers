// ─────────────────────────────────────────────────────────────────────────────
// Curriculum: the single source of truth for the course structure.
//
// Every navigational surface — the sidebar, breadcrumbs, previous/next lesson
// links, and the home page — is generated from the data below. To add or
// reorder a lesson, edit this file only; nothing else needs to change.
//
// `href` values are app-relative (no basePath). Always render them through
// next/link, which prepends the GitHub Pages basePath automatically.
// ─────────────────────────────────────────────────────────────────────────────

export type Lesson = {
  /** App-relative route, e.g. "/chapter-1/vector-spaces". */
  href: string;
  /** Lesson title shown in nav, breadcrumbs, and the lesson header. */
  title: string;
  /** One-sentence summary used on the home page and section overviews. */
  blurb: string;
  /** Rough reading + interaction time in minutes. */
  minutes?: number;
};

export type Section = {
  /** Stable id used for keys and active-state matching. */
  id: string;
  /** Display number shown as a chip, e.g. "1.2". */
  number: string;
  /** Section title. */
  title: string;
  /** Short description of the section as a whole. */
  description: string;
  /**
   * Route of the section overview page, if one exists. When omitted, links to
   * the section resolve to its first lesson.
   */
  overviewHref?: string;
  lessons: Lesson[];
};

export const course = {
  title: "The Geometry of Intelligence",
  subtitle: "The mathematical foundations of Transformer networks",
  chapter: "Chapter 1",
};

export const sections: Section[] = [
  {
    id: "vectors",
    number: "1.1",
    title: "Vectors",
    description:
      "How machines represent the world: vector spaces, the linear maps that act on them, and their eigenstructure.",
    lessons: [
      {
        href: "/chapter-1/vector-spaces",
        title: "Vector Spaces",
        blurb:
          "Vector spaces, the ten axioms, subspaces, span, and basis — the backbone of Transformers.",
        minutes: 25,
      },
      {
        href: "/chapter-1/linear-transformations",
        title: "Linear Transformations",
        blurb:
          "How matrices transform space: kernels, images, and the building blocks of neural networks.",
        minutes: 25,
      },
      {
        href: "/chapter-1/eigenvalues-eigenvectors",
        title: "Eigenvalues & Eigenvectors",
        blurb:
          "Principal directions of transformations, spectral decomposition, and their role in attention.",
        minutes: 30,
      },
    ],
  },
  {
    id: "group-theory",
    number: "1.2",
    title: "Group Theory & Symmetries",
    description:
      "The algebra of symmetry, from group axioms to the equivariant structure of Transformer networks.",
    overviewHref: "/chapter-1/group-theory",
    lessons: [
      {
        href: "/chapter-1/group-theory/basic-concepts",
        title: "Basic Concepts of Group Theory",
        blurb:
          "Groups, subgroups, cosets, Lagrange's theorem, and group homomorphisms.",
        minutes: 30,
      },
      {
        href: "/chapter-1/group-theory/representation-theory",
        title: "Representation Theory of Finite Groups",
        blurb:
          "Group representations, character theory, and orthogonality relations.",
        minutes: 30,
      },
      {
        href: "/chapter-1/group-theory/applications",
        title: "Applications to Transformers",
        blurb:
          "How invariance and equivariance power modern Transformer architectures.",
        minutes: 25,
      },
    ],
  },
  {
    id: "metric-spaces",
    number: "1.3",
    title: "Metric Spaces & Topology",
    description:
      "Distance, convergence, and continuity — the topological preliminaries behind embeddings.",
    overviewHref: "/chapter-1/metric-spaces",
    lessons: [
      {
        href: "/chapter-1/metric-spaces/definition",
        title: "Definition of Metric Spaces",
        blurb:
          "Metric axioms, distance functions, convergence, Cauchy sequences, and completeness.",
        minutes: 25,
      },
      {
        href: "/chapter-1/metric-spaces/topology",
        title: "Topology of Metric Spaces",
        blurb: "Open and closed sets, ε–δ continuity, compactness, and Heine–Borel.",
        minutes: 25,
      },
      {
        href: "/chapter-1/metric-spaces/mappings",
        title: "Mappings Between Metric Spaces",
        blurb:
          "Isometries, contractions, the Banach fixed-point theorem, and ML applications.",
        minutes: 25,
      },
    ],
  },
  {
    id: "attention-foundations",
    number: "1.4",
    title: "Foundations of Attention",
    description:
      "The mathematics of attention as a mapping, and the high-dimensional geometry it lives in.",
    overviewHref: "/chapter-1/attention-foundations",
    lessons: [
      {
        href: "/chapter-1/attention-foundations/attention-as-mapping",
        title: "Attention as a Mapping",
        blurb:
          "Scaled dot-product attention, the Q/K/V formulation, and softmax normalization.",
        minutes: 25,
      },
      {
        href: "/chapter-1/attention-foundations/high-dimensional-geometry",
        title: "High-Dimensional Geometry",
        blurb:
          "The curse of dimensionality, concentration of measure, and geometric intuition for attention.",
        minutes: 25,
      },
      {
        href: "/chapter-1/attention-foundations/applications",
        title: "Applications in Architectures",
        blurb:
          "Multi-head and cross-attention, encoder–decoder patterns, and design principles.",
        minutes: 25,
      },
    ],
  },
  {
    id: "tensor-algebra",
    number: "1.5",
    title: "Tensor Algebra & Notation",
    description:
      "The data structures and algebraic operations behind every computation inside a Transformer.",
    overviewHref: "/chapter-1/tensor-algebra",
    lessons: [
      {
        href: "/chapter-1/tensor-algebra/introduction-to-tensors",
        title: "Introduction to Tensors",
        blurb: "Tensor definitions, order and rank, tensor products, and notation.",
        minutes: 25,
      },
      {
        href: "/chapter-1/tensor-algebra/algebraic-structures",
        title: "Algebraic Structures in Transformers",
        blurb:
          "How tensor algebra underpins embeddings, attention, and feed-forward networks.",
        minutes: 25,
      },
      {
        href: "/chapter-1/tensor-algebra/self-attention",
        title: "Self-Attention Mechanisms",
        blurb:
          "A tensor-algebraic perspective on self-attention and the Transformer computational graph.",
        minutes: 30,
      },
    ],
  },
  {
    id: "matrix-calculus",
    number: "1.6",
    title: "Matrix Calculus",
    description:
      "Differentiating matrix functions and tracing how gradients flow through attention layers.",
    overviewHref: "/chapter-1/matrix-calculus",
    lessons: [
      {
        href: "/chapter-1/matrix-calculus/differentiation",
        title: "Differentiation of Matrix Functions",
        blurb:
          "Derivatives of scalar, vector, and matrix functions — the chain rule for backprop.",
        minutes: 30,
      },
      {
        href: "/chapter-1/matrix-calculus/gradient-flow",
        title: "Optimization & Gradient Flow",
        blurb:
          "Gradient descent on matrix-valued losses and how gradients move through attention.",
        minutes: 30,
      },
    ],
  },
  {
    id: "positional-encodings",
    number: "1.7",
    title: "Positional Encodings",
    description:
      "Injecting sequence order into a permutation-equivariant model, through Fourier and Lie theory.",
    overviewHref: "/chapter-1/positional-encodings",
    lessons: [
      {
        href: "/chapter-1/positional-encodings/fourier-analysis",
        title: "Fourier Analysis of Encodings",
        blurb:
          "Positional encodings through continuous representations and Fourier series.",
        minutes: 25,
      },
      {
        href: "/chapter-1/positional-encodings/lie-groups",
        title: "Lie Groups & Lie Algebras",
        blurb:
          "The continuous symmetries of Transformers via Lie-theoretic constraints on translation.",
        minutes: 30,
      },
      {
        href: "/chapter-1/positional-encodings/harmonic-analysis",
        title: "Harmonic Analysis of Groups",
        blurb:
          "Generalizing Fourier analysis to non-commutative spaces and group representations.",
        minutes: 30,
      },
    ],
  },
  {
    id: "geometric-structures",
    number: "1.8",
    title: "Geometric Structures",
    description:
      "The hidden geometry of Transformers: embedding manifolds, symmetries, and what they imply for design.",
    overviewHref: "/chapter-1/geometric-structures",
    lessons: [
      {
        href: "/chapter-1/geometric-structures/embedding-spaces",
        title: "Embedding Spaces & Manifolds",
        blurb: "Transformer embeddings as points moving on high-dimensional manifolds.",
        minutes: 25,
      },
      {
        href: "/chapter-1/geometric-structures/symmetries",
        title: "Symmetries & Transformations",
        blurb:
          "How structural symmetries shape the geometry of Transformer layers.",
        minutes: 25,
      },
      {
        href: "/chapter-1/geometric-structures/model-design",
        title: "Implications for Model Design",
        blurb: "Using geometric insight to design better architectures.",
        minutes: 25,
      },
    ],
  },
  {
    id: "function-approximation",
    number: "1.9",
    title: "Function Approximation",
    description:
      "Neural networks as function approximators, and the theory of how well Transformers can represent targets.",
    overviewHref: "/chapter-1/function-approximation",
    lessons: [
      {
        href: "/chapter-1/function-approximation/introduction",
        title: "Introduction to Approximation Theory",
        blurb: "The mathematical foundations of approximating complex functions.",
        minutes: 20,
      },
      {
        href: "/chapter-1/function-approximation/universal-approximation",
        title: "Universal Approximation Theorems",
        blurb: "Why neural networks can, in principle, learn any function.",
        minutes: 25,
      },
      {
        href: "/chapter-1/function-approximation/expressivity",
        title: "Expressivity in Transformers",
        blurb: "The space of functions Transformers can approximate.",
        minutes: 25,
      },
    ],
  },
  {
    id: "optimization-techniques",
    number: "1.10",
    title: "Optimization Techniques",
    description:
      "Minimizing loss in high-dimensional non-convex landscapes with gradient-based methods.",
    overviewHref: "/chapter-1/optimization-techniques",
    lessons: [
      {
        href: "/chapter-1/optimization-techniques/gradient-descent",
        title: "Gradient Descent & Variants",
        blurb: "The foundational minimization algorithms, including SGD and Adam.",
        minutes: 25,
      },
      {
        href: "/chapter-1/optimization-techniques/saddle-points",
        title: "Saddle Points & Local Minima",
        blurb: "Navigating high-dimensional non-convex loss landscapes.",
        minutes: 25,
      },
      {
        href: "/chapter-1/optimization-techniques/convergence",
        title: "Convergence Analysis",
        blurb: "Theoretical guarantees for optimization methods in deep learning.",
        minutes: 30,
      },
    ],
  },
  {
    id: "measure-theory",
    number: "1.11",
    title: "Measure & Information Theory",
    description:
      "Probability, measure, and information content — and how they govern complexity and generalization.",
    overviewHref: "/chapter-1/measure-theory",
    lessons: [
      {
        href: "/chapter-1/measure-theory/basic-probability",
        title: "Basic Probability Concepts",
        blurb: "Random variables, distributions, and expectations.",
        minutes: 25,
      },
      {
        href: "/chapter-1/measure-theory/foundations-of-measure-theory",
        title: "Foundations of Measure Theory",
        blurb: "Formalizing probability through σ-algebras and measurable spaces.",
        minutes: 30,
      },
      {
        href: "/chapter-1/measure-theory/mutual-information",
        title: "Mutual Information",
        blurb: "Quantifying dependence and information overlap between variables.",
        minutes: 25,
      },
      {
        href: "/chapter-1/measure-theory/complexity",
        title: "Complexity & Generalization",
        blurb: "Connecting information theory to model performance bounds.",
        minutes: 30,
      },
    ],
  },
  {
    id: "backprop-autodiff",
    number: "1.12",
    title: "Backpropagation & Autodiff",
    description:
      "The algorithms that power deep learning: the chain rule, computational graphs, and training challenges.",
    lessons: [
      {
        href: "/chapter-1/backprop-autodiff/backpropagation",
        title: "Backpropagation",
        blurb:
          "Distributing error backwards using matrix calculus and the chain rule.",
        minutes: 30,
      },
      {
        href: "/chapter-1/backprop-autodiff/automatic-differentiation",
        title: "Automatic Differentiation",
        blurb: "Implementing derivatives programmatically via forward and reverse modes.",
        minutes: 25,
      },
      {
        href: "/chapter-1/backprop-autodiff/optimization-challenges",
        title: "Optimization Challenges",
        blurb:
          "Vanishing and exploding gradients, and mitigations like clipping and initialization.",
        minutes: 25,
      },
    ],
  },
  {
    id: "statistical-learning",
    number: "1.13",
    title: "Statistical Learning Theory",
    description:
      "The mathematical limits of learning: complexity, data dependency, and generalization risk.",
    lessons: [
      {
        href: "/chapter-1/statistical-learning/foundation",
        title: "Foundations of Statistical Learning",
        blurb:
          "Empirical risk minimization and generalization bounds via Hoeffding's inequality.",
        minutes: 30,
      },
      {
        href: "/chapter-1/statistical-learning/vc-dimension",
        title: "VC Dimension & Capacity",
        blurb: "Measuring model flexibility and structural capacity.",
        minutes: 25,
      },
      {
        href: "/chapter-1/statistical-learning/rademacher-complexity",
        title: "Rademacher Complexity",
        blurb:
          "A data-dependent view of complexity: a model's capacity to fit random noise.",
        minutes: 30,
      },
    ],
  },
  {
    id: "probabilistic-perspectives",
    number: "1.14",
    title: "Probabilistic Perspectives",
    description:
      "Embracing uncertainty: Bayesian inference over parameters and PAC-Bayes generalization bounds.",
    overviewHref: "/chapter-1/probabilistic-perspectives",
    lessons: [
      {
        href: "/chapter-1/probabilistic-perspectives/bayesian-inference",
        title: "Bayesian Inference in Transformers",
        blurb:
          "Posterior distributions over weights and epistemic uncertainty via MC dropout.",
        minutes: 30,
      },
      {
        href: "/chapter-1/probabilistic-perspectives/pac-bayes",
        title: "PAC-Bayes Bounds",
        blurb: "Bridging PAC learning and Bayesian priors to bound true risk.",
        minutes: 25,
      },
      {
        href: "/chapter-1/probabilistic-perspectives/generalization-practice",
        title: "Generalization in Practice",
        blurb:
          "Scaling laws, grokking, and double descent in modern models.",
        minutes: 25,
      },
    ],
  },
];

// ── Derived helpers ──────────────────────────────────────────────────────────

/** All lessons flattened in course order. */
export const allLessons: Lesson[] = sections.flatMap((s) => s.lessons);

/** The link a section's title/overview should point to. */
export function sectionHref(section: Section): string {
  return section.overviewHref ?? section.lessons[0]?.href ?? "/";
}

export type LessonLocation = {
  section: Section;
  lesson: Lesson;
  index: number;
  prev?: Lesson;
  next?: Lesson;
};

/** Find a lesson (and its neighbours) by app-relative pathname. */
export function findLesson(pathname: string): LessonLocation | undefined {
  const path = normalize(pathname);
  for (const section of sections) {
    const lessonIndex = section.lessons.findIndex(
      (l) => normalize(l.href) === path
    );
    if (lessonIndex !== -1) {
      const globalIndex = allLessons.findIndex(
        (l) => normalize(l.href) === path
      );
      return {
        section,
        lesson: section.lessons[lessonIndex],
        index: globalIndex,
        prev: allLessons[globalIndex - 1],
        next: allLessons[globalIndex + 1],
      };
    }
  }
  return undefined;
}

/** Find a section by its overview pathname. */
export function findSectionByOverview(pathname: string): Section | undefined {
  const path = normalize(pathname);
  return sections.find(
    (s) => s.overviewHref && normalize(s.overviewHref) === path
  );
}

/** Strip the basePath prefix and any trailing slash so routes compare equal. */
export function normalize(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  let p = pathname;
  if (base && p.startsWith(base)) p = p.slice(base.length);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}
