import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { GitBranch, Box, Percent, Scale } from 'lucide-react';

export const GeneralizationIntro = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <GitBranch className="text-emerald-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">1.14.3 Generalization in Practice</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                While PAC-Bayes bounds provide theoretical limits, practical implementation requires empirical validation. Generalization performance—the ability of a model to perform well on new, unseen data—is often the fundamental battleground in deep learning.
            </p>

            <div className="bg-emerald-50/50 rounded-xl p-6 border border-emerald-100 mb-8">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    Empirical Generalization Error
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                    With <Latex>{'$\\mathcal{D}_{train}$'}</Latex> representing the training data and <Latex>{'$\\mathcal{D}_{test}$'}</Latex> representing the held-out test data, the empirical generalization error is the gap between the two risks:
                </p>
                <div className="overflow-x-auto bg-white rounded-lg p-4 border border-emerald-100 shadow-inner flex justify-center my-4">
                    <Latex>{'$$ \\text{err}_{gen} = \\hat{R}_{test}(h) - \\hat{R}_{train}(h) $$'}</Latex>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4 items-start">
                    <Box className="text-red-500 shrink-0 mt-1" size={20} />
                    <div>
                        <strong className="text-red-900 block mb-1">Overfitting</strong>
                        <span className="text-sm text-red-700/80">Occurs when model capacity vastly exceeds the available data. The model memorizes <Latex>{'$\\mathcal{D}_{train}$'}</Latex>, dropping <Latex>{'$\\hat{R}_{train}$'}</Latex> to zero, but <Latex>{'$\\hat{R}_{test}$'}</Latex> spikes massively.</span>
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-4 items-start">
                    <Percent className="text-blue-500 shrink-0 mt-1" size={20} />
                    <div>
                        <strong className="text-blue-900 block mb-1">Underfitting</strong>
                        <span className="text-sm text-blue-700/80">Occurs when the model is too simple to capture the underlying patterns, leading to high errors on both sets.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const GeneralizationRegularization = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Scale className="text-teal-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Regularization & Model Selection</h2>
        </div>

        <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-6">
                Empirical studies consistently show that preventing overfitting requires artificially constraining model capacity. This is done mathematically by adding a penalty term <Latex>{'$\\Omega(h)$'}</Latex> governed by a strength hyperparameter <Latex>{'$\\lambda$'}</Latex>.
            </p>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mb-6 flex justify-center text-lg">
                <Latex>{'$$ L_{reg}(h) = L(h) + \\lambda\\Omega(h) $$'}</Latex>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                For transformers, this <Latex>{'$\\Omega(h)$'}</Latex> is often Weight Decay (L2 norm) or Dropout. Larger transformers are strictly prone to overfitting on smaller datasets unless <Latex>{'$\\lambda$'}</Latex> is carefully tuned, or the problem is bypassed entirely using Transfer Learning (fine-tuning a pre-trained foundation).
            </p>

            <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100">
                <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
                    Theorem 1.26 (Generalization in Cross-Validation)
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                    To find the optimal hyperparameters like <Latex>{'$\\lambda$'}</Latex> and learning rate <Latex>{'$\\eta$'}</Latex> without touching the test data, we use <strong>Cross-Validation</strong>. The theorem proves that cross-validated error <Latex>{'$\\hat{R}_{CV}$'}</Latex> reliably bounds the true risk:
                </p>
                <div className="bg-white rounded p-3 border border-teal-100 shadow-inner flex justify-center h-[60px] relative items-center mb-3">
                    <Latex>{'$$ R(h) \\le \\hat{R}_{CV}(h) + \\mathcal{O}\\left(\\sqrt{\\frac{1}{n}}\\right) $$'}</Latex>
                </div>
            </div>
        </div>
    </div>
);
