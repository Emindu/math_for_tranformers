"use client";

import React from 'react';
import { ChevronRight, Database, ChevronLeft, Hexagon } from 'lucide-react';
import Link from 'next/link';

type Subsection = {
    number: string;
    title: string;
    description: string;
    href: string;
    color: string;
    comingSoon?: boolean;
};

const subsections: Subsection[] = [
    {
        number: "1.8.1",
        title: "Embedding Spaces and Manifolds",
        description: "Viewing transformer embeddings as points moving on high-dimensional manifolds.",
        href: "/chapter-1/geometric-structures/embedding-spaces",
        color: "fuchsia",
    },
    {
        number: "1.8.2",
        title: "Symmetries and Transformations",
        description: "How structural symmetries shape the geometric properties of transformer layers.",
        href: "/chapter-1/geometric-structures/symmetries",
        color: "rose",
    },
    {
        number: "1.8.3",
        title: "Implications for Model Design",
        description: "Leveraging geometric insights for designing better model architectures.",
        href: "/chapter-1/geometric-structures/model-design",
        color: "pink",
    },
];

export default function GeometricStructuresPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-fuchsia-600 mb-8 transition-colors">
                    <ChevronLeft size={16} /> Back to Table of Contents
                </Link>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-12">
                    <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center mb-6">
                        <Hexagon className="text-fuchsia-600" size={32} />
                    </div>

                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                        1.8 Geometric Structures in Transformers
                    </h1>

                    <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
                        Uncover the hidden geometry within transformer models. We examine how embedding spaces act as manifolds and how symmetries
                        inform the flow of data through architectural transformations.
                    </p>
                </div>

                <div className="space-y-6">
                    {subsections.map((section) => (
                        <Link
                            href={section.comingSoon ? "#" : section.href}
                            key={section.number}
                            className={`block bg-white rounded-2xl p-6 border border-slate-200 transition-all ${section.comingSoon
                                ? 'opacity-50 cursor-not-allowed'
                                : `hover:shadow-lg hover:border-${section.color}-200 group`
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`bg-${section.color}-100 text-${section.color}-700 text-sm font-bold px-3 py-1 rounded-full`}>
                                        {section.number}
                                    </span>
                                    {section.comingSoon && (
                                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                                {!section.comingSoon && (
                                    <ChevronRight className={`text-slate-400 group-hover:text-${section.color}-600 transition-colors`} />
                                )}
                            </div>

                            <h2 className={`text-2xl font-bold text-slate-900 mb-2 ${!section.comingSoon && `group-hover:text-${section.color}-600`} transition-colors`}>
                                {section.title}
                            </h2>
                            <p className="text-slate-500">
                                {section.description}
                            </p>
                        </Link>
                    ))}
                </div >
            </div >
        </main >
    );
}
