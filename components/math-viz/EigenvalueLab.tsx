"use client";

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Maximize2, Minimize2, X } from 'lucide-react';

// Thick arrow with cone head for clear visibility
function ThickArrow({ start, end, color, label, lineWidth = 4 }: { start: [number, number, number], end: [number, number, number], color: string, label?: string, lineWidth?: number }) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(endVec, startVec);
    const length = dir.length();
    if (length < 0.05) return null;

    const headPos = endVec.clone();

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={lineWidth} />
            <mesh position={headPos}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text
                    position={headPos.clone().add(new THREE.Vector3(0.25, 0.2, 0))}
                    fontSize={0.28}
                    color={color}
                    outlineWidth={0.03}
                    outlineColor="#000000"
                    fontWeight="bold"
                >
                    {label}
                </Text>
            )}
        </group>
    );
}

// Draggable Test Vector
// Draggable Test Vector with proper global event handling
function DraggableVector({
    position,
    onDrag,
    matrix
}: {
    position: [number, number],
    onDrag: (pos: [number, number]) => void,
    matrix: number[][]
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const { camera, gl } = useThree();
    const isDraggingRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    const transformedVec: [number, number] = [
        matrix[0][0] * position[0] + matrix[0][1] * position[1],
        matrix[1][0] * position[0] + matrix[1][1] * position[1]
    ];

    // Check if on eigenspace
    const cross = position[0] * transformedVec[1] - position[1] * transformedVec[0];
    const isOnEigenspace = Math.abs(cross) < 0.15 && (position[0] !== 0 || position[1] !== 0);

    // Global mouse move handler - using raycaster for accurate position
    const handleGlobalMove = useCallback((e: MouseEvent) => {
        if (!isDraggingRef.current) return;

        const rect = gl.domElement.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        // Use raycaster to find intersection with z=0 plane
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

        // Create a plane at z=0
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        if (intersectPoint) {
            const newX = Math.max(-5, Math.min(5, intersectPoint.x));
            const newY = Math.max(-5, Math.min(5, intersectPoint.y));
            onDrag([newX, newY]);
        }
    }, [camera, gl, onDrag]);

    // Global mouse up handler
    const handleGlobalUp = useCallback(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
        gl.domElement.style.cursor = 'default';
    }, [gl]);

    // Add/remove global listeners
    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging, handleGlobalMove, handleGlobalUp]);

    const handlePointerDown = (e: any) => {
        e.stopPropagation();
        isDraggingRef.current = true;
        setIsDragging(true);
        gl.domElement.style.cursor = 'grabbing';
    };

    return (
        <group>
            {/* Original vector v */}
            <Line
                points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(position[0], position[1], 0)]}
                color="#a855f7"
                lineWidth={4}
            />

            {/* Draggable handle - larger for easier clicking */}
            <mesh
                ref={meshRef}
                position={[position[0], position[1], 0]}
                onPointerDown={handlePointerDown}
                onPointerEnter={() => { gl.domElement.style.cursor = 'grab'; }}
                onPointerLeave={() => { if (!isDraggingRef.current) gl.domElement.style.cursor = 'default'; }}
            >
                <sphereGeometry args={[0.25, 32, 32]} />
                <meshStandardMaterial
                    color={isDragging ? "#c084fc" : "#a855f7"}
                    emissive={isDragging ? "#a855f7" : "#8b5cf6"}
                    emissiveIntensity={isDragging ? 0.5 : 0.2}
                />
            </mesh>
            <Text
                position={[position[0] + 0.35, position[1] + 0.3, 0]}
                fontSize={0.22}
                color="#a855f7"
                outlineWidth={0.02}
                outlineColor="#000"
            >
                v (drag me!)
            </Text>

            {/* Transformed vector Av */}
            <ThickArrow
                start={[0, 0, 0]}
                end={[transformedVec[0], transformedVec[1], 0]}
                color={isOnEigenspace ? "#22c55e" : "#f472b6"}
                label="Av"
                lineWidth={3}
            />

            {/* Eigenspace indicator */}
            {isOnEigenspace && (
                <Text position={[0, -2.5, 0]} fontSize={0.22} color="#22c55e" outlineWidth={0.02} outlineColor="#000">
                    ✓ On Eigenspace! (v and Av are collinear)
                </Text>
            )}
        </group>
    );
}

// Standard basis and transformed basis visualization
function BasisVisualization({ matrix, showBasis }: { matrix: number[][], showBasis: boolean }) {
    if (!showBasis) return null;

    const Te1: [number, number, number] = [matrix[0][0], matrix[1][0], 0];
    const Te2: [number, number, number] = [matrix[0][1], matrix[1][1], 0];

    return (
        <group>
            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.5, 0, 0)]} color="#94a3b8" lineWidth={3} dashed dashSize={0.1} gapSize={0.05} />
            <Text position={[1.7, 0, 0]} fontSize={0.25} color="#94a3b8" outlineWidth={0.02} outlineColor="#000">e₁</Text>

            <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.5, 0)]} color="#94a3b8" lineWidth={3} dashed dashSize={0.1} gapSize={0.05} />
            <Text position={[0, 1.7, 0]} fontSize={0.25} color="#94a3b8" outlineWidth={0.02} outlineColor="#000">e₂</Text>

            <ThickArrow start={[0, 0, 0]} end={[Te1[0] * 1.5, Te1[1] * 1.5, 0]} color="#22d3ee" label="T(e₁)" lineWidth={5} />
            <ThickArrow start={[0, 0, 0]} end={[Te2[0] * 1.5, Te2[1] * 1.5, 0]} color="#f472b6" label="T(e₂)" lineWidth={5} />
        </group>
    );
}

// Grid deformation
function GridDeformation({ matrix, showGrid }: { matrix: number[][], showGrid: boolean }) {
    if (!showGrid) return null;

    const elements: React.ReactNode[] = [];
    // Extended grid range for larger/infinite feel
    const gridRange = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const gridExtent = 12;

    // Original grid (dashed) - finer lines for farther ones
    for (const x of gridRange) {
        const isMajor = x % 5 === 0;
        elements.push(
            <Line
                key={`orig-v${x}`}
                points={[new THREE.Vector3(x, -gridExtent, -0.1), new THREE.Vector3(x, gridExtent, -0.1)]}
                color={isMajor ? "#64748b" : "#475569"}
                lineWidth={isMajor ? 1.5 : 0.5}
                dashed
                dashSize={0.2}
                gapSize={0.1}
            />
        );
    }
    for (const y of gridRange) {
        const isMajor = y % 5 === 0;
        elements.push(
            <Line
                key={`orig-h${y}`}
                points={[new THREE.Vector3(-gridExtent, y, -0.1), new THREE.Vector3(gridExtent, y, -0.1)]}
                color={isMajor ? "#64748b" : "#475569"}
                lineWidth={isMajor ? 1.5 : 0.5}
                dashed
                dashSize={0.2}
                gapSize={0.1}
            />
        );
    }

    // Transformed grid (solid)
    for (const x of gridRange) {
        const points: THREE.Vector3[] = [];
        for (let y = -gridExtent; y <= gridExtent; y += 0.5) {
            points.push(new THREE.Vector3(matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y, 0));
        }
        elements.push(<Line key={`trans-v${x}`} points={points} color="#38bdf8" lineWidth={1.5} />);
    }
    for (const y of gridRange) {
        const points: THREE.Vector3[] = [];
        for (let x = -gridExtent; x <= gridExtent; x += 0.5) {
            points.push(new THREE.Vector3(matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y, 0));
        }
        elements.push(<Line key={`trans-h${y}`} points={points} color="#f472b6" lineWidth={1.5} />);
    }

    return <group>{elements}</group>;
}

// Iteration path
function IterationPath({ matrix, startVec, iterations, show }: { matrix: number[][], startVec: [number, number], iterations: number, show: boolean }) {
    const points = useMemo(() => {
        if (!show) return [];
        const pts: THREE.Vector3[] = [];
        let v = [...startVec];
        pts.push(new THREE.Vector3(v[0], v[1], 0));

        for (let i = 0; i < iterations; i++) {
            v = [matrix[0][0] * v[0] + matrix[0][1] * v[1], matrix[1][0] * v[0] + matrix[1][1] * v[1]];
            const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            if (mag > 5 || mag < 0.01) break;
            pts.push(new THREE.Vector3(v[0], v[1], 0));
        }
        return pts;
    }, [matrix, startVec, iterations, show]);

    if (!show || points.length < 2) return null;
    return (
        <group>
            <Line points={points} color="#fbbf24" lineWidth={3} />
            {points.map((pt, i) => (
                <mesh key={i} position={pt}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color={i === 0 ? "#f59e0b" : "#fcd34d"} />
                </mesh>
            ))}
        </group>
    );
}

// Spiral path
function SpiralPath({ matrix, isComplex }: { matrix: number[][], isComplex: boolean }) {
    const points = useMemo(() => {
        if (!isComplex) return [];
        const pts: THREE.Vector3[] = [];
        let v = [1, 0];
        for (let i = 0; i < 60; i++) {
            pts.push(new THREE.Vector3(v[0], v[1], 0));
            v = [matrix[0][0] * v[0] + matrix[0][1] * v[1], matrix[1][0] * v[0] + matrix[1][1] * v[1]];
            const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            if (mag > 4 || mag < 0.01) break;
        }
        return pts;
    }, [matrix, isComplex]);
    if (!isComplex || points.length < 2) return null;
    return <Line points={points} color="#c084fc" lineWidth={3} />;
}

// Eigenvector visualization
function EigenvectorViz({ eigenvectors, eigenvalues, isComplex }: { eigenvectors: [[number, number], [number, number]] | null, eigenvalues: [number, number], isComplex: boolean }) {
    if (isComplex || !eigenvectors) return null;
    return (
        <group>
            <Line points={[new THREE.Vector3(-eigenvectors[0][0] * 4, -eigenvectors[0][1] * 4, 0), new THREE.Vector3(eigenvectors[0][0] * 4, eigenvectors[0][1] * 4, 0)]} color="#3b82f6" lineWidth={3} />
            <ThickArrow start={[0, 0, 0]} end={[eigenvectors[0][0] * 2, eigenvectors[0][1] * 2, 0]} color="#3b82f6" label={`v₁ (λ=${eigenvalues[0].toFixed(1)})`} lineWidth={4} />
            <Line points={[new THREE.Vector3(-eigenvectors[1][0] * 4, -eigenvectors[1][1] * 4, 0), new THREE.Vector3(eigenvectors[1][0] * 4, eigenvectors[1][1] * 4, 0)]} color="#ef4444" lineWidth={3} />
            <ThickArrow start={[0, 0, 0]} end={[eigenvectors[1][0] * 2, eigenvectors[1][1] * 2, 0]} color="#ef4444" label={`v₂ (λ=${eigenvalues[1].toFixed(1)})`} lineWidth={4} />
        </group>
    );
}

// Compute eigenvalues
function computeEigen(m: number[][]): { eigenvalues: [number, number], eigenvectors: [[number, number], [number, number]] | null, isComplex: boolean } {
    const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
    const trace = a + d, det = a * d - b * c;
    const discriminant = trace * trace - 4 * det;

    if (discriminant < 0) {
        return { eigenvalues: [trace / 2, Math.sqrt(-discriminant) / 2], eigenvectors: null, isComplex: true };
    }

    const sqrtDisc = Math.sqrt(discriminant);
    const lambda1 = (trace + sqrtDisc) / 2, lambda2 = (trace - sqrtDisc) / 2;

    const findEigenvector = (lambda: number): [number, number] => {
        const epsilon = 0.0001;
        let v: [number, number] = Math.abs(b) > epsilon ? [b, lambda - a] : Math.abs(c) > epsilon ? [lambda - d, c] : Math.abs(a - lambda) < epsilon ? [1, 0] : [0, 1];
        const len = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return len > epsilon ? [v[0] / len, v[1] / len] : v;
    };

    return { eigenvalues: [lambda1, lambda2], eigenvectors: [findEigenvector(lambda1), findEigenvector(lambda2)], isComplex: false };
}

// Main visualization canvas content
function VisualizationContent({ matrix, showBasis, showGrid, showEigenvectors, showIteration, iterations, testVec, setTestVec }: {
    matrix: number[][], showBasis: boolean, showGrid: boolean, showEigenvectors: boolean, showIteration: boolean, iterations: number, testVec: [number, number], setTestVec: (v: [number, number]) => void
}) {
    const { eigenvalues, eigenvectors, isComplex } = useMemo(() => computeEigen(matrix), [matrix]);

    return (
        <>
            <color attach="background" args={['#0f172a']} />
            <OrbitControls makeDefault enableRotate={false} />
            <ambientLight intensity={0.8} />
            <pointLight position={[5, 5, 5]} intensity={0.5} />

            <Grid args={[10, 10]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={1} sectionThickness={0.5} sectionColor="#334155" fadeDistance={15} />

            <GridDeformation matrix={matrix} showGrid={showGrid} />
            <BasisVisualization matrix={matrix} showBasis={showBasis} />
            {showEigenvectors && <EigenvectorViz eigenvectors={eigenvectors} eigenvalues={eigenvalues} isComplex={isComplex} />}
            <SpiralPath matrix={matrix} isComplex={isComplex} />
            <IterationPath matrix={matrix} startVec={testVec} iterations={iterations} show={showIteration} />

            {/* Draggable test vector */}
            <DraggableVector position={testVec} onDrag={setTestVec} matrix={matrix} />

            {/* Legend */}
            <Text position={[-2.8, 2.7, 0]} fontSize={0.18} color="#94a3b8" anchorX="left">Gray dashed: Original basis (e₁, e₂)</Text>
            <Text position={[-2.8, 2.4, 0]} fontSize={0.18} color="#22d3ee" anchorX="left">Cyan: T(e₁) - first column</Text>
            <Text position={[-2.8, 2.1, 0]} fontSize={0.18} color="#f472b6" anchorX="left">Pink: T(e₂) - second column</Text>
            <Text position={[-2.8, 1.8, 0]} fontSize={0.18} color="#a855f7" anchorX="left">Purple: Test vector v (draggable)</Text>
        </>
    );
}

export default function EigenvalueLab() {
    const [matrix, setMatrix] = useState<number[][]>([[2, 1], [1, 2]]);
    const [showBasis, setShowBasis] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [showIteration, setShowIteration] = useState(false);
    const [showEigenvectors, setShowEigenvectors] = useState(true);
    const [iterations, setIterations] = useState(15);
    const [testVec, setTestVec] = useState<[number, number]>([1.5, 0.5]);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const presets = [
        { name: 'Symmetric', m: [[2, 1], [1, 2]] },
        { name: 'Scale X', m: [[2, 0], [0, 1]] },
        { name: 'Scale Y', m: [[1, 0], [0, 2]] },
        { name: 'Shear', m: [[1, 1], [0, 1]] },
        { name: 'Rotation 45°', m: [[0.7, -0.7], [0.7, 0.7]] },
        { name: 'Rotation 90°', m: [[0, -1], [1, 0]] },
        { name: 'Contract', m: [[0.5, 0], [0, 0.5]] },
        { name: 'Reflection', m: [[1, 0], [0, -1]] },
    ];

    const { eigenvalues, isComplex } = useMemo(() => computeEigen(matrix), [matrix]);

    // Fullscreen modal
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
                {/* Header with controls */}
                <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-white">Eigenvalue Lab</h2>

                        {/* Matrix Input */}
                        <div className="flex items-center gap-2">
                            <span className="text-white text-sm">Matrix:</span>
                            <div className="grid grid-cols-2 gap-1">
                                {[0, 1].map(row => (
                                    [0, 1].map(col => (
                                        <input
                                            key={`fs-m-${row}-${col}`}
                                            type="number"
                                            value={matrix[row][col]}
                                            onChange={e => {
                                                const newM = matrix.map(r => [...r]);
                                                newM[row][col] = parseFloat(e.target.value) || 0;
                                                setMatrix(newM);
                                            }}
                                            className="w-14 border border-slate-600 bg-slate-700 text-white rounded px-2 py-1 text-center text-sm font-mono"
                                            step={0.5}
                                        />
                                    ))
                                ))}
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="flex gap-1">
                            {presets.map(p => (
                                <button key={p.name} onClick={() => setMatrix(p.m)} className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-500">
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Eigenvalues display */}
                        <div className="text-sm">
                            {isComplex ? (
                                <span className="text-purple-400 font-mono">λ = {eigenvalues[0].toFixed(2)} ± {eigenvalues[1].toFixed(2)}i</span>
                            ) : (
                                <span className="font-mono">
                                    <span className="text-blue-400">λ₁={eigenvalues[0].toFixed(2)}</span>
                                    <span className="text-slate-500 mx-1">,</span>
                                    <span className="text-red-400">λ₂={eigenvalues[1].toFixed(2)}</span>
                                </span>
                            )}
                        </div>
                        <button onClick={() => setIsFullscreen(false)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1">
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                        <VisualizationContent
                            matrix={matrix}
                            showBasis={showBasis}
                            showGrid={showGrid}
                            showEigenvectors={showEigenvectors}
                            showIteration={showIteration}
                            iterations={iterations}
                            testVec={testVec}
                            setTestVec={setTestVec}
                        />
                    </Canvas>
                </div>

                {/* Footer controls */}
                <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
                    {/* Left: Checkboxes */}
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input type="checkbox" checked={showBasis} onChange={e => setShowBasis(e.target.checked)} className="w-4 h-4" />
                            Basis
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input type="checkbox" checked={showEigenvectors} onChange={e => setShowEigenvectors(e.target.checked)} className="w-4 h-4" />
                            Eigenvectors
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="w-4 h-4" />
                            Grid
                        </label>
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input type="checkbox" checked={showIteration} onChange={e => setShowIteration(e.target.checked)} className="w-4 h-4" />
                            Iteration
                        </label>
                    </div>

                    {/* Center: Test Vector Sliders */}
                    <div className="flex items-center gap-4">
                        <span className="text-violet-400 text-sm font-semibold">v:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white text-xs">x:</span>
                            <input type="range" min={-5} max={5} step={0.1} value={testVec[0]} onChange={e => setTestVec([parseFloat(e.target.value), testVec[1]])} className="w-24" />
                            <span className="text-white text-xs font-mono w-8">{testVec[0].toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white text-xs">y:</span>
                            <input type="range" min={-5} max={5} step={0.1} value={testVec[1]} onChange={e => setTestVec([testVec[0], parseFloat(e.target.value)])} className="w-24" />
                            <span className="text-white text-xs font-mono w-8">{testVec[1].toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Right: Vector values */}
                    <div className="text-sm">
                        <span className="text-violet-400 font-mono">v=({testVec[0].toFixed(1)}, {testVec[1].toFixed(1)})</span>
                        <span className="text-slate-500 mx-2">→</span>
                        <span className="text-pink-400 font-mono">
                            Av=({(matrix[0][0] * testVec[0] + matrix[0][1] * testVec[1]).toFixed(1)}, {(matrix[1][0] * testVec[0] + matrix[1][1] * testVec[1]).toFixed(1)})
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Controls */}
                <div className="w-full lg:w-1/3 space-y-3">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Eigenvalue Lab</h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Drag the purple v vector in the visualization!
                        </p>
                    </div>

                    {/* Matrix Input */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 text-sm border-b pb-2 mb-2">Matrix [T]</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {[0, 1].map(row => (
                                [0, 1].map(col => (
                                    <input
                                        key={`m-${row}-${col}`}
                                        type="number"
                                        value={matrix[row][col]}
                                        onChange={e => {
                                            const newM = matrix.map(r => [...r]);
                                            newM[row][col] = parseFloat(e.target.value) || 0;
                                            setMatrix(newM);
                                        }}
                                        className="w-full border-2 border-slate-300 rounded px-2 py-2 text-center text-lg font-mono font-bold"
                                        step={0.5}
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 text-sm border-b pb-2 mb-2">Presets</h4>
                        <div className="grid grid-cols-2 gap-1">
                            {presets.map(p => (
                                <button key={p.name} onClick={() => setMatrix(p.m)} className="px-2 py-1.5 text-xs font-medium bg-violet-100 text-violet-700 rounded hover:bg-violet-200">
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View Controls */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                        <h4 className="font-semibold text-slate-700 text-sm border-b pb-2 mb-2">Show</h4>
                        <div className="space-y-2 text-sm">
                            <label className="flex items-center gap-2"><input type="checkbox" checked={showBasis} onChange={e => setShowBasis(e.target.checked)} className="w-4 h-4" /><span className="font-medium">Basis Vectors</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={showEigenvectors} onChange={e => setShowEigenvectors(e.target.checked)} className="w-4 h-4" /><span className="font-medium">Eigenvectors</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="w-4 h-4" /><span className="font-medium">Grid Deformation</span></label>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={showIteration} onChange={e => setShowIteration(e.target.checked)} className="w-4 h-4" /><span className="font-medium">Iteration Path</span></label>
                        </div>
                    </div>

                    {/* Test Vector Display with Sliders */}
                    <div className="p-3 bg-violet-50 rounded-lg border border-violet-200">
                        <h4 className="font-semibold text-violet-800 text-sm mb-2">Test Vector (drag in canvas or use sliders)</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-violet-600 w-4">x:</span>
                                <input
                                    type="range"
                                    min={-5}
                                    max={5}
                                    step={0.1}
                                    value={testVec[0]}
                                    onChange={e => setTestVec([parseFloat(e.target.value), testVec[1]])}
                                    className="flex-1"
                                />
                                <span className="text-xs font-mono w-10 text-right">{testVec[0].toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-violet-600 w-4">y:</span>
                                <input
                                    type="range"
                                    min={-5}
                                    max={5}
                                    step={0.1}
                                    value={testVec[1]}
                                    onChange={e => setTestVec([testVec[0], parseFloat(e.target.value)])}
                                    className="flex-1"
                                />
                                <span className="text-xs font-mono w-10 text-right">{testVec[1].toFixed(1)}</span>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-violet-200">
                            <p className="text-sm text-violet-700">
                                <span className="font-mono font-bold">v = ({testVec[0].toFixed(2)}, {testVec[1].toFixed(2)})</span>
                            </p>
                            <p className="text-sm text-pink-600 mt-1">
                                <span className="font-mono font-bold">Av = ({(matrix[0][0] * testVec[0] + matrix[0][1] * testVec[1]).toFixed(2)}, {(matrix[1][0] * testVec[0] + matrix[1][1] * testVec[1]).toFixed(2)})</span>
                            </p>
                        </div>
                    </div>

                    {/* Eigenvalue Results */}
                    <div className="p-3 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg border border-violet-200">
                        <h4 className="font-bold text-violet-900 text-sm mb-2">Eigenvalues</h4>
                        {isComplex ? (
                            <div className="bg-purple-100 p-2 rounded text-sm">
                                <p className="font-mono text-purple-800 font-bold">λ = {eigenvalues[0].toFixed(2)} ± {eigenvalues[1].toFixed(2)}i</p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="bg-blue-100 p-2 rounded flex justify-between items-center">
                                    <span className="font-mono text-blue-800 font-bold">λ₁ = {eigenvalues[0].toFixed(2)}</span>
                                </div>
                                <div className="bg-red-100 p-2 rounded flex justify-between items-center">
                                    <span className="font-mono text-red-800 font-bold">λ₂ = {eigenvalues[1].toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Visualization */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="h-[450px] bg-slate-900 rounded-lg overflow-hidden relative">
                        {/* Fullscreen button */}
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="absolute top-3 right-3 z-10 p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            title="Fullscreen"
                        >
                            <Maximize2 size={18} />
                        </button>

                        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                            <VisualizationContent
                                matrix={matrix}
                                showBasis={showBasis}
                                showGrid={showGrid}
                                showEigenvectors={showEigenvectors}
                                showIteration={showIteration}
                                iterations={iterations}
                                testVec={testVec}
                                setTestVec={setTestVec}
                            />
                        </Canvas>
                    </div>

                    {/* Info panel */}
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-sm">
                        <h4 className="font-bold text-indigo-900 mb-2">How to use</h4>
                        <ul className="text-indigo-800 space-y-1 text-xs">
                            <li>• <span className="font-semibold text-violet-600">Drag the purple sphere</span> to move vector v around</li>
                            <li>• When v and Av are <span className="text-green-600 font-semibold">collinear</span>, v is on an eigenspace!</li>
                            <li>• Click <Maximize2 size={12} className="inline" /> to expand to fullscreen</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
