import AttentionMatrixLab from "@/components/math-viz/AttentionMatrixLab";
import VectorPlayground from "@/components/math-viz/VectorPlayground";
import { MoveRight, Hexagon, Activity, Network } from "lucide-react";

// GitHub Pages serves the app under a sub-path; prefix internal links with it.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            VisTransformer
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            The Geometry of Intelligence. Explore the mathematical foundations of Transformer networks through interactive visualizations.
          </p>
          <a href="#demo" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors">
            Start Exploring <MoveRight size={20} />
          </a>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Start Learning</h2>
            <p className="text-slate-600 mt-2">Follow the chapters to master the concepts</p>
          </div>

          <div className="space-y-16">
            {/* Section 1: Vectors */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">1. Vectors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Chapter 1.1: Vector Spaces */}
                <a href={`${basePath}/chapter-1/vector-spaces`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.1</span>
                    <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    Vector Spaces
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Understand how machines view the world. Dive into vector spaces, axioms, and why they form the backbone of Transformers.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.2: Linear Transformations */}
                <a href={`${basePath}/chapter-1/linear-transformations`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.2</span>
                    <MoveRight className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Linear Transformations
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Explore how matrices transform space. Learn about kernels, images, and why they are the building blocks of neural networks.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.3: Eigenvalues & Eigenvectors */}
                <a href={`${basePath}/chapter-1/eigenvalues-eigenvectors`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.3</span>
                    <MoveRight className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                    Eigenvalues & Eigenvectors
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Discover the principal directions of transformations. Learn about spectral decomposition and its role in attention mechanisms.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-violet-600 font-medium">
                    Start Chapter
                  </div>
                </a>
              </div>
            </div>

            {/* Section 2: Group Theory and Symmetries */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">2. Group Theory and Symmetries</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Chapter 1.2.1: Basic Concepts */}
                <a href={`${basePath}/chapter-1/group-theory/basic-concepts`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-pink-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.2.1</span>
                    <MoveRight className="text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                    Basic Concepts of Group Theory
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Explore groups, subgroups, cosets, Lagrange&apos;s theorem, and group homomorphisms with interactive visualizations.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.2.2: Representation Theory */}
                <a href={`${basePath}/chapter-1/group-theory/representation-theory`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-violet-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.2.2</span>
                    <MoveRight className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                    Representation Theory of Finite Groups
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Group representations, character theory, orthogonality relations, and their connections to geometry and physics.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-violet-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.2.3: Applications */}
                <a href={`${basePath}/chapter-1/group-theory/applications`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-amber-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.2.3</span>
                    <MoveRight className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                    Applications to Transformers
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    How invariance and equivariance from group theory power modern transformer architectures.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                    Start Chapter
                  </div>
                </a>
              </div>
            </div>

            {/* Section 3: Metric Spaces and Topological Preliminaries */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">3. Metric Spaces and Topological Preliminaries</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <a href={`${basePath}/chapter-1/metric-spaces/definition`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.3.1</span>
                    <MoveRight className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    Definition of Metric Spaces
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Metric axioms, distance functions, examples, convergence, Cauchy sequences, and completeness.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                    Start Chapter
                  </div>
                </a>
                <a href={`${basePath}/chapter-1/metric-spaces/topology`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.3.2</span>
                    <MoveRight className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                    Topology of Metric Spaces
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Open and closed sets, ε-δ continuity, compactness, and Heine–Borel theorem.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                    Start Chapter
                  </div>
                </a>
                <a href={`${basePath}/chapter-1/metric-spaces/mappings`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.3.3</span>
                    <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    Mappings Between Metric Spaces
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Isometries, contractions, Banach fixed-point theorem, and ML applications.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    Start Chapter
                  </div>
                </a>
              </div>
            </div>

            {/* Section 4: Mathematical Foundations of Attention */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">4. Mathematical Foundations of Attention</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Chapter 1.4.1: Attention as a Mapping */}
                <a href={`${basePath}/chapter-1/attention-foundations/attention-as-mapping`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.4.1</span>
                    <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    Attention as a Mapping
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Scaled dot-product attention, Q/K/V formulation, softmax normalization, and key mathematical properties.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.4.2: High-Dimensional Geometry */}
                <a href={`${basePath}/chapter-1/attention-foundations/high-dimensional-geometry`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-rose-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.4.2</span>
                    <MoveRight className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                    The Geometry of High-Dimensional Spaces
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Curse of dimensionality, concentration of measure, and geometric intuitions for attention.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-rose-600 font-medium">
                    Start Chapter
                  </div>
                </a>

                {/* Chapter 1.4.3: Applications */}
                <a href={`${basePath}/chapter-1/attention-foundations/applications`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.4.3</span>
                    <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    Applications in Transformer Architectures
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Multi-head attention, cross-attention, encoder-decoder patterns, and architectural design principles.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    Start Chapter
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: Tensor Algebra and Notation ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <span className="text-violet-600 font-semibold text-sm tracking-wider uppercase">Section 5</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">Tensor Algebra and Notation</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              The fundamental data structures and algebraic operations that power
              every computation inside a transformer architecture.
            </p>
            <a href={`${basePath}/chapter-1/tensor-algebra`} className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 font-semibold mt-3 transition-colors">
              View All Subsections <MoveRight size={16} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chapter 1.5.1: Introduction to Tensors */}
            <a href={`${basePath}/chapter-1/tensor-algebra/introduction-to-tensors`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-violet-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.5.1</span>
                <MoveRight className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                Introduction to Tensors
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Tensor definitions, order and rank, tensor products, and notation conventions.
              </p>
              <div className="flex items-center gap-2 text-sm text-violet-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.5.2: Algebraic Structures */}
            <a href={`${basePath}/chapter-1/tensor-algebra/algebraic-structures`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.5.2</span>
                <MoveRight className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                Algebraic Structures in Transformers
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                How tensor algebra underpins key operations — from embeddings to feed-forward networks.
              </p>
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.5.3: Self-Attention */}
            <a href={`${basePath}/chapter-1/tensor-algebra/self-attention`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-amber-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.5.3</span>
                <MoveRight className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                Self-Attention Mechanisms
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                A tensor-algebraic perspective on self-attention and the computational graph of transformers.
              </p>
              <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                Start Chapter
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Section 6: Matrix Calculus in Self-attention */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <span className="text-rose-600 font-bold text-sm tracking-wider uppercase">Section 6</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Matrix Calculus in Self-attention</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              The mathematical machinery for training transformers — differentiating matrix functions,
              computing gradients through attention layers, and optimization.
            </p>
            <a href={`${basePath}/chapter-1/matrix-calculus`} className="inline-flex items-center gap-1 mt-3 text-rose-600 font-semibold text-sm hover:underline">
              View All Subsections →
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Chapter 1.6.1: Differentiation */}
            <a href={`${basePath}/chapter-1/matrix-calculus/differentiation`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-rose-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.6.1</span>
                <MoveRight className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                Differentiation of Matrix Functions
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Derivatives of scalar, vector, and matrix functions — the chain rule for backpropagation.
              </p>
              <div className="flex items-center gap-2 text-sm text-rose-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.6.2: Optimization and Gradient Flow */}
            <a href={`${basePath}/chapter-1/matrix-calculus/gradient-flow`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.6.2</span>
                <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Optimization and Gradient Flow
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Gradient descent on matrix-valued loss functions and how gradients flow through attention.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                Start Chapter
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Section 7: Positional Encodings */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <span className="text-blue-600 font-bold text-sm tracking-wider uppercase">Section 7</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">Positional Encodings: A Mathematical Perspective</h2>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Because self-attention is inherently permutation-equivariant, models require mechanisms to
              inject sequence order. Discover the deep math behind positional representations via Fourier Analysis, Lie Theory, and more.
            </p>
            <a href={`${basePath}/chapter-1/positional-encodings`} className="inline-flex items-center gap-1 mt-3 text-blue-600 font-semibold text-sm hover:underline">
              View All Subsections →
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Chapter 1.7.1: Fourier Analysis */}
            <a href={`${basePath}/chapter-1/positional-encodings/fourier-analysis`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.7.1</span>
                <MoveRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                Fourier Analysis of Positional Encodings
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Viewing positional encodings through the lens of continuous representations and Fourier series.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.7.2: Lie Groups */}
            <a href={`${basePath}/chapter-1/positional-encodings/lie-groups`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.7.2</span>
                <MoveRight className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Lie Groups and Lie Algebras
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The continuous symmetries of transformers, explored via Lie theory constraints on translations.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.7.3: Harmonic Analysis */}
            <a href={`${basePath}/chapter-1/positional-encodings/harmonic-analysis`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.7.3</span>
                <MoveRight className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                Harmonic Analysis of Groups
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Generalizing Fourier analysis to non-commutative spaces and broader group representations.
              </p>
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                Start Chapter
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1.8: Geometric Structures */}
      <section className="max-w-7xl mx-auto mb-20 px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center mb-6">
                <Hexagon className="text-fuchsia-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.8 Geometric Structures in Transformers
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Uncover the hidden geometry within transformer models. We examine how embedding spaces
                act as manifolds and how symmetries inform the flow of data through architectural transformations.
              </p>
              <a href={`${basePath}/chapter-1/geometric-structures`} className="inline-flex items-center gap-2 text-fuchsia-600 font-semibold hover:text-fuchsia-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.8.1: Embedding Spaces */}
            <a href={`${basePath}/chapter-1/geometric-structures/embedding-spaces`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-fuchsia-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.8.1</span>
                <MoveRight className="text-slate-400 group-hover:text-fuchsia-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
                Embedding Spaces and Manifolds
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Viewing transformer embeddings as points moving on high-dimensional manifolds.
              </p>
              <div className="flex items-center gap-2 text-sm text-fuchsia-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.8.2: Symmetries */}
            <a href={`${basePath}/chapter-1/geometric-structures/symmetries`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-rose-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.8.2</span>
                <MoveRight className="text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                Symmetries and Transformations
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                How structural symmetries shape the geometric properties of transformer layers.
              </p>
              <div className="flex items-center gap-2 text-sm text-rose-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.8.3: Model Design */}
            <a href={`${basePath}/chapter-1/geometric-structures/model-design`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-pink-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.8.3</span>
                <MoveRight className="text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                Implications for Model Design
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Leveraging geometric insights for designing better model architectures.
              </p>
              <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.9: Function Approximation Theory */}
      <section className="max-w-7xl mx-auto mb-20 px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Hexagon className="text-teal-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.9 Function Approximation Theory
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                At their core, neural networks are function approximators. Explore the mathematical framework for understanding how effectively transformers can represent complex target functions.
              </p>
              <a href={`${basePath}/chapter-1/function-approximation`} className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.9.1: Introduction */}
            <a href={`${basePath}/chapter-1/function-approximation/introduction`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-teal-100 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.9.1</span>
                <MoveRight className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                Introduction to Approximation Theory
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The mathematical foundations of approximating complex functions.
              </p>
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.9.2: Universal Approximation */}
            <a href={`${basePath}/chapter-1/function-approximation/universal-approximation`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.9.2</span>
                <MoveRight className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                Universal Approximation Theorems
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Why neural networks can theoretically learn any function.
              </p>
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.9.3: Expressivity */}
            <a href={`${basePath}/chapter-1/function-approximation/expressivity`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.9.3</span>
                <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Expressivity in Transformer Models
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Analyzing the diverse space of functions that transformers can approximate.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.10: Optimization Techniques */}
      <section className="max-w-7xl mx-auto mb-20 px-4 border-t border-slate-100 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="text-indigo-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.10 Optimization Techniques
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Optimization techniques are central to training machine learning models. Discover how we adjust model parameters to minimize loss functions using advanced gradient methods.
              </p>
              <a href={`${basePath}/chapter-1/optimization-techniques`} className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.10.1: Gradient Descent */}
            <a href={`${basePath}/chapter-1/optimization-techniques/gradient-descent`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.10.1</span>
                <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Gradient Descent and Variants
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The foundational algorithms for minimizing loss, including SGD and Adam.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.10.2: Saddle Points */}
            <a href={`${basePath}/chapter-1/optimization-techniques/saddle-points`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.10.2</span>
                <MoveRight className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                Saddle Points and Local Minima
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Navigating high-dimensional non-convex loss landscapes.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.10.3: Convergence */}
            <a href={`${basePath}/chapter-1/optimization-techniques/convergence`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-fuchsia-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.10.3</span>
                <MoveRight className="text-slate-400 group-hover:text-fuchsia-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
                Convergence Analysis
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Theoretical guarantees for optimization methods in deep learning.
              </p>
              <div className="flex items-center gap-2 text-sm text-fuchsia-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.11: Measure Theory and Information Theory */}
      <section className="max-w-7xl mx-auto mb-20 px-4 border-t border-slate-100 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                <Hexagon className="text-emerald-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.11 Measure Theory and Information Theory
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Delve into the mathematical foundations of probability, measure, and information content. Understand how these concepts govern the complexity and generalization of neural representations.
              </p>
              <a href={`${basePath}/chapter-1/measure-theory`} className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.11.1: Basic Probability Concepts */}
            <a href={`${basePath}/chapter-1/measure-theory/basic-probability`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.11.1</span>
                <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Basic Probability Concepts
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The essentials of random variables, distributions, and expectations.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.11.2: Foundations of Measure Theory */}
            <a href={`${basePath}/chapter-1/measure-theory/foundations`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-cyan-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.11.2</span>
                <MoveRight className="text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                Foundations of Measure Theory
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Formalizing probability through sigma-algebras and measurable spaces.
              </p>
              <div className="flex items-center gap-2 text-sm text-cyan-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.11.3: Mutual Information */}
            <a href={`${basePath}/chapter-1/measure-theory/mutual-information`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.11.3</span>
                <MoveRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                Mutual Information
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Quantifying the dependence and information overlap between variables.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.11.4: Complexity and Generalization */}
            <a href={`${basePath}/chapter-1/measure-theory/complexity`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.11.4</span>
                <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Complexity and Generalization
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Connecting information theory to model performance bounds.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.12: Backpropagation and Autodiff */}
      <section className="max-w-7xl mx-auto mb-20 px-4 border-t border-slate-100 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="text-sky-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.12 Backpropagation and Autodiff
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Discover the algorithms that power modern deep learning. From the calculus chain rule to computational graphs and the complexities of training giant transformers.
              </p>
              <a href={`${basePath}/chapter-1/backprop-autodiff`} className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.12.1: Backpropagation */}
            <a href={`${basePath}/chapter-1/backprop-autodiff/backpropagation`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-sky-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.12.1</span>
                <MoveRight className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                Backpropagation
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The core mechanism of distributing error backwards using Matrix Calculus and the Chain Rule.
              </p>
              <div className="flex items-center gap-2 text-sm text-sky-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.12.2: Automatic Differentiation */}
            <a href={`${basePath}/chapter-1/backprop-autodiff/automatic-differentiation`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.12.2</span>
                <MoveRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Automatic Differentiation
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                The programmatic implementation of derivatives using Forward and Reverse modes.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.12.3: Optimization Challenges */}
            <a href={`${basePath}/chapter-1/backprop-autodiff/optimization-challenges`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.12.3</span>
                <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Optimization Challenges
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Visualizing vanishing and exploding gradients, and exploring mitigations like Clipping and Initialization.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.13: Statistical Learning Theory */}
      <section className="max-w-7xl mx-auto mb-20 px-4 border-t border-slate-100 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="text-orange-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.13 Statistical Learning Theory
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Understand the mathematical limits of what models can learn. Explore the delicate balance between structural complexity, data dependency, and the overarching generalization risk.
              </p>
              <a href={`${basePath}/chapter-1/statistical-learning`} className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.13.1: Foundation of Statistical Learning */}
            <a href={`${basePath}/chapter-1/statistical-learning/foundation`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-orange-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.13.1</span>
                <MoveRight className="text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                Foundation of Statistical Learning
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Empirical Risk Minimization and generalization error bounds through Hoeffding&#39;s Inequality.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.13.2: VC Dimension and Capacity Control */}
            <a href={`${basePath}/chapter-1/statistical-learning/vc-dimension`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-violet-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.13.2</span>
                <MoveRight className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">
                VC Dimension and Capacity
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Measuring model flexibility and exploring the exponential structural capacity of modern models.
              </p>
              <div className="flex items-center gap-2 text-sm text-violet-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.13.3: Rademacher Complexity */}
            <a href={`${basePath}/chapter-1/statistical-learning/rademacher-complexity`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.13.3</span>
                <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Rademacher Complexity
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                A data-dependent perspective on complexity, evaluating a model&#39;s capacity to perfectly fit pure random noise.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                Start Chapter
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SECTION 1.14: Probabilistic Perspectives */}
      <section className="max-w-7xl mx-auto mb-20 px-4 border-t border-slate-100 pt-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Section Info */}
          <div className="md:w-1/3">
            <div className="sticky top-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Network className="text-blue-600" size={32} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                1.14 Probabilistic Perspectives
              </h2>
              <p className="text-lg text-slate-500 mb-6">
                Move beyond deterministic point estimates to fully embrace uncertainty. Explore Bayesian inference for transformer parameters and PAC-Bayes generalization bounds.
              </p>
              <a href={`${basePath}/chapter-1/probabilistic-perspectives`} className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                View Section Overview <MoveRight size={16} />
              </a>
            </div>
          </div>

          {/* Chapters Grid */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chapter 1.14.1: Bayesian Inference */}
            <a href={`${basePath}/chapter-1/probabilistic-perspectives/bayesian-inference`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.14.1</span>
                <MoveRight className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                Bayesian Inference in Transformers
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Computing posterior distributions over weights and visualizing Epistemic Uncertainty using Monte Carlo Dropout.
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.14.2: PAC-Bayes */}
            <a href={`${basePath}/chapter-1/probabilistic-perspectives/pac-bayes`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.14.2</span>
                <MoveRight className="text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                PAC-Bayes Bounds
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Bridging PAC learning with Bayesian priors to derive rigorous bounds on true risk.
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                Start Chapter
              </div>
            </a>

            {/* Chapter 1.14.3: Generalization in Practice */}
            <a href={`${basePath}/chapter-1/probabilistic-perspectives/generalization-practice`} className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 transition-all lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">Chapter 1.14.3</span>
                <MoveRight className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                Performance in Practice
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Scaling laws, grokking, and double-descent curves in modern models. Visualizing the Underfitting/Overfitting threshold.
              </p>
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                Start Chapter
              </div>
            </a>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section id="demo" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Interactive Labs</h2>
            <p className="text-slate-600 mt-2">Demos derived from "The Geometry of Intelligence"</p>
          </div>

          {/* Module 1 Demo */}
          <div className="mb-20">
            <VectorPlayground />
          </div>

          {/* Module 4 Demo */}
          <div className="mb-20">
            <AttentionMatrixLab />
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-500 py-8 text-center text-sm">
        <p>Generated for VisTransformer Project</p>
      </footer>
    </main >
  );
}
