"use client";

import React from 'react';
import { GradientFlowContent } from '@/components/content/MatrixCalculusContent';
import ConvergenceLab from '@/components/math-viz/ConvergenceLab';
import LearningRateLab from '@/components/math-viz/LearningRateLab';
import AudioExplainer, { AudioSection } from '@/components/ui/AudioExplainer';
import LessonLayout from '@/components/shell/LessonLayout';

const AUDIO_SECTIONS: AudioSection[] = [
    {
        title: "Optimization and Gradient Flow",
        text: `Optimization is the engine of training. In self-attention and transformers, the goal is to adjust parameters iteratively to minimize the loss function. This happens via gradient descent, where we step in the opposite direction of the gradient on the loss landscape.`,
    },
    {
        title: "Convergence Analysis",
        text: `For gradient descent to reach a minimum, the loss function needs certain mathematical properties like smoothness—meaning gradients don't change too violently—and an appropriately sized learning rate. If the learning rate is too large, the optimizer bounces around or diverges; if it's too small, training takes forever.`,
    },
    {
        title: "Learning Rate Schedules",
        text: `Because a fixed learning rate is rarely optimal throughout training, we use learning rate schedules. We might use step decay, polynomial decay, or a cosine curve to systematically reduce step sizes as we approach a minimum. Techniques like warm restarts occasionally bump the learning rate back up to help the model escape shallow local minima and find better regions of the parameter space.`,
    },
];

export default function GradientFlowPage() {
    return (
        <LessonLayout width="wide">
            <div className="mb-10">
                <AudioExplainer sections={AUDIO_SECTIONS} accentColor="indigo" />
            </div>
            <GradientFlowContent
                convergenceLab={<ConvergenceLab />}
                learningRateLab={<LearningRateLab />}
            />
        </LessonLayout>
    );
}
