"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

export interface ConceptStep {
  label: string;
  content: React.ReactNode;
}

/**
 * An interactive scrollytelling component.
 * Replaces the traditional stepper with a smooth scrolling experience.
 * The left sidebar acts as a sticky timeline, tracking the user's progress
 * as they scroll through the content blocks on the right.
 */
export default function ConceptStepper({ steps }: { steps: ConceptStep[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // We use an IntersectionObserver to detect which section is currently
    // in the main reading area of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIdx(index);
          }
        });
      },
      {
        // Trigger when the element crosses the middle 40% of the screen.
        rootMargin: "-30% 0px -40% 0px",
        threshold: 0,
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToStep = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative flex flex-col md:flex-row gap-8 lg:gap-12 pt-4 w-full">
      {/* ── Sticky Sidebar (Timeline) ── */}
      <div className="md:w-56 shrink-0 relative hidden md:block">
        <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-sm backdrop-blur-md transition-colors hover:border-[var(--accent)]/50">
          <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Concept Journey
          </h3>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-4 w-[2px] bg-[var(--border-strong)]/50 rounded-full" />
            
            <ul className="relative flex flex-col gap-6">
              {steps.map((s, i) => {
                const isActive = i === activeIdx;
                const isPast = i < activeIdx;
                
                return (
                  <li key={i} className="relative flex items-start gap-4 group cursor-pointer" onClick={() => scrollToStep(i)}>
                    <button
                      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-500 ease-out ${
                        isActive
                          ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_0_15px_rgba(var(--accent),0.4)] scale-110"
                          : isPast
                          ? "bg-[var(--accent)] text-[var(--accent-contrast)] opacity-70 group-hover:opacity-100"
                          : "bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--muted)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                      }`}
                    >
                      {isPast ? <Check size={12} strokeWidth={3} /> : i + 1}
                    </button>
                    <span 
                      className={`text-sm font-medium text-left transition-all duration-300 mt-0.5 ${
                        isActive
                          ? "text-[var(--accent)] translate-x-1"
                          : isPast
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)] group-hover:text-[var(--foreground)]"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar (Horizontal) ── */}
      <div className="md:hidden sticky top-[4.5rem] z-20 -mx-4 px-4 py-3 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-slim">
          {steps.map((s, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            return (
              <button
                key={i}
                onClick={() => scrollToStep(i)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm"
                    : isPast
                    ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {isPast ? <Check size={12} /> : <span>{i + 1}.</span>}
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrolling Content ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-24 pb-32 mt-4 md:mt-0">
        {steps.map((s, i) => {
          const isActive = activeIdx === i;
          
          return (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-index={i}
              className={`transition-all duration-700 ease-in-out relative ${
                isActive 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-40 translate-y-4 md:hover:opacity-60"
              }`}
            >
              {/* Highlight background blob behind the active section */}
              {isActive && (
                <div className="absolute -inset-x-6 -inset-y-6 -z-10 rounded-3xl bg-gradient-to-br from-[var(--accent-soft)]/40 to-transparent opacity-0 md:opacity-100 transition-opacity duration-1000" />
              )}
              
              <h2 className={`text-2xl font-bold tracking-tight mb-8 flex items-center gap-3 transition-colors duration-500 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>
                <span className="md:hidden flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm text-[var(--accent)]">
                  {i + 1}
                </span>
                {s.label}
              </h2>
              <div className="w-full">
                {s.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
