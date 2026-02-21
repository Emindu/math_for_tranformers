"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export default function AutoDiffContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Automatic Differentiation
                <span className="bg-sky-100 text-sky-700 text-sm px-3 py-1 rounded-full font-semibold">1.12.2</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Automatic differentiation (autodiff) is a computational technique that efficiently computes derivatives of functions specified by computer programs. Unlike <strong>symbolic differentiation</strong>, which involves manipulating mathematical expressions, or <strong>numerical differentiation</strong>, which approximates derivatives using finite differences, autodiff provides exact derivatives with minimal computational overhead. This is particularly important in deep learning, where models like transformers require the computation of gradients for optimization.
            </p>

            <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Forward Mode Differentiation</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                In forward mode automatic differentiation, the derivative of each operation is computed simultaneously as the operation is performed, propagating derivatives from the inputs to the output. Let <Latex>{'$f : \\mathbb{R}^n \\to \\mathbb{R}^m$'}</Latex> be a function composed of intermediate variables <Latex>{'$z_1, z_2, \\dots, z_k$'}</Latex>, where each <Latex>{'$z_i$'}</Latex> depends on a subset of the previous variables. Forward mode calculates the derivative of the output with respect to each input by applying the chain rule in a straightforward manner.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                Mathematically, for each intermediate variable <Latex>{'$z_i$'}</Latex>, the derivative <Latex>{'$\\dot{z}_i$'}</Latex> with respect to a specific input <Latex>{'$x_j$'}</Latex> is computed as:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{"$$\\dot{z}_i = \\sum_{k \\in \\text{parents}(z_i)} \\frac{\\partial z_i}{\\partial z_k} \\dot{z}_k$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$\\dot{z}_k$'}</Latex> is the derivative of the parent variable <Latex>{'$z_k$'}</Latex> with respect to <Latex>{'$x_j$'}</Latex>.
            </p>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-8 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Example: Forward Mode</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    Consider the function <Latex>{'$f(x_1, x_2) = \\sin(x_1) + x_1 x_2^2$'}</Latex>. To compute the derivative of <Latex>{'$f$'}</Latex> with respect to <Latex>{'$x_1$'}</Latex> using forward mode, we start by defining the intermediate variables:
                    <div className="text-center my-3"><Latex>{"$$z_1 = \\sin(x_1), \\quad z_2 = x_1 x_2^2$$"}</Latex></div>
                    The derivative with respect to <Latex>{'$x_1$'}</Latex> is:
                    <div className="text-center my-3"><Latex>{"$$\\frac{df}{dx_1} = \\frac{dz_1}{dx_1} + \\frac{dz_2}{dx_1} = \\cos(x_1) + x_2^2$$"}</Latex></div>
                </div>
            </div>


            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">Reverse Mode Differentiation</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                Reverse mode automatic differentiation, commonly used in backpropagation, computes the derivative of the output with respect to each input by propagating derivatives backward from the output to the inputs. This mode is particularly efficient when the function has many inputs and a single output, as it computes the gradient with respect to all inputs in a single backward pass.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
                Mathematically, reverse mode computes the derivative (adjoint) <Latex>{'$\\bar{z}_i$'}</Latex> of the output with respect to each intermediate variable <Latex>{'$z_i$'}</Latex> using the chain rule in reverse:
            </p>
            <div className="bg-rose-50 p-6 rounded-2xl mb-6 shadow-sm overflow-x-auto text-center border border-rose-100">
                <Latex>{"$$\\bar{z}_i = \\sum_{k \\in \\text{children}(z_i)} \\bar{z}_k \\frac{\\partial z_k}{\\partial z_i}$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$\\bar{z}_k$'}</Latex> is the derivative of the output with respect to the child variable <Latex>{'$z_k$'}</Latex>.
            </p>

            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-xl mb-8 shadow-sm">
                <h4 className="text-lg font-bold text-rose-900 mb-2">Example: Reverse Mode</h4>
                <div className="text-rose-800 leading-relaxed mb-4">
                    For the same function <Latex>{'$f(x_1, x_2) = \\sin(x_1) + x_1 x_2^2$'}</Latex>, reverse mode starts by computing the derivative of <Latex>{'$f$'}</Latex> with respect to the output and then propagates it backward to each input:
                    <div className="text-center my-3"><Latex>{"$$\\bar{z}_1 = 1, \\quad \\bar{z}_2 = 1$$"}</Latex></div>
                    Then, the derivatives with respect to the inputs are computed as:
                    <div className="text-center my-3"><Latex>{"$$\\frac{df}{dx_1} = \\bar{z}_1 \\cdot \\frac{dz_1}{dx_1} + \\bar{z}_2 \\cdot \\frac{dz_2}{dx_1} = \\cos(x_1) + x_2^2$$"}</Latex></div>
                    <div className="text-center my-3"><Latex>{"$$\\frac{df}{dx_2} = \\bar{z}_2 \\cdot \\frac{dz_2}{dx_2} = 2x_1 x_2$$"}</Latex></div>
                </div>
            </div>

            <div className="bg-indigo-900 text-indigo-100 p-6 rounded-2xl mb-8 shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">
                    Computational Complexity: <Latex>{'$O(n)$'}</Latex>
                </h4>
                <div className="leading-relaxed mb-0 text-indigo-200">
                    Let <Latex>{'$f : \\mathbb{R}^n \\to \\mathbb{R}$'}</Latex> be a differentiable function. The reverse mode of automatic differentiation computes the gradient <Latex>{'$\\nabla f(x)$'}</Latex> with respect to all inputs <Latex>{'$x \\in \\mathbb{R}^n$'}</Latex> with a computational cost proportional to that of evaluating <Latex>{'$f(x)$'}</Latex>. Specifically, the time complexity of reverse mode is <Latex>{'$\\mathcal{O}(n)$'}</Latex>, making it highly efficient for scalar-valued functions with many inputs.
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-slate-800 mt-12 mb-4">Autodiff in Transformers</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                In transformer models, which typically involve complex compositions of linear transformations, attention mechanisms, and non-linear activations, reverse mode automatic differentiation is used to compute gradients during backpropagation. This allows for efficient optimization of model parameters using gradient-based methods.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
                For example, in the multi-head self-attention mechanism, the output is a weighted sum of value vectors, where the weights are computed based on the similarity between queries and keys. To optimize this mechanism, gradients of the loss function with respect to the query, key, and value matrices are required. Reverse mode autodiff efficiently computes these gradients by propagating errors back through the layers and attention heads. Let <Latex>{'$L$'}</Latex> be the loss function, and let <Latex>{'$\\Theta = \\{W_Q, W_K, W_V, W_O, \\dots\\}$'}</Latex> represent the set of trainable parameters:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 shadow-inner overflow-x-auto text-center border border-slate-100 font-mono">
                <Latex>{"$$\\nabla_{\\theta} L = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial \\theta}$$"}</Latex>
            </div>
            <p className="text-slate-700 font-medium mb-8">
                The efficiency of this computation is critical for training large-scale transformer models with millions or billions of parameters.
            </p>

            <button className="flex items-center gap-3 bg-sky-50 text-sky-700 px-6 py-4 rounded-2xl font-medium hover:bg-sky-100 transition-all active:scale-[0.98] w-full border border-sky-100 group shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Forward vs. Reverse Mode</span>
            </button>
        </div>
    );
}
