"use client";

import React from 'react';
import LessonLayout from '@/components/shell/LessonLayout';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import { MappingsContent } from '@/components/content/MetricSpacesContent';
import ContractionLab from '@/components/math-viz/ContractionLab';
import MetricPreservationLab from '@/components/math-viz/MetricPreservationLab';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Introduction to Mappings",
        text: `Mappings between metric spaces play a crucial role in understanding how structures and properties are preserved or transformed. These mappings can reveal deep insights into the geometry and symmetry of spaces. In the context of transformers and attention mechanisms, understanding these mappings helps us explore how information is processed, how distances between data points are preserved or altered, and how convergence to fixed points is achieved.`,
    },
    {
        title: "Isometries",
        text: `An isometry is a mapping between metric spaces that preserves distances exactly. If you have two metric spaces X and Y, a function f from X to Y is an isometry if the distance between f of x1 and f of x2 in Y equals the distance between x1 and x2 in X. Rotations, translations, and reflections in Euclidean space are all isometries. In neural networks, especially in image processing, it is often desirable that transformations preserve spatial relationships between pixels — which is a type of isometry.`,
    },
    {
        title: "Contraction Mappings",
        text: `A contraction mapping is a stronger notion where distances between points are actually reduced. A function f from X to X is a contraction if there exists a constant c between 0 and 1 such that the distance between f of x1 and f of x2 is at most c times the distance between x1 and x2. The constant c is called the Lipschitz constant. Contractions bring points closer together, which has profound implications for the existence of fixed points — points x-star where f of x-star equals x-star.`,
    },
    {
        title: "The Banach Fixed-Point Theorem",
        text: `The Banach fixed-point theorem, also known as the contraction mapping theorem, is a fundamental result. It states that if X is a complete metric space and f is a contraction mapping on X, then f has a unique fixed point x-star. Moreover, starting from any initial point x-naught, the sequence defined by x-n-plus-1 equals f of x-n converges to x-star. This is incredibly powerful — it guarantees both existence and uniqueness of the fixed point, plus it gives us a constructive way to find it through iteration.`,
    },
    {
        title: "Applications in Optimization",
        text: `In machine learning, the Banach fixed-point theorem can be applied to analyze convergence of training algorithms. When training a neural network, we iteratively update parameters to minimize a loss function. If the update rule can be modeled as a contraction mapping, the theorem guarantees that the sequence of parameter updates will converge to a unique set of optimal parameters. This provides a rigorous mathematical foundation for why gradient descent works under certain conditions.`,
    },
    {
        title: "Attention Mechanisms and RNN Stability",
        text: `In advanced attention mechanisms within transformers, iterative refinement of attention weights may be employed to achieve better focus on relevant parts of the input. By ensuring that these refinements act as contractions, we can guarantee convergence to stable attention weights. The Banach theorem also plays a role in understanding recurrent neural network stability. Ensuring that each step's transformation is a contraction prevents gradient explosion or vanishing, maintaining stable learning.`,
    },
];

export default function MappingsPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="violet" />
            </div>
            <MappingsContent
                contractionLab={<ContractionLab />}
                preservationLab={<MetricPreservationLab />}
            />
        </LessonLayout>
    );
}
