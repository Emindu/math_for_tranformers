"use client";

import React from 'react';
import { AttentionAsMappingContent } from '@/components/content/AttentionFoundationsContent';
import AttentionMappingLab from '@/components/math-viz/AttentionMappingLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "What is Attention?",
        text: `Attention mechanisms are at the heart of modern transformer architectures. Mathematically, attention is a mapping that transforms input features into output features by assigning different weights to different parts of the input. Given a set of input vectors, the attention mechanism produces a weighted combination that emphasizes the most relevant inputs for a particular query. This dynamic weighting is what gives transformers their remarkable ability to capture dependencies across long sequences.`,
    },
    {
        title: "The Scaled Dot-Product Formula",
        text: `The attention function takes three inputs: queries Q, keys K, and values V. First, attention scores are computed as the dot product of each query with each key, divided by the square root of the key dimension. This scaling factor prevents the dot products from growing too large in high dimensions. The scores are then passed through a softmax function to produce a probability distribution — the attention weights. Finally, the output is computed as a weighted sum of the value vectors. The complete formula is: Attention equals softmax of Q times K-transpose over square root of d-k, times V.`,
    },
    {
        title: "Linearity in Value Vectors",
        text: `One key property of attention is that it's linear with respect to the value vectors. This means if you have two sets of values V1 and V2, the attention applied to their linear combination alpha-V1 plus beta-V2 equals alpha times the attention on V1 plus beta times the attention on V2. This linearity makes attention suitable for aggregating information from different sources in a controlled, predictable way.`,
    },
    {
        title: "Permutation Invariance",
        text: `The attention mechanism is invariant under simultaneous permutations of the input sequence. If you rearrange the order of the query, key, and value vectors in the same way, the output is simply rearranged in the same way too. This means attention doesn't inherently care about the order of inputs — it processes them as a set. This is why transformers need positional encodings to capture sequential information.`,
    },
    {
        title: "Boundedness and Stability",
        text: `The attention mapping is bounded and stable. Small perturbations in the query, key, or value matrices produce only small changes in the output, bounded by a constant times the size of the perturbations. This stability is crucial for training — it means the attention mechanism won't amplify noise or exhibit chaotic behavior when inputs change slightly.`,
    },
    {
        title: "Probabilistic Interpretation",
        text: `The attention weights are non-negative and sum to one for each query, giving them a natural probabilistic interpretation. Each weight alpha-i-j represents the probability that value vector j is relevant for query i. This soft selection mechanism allows the model to smoothly interpolate between focusing on a single input and spreading attention uniformly. It's what enables transformers to perform nuanced, context-dependent information retrieval.`,
    },
];

export default function AttentionAsMappingPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="indigo" />
            </div>
            <AttentionAsMappingContent mappingLab={<AttentionMappingLab />} />
        </LessonLayout>
    );
}
