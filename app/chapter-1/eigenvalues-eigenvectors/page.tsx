"use client";

import React from 'react';
import { EigenIntroContent, SpectralTheoremContent } from '@/components/content/EigenvaluesEigenvectors';
import EigenvalueLab from '@/components/math-viz/EigenvalueLab';
import SpectralTheoremLab from '@/components/math-viz/SpectralTheoremLab';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EigenvaluesEigenvectorsPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Geometry of Intelligence</h1>
                    <p className="text-xl text-slate-500 mt-2">Chapter 1: Representing Data as Vectors</p>
                </div>

                <div className="flex flex-col gap-24">
                    {/* Section 1: Eigenvalues */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Content */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <EigenIntroContent />
                        </div>
                        {/* Lab */}
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <EigenvalueLab />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Spectral Theorem */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                        {/* Content */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <SpectralTheoremContent />
                        </div>
                        {/* Lab */}
                        <div className="flex flex-col gap-8">
                            <div className="sticky top-8">
                                <SpectralTheoremLab />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
