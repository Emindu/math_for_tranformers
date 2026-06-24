"use client";

import React, { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export interface ConceptStep {
  label: string;
  content: React.ReactNode;
}

/**
 * Guides the reader through a sequence of concept steps. Each step has a short
 * label that appears in the progress indicator; completed steps show a check mark
 * and are clickable so you can jump back. Navigation is Prev / Next.
 */
export default function ConceptStepper({ steps }: { steps: ConceptStep[] }) {
  const [idx, setIdx] = useState(0);
  const total = steps.length;
  const step = steps[idx];

  return (
    <div>
      {/* ── Progress indicator ── */}
      <div className="mb-5">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setIdx(i)}
                aria-label={`Go to step ${i + 1}: ${s.label}`}
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  i === idx
                    ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm"
                    : i < idx
                    ? "cursor-pointer bg-[var(--accent)] text-[var(--accent-contrast)] opacity-60 hover:opacity-100"
                    : "cursor-pointer border border-[var(--border-strong)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {i < idx ? <Check size={12} /> : i + 1}
              </button>
              {i < total - 1 && (
                <div
                  className="h-px flex-1 transition-colors"
                  style={{ background: i < idx ? "var(--accent)" : "var(--border)" }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
          {step.label}
          <span className="ml-2 text-sm font-normal text-[var(--muted)]">
            {idx + 1} / {total}
          </span>
        </p>
      </div>

      {/* ── Step content ── */}
      <div className="min-h-48">{step.content}</div>

      {/* ── Navigation ── */}
      <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-3)] hover:text-[var(--foreground)] disabled:cursor-default disabled:opacity-30"
        >
          <ChevronLeft size={14} /> Back
        </button>

        {idx < total - 1 ? (
          <button
            onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm text-[var(--accent-contrast)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <Check size={14} /> Complete
          </span>
        )}
      </div>
    </div>
  );
}
