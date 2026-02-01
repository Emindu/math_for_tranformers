import AttentionMatrixLab from "@/components/math-viz/AttentionMatrixLab";
import VectorPlayground from "@/components/math-viz/VectorPlayground";
import { MoveRight } from "lucide-react";

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
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Start Learning</h2>
            <p className="text-slate-600 mt-2">Follow the chapters to master the concepts</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Chapter 1 Card */}
            <a href="/chapter-1/vector-spaces" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
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

            {/* Chapter 1.2 Card */}
            <a href="/chapter-1/linear-transformations" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
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

            {/* Chapter 1.3 Card */}
            <a href="/chapter-1/eigenvalues-eigenvectors" className="group block bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all">
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
    </main>
  );
}
