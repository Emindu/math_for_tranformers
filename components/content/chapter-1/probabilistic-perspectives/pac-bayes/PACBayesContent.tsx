import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Network, Activity, ShieldAlert, GitBranch } from 'lucide-react';

export const PACBayesIntro = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">1.14.2 PAC-Bayes Generalization Bounds</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                PAC-Bayesian (PAC-Bayes) theory provides a framework for deriving generalization bounds that combine elements of both <strong>PAC (Probably Approximately Correct)</strong> learning theory and <strong>Bayesian inference</strong>.
            </p>

            <div className="bg-purple-50/50 rounded-xl p-6 border border-purple-100 mb-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    Theorem 1.25 (PAC-Bayes Theorem)
                </h3>
                <p className="text-slate-600 mb-4">
                    Let <Latex>{'$\\mathcal{H}$'}</Latex> be a hypothesis class, <Latex>{'$P$'}</Latex> a prior distribution over <Latex>{'$\\mathcal{H}$'}</Latex>, and <Latex>{'$Q$'}</Latex> a posterior distribution over <Latex>{'$\\mathcal{H}$'}</Latex>. With probability at least <Latex>{'$1 - \\delta$'}</Latex>, the generalization error satisfies:
                </p>
                <div className="overflow-x-auto bg-white rounded-lg p-4 border border-purple-100 shadow-inner flex justify-center my-4">
                    <Latex>{'$$ \\mathbb{E}_{h \\sim Q} [R(h)] \\le \\mathbb{E}_{h \\sim Q} [\\hat{R}_n(h)] + \\sqrt{\\frac{\\text{KL}(Q \\| P) + \\log \\frac{n}{\\delta}}{2n}} $$'}</Latex>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-4">Interpreting the Bound</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Empirical Risk <Latex>{'$\\hat{R}_n(h)$'}</Latex></strong>
                    <span className="text-sm text-slate-600">The average error of the hypothesis on the training data.</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">True Risk <Latex>{'$R(h)$'}</Latex></strong>
                    <span className="text-sm text-slate-600">The expected error on new, unseen data (what we are bounding).</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">KL Divergence <Latex>{'$\\text{KL}(Q \\| P)$'}</Latex></strong>
                    <span className="text-sm text-slate-600">Measures how much the fine-tuned posterior <Latex>{'$Q$'}</Latex> diverges from the prior <Latex>{'$P$'}</Latex>. Small divergence = tight bound.</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-1">Sample Size <Latex>{'$n$'}</Latex></strong>
                    <span className="text-sm text-slate-600">The risk bound shrinks exactly proportionally to <Latex>{'$\\frac{1}{\\sqrt{n}}$'}</Latex>.</span>
                </div>
            </div>
        </div>
    </div>
);

export const PACBayesTransformers = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Network className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">PAC-Bayes in Transformers</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                Transformers are powerful models with massive capacity, often leading to concerns about overfitting. PAC-Bayes framework naturally incorporates <strong>regularization</strong> by penalizing posterior distributions that deviate significantly from a prior.
            </p>

            <ul className="space-y-4 mb-6 list-none pl-0">
                <li className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1 font-bold text-slate-500">1</div>
                    <div>
                        <strong className="text-slate-800 block">Prior Distribution <Latex>{'$P$'}</Latex></strong>
                        <span className="text-sm text-slate-600">Can encode beliefs about weights (e.g., Gaussian prior around 0 for Weight Decay) or represent <strong>foundation pre-trained weights</strong> from a large language corpus.</span>
                    </div>
                </li>
                <li className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1 font-bold text-slate-500">2</div>
                    <div>
                        <strong className="text-slate-800 block">Posterior Distribution <Latex>{'$Q$'}</Latex></strong>
                        <span className="text-sm text-slate-600">The distribution learned fine-tuning on the target task dataset (e.g., Sentiment Analysis).</span>
                    </div>
                </li>
            </ul>

            <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <ShieldAlert size={16} /> Transformer Bound Strategy
                </h4>
                <p className="text-sm text-slate-600 mb-3">
                    Let <Latex>{'$\\theta$'}</Latex> represent the transformer parameters:
                </p>
                <div className="bg-white rounded p-3 border border-indigo-100 shadow-inner flex justify-center overflow-x-auto mb-3">
                    <Latex>{'$$ \\mathbb{E}_{\\theta \\sim Q} [R(\\theta)] \\le \\mathbb{E}_{\\theta \\sim Q} [\\hat{R}_n(\\theta)] + \\sqrt{\\frac{\\text{KL}(Q(\\theta) \\| P(\\theta)) + \\log \\frac{n}{\\delta}}{2n}} $$'}</Latex>
                </div>
                <p className="text-sm text-slate-600">
                    By calculating the KL divergence between the pre-trained foundation model and our fine-tuned weights, we rigorously bound the risk. Optimization strategies like <strong>Weight Decay</strong> directly minimize this KL divergence penalty term.
                </p>
            </div>
        </div>
    </div>
);
