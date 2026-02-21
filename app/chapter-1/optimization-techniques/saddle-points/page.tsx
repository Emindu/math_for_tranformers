import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SaddlePointsContent } from '@/components/content/OptimizationContent';
import SaddlePointsLab from '@/components/math-viz/SaddlePointsLab';

export default function SaddlePointsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
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
                        <SaddlePointsContent />
                    </div>

                    {/* Interactive Lab Section (Right) */}
                    <div className="flex flex-col gap-12 pt-8">
                        <div className="sticky top-8">
                            <SaddlePointsLab />
                        </div>
                    </div>
                </div>

                {/* Next Section Navigation */}
                <div className="mt-16 flex justify-end border-t border-slate-200 pt-8">
                    <Link
                        href="/chapter-1/optimization-techniques/convergence"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
                    >
                        Next: 1.10.3 Convergence Analysis
                        <ChevronRight size={20} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
