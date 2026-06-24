import React from 'react';
import { KolmogorovComplexityContent, GeneralizationBoundsContent } from '@/components/content/ComplexityGeneralizationContent';
import KolmogorovComplexityLab from '@/components/math-viz/KolmogorovComplexityLab';
import GeneralizationBoundsLab from '@/components/math-viz/GeneralizationBoundsLab';

// GitHub Pages serves the app under a sub-path; prefix internal links with it.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ComplexityGeneralizationPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-0 lg:gap-8">
                    {/* Left Column: Theoretical Content */}
                    <div className="py-12 px-6 lg:px-12 xl:px-20 h-[100vh] overflow-y-auto hide-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-24 pb-32 pt-8">

                            {/* Section 1: Kolmogorov Complexity */}
                            <section className="scroll-mt-12">
                                <KolmogorovComplexityContent />
                            </section>

                            {/* Section 2: Generalization Bounds */}
                            <section className="scroll-mt-12">
                                <GeneralizationBoundsContent />
                            </section>

                            <div className="pt-12 mb-8 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                    <a href={`${basePath}/chapter-1/measure-theory/mutual-information`} className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2">
                                        &larr; Previous
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Mathematical Visualizations */}
                    <div className="bg-slate-50 lg:h-[100vh] lg:sticky lg:top-0 hidden lg:flex flex-col border-l border-slate-200">
                        <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
                            <div className="w-full max-w-2xl mx-auto space-y-12 pb-32 pt-8">

                                {/* Lab 1: Compressibility Simulator for Kolmogorov Complexity */}
                                <div className="aspect-square lg:aspect-auto lg:h-[calc(100vh-8rem)] min-h-[600px] flex items-center">
                                    <div className="w-full h-full shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-indigo-500/10">
                                        <KolmogorovComplexityLab />
                                    </div>
                                </div>

                                {/* Lab 2: Generalization Bounds & PAC Framework */}
                                <div className="aspect-square lg:aspect-auto lg:h-[calc(100vh-8rem)] min-h-[600px] flex items-center">
                                    <div className="w-full h-full shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-rose-500/10">
                                        <GeneralizationBoundsLab />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Inline display for small screens */}
                    <div className="lg:hidden px-6 pb-24 space-y-12">
                        <div className="w-full shadow-2xl rounded-3xl overflow-hidden">
                            <KolmogorovComplexityLab />
                        </div>
                        <div className="w-full shadow-2xl rounded-3xl overflow-hidden">
                            <GeneralizationBoundsLab />
                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
            .hide-scrollbar::-webkit-scrollbar {
                display: none;
                }
            .hide-scrollbar {
                -ms-overflow-style: none;
            scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
