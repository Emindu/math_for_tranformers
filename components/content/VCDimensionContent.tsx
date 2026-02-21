"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export default function VCDimensionContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                VC Dimension and Capacity Control
                <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full font-semibold">1.13.2</span>
            </h2>

            <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Definition and Properties of VC Dimension</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                The VC dimension is a measure of the capacity or complexity of a hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex>. It is defined as the <strong>maximum number of points that can be shattered by <Latex>{'$\\mathcal{H}$'}</Latex></strong>. A set of points is said to be shattered by <Latex>{'$\\mathcal{H}$'}</Latex> if, for every possible labeling of the points, there exists a hypothesis in <Latex>{'$\\mathcal{H}$'}</Latex> that correctly classifies them.
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl mb-8 shadow-inner overflow-x-auto text-center border border-slate-200">
                <div className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Formal Definition</div>
                <Latex>{"$$ \\text{VC}(\\mathcal{H}) = \\max\\{m \\in \\mathbb{N} : \\exists S \\subset \\mathbb{R}^d, |S| = m, S \\text{ is shattered by } \\mathcal{H}\\} $$"}</Latex>
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-4">Properties of VC Dimension:</h4>
            <ol className="list-decimal list-outside ml-5 text-slate-700 space-y-4 mb-8">
                <li>
                    <strong>Upper Bound:</strong> For any hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex>, the VC dimension provides an upper bound on the capacity of <Latex>{'$\\mathcal{H}$'}</Latex>. If <Latex>{'$\\text{VC}(\\mathcal{H}) = d$'}</Latex>, then <Latex>{'$\\mathcal{H}$'}</Latex> cannot shatter <em>any</em> set of <Latex>{'$d + 1$'}</Latex> points.
                </li>
                <li>
                    <strong>Implications for Generalization:</strong> A high VC dimension implies that the hypothesis class is very flexible and capable of fitting complex patterns, which increases the risk of overfitting. Conversely, a low VC dimension indicates that the hypothesis class is more constrained, which can reduce the risk of overfitting but may also limit the ability to capture complex patterns.
                </li>
                <li>
                    <strong>Relation to Sample Size:</strong> To achieve a small generalization error with high probability, the sample size <Latex>{'$n$'}</Latex> should be larger than the VC dimension of the hypothesis class.
                </li>
            </ol>

            <div className="bg-fuchsia-50 border border-fuchsia-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-fuchsia-400"></div>
                <h4 className="text-xl font-bold text-fuchsia-900 mb-4 flex items-center gap-2">
                    Theorem 1.23: Sauer–Shelah Lemma
                </h4>
                <div className="text-fuchsia-800 leading-relaxed">
                    The Sauer–Shelah lemma provides a combinatorial bound on the number of distinct labelings that a hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex> can produce on a sample of size <Latex>{'$n$'}</Latex>, based on its VC dimension:
                    <div className="text-center bg-white/60 p-6 rounded-2xl border border-fuchsia-200/50 my-6 shadow-sm text-lg">
                        <Latex>{"$$ |\\mathcal{H}_S| \\le \\sum_{i=0}^{d} \\binom{n}{i} $$"}</Latex>
                    </div>
                    where <Latex>{'$\\mathcal{H}_S$'}</Latex> is the set of labelings of the sample <Latex>{'$S$'}</Latex> by <Latex>{'$\\mathcal{H}$'}</Latex>, and <Latex>{'$d = \\text{VC}(\\mathcal{H})$'}</Latex>.
                </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-12 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Example: Linear Classifiers</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    Consider the hypothesis class of linear classifiers in <Latex>{'$\\mathbb{R}^2$'}</Latex>:
                    <div className="text-center bg-white/60 p-4 rounded-xl border border-sky-200/50 my-4 shadow-sm font-mono text-sm">
                        <Latex>{"$$ \\mathcal{H} = \\{h(x) = \\text{sign}(w_1 x_1 + w_2 x_2 + b) : (w_1, w_2) \\in \\mathbb{R}^2, b \\in \\mathbb{R}\\} $$"}</Latex>
                    </div>
                    The VC dimension of this class is <strong>3</strong> because it can shatter any set of 3 points in general position (no 3 points are collinear) but <strong>cannot shatter 4 points</strong> (e.g. an XOR distribution).
                </div>
            </div>

            {/* Sub-section 2 */}
            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">VC Dimension of Transformer Models</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                The VC dimension of deep neural networks, including transformers, is typically very high due to the large number of parameters and the flexibility of the network architecture.
            </p>
            <p className="text-slate-700 leading-relaxed mb-8">
                For a network with <Latex>{'$W$'}</Latex> parameters and <Latex>{'$L$'}</Latex> layers, the VC dimension is often proportional to <Latex>{'$W \\log W$'}</Latex>. This reflects the fact that deep networks have high capacity but also require careful regularization and massive training data corpuses to avoid overfitting.
            </p>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                    Theorem 1.24: VC Dimension of Neural Networks
                </h4>
                <div className="text-amber-800 leading-relaxed">
                    Let <Latex>{'$\\mathcal{H}$'}</Latex> be the hypothesis class of functions representable by a neural network with <Latex>{'$W$'}</Latex> parameters. Then, the VC dimension <Latex>{'$\\text{VC}(\\mathcal{H})$'}</Latex> satisfies:
                    <div className="text-center bg-white/60 p-6 rounded-2xl border border-amber-200/50 my-6 shadow-sm text-2xl font-bold">
                        <Latex>{"$$ \\text{VC}(\\mathcal{H}) = O(W \\log W) $$"}</Latex>
                    </div>
                </div>
            </div>

            <button className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl font-medium hover:bg-emerald-100 transition-all active:scale-[0.98] w-full border border-emerald-100 group shadow-sm mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Shattering and Transformer Capacity</span>
            </button>
        </div>
    );
}
