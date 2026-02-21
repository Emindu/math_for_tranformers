import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export function MutualInformationIntro() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Mutual Information
                <span className="bg-rose-100 text-rose-700 text-sm px-3 py-1 rounded-full font-semibold">1.11.3</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Mutual information measures the amount of information that one random variable contains about another. It quantifies the reduction in uncertainty about one variable given knowledge of the other. Mathematically, the mutual information <Latex>{'$I(X; Y)$'}</Latex> between two random variables <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex> is defined as
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{'$$I(X; Y) = \\iint_{X \\times Y} p(x, y) \\log \\frac{p(x, y)}{p(x) p(y)} dx dy$$'}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$p(x, y)$'}</Latex> is the joint probability density function of <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex>, and <Latex>{'$p(x)$'}</Latex> and <Latex>{'$p(y)$'}</Latex> are the marginal probability density functions of <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex>, respectively.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
                Alternatively, mutual information can be expressed in terms of entropy:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{'$$I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)$$'}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$H(X)$'}</Latex> and <Latex>{'$H(Y)$'}</Latex> are the entropies of <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex>, and <Latex>{'$H(X|Y)$'}</Latex> and <Latex>{'$H(Y|X)$'}</Latex> are the conditional entropies.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Play size={20} className="ml-1" />
                    </div>
                    <span className="font-semibold text-indigo-900">Audio Track: Measuring Dependency</span>
                </div>
            </div>
        </div>
    );
}

export function MutualInformationProperties() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Properties of Mutual Information</h3>
            <ul className="space-y-4 text-slate-700">
                <li>
                    <strong>1. Non-negativity:</strong> <Latex>{'$I(X; Y) \\ge 0$'}</Latex>, with equality if and only if <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex> are independent.
                </li>
                <li>
                    <strong>2. Symmetry:</strong> <Latex>{'$I(X; Y) = I(Y; X)$'}</Latex>.
                </li>
                <li>
                    <strong>3. Data Processing Inequality:</strong> If <Latex>{'$X \\to Y \\to Z$'}</Latex> forms a Markov chain, then <br />
                    <Latex>{'$I(X; Z) \\le I(X; Y)$'}</Latex>.
                </li>
            </ul>

            <div className="bg-blue-50/50 border-l-4 border-blue-400 p-4 mt-6 rounded-r-xl">
                <p className="text-sm text-slate-700 m-0">
                    <strong>Example:</strong> Consider two binary random variables <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex>, each taking values in <Latex>{'\\{0, 1\\}'}</Latex>. If <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex> are perfectly correlated (i.e., <Latex>{'$X = Y$'}</Latex>), the mutual information <Latex>{'$I(X; Y)$'}</Latex> is maximized, indicating that knowing <Latex>{'$X$'}</Latex> completely determines <Latex>{'$Y$'}</Latex>. Conversely, if <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex> are independent, <Latex>{'$I(X; Y) = 0$'}</Latex>, reflecting no mutual dependence.
                </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 mt-8 border border-purple-100">
                <h4 className="text-purple-900 font-bold mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                    Theorem 1.19 (Chain Rule for Mutual Information)
                </h4>
                <p className="text-purple-800 mb-4 text-sm">
                    Let <Latex>{'$X, Y, Z$'}</Latex> be random variables. The mutual information satisfies the following chain rule:
                </p>
                <div className="bg-white/60 p-4 rounded-xl text-center mb-4 shadow-sm">
                    <Latex>{'$$I(X; Y, Z) = I(X; Y) + I(X; Z|Y)$$'}</Latex>
                </div>
                <p className="text-purple-800/80 text-sm m-0">
                    This theorem is useful for decomposing the mutual information between a set of variables into more manageable components, particularly in analyzing complex models like transformers.
                </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Play size={20} className="ml-1" />
                    </div>
                    <span className="font-semibold text-indigo-900">Audio Track: Information Flow and Chains</span>
                </div>
            </div>
        </div>
    );
}

export function InformationBottleneckContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Applications to Transformer Models</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                In transformer models, mutual information plays a crucial role in understanding how information is distributed and processed across different layers and attention heads. It can be used to measure the amount of information that the model retains about the input as it propagates through the layers, providing insights into the model's ability to capture relevant dependencies.
            </p>
            <p className="text-slate-700 leading-relaxed mb-6">
                The <strong>Information Bottleneck (IB) principle</strong>, introduced by Tishby et al. [57], provides a framework for understanding the trade-off between compression and relevance in machine learning models. The IB principle suggests that a good representation <Latex>{'$Z$'}</Latex> of the input <Latex>{'$X$'}</Latex> should maximize the mutual information <Latex>{'$I(Z; Y)$'}</Latex> with the output <Latex>{'$Y$'}</Latex>, while minimizing the mutual information <Latex>{'$I(Z; X)$'}</Latex> with the input <Latex>{'$X$'}</Latex>:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{'$$\\min I(Z; X) \\quad \\text{subject to} \\quad I(Z; Y) \\ge \\text{constant}$$'}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                In transformers, this principle can be applied to analyze how different layers balance the retention of useful information versus the compression of irrelevant details.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Play size={20} className="ml-1" />
                    </div>
                    <span className="font-semibold text-indigo-900">Audio Track: The Information Bottleneck</span>
                </div>
            </div>
        </div>
    );
}

export function AttentionMutualInformationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Mutual Information in Attention Layers</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                The attention mechanism in transformers can be analyzed using mutual information to quantify how much information from the input sequence is captured by each attention head. By measuring the mutual information between the input tokens and the output of each attention layer, one can identify which attention heads are most effective in capturing long-range dependencies or specific patterns in the data.
            </p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mt-8 mb-6">
                <h4 className="text-emerald-900 font-bold mb-3">
                    Remark (Mutual Information in Attention Layers)
                </h4>
                <p className="text-emerald-800 mb-4 text-sm leading-relaxed">
                    Let <Latex>{'$X = \\{x_1, x_2, \\dots, x_n\\}$'}</Latex> be an input sequence and <Latex>{'$Y = \\{y_1, y_2, \\dots, y_m\\}$'}</Latex> be the output sequence produced by an attention layer. The mutual information between <Latex>{'$X$'}</Latex> and <Latex>{'$Y$'}</Latex> is given by:
                </p>
                <div className="bg-white/60 p-4 rounded-xl text-center mb-4 shadow-sm text-emerald-900">
                    <Latex>{'$$I(X; Y) = \\sum_{i=1}^n \\sum_{j=1}^m I(x_i; y_j | \\text{context})$$'}</Latex>
                </div>
                <p className="text-emerald-800/80 text-sm m-0">
                    where <Latex>{'$\\text{context}$'}</Latex> refers to the set of all other tokens considered by the attention mechanism. This decomposition allows for a detailed analysis of how information is distributed across different tokens and attention heads.
                </p>
            </div>

            <div className="bg-blue-50/50 border-l-4 border-blue-400 p-4 mt-6 rounded-r-xl">
                <p className="text-sm text-slate-700 m-0">
                    <strong>Example:</strong> In natural language processing tasks, one might measure the mutual information between specific words in the input sentence and the output representation to understand how well the transformer captures syntactic or semantic relationships.
                </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between mt-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Play size={20} className="ml-1" />
                    </div>
                    <span className="font-semibold text-indigo-900">Audio Track: Attention as Information Routing</span>
                </div>
            </div>
        </div>
    );
}
