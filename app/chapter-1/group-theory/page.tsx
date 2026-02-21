"use client";

import React from 'react';
import { ChevronLeft, MoveRight } from 'lucide-react';
import Link from 'next/link';

const subchapters = [
    {
        number: "1.2.1",
        title: "Basic Concepts of Group Theory",
        description: "Group axioms, subgroups, cosets, Lagrange's theorem, quotient groups, and group homomorphisms with interactive visualizations.",
        href: "/chapter-1/group-theory/basic-concepts",
        color: "pink",
        bgClass: "bg-pink-100 text-pink-700",
        hoverClass: "hover:border-pink-200",
        textClass: "text-pink-600",
    },
    {
        number: "1.2.2",
        title: "Representation Theory of Finite Groups",
        description: "Group representations, cyclic groups, character theory, orthogonality relations, and their connections to geometry and physics.",
        href: "/chapter-1/group-theory/representation-theory",
        color: "violet",
        bgClass: "bg-violet-100 text-violet-700",
        hoverClass: "hover:border-violet-200",
        textClass: "text-violet-600",
    },
    {
        number: "1.2.3",
        title: "Applications to Transformers",
        description: "How group theory connects to invariance and equivariance in transformers — positional encodings, equivariant self-attention, and weight constraints.",
        href: "/chapter-1/group-theory/applications",
        color: "amber",
        bgClass: "bg-amber-100 text-amber-700",
        hoverClass: "hover:border-amber-200",
        textClass: "text-amber-600",
    },
];

export default function GroupTheoryPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.2: Group Theory and Symmetries</p>
                    <p className="text-slate-600 mt-4 max-w-2xl">
                        Group theory provides the mathematical framework for understanding symmetry.
                        In this chapter, we explore how algebraic structures power modern AI architectures,
                        from basic group axioms to equivariant transformer networks.
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
