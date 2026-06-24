"use client";

import React from 'react';
import { ApplicationsContent } from '@/components/content/GroupTheoryContent';
import EquivarianceLab from '@/components/math-viz/EquivarianceLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Symmetry in Transformers",
        text: `Transformers inherently deal with symmetry. The self-attention mechanism treats the input as a set — it is permutation equivariant, meaning reordering the input tokens produces a corresponding reordering of the output. This permutation symmetry is a group-theoretic property. Understanding it helps explain why transformers can process variable-length sequences and why positional encodings are needed to break this symmetry when order matters.`,
    },
    {
        title: "Invariance and Equivariance",
        text: `A function is invariant under a group if applying any group transformation to the input doesn't change the output. A function is equivariant if the output transforms in a predictable way when the input is transformed. Classification tasks require invariance — the label shouldn't change if you rotate an image. But intermediate layers should be equivariant, preserving the spatial structure of features so that downstream layers can use it.`,
    },
    {
        title: "Positional Encodings as Symmetry Breaking",
        text: `Without positional encodings, a transformer is completely permutation equivariant — it cannot distinguish the order of tokens. Positional encodings break this symmetry by injecting position-dependent information. Sinusoidal positional encodings are particularly elegant because they use the representation theory of the translation group. The frequencies of the sine and cosine functions correspond to different irreducible representations.`,
    },
    {
        title: "Equivariant Self-Attention",
        text: `Equivariant self-attention generalizes standard attention to respect additional symmetries beyond permutation. For example, if we want attention to be equivariant under rotations, we need query, key, and value transformations that respect the rotation group. This constrains the weight matrices to commute with rotation matrices — a condition that representation theory makes precise through Schur's lemma.`,
    },
    {
        title: "Weight Constraints from Group Theory",
        text: `Group theory provides principled weight constraints for neural networks. Instead of learning arbitrary weight matrices, equivariant networks learn weights that commute with group representations. This dramatically reduces the number of free parameters while guaranteeing that the network respects the desired symmetries. The result is better data efficiency — the network doesn't need to learn invariances from data because they're built into the architecture.`,
    },
    {
        title: "The Big Picture",
        text: `Group theory and representation theory provide the mathematical language for understanding symmetry in neural networks. From the permutation symmetry of attention, to rotational equivariance in vision transformers, to the representation-theoretic structure of positional encodings — these concepts unify many seemingly different design choices. Understanding this mathematical foundation enables researchers to design more principled, efficient, and interpretable transformer architectures.`,
    },
];

export default function ApplicationsPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="amber" />
            </div>

            <ApplicationsContent
                equivarianceLab={<EquivarianceLab />}
            />
        </LessonLayout>
    );
}
