"use client";

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BasicGroupConcepts, RepresentationTheory, TransformerApplications } from '@/components/content/GroupTheoryContent';
import SymmetryGroupLab from '@/components/math-viz/SymmetryGroupLab';

export default function GroupTheoryPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1.2: Group Theory and Symmetries</p>
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1.2.1: Basic Concepts */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Content */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <BasicGroupConcepts />
                        </div>
                        {/* Lab */}
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SymmetryGroupLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 1.2.2: Representation Theory */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Content */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <RepresentationTheory />
                        </div>
                        {/* Lab Placeholder / Info */}
                        <div className="flex flex-col gap-8 justify-center items-center p-8 bg-slate-100 rounded-2xl text-slate-500 border border-slate-200 border-dashed">
                            <div className="text-center p-6">
                                <h4 className="text-lg font-bold mb-2">Visualizing Representations</h4>
                                <p className="text-sm">
                                    Imagine mapping each abstract symmetry operation (like a rotation) to a concrete matrix acting on a vector space.
                                </p>
                                <div className="mt-6 font-mono text-xs bg-white p-4 rounded border">
                                    ρ(r) = [[cos θ, -sin θ], [sin θ, cos θ]]
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1.2.3: Applications to Transformers */}
                    <div className="w-full">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
                            <TransformerApplications />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
