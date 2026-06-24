"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * A lightweight, dependency-free code block with theme-aware Python syntax
 * highlighting and a copy button. The tokenizer is deliberately small — it
 * covers the constructs used in the lessons (keywords, strings, comments,
 * numbers) without pulling in a heavy highlighting library.
 */
const TOKENIZER =
  /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(import|from|as|def|return|if|elif|else|for|while|in|not|and|or|None|True|False|class|lambda|with|is|assert|raise|try|except|finally|pass|break|continue|yield|global|print)\b|\b(\d+\.?\d*)\b/g;

function highlight(code: string) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  TOKENIZER.lastIndex = 0;
  while ((m = TOKENIZER.exec(code)) !== null) {
    if (m.index > last) nodes.push(code.slice(last, m.index));
    const [full, comment, str, keyword, number] = m;
    const cls = comment
      ? "tok-comment"
      : str
        ? "tok-string"
        : keyword
          ? "tok-keyword"
          : number
            ? "tok-number"
            : "";
    nodes.push(
      <span key={key++} className={cls}>
        {full}
      </span>
    );
    last = m.index + full.length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

export default function CodeBlock({
  code,
  language = "python",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--code-bg)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2">
        <span className="font-mono text-xs text-[var(--muted)]">
          {title ?? language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)] transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed scroll-slim">
        <code className="font-mono text-[var(--code-fg)]">{highlight(code)}</code>
      </pre>
    </div>
  );
}
