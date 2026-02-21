import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

// ── Section 1: Introduction to Approximation Theory ────────────────────────────────
export function IntroToApproximationTheory() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-2 mb-4">
                Introduction to Approximation Theory
            </h2>

            <p>
                Approximation theory is a foundational branch of mathematical analysis that deals with how complex
                functions can be approximated by simpler, computationally feasible functions—such as polynomials or
                trigonometric series. In the context of neural networks and transformers, this theory provides the
                mathematical underpinning for understanding how well a model can represent the underlying data distribution.
            </p>

            <p>
                Let <Latex>{'$f : [a, b] \\to \\mathbb{R}$'}</Latex> be a continuous function. The primary goal of approximation theory
                is to find a sequence of simpler functions <Latex>{'\\{f_n\\}'}</Latex> that converge to <Latex>{'$f$'}</Latex> in some specified
                sense, typically measured by a norm such as the <Latex>{'$L_p$'}</Latex> norm or the maximum norm (sup norm).
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Polynomial and Trigonometric Approximations
            </h3>

            <p>
                <strong>Polynomial Approximation:</strong> A fundamental result is the <strong>Weierstrass Approximation Theorem</strong>,
                which states that any continuous function defined on a closed interval can be uniformly approximated by polynomials.
            </p>

            <div className="bg-teal-50 p-5 rounded-lg my-6 text-sm text-teal-900 border border-teal-100">
                <p>
                    Formally, if <Latex>{'$f$'}</Latex> is a continuous function on <Latex>{'$[a, b]$'}</Latex>, then for every <Latex>{'$\\epsilon > 0$'}</Latex>,
                    there exists a polynomial <Latex>{'$P_n(x)$'}</Latex> such that:
                </p>
                <div className="text-center font-mono mt-3 bg-white p-2 rounded shadow-sm border border-teal-200 overflow-x-auto">
                    <Latex>{'$\\lVert f - P_n \\rVert_\\infty = \\sup_{x \\in [a,b]} |f(x) - P_n(x)| < \\epsilon$'}</Latex>
                </div>
            </div>

            <p>
                This implies that polynomials are <em>dense</em> in the space of continuous functions with respect to the uniform norm.
                For example, by using a Taylor series expansion around <Latex>{'$x = 0$'}</Latex>, we can approximate <Latex>{'$\\sin(x)$'}</Latex>:
            </p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$\\sin(x) \\approx x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$'}</Latex>
            </div>

            <p>
                <strong>Trigonometric Approximation:</strong> For periodic functions, trigonometric polynomials provide a powerful
                approximation tool. A trigonometric polynomial of degree <Latex>{'$n$'}</Latex> takes the form of a Fourier series.
                The convergence of these series is often studied using the <Latex>{'$L_2$'}</Latex> norm due to Parseval's theorem:
            </p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$\\lVert f \\rVert_2^2 = \\sum_{k=0}^\\infty (a_k^2 + b_k^2)$'}</Latex>
            </div>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Beyond Standard Feedforward Networks: Self-Attention
            </h3>

            <LessonAudio
                title="Self-Attention as an Approximator"
                script="While classical theorems focus on standard feedforward networks, modern transformers rely heavily on the self-attention mechanism. Recent research has shown that self-attention layers themselves are universal approximators for sequence-to-sequence functions. The mechanism transforms input embeddings into queries, keys, and values. The attention weights, calculated by the dot-product of queries and keys followed by softmax, dictate how much each element attends to others, allowing the network to dynamically form highly complex functions."
            />

            <p>
                While the classical theorem applies to Multi-Layer Perceptrons (MLPs), modern architectures rely heavily on different mechanisms. For transformers, the pivotal component is the <strong>Self-Attention</strong> mechanism. Recent theoretical work has expanded the universal approximation properties to include these architectures.
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Jackson's Theorems
            </h3>

            <p>
                Jackson's theorems provide quantitative results on the <em>rate</em> of approximation. They establish a direct relationship
                between the smoothness of a function and the rate at which its best approximation converges.
            </p>

            <div className="bg-slate-50 border-l-4 border-teal-500 p-4 rounded-r-lg shadow-sm mt-6 mb-6">
                <h5 className="font-bold text-slate-800 mb-1">Theorem 1.5 (Jackson's Polynomial Approximation)</h5>
                <p className="text-sm text-slate-700 mb-2">
                    Let <Latex>{'$f : [-1, 1] \\to \\mathbb{R}$'}</Latex> be a continuous function with a modulus of continuity <Latex>{'$\\omega(f, \\delta)$'}</Latex>.
                    Then there exists a polynomial <Latex>{'$P_n(x)$'}</Latex> of degree <Latex>{'$n$'}</Latex> such that:
                </p>
                <div className="text-center font-mono text-slate-800 mb-3 text-sm">
                    <Latex>{'$\\lVert f - P_n \\rVert_\\infty \\le C \\frac{\\omega(f, 1/n)}{n}$'}</Latex>
                </div>
                <p className="text-sm text-slate-700 mt-2">
                    Where <Latex>{'$C$'}</Latex> is a constant independent of <Latex>{'$n$'}</Latex> and <Latex>{'$f$'}</Latex>.
                </p>
            </div>

            <p>
                <strong>Implications for Machine Learning:</strong> The Universal Approximation Theorem states that a sufficiently large
                neural network can approximate any continuous function, acting as the deep learning analog to the Weierstrass theorem.
                However, practical performance also depends heavily on the <em>rate of convergence</em>. Jackson's theorems illustrate
                why the smoothness of the target function directly dictates how deep or complex a network needs to be to achieve practical accuracy.
            </p>

        </div>
    );
}

// ── Section 2: Universal Approximation Theorems ────────────────────────────────
import LessonAudio from '@/components/ui/LessonAudio';

export function UniversalApproximationTheorems() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-2 mb-4">
                Universal Approximation Theorems
            </h2>

            <LessonAudio
                title="Universal Approximation Overview"
                script="The Universal Approximation Theorem is a fundamental result in deep learning. It states that a feedforward network with a linear output layer and at least one hidden layer with an activation function like ReLU or Sigmoid can approximate any continuous function on a closed and bounded subset of n dimensional space, to any desired non-zero amount of error. This means networks are general purpose function approximators."
            />

            <p>
                The foundations of neural networks as universal function approximators were laid in the late 1980s and early 1990s. The Universal Approximation Theorem is a broad term for a family of mathematical results that demonstrate the remarkable capacity of neural networks to represent a wide variety of functions.
            </p>

            <p>
                <strong>Example:</strong> Consider the function <Latex>{'$f(x) = |x|$'}</Latex> on the interval <Latex>{'$[-1, 1]$'}</Latex>. A neural network with a ReLU activation function <Latex>{'$\\sigma(x) = \\max(0, x)$'}</Latex> can approximate <Latex>{'$f(x)$'}</Latex> as follows:
            </p>

            <div className="text-center font-mono mt-3 mb-3 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$f(x) = x \\cdot \\mathbf{1}_{x\\ge0} - x \\cdot \\mathbf{1}_{x<0}$'}</Latex>
            </div>

            <p>This can be rewritten as:</p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$f(x) = \\sigma(x) + \\sigma(-x)$'}</Latex>
            </div>

            <p>
                demonstrating that even simple piecewise linear functions like the absolute value function can be exactly represented by a neural network with ReLU activation.
            </p>

            <p>
                <strong>Extensions:</strong> The universal approximation theorem has been extended in various ways, including to networks with more than one hidden layer (deep networks) and to different types of activation functions, such as sigmoid or hyperbolic tangent functions. These extensions show that deep neural networks, with sufficient depth and width, are also universal approximators.
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Implications for Transformers
            </h3>

            <p>
                Transformers, as deep neural network architectures, inherit the universal approximation capabilities discussed in the universal approximation theorem. However, their specific architecture, which relies on self-attention mechanisms and layer normalization, introduces additional layers of complexity and expressiveness.
            </p>

            <p>
                <strong>Self-Attention Mechanism as a Function Approximator:</strong> The self-attention mechanism in transformers can be viewed as a special case of a neural network layer, where the attention weights dynamically adjust based on the input sequence. This mechanism allows the model to focus on different parts of the input sequence, effectively approximating functions that capture dependencies and interactions between different elements of the sequence.
            </p>

            <p>
                Mathematically, let <Latex>{'$X = \\{x_1, x_2, \\dots, x_n\\}$'}</Latex> be an input sequence, and let <Latex>{'$W_Q, W_K, W_V$'}</Latex> be the learned weight matrices for the query, key, and value projections. The self-attention mechanism computes the output as:
            </p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200 overflow-x-auto">
                <Latex>{'$\\text{Attention}(Q, K, V) = \\text{Softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right)V$'}</Latex>
            </div>

            <p>
                where <Latex>{'$Q = X W_Q$'}</Latex>, <Latex>{'$K = X W_K$'}</Latex>, and <Latex>{'$V = X W_V$'}</Latex>. The softmax operation ensures that the attention weights sum to 1, providing a weighted sum of the value vectors. This mechanism is highly expressive, as it can capture complex dependencies within the sequence, effectively learning to approximate functions that map input sequences to output sequences.
            </p>

            <p>
                <strong>Transformers as Universal Approximators:</strong> Transformers, like other deep neural networks, are capable of universal approximation. The specific architecture of transformers, with multiple layers of self-attention followed by feedforward neural networks, allows them to approximate a wide range of functions. The stacking of layers in transformers provides additional depth, which is crucial for capturing hierarchical structures in data.
            </p>

            <p>
                <strong>Implications for Model Design:</strong> The universal approximation property of transformers suggests that, in principle, they can approximate any function on a compact domain, given sufficient layers and attention heads. However, in practice, the ability to achieve this approximation depends on factors such as:
            </p>

            <ul className="list-disc pl-6 space-y-3 mb-6 text-slate-700">
                <li>
                    <strong>Model Capacity:</strong> The number of layers, attention heads, and hidden units determines the capacity of the transformer to approximate complex functions. Increasing the model capacity not only improves its expressiveness but also increases the risk of overfitting and computational cost.
                </li>
                <li>
                    <strong>Training Efficiency:</strong> The training process, including the choice of optimization algorithms and learning rate schedules, affects how well the transformer can approximate the target function. Convergence guarantees, as discussed in optimization theory, play a critical role in determining whether the model reaches a good approximation.
                </li>
                <li>
                    <strong>Generalization:</strong> While transformers can approximate functions on the training data, their ability to generalize to unseen data is crucial for real-world applications. This generalization depends on the regularization techniques used, such as dropout or weight decay, and the availability of sufficient and diverse training data.
                </li>
            </ul>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg shadow-sm mt-6 mb-6">
                <h5 className="font-bold text-teal-900 mb-1">Theorem 1.8 (Universal Approximation for Transformers)</h5>
                <p className="text-sm text-teal-800 mb-2">
                    Let <Latex>{'$f : [a, b]^n \\to \\mathbb{R}^m$'}</Latex> be a continuous function on a compact domain. For any <Latex>{'$\\epsilon > 0$'}</Latex>, there exists a transformer model <Latex>{'$T_\\theta$'}</Latex> with a sufficient number of layers and attention heads, and parameters <Latex>{'$\\theta$'}</Latex>, such that:
                </p>
                <div className="text-center font-mono text-teal-900 mb-2 text-sm">
                    <Latex>{'$\\sup_{x \\in [a,b]^n} \\lVert f(x) - T_\\theta(x) \\rVert < \\epsilon$'}</Latex>
                </div>
                <p className="text-sm text-teal-800 mt-2">
                    This theorem highlights that transformers, given appropriate architecture and training, can approximate complex functions to arbitrary accuracy, aligning with the broader results of universal approximation in neural networks.
                </p>
            </div>
        </div>
    );
}

// ── Section 3: Expressivity in Transformer Models ────────────────────────────────

export function ExpressivityInTransformers() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-teal-700 border-b-2 border-teal-200 pb-2 mb-4">
                Expressivity in Transformer Models
            </h2>

            <p>
                Expressivity in transformer models refers to the ability of these models to represent a wide range of functions, capturing complex relationships within data. This expressivity is influenced by various factors, including the depth and width of the model, as well as the role of non-linearities in the architecture. A deep understanding of these factors is essential for designing transformers that are not only powerful but also efficient in their computational requirements.
            </p>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Depth Versus Width in Model Design
            </h3>

            <LessonAudio
                title="Depth Vs Width Overview"
                script="In neural networks, depth is the number of layers, and width is the number of neurons per layer. Depth allows the model to build hierarchical representations. Telgarsky's Theorem proves that increasing depth exponentially increases expressivity, allowing the network to capture highly oscillatory, complex features that wide but shallow networks struggle with. Width increases basic capacity, but deep networks are essential for tasks like machine translation that require deep syntactic understanding."
            />

            <p>
                In the design of neural networks, including transformers, two critical architectural aspects are <strong>depth</strong> (the number of layers) and <strong>width</strong> (the number of units or neurons in each layer). These two dimensions influence the model's capacity to approximate functions and capture complex patterns in the data.
            </p>

            <p>
                <strong>Depth</strong> in a transformer model refers to the number of layers in the network. Each layer typically consists of a self-attention mechanism followed by a feedforward neural network. Depth allows the model to build hierarchical representations of the data, with deeper layers capturing increasingly abstract features. Mathematically, let <Latex>{'$f : \\mathbb{R}^n \\to \\mathbb{R}^m$'}</Latex> be a function that the transformer aims to approximate. The output of a transformer with <Latex>{'$L$'}</Latex> layers can be represented as:
            </p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$f(x) \\approx T_L(T_{L-1}(\\dots T_1(x) \\dots))$'}</Latex>
            </div>

            <p>
                where each <Latex>{'$T_i(x)$'}</Latex> represents the transformation applied by the <Latex>{'$i$'}</Latex>-th layer, including self-attention and feedforward operations.
            </p>

            <p>
                Theoretical results suggest that increasing the depth of a network enhances its expressivity, often exponentially. A seminal result by Telgarsky (2016) shows that deep networks can represent highly oscillatory functions that shallow networks cannot approximate efficiently, even with an exponentially larger number of units.
            </p>

            <div className="bg-slate-50 border-l-4 border-cyan-500 p-4 rounded-r-lg shadow-sm mt-6 mb-6">
                <h5 className="font-bold text-slate-800 mb-1">Theorem 1.9</h5>
                <p className="text-sm text-slate-700 mb-2">
                    Let <Latex>{'$f_d$'}</Latex> be a function representable by a deep network with <Latex>{'$d$'}</Latex> layers, each with a fixed number of units. There exists a family of functions <Latex>{'$f_d(x)$'}</Latex> such that:
                </p>
                <div className="text-center font-mono text-slate-800 mb-3 text-sm">
                    <Latex>{'$\\sup_x | f_d(x) | = 1$'}</Latex>
                </div>
                <p className="text-sm text-slate-700 mt-2">
                    but any network with <Latex>{'$d - 1$'}</Latex> layers requires exponentially more units to approximate <Latex>{'$f_d$'}</Latex> within a given error <Latex>{'$\\epsilon$'}</Latex>.
                </p>
            </div>

            <p>
                This result indicates that depth can provide an exponential increase in expressivity, allowing deep networks to approximate functions with complex structures that shallow networks cannot.
            </p>

            <p>
                <strong>Width</strong>, on the other hand, refers to the number of units in each layer of the network. While increasing width can also enhance the model's capacity, its impact is different from that of depth. Wide networks can represent more features at each level of abstraction but may struggle to capture deep, hierarchical structures.
            </p>

            <p>
                A fundamental result in approximation theory is that sufficiently wide networks with a single hidden layer can approximate any continuous function on a compact domain (the universal approximation theorem). However, this comes at the cost of potentially requiring an exponentially large number of units, especially if the target function has high complexity.
            </p>

            <p>
                <strong>Expressivity and the Trade-off:</strong> The expressivity of a transformer model is therefore a balance between depth and width. Deeper models can capture more complex, hierarchical relationships, while wider models can represent more features simultaneously. The choice between depth and width is often dictated by the specific task, the nature of the data, and computational constraints.
            </p>

            <div className="bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg shadow-sm mt-6 mb-6">
                <strong className="text-slate-800">Example (Machine Translation):</strong> Consider the task of machine translation, where the goal is to map a sequence of words in one language to a sequence in another language. A deep transformer can effectively capture the hierarchical structure of the input sentence (e.g., syntactic dependencies) and produce a context-aware representation that facilitates accurate translation. If the transformer were shallow but wide, it might struggle to capture these dependencies effectively, leading to inferior translation quality.
            </div>

            <h3 className="text-xl font-bold text-teal-700 border-b border-teal-200 pb-1 mt-8 mb-4">
                Role of Non-linearities
            </h3>

            <LessonAudio
                title="The Role of Non-linearities"
                script="Without non-linear activation functions like ReLU or Tanh, stacking any number of network layers mathematically mathematically collapses into just a single linear transformation. Non-linearities allow the network to fold and warp the input space, enabling the approximation of highly complex, non-linear functions. Theorem 1 point 10 highlights that depth combined with these non-linearities is mathematically essential for hierarchical pattern recognition."
            />

            <p>
                Non-linearities in neural networks, including transformers, are crucial for enabling these models to approximate complex functions. Without non-linear activation functions, a neural network composed of linear layers would be equivalent to a single linear transformation, regardless of the depth, and thus would be incapable of representing non-linear relationships in the data.
            </p>

            <p>
                A non-linear activation function <Latex>{'$\\sigma : \\mathbb{R} \\to \\mathbb{R}$'}</Latex> is applied element-wise to the output of each layer in a neural network. Common activation functions include the rectified linear unit (ReLU), sigmoid, and hyperbolic tangent (tanh). The non-linearity introduced by these functions allows the network to approximate non-linear functions.
            </p>

            <p>
                Mathematically, consider a feedforward neural network layer given by:
            </p>

            <div className="text-center font-mono mt-3 mb-6 bg-slate-50 p-3 rounded shadow-inner text-slate-700 border border-slate-200">
                <Latex>{'$z^{(l+1)} = \\sigma(W^{(l)}z^{(l)} + b^{(l)})$'}</Latex>
            </div>

            <p>
                where <Latex>{'$W^{(l)}$'}</Latex> is the weight matrix, <Latex>{'$z^{(l)}$'}</Latex> is the input to the layer, <Latex>{'$b^{(l)}$'}</Latex> is the bias term, and <Latex>{'$\\sigma$'}</Latex> is the activation function. The non-linearity <Latex>{'$\\sigma$'}</Latex> is what allows the network to break free from the limitations of linear transformations.
            </p>

            <p>
                <strong>Impact of Non-Linearities on Expressivity:</strong> The inclusion of non-linearities greatly increases the expressivity of a neural network. A network with non-linear activation functions can approximate a much broader class of functions compared to a purely linear network. This is critical in transformers, where non-linearities enable the self-attention mechanism and the feedforward layers to capture complex patterns and relationships in the data.
            </p>

            <p>
                In a transformer model, the feedforward network following the self-attention mechanism typically includes a non-linear activation function like ReLU. This non-linearity allows the model to refine the representation of the input sequence in a non-linear way, enhancing its ability to model intricate dependencies and interactions between elements of the sequence.
            </p>

            <p>
                <strong>Deep Versus Shallow Networks and Non-Linearities:</strong> Deep networks with multiple layers of non-linear transformations can approximate functions that require multiple levels of abstraction, something that shallow networks with the same number of non-linear units cannot do efficiently. This layered structure, combined with non-linearities, allows transformers to progressively build complex representations from simpler ones, capturing the hierarchical nature of many tasks, such as language processing and image recognition.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-600 p-4 rounded-r-lg shadow-sm mt-6 mb-6">
                <h5 className="font-bold text-teal-900 mb-1">Theorem 1.10 (Depth Efficiency of Deep Networks)</h5>
                <p className="text-sm text-teal-800 mb-2">
                    Let <Latex>{'$\\sigma : \\mathbb{R} \\to \\mathbb{R}$'}</Latex> be a fixed non-linear activation function, and consider the function class <Latex>{'$\\mathcal{F}_{L,d}$'}</Latex> representing the set of functions <Latex>{'$f : \\mathbb{R}^n \\to \\mathbb{R}$'}</Latex> that can be realized by a feedforward neural network with <Latex>{'$L$'}</Latex> layers, each layer containing at most <Latex>{'$d$'}</Latex> units, and each unit applying the activation function <Latex>{'$\\sigma$'}</Latex>.
                </p>
                <p className="text-sm text-teal-800 mb-2">
                    For any positive integer <Latex>{'$L_1$'}</Latex>, there exists a function <Latex>{'$f \\in \\mathcal{F}_{L_2, d_2}$'}</Latex> for some <Latex>{'$L_2 > L_1$'}</Latex> and <Latex>{'$d_2 \\ge d_1$'}</Latex>, such that for any function <Latex>{'$\\tilde{f} \\in \\mathcal{F}_{L_1, d_1}$'}</Latex>, where <Latex>{'$d_1$'}</Latex> is a polynomially bounded function of <Latex>{'$d_2$'}</Latex>, the approximation error satisfies:
                </p>
                <div className="text-center font-mono text-teal-900 mb-2 text-sm">
                    <Latex>{'$\\inf_{\\tilde{f} \\in \\mathcal{F}_{L_1, d_1}} \\lVert f - \\tilde{f} \\rVert_\\infty \\ge \\epsilon$'}</Latex>
                </div>
                <p className="text-sm text-teal-800 mt-2">
                    for some <Latex>{'$\\epsilon > 0$'}</Latex>, unless <Latex>{'$d_1$'}</Latex> grows exponentially in <Latex>{'$L_2 - L_1$'}</Latex>.
                </p>
                <p className="text-sm text-teal-800 mt-2 font-semibold">
                    In other words: "There exist functions perfectly representable by deep networks that require exponentially more width to be approximated by shallower networks."
                </p>
            </div>

            <p>
                This theorem underscores the importance of depth and non-linearities in neural networks, as they enable the representation of functions with complex hierarchical structures that would be intractable for shallow networks.
            </p>

            <p>
                <strong>Implications for Transformers:</strong> In transformers, the role of non-linearities extends beyond individual layers. The architecture as a whole benefits from the non-linearities in the self-attention mechanism, where the softmax function introduces a non-linearity that is critical for differentiating between important and less important elements of the sequence. Additionally, the non-linear transformations in the feedforward layers help to refine these attention-based representations, further enhancing the model's expressivity.
            </p>
        </div>
    );
}


