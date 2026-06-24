"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { findSectionByOverview, normalize } from "@/lib/curriculum";

/**
 * Section overview page: a consistent header plus a generated list of the
 * section's lessons. Driven entirely by the curriculum and the current URL.
 * Falls back to rendering nothing extra if the route isn't a known overview.
 */
export default function SectionLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const section = findSectionByOverview(normalize(pathname || "/"));

  if (!section) return <>{children}</>;

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          {section.number} · Section overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {section.title}
        </h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{section.description}</p>
      </header>

      {children}

      <ol className="space-y-3">
        {section.lessons.map((lesson, i) => (
          <li key={lesson.href}>
            <Link
              href={lesson.href}
              className="group flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {lesson.title}
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-[var(--faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  />
                </span>
                <span className="mt-1 block text-sm text-[var(--muted)]">
                  {lesson.blurb}
                </span>
                {lesson.minutes && (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--faint)]">
                    <Clock size={12} /> {lesson.minutes} min
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
