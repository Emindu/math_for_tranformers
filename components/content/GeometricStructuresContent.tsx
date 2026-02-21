import React from 'react';
import Latex from 'react-latex-next';

// ── Section 1: Embedding Spaces and Manifolds ───────────────────────────────
export function EmbeddingSpacesAndManifolds() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-fuchsia-700 border-b-2 border-fuchsia-200 pb-2 mb-4">
                Embedding Spaces and Manifolds
            </h2>

            <p>
                In machine learning, embeddings are representations of objects (such as words,
                images, or nodes in a graph) as vectors in a high-dimensional space. These embedding
                spaces are often structured in a way that reflects the relationships between the objects
                they represent. When the data has an underlying geometric or topological structure, it
                is useful to think of the embedding space as a manifold—a smooth, curved space that
                locally resembles Euclidean space but may have a more complex global structure.
            </p>

            <h3 className="text-xl font-bold text-fuchsia-700 border-b border-fuchsia-200 pb-1 mt-8 mb-4">
                Manifold Learning
            </h3>

            <p>
                Manifold learning is a branch of machine learning and data science
                that focuses on identifying and exploiting the low-dimensional manifold structure
                within high-dimensional data. The idea is that although the data may lie in a high-dimensional
                space, it is often constrained to a lower-dimensional manifold within that space.
            </p>

            <div className="bg-fuchsia-50 p-4 rounded-lg my-4 text-sm text-fuchsia-900 border border-fuchsia-100">
                <strong>Formal Definition:</strong> A manifold <Latex>{'$M$'}</Latex> of dimension <Latex>{'$d$'}</Latex> is a topological space that locally resembles <Latex>{'$\\mathbb{R}^d$'}</Latex>.
                For every point <Latex>{'$p \\in M$'}</Latex>, there exists a neighborhood <Latex>{'$U \\subseteq M$'}</Latex> and a homeomorphism (a continuous bijection with a continuous inverse){' '}
                <Latex>{'$\\phi: U \\to \\mathbb{R}^d$'}</Latex>. This map <Latex>{'$\\phi$'}</Latex> is called a <em>chart</em>, and the collection of all such charts that cover <Latex>{'$M$'}</Latex> forms
                an <em>atlas</em> for the manifold.
            </div>

            <p>
                <strong>Example:</strong> Consider the unit circle <Latex>{'$S^1$'}</Latex> as a manifold embedded in <Latex>{'$\\mathbb{R}^2$'}</Latex>. Locally, the
                circle resembles the real line <Latex>{'$\\mathbb{R}^1$'}</Latex>, and it can be covered by two charts that map parts
                of the circle to open intervals on the real line.
            </p>

            <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Manifold Learning Algorithms</h4>
            <p>
                Manifold learning techniques aim to discover the underlying manifold structure
                from high-dimensional data. Two popular methods include:
            </p>

            <div className="space-y-4 my-4">
                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                    <h5 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                        <span className="bg-fuchsia-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Isomap
                    </h5>
                    <p className="text-sm text-slate-700 mb-3">
                        Isomap seeks to preserve the geodesic distances between data points.
                        Geodesic distance is the shortest path between two points on a manifold, taking into
                        account the curvature of the space.
                    </p>
                    <ul className="text-sm text-slate-600 list-disc ml-4 space-y-1">
                        <li>Constructs a neighborhood graph of the data.</li>
                        <li>Approximates geodesic distances via shortest path distances <Latex>{'$d_G(x_i, x_j)$'}</Latex> on the graph.</li>
                        <li>Applies MDS (Multi-Dimensional Scaling) to find a low-dimensional embedding <Latex>{'$Y$'}</Latex> that minimizes:
                            <div className="text-center my-2 text-slate-800">
                                <Latex>{'$\\sum_{i,j} \\left( d_G(x_i, x_j) - \\|y_i - y_j\\|_2 \\right)^2$'}</Latex>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                    <h5 className="font-bold text-slate-800 text-base mb-2 flex items-center gap-2">
                        <span className="bg-fuchsia-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Locally Linear Embedding (LLE)
                    </h5>
                    <p className="text-sm text-slate-700 mb-3">
                        LLE preserves the local linear structure of
                        the data by assuming that each data point and its neighbors lie on or near a locally
                        linear patch of the manifold.
                    </p>
                    <ul className="text-sm text-slate-600 list-disc ml-4 space-y-1">
                        <li>Finds weights <Latex>{'$w_{ij}$'}</Latex> that best reconstruct <Latex>{'$x_i$'}</Latex> as a linear combination of its neighbors:</li>
                        <div className="text-center my-2 text-slate-800">
                            <Latex>{'$\\min_{w_i} \\| x_i - \\sum_j w_{ij} x_j \\|_2^2, \\text{ subject to } \\sum_j w_{ij} = 1$'}</Latex>
                        </div>
                        <li>Finds a low-dimensional embedding <Latex>{'$Y$'}</Latex> that preserves these reconstruction weights:</li>
                        <div className="text-center my-2 text-slate-800">
                            <Latex>{'$\\min_Y \\sum_i \\| y_i - \\sum_j w_{ij} y_j \\|_2^2$'}</Latex>
                        </div>
                    </ul>
                </div>
            </div>

            <p>
                In the context of transformers, manifold learning can be applied to the design
                of embedding spaces. Word embeddings often lie on a low-dimensional manifold within a high-dimensional space.
                Moreover, attention mechanisms can be interpreted as learning a mapping from the input sequence
                to a manifold that captures relevant relationships for a task.
            </p>
        </div>
    );
}

export function HighDimensionalEmbeddings() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-fuchsia-700 border-b-2 border-fuchsia-200 pb-2 mb-4">
                Geometry of High-Dimensional Embeddings
            </h2>

            <p>
                High-dimensional embeddings are central to transformer models, as they allow
                the model to represent complex data in a form that can be processed by the self-attention mechanism.
                However, working in high-dimensional spaces introduces unique challenges, particularly related to the geometry of these spaces.
            </p>

            <h3 className="text-xl font-bold text-fuchsia-700 border-b border-fuchsia-200 pb-1 mt-8 mb-4">
                Curse of Dimensionality
            </h3>

            <p>
                As the dimensionality of the embedding space increases, many aspects of geometry behave counterintuitively.
                For example, the volume of a
                high-dimensional sphere becomes concentrated near its surface, and the distance
                between randomly chosen points tends to become uniform. This phenomenon is
                known as the <strong>curse of dimensionality</strong>.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl my-6 border border-slate-200">
                <p className="text-sm text-slate-800 mb-4 mt-0">
                    Mathematically, consider a <Latex>{'$d$'}</Latex>-dimensional
                    Euclidean space <Latex>{'$\\mathbb{R}^d$'}</Latex>. The volume of a ball of radius <Latex>{'$r$'}</Latex> in this space is given by:
                </p>
                <div className="text-center text-lg text-fuchsia-800 bg-white p-4 rounded-lg shadow-sm border border-fuchsia-100 mb-4">
                    <Latex>{'$V_d(r) = \\frac{\\pi^{d/2} r^d}{\\Gamma(\\frac{d}{2} + 1)}$'}</Latex>
                </div>
                <p className="text-sm text-slate-700 mb-0">
                    where <Latex>{'$\\Gamma$'}</Latex> is the Gamma function. As <Latex>{'$d$'}</Latex> increases, the volume <Latex>{'$V_d(r)$'}</Latex> grows rapidly, but
                    the volume within any small distance <Latex>{'$\\epsilon$'}</Latex> from the surface of the ball also grows, mean-
                    ing that <strong>most of the volume is near the boundary</strong>.
                </p>
            </div>

            <p>
                This boundary concentration has implications for nearest-neighbor search, clustering, and other tasks that rely
                on geometric relationships.
            </p>

            <h3 className="text-xl font-bold text-fuchsia-700 border-b border-fuchsia-200 pb-1 mt-8 mb-4">
                Implications for Self-Attention
            </h3>

            <p>
                The geometry of high-dimensional embeddings is crucial for understanding how transformers process data.
                The self-attention mechanism can be seen as a process of mapping high-dimensional embeddings to a
                lower-dimensional space (or manifold) where relevant relationships are more apparent.
            </p>

            <div className="bg-fuchsia-50 p-5 rounded-lg my-6 text-fuchsia-900 border-l-4 border-fuchsia-500 shadow-sm">
                <p className="m-0">
                    The attention mechanism may need to account for the concentration of measure to avoid issues where
                    <strong> all attention scores become similar</strong>, leading to a loss of discriminative power.
                </p>
            </div>

            <p>
                One way to address these challenges is to design embedding spaces with explicit geometric structures,
                such as <strong>hyperbolic spaces</strong>, which have been shown to better capture hierarchical
                relationships in data. Hyperbolic embeddings can lead to more effective attention
                mechanisms, particularly in tasks that involve tree-like structures or other forms of
                hierarchical data.
            </p>
        </div>
    );
}

// ── Section 2: Symmetries and Transformations ───────────────────────────────
export function SymmetriesAndGroupActions() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                Symmetries and Transformations
            </h2>

            <p>
                Symmetry plays a fundamental role in mathematics and physics, providing a powerful
                framework for understanding the invariance and transformation properties of systems.
                In the context of transformers and machine learning, symmetries can be exploited to
                design models that are robust, efficient, and capable of generalizing well to unseen data.
                This section explores the mathematical foundation of symmetries, focusing on group actions
                on manifolds and their applications in transformer architectures.
            </p>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                Group Actions on Manifolds
            </h3>

            <p>
                A group action is a formal way of describing how the elements of a group <Latex>{'$G$'}</Latex> systematically
                &quot;act&quot; on the elements of a set <Latex>{'$M$'}</Latex>, which in this context is often a manifold. Group actions provide
                a way to model symmetries and transformations of geometric objects.
            </p>

            <div className="bg-rose-50 p-5 rounded-lg my-6 text-sm text-rose-900 border border-rose-100">
                <p className="mb-2"><strong>Formal Definition:</strong> A group action of a group <Latex>{'$G$'}</Latex> on a manifold <Latex>{'$M$'}</Latex> is a map <Latex>{'$\\phi : G \\times M \\to M$'}</Latex> that satisfies:</p>
                <ol className="list-decimal ml-5 space-y-2 mt-2">
                    <li>
                        <strong>Identity:</strong> The identity element <Latex>{'$e$'}</Latex> of <Latex>{'$G$'}</Latex> acts as the identity transformation on <Latex>{'$M$'}</Latex>. For all <Latex>{'$x \\in M$'}</Latex>:
                        <div className="text-center font-mono mt-1"><Latex>{'$\\phi(e, x) = x$'}</Latex></div>
                    </li>
                    <li>
                        <strong>Compatibility:</strong> For all <Latex>{'$g, h \\in G$'}</Latex> and <Latex>{'$x \\in M$'}</Latex>:
                        <div className="text-center font-mono mt-1"><Latex>{'$\\phi(g, \\phi(h, x)) = \\phi(gh, x)$'}</Latex></div>
                    </li>
                </ol>
            </div>

            <p>
                <strong>Example:</strong> Consider the rotation group <Latex>{'$SO(2)$'}</Latex>, which consists of all rotations in the plane.
                This group acts on the 2D Euclidean space <Latex>{'$\\mathbb{R}^2$'}</Latex> by rotating vectors around the origin. For a point <Latex>{'$x \\in \\mathbb{R}^2$'}</Latex>,
                the action of a rotation <Latex>{'$R_\\theta$'}</Latex> by an angle <Latex>{'$\\theta$'}</Latex> is given by:
            </p>
            <div className="text-center text-lg text-slate-800 bg-white p-4 rounded-lg shadow-sm border border-slate-200 my-4 overflow-x-auto">
                <Latex>{'$\\phi(R_\\theta, x) = R_\\theta x = \\begin{pmatrix} \\cos \\theta & -\\sin \\theta \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix} \\begin{pmatrix} x_1 \\\\ x_2 \\end{pmatrix}$'}</Latex>
            </div>

            <h4 className="font-bold text-slate-800 text-lg mt-6 mb-2">Orbits and Stabilizers</h4>
            <p>
                When a group acts on a manifold, it induces a structure that reflects the symmetries of the group.
                For a point <Latex>{'$x \\in M$'}</Latex>, the <strong>orbit</strong> of <Latex>{'$x$'}</Latex> is the set of points reachable via the action, while the <strong>stabilizer</strong> is
                the set of group elements that leave the point unchanged:
            </p>

            <div className="flex flex-col md:flex-row gap-4 my-4">
                <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h5 className="font-bold text-rose-700 text-base mb-2">Orbit</h5>
                    <div className="text-center mb-2 text-slate-800 font-mono">
                        <Latex>{'$\\text{Orb}(x) = \\{ \\phi(g, x) \\mid g \\in G \\}$'}</Latex>
                    </div>
                </div>
                <div className="flex-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                    <h5 className="font-bold text-rose-700 text-base mb-2">Stabilizer</h5>
                    <div className="text-center mb-2 text-slate-800 font-mono">
                        <Latex>{'$\\text{Stab}(x) = \\{ g \\in G \\mid \\phi(g, x) = x \\}$'}</Latex>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm my-6">
                <h5 className="font-bold text-slate-800 mb-1">Theorem 1.4 (Orbit-Stabilizer Theorem)</h5>
                <p className="text-sm text-slate-700 mb-2">
                    Let <Latex>{'$G$'}</Latex> be a group acting on a set <Latex>{'$M$'}</Latex>, and let <Latex>{'$x \\in M$'}</Latex>. Then there is a bijection between the orbit of <Latex>{'$x$'}</Latex> and the coset space <Latex>{'$G/\\text{Stab}(x)$'}</Latex>, given by:
                </p>
                <div className="text-center font-mono text-slate-800">
                    <Latex>{'$\\phi : G/\\text{Stab}(x) \\to \\text{Orb}(x), \\quad g\\text{Stab}(x) \\mapsto \\phi(g, x)$'}</Latex>
                </div>
            </div>

            <p>
                Group actions are fundamental in differential geometry, where they are used to study the symmetry properties of manifolds.
                For example, the action of <Latex>{'$SO(3)$'}</Latex> on the 2-sphere <Latex>{'$S^2$'}</Latex> describes its rotational symmetries,
                a concept powerful in machine learning tasks involving 3D point clouds or molecules.
            </p>
        </div>
    );
}

export function SymmetriesInTransformers() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-rose-700 border-b-2 border-rose-200 pb-2 mb-4">
                Applications in Transformer Architectures
            </h2>

            <p>
                In transformer architectures, understanding and incorporating symmetries through group actions can lead to more robust and efficient models.
                This is especially relevant when dealing with data that possesses intrinsic symmetries, such as images, sequences, or graphs.
            </p>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                Equivariance and Invariance
            </h3>

            <p>
                Equivariance and invariance are crucial concepts in the design of neural networks. A function <Latex>{'$f : M \\to N$'}</Latex> is said to be
                <strong> equivariant</strong> with respect to a group action if, for all <Latex>{'$g \\in G$'}</Latex> and <Latex>{'$x \\in M$'}</Latex>:
            </p>

            <div className="text-center text-lg text-rose-800 bg-rose-50 p-4 rounded-lg border border-rose-100 my-4 inline-block mx-auto w-full">
                <Latex>{'$f(\\phi(g, x)) = \\psi(g, f(x))$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\psi : G \\times N \\to N$'}</Latex> is the corresponding action on the target space <Latex>{'$N$'}</Latex>. If <Latex>{'$\\psi(g, f(x)) = f(x)$'}</Latex> for all <Latex>{'$g \\in G$'}</Latex>,
                then <Latex>{'$f$'}</Latex> is said to be <strong>invariant</strong> under the group action.
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 text-sm text-slate-700 border border-slate-200">
                <strong>Example:</strong> In image processing, if <Latex>{'$G$'}</Latex> is the group of translations, a convolutional layer is designed to be translation-equivariant,
                meaning that translating the input image results in a corresponding translation of the output feature map.
            </div>

            <p>
                In transformers, the self-attention mechanism can be designed to be equivariant to certain transformations. Let <Latex>{'$X = \\{x_1, \\dots, x_n\\}$'}</Latex> be
                the input sequence, and <Latex>{'$G$'}</Latex> be a group acting on this sequence (e.g., a permutation group). The self-attention mechanism is equivariant if:
            </p>
            <div className="text-center font-mono bg-white p-3 rounded border border-slate-200 text-sm overflow-x-auto my-4 text-slate-800">
                <Latex>{'$\\text{Attention}(\\phi(g, Q), \\phi(g, K), \\phi(g, V)) = \\phi(g, \\text{Attention}(Q, K, V))$'}</Latex>
            </div>

            <h3 className="text-xl font-bold text-rose-700 border-b border-rose-200 pb-1 mt-8 mb-4">
                Symmetry-Aware Transformers
            </h3>

            <p>
                In tasks involving structured data (like graphs or 3D objects), <strong>symmetry-aware transformers</strong> can be designed by incorporating
                group representations and equivariant layers. For instance, in a graph transformer, the attention mechanism can be designed to be equivariant
                to node permutations, ensuring output is invariant to sorting.
            </p>

            <ul className="list-disc ml-5 space-y-2 mt-4 text-slate-700">
                <li>
                    <strong>3D Molecular Structures:</strong> A transformer can incorporate rotational symmetries by representing atomic positions using
                    spherical harmonics or Wigner-D functions. Attention is then made computationally equivariant to spatial 3D rotations.
                </li>
                <li>
                    <strong>Enhancing Robustness:</strong> By explicitly instilling systemic symmetries directly into the architecture (rather than forcing the model to empirically "learn" them),
                    one massively accelerates zero-shot generalization across robotics, physics modeling, and complex spatial vision algorithms.
                </li>
            </ul>
        </div>
    );
}

// ── Section 3: Implications for Model Design ────────────────────────────────
export function GeometricPriorsInModelArchitectures() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-pink-700 border-b-2 border-pink-200 pb-2 mb-4">
                Geometric Priors in Model Architectures
            </h2>

            <p>
                Incorporating geometric principles into the design of transformer architectures can
                significantly enhance their performance and robustness, especially in tasks where the
                data exhibits inherent symmetries and geometric structures. By embedding geometric
                priors into model architectures, we can create models that are not only more aligned
                with the underlying data but also more capable of generalizing to unseen scenarios.
            </p>

            <h3 className="text-xl font-bold text-pink-700 border-b border-pink-200 pb-1 mt-8 mb-4">
                What are Geometric Priors?
            </h3>

            <p>
                Geometric priors are assumptions about the underlying structure or symmetry of the
                data embedded into the architecture of a model. These priors constrain the model's
                hypothesis space, leading to more efficient learning and improved generalization.
            </p>

            <div className="bg-pink-50 p-5 rounded-lg my-6 text-sm text-pink-900 border border-pink-100">
                <p>
                    Consider a dataset <Latex>{'$X$'}</Latex> where each point <Latex>{'$x \\in X$'}</Latex> lies on a manifold <Latex>{'$M \\subset \\mathbb{R}^d$'}</Latex>.
                    If <Latex>{'$M$'}</Latex> has a known symmetry group <Latex>{'$G$'}</Latex>, such as the <Latex>{'$SO(3)$'}</Latex> rotation group, the model
                    can be constructed to respect this structure. For a layer <Latex>{'$f : \\mathbb{R}^3 \\to \\mathbb{R}^n$'}</Latex>, we require that for any rotation <Latex>{'$R \\in G$'}</Latex> and point <Latex>{'$x \\in \\mathbb{R}^3$'}</Latex>:
                </p>
                <div className="text-center font-mono mt-3 bg-white p-2 rounded shadow-sm border border-pink-200">
                    <Latex>{'$f(Rx) = R f(x)$'}</Latex>
                </div>
            </div>

            <p>
                <strong>Geometric Deep Learning:</strong> Geometric priors are central to geometric deep learning, aiming to design
                neural networks that operate on non-Euclidean domains such as graphs and manifolds. In transformers, these priors
                guide the design of attention mechanisms and embedding layers.
            </p>

            <p>
                One approach to incorporating geometric priors is to use <strong>equivariant convolutional filters</strong>. For example, in a
                spherical CNN, filters <Latex>{'$\\sigma : S^2 \\to \\mathbb{R}^n$'}</Latex> are defined on the sphere <Latex>{'$S^2$'}</Latex> and are equivariant to rotations.
                The convolution operation <Latex>{'$*$'}</Latex> with an input function <Latex>{'$f : S^2 \\to \\mathbb{R}^m$'}</Latex> is written as:
            </p>

            <div className="text-center text-lg text-slate-800 bg-white p-4 rounded-lg shadow-sm border border-slate-200 my-4 overflow-x-auto">
                <Latex>{'$(f * \\sigma)(x) = \\int_{S^2} f(y)\\sigma(R^{-1}y) \\, d\\mu(y)$'}</Latex>
            </div>
            <p className="text-sm text-slate-500 text-center -mt-2 mb-6">Where <Latex>{'$R \\in SO(3)$'}</Latex> is a rotation, and <Latex>{'$d\\mu(y)$'}</Latex> is the surface measure.</p>

        </div>
    );
}

export function RotationalAndTranslationalInvariances() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-pink-700 border-b-2 border-pink-200 pb-2 mb-4">
                Rotational and Translational Invariances
            </h2>

            <p>
                Rotational and translational invariances are crucial geometric invariances in spatial data tasks like image recognition,
                3D modeling, and physical simulations. Ensuring model invariance allows robust pattern recognition regardless of orientation or position.
            </p>

            <h3 className="text-xl font-bold text-pink-700 border-b border-pink-200 pb-1 mt-8 mb-4">
                Rotational Invariance
            </h3>

            <p>
                A function <Latex>{'$f : \\mathbb{R}^d \\to \\mathbb{R}^n$'}</Latex> is rotationally invariant if, for any rotation <Latex>{'$R \\in SO(d)$'}</Latex> and point <Latex>{'$x \\in \\mathbb{R}^d$'}</Latex>:
            </p>

            <div className="text-center font-mono my-3 bg-pink-50 p-3 rounded">
                <Latex>{'$f(Rx) = f(x)$'}</Latex>
            </div>

            <p>
                <strong>Example:</strong> A transformer classifying 3D molecular structures can achieve rotational invariance by computing attention scores based on
                <strong> distances</strong> between atoms ( <Latex>{'$\\lVert x_i - x_j \\rVert$'}</Latex> ), rather than their absolute spatial coordinates.
            </p>

            <h3 className="text-xl font-bold text-pink-700 border-b border-pink-200 pb-1 mt-8 mb-4">
                Translational Invariance
            </h3>

            <p>
                A function <Latex>{'$f : \\mathbb{R}^d \\to \\mathbb{R}^n$'}</Latex> is translationally invariant if, for any translation vector <Latex>{'$t \\in \\mathbb{R}^d$'}</Latex> and point <Latex>{'$x \\in \\mathbb{R}^d$'}</Latex>:
            </p>

            <div className="text-center font-mono my-3 bg-pink-50 p-3 rounded">
                <Latex>{'$f(x + t) = f(x)$'}</Latex>
            </div>

            <p>
                <strong>Example:</strong> In transformers, translational invariance is often achieved using <strong>relative positional encodings</strong>,
                where attention mechanisms focus strictly on the relative positions of elements in the sequence, making the exact location of a pattern irrelevant.
            </p>

            <div className="bg-slate-50 border-l-4 border-pink-500 p-4 rounded-r-lg shadow-sm mt-8">
                <h5 className="font-bold text-slate-800 mb-1">Definition 1.1 (Equivariance and Invariance in Attention)</h5>
                <p className="text-sm text-slate-700 mb-2">
                    Let <Latex>{'$G$'}</Latex> be a group acting on the input space <Latex>{'$X$'}</Latex>, and <Latex>{'$\\phi : G \\times X \\to X$'}</Latex> be the group action. An attention block is <strong>equivariant</strong> to <Latex>{'$G$'}</Latex> if:
                </p>
                <div className="text-center font-mono text-slate-800 mb-3 text-sm overflow-x-auto">
                    <Latex>{'$\\text{Attention}(\\phi(g, Q), \\phi(g, K), \\phi(g, V)) = \\phi(g, \\text{Attention}(Q, K, V))$'}</Latex>
                </div>
                <p className="text-sm text-slate-700">
                    If <Latex>{'$\\phi(g, y) = y$'}</Latex> for all <Latex>{'$g \\in G$'}</Latex> and <Latex>{'$y \\in \\mathbb{R}^d$'}</Latex>, then the block is <strong>invariant</strong> to the group <Latex>{'$G$'}</Latex>.
                </p>
            </div>
        </div>
    );
}
