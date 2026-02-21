import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Hexagon } from 'lucide-react';

interface Subsection {
    number: string;
    title: string;
    description: string;
    href: string;
    color: string;
    comingSoon?: boolean;
}

const subsections: Subsection[] = [
    {
        number: "1.11.1",
        title: "Basic Probability Concepts",
        description: "The essentials of random variables, distributions, and expectations.",
        href: "/chapter-1/measure-theory/basic-probability",
        color: "emerald",
    },
    {
        number: "1.11.2",
        title: "Foundations of Measure Theory",
        description: "Formalizing probability through sigma-algebras and measurable spaces.",
        href: "/chapter-1/measure-theory/foundations-of-measure-theory",
        color: "cyan",
    },
    {
        number: "1.11.3",
        title: "Mutual Information",
        description: "Quantifying the dependence and information overlap between variables.",
        href: "/chapter-1/measure-theory/mutual-information",
        color: "blue",
    },
    {
        number: "1.11.4",
        title: "Complexity and Generalization",
        description: "Connecting information theory to model performance bounds.",
        href: "/chapter-1/measure-theory/complexity",
        color: "indigo",
    },
];

export default function MeasureTheoryIndex() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Hexagon className="text-emerald-600" size={32} />
                        </div>
                        <div>
                            <span className="text-emerald-600 font-semibold tracking-wider text-sm">CHAPTER 1.11</span>
                            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                                Measure Theory and Information Theory
                            </h1>
                        </div>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Delve into the mathematical foundations of probability, measure, and information content. Understand how these concepts govern the complexity and generalization of neural representations.
                    </p>
                </div>

                {/* Subsections Grid */}
                <div className="grid gap-6">
                    {subsections.map((sub) => (
                        <div
                            key={sub.number}
                            className={`block bg-white rounded-2xl p-6 border transition-all ${sub.comingSoon
                                ? 'border-slate-200 opacity-60'
                                : `border-slate-200 hover:border-${sub.color}-300 hover:shadow-lg cursor-pointer`
                                }`}
                        >
                            {!sub.comingSoon ? (
                                <Link href={sub.href} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`bg-${sub.color}-100 text-${sub.color}-700 text-xs font-bold px-3 py-1 rounded-full`}>
                                                {sub.number}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {sub.title}
                                        </h3>
                                        <p className="text-slate-500">
                                            {sub.description}
                                        </p>
                                    </div>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-${sub.color}-50 text-${sub.color}-600 group-hover:bg-${sub.color}-100`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </Link>
                            ) : (
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`bg-${sub.color}-100 text-${sub.color}-700 text-xs font-bold px-3 py-1 rounded-full`}>
                                                {sub.number}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                Coming Soon
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                            {sub.title}
                                        </h3>
                                        <p className="text-slate-500">
                                            {sub.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
