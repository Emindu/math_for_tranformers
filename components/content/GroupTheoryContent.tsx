"use client";

import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export function BasicGroupConcepts() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Basic Concepts of Group Theory
            </h2>

            <p>
                Group theory is a branch of abstract algebra that studies algebraic structures known
                as groups. Groups are fundamental in understanding the concept of symmetry in
                mathematics, physics, and various other disciplines, including the study of neural
                networks and transformers. A group <Latex>{'$G$'}</Latex> is a set equipped with a binary operation <Latex>{'$\\cdot$'}</Latex>
                (often called multiplication) that combines any two elements <Latex>{'$a$'}</Latex> and <Latex>{'$b$'}</Latex> in <Latex>{'$G$'}</Latex> to form
                another element <Latex>{'$a \\cdot b$'}</Latex> in <Latex>{'$G$'}</Latex>. The group operation must satisfy the following axioms:
            </p>

            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200">
                <ol className="list-decimal list-inside space-y-3 text-slate-800">
                    <li>
                        <strong>Closure:</strong> For all <Latex>{'$a, b \\in G$'}</Latex>, the product <Latex>{'$a \\cdot b \\in G$'}</Latex>.
                    </li>
                    <li>
                        <strong>Associativity:</strong> For all <Latex>{'$a, b, c \\in G$'}</Latex>, <Latex>{'$(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$'}</Latex>.
                    </li>
                    <li>
                        <strong>Identity Element:</strong> There exists an element <Latex>{'$e \\in G$'}</Latex> such that for all <Latex>{'$a \\in G$'}</Latex>,
                        <Latex>{'$e \\cdot a = a \\cdot e = a$'}</Latex>. This element <Latex>{'$e$'}</Latex> is called the identity element of the group.
                    </li>
                    <li>
                        <strong>Inverse Element:</strong> For each <Latex>{'$a \\in G$'}</Latex>, there exists an element <Latex>{'$a^{-1} \\in G$'}</Latex> such that
                        <Latex>{'$a \\cdot a^{-1} = a^{-1} \\cdot a = e$'}</Latex>, where <Latex>{'$e$'}</Latex> is the identity element.
                    </li>
                </ol>
            </div>

            <p>
                The study of groups is motivated by the need to understand symmetry in a structured way.
                For example, the set of all rotations of a regular polygon forms a group
                under the operation of composition, reflecting the symmetrical properties of the
                shape. This group encapsulates the geometric symmetries of the polygon and allows
                for a deep understanding of how these symmetries interact.
            </p>
        </div>
    );
}

export function GroupsSubgroupsCosets() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Groups, Subgroups, and Cosets
            </h2>

            {/* ─── Subgroup Definition ─── */}
            <p>
                A subgroup <Latex>{'$H$'}</Latex> of a group <Latex>{'$G$'}</Latex> is a subset
                of <Latex>{'$G$'}</Latex> that is itself a group under the operation
                of <Latex>{'$G$'}</Latex>. Formally, <Latex>{'$H \\subseteq G$'}</Latex> is a subgroup if it satisfies the following conditions:
            </p>

            <div className="bg-slate-50 p-6 rounded-lg my-6 border border-slate-200">
                <ol className="list-decimal list-inside space-y-3 text-slate-800">
                    <li>
                        The <strong>identity element</strong> of <Latex>{'$G$'}</Latex> is in <Latex>{'$H$'}</Latex>.
                    </li>
                    <li>
                        <Latex>{'$H$'}</Latex> is <strong>closed under the group operation</strong>: For all <Latex>{'$h_1, h_2 \\in H$'}</Latex>, <Latex>{'$h_1 \\cdot h_2 \\in H$'}</Latex>.
                    </li>
                    <li>
                        <Latex>{'$H$'}</Latex> is <strong>closed under taking inverses</strong>: For all <Latex>{'$h \\in H$'}</Latex>, <Latex>{'$h^{-1} \\in H$'}</Latex>.
                    </li>
                </ol>
            </div>

            <p>
                Subgroups are important because they inherit the algebraic structure of the larger
                group and often reveal the internal symmetries of the group. For example, the set
                of all rotations of a cube that leave a given face fixed forms a subgroup of the full
                rotation group of the cube. This subgroup reflects the symmetry of the cube with
                respect to that particular face.
            </p>

            {/* ─── Cosets ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Cosets and Group Partitioning
            </h3>

            <p>
                Given a subgroup <Latex>{'$H$'}</Latex> of a group <Latex>{'$G$'}</Latex>, one can
                form <strong>cosets</strong> of <Latex>{'$H$'}</Latex> in <Latex>{'$G$'}</Latex>. A <strong>left coset</strong> of <Latex>{'$H$'}</Latex> in <Latex>{'$G$'}</Latex> is
                a set of the form:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$gH = \\{g \\cdot h \\mid h \\in H\\}$'}</Latex>
            </div>

            <p>
                for some <Latex>{'$g \\in G$'}</Latex>. Similarly, a <strong>right coset</strong> is a set of the form <Latex>{'$Hg = \\{h \\cdot g \\mid h \\in H\\}$'}</Latex>. Cosets partition the group <Latex>{'$G$'}</Latex> into disjoint subsets,
                each of which is a translation of the subgroup <Latex>{'$H$'}</Latex> by some element
                of <Latex>{'$G$'}</Latex>. The number of distinct cosets of <Latex>{'$H$'}</Latex> in <Latex>{'$G$'}</Latex> is
                called the <strong>index</strong> of <Latex>{'$H$'}</Latex> in <Latex>{'$G$'}</Latex> and is
                denoted by <Latex>{'$[G : H]$'}</Latex>.
            </p>

            {/* ─── Lagrange's Theorem ─── */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Lagrange&apos;s Theorem</p>
                <p className="text-sm text-amber-900 mb-3">
                    A fundamental result in group theory states that the order of any finite
                    subgroup <Latex>{'$H$'}</Latex> of a finite group <Latex>{'$G$'}</Latex> divides the order
                    of <Latex>{'$G$'}</Latex>:
                </p>
                <div className="text-center my-2">
                    <Latex>{'$|G| = |H| \\times [G : H]$'}</Latex>
                </div>
                <p className="text-sm text-amber-900 mt-3">
                    This theorem can be understood through cosets: the group <Latex>{'$G$'}</Latex> is perfectly
                    tiled by equal-sized cosets of <Latex>{'$H$'}</Latex>, so the number of elements
                    in <Latex>{'$G$'}</Latex> equals the number of elements in <Latex>{'$H$'}</Latex> multiplied
                    by the number of cosets.
                </p>
            </div>

            {/* ─── Quotient Groups ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Quotient Groups
            </h3>

            <p>
                Cosets also play a significant role in the construction of <strong>quotient groups</strong>,
                which are groups formed by &ldquo;collapsing&rdquo; a <strong>normal subgroup</strong> <Latex>{'$N$'}</Latex> of <Latex>{'$G$'}</Latex> to
                the identity element. A subgroup <Latex>{'$N$'}</Latex> is <em>normal</em> if <Latex>{'$gNg^{-1} = N$'}</Latex> for
                all <Latex>{'$g \\in G$'}</Latex>.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Quotient Group <Latex>{'$G/N$'}</Latex></p>
                <p className="text-sm text-indigo-900">
                    The quotient group <Latex>{'$G/N$'}</Latex> consists of the cosets
                    of <Latex>{'$N$'}</Latex> in <Latex>{'$G$'}</Latex>, and it inherits the group structure
                    from <Latex>{'$G$'}</Latex>. The operation is defined
                    as <Latex>{'$(g_1 N)(g_2 N) = (g_1 \\cdot g_2)N$'}</Latex>. Quotient groups are essential in
                    understanding how larger groups can be decomposed into simpler components,
                    a theme central to the study of symmetry and intelligence in mathematical systems.
                </p>
            </div>

            {/* ─── ML Applications ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Applications in Machine Learning
            </h3>

            <p>
                In the context of machine learning, groups, subgroups, and cosets can be used to
                model the symmetries present in data. For example, in <strong>computer vision</strong>, the symmetries of an
                object under rotation and translation can be represented by a group, and the subgroup
                structure can reveal invariant features of the object.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Symmetry in Data</h4>
                    <p className="text-xs text-emerald-900">
                        Object recognition benefits from encoding rotational and translational
                        symmetries. The subgroup of rotations that preserve an object&apos;s appearance
                        reveals features that are <em>invariant</em> to those transformations.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2 text-sm">Transformers &amp; Hierarchies</h4>
                    <p className="text-xs text-blue-900">
                        Transformers, with their ability to capture hierarchical structures, can be
                        seen as exploiting group symmetries to efficiently process and transform
                        data. Coset decompositions mirror how attention layers decompose
                        representations into meaningful subspaces.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function GroupHomomorphisms() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Group Homomorphisms
            </h2>

            {/* ─── Definition ─── */}
            <p>
                A <strong>group homomorphism</strong> is a function between two groups that preserves the group
                structure. Formally, if <Latex>{'$G$'}</Latex> and <Latex>{'$H$'}</Latex> are groups, a homomorphism from <Latex>{'$G$'}</Latex> to <Latex>{'$H$'}</Latex> is a
                function <Latex>{'$\\varphi : G \\to H$'}</Latex> such that for all <Latex>{'$a, b \\in G$'}</Latex>,
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\varphi(a \\cdot b) = \\varphi(a) \\cdot \\varphi(b)$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\cdot$'}</Latex> denotes the group operation in <Latex>{'$G$'}</Latex> and in <Latex>{'$H$'}</Latex>.
                The property of preserving the group operation means that the image of a product under the
                homomorphism is the product of the images. This preservation of structure makes homomorphisms
                a central concept in the study of groups, as they allow for the comparison and classification
                of groups based on their structural similarities.
            </p>

            {/* ─── Isomorphisms ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Isomorphisms
            </h3>

            <p>
                A homomorphism that is both <strong>injective</strong> (one-to-one) and <strong>surjective</strong> (onto) is called
                an <strong>isomorphism</strong>. If there exists an isomorphism between two groups <Latex>{'$G$'}</Latex> and <Latex>{'$H$'}</Latex>,
                then <Latex>{'$G$'}</Latex> and <Latex>{'$H$'}</Latex> are said to be <em>isomorphic</em>, denoted <Latex>{'$G \\cong H$'}</Latex>.
                Isomorphic groups are structurally identical, meaning they have the same group-theoretic
                properties, though their elements may be different.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-6">
                <p className="font-semibold text-violet-800 mb-2">Types of Homomorphisms</p>
                <ul className="text-sm text-violet-900 space-y-1 list-disc list-inside">
                    <li><strong>Monomorphism:</strong> Injective homomorphism (different inputs → different outputs)</li>
                    <li><strong>Epimorphism:</strong> Surjective homomorphism (every element in <Latex>{'$H$'}</Latex> is reached)</li>
                    <li><strong>Isomorphism:</strong> Both injective and surjective — a perfect structural match</li>
                    <li><strong>Endomorphism:</strong> A homomorphism from a group to itself</li>
                    <li><strong>Automorphism:</strong> An isomorphism from a group to itself</li>
                </ul>
            </div>

            {/* ─── Kernel & First Isomorphism Theorem ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                The Kernel and the First Isomorphism Theorem
            </h3>

            <p>
                The <strong>kernel</strong> of a group homomorphism <Latex>{'$\\varphi : G \\to H$'}</Latex> is the set of elements
                in <Latex>{'$G$'}</Latex> that map to the identity element in <Latex>{'$H$'}</Latex>:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\ker(\\varphi) = \\{g \\in G \\mid \\varphi(g) = e_H\\}$'}</Latex>
            </div>

            <p>
                The kernel is always a <strong>normal subgroup</strong> of <Latex>{'$G$'}</Latex>. This leads to one of the
                most profound results in group theory:
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">First Isomorphism Theorem</p>
                <p className="text-sm text-amber-900 mb-3">
                    The image of <Latex>{'$\\varphi$'}</Latex> is isomorphic to the quotient
                    group <Latex>{'$G / \\ker(\\varphi)$'}</Latex>:
                </p>
                <div className="text-center my-2">
                    <Latex>{'$G / \\ker(\\varphi) \\cong \\text{Im}(\\varphi)$'}</Latex>
                </div>
                <p className="text-sm text-amber-900 mt-3">
                    This theorem provides a deep connection between homomorphisms, kernels, and
                    quotient groups. It tells us that the &ldquo;interesting part&rdquo; of a homomorphism —
                    what it doesn&apos;t collapse — is structurally identical to its image.
                </p>
            </div>

            <p>
                Group homomorphisms have concrete applications beyond pure algebra. In geometry, the symmetry
                group of a shape can be related to the symmetry group of a different shape through a
                homomorphism, revealing how one set of symmetries maps onto another. In physics,
                homomorphisms between symmetry groups describe how different physical systems are related.
            </p>

            {/* ─── Equivariance in Transformers ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Equivariance and Transformers
            </h3>

            <p>
                In the context of transformers and machine learning, group homomorphisms play a crucial role
                in modeling how symmetries in the input data are preserved or transformed by the network.
                Consider a scenario where the input data exhibits symmetries described by a group <Latex>{'$G$'}</Latex>,
                with elements representing operations like rotations, translations, or permutations.
            </p>

            <p className="mt-4">
                Let <Latex>{'$X$'}</Latex> denote the input space and <Latex>{'$V$'}</Latex> the feature space.
                The data is embedded via a representation map <Latex>{'$\\varphi : X \\to V$'}</Latex>.
                If the data has inherent symmetry described by <Latex>{'$G$'}</Latex>, we want the embedding to
                satisfy the <strong>equivariance condition</strong>:
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Equivariance Condition</p>
                <div className="text-center my-2">
                    <Latex>{'$\\varphi(\\alpha_g(x)) = \\rho(g)\\varphi(x) \\quad \\text{for all } g \\in G \\text{ and } x \\in X$'}</Latex>
                </div>
                <p className="text-sm text-indigo-900 mt-3">
                    This states that applying a group transformation <Latex>{'$g$'}</Latex> to the input and then
                    embedding should equal first embedding and then applying the linear transformation <Latex>{'$\\rho(g)$'}</Latex>.
                    The map <Latex>{'$\\rho$'}</Latex> is a group homomorphism because it preserves structure:
                    <span className="block text-center mt-2">
                        <Latex>{'$\\rho(g_1 g_2) = \\rho(g_1)\\rho(g_2)$'}</Latex>
                    </span>
                </p>
            </div>

            <p>
                The layers of a transformer can be viewed as a sequence of
                homomorphisms <Latex>{'$T_1, T_2, \\ldots, T_n$'}</Latex>, each mapping the feature
                space <Latex>{'$V_i$'}</Latex> of the <Latex>{'$i$'}</Latex>-th layer to <Latex>{'$V_{i+1}$'}</Latex>.
                Each transformation is expected to preserve the group action:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$T_i(\\rho_i(g)v) = \\rho_{i+1}(g)T_i(v) \\quad \\text{for all } v \\in V_i \\text{ and } g \\in G$'}</Latex>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Spherical Harmonics</h4>
                    <p className="text-xs text-emerald-900">
                        For rotational symmetries, the feature spaces <Latex>{'$V_i$'}</Latex> can be spaces
                        of spherical harmonics — representations of <Latex>{'$SO(3)$'}</Latex>. The layers act on
                        these spaces consistently with the rotational symmetry.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2 text-sm">Efficiency &amp; Interpretability</h4>
                    <p className="text-xs text-blue-900">
                        Instead of learning separate representations for each transformation,
                        the model learns a single equivariant representation — reducing parameters
                        and producing features that align with the underlying data symmetries.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function RepresentationTheory() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Representation Theory of Finite Groups
            </h2>

            <p>
                Representation theory is a powerful tool that allows us to study abstract algebraic
                structures, such as groups, by representing their elements as matrices and their
                operations as matrix multiplication. This approach provides a concrete way to analyze
                the symmetries of a system, which is particularly relevant in areas such as physics,
                chemistry, and computer science. In the context of transformers, understanding group
                representations is crucial for analyzing how symmetries in data are captured and
                processed by the model.
            </p>

            {/* ─── Group Representations ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Group Representations
            </h3>

            <p>
                A <strong>representation</strong> of a group <Latex>{'$G$'}</Latex> on a vector
                space <Latex>{'$V$'}</Latex> over a field <Latex>{'$F$'}</Latex> is a
                homomorphism <Latex>{'$\\rho : G \\to \\text{GL}(V)$'}</Latex>,
                where <Latex>{'$\\text{GL}(V)$'}</Latex> is the group of all invertible linear
                transformations of <Latex>{'$V$'}</Latex>. In other words, a representation is a way of
                associating each element <Latex>{'$g \\in G$'}</Latex> with an invertible
                matrix <Latex>{'$\\rho(g)$'}</Latex> such that the group operation is preserved:
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\rho(g_1 g_2) = \\rho(g_1)\\rho(g_2)$'}</Latex>
            </div>

            <p>
                for all <Latex>{'$g_1, g_2 \\in G$'}</Latex>. The vector space <Latex>{'$V$'}</Latex> is called
                the <strong>representation space</strong> of <Latex>{'$\\rho$'}</Latex>, and the dimension
                of <Latex>{'$V$'}</Latex> is called the <strong>degree</strong> of the representation. If <Latex>{'$V$'}</Latex> is
                finite-dimensional, the representation <Latex>{'$\\rho$'}</Latex> can be described by a set
                of <Latex>{'$n \\times n$'}</Latex> matrices, where <Latex>{'$n$'}</Latex> is the dimension
                of <Latex>{'$V$'}</Latex>.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-6">
                <p className="font-semibold text-violet-800 mb-2">Key Terminology</p>
                <ul className="text-sm text-violet-900 space-y-1 list-disc list-inside">
                    <li><strong>Representation Space:</strong> The vector space <Latex>{'$V$'}</Latex> on which the group acts</li>
                    <li><strong>Degree:</strong> The dimension of <Latex>{'$V$'}</Latex> (i.e., the size of the matrices)</li>
                    <li><strong>Faithful:</strong> A representation where different group elements map to different matrices (trivial kernel)</li>
                    <li><strong>Irreducible (&ldquo;Irrep&rdquo;):</strong> No non-trivial invariant subspace exists — the &ldquo;atoms&rdquo; of representation theory</li>
                    <li><strong>Character:</strong> <Latex>{'$\\chi(g) = \\text{Tr}(\\rho(g))$'}</Latex> — a coordinate-independent fingerprint</li>
                </ul>
            </div>

            {/* ─── Cyclic Group Example ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Cyclic Group Representations
            </h3>

            <p>
                Consider the cyclic group <Latex>{'$C_n = \\langle g \\rangle$'}</Latex> of
                order <Latex>{'$n$'}</Latex>. A representation of <Latex>{'$C_n$'}</Latex> is given by
                associating the generator <Latex>{'$g$'}</Latex> with a matrix <Latex>{'$\\rho(g)$'}</Latex> such
                that <Latex>{'$\\rho(g^n) = I$'}</Latex>, where <Latex>{'$I$'}</Latex> is the identity matrix.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">One-Dimensional Representations</p>
                <p className="text-sm text-amber-900 mb-2">
                    A simple representation of <Latex>{'$C_n$'}</Latex> is the one-dimensional representation:
                </p>
                <div className="text-center my-2">
                    <Latex>{'$\\rho_k(g) = e^{2\\pi i k / n}$'}</Latex>
                </div>
                <p className="text-sm text-amber-900 mt-2">
                    which corresponds to a rotation by <Latex>{'$2\\pi k/n$'}</Latex> in the complex plane.
                    Different values of <Latex>{'$k$'}</Latex> give different representations of the same group.
                </p>
            </div>

            {/* ─── Physics & Geometry ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Applications in Geometry and Physics
            </h3>

            <p>
                Group representations are particularly important in understanding symmetries in
                geometry and physics. The rotation group <Latex>{'$SO(3)$'}</Latex> has representations that
                describe how objects in three-dimensional space can be rotated. These representations
                are used extensively in quantum mechanics, where the symmetries of a system are
                represented by the group of rotations, and the states of the system correspond to
                vectors in a representation space.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Rotation Group SO(3)</h4>
                    <p className="text-xs text-emerald-900">
                        The representations of <Latex>{'$SO(3)$'}</Latex> classify how physical objects
                        transform under rotations. In quantum mechanics, these give rise to
                        angular momentum quantum numbers and spherical harmonics.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2 text-sm">Quantum States</h4>
                    <p className="text-xs text-blue-900">
                        States of a quantum system correspond to vectors in a representation space.
                        The group structure ensures that physical symmetries are preserved through
                        state transformations.
                    </p>
                </div>
            </div>

            {/* ─── ML & Transformers ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Representations in Machine Learning
            </h3>

            <p>
                In the context of machine learning and transformers, group representations can be
                used to model how data is transformed as it passes through the layers of the network.
                The self-attention mechanism in transformers can be interpreted as a
                representation of a permutation group, where the elements of the group correspond to
                different ways of permuting the input sequence.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Self-Attention as Representation</p>
                <p className="text-sm text-indigo-900">
                    By understanding the representation theory of the permutation group acting on sequences,
                    we gain insights into how the transformer captures symmetries and invariances in the data.
                    The key and query matrices <Latex>{'$W_K, W_Q$'}</Latex> can be seen as defining the
                    interaction between different representations, while the value matrix <Latex>{'$W_V$'}</Latex> determines
                    how features are combined under these symmetries.
                </p>
            </div>
        </div>
    );
}

export function CharacterTheory() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Character Theory
            </h2>

            <p>
                Character theory is a branch of representation theory that focuses on the trace of the
                matrices associated with group elements. The <strong>character</strong> of a
                representation <Latex>{'$\\rho : G \\to \\text{GL}(V)$'}</Latex> is a
                function <Latex>{'$\\chi : G \\to F$'}</Latex> defined by
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\chi(g) = \\text{Tr}(\\rho(g))$'}</Latex>
            </div>

            <p>
                where <Latex>{'$\\text{Tr}(\\rho(g))$'}</Latex> denotes the trace of the
                matrix <Latex>{'$\\rho(g)$'}</Latex>. The character <Latex>{'$\\chi$'}</Latex> encodes
                important information about the representation, such as its degree (given
                by <Latex>{'$\\chi(e)$'}</Latex>, where <Latex>{'$e$'}</Latex> is the identity element
                of <Latex>{'$G$'}</Latex>) and how the representation decomposes into irreducible components.
            </p>

            {/* ─── Class Functions ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Characters as Class Functions
            </h3>

            <p>
                One of the key results in character theory is that characters are <strong>class functions</strong>,
                meaning they are constant on conjugacy classes of the group. If <Latex>{'$g_1$'}</Latex> and <Latex>{'$g_2$'}</Latex> are
                conjugate in <Latex>{'$G$'}</Latex> (i.e., there exists <Latex>{'$h \\in G$'}</Latex> such
                that <Latex>{'$g_2 = hg_1h^{-1}$'}</Latex>), then
            </p>

            <div className="bg-slate-50 p-4 rounded-lg my-4 border border-slate-200 text-center">
                <Latex>{'$\\chi(g_1) = \\chi(g_2)$'}</Latex>
            </div>

            <p>
                This property greatly simplifies the study of representations, as it reduces the
                problem to understanding the characters on a finite number of conjugacy classes.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-400 p-4 my-6">
                <p className="font-semibold text-violet-800 mb-2">Why Class Functions Matter</p>
                <p className="text-sm text-violet-900">
                    Since conjugate elements always have the same character value, the entire character
                    of a representation is determined by its values on conjugacy class representatives.
                    For a group with <Latex>{'$k$'}</Latex> conjugacy classes, the character table
                    is a <Latex>{'$k \\times k$'}</Latex> matrix — far more compact than listing values
                    for every element.
                </p>
            </div>

            {/* ─── Orthogonality Relations ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Orthogonality Relations
            </h3>

            <p>
                Characters play a crucial role in the classification of representations. The <strong>orthogonality
                    relations</strong> provide a powerful tool for determining whether two representations are
                equivalent and for decomposing a given representation into irreducible components.
                For a finite group <Latex>{'$G$'}</Latex> and two irreducible
                characters <Latex>{'$\\chi$'}</Latex> and <Latex>{'$\\psi$'}</Latex>, the orthogonality
                relation states that
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 my-6">
                <p className="font-semibold text-amber-800 mb-2">Row Orthogonality</p>
                <div className="text-center my-2">
                    <Latex>{'$\\frac{1}{|G|} \\sum_{g \\in G} \\chi(g)\\overline{\\psi(g)} = \\delta_{\\chi\\psi}$'}</Latex>
                </div>
                <p className="text-sm text-amber-900 mt-3">
                    where <Latex>{'$|G|$'}</Latex> is the order of the group
                    and <Latex>{'$\\delta_{\\chi\\psi}$'}</Latex> is the Kronecker delta — equal to 1
                    if <Latex>{'$\\chi = \\psi$'}</Latex> and 0 otherwise. This implies that the
                    characters of different irreducible representations are <em>orthogonal</em>, forming
                    an orthonormal basis for the space of class functions.
                </p>
            </div>

            <p>
                This relation provides a method for finding the <strong>multiplicities</strong> of irreducible
                components in a given representation: the multiplicity of an irrep <Latex>{'$\\chi_i$'}</Latex> in
                a representation with character <Latex>{'$\\chi$'}</Latex> is given
                by <Latex>{'$\\langle \\chi, \\chi_i \\rangle$'}</Latex>.
            </p>

            {/* ─── Geometry & Physics ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Connections to Geometry and Physics
            </h3>

            <p>
                Character theory has deep connections to the geometry of the underlying space on which
                the group acts. For example, the characters of the rotation group <Latex>{'$SO(3)$'}</Latex> are
                related to <strong>spherical harmonics</strong>, which describe the symmetries of functions on the
                sphere.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                    <h4 className="font-bold text-emerald-800 mb-2 text-sm">Spherical Harmonics</h4>
                    <p className="text-xs text-emerald-900">
                        The characters of <Latex>{'$SO(3)$'}</Latex> describe how functions on the
                        sphere decompose into spherical harmonic components. This is exploited in
                        atomic orbital analysis and vibration studies.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2 text-sm">Molecular Symmetry</h4>
                    <p className="text-xs text-blue-900">
                        In chemistry, character tables of point groups classify molecular vibrations,
                        predict infrared/Raman activity, and determine selection rules for
                        spectroscopic transitions.
                    </p>
                </div>
            </div>

            {/* ─── Transformers ─── */}
            <h3 className="text-xl font-bold text-indigo-700 border-b border-indigo-200 pb-1 mt-8 mb-4">
                Characters in Transformer Analysis
            </h3>

            <p>
                In the context of transformers, character theory can be used to analyze how the
                model captures the symmetries in the data. If the data exhibits a certain
                group symmetry, the character of the representation associated with the model can
                reveal how this symmetry is preserved or broken as the data is processed.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 my-6">
                <p className="font-semibold text-indigo-800 mb-2">Symmetry Fingerprinting</p>
                <p className="text-sm text-indigo-900">
                    By computing the character of the representation at each layer, we obtain a
                    &ldquo;symmetry fingerprint&rdquo; that tracks how group symmetry flows through the network.
                    This analysis can reveal which layers break symmetry (potentially learning
                    task-specific features) and which preserve it (ensuring equivariance).
                </p>
            </div>
        </div>
    );
}

export function TransformerApplications() {
    return (
        <div className="prose prose-slate max-w-none mt-12">
            <h2 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-2 mb-4">
                Applications to Transformers
            </h2>

            <p>
                Why do we care about groups and representations in Transformers? The answer lies in <strong>invariance</strong> and <strong>equivariance</strong>.
                If our data has an underlying symmetry (like permutation invariance in a set of objects, or translation invariance in an image), we want our neural network to understand and respect that symmetry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                    <h4 className="font-bold text-amber-800 mb-2">Positional Encodings</h4>
                    <p className="text-sm text-amber-900">
                        In standard Transformers, the self-attention mechanism is permutation equivariant: it treats the sequence as a set. To handle sequential data (where order matters), we inject positional information.
                        From a group theory perspective, this breaks the full permutation symmetry <Latex>{'$S_n$'}</Latex> allowing the model to distinguish positions.
                    </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h4 className="font-bold text-blue-800 mb-2">Equivariant Self-Attention</h4>
                    <p className="text-sm text-blue-900">
                        Recent research explores <strong>Group Equivariant Transformers</strong>. Instead of just scalar features, the neurons transform according to a specific group representation (e.g., rotation group <Latex>{'$SO(3)$'}</Latex> for 3D point clouds).
                        This guarantees that if the input rotates, the internal features simply rotate accordingly without distortion.
                    </p>
                </div>
            </div>

            <p>
                By defining the attention mechanism as a map between representation spaces, we can mathematically prove constraints on the weight matrices (like <Latex>{'$W_Q, W_K, W_V$'}</Latex>) that enforce these symmetries, leading to more data-efficient and robust models.
            </p>
        </div>
    );
}

export default function GroupTheoryContent() {
    return (
        <div className="space-y-12">
            <BasicGroupConcepts />
            <GroupsSubgroupsCosets />
            <GroupHomomorphisms />
            <RepresentationTheory />
            <CharacterTheory />
            <TransformerApplications />
        </div>
    );
}
