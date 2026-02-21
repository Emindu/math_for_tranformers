import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Latex from 'react-latex-next';

// Shared component for math notes
export const MathNote = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6">
        <h4 className="font-semibold text-slate-800 mb-3">{title}</h4>
        <div className="text-slate-600 prose prose-slate max-w-none">
            {children}
        </div>
    </div>
);

import LessonAudio from '@/components/ui/LessonAudio';

export function BasicProbabilityIntro() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Basic Probability Concepts</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Measure theory and information theory provide the mathematical foundation for understanding and quantifying uncertainty, randomness, and information in various contexts. These concepts are essential in many areas of machine learning and data science, including probability theory, entropy, and inference methods. In this section, we explore these topics, focusing on their mathematical underpinnings and their relevance to the design and analysis of machine learning models, including transformers.
            </p>
        </div>
    );
}

export function ProbabilitySpacesContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Probability Spaces</h3>
            <p className="text-slate-700 mb-4">
                Probability theory is a branch of mathematics that deals with the analysis of random phenomena. The mathematical framework for probability theory is built on measure theory, where probabilities are assigned to events in a measurable space.
            </p>
            <p className="text-slate-700 mb-4">
                A probability space <Latex>{`$(\\Omega, \\mathcal{F}, P)$`}</Latex> consists of three components:
            </p>
            <ul className="list-decimal pl-6 space-y-3 text-slate-700 mb-8">
                <li>
                    <strong>Sample Space <Latex>{`$(\\Omega)$`}</Latex>:</strong> The set of all possible outcomes of a random experiment.
                </li>
                <li>
                    <strong>Sigma-Algebra <Latex>{`$(\\mathcal{F})$`}</Latex>:</strong> A collection of subsets of <Latex>{`$\\Omega$`}</Latex>, called events, that is closed under complement and countable unions. This ensures that the probability of any event can be well defined.
                </li>
                <li>
                    <strong>Probability Measure <Latex>{`$(P)$`}</Latex>:</strong> A function <Latex>{`$P : \\mathcal{F} \\to [0, 1]$`}</Latex> that assigns a probability to each event in <Latex>{`$\\mathcal{F}$`}</Latex>. The measure <Latex>{`$P$`}</Latex> satisfies the following axioms:
                    <ul className="list-[lower-alpha] pl-6 mt-2 space-y-2">
                        <li><Latex>{`$P(\\Omega) = 1$`}</Latex>.</li>
                        <li>
                            For any countable sequence of disjoint events <Latex>{`$\\lbrace A_i \\rbrace \\subset \\mathcal{F}$`}</Latex>,
                            <div className="my-2 p-3 bg-slate-50 rounded-lg overflow-x-auto text-center">
                                <Latex>{`$$ P\\left(\\bigcup_{i=1}^\\infty A_i\\right) = \\sum_{i=1}^\\infty P(A_i) $$`}</Latex>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>

            <LessonAudio
                title="Probability Spaces"
                script="A probability space grounds randomness into rigid mathematics. We define all possible outcomes as the sample space omega. The Sigma Algebra is the set of all valid questions we can ask about those outcomes—the events. And the probability measure maps those events to a strict zero-to-one likelihood, obeying the law that the total probability must equal exactly one."
            />
        </div>
    );
}

export function RandomVariablesContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Random Variables and Moments</h3>
            <p className="text-slate-700 mb-4">
                A random variable is a measurable function <Latex>{`$X : \\Omega \\to \\mathbb{R}$`}</Latex> that assigns a real number to each outcome in the sample space. The distribution of a random variable is described by its probability distribution function <Latex>{`$F_X(x)$`}</Latex> or probability density function <Latex>{`$f_X(x)$`}</Latex> in the continuous case:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center flex flex-col gap-2">
                <Latex>{`$$ F_X(x) = P(X \\leq x) $$`}</Latex>
                <Latex>{`$$ f_X(x) = \\frac{d F_X(x)}{dx} $$`}</Latex>
            </div>

            <p className="text-slate-700 mb-4">
                The expectation <Latex>{`$E[X]$`}</Latex>, variance <Latex>{`$\\text{Var}(X)$`}</Latex>, and higher moments provide important characteristics of the distribution of <Latex>{`$X$`}</Latex>.
            </p>

            <MathNote title="Example: Fair Die Roll">
                Consider a random variable <Latex>{`$X$`}</Latex> representing the outcome of a fair die roll. The sample space is <Latex>{`$\\Omega = \\{1, 2, 3, 4, 5, 6\\}$`}</Latex>, and the probability measure assigns <Latex>{`$P(\\{i\\}) = \\frac{1}{6}$`}</Latex> for each <Latex>{`$i \\in \\Omega$`}</Latex>. The expectation of <Latex>{`$X$`}</Latex> is given by:
                <div className="my-2 text-center">
                    <Latex>{`$$ E[X] = \\sum_{i=1}^6 i \\cdot P(X = i) = \\frac{1}{6} \\cdot (1 + 2 + 3 + 4 + 5 + 6) = 3.5 $$`}</Latex>
                </div>
            </MathNote>
        </div>
    );
}

export function LlnCltContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Law of Large Numbers & CLT</h3>
            <p className="text-slate-700 mb-4">
                Two fundamental results in probability theory are the Law of Large Numbers (LLN) and the Central Limit Theorem (CLT):
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl my-6">
                <h4 className="font-bold text-indigo-900 mb-2">Theorem 1.14 (Law of Large Numbers)</h4>
                <p className="text-indigo-800 mb-3">
                    If <Latex>{`$X_1, X_2, \\dots$`}</Latex> are independent and identically distributed (i.i.d.) random variables with finite expectation <Latex>{`$E[X_i] = \\mu$`}</Latex>, then
                </p>
                <div className="text-center bg-white/60 py-3 rounded-lg">
                    <Latex>{`$$ \\frac{1}{n} \\sum_{i=1}^n X_i \\to \\mu \\quad \\text{as } n \\to \\infty \\text{ (almost surely)} $$`}</Latex>
                </div>
            </div>

            <div className="bg-fuchsia-50 border-l-4 border-fuchsia-500 p-5 rounded-r-xl my-6">
                <h4 className="font-bold text-fuchsia-900 mb-2">Theorem 1.15 (Central Limit Theorem)</h4>
                <p className="text-fuchsia-800 mb-3">
                    If <Latex>{`$X_1, X_2, \\dots$`}</Latex> are i.i.d. random variables with finite mean <Latex>{`$\\mu$`}</Latex> and variance <Latex>{`$\\sigma^2$`}</Latex>, then the normalized sum:
                </p>
                <div className="text-center bg-white/60 py-3 rounded-lg mb-3">
                    <Latex>{`$$ \\sqrt{n} \\left( \\frac{1}{n} \\sum_{i=1}^n X_i - \\mu \\right) \\to \\mathcal{N}(0, \\sigma^2) \\quad \\text{as } n \\to \\infty $$`}</Latex>
                </div>
                <p className="text-fuchsia-800 text-sm">
                    where <Latex>{`$\\mathcal{N}(0, \\sigma^2)$`}</Latex> is a normal distribution with mean 0 and variance <Latex>{`$\\sigma^2$`}</Latex>.
                </p>
            </div>

            <LessonAudio
                title="The Magic of Large Samples"
                script="The Law of Large Numbers guarantees that as you gather more data, your sample average will converge to the true expected value—the noise washes out. Even more beautifully, the Central Limit Theorem states that no matter what crazy distribution you draw from, if you sum enough independent instances together, their aggregate behavior will form a perfect Normal distribution bell curve."
            />
        </div>
    );
}

export function EntropyContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Entropy and Information Gain</h3>
            <p className="text-slate-700 mb-4">
                Entropy is a measure of uncertainty or randomness in a probability distribution. It is a fundamental concept in information theory, introduced by Claude Shannon, and is used to quantify the amount of information contained in a random variable.
            </p>

            <h4 className="text-xl font-bold text-slate-800 mt-6 mb-3">Shannon Entropy</h4>
            <p className="text-slate-700 mb-4">
                The entropy <Latex>{`$H(X)$`}</Latex> of a discrete random variable <Latex>{`$X$`}</Latex> with probability mass function <Latex>{`$p(x) = P(X = x)$`}</Latex> is defined as:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ H(X) = -\\sum_{x \\in \\mathcal{X}} p(x) \\log_2 p(x) $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                where the logarithm is typically taken base 2 and the entropy is measured in bits. For a continuous random variable with probability density function <Latex>{`$f(x)$`}</Latex>, the differential entropy is defined as:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ h(X) = -\\int_{\\mathcal{X}} f(x) \\log_2 f(x) \\, dx $$`}</Latex>
            </div>

            <p className="text-slate-700 mb-4">
                Entropy represents the average amount of information (in bits) produced by a random process. A higher entropy value indicates greater uncertainty or variability in the outcomes.
            </p>

            <MathNote title="Example: Fair Coin Toss">
                For a fair coin toss, the probabilities of Heads and Tails are both 0.5. The entropy is:
                <div className="my-2 text-center">
                    <Latex>{`$$ H(X) = -\\frac{1}{2} \\log_2 \\frac{1}{2} - \\frac{1}{2} \\log_2 \\frac{1}{2} = 1 \\text{ bit} $$`}</Latex>
                </div>
            </MathNote>

            <h4 className="text-xl font-bold text-slate-800 mt-6 mb-3">Information Gain</h4>
            <p className="text-slate-700 mb-4">
                Information gain measures the reduction in entropy when moving from a prior probability distribution to a posterior distribution after observing some evidence. It is commonly used in decision tree algorithms in machine learning. Let <Latex>{`$X$`}</Latex> be a random variable representing the class labels, and <Latex>{`$Y$`}</Latex> be a feature. The information gain <Latex>{`$IG(X, Y)$`}</Latex> is defined as:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ IG(X, Y) = H(X) - H(X|Y) $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                where <Latex>{`$H(X|Y)$`}</Latex> is the conditional entropy of <Latex>{`$X$`}</Latex> given <Latex>{`$Y$`}</Latex>:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ H(X|Y) = \\sum_{y \\in \\mathcal{Y}} p(y) H(X|Y = y) $$`}</Latex>
            </div>

            <LessonAudio
                title="Measuring Surprise"
                script="Entropy fundamentally measures surprise. An event you know will happen 100% of the time brings zero surprise, and thus zero entropy. A perfectly fair coin maxes out your uncertainty since you have no idea what it will land on, bringing maximum entropy. Information Gain is just a simple subtraction: how much entropy do I have now, minus how much entropy I have left after learning feature Y. It's the amount of surprise that was eliminated by knowing Y."
            />
        </div>
    );
}

export function BayesianContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Bayesian Inference</h3>
            <p className="text-slate-700 mb-4">
                Bayesian inference is a method of statistical inference in which Bayes’ theorem is used to update the probability of a hypothesis as more evidence or information becomes available.
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ P(A|B) = \\frac{P(B|A)P(A)}{P(B)} $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                In Bayesian inference, the prior probability <Latex>{`$P(A)$`}</Latex> represents our initial belief about the hypothesis. The likelihood <Latex>{`$P(B|A)$`}</Latex> represents the probability of observing the evidence <Latex>{`$B$`}</Latex> given that <Latex>{`$A$`}</Latex> is true. The posterior probability <Latex>{`$P(A|B)$`}</Latex> is the updated probability of <Latex>{`$A$`}</Latex> after observing <Latex>{`$B$`}</Latex>.
            </p>

            <MathNote title="Bayesian Networks">
                Bayesian networks are graphical models that represent the probabilistic relationships among a set of variables. Each node represents a random variable, and the edges represent conditional dependencies. In a weather prediction system, nodes could represent temperature, humidity, and wind speed, with directed edges mapping their conditional dependencies.
            </MathNote>
        </div>
    );
}

export function KLDivergenceContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">KL Divergence and Cross-Entropy</h3>
            <p className="text-slate-700 mb-4">
                Kullback–Leibler (KL) divergence is a measure of how one probability distribution diverges from a second, reference probability distribution. For two discrete probability distributions <Latex>{`$P$`}</Latex> and <Latex>{`$Q$`}</Latex> defined on the same probability space, the KL divergence <Latex>{`$D_{KL}(P||Q)$`}</Latex> is:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ D_{KL}(P||Q) = \\sum_{x \\in \\mathcal{X}} P(x) \\log_2 \\frac{P(x)}{Q(x)} $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                For continuous distributions, the sum is replaced by an integral:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ D_{KL}(P||Q) = \\int_{\\mathcal{X}} p(x) \\log_2 \\frac{p(x)}{q(x)} \\, dx $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                KL divergence is non-negative and is zero if and only if <Latex>{`$P = Q$`}</Latex> almost everywhere. It is not symmetric, meaning <Latex>{`$D_{KL}(P||Q) \\neq D_{KL}(Q||P)$`}</Latex>.
            </p>

            <h4 className="text-xl font-bold text-slate-800 mt-6 mb-3">Cross-Entropy</h4>
            <p className="text-slate-700 mb-4">
                Cross-entropy is a related concept that measures the difference between two probability distributions for a given random variable or set of events. The cross-entropy <Latex>{`$H(P, Q)$`}</Latex> is defined as:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ H(P, Q) = -\\sum_{x \\in \\mathcal{X}} P(x) \\log_2 Q(x) $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                Cross-entropy can be decomposed into the entropy of <Latex>{`$P$`}</Latex> and the KL divergence between <Latex>{`$P$`}</Latex> and <Latex>{`$Q$`}</Latex>:
            </p>
            <div className="my-4 p-4 bg-slate-50 rounded-lg overflow-x-auto text-center">
                <Latex>{`$$ H(P, Q) = H(P) + D_{KL}(P||Q) $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-4">
                In machine learning, cross-entropy is often used as a loss function for classification tasks. The goal is to minimize the cross-entropy between the true labels (distribution <Latex>{`$P$`}</Latex>) and the predicted probabilities (distribution <Latex>{`$Q$`}</Latex>).
            </p>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-xl my-6">
                <h4 className="font-bold text-emerald-900 mb-2">Theorem 1.16 (Information Inequality / Gibbs&apos;s Inequality)</h4>
                <p className="text-emerald-800 mb-3">
                    The KL divergence between two distributions <Latex>{`$P$`}</Latex> and <Latex>{`$Q$`}</Latex> is always non-negative:
                </p>
                <div className="text-center bg-white/60 py-3 rounded-lg">
                    <Latex>{`$$ D_{KL}(P||Q) \\geq 0 $$`}</Latex>
                </div>
                <p className="text-emerald-800 mt-3 text-sm">
                    with equality if and only if <Latex>{`$P = Q$`}</Latex> almost everywhere. This theorem underpins the use of KL divergence as a target measure of how one distribution approximates another.
                </p>
            </div>

        </div>
    );
}

export function MeasureTheoryFoundationsContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Foundations of Measure Theory</h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Measure theory is a fundamental branch of mathematics that extends the notion of length, area, and volume to more complex sets, providing a rigorous foundation for integration and probability theory. This section delves into the core concepts, focusing on the Lebesgue measure and measure-preserving transformations, which are critical in information theory and analyzing continuous distributions.
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-200">
                Lebesgue Measure and Integration
            </h3>

            <LessonAudio
                title="The Measure of All Things"
                script="For simple shapes like rectangles, calculating area is easy: length times width. But how do you measure the 'volume' of something infinitely complex or scattered, like the set of all irrational numbers? This is where Measure Theory comes in. A measure, like the Lebesgue measure, is just a mathematical ruler that formally assigns a non-negative size to a set, strictly obeying the rule that if you combine disjoint sets, their total volume simply adds up."
            />

            <p className="text-slate-700 mb-4">
                The <strong>Lebesgue measure</strong> is a mathematical construct that generalizes the notion of length, area, and volume to complex sets in <Latex>{`$\\mathbb{R}^n$`}</Latex>. Formally, a measure <Latex>{`$\\mu$`}</Latex> on a set <Latex>{`$X$`}</Latex> is a function that assigns a non-negative real number or <Latex>{`$+\\infty$`}</Latex> to each measurable subset, satisfying the following core properties:
            </p>

            <ul className="list-disc pl-6 space-y-3 mb-6">
                <li>
                    <strong>Non-negativity:</strong> <Latex>{`$\\mu(A) \\ge 0$`}</Latex> for all measurable sets <Latex>{`$A \\subseteq X$`}</Latex>.
                </li>
                <li>
                    <strong>Null empty set:</strong> <Latex>{`$\\mu(\\emptyset) = 0$`}</Latex>.
                </li>
                <li>
                    <strong>Countable additivity (σ-additivity):</strong> For any countable collection <Latex>{`$\\{A_i\\}$`}</Latex> of disjoint measurable sets,
                    <div className="my-2 bg-slate-50 py-3 rounded text-center">
                        <Latex>{`$$ \\mu \\left( \\bigcup_{i=1}^\\infty A_i \\right) = \\sum_{i=1}^\\infty \\mu(A_i) $$`}</Latex>
                    </div>
                </li>
            </ul>

            <MathNote title="Example: The Standard Ruler">
                Consider the interval <Latex>{`$A = [0, 1] \\subset \\mathbb{R}$`}</Latex>. The Lebesgue measure <Latex>{`$\\lambda^1(A)$`}</Latex> of this 1-dimensional interval is simply its standard length, which is <Latex>{`$1 - 0 = 1$`}</Latex>.
            </MathNote>

            <h4 className="text-xl font-bold text-slate-800 mt-8 mb-4">Lebesgue Integration</h4>

            <p className="text-slate-700 mb-4">
                While Riemann integration slices the domain (the x-axis) into vertical rectangular intervals, <strong>Lebesgue integration</strong> partitions the codomain (the y-axis). It measures the &quot;size&quot; of the subset of the domain where the function takes on certain values. This allows for the integration of highly irregular functions, such as those with infinite dense discontinuities.
            </p>

            <p className="text-slate-700 mb-4">
                Let <Latex>{`$(X, \\mathcal{F}, \\mu)$`}</Latex> be a measure space, where <Latex>{`$\\mathcal{F}$`}</Latex> is a <Latex>{`$\\sigma$`}</Latex>-algebra of subsets of <Latex>{`$X$`}</Latex>. A function <Latex>{`$f : X \\to \\mathbb{R}$`}</Latex> is <strong>measurable</strong> if for every Borel set <Latex>{`$B \\subseteq \\mathbb{R}$`}</Latex>, the preimage <Latex>{`$f^{-1}(B)$`}</Latex> is in <Latex>{`$\\mathcal{F}$`}</Latex>.
            </p>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl my-6 shadow-sm">
                <h5 className="font-bold text-indigo-900 mb-2">The Lebesgue Integral</h5>
                <p className="text-sm text-indigo-800 mb-3">
                    For a non-negative measurable function <Latex>{`$f : X \\to [0, \\infty]$`}</Latex>, the integral with respect to measure <Latex>{`$\\mu$`}</Latex> is defined as the supremum of integrals of simple functions bounded by <Latex>{`$f$`}</Latex>:
                </p>
                <div className="bg-white/60 py-3 rounded text-center mb-3">
                    <Latex>{`$$ \\int_X f \\, d\\mu = \\sup \\left\\{ \\int_X g \\, d\\mu \\; \\middle| \\; g \\text{ is simple }, 0 \\le g \\le f \\right\\} $$`}</Latex>
                </div>
                <p className="text-sm text-indigo-800">
                    A simple function <Latex>{`$g(x) = \\sum_{i=1}^n a_i \\mathbf{1}_{A_i}(x)$`}</Latex> consists of constant values <Latex>{`$a_i$`}</Latex> across measurable sets <Latex>{`$A_i$`}</Latex>. Its integral is simply <Latex>{`$\\sum a_i \\mu(A_i)$`}</Latex>.
                </p>
            </div>

            <p className="text-slate-700 mb-6">
                For general functions, we decompose <Latex>{`$f$`}</Latex> into positive and negative parts (<Latex>{`$f = f^+ - f^-$`}</Latex>) and integrate them separately:
                <span className="block text-center my-3 bg-slate-50 py-3 rounded">
                    <Latex>{`$$ \\int_X f \\, d\\mu = \\int_X f^+ \\, d\\mu - \\int_X f^- \\, d\\mu $$`}</Latex>
                </span>
            </p>

            <LessonAudio
                title="Integrating Horizontally"
                script="If you want to count a pile of coins, Riemann Integration is like taking them blindly, one by one, adding their values. Lebesgue integration, however, is like sorting the coins by denomination first. You put all the quarters in one pile, all the dimes in another. Then you simply multiply the value of the coin by the 'measure'—or count—of the pile. Sorting by the y-axis makes mathematically messy functions remarkably elegant to integrate."
            />

            <h3 className="text-2xl font-bold text-slate-800 mt-10 mb-4 pb-2 border-b border-slate-200">
                Dominated Convergence Theorem
            </h3>

            <p className="text-slate-700 mb-4">
                One of the crowning achievements of Lebesgue integration is how gracefully it handles limits. The Dominated Convergence Theorem provides highly permissive conditions under which we can swap the order of taking a limit and taking an integral.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl my-6">
                <h4 className="font-bold text-emerald-900 mb-3 text-lg">Theorem 1.17 (Dominated Convergence Theorem)</h4>
                <p className="text-emerald-800 mb-4 text-sm">
                    Let <Latex>{`$\\{f_n\\}$`}</Latex> be a sequence of measurable functions such that <Latex>{`$f_n \\to f$`}</Latex> almost everywhere. Suppose there exists an integrable <strong>dominating function</strong> <Latex>{`$g$`}</Latex> such that <Latex>{`$|f_n(x)| \\le g(x)$`}</Latex> for all <Latex>{`$n$`}</Latex> and almost every <Latex>{`$x$`}</Latex>. Then the limit can be passed inside the integral:
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                    <Latex>{`$$ \\lim_{n \\to \\infty} \\int_X f_n \\, d\\mu = \\int_X \\lim_{n \\to \\infty} f_n \\, d\\mu = \\int_X f \\, d\\mu $$`}</Latex>
                </div>
            </div>

            <MathNote title="Example: Pointwise Limit">
                Consider <Latex>{`$f_n(x) = x^n$`}</Latex> on the interval <Latex>{`$[0, 1]$`}</Latex>. As <Latex>{`$n \\to \\infty$`}</Latex>, <Latex>{`$f_n(x)$`}</Latex> converges to <Latex>{`$0$`}</Latex> for all <Latex>{`$x \\in [0, 1)$`}</Latex> and to <Latex>{`$1$`}</Latex> at <Latex>{`$x = 1$`}</Latex>. Because <Latex>{`$|f_n(x)| \\le 1$`}</Latex> everywhere on the interval, the constant function <Latex>{`$g(x) = 1$`}</Latex> dominates the sequence. By DCT, the limit of their integrals is the integral of their limit (which is 0).
            </MathNote>


            <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-4 pb-2 border-b border-slate-200">
                Measure-Preserving Transformations and Ergodicity
            </h3>

            <LessonAudio
                title="The Incompressible Flow of Probability"
                script="Imagine stirring a drop of ink into a cup of water. The ink gets stretched and folded into microscopic recursive ribbons, traveling everywhere in the cup. Yet, at any given moment, the total volume of ink remains exactly the same. This is a measure-preserving transformation. Ergodicity is the idea that if you stir it infinitely long, that single drop's trajectory will eventually visit every microscopic region of the cup in proportion to the cup's volume. Its average path over time perfectly matches the spatial average of the entire cup."
            />

            <p className="text-slate-700 mb-4">
                A transformation <Latex>{`$T : X \\to X$`}</Latex> on a measure space <Latex>{`$(X, \\mathcal{F}, \\mu)$`}</Latex> is said to be <strong>measure-preserving</strong> if, for every measurable set <Latex>{`$A \\in \\mathcal{F}$`}</Latex>, the measure of the set is equal to the measure of its preimage:
            </p>
            <div className="my-4 bg-slate-50 py-3 rounded text-center">
                <Latex>{`$$ \\mu(T^{-1}(A)) = \\mu(A) $$`}</Latex>
            </div>
            <p className="text-slate-700 mb-6">
                These transformations describe systems where the total measure (e.g., probability, volume, or energy) is conserved over time, an essential concept in probability theory and dynamical systems.
            </p>

            <MathNote title="Example: The Circle Rotation">
                Consider the unit circle <Latex>{`$S^1$`}</Latex> as the interval <Latex>{`$[0, 1)$`}</Latex> equipped with Lebesgue measure. Let <Latex>{`$T(x) = (x + \\alpha) \\pmod 1$`}</Latex> representing a rotation by angle <Latex>{`$\\alpha$`}</Latex>. This trivially preserves the measure because the length of an arc is unchanged simply by rotating it around the origin.
            </MathNote>

            <p className="text-slate-700 mt-8 mb-4">
                In Ergodic Theory, we study the long-term averages of dynamical systems. A transformation <Latex>{`$T$`}</Latex> is <strong>ergodic</strong> if any <Latex>{`$T$`}</Latex>-invariant set (where <Latex>{`$T^{-1}(A) = A$`}</Latex>) has a measure of either exactly 0 or exactly 1. Essentially, the system cannot be decomposed into isolated, non-interacting subsystems.
            </p>

            <div className="bg-fuchsia-50 border border-fuchsia-200 p-6 rounded-2xl my-6">
                <h4 className="font-bold text-fuchsia-900 mb-3 text-lg">Theorem 1.18 (Birkhoff’s Ergodic Theorem)</h4>
                <p className="text-fuchsia-800 mb-4 text-sm">
                    Let <Latex>{`$T : X \\to X$`}</Latex> be a measure-preserving transformation on a probability space <Latex>{`$(X, \\mathcal{F}, \\mu)$`}</Latex>, and let <Latex>{`$f : X \\to \\mathbb{R}$`}</Latex> be an integrable function. The time average of <Latex>{`$f$`}</Latex> along the orbits of <Latex>{`$T$`}</Latex> converges almost everywhere to the spatial average (expected value):
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center overflow-x-auto">
                    <Latex>{`$$ \\lim_{N \\to \\infty} \\frac{1}{N} \\sum_{n=0}^{N-1} f(T^n(x)) = \\int_X f \\, d\\mu \\quad \\text{for } \\mu\\text{-almost every } x \\in X $$`}</Latex>
                </div>
            </div>

            <p className="text-slate-700 mb-4">
                Birkhoff’s Theorem is profound: it bridges the temporal behavior of a system with its spatial properties. In statistical mechanics, this justifies replacing time averages with ensemble averages. In information theory, it underpins the analysis of data compression algorithms and the long-term behavior of stochastic Markov processes.
            </p>

        </div>
    );
}

export function MutualInformationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Mutual Information</h2>
            {/* Content will go here */}
        </div>
    );
}

export function ComplexityGeneralizationContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Complexity and Generalization</h2>
            {/* Content will go here */}
        </div>
    );
}
