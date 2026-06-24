"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Play, RotateCcw } from "lucide-react";
import { isPyodideReady, runPython, type RunResult } from "@/lib/pyodide";
import { highlight } from "./highlight";
import CodeEditor from "./CodeEditor";

export default function CodeBlock({
  code,
  language = "python",
  title,
  runnable = false,
}: {
  code: string;
  language?: string;
  title?: string;
  runnable?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState(code);
  const [result, setResult] = useState<RunResult | null>(null);
  const [phase, setPhase] = useState<"idle" | "loading" | "running">("idle");

  const busy = phase !== "idle";
  const edited = value !== code;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  const run = async () => {
    if (busy) return;
    setResult(null);
    setPhase(isPyodideReady() ? "running" : "loading");
    const res = await runPython(value);
    setResult(res);
    setPhase("idle");
  };

  const reset = () => { setValue(code); setResult(null); };

  const btn =
    "inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-default";

  return (
    <div className="my-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">

      {/* ── Tab bar ── */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]">
        {/* Active tab */}
        <div className="flex items-end overflow-hidden">
          <div className="flex shrink-0 items-center gap-1.5 border-r border-[var(--border)] border-t-2 border-t-[var(--accent)] px-4 py-2 bg-[var(--surface-2)]">
            <span className="font-mono text-xs text-[var(--foreground)]">{title ?? language}</span>
            {runnable && edited && (
              <span
                title="Unsaved changes"
                className="inline-block h-2 w-2 rounded-full bg-[var(--muted)]"
              />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex shrink-0 items-center gap-0.5 px-2 py-1">
          {runnable && (
            <span className="mr-2 font-mono text-[10px] text-[var(--accent)]">
              Python
            </span>
          )}
          {runnable && edited && (
            <button type="button" onClick={reset} className={`${btn} text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]`} aria-label="Reset code">
              <RotateCcw size={12} /> Reset
            </button>
          )}
          {runnable && (
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className={`${btn} bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]`}
              aria-label="Run code"
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              {phase === "loading" ? "Loading…" : phase === "running" ? "Running…" : "Run"}
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            className={`${btn} text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]`}
            aria-label="Copy code"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Code area ── */}
      {runnable ? (
        <CodeEditor value={value} onChange={setValue} ariaLabel="Editable Python code" />
      ) : (
        <pre
          className="vscode-scrollbar overflow-x-auto"
          style={{ margin: 0, padding: "16px", fontSize: "13px", lineHeight: "20px" }}
        >
          <code className="font-mono text-[var(--foreground)]">{highlight(code)}</code>
        </pre>
      )}

      {/* ── Output panel ── */}
      {runnable && (busy || result) && (
        <div className="border-t border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-1 bg-[var(--surface)]">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: busy ? "#ffbd2e" : result?.error ? "#ff5f57" : "#28c840" }}
            />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
              {busy ? "Running" : "Output"}
            </span>
          </div>
          <div className="px-4 py-3 font-mono text-[13px]">
            {busy ? (
              <p className="flex items-center gap-2 text-[var(--muted)]">
                <Loader2 size={13} className="animate-spin" />
                {phase === "loading" ? "Loading Python runtime… (first run ~10 MB)" : "Running…"}
              </p>
            ) : result ? (
              <>
                {result.output && (
                  <pre className="m-0 whitespace-pre-wrap break-words text-[var(--foreground)]">
                    {result.output.trimEnd()}
                  </pre>
                )}
                {result.error && (
                  <pre className="m-0 mt-1 whitespace-pre-wrap break-words text-red-500">
                    {result.error}
                  </pre>
                )}
                {!result.output && !result.error && (
                  <span className="text-[var(--faint)]">(no output)</span>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
