import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// --- Probability Measure Theory ---
// This lab visualizes the mapping from a physical Sample Space (Ω) 
// -> to an Event Space (F) 
// -> to a Probability Measure (P) in [0,1]

const DART_COUNT = 150;

type Dart = {
    position: [number, number, number];
    hitTarget: boolean;
};

function DartBoard({ active, onUpdateHits }: { active: boolean, onUpdateHits: (hits: number, total: number) => void }) {
    const groupRef = useRef<THREE.Group>(null);
    const [animationTime, setAnimationTime] = useState(0);

    // Generate random dart positions hitting the board (radius 5)
    // Target is inner circle (radius 2)
    const darts = useMemo(() => {
        const d: Dart[] = [];
        let hitCount = 0;
        for (let i = 0; i < DART_COUNT; i++) {
            const r = 5 * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const isHit = r <= 2;
            if (isHit) hitCount++;
            d.push({
                position: [x, y, 0],
                hitTarget: isHit
            });
        }
        return { data: d, hitCount };
    }, []);

    useFrame((state, delta) => {
        if (active && animationTime < 1) {
            setAnimationTime(Math.min(1, animationTime + delta * 0.5));
            onUpdateHits(
                Math.floor(darts.hitCount * animationTime),
                Math.floor(DART_COUNT * animationTime)
            );
        } else if (!active && animationTime > 0) {
            setAnimationTime(0);
            onUpdateHits(0, 0);
        }
    });

    return (
        <group ref={groupRef}>
            {/* The Sample Space (Omega) - Entire Board */}
            <mesh>
                <circleGeometry args={[5, 64]} />
                <meshBasicMaterial color="#1e293b" side={THREE.DoubleSide} />
            </mesh>

            {/* The Event Space (A) - Inner Circle */}
            <mesh position={[0, 0, 0.01]}>
                <circleGeometry args={[2, 64]} />
                <meshBasicMaterial color="#059669" side={THREE.DoubleSide} transparent opacity={0.3} />
            </mesh>

            <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[1.95, 2.05, 64]} />
                <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
            </mesh>

            {/* Grid for visual flair */}
            <gridHelper args={[10, 10, '#334155', '#334155']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.02]} />

            {/* Darts */}
            {darts.data.map((dart, i) => {
                // Stagger spawn times
                const spawnTime = i / DART_COUNT;
                const visible = active && animationTime >= spawnTime;

                if (!visible) return null;

                return (
                    <mesh key={i} position={[dart.position[0], dart.position[1], 0.1]}>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshBasicMaterial color={dart.hitTarget ? "#10b981" : "#94a3b8"} />
                    </mesh>
                );
            })}

            {/* Labels */}
            <Text position={[0, 5.5, 0]} fontSize={0.5} color="#cbd5e1" anchorX="center" anchorY="bottom">
                Sample Space Ω (All Throws)
            </Text>
            <Text position={[0, 2.5, 0.1]} fontSize={0.4} color="#10b981" anchorX="center" anchorY="bottom">
                Event A (Bullseye)
            </Text>
            <Text position={[0, -5.5, 0]} fontSize={0.4} color="#94a3b8" anchorX="center" anchorY="top">
                (Rotate to View Space)
            </Text>
        </group>
    );
}


export default function ProbabilityMeasureLab() {
    const [running, setRunning] = useState(false);
    const [hits, setHits] = useState(0);
    const [total, setTotal] = useState(0);

    const probStr = total === 0 ? "0.00" : (hits / total).toFixed(2);
    const trueProb = Math.pow(2 / 5, 2); // Area of inner / Area of outer

    return (
        <div className="w-full h-[500px] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative">

            {/* Header / UI Layer */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/80 backdrop-blur-md border-b border-white/10 gap-4">
                <div className="flex-1">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Probability Measure Mapping
                    </h3>
                    <p className="text-slate-400 text-xs">Visualizing P: F → [0,1]</p>
                </div>

                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => setRunning(!running)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${running
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                            }`}
                    >
                        {running ? 'Reset Space' : 'Run Experiment (Throw Darts)'}
                    </button>
                </div>
            </div>

            {/* The 3D Canvas */}
            <div className="flex-1 relative mt-16 pb-20">
                <Canvas camera={{ position: [0, -8, 10], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <DartBoard active={running} onUpdateHits={(h, t) => { setHits(h); setTotal(t); }} />
                    <OrbitControls
                        enablePan={false}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 2}
                        minDistance={5}
                        maxDistance={20}
                    />
                </Canvas>
            </div>

            {/* Footer / Readout Layer */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-10 bg-slate-900/90 backdrop-blur-md border-t border-white/10">
                <div className="flex justify-between items-center max-w-2xl mx-auto">

                    <div className="text-center">
                        <div className="text-slate-400 text-xs font-mono mb-1">Total Outcomes (Ω)</div>
                        <div className="text-2xl font-bold text-white tabular-nums">{total}</div>
                    </div>

                    <div className="h-8 w-px bg-slate-700" />

                    <div className="text-center">
                        <div className="text-slate-400 text-xs font-mono mb-1">Event Occurrences (A)</div>
                        <div className="text-2xl font-bold text-emerald-400 tabular-nums">{hits}</div>
                    </div>

                    <div className="h-8 w-px bg-slate-700" />

                    <div className="text-center">
                        <div className="text-slate-400 text-xs font-mono mb-1">Measure P(A)</div>
                        <div className="flex items-end justify-center gap-2">
                            <div className="text-3xl font-bold text-fuchsia-400 tabular-nums">{probStr}</div>
                            <div className="text-xs text-slate-500 mb-1">True Area Rank: {trueProb.toFixed(2)}</div>
                        </div>

                    </div>

                </div>
                {/* 1D [0,1] Mapping visualization */}
                <div className="mt-4 px-4 w-full">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                        <span>P(A) = 0</span>
                        <span>[0, 1] Interval</span>
                        <span>P(A) = 1</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                        {/* Target theoretical prob */}
                        <div className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10" style={{ left: `${trueProb * 100}%` }}></div>
                        {/* Actual measured prob */}
                        <div
                            className="h-full bg-gradient-to-r from-fuchsia-600 to-emerald-500 transition-all duration-300"
                            style={{ width: `${(hits / (total || 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
