"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export default function StatLearningFoundationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Foundations of Statistical Learning
                <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full font-semibold">1.13.1</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Statistical learning theory provides a foundation for understanding and analyzing the performance of machine learning models. It addresses questions of <strong>generalization</strong>, <strong>capacity control</strong>, and <strong>risk minimization</strong>, offering theoretical tools to ensure that models not only fit the training data but also perform well on unseen data.
            </p>

            <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Risk Minimization</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                In statistical learning theory, the goal of a learning algorithm is to find a hypothesis <Latex>{'$h$'}</Latex> from a hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex> that minimizes the expected risk, also known as the <strong>true risk</strong> or population risk. The true risk <Latex>{'$R(h)$'}</Latex> of a hypothesis <Latex>{'$h$'}</Latex> is defined as the expected loss over the distribution of the data:
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl mb-8 shadow-inner overflow-x-auto text-center border border-slate-200">
                <Latex>{"$$R(h) = \\mathbb{E}_{(x,y)\\sim\\mathcal{D}} [\\ell(h(x), y)]$$"}</Latex>
            </div>

            <p className="text-slate-700 leading-relaxed mb-8">
                where <Latex>{'$\\ell : \\mathcal{Y} \\times \\mathcal{Y} \\to \\mathbb{R}$'}</Latex> is the loss function, <Latex>{'$(x, y)$'}</Latex> is a data point drawn from the distribution <Latex>{'$\\mathcal{D}$'}</Latex>, and <Latex>{'$h(x)$'}</Latex> is the prediction made by the hypothesis <Latex>{'$h$'}</Latex>.
            </p>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-8 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Empirical Risk Minimization (ERM)</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    Since the true distribution <Latex>{'$\\mathcal{D}$'}</Latex> is typically unknown, the true risk cannot be directly minimized. Instead, we minimize the <strong>empirical risk</strong> <Latex>{'$\\hat{R}_n(h)$'}</Latex>, which is the average loss over the training sample <Latex>{'$S = \\{(x_1, y_1), \\dots, (x_n, y_n)\\}$'}</Latex>:
                    <div className="text-center bg-white/60 p-4 rounded-xl border border-sky-200/50 my-4 shadow-sm">
                        <Latex>{"$$\\hat{R}_n(h) = \\frac{1}{n} \\sum_{i=1}^{n} \\ell(h(x_i), y_i)$$"}</Latex>
                    </div>
                    The empirical risk serves as an approximation to the true risk. The ERM principle seeks to find:
                    <div className="text-center my-3 font-semibold"><Latex>{"$$h_{\\text{ERM}} = \\arg\\min_{h \\in \\mathcal{H}} \\hat{R}_n(h)$$"}</Latex></div>
                </div>
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-2 mt-8">Uniform Convergence</h4>
            <p className="text-slate-700 leading-relaxed mb-6">
                For ERM to be effective, we require that the empirical risk <Latex>{'$\\hat{R}_n(h)$'}</Latex> converges <em>uniformly</em> to the true risk <Latex>{'$R(h)$'}</Latex> as the sample size <Latex>{'$n$'}</Latex> increases. Formally, with high probability, the following bound holds for all <Latex>{'$h \\in \\mathcal{H}$'}</Latex>:
            </p>
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8 text-center">
                <Latex>{"$$ \\sup_{h \\in \\mathcal{H}} |R(h) - \\hat{R}_n(h)| \\le \\epsilon(n) $$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
                where <Latex>{'$\\epsilon(n)$'}</Latex> decreases as <Latex>{'$n$'}</Latex> increases, reflecting the idea that with more data, the empirical risk becomes a better approximation of the true risk.
            </p>

            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">Empirical Risk Versus True Risk</h3>

            <p className="text-slate-700 leading-relaxed mb-6">
                <strong>Generalization Error:</strong> The difference between the true risk and the empirical risk is known as the generalization error: <Latex>{'$\\text{Generalization Error}(h) = R(h) - \\hat{R}_n(h)$'}</Latex>. A small generalization error indicates that the hypothesis generalizes well, while a large generalization error suggests <strong>overfitting</strong>.
            </p>

            <p className="text-slate-700 leading-relaxed mb-6">
                <strong>Generalization Bounds:</strong> Statistical learning theory provides bounds on the generalization error, often in terms of the complexity of the hypothesis class <Latex>{'$\\mathcal{H}$'}</Latex>. These bounds ensure that, with high probability, the true risk of the hypothesis chosen by ERM is close to the empirical risk:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-8 text-center border border-slate-200">
                <Latex>{"$$ R(h_{\\text{ERM}}) \\le \\hat{R}_n(h_{\\text{ERM}}) + O\\left(\\frac{\\text{Complexity}(\\mathcal{H})}{\\sqrt{n}}\\right) $$"}</Latex>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-400"></div>
                <h4 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                    Theorem 1.22: Hoeffding's Inequality
                </h4>
                <div className="text-rose-800 leading-relaxed">
                    One of the fundamental results that provides a generalization bound is Hoeffding's inequality. For any fixed hypothesis <Latex>{'$h \\in \\mathcal{H}$'}</Latex>, Hoeffding's inequality states that:
                    <div className="text-center bg-white/60 p-6 rounded-2xl border border-rose-200/50 my-6 shadow-sm text-lg">
                        <Latex>{"$$P(|R(h) - \\hat{R}_n(h)| > \\epsilon) \\le \\mathbf{2\\exp(-2n\\epsilon^2)}$$"}</Latex>
                    </div>
                    This bound shows that as the sample size <Latex>{'$n$'}</Latex> increases, the probability that the empirical risk deviates significantly from the true risk decreases exponentially.
                </div>
            </div>

            <button className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl font-medium hover:bg-emerald-100 transition-all active:scale-[0.98] w-full border border-emerald-100 group shadow-sm mt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: ERM & Generalization Bounds</span>
            </button>
        </div>
    );
}
