"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export default function RademacherContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Rademacher Complexity
                <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full font-semibold">1.13.3</span>
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Unlike VC dimension, which is entirely structural and combinatorial, <strong>Rademacher complexity</strong> provides a <em>data-dependent</em> measure of complexity. It measures the richness of a hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex> based squarely on its ability to <strong>fit random noise</strong>.
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl mb-8 shadow-inner overflow-x-auto text-center border border-slate-200">
                <div className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-bold">Empirical Rademacher Complexity</div>
                <Latex>{"$$ \\hat{\\mathcal{R}}_n(\\mathcal{H}) = \\mathbb{E}_{\\sigma} \\left[ \\sup_{h \\in \\mathcal{H}} \\frac{1}{n} \\sum_{i=1}^{n} \\sigma_i h(x_i) \\right] $$"}</Latex>
                <div className="text-sm text-slate-600 mt-4 text-left max-w-2xl mx-auto">
                    Where <Latex>{'$\\sigma = (\\sigma_1, \\dots, \\sigma_n)$'}</Latex> are i.i.d. <em>Rademacher variables</em>, each taking values <Latex>{'$+1$'}</Latex> or <Latex>{'$-1$'}</Latex> with equal probability. In essence, it measures the supreme ability of the models in <Latex>{'$\\mathcal{H}$'}</Latex> to correlate with perfectly random binary coin flips.
                </div>
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-4">Core Properties:</h4>
            <ol className="list-decimal list-outside ml-5 text-slate-700 space-y-4 mb-8">
                <li>
                    <strong>Data Dependence:</strong> Because <Latex>{'$\\hat{\\mathcal{R}}_n$'}</Latex> relies on a specific dataset sample <Latex>{'$S$'}</Latex>, it captures how complex <Latex>{'$\\mathcal{H}$'}</Latex> is relative to your <em>actual data distribution</em>, unlike the theoretical maximum of VC Dimension.
                </li>
                <li>
                    <strong>Bounding Generalization Error:</strong> Rademacher complexity provides a strict bound on the generalization error of the hypothesis chosen by Empirical Risk Minimization.
                </li>
            </ol>

            <div className="bg-fuchsia-50 border border-fuchsia-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-fuchsia-400"></div>
                <h4 className="text-xl font-bold text-fuchsia-900 mb-4 flex items-center gap-2">
                    Generalization Bound
                </h4>
                <div className="text-fuchsia-800 leading-relaxed">
                    With high probability, the True Risk <Latex>{'$R(h)$'}</Latex> is bounded by the Empirical Risk <Latex>{'$\\hat{R}_n(h)$'}</Latex> plus the Rademacher complexity of the class:
                    <div className="text-center bg-white/60 p-6 rounded-2xl border border-fuchsia-200/50 my-6 shadow-sm text-xl lg:text-2xl font-bold">
                        <Latex>{"$$ R(h) \\le \\hat{R}_n(h) + 2 \\hat{\\mathcal{R}}_n(\\mathcal{H}) + O\\left(\\sqrt{\\frac{1}{n}}\\right) $$"}</Latex>
                    </div>
                </div>
            </div>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-12 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Example: Linear Classifiers</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    For a hypothesis class with functions bounded by <Latex>{'$B$'}</Latex>, the Rademacher complexity satisfies <Latex>{'$\\hat{\\mathcal{R}}_n(\\mathcal{H}) \\le \\frac{B}{\\sqrt{n}}$'}</Latex>. Consider the class of bounded linear classifiers: <Latex>{'$\\mathcal{H} = \\{h(x) = w \\cdot x : \\lVert w \\rVert \\le 1\\}$'}</Latex>.

                    <br /><br />The Rademacher complexity is bounded by:
                    <div className="text-center bg-white/60 p-4 rounded-xl border border-sky-200/50 my-4 shadow-sm font-mono">
                        <Latex>{"$$ \\hat{\\mathcal{R}}_n(\\mathcal{H}) \\le \\frac{1}{\\sqrt{n}} $$"}</Latex>
                    </div>
                    This confirms that as the sample size <strong>increases</strong>, relative hypothesis complexity <strong>decreases</strong>, driving tighter generalization.
                </div>
            </div>

            {/* Sub-section 2 */}
            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">Applications to Transformer Generalization</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                In transformer models, calculating the exact VC dimension is virtually impossible. Instead, Rademacher complexity is a much sharper tool used to analyze the generalization ability of distinct internal components (like individual attention heads or feedforward layers).
            </p>
            <p className="text-slate-700 leading-relaxed mb-8">
                By regularizing the model or constraining architecture sizes—such as enforcing a tight norm on weight matrices—we directly suppress the Rademacher complexity bound, rescuing the network from catastrophic overfitting.
            </p>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                <h4 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                    Transformer Generalization Error
                </h4>
                <div className="text-amber-800 leading-relaxed">
                    Let <Latex>{'$\\mathcal{H}_{\\text{transformer}}$'}</Latex> be the hypothesis class of our deep attention network. The generalization gap bounding the Empirical Risk Minimizer (<Latex>{'$\\text{ERM}$'}</Latex>) guarantees:
                    <div className="text-center bg-white/60 p-6 rounded-2xl border border-amber-200/50 my-6 shadow-sm font-bold text-lg md:text-xl overflow-x-auto whitespace-nowrap">
                        <Latex>{"$$ R(h_{\\text{ERM}}) \\le \\hat{R}_n(h_{\\text{ERM}}) + 2 \\hat{\\mathcal{R}}_n(\\mathcal{H}_{\\text{transformer}}) + O\\left(\\sqrt{\\frac{1}{n}}\\right) $$"}</Latex>
                    </div>
                    This bound strictly demonstrates that scaling transformer capacity <strong>must</strong> be matched synergistically with scaling dataset sizes (<Latex>{'$n$'}</Latex>) to prevent the middle complexity term from overtaking the guarantee.
                </div>
            </div>

            <button className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl font-medium hover:bg-emerald-100 transition-all active:scale-[0.98] w-full border border-emerald-100 group shadow-sm mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Rademacher Noise and Foundation Models</span>
            </button>
        </div>
    );
}
