"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Menu,
  X,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import {
  sections,
  sectionHref,
  findLesson,
  findSectionByOverview,
  normalize,
  course,
} from "@/lib/curriculum";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const path = normalize(pathname || "/");
  const isHome = path === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore the saved desktop sidebar state.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("gi-sidebar") === "collapsed");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("gi-sidebar", next ? "collapsed" : "open");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 h-14 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur">
        <div className="flex h-full items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)]"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            onClick={toggleCollapsed}
            className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white">
              <Sparkles size={16} />
            </span>
            <span className="font-semibold tracking-tight text-[var(--foreground)] hidden sm:inline">
              Geometry of Intelligence
            </span>
          </Link>

          <div className="hidden md:block min-w-0 flex-1">
            <Breadcrumbs path={path} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex w-full">
        {/* Sidebar — desktop */}
        {!collapsed && (
          <aside className="hidden lg:block w-72 shrink-0 border-r border-[var(--border)]">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto scroll-slim px-3 py-6">
              <Nav path={path} />
            </div>
          </aside>
        )}

        {/* Sidebar — mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto scroll-slim bg-[var(--surface)] px-3 py-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between px-2">
                <span className="font-semibold text-[var(--foreground)]">{course.chapter}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)]"
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
              <Nav path={path} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className={isHome ? "min-w-0 flex-1" : "min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12"}>
          {children}
        </main>
      </div>
    </div>
  );
}

function Nav({ path }: { path: string }) {
  const activeLoc = findLesson(path);
  const activeSectionId =
    activeLoc?.section.id ?? findSectionByOverview(path)?.id;

  return (
    <nav className="space-y-5">
      <div className="px-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--faint)]">
          {course.chapter}
        </p>
        <p className="mt-0.5 text-sm font-medium text-[var(--muted)]">{course.title}</p>
      </div>

      {sections.map((section) => {
        const sectionActive = section.id === activeSectionId;
        return (
          <div key={section.id}>
            <Link
              href={sectionHref(section)}
              className={`flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm font-semibold transition-colors ${
                sectionActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              <span className="text-[11px] font-mono text-[var(--faint)]">
                {section.number}
              </span>
              <span>{section.title}</span>
            </Link>
            <ul className="mt-1 space-y-0.5 border-l border-[var(--border)] pl-3 ml-3">
              {section.lessons.map((lesson) => {
                const active = normalize(lesson.href) === path;
                return (
                  <li key={lesson.href}>
                    <Link
                      href={lesson.href}
                      className={`block rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors ${
                        active
                          ? "bg-[var(--accent-soft)] font-medium text-[var(--accent)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Breadcrumbs({ path }: { path: string }) {
  const loc = findLesson(path);
  const overviewSection = findSectionByOverview(path);

  const crumbs: { label: string; href?: string }[] = [];
  if (loc) {
    crumbs.push({ label: loc.section.title, href: sectionHref(loc.section) });
    crumbs.push({ label: loc.lesson.title });
  } else if (overviewSection) {
    crumbs.push({ label: overviewSection.title });
  }

  if (crumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 truncate text-sm text-[var(--muted)]">
      <ChevronRight size={14} className="text-[var(--faint)] shrink-0" />
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5 truncate">
          {c.href ? (
            <Link href={c.href} className="hover:text-[var(--accent)] truncate">
              {c.label}
            </Link>
          ) : (
            <span className="truncate text-[var(--foreground)]">{c.label}</span>
          )}
          {i < crumbs.length - 1 && (
            <ChevronRight size={14} className="text-[var(--faint)] shrink-0" />
          )}
        </span>
      ))}
    </div>
  );
}
