"use client";

import { useRef, useState } from "react";
import { highlight } from "./highlight";

/**
 * A VS Code-styled code editor: a transparent <textarea> sits over a
 * syntax-highlighted <pre>, with a line-number gutter to the left. Both layers
 * share an integer 20 px line-height so the caret and selection stay pixel-
 * aligned with the rendered tokens. Scroll position is mirrored from the
 * textarea to the pre and gutter. Tab inserts 4 spaces.
 */
export default function CodeEditor({
  value,
  onChange,
  ariaLabel = "Editable code",
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
}) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [activeLine, setActiveLine] = useState(0);

  const syncScroll = () => {
    const ta = taRef.current;
    const pre = preRef.current;
    const gutter = gutterRef.current;
    if (ta && pre) {
      pre.scrollLeft = ta.scrollLeft;
      pre.scrollTop = ta.scrollTop;
    }
    if (ta && gutter) {
      gutter.scrollTop = ta.scrollTop;
    }
  };

  const updateActiveLine = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const line = ta.value.slice(0, ta.selectionStart).split("\n").length - 1;
    setActiveLine(line);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;

    // ── Tab: insert 4 spaces ──────────────────────────────────────────────
    if (e.key === "Tab") {
      e.preventDefault();
      const next = value.slice(0, start) + "    " + value.slice(end);
      onChange(next);
      const pos = start + 4;
      setActiveLine(next.slice(0, pos).split("\n").length - 1);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = pos; });
      return;
    }

    // ── Enter: carry forward indentation; +4 after a colon ───────────────
    if (e.key === "Enter") {
      e.preventDefault();
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const currentLine = before.slice(lineStart);
      const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";
      const extra = currentLine.trimEnd().endsWith(":") ? "    " : "";
      const insert = "\n" + indent + extra;
      const next = value.slice(0, start) + insert + value.slice(end);
      onChange(next);
      const pos = start + insert.length;
      setActiveLine(next.slice(0, pos).split("\n").length - 1);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = pos; });
      return;
    }

    // ── Backspace: remove up to 4 spaces when in leading whitespace ───────
    if (e.key === "Backspace" && start === end && start > 0) {
      const before = value.slice(0, start);
      const lineStart = before.lastIndexOf("\n") + 1;
      const linePrefix = before.slice(lineStart);
      if (linePrefix.length > 0 && /^ +$/.test(linePrefix)) {
        e.preventDefault();
        const col = linePrefix.length;
        const toRemove = col % 4 === 0 ? 4 : col % 4;
        const next = value.slice(0, start - toRemove) + value.slice(start);
        onChange(next);
        const pos = start - toRemove;
        setActiveLine(next.slice(0, pos).split("\n").length - 1);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = pos; });
        return;
      }
    }
  };

  const lines = value.split("\n");
  const lineCount = lines.length;
  // Gutter width: enough for the digit count plus left/right padding.
  const digits = String(lineCount).length;
  const gutterWidth = digits * 8 + 32; // ~8 px per digit + 32 px padding

  return (
    <div
      className="flex overflow-hidden font-mono bg-[var(--surface-2)]"
      style={{ fontSize: "13px", lineHeight: "20px" }}
    >
      {/* ── Line-number gutter ── */}
      <div
        ref={gutterRef}
        aria-hidden
        className="select-none overflow-hidden border-r border-[var(--border)] bg-[var(--surface-2)]"
        style={{
          width: gutterWidth,
          flexShrink: 0,
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingRight: "12px",
          paddingLeft: "8px",
          textAlign: "right",
        }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div
            key={i}
            className={i === activeLine ? "text-[var(--foreground)]" : "text-[var(--faint)]"}
            style={{ lineHeight: "20px" }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* ── Editor area (pre + textarea overlay) ── */}
      <div className="relative min-w-0 flex-1">
        {/* Active-line background */}
        <div
          aria-hidden
          className="bg-[var(--surface-3)]"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 16 + activeLine * 20,
            height: 20,
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Syntax-highlighted mirror */}
        <pre
          ref={preRef}
          aria-hidden
          className="m-0 overflow-hidden whitespace-pre bg-transparent"
          style={{
            fontSize: "13px",
            lineHeight: "20px",
            tabSize: 4,
            padding: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <code className="font-mono text-[var(--foreground)]">
            {highlight(value + "\n")}
          </code>
        </pre>

        {/* Transparent textarea — provides caret, selection, and input */}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => { onChange(e.target.value); updateActiveLine(e); }}
          onKeyDown={onKeyDown}
          onKeyUp={updateActiveLine}
          onClick={updateActiveLine}
          onFocus={updateActiveLine}
          onScroll={syncScroll}
          wrap="off"
          spellCheck={false}
          aria-label={ariaLabel}
          className="vscode-scrollbar absolute inset-0 m-0 resize-none overflow-auto whitespace-pre border-0 bg-transparent text-transparent outline-none caret-[var(--foreground)]"
          style={{
            fontFamily: "inherit",
            fontSize: "13px",
            lineHeight: "20px",
            tabSize: 4,
            padding: "16px",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
