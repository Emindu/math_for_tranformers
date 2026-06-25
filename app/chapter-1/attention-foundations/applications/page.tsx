"use client";

import React from 'react';
import { ApplicationsContent } from '@/components/content/AttentionFoundationsContent';
import MetricPreservationLab from '@/components/math-viz/MetricPreservationLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Expressivity of Transformers",
        text: `Expressivity refers to a model's ability to capture and represent a wide range of functions within input data. The self-attention mechanism significantly enhances expressivity by dynamically focusing on different parts of the input sequence, thereby capturing complex dependencies and interactions that simpler models cannot. Mathematically, self-attention acts as an operator on a Hilbert space of functions, producing weighted combinations of input features through learned attention weights.`,
    },
    {
        title: "Multi-Head Attention and Function Spaces",
        text: `In multi-head attention, multiple attention operators are applied in parallel, each with different parameterizations. The combined output effectively increases the dimensionality of the function space the model can represent. Each head captures different aspects of the input — one might focus on syntax, another on semantics, and another on positional relationships. The outputs are concatenated and projected through a learned weight matrix W-O, giving the model extraordinary representational power.`,
    },
    {
        title: "Depth, Non-linearity, and Universal Approximation",
        text: `The inclusion of non-linear activation functions like ReLU, combined with stacking multiple layers of self-attention, further enhances expressivity. According to the universal approximation theorem, this combination can approximate any continuous function on a compact domain to arbitrary accuracy, provided the network is sufficiently deep and wide. This theoretical guarantee underpins the remarkable success of deep transformer architectures across diverse tasks.`,
    },
    {
        title: "Attention as a Metric-Preserving Map",
        text: `A critical property of attention mechanisms is their behavior as metric-preserving maps. In a metric space, a mapping preserves the metric if it approximately maintains distances between points. For transformers, this means that if two input embeddings are semantically similar — that is, close in the embedding space — their output representations after attention should also be close. This preservation of geometric structure is essential for maintaining semantic relationships through the network's layers.`,
    },
    {
        title: "Analyzing Distance Distortion",
        text: `The output distance between two vectors after attention depends on the difference in their attention weight distributions. When attention weights don't vary significantly between two inputs, the output distance stays close to the input distance — the metric is approximately preserved. But when attention weights differ substantially, distances can be contracted or expanded. This selective distortion is actually beneficial: it allows the model to emphasize task-relevant dimensions while deemphasizing noise.`,
    },
    {
        title: "Adaptive Metric Preservation",
        text: `In practice, attention operates as an adaptive metric-preserving map. Rather than rigidly preserving all distances equally, it dynamically adjusts the effective metric to emphasize the most informative features of the data for the current task. Similar tokens get pulled closer together through shared attention patterns, while genuinely distinct tokens maintain their separation. This adaptive behavior is what makes transformers so effective at capturing both local relationships and global context simultaneously.`,
    },
];

export default function ApplicationsPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="emerald" />
            </div>
            <ApplicationsContent preservationLab={<MetricPreservationLab />} />
        </LessonLayout>
    );
}
