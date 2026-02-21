import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Play, RotateCcw, Pause } from 'lucide-react';

const MAX_DICE = 2000;
const SIDES = 6;
const EXPECTED_VALUE = 3.5;

function HistogramBars({ counts, maxCount }: { counts: number[], maxCount: number }) {
    return (
        <group position={[-SIDES / 2 + 0.5, 0, 0]}>
            {counts.map((count, i) => {
                const height = maxCount > 0 ? (count / maxCount) * 5 : 0;
                return (
                    <group key={i} position={[i, height / 2, -2]}>
                        <mesh>
                            <boxGeometry args={[0.8, height, 0.8]} />
                            <meshStandardMaterial color="#3b82f6" opacity={0.8} transparent />
                        </mesh>
                        <Text position={[0, -height / 2 - 0.5, 0]} fontSize={0.3} color="#94a3b8">
                            {i + 1}
                        </Text>
                    </group>
                );
            })}
        </group>
    );
}

function RunningAverageLine({ history }: { history: number[] }) {
    const lineRef = useRef<THREE.Line>(null);
    const materialRef = useRef<THREE.LineBasicMaterial>(null);

    const points = useMemo(() => {
        if (history.length === 0) return [new THREE.Vector3(-5, 0, 2), new THREE.Vector3(-5, 0, 2)];

        // Map history to x: [-5, 5], y: scaled to show convergence around 0
        const pts: THREE.Vector3[] = [];
        const maxPoints = Math.min(history.length, 500); // Only show last 500 for performance
        const step = 10 / maxPoints;

        for (let i = 0; i < maxPoints; i++) {
            const idx = history.length - maxPoints + i;
            const val = history[idx];
            // Center around expected value, scale vertically
            const y = (val - EXPECTED_VALUE) * 2;
            pts.push(new THREE.Vector3(-5 + (i * step), y, 2));
        }
        return pts;
    }, [history]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return geo;
    }, [points]);

    // Update geometry when points change
    useEffect(() => {
        if (lineRef.current) {
            lineRef.current.geometry.dispose();
            lineRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
        }
    }, [points]);

    return (
        <group>
            <line ref={lineRef} geometry={geometry}>
                <lineBasicMaterial ref={materialRef} color="#f59e0b" linewidth={3} transparent opacity={0.8} />
            </line>

            {/* Theoretical Expected Value Line */}
            <line>
                <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-5, 0, 2),
                    new THREE.Vector3(5, 0, 2)
                ])} />
                <lineBasicMaterial attach="material" color="#10b981" linewidth={2} />
            </line>
            <Text position={[4, 0.2, 2]} fontSize={0.3} color="#10b981" anchorX="right">
                E[X] = 3.5
            </Text>
        </group>
    );
}


export default function LawOfLargeNumbersLab() {
    const [running, setRunning] = useState(false);
    const [rolls, setRolls] = useState(0);
    const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
    const [sum, setSum] = useState(0);
    const [history, setHistory] = useState<number[]>([]);

    // Animation Loop
    useEffect(() => {
        let animationFrame: number;
        let lastTime = performance.now();
        const rollsPerSecond = 50; // Speed of simulation

        const simulate = (time: number) => {
            if (!running) return;

            const delta = time - lastTime;

            // Add rolls based on time passed
            if (delta > (1000 / rollsPerSecond)) {
                // Batch up multiple rolls per frame if needed for high speed
                const numNewRolls = Math.min(5, MAX_DICE - rolls);

                if (numNewRolls <= 0) {
                    setRunning(false);
                    return;
                }

                setCounts(prevCounts => {
                    const newCounts = [...prevCounts];
                    let newSum = sum;

                    for (let i = 0; i < numNewRolls; i++) {
                        const roll = Math.floor(Math.random() * 6);
                        newCounts[roll]++;
                        newSum += (roll + 1);
                    }

                    const newTotalRolls = rolls + numNewRolls;
                    const newAvg = newSum / newTotalRolls;

                    setRolls(newTotalRolls);
                    setSum(newSum);
                    setHistory(prev => [...prev, newAvg]);

                    return newCounts;
                });
                lastTime = time;
            }
            animationFrame = requestAnimationFrame(simulate);
        };

        if (running && rolls < MAX_DICE) {
            animationFrame = requestAnimationFrame(simulate);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [running, rolls, sum]);

    const maxCount = Math.max(...counts);
    const currentAvg = rolls === 0 ? 0 : sum / rolls;

    return (
        <div className="w-full h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative">

            {/* Header UI */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div>
                    <h3 className="text-white font-bold text-lg">Law of Large Numbers & CLT</h3>
                    <p className="text-slate-400 text-xs text-amber-500">n → ∞ (Limit Behavior)</p>
                </div>

                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 gap-2">
                    <button
                        onClick={() => setRunning(!running)}
                        disabled={rolls >= MAX_DICE}
                        className={`p-2 rounded-md text-white transition-colors ${rolls >= MAX_DICE ? 'opacity-50 cursor-not-allowed' :
                                running ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                            }`}
                        title={running ? 'Pause Simulation' : 'Run Simulation'}
                    >
                        {running ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button
                        onClick={() => {
                            setRunning(false);
                            setRolls(0);
                            setCounts([0, 0, 0, 0, 0, 0]);
                            setSum(0);
                            setHistory([]);
                        }}
                        className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* 3D Scene */}
            <div className="flex-1 relative mt-16 pb-24">
                <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <HistogramBars counts={counts} maxCount={maxCount} />
                    <RunningAverageLine history={history} />

                    {/* Floor Grids */}
                    <gridHelper args={[15, 15, '#334155', '#1e293b']} position={[0, 0, -2]} />
                    <gridHelper args={[15, 15, '#475569', '#334155']} position={[0, 0, 2]} />

                    <Text position={[-6.5, 0, -2]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.4} color="#3b82f6" anchorX="center">
                        CLT (Frequency)
                    </Text>
                    <Text position={[-6.5, 0, 2]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]} fontSize={0.4} color="#f59e0b" anchorX="center">
                        LLN (Running Average)
                    </Text>

                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} />
                </Canvas>
            </div>

            {/* Footer Stats */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-10 bg-slate-900/90 backdrop-blur-md border-t border-white/10">
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto divide-x divide-slate-700">

                    <div className="text-center px-4">
                        <div className="text-slate-400 text-xs font-mono mb-1">N (Samples)</div>
                        <div className="text-2xl font-bold text-white tabular-nums">
                            {rolls} <span className="text-xs font-normal text-slate-500">/ {MAX_DICE}</span>
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <div className="text-slate-400 text-xs font-mono mb-1">Running Mean (μ_n)</div>
                        <div className="text-2xl font-bold text-amber-500 tabular-nums">
                            {rolls > 0 ? currentAvg.toFixed(4) : "0.0000"}
                        </div>
                    </div>

                    <div className="text-center px-4">
                        <div className="text-slate-400 text-xs font-mono mb-1">True Expected (μ)</div>
                        <div className="text-2xl font-bold text-emerald-400 tabular-nums">{EXPECTED_VALUE.toFixed(4)}</div>
                    </div>

                </div>
            </div>

        </div>
    );
}
