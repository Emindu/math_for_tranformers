// Basic vector and matrix operations helper

export type Vector = number[];
export type Matrix = number[][];

export const dotProduct = (a: Vector, b: Vector): number => {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
};

export const magnitude = (v: Vector): number => {
    return Math.sqrt(v.reduce((sum, val) => sum + val ** 2, 0));
};

export const cosineSimilarity = (a: Vector, b: Vector): number => {
    const magA = magnitude(a);
    const magB = magnitude(b);
    if (magA === 0 || magB === 0) return 0;
    return dotProduct(a, b) / (magA * magB);
};

export const softmax = (arr: number[]): number[] => {
    const max = Math.max(...arr);
    const exps = arr.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
};

// Generate random vector of dimension d
export const randomVector = (d: number): Vector => {
    return Array.from({ length: d }, () => Math.random() * 2 - 1); // -1 to 1
};

export const addVectors = (a: Vector, b: Vector): Vector => {
    return a.map((val, i) => val + (b[i] || 0));
};

export const scaleVector = (v: Vector, s: number): Vector => {
    return v.map(val => val * s);
};
