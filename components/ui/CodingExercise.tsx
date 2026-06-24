"use client";

import { useState } from "react";
import { Check, ChevronDown, Loader2, Play, RotateCcw, X } from "lucide-react";
import CodeEditor from "./CodeEditor";
import { isPyodideReady, runPythonChecks, type CheckOutcome } from "@/lib/pyodide";

export type CodingExerciseProps = {
  title?: string;
  /** Task description, rendered above the editor. */
  prompt: React.ReactNode;
  /** Initial code shown in the editor. */
  starterCode: string;
  /**
   * Python block of `_check("name", lambda: <expr>)` calls run against the
   * learner's code. Each lambda is evaluated in a try/except so a single
   * failure (or a missing function) marks just that check as failed.
   */
  checks: string;
  /** Optional reference solution the learner can reveal. */
  solution?: string;
  /** Drop the outer card chrome (border/background/padding) when embedded. */
  bare?: boolean;
};

/**
 * An interactive coding exercise: the learner edits Python in the browser and
 * presses "Run tests" to grade their code against hidden checks (executed via
 * Pyodide / WebAssembly). Each check reports pass/fail with a message.
 */
export default function CodingExercise({
  title = "Coding exercise",
  prompt,
  starterCode,
  checks,
  solution,
  bare = false,
}: CodingExerciseProps) {
  const [value, setValue] = useState(starterCode);
  const [outcomes, setOutcomes] = useState<CheckOutcome[] | null>(null);
  const [stdout, setStdout] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "running">("idle");
  const [showSolution, setShowSolution] = useState(false);

  const busy = phase !== "idle";
  const edited = value !== starterCode;
  const passed = outcomes ? outcomes.filter((o) => o.passed).length : 0;
  const total = outcomes?.length ?? 0;
  const allPass = outcomes !== null && total > 0 && passed === total;

  const runTests = async () => {
    if (busy) return;
    setError(null);
    setOutcomes(null);
    setStdout("");
    setPhase(isPyodideReady() ? "running" : "loading");
    const res = await runPythonChecks(value, checks);
    setPhase("idle");
    setError(res.error ?? null);
    setOutcomes(res.outcomes);
    setStdout(res.stdout.trimEnd());
  };

  const reset = () => {
    setValue(starterCode);
    setOutcomes(null);
    setStdout("");
    setError(null);
  };

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-default";

  return (
    <section
      className={
        bare ? "" : "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
      }
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        {outcomes !== null && !error && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
              allPass
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-[var(--accent-soft)] text-[var(--accent)]"
            }`}
          >
            {passed} / {total} passing
          </span>
        )}
      </div>

      <div className="mb-4 text-sm leading-relaxed text-[var(--muted)]">{prompt}</div>

      <div className="overflow-hidden rounded-lg border border-[#3d3d3d]" style={{ background: "#1e1e1e" }}>
        {/* VS Code-style tab bar */}
        <div
          className="flex items-center justify-between border-b border-[#3d3d3d]"
          style={{ background: "#252526" }}
        >
          <div className="flex items-end">
            <div
              className="flex items-center gap-1.5 border-r border-[#3d3d3d] border-t-2 border-t-[#4d9cd4] px-4 py-2"
              style={{ background: "#1e1e1e" }}
            >
              <span className="font-mono text-xs text-[#cccccc]">solution.py</span>
              {edited && (
                <span
                  title="Unsaved changes"
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: "#cccccc" }}
                />
              )}
            </div>
          </div>
          <span className="px-3 font-mono text-[10px]" style={{ color: "#6d9bba" }}>Python</span>
        </div>
        <CodeEditor value={value} onChange={setValue} ariaLabel="Your solution" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runTests}
          disabled={busy}
          className={`${btn} border-transparent bg-[var(--accent)] text-[var(--accent-contrast)] hover:bg-[var(--accent-hover)]`}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {phase === "loading" ? "Loading…" : phase === "running" ? "Running…" : "Run tests"}
        </button>
        {edited && (
          <button
            type="button"
            onClick={reset}
            className={`${btn} border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]`}
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
        {solution && (
          <button
            type="button"
            onClick={() => setShowSolution((s) => !s)}
            className={`${btn} border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]`}
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${showSolution ? "rotate-180" : ""}`}
            />
            {showSolution ? "Hide solution" : "Show solution"}
          </button>
        )}
      </div>

      {phase === "loading" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 size={14} className="animate-spin" />
          Loading Python runtime… (first run downloads ~10 MB)
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
          <p className="mb-1 text-sm font-medium text-rose-600">Your code raised an error:</p>
          <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] text-rose-600 scroll-slim">
            {error}
          </pre>
        </div>
      )}

      {outcomes && outcomes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {outcomes.map((o, i) => (
            <li
              key={i}
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                o.passed
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-rose-500/40 bg-rose-500/5"
              }`}
            >
              {o.passed ? (
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              ) : (
                <X size={16} className="mt-0.5 shrink-0 text-rose-500" />
              )}
              <span className="min-w-0">
                <span className="text-[var(--foreground)]">{o.name}</span>
                {!o.passed && o.detail && (
                  <span className="block font-mono text-xs text-rose-600">{o.detail}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {allPass && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
          <Check size={16} /> All tests passing — nice work!
        </p>
      )}

      {stdout && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--faint)]">
            Your output
          </p>
          <pre
            className="vscode-scrollbar m-0 overflow-x-auto rounded-lg px-4 py-3 font-mono text-[13px]"
            style={{ background: "#1e1e1e", color: "#d4d9e2", border: "1px solid #3d3d3d" }}
          >
            {stdout}
          </pre>
        </div>
      )}

      {solution && showSolution && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--faint)]">
            Reference solution
          </p>
          <pre
            className="vscode-editor vscode-scrollbar m-0 overflow-x-auto rounded-lg px-4 py-3 font-mono text-[13px]"
            style={{ background: "#1e1e1e", color: "#d4d9e2", border: "1px solid #3d3d3d" }}
          >
            {solution}
          </pre>
        </div>
      )}
    </section>
  );
}
