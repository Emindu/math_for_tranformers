"use client";

import React from 'react';
import LessonLayout from '@/components/shell/LessonLayout';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import { TopologyContent } from '@/components/content/MetricSpacesContent';
import TopologyLab from '@/components/math-viz/TopologyLab';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Introduction to Topology",
        text: `Topology provides a framework for understanding the structure and properties of metric spaces beyond mere distances. While a metric tells us how far apart two points are, topology tells us about the shape and connectivity of the space itself. These concepts are crucial for studying the geometry, symmetry, and continuity properties leveraged in the design of intelligent systems like transformers.`,
    },
    {
        title: "Open Sets",
        text: `An open set in a metric space is a subset where every point has a little breathing room around it. Formally, for every point x in an open set U, there exists a small radius epsilon such that the entire open ball around x fits inside U. Think of it like standing in a field — you can take a small step in any direction and still be in the field. Open sets satisfy three important axioms: the union of any collection of open sets is open, the intersection of finitely many open sets is open, and both the empty set and the whole space are open.`,
    },
    {
        title: "Closed Sets",
        text: `A closed set is the complement of an open set. Equivalently, a set is closed if it contains all its limit points — points that can be approximated arbitrarily closely by elements of the set. The key distinction is about boundary inclusion: an open ball excludes its boundary (shown with a dashed circle), while a closed ball includes it (shown with a solid circle). In the interactive lab, you can toggle between these two to see the visual difference.`,
    },
    {
        title: "Continuity",
        text: `A function between metric spaces is continuous if nearby points map to nearby points. The formal epsilon-delta definition says: for every epsilon greater than zero, there exists a delta greater than zero such that whenever the distance between x and x-naught is less than delta, the distance between f of x and f of x-naught is less than epsilon. The topological definition is equivalent but more elegant: a function is continuous if the preimage of every open set is open. The interactive lab lets you visualize epsilon-delta continuity by adjusting the epsilon band and seeing the corresponding delta band.`,
    },
    {
        title: "Compactness and Heine-Borel Theorem",
        text: `A subset K of a metric space is compact if every open cover of K has a finite subcover. The famous Heine-Borel theorem tells us that in Euclidean space, a subset is compact if and only if it is closed and bounded. Compact sets guarantee that every sequence has a convergent subsequence, and that continuous functions attain their maximum and minimum values. These properties are essential in optimization.`,
    },
    {
        title: "Applications in Machine Learning",
        text: `In machine learning and attention mechanisms, compactness ensures the existence of solutions when optimizing over compact parameter sets. The Arzelà-Ascoli theorem provides conditions under which a family of continuous functions is relatively compact — meaning any sequence within the family has a uniformly convergent subsequence. This helps understand how neural networks approximate functions and generalize to unseen data, ensuring that the transformation of data through the network preserves essential properties.`,
    },
];

export default function TopologyPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="cyan" />
            </div>
            <TopologyContent topologyLab={<TopologyLab />} />
        </LessonLayout>
    );
}
