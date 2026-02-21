import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { BrainCircuit, Sigma, ShieldAlert, GitBranch } from 'lucide-react';

export const BayesianInferenceIntro = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BrainCircuit className="text-indigo-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">1.14.1 Bayesian Inference in Transformers</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                Bayesian inference is a statistical method that updates the probability estimate for a hypothesis as more evidence or information becomes available. It combines prior knowledge with observed data to produce a <strong>posterior distribution</strong>, which quantifies uncertainty about model parameters.
            </p>

            <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Sigma className="text-indigo-500" size={20} />
                    Bayes' Theorem for Model Parameters
                </h3>
                <p className="text-slate-600 mb-4">
                    Let <Latex>{'$\\theta$'}</Latex> denote the parameters of a transformer model, and <Latex>{'$\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^n$'}</Latex> represent observed data. The posterior distribution <Latex>{'$p(\\theta | \\mathcal{D})$'}</Latex> encapsulates all information after observing the data:
                </p>
                <div className="overflow-x-auto bg-white rounded-lg p-4 border border-indigo-100 shadow-inner flex justify-center my-4">
                    <Latex>{'$$ p(\\theta | \\mathcal{D}) = \\frac{p(\\mathcal{D} | \\theta) p(\\theta)}{p(\\mathcal{D})} $$'}</Latex>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                    <li><strong>Likelihood <Latex>{'$p(\\mathcal{D} | \\theta)$'}</Latex>:</strong> Probability of the data given the parameters.</li>
                    <li><strong>Prior <Latex>{'$p(\\theta)$'}</Latex>:</strong> Initial beliefs about parameters before seeing data.</li>
                    <li><strong>Evidence <Latex>{'$p(\\mathcal{D})$'}</Latex>:</strong> Marginal likelihood normalizing the posterior.</li>
                </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldAlert className="text-slate-500" size={20} />
                    Uncertainty Quantification (Predictive Distribution)
                </h3>
                <p className="text-slate-600 mb-4">
                    Instead of a single point estimate for <Latex>{'$\\theta$'}</Latex>, the posterior offers a range of plausible values. For a new input <Latex>{'$x^*$'}</Latex>, the predictive distribution for output <Latex>{'$y^*$'}</Latex> is obtained by marginalizing over the posterior:
                </p>
                <div className="overflow-x-auto bg-white rounded-lg p-4 border border-slate-200 shadow-inner flex justify-center my-4">
                    <Latex>{'$$ p(y^* | x^*, \\mathcal{D}) = \\int p(y^* | x^*, \\theta) p(\\theta | \\mathcal{D}) d\\theta $$'}</Latex>
                </div>
                <p className="text-sm text-slate-500">
                    This captures both the inherent noise in the data (aleatoric) and the uncertainty in the model parameters (epistemic).
                </p>
            </div>
        </div>
    </div>
);

export const BayesianNeuralNetworks = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GitBranch className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Bayesian Neural Networks (BNNs)</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                A <strong>Bayesian Neural Network (BNN)</strong> treats network weights <Latex>{'$\\theta = \\{W_l\\}_{l=1}^L$'}</Latex> as random variables with a prior distribution. Instead of learning a single set of weights, BNNs learn a <em>distribution</em> over weights, allowing for uncertainty estimation. Exact computation is intractable, requiring approximations:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100">
                    <h4 className="font-semibold text-emerald-900 mb-2">1. Variational Inference (VI)</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        Approximates the true posterior <Latex>{'$p(\\theta | \\mathcal{D})$'}</Latex> with a simpler distribution <Latex>{'$q(\\theta | \\phi)$'}</Latex> by minimizing the Kullback-Leibler (KL) divergence:
                    </p>
                    <div className="bg-white rounded p-3 border border-emerald-100 shadow-inner my-2 flex justify-center overflow-x-auto">
                        <Latex>{'$$ \\phi^* = \\arg\\min_{\\phi} \\text{KL}(q(\\theta | \\phi) \\| p(\\theta | \\mathcal{D})) $$'}</Latex>
                    </div>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">2. Monte Carlo Dropout</h4>
                    <p className="text-sm text-slate-600 mb-3">
                        A practical technique where standard dropout is applied during <em>both</em> training and inference. The posterior is approximated by averaging <Latex>{'$M$'}</Latex> stochastic forward passes:
                    </p>
                    <div className="bg-white rounded p-3 border border-blue-100 shadow-inner my-2 flex justify-center overflow-x-auto">
                        <Latex>{'$$ p(y^* | x^*, \\mathcal{D}) \\approx \\frac{1}{M} \\sum_{i=1}^M p(y^* | x^*, \\theta_i) $$'}</Latex>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-slate-600 text-sm">
                    <strong>Bayesian Transformers:</strong> In transformer models, Bayesian inference can be applied to the weights of the self-attention mechanism and feedforward networks. By modeling these weights as random variables, the model can produce uncertainty-aware predictions, crucial for trustworthy NLP applications.
                </p>
            </div>
        </div>
    </div>
);
