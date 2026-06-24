/**
 * Client-side Python execution via Pyodide (CPython compiled to WebAssembly).
 *
 * The runtime (~10 MB incl. numpy) is downloaded from the jsDelivr CDN the
 * first time a snippet is run, then cached for the rest of the session. A
 * single shared interpreter backs every code block on the page, and runs are
 * serialized through a queue so concurrent "Run" clicks can't interleave their
 * stdout. This works on fully static hosting (e.g. GitHub Pages) — no server
 * is involved.
 */

const PYODIDE_VERSION = "0.27.2";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;

type Pyodide = {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

declare global {
  interface Window {
    loadPyodide?: (opts?: Record<string, unknown>) => Promise<Pyodide>;
  }
}

let runtime: Promise<Pyodide> | null = null;
let ready = false;

/** Whether the runtime has already finished downloading and initializing. */
export function isPyodideReady(): boolean {
  return ready;
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load the Python runtime."))
      );
      if (window.loadPyodide) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load the Python runtime."));
    document.head.appendChild(script);
  });
}

/** Lazily download and initialize the shared Pyodide interpreter. */
export function loadPyodideRuntime(): Promise<Pyodide> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Python can only run in the browser."));
  }
  if (!runtime) {
    runtime = (async () => {
      if (!window.loadPyodide) await injectScript(PYODIDE_URL);
      if (!window.loadPyodide) {
        throw new Error("The Python runtime failed to initialize.");
      }
      const py = await window.loadPyodide();
      ready = true;
      return py;
    })();
  }
  return runtime;
}

export type RunResult = { output: string; error?: string };

// Serialize runs: the interpreter and its stdout handlers are shared, so only
// one snippet may execute at a time.
let queue: Promise<unknown> = Promise.resolve();

async function execute(code: string): Promise<RunResult> {
  const pyodide = await loadPyodideRuntime();
  let buffer = "";
  const write = (s: string) => {
    buffer += s + "\n";
  };
  pyodide.setStdout({ batched: write });
  pyodide.setStderr({ batched: write });
  try {
    // Auto-install any imported packages bundled with Pyodide (e.g. numpy).
    await pyodide.loadPackagesFromImports(code);
    await pyodide.runPythonAsync(code);
    return { output: buffer };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { output: buffer, error: message };
  }
}

/** Run a snippet and return its captured stdout/stderr (and any error). */
export function runPython(code: string): Promise<RunResult> {
  const task = queue.then(() => execute(code));
  // Keep the queue alive even if this run rejects.
  queue = task.then(
    () => undefined,
    () => undefined
  );
  return task;
}

export type CheckOutcome = { name: string; passed: boolean; detail: string };
export type ChecksResult = {
  outcomes: CheckOutcome[];
  stdout: string;
  /** Set when the learner's code itself failed to run (syntax/runtime error). */
  error?: string;
};

/**
 * Build a self-contained test program. A fresh module namespace is created so
 * one exercise can't see another's leftover definitions; the learner's code is
 * executed into it, then each `_check(name, lambda: expr)` evaluates its lambda
 * — exceptions are caught per-check so one failure can't abort the rest. The
 * final expression returns the results as a JSON string.
 */
function buildChecksProgram(userCode: string, checks: string): string {
  // The learner's code is embedded as a string and exec'd into a fresh dict so
  // a syntax/runtime error there surfaces as a normal exception we can report,
  // and builtins (isinstance, list, …) remain available inside the namespace.
  const encoded = JSON.stringify(userCode);
  return `
import json as _json
import numpy as _np

_ns = {"np": _np}
exec(compile(${encoded}, "<your code>", "exec"), _ns)
np = _np  # checks may reference np directly

_checks = []
def _check(name, fn, detail=""):
    try:
        ok = bool(fn())
    except Exception as e:
        _checks.append({"name": name, "passed": False, "detail": f"{type(e).__name__}: {e}"})
        return
    _checks.append({"name": name, "passed": ok, "detail": "" if ok else detail})

# Expose the learner's top-level names to the checks below.
globals().update({k: v for k, v in _ns.items() if not k.startswith("__")})

${checks}

_json.dumps(_checks)
`;
}

async function executeChecks(userCode: string, checks: string): Promise<ChecksResult> {
  const pyodide = await loadPyodideRuntime();
  let buffer = "";
  const write = (s: string) => {
    buffer += s + "\n";
  };
  pyodide.setStdout({ batched: write });
  pyodide.setStderr({ batched: write });

  const program = buildChecksProgram(userCode, checks);
  try {
    await pyodide.loadPackagesFromImports(userCode + "\nimport numpy");
    const json = (await pyodide.runPythonAsync(program)) as string;
    return { outcomes: JSON.parse(json) as CheckOutcome[], stdout: buffer };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { outcomes: [], stdout: buffer, error: message };
  }
}

/**
 * Run the learner's `userCode`, then evaluate `checks` (a block of
 * `_check(...)` calls) against it. Returns per-check pass/fail outcomes.
 */
export function runPythonChecks(userCode: string, checks: string): Promise<ChecksResult> {
  const task = queue.then(() => executeChecks(userCode, checks));
  queue = task.then(
    () => undefined,
    () => undefined
  );
  return task;
}
