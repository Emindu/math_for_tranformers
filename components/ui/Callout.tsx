import { Lightbulb } from "lucide-react";

/**
 * A themed "why this matters" aside used throughout the lessons. Adapts to dark
 * mode via design tokens, replacing the old hard-coded indigo-50 boxes.
 */
export default function Callout({
  title = "Why this matters for Transformers",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-8 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-5">
      <p className="mb-2 flex items-center gap-2 font-semibold text-[var(--accent)]">
        <Lightbulb size={16} /> {title}
      </p>
      <div className="text-sm leading-relaxed text-[var(--foreground)]">
        {children}
      </div>
    </aside>
  );
}
