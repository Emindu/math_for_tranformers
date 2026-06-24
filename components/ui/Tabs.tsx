"use client";

import { useId, useState } from "react";

export type Tab = {
  /** Stable identifier for the tab. */
  id: string;
  /** Label shown in the tab strip. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** Panel content. Tabs with nullish content are skipped. */
  content: React.ReactNode;
};

/**
 * A small, accessible tab strip. Only the active panel is mounted, which keeps
 * interactive visualizations (canvas/3D) from initializing while hidden and
 * sizing themselves to a zero-width container.
 */
export default function Tabs({
  tabs,
  initial,
}: {
  tabs: Tab[];
  initial?: string;
}) {
  const items = tabs.filter((t) => t.content != null);
  const base = useId();
  const [active, setActive] = useState(initial ?? items[0]?.id);
  const current = items.find((t) => t.id === active) ?? items[0];

  if (!current) return null;

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-[var(--border)]">
        {items.map((t) => {
          const selected = t.id === current.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`${base}-${t.id}-tab`}
              aria-selected={selected}
              aria-controls={`${base}-${t.id}-panel`}
              onClick={() => setActive(t.id)}
              className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`${base}-${current.id}-panel`}
        aria-labelledby={`${base}-${current.id}-tab`}
        className="pt-5"
      >
        {current.content}
      </div>
    </div>
  );
}
