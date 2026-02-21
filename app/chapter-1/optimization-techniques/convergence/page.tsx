import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ConvergenceAnalysisContent } from '@/components/content/OptimizationContent';
import MomentumConvergenceLab from '@/components/math-viz/MomentumConvergenceLab';

export default function ConvergenceAnalysisPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <Link
                        href="/chapter-1/optimization-techniques"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1" />
                        Back to Optimization Techniques
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Content Section (Left) */}
                    <div className="flex flex-col gap-8">
                        <ConvergenceAnalysisContent />
                    </div>

                    {/* Interactive Lab Section (Right) */}
                    <div className="flex flex-col gap-12 pt-8">
                        <div className="sticky top-8">
                            <MomentumConvergenceLab />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
