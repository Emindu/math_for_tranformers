import Link from "next/link";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { sections, sectionHref, allLessons, course } from "@/lib/curriculum";

const totalMinutes = allLessons.reduce((sum, l) => sum + (l.minutes ?? 0), 0);
const firstLesson = allLessons[0];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent)]">
            {course.chapter}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {course.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--muted)]">
            {course.subtitle}. Learn it the way it actually clicks — short
            readings paired with interactive visualizations you can poke at.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={firstLesson.href}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Start learning <ArrowRight size={18} />
            </Link>
            <a
              href="#curriculum"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-strong)] px-5 py-2.5 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-3)]"
            >
              <Compass size={18} /> Browse curriculum
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--faint)]">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={15} /> {allLessons.length} lessons
            </span>
            <span>{sections.length} sections</span>
            <span>≈ {Math.round(totalMinutes / 60)} hours</span>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Curriculum
        </h2>
        <p className="mt-1 text-[var(--muted)]">
          Fourteen sections, building from vector spaces up to the full
          probabilistic picture of Transformers.
        </p>

        <ol className="mt-10 space-y-10">
          {sections.map((section) => (
            <li key={section.id}>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-[var(--accent)]">
                  {section.number}
                </span>
                <Link
                  href={sectionHref(section)}
                  className="text-xl font-semibold tracking-tight text-[var(--foreground)] hover:text-[var(--accent)]"
                >
                  {section.title}
                </Link>
              </div>
              <p className="mt-1.5 max-w-2xl text-sm text-[var(--muted)]">
                {section.description}
              </p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {section.lessons.map((lesson) => (
                  <Link
                    key={lesson.href}
                    href={lesson.href}
                    className="group flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--accent)]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center justify-between gap-2 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)]">
                        <span className="truncate">{lesson.title}</span>
                        <ArrowRight
                          size={16}
                          className="shrink-0 text-[var(--faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                        />
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
                        {lesson.blurb}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="border-t border-[var(--border)] py-10 text-center text-sm text-[var(--faint)]">
        <p>{course.title} — an interactive mathematics course.</p>
      </footer>
    </div>
  );
}
