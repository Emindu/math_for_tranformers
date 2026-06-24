import React from "react";

/**
 * A deliberately small Python tokenizer + highlighter shared by the read-only
 * code block and the editable code editor. It covers the constructs used in the
 * lessons (keywords, strings, comments, numbers) without pulling in a heavy
 * highlighting library. Colours are driven by the `tok-*` classes in globals.css.
 */
const TOKENIZER =
  /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(import|from|as|def|return|if|elif|else|for|while|in|not|and|or|None|True|False|class|lambda|with|is|assert|raise|try|except|finally|pass|break|continue|yield|global|print)\b|\b(\d+\.?\d*)\b/g;

export function highlight(code: string): React.ReactNode[] {
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
