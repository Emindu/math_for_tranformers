"use client";

import React from 'react';
import { ChevronLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';

const subchapters = [
    {
        number: "1.3.1",
        title: "Definition of Metric Spaces",
        description: "Metric axioms, distance functions, Euclidean & Manhattan & cosine metrics, convergence, Cauchy sequences, and completeness.",
        href: "/chapter-1/metric-spaces/definition",
        color: "teal",
        bgClass: "bg-teal-100 text-teal-700",
        hoverClass: "hover:border-teal-200",
        textClass: "text-teal-600",
    },
    {
        number: "1.3.2",
        title: "Topology of Metric Spaces",
        description: "Open and closed sets, ε-δ continuity, compactness, Heine–Borel theorem, and applications in ML stability and generalization.",
        href: "/chapter-1/metric-spaces/topology",
        color: "cyan",
        bgClass: "bg-cyan-100 text-cyan-700",
        hoverClass: "hover:border-cyan-200",
        textClass: "text-cyan-600",
    },
    {
        number: "1.3.3",
        title: "Mappings Between Metric Spaces",
        description: "Isometries, contraction mappings, Banach fixed-point theorem, and applications to optimization, attention mechanisms, and RNN stability.",
        href: "/chapter-1/metric-spaces/mappings",
        color: "indigo",
        bgClass: "bg-indigo-100 text-indigo-700",
        hoverClass: "hover:border-indigo-200",
        textClass: "text-indigo-600",
    },
];

export default function MetricSpacesPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.3: Metric Spaces and Topological Preliminaries</p>
                    <p className="text-slate-600 mt-4 max-w-2xl">
                        Metric spaces provide the mathematical framework for measuring distances and
                        understanding convergence. In this chapter, we explore distance functions,
                        topological structure, and mappings that are fundamental to transformer architectures.
                    </p>
                </div>

                {/* Subchapter Cards */}
                <div className="grid md:grid-cols-1 gap-6">
                    {subchapters.map((ch) => (
                        <Link
                            key={ch.number}
                            href={ch.href}
                            className={`group block bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl ${ch.hoverClass} transition-all`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`${ch.bgClass} text-xs font-bold px-3 py-1 rounded-full`}>
                                    Chapter {ch.number}
                                </span>
                                <MoveRight className={`text-slate-400 group-hover:${ch.textClass} group-hover:translate-x-1 transition-all`} size={20} />
                            </div>
                            <h3 className={`text-xl font-bold text-slate-900 mb-2 group-hover:${ch.textClass} transition-colors`}>
                                {ch.title}
                            </h3>
                            <p className="text-slate-500 text-sm mb-4">
                                {ch.description}
                            </p>
                            <div className={`flex items-center gap-2 text-sm ${ch.textClass} font-medium`}>
                                Start Chapter
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
