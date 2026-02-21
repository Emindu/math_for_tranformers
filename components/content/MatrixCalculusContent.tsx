"use client";

import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// ── Section 1: Differentiation of Matrix Functions ───────────────────────────
export function DifferentiationOfMatrixFunctions() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                Differentiation of Matrix Functions
            </h2>

            <p>
                Matrix calculus extends the principles of calculus to functions that take <strong>matrices as
                    inputs</strong> and produce matrices as outputs. In self-attention mechanisms, differentiating
                matrix functions is essential for <strong>backpropagation</strong> — the algorithm that computes
                gradients and updates model parameters during training.
            </p>

            <p>
                Consider a matrix-valued function <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}^{p \\times q}$'}</Latex>,
                mapping input <Latex>{'$X \\in \\mathbb{R}^{m \\times n}$'}</Latex> to output <Latex>{'$Y = f(X) \\in \\mathbb{R}^{p \\times q}$'}</Latex>.
                The derivative of <Latex>{'$f$'}</Latex> with respect to <Latex>{'$X$'}</Latex> is a <strong>fourth-order tensor</strong> describing
                how each element of <Latex>{'$Y$'}</Latex> changes with respect to each element of <Latex>{'$X$'}</Latex>.
            </p>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                Gradient Computation Techniques
            </h3>

            <p>
                The gradient of a scalar-valued function <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}$'}</Latex> with
                respect to matrix <Latex>{'$X$'}</Latex> is a matrix of partial derivatives:
            </p>

            <div className="bg-rose-50 p-4 rounded-lg my-4 border border-rose-200 text-center">
                <Latex>{'$(\\nabla_X f)_{ij} = \\frac{\\partial f}{\\partial X_{ij}}$'}</Latex>
            </div>

            <p>
                In self-attention, gradients are needed to update <Latex>{'$W^Q, W^K, W^V$'}</Latex> — the
                weight matrices for queries, keys, and values.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Trace Function</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    For <Latex>{'$f(X) = \\text{tr}(AX)$'}</Latex> where <Latex>{'$A \\in \\mathbb{R}^{m \\times n}$'}</Latex> is fixed:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\nabla_X\\, \\text{tr}(AX) = A^\\top$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Follows from linearity of trace and cyclical invariance: <Latex>{'$\\text{tr}(AB) = \\text{tr}(BA)$'}</Latex>.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Frobenius Norm</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    For <Latex>{'$f(X) = \\|X\\|_F^2 = \\text{tr}(X^\\top X)$'}</Latex>:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\nabla_X \\|X\\|_F^2 = 2X$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Used in loss functions measuring squared differences between predicted and true outputs.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Convergence Analysis ──────────────────────────────────────────
export function ConvergenceAnalysis() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Analysis of Convergence
            </h2>

            <p>
                Convergence analysis in the context of gradient-based optimization refers to the study of how
                and when an iterative optimization algorithm approaches a local or global minimum of the loss
                function. For a transformer model utilizing self-attention mechanisms, the goal is to ensure
                that the parameters converge to values that minimize the loss function, leading to optimal
                model performance.
            </p>

            <p>
                Let <Latex>{'$\\mathcal{L}(\\theta)$'}</Latex> be the loss function, where{' '}
                <Latex>{'$\\theta \\in \\mathbb{R}^d$'}</Latex> represents the vector of model parameters.
                The gradient descent algorithm updates the parameters iteratively:
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg my-4 border border-indigo-200 text-center">
                <Latex>{'$\\theta_{t+1} = \\theta_t - \\eta \\nabla \\mathcal{L}(\\theta_t)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\eta > 0$'}</Latex> is the learning rate and{' '}
                <Latex>{'$\\nabla \\mathcal{L}(\\theta_t)$'}</Latex> is the gradient at iteration{' '}
                <Latex>{'$t$'}</Latex>. For convergence to a local minimum, certain conditions on{' '}
                <Latex>{'$\\mathcal{L}(\\theta)$'}</Latex> and <Latex>{'$\\eta$'}</Latex> must be satisfied.
            </p>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Conditions for Convergence
            </h3>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Smoothness (Lipschitz Gradient)</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    The loss function is assumed to have Lipschitz-continuous gradients — there exists a
                    constant <Latex>{'$L > 0$'}</Latex> such that:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\|\\nabla \\mathcal{L}(\\theta_1) - \\nabla \\mathcal{L}(\\theta_2)\\| \\leq L\\|\\theta_1 - \\theta_2\\| \\quad \\forall\\, \\theta_1, \\theta_2 \\in \\mathbb{R}^d$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Ensures the gradient does not change too rapidly, providing stability for the descent steps.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Convexity</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    If <Latex>{'$\\mathcal{L}(\\theta)$'}</Latex> is convex — for all{' '}
                    <Latex>{'$\\theta_1, \\theta_2 \\in \\mathbb{R}^d$'}</Latex> and{' '}
                    <Latex>{'$\\lambda \\in [0,1]$'}</Latex>:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\mathcal{L}(\\lambda\\theta_1 + (1-\\lambda)\\theta_2) \\leq \\lambda\\mathcal{L}(\\theta_1) + (1-\\lambda)\\mathcal{L}(\\theta_2)$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Gradient descent is guaranteed to reach a global minimum. For deep networks the loss is
                    typically non-convex, so analysis focuses on local minima and saddle points.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Learning Rate Bound</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    For convergence, <Latex>{'$\\eta$'}</Latex> must satisfy:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$0 < \\eta < \\dfrac{2}{L}$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Under this bound, gradient descent converges to a stationary point where{' '}
                    <Latex>{'$\\nabla \\mathcal{L}(\\theta) = 0$'}</Latex>.
                </p>
            </div>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Convergence Rate
            </h3>

            <p>
                For a convex and smooth loss function, the convergence rate is <strong>linear</strong> —
                the distance to the minimum decreases geometrically with each iteration:
            </p>

            <div className="bg-indigo-50 p-4 rounded-lg my-4 border border-indigo-200 text-center">
                <Latex>{'$\\mathcal{L}(\\theta_t) - \\mathcal{L}(\\theta^*) \\leq (1 - \\eta\\mu)^t\\bigl(\\mathcal{L}(\\theta_0) - \\mathcal{L}(\\theta^*)\\bigr)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\theta^*$'}</Latex> is the optimal parameter vector and{' '}
                <Latex>{'$\\mu > 0$'}</Latex> is the strong-convexity constant of{' '}
                <Latex>{'$\\mathcal{L}(\\theta)$'}</Latex>. In practice, due to the non-convexity of neural
                network loss functions, additional techniques such as momentum or adaptive learning rates are
                used to accelerate convergence.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Training Implications</p>
                <p className="text-sm text-indigo-800">
                    The convergence guarantees above apply to idealized settings. In transformer training,
                    the non-convex loss landscape means convergence is not guaranteed to a global minimum.
                    However, understanding these theoretical bounds helps practitioners choose appropriate
                    learning rates and diagnose slow or divergent training runs.
                </p>
            </div>
        </div>
    );
}

// ── Section 4: Learning Rate Schedules ────────────────────────────────────────
export function LearningRateSchedules() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Learning Rate Schedules
            </h2>

            <p>
                The learning rate <Latex>{'$\\eta$'}</Latex> is a hyperparameter that significantly impacts
                the efficiency and success of the optimization process. A fixed learning rate may not be
                optimal throughout the entire training process, leading to the use of{' '}
                <strong>learning rate schedules</strong> that adjust <Latex>{'$\\eta$'}</Latex> dynamically
                during training.
            </p>

            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Types of Learning Rate Schedules
            </h3>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <h4 className="font-bold text-slate-800 m-0">Step Decay</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    The learning rate is reduced by a constant factor <Latex>{'$\\gamma$'}</Latex> after a
                    fixed number of epochs. If <Latex>{'$\\eta_0$'}</Latex> is the initial rate, the rate
                    at epoch <Latex>{'$t$'}</Latex> is:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t / T \\rfloor}$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Makes large initial steps to escape local minima, then smaller steps near a minimum.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <h4 className="font-bold text-slate-800 m-0">Exponential Decay</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    Continuously decreases the learning rate according to an exponential function:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\eta_t = \\eta_0 \\cdot \\exp(-\\lambda t)$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Provides a smooth reduction — advantageous when fine-tuning near a minimum.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <h4 className="font-bold text-slate-800 m-0">Polynomial Decay</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    Reduces the learning rate according to a polynomial function of the epoch number:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\eta_t = \\eta_0 \\cdot \\left(1 - \\dfrac{t}{T_{\\max}}\\right)^p$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Allows a gradual reduction — particularly useful in the later stages of training.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <h4 className="font-bold text-slate-800 m-0">Cosine Annealing</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    Gradually reduces the learning rate following the cosine function:
                </p>
                <div className="bg-white p-3 rounded border border-slate-100 text-center">
                    <Latex>{'$\\eta_t = \\eta_{\\min} + \\dfrac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\dfrac{t\\pi}{T_{\\max}}\\right)$'}</Latex>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Non-monotonic reduction allows the optimizer to potentially escape shallow local minima.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                    <h4 className="font-bold text-slate-800 m-0">Warm Restarts</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    Periodically resets the learning rate to a higher value after certain intervals, allowing
                    the optimization process to explore new regions of the parameter space. This creates a
                    <strong> cyclical learning rate schedule</strong> alternating between exploration and
                    exploitation phases.
                </p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Implications for Transformer Training</p>
                <p className="text-sm text-indigo-800">
                    The choice of learning rate schedule can significantly impact convergence and final
                    performance. A well-chosen schedule can accelerate convergence, prevent the optimizer
                    from getting trapped in poor local minima, and lead to better generalization. The
                    mathematical analysis of learning rate schedules often employs Lyapunov functions from
                    dynamical systems theory, which provide a measure of the stability of the optimization
                    process under decaying learning rates.
                </p>
            </div>
        </div>
    );
}

// ── Section 2: Jacobian and Hessian Matrices ─────────────────────────────────
export function JacobianAndHessianMatrices() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                Jacobian and Hessian Matrices
            </h2>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-4 mb-4">
                The Jacobian Matrix
            </h3>

            <p>
                The Jacobian generalizes the gradient to <strong>vector-valued functions</strong>.
                For <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}^p$'}</Latex>:
            </p>

            <div className="bg-rose-50 p-4 rounded-lg my-4 border border-rose-200 text-center">
                <Latex>{'$J_f(X) = \\frac{\\partial f(X)}{\\partial X} \\in \\mathbb{R}^{p \\times (mn)}$'}</Latex>
            </div>

            <p>
                Each row of <Latex>{'$J_f(X)$'}</Latex> corresponds to the gradient of one component of the output.
            </p>

            <div className="bg-slate-50 p-5 rounded-lg my-6 border border-slate-200">
                <div className="flex items-start gap-3 mb-3">
                    <span className="bg-rose-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">●</span>
                    <h4 className="font-bold text-slate-800 m-0">Softmax Jacobian</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                    The Jacobian of the softmax function is critical for backpropagation through attention:
                </p>
                <div className="bg-white p-4 rounded border border-slate-100 space-y-3">
                    <div className="text-center">
                        <Latex>{'$\\alpha_{ij} = \\frac{\\exp(S_{ij})}{\\sum_{k=1}^{n} \\exp(S_{ik})}$'}</Latex>
                    </div>
                    <div className="text-center">
                        <Latex>{'$(J_{\\text{softmax}}(S))_{ij,kl} = \\alpha_{ij}(\\delta_{jk} - \\alpha_{ik})$'}</Latex>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    where <Latex>{'$\\delta_{jk}$'}</Latex> is the Kronecker delta. This determines how gradients flow through the softmax layer.
                </p>
            </div>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                The Hessian Matrix
            </h3>

            <p>
                The Hessian generalizes the <strong>second derivative</strong> to matrix functions.
                For a scalar function <Latex>{'$f : \\mathbb{R}^{m \\times n} \\to \\mathbb{R}$'}</Latex>:
            </p>

            <div className="bg-rose-50 p-4 rounded-lg my-4 border border-rose-200 text-center">
                <Latex>{'$H_f(X) = \\frac{\\partial^2 f(X)}{\\partial X \\partial X^\\top} \\in \\mathbb{R}^{(mn) \\times (mn)}$'}</Latex>
            </div>

            <p>
                The Hessian encodes <strong>curvature</strong> information — essential for second-order
                optimization (Newton&apos;s method), detecting saddle points, and analyzing convergence stability.
            </p>

            <div className="bg-rose-50 border-l-4 border-rose-400 p-5 my-6">
                <p className="font-semibold text-rose-800 mb-2">Training Implications</p>
                <p className="text-sm text-rose-800">
                    If the loss function <Latex>{'$\\mathcal{L}$'}</Latex> is highly curved (large Hessian eigenvalues),
                    gradient descent steps must be adjusted to ensure stable convergence. The Hessian
                    also identifies directions in parameter space that require more precise adjustments,
                    enabling more efficient training.
                </p>
            </div>
        </div>
    );
}
