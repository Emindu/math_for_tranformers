// Global type augmentations.

// MathJax is loaded via an external <script> and attached to the window object,
// so it is not part of the standard DOM typings.
interface MathJaxObject {
  typesetPromise: (elements?: unknown[]) => Promise<void>;
  [key: string]: unknown;
}

interface Window {
  MathJax?: MathJaxObject;
}
