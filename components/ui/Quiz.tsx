"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

export type QuizQuestion = {
  /** Question prompt. May contain inline LaTeX using $...$. */
  question: string;
  /** Answer options. May contain inline LaTeX. */
  options: string[];
  /** Index into `options` of the correct answer. */
  answer: number;
  /** Optional explanation shown after answering. May contain LaTeX. */
  explanation?: string;
};

/**
 * A self-contained multiple-choice quiz. Each question gives immediate
 * feedback and an optional explanation; a running score is shown at the end.
 * Fully data-driven, so any lesson can drop one in with its own questions.
 */
export default function Quiz({
  questions,
  title = "Check your understanding",
  bare = false,
}: {
  questions: QuizQuestion[];
  title?: string;
  /** Drop the outer card chrome (border/background/padding) when embedded. */
  bare?: boolean;
}) {
  // Selected option index per question (null = unanswered).
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null)
  );

  const select = (qi: number, oi: number) => {
    setAnswers((prev) => {
      if (prev[qi] !== null) return prev; // lock once answered
      const next = [...prev];
      next[qi] = oi;
      return next;
    });
  };

  const answered = answers.filter((a) => a !== null).length;
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const allDone = answered === questions.length;

  return (
    <section
      className={
        bare ? "" : "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
      }
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
          {correct} / {questions.length}
        </span>
      </div>

      <ol className="space-y-6">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const isAnswered = chosen !== null;
          return (
            <li key={qi}>
              <p className="font-medium text-[var(--foreground)]">
                <span className="mr-2 text-[var(--faint)]">{qi + 1}.</span>
                <Latex>{q.question}</Latex>
              </p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.answer;
                  const isChosen = oi === chosen;
                  let state =
                    "border-[var(--border)] hover:border-[var(--accent)] text-[var(--foreground)]";
                  if (isAnswered && isCorrect)
                    state =
                      "border-emerald-500/60 bg-emerald-500/10 text-[var(--foreground)]";
                  else if (isAnswered && isChosen && !isCorrect)
                    state = "border-rose-500/60 bg-rose-500/10 text-[var(--foreground)]";
                  else if (isAnswered)
                    state = "border-[var(--border)] text-[var(--muted)]";
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => select(qi, oi)}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${state}`}
                    >
                      <span>
                        <Latex>{opt}</Latex>
                      </span>
                      {isAnswered && isCorrect && (
                        <Check size={16} className="shrink-0 text-emerald-500" />
                      )}
                      {isAnswered && isChosen && !isCorrect && (
                        <X size={16} className="shrink-0 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              {isAnswered && q.explanation && (
                <p className="mt-3 rounded-lg bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--muted)]">
                  <Latex>{q.explanation}</Latex>
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {allDone && (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
          <p className="text-sm text-[var(--muted)]">
            You scored <strong className="text-[var(--foreground)]">{correct}</strong> out of{" "}
            {questions.length}.
          </p>
          <button
            type="button"
            onClick={() => setAnswers(questions.map(() => null))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)] transition-colors"
          >
            <RotateCcw size={14} /> Retry
          </button>
        </div>
      )}
    </section>
  );
}
