import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Play } from 'lucide-react';

export function ChainRuleContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                Backpropagation
                <span className="bg-sky-100 text-sky-700 text-sm px-3 py-1 rounded-full font-semibold">1.12.1</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Backpropagation is essentially an application of the chain rule of calculus, extended to functions represented by neural networks. It allows for the computation of gradients by systematically applying the chain rule from the output layer back to the input layer, hence the name "backpropagation."
            </p>

            <h3 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Chain Rule in Matrix Calculus</h3>
            <p className="text-slate-700 leading-relaxed mb-6">
                The chain rule is a fundamental tool in calculus, used to differentiate composite functions. In the context of neural networks, where functions are often represented as compositions of multiple layers, the chain rule is applied repeatedly to compute the derivative of the loss function with respect to each parameter. Let <Latex>{'$f : \\mathbb{R}^m \\to \\mathbb{R}^n$'}</Latex> and <Latex>{'$g : \\mathbb{R}^n \\to \\mathbb{R}^p$'}</Latex> be differentiable functions. The composite function <Latex>{'$h(x) = g(f(x))$'}</Latex> maps <Latex>{'$\\mathbb{R}^m$'}</Latex> to <Latex>{'$\\mathbb{R}^p$'}</Latex>. The derivative (or Jacobian matrix) of <Latex>{'$h(x)$'}</Latex> with respect to <Latex>{'$x$'}</Latex> is given by the chain rule:
            </p>

            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{"$$\\frac{\\partial h}{\\partial x} = \\frac{\\partial g}{\\partial f} \\cdot \\frac{\\partial f}{\\partial x}$$"}</Latex>
            </div>

            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$\\frac{\\partial g}{\\partial f}$'}</Latex> is the Jacobian matrix of <Latex>{'$g$'}</Latex> with respect to <Latex>{'$f(x)$'}</Latex> and <Latex>{'$\\frac{\\partial f}{\\partial x}$'}</Latex> is the Jacobian matrix of <Latex>{'$f$'}</Latex> with respect to <Latex>{'$x$'}</Latex>.
            </p>

            <div className="bg-sky-50 border-l-4 border-sky-500 p-6 rounded-r-xl mb-6 shadow-sm">
                <h4 className="text-lg font-bold text-sky-900 mb-2">Example: Single Hidden Layer</h4>
                <div className="text-sky-800 leading-relaxed mb-4">
                    Consider a neural network with a single hidden layer. Let the input <Latex>{'$x \\in \\mathbb{R}^m$'}</Latex> be mapped to a hidden representation <Latex>{'$h$'}</Latex> via a weight matrix <Latex>{'$W_1$'}</Latex> and an activation function <Latex>{'$\\sigma$'}</Latex>:
                    <div className="text-center my-3"><Latex>{"$$h = \\sigma(W_1 x)$$"}</Latex></div>
                    The output <Latex>{'$y$'}</Latex> is then computed as:
                    <div className="text-center my-3"><Latex>{"$$y = W_2 h = W_2 \\sigma(W_1 x)$$"}</Latex></div>
                </div>
                <div className="text-sky-800 leading-relaxed mb-0">
                    If the loss function <Latex>{'$L(y, \\hat{y})$'}</Latex> measures the discrepancy between the predicted output <Latex>{'$y$'}</Latex> and the true output <Latex>{'$\\hat{y}$'}</Latex>, the derivative of the loss with respect to <Latex>{'$W_1$'}</Latex> involves applying the chain rule:
                    <div className="text-center my-3"><Latex>{"$$\\frac{\\partial L}{\\partial W_1} = \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h} \\cdot \\frac{\\partial h}{\\partial W_1}$$"}</Latex></div>
                    Here, <Latex>{'$\\frac{\\partial L}{\\partial y}$'}</Latex> is the gradient of the loss with respect to the output, <Latex>{'$\\frac{\\partial y}{\\partial h} = W_2$'}</Latex>, and <Latex>{'$\\frac{\\partial h}{\\partial W_1}$'}</Latex> involves differentiating through the activation function <Latex>{'$\\sigma$'}</Latex>.
                </div>
            </div>

            <h4 className="text-xl font-semibold text-slate-800 mb-3">Matrix Chain Rule</h4>
            <p className="text-slate-700 leading-relaxed mb-6">
                When dealing with matrices, the chain rule is extended to account for the dimensions and interactions of matrix operations. Suppose <Latex>{'$A = f(X)$'}</Latex> and <Latex>{'$B = g(A)$'}</Latex> where <Latex>{'$X, A, B$'}</Latex> are matrices and <Latex>{'$f, g$'}</Latex> are matrix functions. The derivative of <Latex>{'$B$'}</Latex> with respect to <Latex>{'$X$'}</Latex> is computed using:
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{"$$\\frac{\\partial B}{\\partial X} = \\frac{\\partial B}{\\partial A} \\cdot \\frac{\\partial A}{\\partial X}$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6 text-sm">
                where <Latex>{'$\\frac{\\partial A}{\\partial X}$'}</Latex> and <Latex>{'$\\frac{\\partial B}{\\partial A}$'}</Latex> are tensor derivatives that account for the multi-dimensional nature of matrix operations.
            </p>

            <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                    Theorem 1.21 (Chain Rule for Scalar-Valued Functions)
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Let <Latex>{'$f : \\mathbb{R}^n \\to \\mathbb{R}^m$'}</Latex> and <Latex>{'$g : \\mathbb{R}^m \\to \\mathbb{R}$'}</Latex> be differentiable functions. The gradient of the composite function <Latex>{'$h(x) = g(f(x))$'}</Latex> with respect to <Latex>{'$x$'}</Latex> is given by
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200 mb-4">
                    <Latex>{"$$\\nabla h(x) = \\nabla f(x) \\cdot \\nabla g(f(x))$$"}</Latex>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-0">
                    where <Latex>{'$\\nabla f(x)$'}</Latex> is the Jacobian matrix of <Latex>{'$f$'}</Latex> and <Latex>{'$\\nabla g(f(x))$'}</Latex> is the gradient of <Latex>{'$g$'}</Latex> with respect to <Latex>{'$f(x)$'}</Latex>.
                </p>
            </div>

            <p className="text-slate-700 leading-relaxed mb-6 font-medium">
                The chain rule is particularly powerful in neural networks because it allows the gradient of the loss function with respect to any parameter to be computed efficiently by propagating gradients backward through the network. This efficiency is crucial given the large number of parameters typically involved in deep learning models.
            </p>

            <button className="flex items-center gap-3 bg-sky-50 text-sky-700 px-6 py-4 rounded-2xl font-medium hover:bg-sky-100 transition-all active:scale-[0.98] w-full border border-sky-100 group shadow-sm mt-4">
                <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Chain Rule Foundations</span>
            </button>
        </div>
    );
}

export function ErrorPropagationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Error Propagation in Neural Networks</h3>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                In backpropagation, errors are propagated backward through the network to update the weights in a way that minimizes the loss function. This process involves computing the gradient of the loss with respect to each weight in the network, starting from the output layer and moving backward to the input layer.
            </p>

            <h4 className="text-xl font-semibold text-slate-800 mb-3">Forward Pass</h4>
            <p className="text-slate-700 leading-relaxed mb-6">
                During the forward pass, the input data <Latex>{'$x$'}</Latex> is passed through the network layer by layer, and the output <Latex>{'$y$'}</Latex> is computed. Each layer applies a linear transformation followed by a non-linear activation function:
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl mb-6 shadow-inner overflow-x-auto text-center border border-slate-100">
                <Latex>{"$$h^{(l)} = \\sigma(W^{(l)}h^{(l-1)} + b^{(l)})$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-8">
                where <Latex>{'$h^{(l)}$'}</Latex> is the output of the <Latex>{'$l$'}</Latex>-th layer, <Latex>{'$W^{(l)}$'}</Latex> and <Latex>{'$b^{(l)}$'}</Latex> are the weight matrix and bias vector for that layer, and <Latex>{'$\\sigma$'}</Latex> is the activation function.
            </p>

            <h4 className="text-xl font-semibold text-slate-800 mb-3">Backward Pass</h4>
            <p className="text-slate-700 leading-relaxed mb-6">
                In the backward pass, the error at the output layer is computed as the gradient of the loss function with respect to the output. This error is then propagated backward through the network to update the weights. Let <Latex>{'$L$'}</Latex> be the loss function, and let <Latex>{'$\\delta^{(l)}$'}</Latex> denote the error term at layer <Latex>{'$l$'}</Latex>, defined as the gradient of the loss with respect to the linear combination of inputs to that layer:
            </p>
            <div className="bg-rose-50 p-4 rounded-2xl mb-6 shadow-sm overflow-x-auto text-center border border-rose-100">
                <Latex>{"$$\\delta^{(l)} = \\frac{\\partial L}{\\partial z^{(l)}} = \\frac{\\partial L}{\\partial h^{(l)}} \\cdot \\sigma'(z^{(l)})$$"}</Latex>
            </div>
            <p className="text-slate-700 leading-relaxed mb-6">
                where <Latex>{'$z^{(l)} = W^{(l)}h^{(l-1)} + b^{(l)}$'}</Latex> is the input to the activation function at layer <Latex>{'$l$'}</Latex>.
            </p>

            <p className="text-slate-700 leading-relaxed mb-4">
                The weight updates are then computed using:
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                    <Latex>{"$$\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} \\cdot (h^{(l-1)})^T$$"}</Latex>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                    <Latex>{"$$\\frac{\\partial L}{\\partial b^{(l)}} = \\delta^{(l)}$$"}</Latex>
                </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 p-6 rounded-2xl mb-8 relative overflow-hidden">
                <h4 className="text-lg font-bold text-sky-900 mb-3 relative z-10">
                    Recursive Error Propagation
                </h4>
                <p className="text-sky-800 leading-relaxed mb-4 relative z-10">
                    The error <Latex>{'$\\delta^{(l)}$'}</Latex> at layer <Latex>{'$l$'}</Latex> can be expressed recursively in terms of the error at the subsequent layer <Latex>{'$\\delta^{(l+1)}$'}</Latex>:
                </p>
                <div className="bg-white/60 p-4 rounded-xl text-center border border-sky-200/50 mb-4 relative z-10 shadow-sm">
                    <Latex>{"$$\\delta^{(l)} = (W^{(l+1)})^T \\delta^{(l+1)} \\cdot \\sigma'(z^{(l)})$$"}</Latex>
                </div>
                <p className="text-sky-800 text-sm leading-relaxed mb-0 relative z-10 font-medium">
                    This recursion allows the error to be efficiently propagated from the output layer back to the input layer. Note: The text provides the form without transposes, but the standard vector-Jacobian product requires <Latex>{'$(W^{(l+1)})^T$'}</Latex> for dimensional consistency.
                </p>
            </div>

            <div className="bg-slate-800 text-slate-200 p-6 rounded-2xl mb-8 shadow-lg">
                <h4 className="text-lg font-bold text-white mb-2">
                    Remark
                </h4>
                <p className="leading-relaxed mb-4 text-slate-300">
                    For a neural network with <Latex>{'$L$'}</Latex> layers, the gradient of the loss function <Latex>{'$L$'}</Latex> with respect to the weights <Latex>{'$W^{(l)}$'}</Latex> in the <Latex>{'$l$'}</Latex>-th layer is given by:
                </p>
                <div className="bg-slate-900 p-4 rounded-xl text-center border border-slate-700 mb-4 font-mono">
                    <Latex>{"$$\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} \\cdot (h^{(l-1)})^T$$"}</Latex>
                </div>
                <p className="text-sm text-slate-400 mb-0">
                    where <Latex>{'$\\delta^{(l)} = \\frac{\\partial L}{\\partial z^{(l)}}$'}</Latex> is the backpropagated error and <Latex>{'$h^{(l-1)}$'}</Latex> is the output of the previous layer.
                </p>
            </div>

            <div className="bg-white border-2 border-slate-100 p-6 rounded-2xl mb-8">
                <h4 className="text-lg font-bold text-slate-900 mb-3">
                    Example: Backpropagation Walkthrough
                </h4>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Consider a simple neural network with a single hidden layer. The network output is <Latex>{'$y = \\sigma(W_2 \\sigma(W_1 x))$'}</Latex>, and the loss function is the mean squared error <Latex>{'$L = \\frac{1}{2}(y - \\hat{y})^2$'}</Latex>. During backpropagation, the error is computed at the output layer and propagated backward to update the weights <Latex>{'$W_1$'}</Latex> and <Latex>{'$W_2$'}</Latex>.
                </p>
                <p className="text-slate-700 leading-relaxed mb-4">
                    If <Latex>{'$\\sigma$'}</Latex> is the ReLU activation function, then the gradient of the loss with respect to <Latex>{'$W_2$'}</Latex> is:
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200 mb-4">
                    <Latex>{"$$\\frac{\\partial L}{\\partial W_2} = (y - \\hat{y}) \\cdot \\sigma(W_1 x)^T$$"}</Latex>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                    and the gradient with respect to <Latex>{'$W_1$'}</Latex> is:
                </p>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200 mb-0">
                    <Latex>{"$$\\frac{\\partial L}{\\partial W_1} = \\Big((y - \\hat{y}) \\cdot W_2 \\cdot \\sigma'(w_1 x)\\Big) \\cdot x^T$$"}</Latex>
                </div>
            </div>

            <button className="flex items-center gap-3 bg-sky-50 text-sky-700 px-6 py-4 rounded-2xl font-medium hover:bg-sky-100 transition-all active:scale-[0.98] w-full border border-sky-100 group shadow-sm mt-8">
                <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Play size={20} className="ml-1" />
                </div>
                <span>Audio Track: Forward & Backward Passes</span>
            </button>
        </div>
    );
}
