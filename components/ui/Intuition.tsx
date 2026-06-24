import { Lightbulb } from "lucide-react";
import React from "react";

/**
 * A plain-English "what this really means" box rendered before a formal
 * definition. Uses the accent palette so it's visually distinct from prose
 * but harmonises with the page theme in both light and dark modes.
 */
export default function Intuition({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3">
      <Lightbulb size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
      <p className="text-sm leading-relaxed text-[var(--foreground)]">{children}</p>
    </div>
  );
}
