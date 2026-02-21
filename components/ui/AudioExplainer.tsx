"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────── Types ─────────────────────── */

export interface AudioSection {
    title: string;
    text: string;
}

interface AudioExplainerProps {
    sections: AudioSection[];
    accentColor?: string;       // tailwind color name, e.g. "indigo"
}

/* ─────────────────────── Component ─────────────────────── */

export default function AudioExplainer({
    sections,
    accentColor = "indigo",
}: AudioExplainerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentSection, setCurrentSection] = useState(0);
    const [rate, setRate] = useState(1.0);
    const [progress, setProgress] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>("");
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const totalCharsRef = useRef(0);
    const spokenCharsRef = useRef(0);

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const v = speechSynthesis.getVoices().filter(
                voice => voice.lang.startsWith("en")
            );
            setVoices(v);
            if (v.length > 0 && !selectedVoice) {
                // Prefer a natural-sounding English voice
                const preferred = v.find(
                    voice =>
                        voice.name.includes("Samantha") ||
                        voice.name.includes("Daniel") ||
                        voice.name.includes("Google") ||
                        voice.name.includes("Natural")
                );
                setSelectedVoice(preferred?.name || v[0].name);
            }
        };
        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;
        return () => { speechSynthesis.onvoiceschanged = null; };
    }, [selectedVoice]);

    // Compute total character count
    useEffect(() => {
        totalCharsRef.current = sections.reduce((sum, s) => sum + s.title.length + s.text.length + 10, 0);
    }, [sections]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            speechSynthesis.cancel();
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, []);

    const startProgressTracking = useCallback((textLength: number) => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        const startTime = Date.now();
        const estimatedDuration = (textLength / 150) * 60 * 1000 / rate; // ~150 words/min base
        progressTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const sectionProgress = Math.min(elapsed / estimatedDuration, 1);
            const baseChars = sections.slice(0, currentSection).reduce(
                (sum, s) => sum + s.title.length + s.text.length + 10, 0
            );
            const sectionChars = sections[currentSection]
                ? sections[currentSection].title.length + sections[currentSection].text.length + 10
                : 0;
            const totalProgress = (baseChars + sectionChars * sectionProgress) / totalCharsRef.current;
            setProgress(Math.min(totalProgress * 100, 100));
        }, 200);
    }, [currentSection, rate, sections]);

    const speakSection = useCallback((index: number) => {
        if (index >= sections.length) {
            // Done
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSection(0);
            setProgress(100);
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            setTimeout(() => setProgress(0), 2000);
            return;
        }

        const section = sections[index];
        const fullText = `${section.title}. ${section.text}`;
        const utterance = new SpeechSynthesisUtterance(fullText);

        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = 1;

        utterance.onstart = () => {
            setCurrentSection(index);
            startProgressTracking(fullText.length);
        };

        utterance.onend = () => {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
            speakSection(index + 1);
        };

        utterance.onerror = (e) => {
            if (e.error !== 'interrupted') {
                console.error('Speech error:', e.error);
                setIsPlaying(false);
                setIsPaused(false);
            }
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
    }, [sections, voices, selectedVoice, rate, startProgressTracking]);

    const handlePlay = useCallback(() => {
        if (isPaused) {
            speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            startProgressTracking(
                sections[currentSection].text.length + sections[currentSection].title.length
            );
            return;
        }

        speechSynthesis.cancel();
        setIsPlaying(true);
        setIsPaused(false);
        setProgress(0);
        speakSection(0);
    }, [isPaused, currentSection, sections, speakSection, startProgressTracking]);

    const handlePause = useCallback(() => {
        speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }, []);

    const handleStop = useCallback(() => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSection(0);
        setProgress(0);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }, []);

    const jumpToSection = useCallback((index: number) => {
        speechSynthesis.cancel();
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setCurrentSection(index);
        setIsPlaying(true);
        setIsPaused(false);
        speakSection(index);
    }, [speakSection]);

    const active = isPlaying || isPaused;
    const accent = accentColor;

    return (
        <div className={`rounded-xl border overflow-hidden transition-all shadow-sm ${active
                ? `border-${accent}-300 bg-gradient-to-br from-${accent}-50 to-white`
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}>
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-5 py-4 flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    {/* Waveform icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? `bg-${accent}-600` : `bg-${accent}-100`
                        } transition-colors`}>
                        {isPlaying ? (
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-0.5 bg-white rounded-full"
                                        animate={{
                                            height: [4, 12, 6, 14, 4],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                className={active ? "text-white" : `text-${accent}-600`}>
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" />
                                <line x1="12" y1="19" x2="12" y2="23"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>

                    <div className="text-left">
                        <h4 className="font-bold text-slate-800 text-sm">
                            🎧 Audio Explanation
                            <span className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700`}>
                                EXPERIMENTAL
                            </span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isPlaying
                                ? `Playing: ${sections[currentSection]?.title}`
                                : isPaused
                                    ? `Paused: ${sections[currentSection]?.title}`
                                    : `${sections.length} sections · listen while you learn`}
                        </p>
                    </div>
                </div>

                <svg
                    className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Progress bar */}
            {active && (
                <div className="h-1 bg-slate-100">
                    <motion.div
                        className={`h-full bg-${accent}-500`}
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            )}

            {/* Expanded panel */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-3 space-y-4">
                            {/* Playback controls */}
                            <div className="flex items-center gap-2">
                                {!isPlaying ? (
                                    <button
                                        onClick={handlePlay}
                                        className={`flex items-center gap-2 px-4 py-2 bg-${accent}-600 hover:bg-${accent}-700 text-white rounded-lg text-sm font-semibold transition-colors`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M5 3l14 9-14 9z" />
                                        </svg>
                                        {isPaused ? "Resume" : "Play All"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePause}
                                        className={`flex items-center gap-2 px-4 py-2 bg-${accent}-600 hover:bg-${accent}-700 text-white rounded-lg text-sm font-semibold transition-colors`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="5" y="3" width="4" height="18" />
                                            <rect x="15" y="3" width="4" height="18" />
                                        </svg>
                                        Pause
                                    </button>
                                )}

                                {active && (
                                    <button
                                        onClick={handleStop}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                        </svg>
                                        Stop
                                    </button>
                                )}

                                {/* Speed control */}
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Speed</span>
                                    <div className="flex bg-slate-100 rounded-lg p-0.5">
                                        {[0.75, 1.0, 1.25, 1.5].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => {
                                                    setRate(r);
                                                    // Re-start current section with new rate if playing
                                                    if (isPlaying) {
                                                        speechSynthesis.cancel();
                                                        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
                                                        setTimeout(() => speakSection(currentSection), 100);
                                                    }
                                                }}
                                                className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${rate === r
                                                        ? `bg-white text-${accent}-700 shadow-sm`
                                                        : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                {r}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Voice selector */}
                            {voices.length > 1 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 whitespace-nowrap">Voice</span>
                                    <select
                                        value={selectedVoice}
                                        onChange={e => setSelectedVoice(e.target.value)}
                                        className="text-xs bg-slate-100 border-none rounded-lg px-3 py-1.5 text-slate-700 w-full"
                                    >
                                        {voices.map(v => (
                                            <option key={v.name} value={v.name}>
                                                {v.name} ({v.lang})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Section list */}
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                                    Sections
                                </p>
                                {sections.map((section, i) => (
                                    <button
                                        key={i}
                                        onClick={() => jumpToSection(i)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${i === currentSection && active
                                                ? `bg-${accent}-100 text-${accent}-800 font-semibold`
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === currentSection && active
                                                ? `bg-${accent}-600 text-white`
                                                : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {i === currentSection && isPlaying ? (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    ♪
                                                </motion.span>
                                            ) : (
                                                i + 1
                                            )}
                                        </span>
                                        <span className="truncate">{section.title}</span>
                                        <span className="ml-auto text-[10px] text-slate-400">
                                            {Math.ceil(section.text.split(' ').length / 150)}m
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <p className="text-[10px] text-slate-400 text-center pt-1">
                                Uses your browser&apos;s text-to-speech engine · quality varies by browser
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
