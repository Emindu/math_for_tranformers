import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { MeasureTheoryFoundationsContent } from '@/components/content/MeasureTheoryContent';
import MeasureTheoryLab from '@/components/math-viz/MeasureTheoryLab';

export const metadata = {
    title: 'Foundations of Measure Theory - VisTransformer',
    description: 'Learn about Lebesgue Integration, Dominated Convergence, and Measure-Preserving Transformations.',
};

export default function FoundationsOfMeasureTheoryPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/chapter-1/measure-theory"
                        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Measure Theory
                    </Link>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Theoretical Content */}
                    <div className="relative">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                            <div className="inline-block px-3 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-sm font-semibold mb-6">
                                Chapter 1.11.2
                            </div>
                            <MeasureTheoryFoundationsContent />
                        </div>
                    </div>

                    {/* Right Column: Interactive Lab */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-6">
                        <MeasureTheoryLab />
                    </div>

                </div>
            </div>
        </div>
    );
}
