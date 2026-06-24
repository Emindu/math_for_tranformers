"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { findLesson, normalize, sectionHref } from "@/lib/curriculum";

type Props = {
  children: React.ReactNode;
  /** "wide" (default) fits interactive visualizations; "prose" is text-only. */
  width?: "wide" | "prose";
};

/**
 * Shared scaffolding for a lesson page. Derives the title, section, estimated
 * time, and previous/next links from the curriculum based on the current URL,
 * so individual pages only supply their content.
 */
export default function LessonLayout({ children, width = "wide" }: Props) {
  const pathname = usePathname();
  const loc = findLesson(normalize(pathname || "/"));

  const maxW = width === "prose" ? "max-w-3xl" : "max-w-5xl";

  return (
    <article className={`mx-auto ${maxW}`}>
      {loc && (
        <header className="mb-8 border-b border-[var(--border)] pb-6">
          <Link
            href={sectionHref(loc.section)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            {loc.section.number} · {loc.section.title}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {loc.lesson.title}
          </h1>
          <p className="mt-2 text-[var(--muted)]">{loc.lesson.blurb}</p>
          {loc.lesson.minutes && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--faint)]">
              <Clock size={14} /> {loc.lesson.minutes} min
            </p>
          )}
        </header>
      )}

      {children}

      {loc && (
        <nav className="mt-16 grid gap-3 border-t border-[var(--border)] pt-8 sm:grid-cols-2">
          {loc.prev ? (
            <Link
              href={loc.prev.href}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent)]"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--faint)]">
                <ArrowLeft size={14} /> Previous
              </span>
              <span className="mt-1 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {loc.prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {loc.next && (
            <Link
              href={loc.next.href}
              className="group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right transition-colors hover:border-[var(--accent)] sm:items-end"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--faint)]">
                Next <ArrowRight size={14} />
              </span>
              <span className="mt-1 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {loc.next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
