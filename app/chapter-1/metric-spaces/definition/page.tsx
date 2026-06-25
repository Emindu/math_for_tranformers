"use client";

import React from 'react';
import LessonLayout from '@/components/shell/LessonLayout';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import { DefinitionContent } from '@/components/content/MetricSpacesContent';
import MetricSpaceLab from '@/components/math-viz/MetricSpaceLab';
import ConvergenceLab from '@/components/math-viz/ConvergenceLab';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What is a Metric Space?",
        text: `A metric space is a set equipped with a function that defines a notion of distance between any two elements. Formally, a metric space is a pair (X, d), where X is a set and d is a function from X cross X to the real numbers, called a metric or distance function. This simple structure is surprisingly powerful — it provides the foundation for convergence, continuity, and many concepts in machine learning.`,
    },
    {
        title: "The Four Metric Axioms",
        text: `Every metric must satisfy four axioms. First, non-negativity: the distance between any two points is always zero or positive. Second, identity of indiscernibles: the distance is zero if and only if the two points are the same. Third, symmetry: the distance from x to y equals the distance from y to x. Fourth, the triangle inequality: the distance from x to z is at most the distance from x to y plus y to z. These axioms capture our intuitive understanding of distance.`,
    },
    {
        title: "Examples of Metric Spaces",
        text: `There are many important examples of metric spaces. The most familiar is Euclidean space, where distance is the straight-line distance we learn in school. Manhattan distance measures distance along grid lines, like navigating city blocks. Cosine distance measures the angle between vectors, which is especially useful in natural language processing for comparing word embeddings. The discrete metric assigns distance zero to identical points and distance one to all other pairs. Hamming distance counts the number of positions where two strings differ, useful in error detection and coding theory.`,
    },
    {
        title: "Convergence of Sequences",
        text: `A sequence in a metric space converges to a point x if the terms of the sequence eventually get arbitrarily close to x. More precisely, for every epsilon greater than zero, there exists an integer N such that all terms beyond N are within epsilon of x. This concept is fundamental to optimization — when we train neural networks, we want the sequence of parameter updates to converge to good values.`,
    },
    {
        title: "Cauchy Sequences and Completeness",
        text: `A Cauchy sequence is one where the terms get closer and closer to each other, even if we don't know what they converge to. A metric space is called complete if every Cauchy sequence in the space has a limit that also belongs to the space. The real numbers are complete, and so is Euclidean space. Completeness is crucial in optimization: it guarantees that iterative algorithms like gradient descent, which produce Cauchy sequences of parameters, will actually converge to a solution.`,
    },
    {
        title: "Why Metric Spaces Matter for Transformers",
        text: `In transformers, the distances between word embeddings or image features influence how the attention mechanism focuses on different parts of the input. The choice of metric determines what "similarity" means for the model. Understanding metric spaces helps us reason about why certain architectures work, why training converges, and how representations in different layers relate to each other.`,
    },
];

export default function DefinitionPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="indigo" />
            </div>
            <DefinitionContent
                metricLab={<MetricSpaceLab />}
                convergenceLab={<ConvergenceLab />}
            />
        </LessonLayout>
    );
}
