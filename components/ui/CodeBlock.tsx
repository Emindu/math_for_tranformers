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

  // Shared button style for the toolbar
  const btn =
    "inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-default";

  return (
    <div className="vscode-editor my-5 overflow-hidden rounded-lg border border-[#3d3d3d]" style={{ background: "#1e1e1e" }}>

      {/* ── VS Code-style tab bar ── */}
      <div
        className="flex items-center justify-between border-b border-[#3d3d3d]"
        style={{ background: "#252526" }}
      >
        {/* Active tab */}
        <div className="flex items-end overflow-hidden">
          <div
            className="flex shrink-0 items-center gap-1.5 border-r border-[#3d3d3d] border-t-2 border-t-[#4d9cd4] px-4 py-2"
            style={{ background: "#1e1e1e" }}
          >
            <span className="font-mono text-xs text-[#cccccc]">{title ?? language}</span>
            {runnable && edited && (
              <span
                title="Unsaved changes"
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "#cccccc" }}
              />
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex shrink-0 items-center gap-0.5 px-2 py-1">
          {runnable && (
            <span className="mr-2 font-mono text-[10px]" style={{ color: "#6d9bba" }}>
              Python
            </span>
          )}
          {runnable && edited && (
            <button type="button" onClick={reset} className={btn}
              style={{ color: "#9d9d9d" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2d2d2d"; (e.currentTarget as HTMLButtonElement).style.color = "#cccccc"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = "#9d9d9d"; }}
              aria-label="Reset code"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
          {runnable && (
            <button
              type="button"
              onClick={run}
              disabled={busy}
              className={btn}
              style={{ background: busy ? "#0e639c" : "#0e639c", color: "#ffffff" }}
              onMouseEnter={(e) => { if (!busy) (e.currentTarget as HTMLButtonElement).style.background = "#1177bb"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0e639c"; }}
              aria-label="Run code"
            >
              {busy ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              {phase === "loading" ? "Loading…" : phase === "running" ? "Running…" : "Run"}
            </button>
          )}
          <button
            type="button"
            onClick={copy}
            className={btn}
            style={{ color: "#9d9d9d" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#2d2d2d"; (e.currentTarget as HTMLButtonElement).style.color = "#cccccc"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = "#9d9d9d"; }}
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
          <code className="font-mono" style={{ color: "#d4d9e2" }}>{highlight(code)}</code>
        </pre>
      )}

      {/* ── Output panel ── */}
      {runnable && (busy || result) && (
        <div className="border-t border-[#3d3d3d]" style={{ background: "#1e1e1e" }}>
          <div
            className="flex items-center gap-2 border-b border-[#2d2d2d] px-4 py-1"
            style={{ background: "#252526" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: busy ? "#ffbd2e" : result?.error ? "#ff5f57" : "#28c840" }}
            />
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider" style={{ color: "#858585" }}>
              {busy ? "Running" : "Output"}
            </span>
          </div>
          <div className="px-4 py-3 font-mono text-[13px]">
            {busy ? (
              <p className="flex items-center gap-2" style={{ color: "#858585" }}>
                <Loader2 size={13} className="animate-spin" />
                {phase === "loading" ? "Loading Python runtime… (first run ~10 MB)" : "Running…"}
              </p>
            ) : result ? (
              <>
                {result.output && (
                  <pre className="m-0 whitespace-pre-wrap break-words" style={{ color: "#d4d9e2" }}>
                    {result.output.trimEnd()}
                  </pre>
                )}
                {result.error && (
                  <pre className="m-0 mt-1 whitespace-pre-wrap break-words" style={{ color: "#f14c4c" }}>
                    {result.error}
                  </pre>
                )}
                {!result.output && !result.error && (
                  <span style={{ color: "#858585" }}>(no output)</span>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
