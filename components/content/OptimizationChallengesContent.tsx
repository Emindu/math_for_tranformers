"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export default function OptimizationChallengesContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Optimization Challenges in Transformers
                <span className="bg-sky-100 text-sky-700 text-sm px-3 py-1 rounded-full font-semibold">1.12.3</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Training deep neural networks, including transformers, presents significant optimization challenges. Among these are the issues of <strong>vanishing and exploding gradients</strong>, which can hinder the training process, especially in very deep networks. Various techniques, such as <strong>gradient clipping</strong> and specific <strong>initializations</strong>, have been developed to mitigate these issues and ensure stable training.
            </p>

            <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Vanishing and Exploding Gradients</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                The vanishing gradient problem occurs when the gradients of the loss function with respect to the model parameters become very small during backpropagation, effectively halting the learning process. This problem is particularly prevalent in deep networks, where gradients must be propagated through many layers.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                Consider a deep neural network where the activation function is sigmoid <Latex>{'$\\sigma(x) = \\frac{1}{1+e^{-x}}$'}</Latex>. The derivative of the sigmoid function is:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl mb-4 text-center border border-slate-200">
                <Latex>{"$$\\sigma'(x) = \\sigma(x)(1 - \\sigma(x))$$"}</Latex>
            </div>

            <p className="text-slate-700 leading-relaxed mb-6">
                Since <Latex>{'$\\sigma(x)$'}</Latex> is bounded between <Latex>{'$0$'}</Latex> and <Latex>{'$1$'}</Latex>, its derivative is also bounded, and for most values of <Latex>{'$x$'}</Latex>, <Latex>{'$\\sigma\'(x)$'}</Latex> is close to zero (max value <Latex>{'$0.25$'}</Latex>). During backpropagation, the gradient at each layer is multiplied by the derivative of the activation function from the previous layer. In deep networks, this repeated multiplication can lead to an exponential decay of the gradient, making it nearly zero by the time it reaches the earlier layers:
            </p>

            <div className="bg-rose-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-rose-100">
                <Latex>{"$$\\frac{\\partial L}{\\partial W^{(l)}} \\approx \\left( \\prod_{k=l}^{L} \\sigma'(z^{(k)}) \\right) \\cdot \\frac{\\partial L}{\\partial z^{(L)}}$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
                where <Latex>{'$L$'}</Latex> is the total number of layers. If <Latex>{'$\\sigma\'(z^{(k)})$'}</Latex> is small, the product can approach zero, leading to <strong>vanishing gradients</strong>.
            </p>

            <p className="text-slate-700 leading-relaxed mb-6">
                Conversely, the <strong>exploding gradient problem</strong> arises when the gradients grow exponentially during backpropagation, leading to numerical instability. This typically happens when the weights of the network are initialized poorly or when the loss landscape has steep regions. In the case of exploding gradients, the derivative of the loss with respect to the weights can grow exponentially if the derivatives of the activation functions are large or if the weight matrices have large eigenvalues.
            </p>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-8 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Exponential Growth/Decay of Norms</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    Let <Latex>{'$f(x) = W^L \\sigma(W^{L-1} \\dots \\sigma(W^1 x) \\dots)$'}</Latex> be a deep neural network. The norm of the gradient of the loss <Latex>{'$L$'}</Latex> with respect to the input <Latex>{'$x$'}</Latex> satisfies:
                    <div className="text-center my-3"><Latex>{"$$\\|\\nabla_x L\\| = \\left\\| \\prod_{l=1}^{L} W^l \\sigma'(z^{(l)}) \\cdot \\nabla_y L \\right\\|$"}</Latex></div>
                    where <Latex>{'$y = f(x)$'}</Latex>. If <Latex>{'$\\left\\| W^l \\right\\| \\gg 1$'}</Latex> for most layers, the norm of the gradient can grow exponentially, leading to exploring gradients. Conversely, if <Latex>{'$\\left\\| W^l \\right\\| \\ll 1$'}</Latex>, the gradient can vanish.
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">Gradient Clipping and Other Techniques</h3>

            <h4 className="text-xl font-bold text-slate-800 mb-2 mt-6">Gradient Clipping</h4>
            <p className="text-slate-700 leading-relaxed mb-4">
                Gradient clipping is a technique used to prevent exploding gradients by capping the gradients at a predefined threshold. This is particularly useful in very deep networks or recurrent neural networks where the gradients can become excessively large. Let <Latex>{'$g$'}</Latex> be the gradient of the loss with respect to a parameter <Latex>{'$\\theta$'}</Latex>. In gradient clipping, the gradient is rescaled if its norm exceeds a certain threshold <Latex>{'$c$'}</Latex>:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{"$$\\tilde{g} = \\begin{cases} g & \\text{if } \\|g\\| \\le c \\\\ c \\cdot \\frac{g}{\\|g\\|} & \\text{if } \\|g\\| > c \\end{cases}$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
                This ensures that the gradients remain within a manageable range, preventing numerical instability during training.
            </p>

            <h4 className="text-xl font-bold text-slate-800 mb-2 mt-6">Weight Initialization</h4>
            <p className="text-slate-700 leading-relaxed mb-4">
                Proper weight initialization can mitigate the vanishing and exploding gradient problems. Techniques like Xavier initialization and He initialization are designed to keep the variance of the activations and gradients stable across layers.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8 relative overflow-hidden">
                <h4 className="text-lg font-bold text-indigo-900 mb-2">Xavier (Glorot) Initialization</h4>
                <div className="text-indigo-800 leading-relaxed mb-4">
                    For a layer with <Latex>{'$n_{\\text{in}}$'}</Latex> input units, Xavier initialization sets the weights <Latex>{'$W$'}</Latex> to be drawn from a uniform distribution:
                    <div className="text-center bg-white/60 p-4 rounded-xl border border-indigo-200/50 my-3 shadow-sm">
                        <Latex>{"$$W \\sim \\mathcal{U}\\left(-\\frac{\\sqrt{6}}{\\sqrt{n_{\\text{in}} + n_{\\text{out}}}}, \\frac{\\sqrt{6}}{\\sqrt{n_{\\text{in}} + n_{\\text{out}}}}\\right)$$"}</Latex>
                    </div>
                    where <Latex>{'$n_{\\text{out}}$'}</Latex> is the number of output units. This ensures that the variance of the activations remains constant across layers.
                </div>
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-2 mt-6">Batch Normalization</h4>
            <p className="text-slate-700 leading-relaxed mb-4">
                Batch normalization normalizes the activations within each mini-batch to have zero mean and unit variance. This helps to mitigate the vanishing and exploding gradient problems by ensuring that the input to each layer remains stable during training. Given a mini-batch <Latex>{'\\{x_1, x_2, \\dots, x_m\\}'}</Latex>, batch normalization transforms each activation <Latex>{'$x_i$'}</Latex> as:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 shadow-inner overflow-x-auto text-center border border-slate-100 font-mono">
                <Latex>{"$$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$$"}</Latex>
            </div>
            <p className="text-slate-700 font-medium mb-8">
                where <Latex>{'$\\mu_B$'}</Latex> and <Latex>{'$\\sigma_B^2$'}</Latex> are the mean and variance of the mini-batch, and <Latex>{'$\\epsilon$'}</Latex> is a small constant for numerical stability.
            </p>

            <button className="flex items-center gap-3 bg-sky-50 text-sky-700 px-6 py-4 rounded-2xl font-medium hover:bg-sky-100 transition-all active:scale-[0.98] w-full border border-sky-100 group shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Vanishing Gradients & Mitigations</span>
            </button>
        </div>
    );
}
