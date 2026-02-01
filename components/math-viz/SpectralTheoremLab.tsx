"use client";

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Maximize2, X, RotateCw } from 'lucide-react';

// Arrow component
function Arrow({ start, end, color, label, lineWidth = 3 }: {
    start: [number, number, number],
    end: [number, number, number],
    color: string,
    label?: string,
    lineWidth?: number
}) {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const length = endVec.distanceTo(startVec);
    if (length < 0.05) return null;

    return (
        <group>
            <Line points={[startVec, endVec]} color={color} lineWidth={lineWidth} />
            <mesh position={endVec}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {label && (
                <Text
                    position={endVec.clone().add(new THREE.Vector3(0.2, 0.15, 0))}
                    fontSize={0.22}
                    color={color}
                    outlineWidth={0.02}
                    outlineColor="#000"
                    fontWeight="bold"
                >
                    {label}
                </Text>
            )}
        </group>
    );
}

// Spectral decomposition visualization
function SpectralVisualization({
    eigenvalue1, eigenvalue2, angle, showSteps, currentStep, testVector
}: {
    eigenvalue1: number, eigenvalue2: number, angle: number, showSteps: boolean, currentStep: number, testVector: [number, number]
}) {
    // Rotation matrix U (orthogonal)
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // U matrix (rotation by angle)
    const U = [[cosA, -sinA], [sinA, cosA]];
    // U* (transpose for real case)
    const Ut = [[cosA, sinA], [-sinA, cosA]];
    // Lambda (diagonal scaling)
    const Lambda = [[eigenvalue1, 0], [0, eigenvalue2]];

    // Compute T = U * Lambda * U^T
    // First: Lambda * U^T
    const LambdaUt = [
        [Lambda[0][0] * Ut[0][0], Lambda[0][0] * Ut[0][1]],
        [Lambda[1][1] * Ut[1][0], Lambda[1][1] * Ut[1][1]]
    ];
    // Then: U * (Lambda * U^T)
    const T = [
        [U[0][0] * LambdaUt[0][0] + U[0][1] * LambdaUt[1][0], U[0][0] * LambdaUt[0][1] + U[0][1] * LambdaUt[1][1]],
        [U[1][0] * LambdaUt[0][0] + U[1][1] * LambdaUt[1][0], U[1][0] * LambdaUt[0][1] + U[1][1] * LambdaUt[1][1]]
    ];

    // Eigenvectors (columns of U)
    const v1: [number, number, number] = [U[0][0] * 2, U[1][0] * 2, 0];
    const v2: [number, number, number] = [U[0][1] * 2, U[1][1] * 2, 0];

    // Test vector transformation through steps
    const v = testVector;

    // Step 1: Original vector
    const step0 = v;

    // Step 1: U^T * v (rotate into eigenbasis)
    const step1: [number, number] = [Ut[0][0] * v[0] + Ut[0][1] * v[1], Ut[1][0] * v[0] + Ut[1][1] * v[1]];

    // Step 2: Lambda * (U^T * v) (scale in eigenbasis)
    const step2: [number, number] = [eigenvalue1 * step1[0], eigenvalue2 * step1[1]];

    // Step 3: U * Lambda * U^T * v (rotate back)
    const step3: [number, number] = [U[0][0] * step2[0] + U[0][1] * step2[1], U[1][0] * step2[0] + U[1][1] * step2[1]];

    // Grid in eigenbasis
    const eigenbasisGrid = useMemo(() => {
        const lines: React.ReactNode[] = [];
        for (let i = -5; i <= 5; i++) {
            // Lines along eigenvector 1 direction
            const start1 = new THREE.Vector3(U[0][0] * i * 0.5, U[1][0] * i * 0.5, -0.05);
            const end1 = start1.clone().add(new THREE.Vector3(U[0][1] * 5, U[1][1] * 5, 0));
            const start1b = start1.clone().sub(new THREE.Vector3(U[0][1] * 5, U[1][1] * 5, 0));
            lines.push(<Line key={`eg1-${i}`} points={[start1b, end1]} color="#8b5cf6" lineWidth={0.5} opacity={0.3} transparent />);

            // Lines along eigenvector 2 direction
            const start2 = new THREE.Vector3(U[0][1] * i * 0.5, U[1][1] * i * 0.5, -0.05);
            const end2 = start2.clone().add(new THREE.Vector3(U[0][0] * 5, U[1][0] * 5, 0));
            const start2b = start2.clone().sub(new THREE.Vector3(U[0][0] * 5, U[1][0] * 5, 0));
            lines.push(<Line key={`eg2-${i}`} points={[start2b, end2]} color="#8b5cf6" lineWidth={0.5} opacity={0.3} transparent />);
        }
        return lines;
    }, [U]);

    return (
        <group>
            {/* Eigenbasis grid (rotated) */}
            {eigenbasisGrid}

            {/* Eigenvector axes */}
            <Line
                points={[new THREE.Vector3(-v1[0], -v1[1], 0), new THREE.Vector3(v1[0], v1[1], 0)]}
                color="#3b82f6"
                lineWidth={2}
            />
            <Line
                points={[new THREE.Vector3(-v2[0], -v2[1], 0), new THREE.Vector3(v2[0], v2[1], 0)]}
                color="#ef4444"
                lineWidth={2}
            />

            {/* Eigenvector labels */}
            <Arrow start={[0, 0, 0]} end={v1} color="#3b82f6" label={`v₁ (λ₁=${eigenvalue1.toFixed(1)})`} lineWidth={4} />
            <Arrow start={[0, 0, 0]} end={v2} color="#ef4444" label={`v₂ (λ₂=${eigenvalue2.toFixed(1)})`} lineWidth={4} />

            {/* Step-by-step transformation */}
            {showSteps ? (
                <group>
                    {/* Original vector (always shown) */}
                    <Arrow start={[0, 0, 0]} end={[step0[0], step0[1], 0]} color="#22c55e" label="v" lineWidth={3} />

                    {/* Step 1: After U^T (in eigenbasis) - shown as intermediate */}
                    {currentStep >= 1 && (
                        <Arrow start={[0, 0, 0]} end={[step1[0], step1[1], 0]} color="#f59e0b" label="U*v" lineWidth={3} />
                    )}

                    {/* Step 2: After scaling by Lambda */}
                    {currentStep >= 2 && (
                        <Arrow start={[0, 0, 0]} end={[step2[0], step2[1], 0]} color="#ec4899" label="ΛU*v" lineWidth={3} />
                    )}

                    {/* Step 3: Final result after U rotation */}
                    {currentStep >= 3 && (
                        <Arrow start={[0, 0, 0]} end={[step3[0], step3[1], 0]} color="#06b6d4" label="Tv" lineWidth={4} />
                    )}
                </group>
            ) : (
                <group>
                    {/* Just show input and output */}
                    <Arrow start={[0, 0, 0]} end={[step0[0], step0[1], 0]} color="#22c55e" label="v" lineWidth={3} />
                    <Arrow start={[0, 0, 0]} end={[step3[0], step3[1], 0]} color="#06b6d4" label="Tv" lineWidth={4} />
                </group>
            )}

            {/* Legend */}
            <Text position={[-3.5, 3, 0]} fontSize={0.18} color="#3b82f6" anchorX="left">Blue: Eigenvector v₁</Text>
            <Text position={[-3.5, 2.7, 0]} fontSize={0.18} color="#ef4444" anchorX="left">Red: Eigenvector v₂</Text>
            <Text position={[-3.5, 2.4, 0]} fontSize={0.18} color="#22c55e" anchorX="left">Green: Input vector v</Text>
            <Text position={[-3.5, 2.1, 0]} fontSize={0.18} color="#06b6d4" anchorX="left">Cyan: Output Tv</Text>
        </group>
    );
}

// Matrix display component
function MatrixDisplay({ matrix, label, highlight }: { matrix: number[][], label: string, highlight?: string }) {
    return (
        <div className={`p-2 rounded-lg border ${highlight || 'bg-white border-slate-200'}`}>
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <div className="font-mono text-sm grid grid-cols-2 gap-1">
                <span className="text-center">{matrix[0][0].toFixed(2)}</span>
                <span className="text-center">{matrix[0][1].toFixed(2)}</span>
                <span className="text-center">{matrix[1][0].toFixed(2)}</span>
                <span className="text-center">{matrix[1][1].toFixed(2)}</span>
            </div>
        </div>
    );
}

export default function SpectralTheoremLab() {
    const [eigenvalue1, setEigenvalue1] = useState(2);
    const [eigenvalue2, setEigenvalue2] = useState(0.5);
    const [angle, setAngle] = useState(Math.PI / 4); // 45 degrees
    const [showSteps, setShowSteps] = useState(true);
    const [currentStep, setCurrentStep] = useState(3);
    const [testVector, setTestVector] = useState<[number, number]>([1.5, 0.5]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Compute matrices
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    const U = [[cosA, -sinA], [sinA, cosA]];
    const Ut = [[cosA, sinA], [-sinA, cosA]];
    const Lambda = [[eigenvalue1, 0], [0, eigenvalue2]];

    // T = U * Lambda * U^T
    const LambdaUt = [
        [Lambda[0][0] * Ut[0][0], Lambda[0][0] * Ut[0][1]],
        [Lambda[1][1] * Ut[1][0], Lambda[1][1] * Ut[1][1]]
    ];
    const T = [
        [U[0][0] * LambdaUt[0][0] + U[0][1] * LambdaUt[1][0], U[0][0] * LambdaUt[0][1] + U[0][1] * LambdaUt[1][1]],
        [U[1][0] * LambdaUt[0][0] + U[1][1] * LambdaUt[1][0], U[1][0] * LambdaUt[0][1] + U[1][1] * LambdaUt[1][1]]
    ];

    // Animate through steps
    const animateSteps = () => {
        setIsAnimating(true);
        setCurrentStep(0);
        let step = 0;
        const interval = setInterval(() => {
            step++;
            setCurrentStep(step);
            if (step >= 3) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 1000);
    };

    const presets = [
        { name: 'Stretch', λ1: 2, λ2: 0.5, θ: Math.PI / 4 },
        { name: 'Uniform Scale', λ1: 1.5, λ2: 1.5, θ: 0 },
        { name: 'Squeeze', λ1: 2, λ2: 0.25, θ: Math.PI / 6 },
        { name: 'Flip', λ1: -1, λ2: 1, θ: 0 },
        { name: 'Contract', λ1: 0.5, λ2: 0.5, θ: Math.PI / 3 },
    ];

    const vizContent = (
        <>
            <color attach="background" args={['#0f172a']} />
            <OrbitControls makeDefault enableRotate={false} />
            <ambientLight intensity={0.8} />
            <pointLight position={[5, 5, 5]} intensity={0.5} />
            <Grid args={[20, 20]} cellSize={1} cellThickness={0.5} cellColor="#1e293b" sectionSize={5} sectionThickness={0.5} sectionColor="#334155" fadeDistance={25} />
            <SpectralVisualization
                eigenvalue1={eigenvalue1}
                eigenvalue2={eigenvalue2}
                angle={angle}
                showSteps={showSteps}
                currentStep={currentStep}
                testVector={testVector}
            />
        </>
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
                <div className="flex items-center justify-between p-3 bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold text-white">Spectral Theorem Lab</h2>
                        <div className="flex items-center gap-2 text-white text-sm">
                            <span>λ₁:</span>
                            <input type="range" min={-2} max={3} step={0.1} value={eigenvalue1} onChange={e => setEigenvalue1(parseFloat(e.target.value))} className="w-20" />
                            <span className="w-10 font-mono">{eigenvalue1.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm">
                            <span>λ₂:</span>
                            <input type="range" min={-2} max={3} step={0.1} value={eigenvalue2} onChange={e => setEigenvalue2(parseFloat(e.target.value))} className="w-20" />
                            <span className="w-10 font-mono">{eigenvalue2.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white text-sm">
                            <span>θ:</span>
                            <input type="range" min={0} max={Math.PI} step={0.05} value={angle} onChange={e => setAngle(parseFloat(e.target.value))} className="w-20" />
                            <span className="w-12 font-mono">{(angle * 180 / Math.PI).toFixed(0)}°</span>
                        </div>
                    </div>
                    <button onClick={() => setIsFullscreen(false)} className="p-2 bg-red-600 text-white rounded hover:bg-red-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1">
                    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>{vizContent}</Canvas>
                </div>
                <div className="p-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
                    <div className="flex gap-2">
                        {presets.map(p => (
                            <button key={p.name} onClick={() => { setEigenvalue1(p.λ1); setEigenvalue2(p.λ2); setAngle(p.θ); }} className="px-2 py-1 text-xs bg-violet-600 text-white rounded hover:bg-violet-500">
                                {p.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white text-sm">
                            <input type="checkbox" checked={showSteps} onChange={e => setShowSteps(e.target.checked)} />
                            Show Steps
                        </label>
                        <button onClick={animateSteps} disabled={isAnimating} className="px-3 py-1 bg-cyan-600 text-white rounded text-sm flex items-center gap-1 hover:bg-cyan-500 disabled:opacity-50">
                            <RotateCw size={14} className={isAnimating ? 'animate-spin' : ''} /> Animate
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Spectral Theorem Lab</h3>
                    <p className="text-sm text-slate-600 mt-1">Visualize T = UΛU* decomposition</p>
                </div>
                <button onClick={() => setIsFullscreen(true)} className="p-2 bg-slate-200 hover:bg-slate-300 rounded" title="Fullscreen">
                    <Maximize2 size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Matrix displays */}
                <MatrixDisplay matrix={U} label="U (rotation)" highlight="bg-blue-50 border-blue-200" />
                <MatrixDisplay matrix={Lambda} label="Λ (scaling)" highlight="bg-purple-50 border-purple-200" />
                <MatrixDisplay matrix={T} label="T = UΛU*" highlight="bg-cyan-50 border-cyan-200" />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm mb-2">Eigenvalues</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-600 text-sm w-6">λ₁:</span>
                            <input type="range" min={-2} max={3} step={0.1} value={eigenvalue1} onChange={e => setEigenvalue1(parseFloat(e.target.value))} className="flex-1" />
                            <span className="text-sm font-mono w-10">{eigenvalue1.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-red-600 text-sm w-6">λ₂:</span>
                            <input type="range" min={-2} max={3} step={0.1} value={eigenvalue2} onChange={e => setEigenvalue2(parseFloat(e.target.value))} className="flex-1" />
                            <span className="text-sm font-mono w-10">{eigenvalue2.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-700 text-sm mb-2">Rotation Angle θ</h4>
                    <div className="flex items-center gap-2">
                        <input type="range" min={0} max={Math.PI} step={0.05} value={angle} onChange={e => setAngle(parseFloat(e.target.value))} className="flex-1" />
                        <span className="text-sm font-mono w-12">{(angle * 180 / Math.PI).toFixed(0)}°</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Eigenvector orientation</p>
                </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1 mb-4">
                {presets.map(p => (
                    <button key={p.name} onClick={() => { setEigenvalue1(p.λ1); setEigenvalue2(p.λ2); setAngle(p.θ); }} className="px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded hover:bg-violet-200">
                        {p.name}
                    </button>
                ))}
            </div>

            {/* Visualization */}
            <div className="h-[400px] bg-slate-900 rounded-lg overflow-hidden relative">
                <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>{vizContent}</Canvas>
            </div>

            {/* Step controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={showSteps} onChange={e => setShowSteps(e.target.checked)} />
                        Show decomposition steps
                    </label>
                    {showSteps && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Step:</span>
                            <input type="range" min={0} max={3} step={1} value={currentStep} onChange={e => setCurrentStep(parseInt(e.target.value))} className="w-24" />
                            <span className="text-sm font-mono">{currentStep}/3</span>
                        </div>
                    )}
                </div>
                <button onClick={animateSteps} disabled={isAnimating} className="px-3 py-1.5 bg-cyan-600 text-white rounded text-sm flex items-center gap-1 hover:bg-cyan-500 disabled:opacity-50">
                    <RotateCw size={14} className={isAnimating ? 'animate-spin' : ''} /> Animate Steps
                </button>
            </div>

            {/* Info panel */}
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm">
                <h4 className="font-bold text-purple-900 mb-2">Understanding T = UΛU*</h4>
                <ul className="text-purple-800 space-y-1 text-xs">
                    <li>• <strong>Step 1 (U*):</strong> Rotate vector into eigenbasis</li>
                    <li>• <strong>Step 2 (Λ):</strong> Scale along eigenvector directions by λ₁, λ₂</li>
                    <li>• <strong>Step 3 (U):</strong> Rotate back to standard basis</li>
                    <li>• The eigenvectors (blue/red lines) are the principal axes of the transformation</li>
                </ul>
            </div>
        </div>
    );
}
