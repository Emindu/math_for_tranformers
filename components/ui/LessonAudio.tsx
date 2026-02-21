"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2, Pause } from 'lucide-react';

interface LessonAudioProps {
    title: string;
    script: string;
}

export default function LessonAudio({ title, script }: LessonAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const synth = useRef<SpeechSynthesis | null>(null);
    const utterance = useRef<SpeechSynthesisUtterance | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;
            utterance.current = new SpeechSynthesisUtterance(script);

            // Try to find a good voice (preferably female/natural)
            const setVoice = () => {
                const voices = synth.current?.getVoices();
                if (voices && voices.length > 0 && utterance.current) {
                    const preferredVoice = voices.find(v => v.name.includes("Samantha") || v.name.includes("Google") || v.lang === "en-US");
                    utterance.current.voice = preferredVoice || voices[0];
                }
            };

            setVoice();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = setVoice;
            }

            utterance.current.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
                setProgress(0);
                if (progressInterval.current) clearInterval(progressInterval.current);
            };

            // Synthetic progress bar
            utterance.current.onstart = () => {
                // Approximate time based on word count (avg 150 words per minute)
                const wordCount = script.split(" ").length;
                const estimatedMs = (wordCount / 150) * 60 * 1000;
                let elapsed = 0;

                if (progressInterval.current) clearInterval(progressInterval.current);
                progressInterval.current = setInterval(() => {
                    elapsed += 100;
                    const pct = Math.min((elapsed / estimatedMs) * 100, 100);
                    setProgress(pct);
                }, 100);
            };

            utterance.current.onpause = () => {
                if (progressInterval.current) clearInterval(progressInterval.current);
            }

            utterance.current.onresume = () => {
                // Restart the progress approximation
                const wordCount = script.split(" ").length;
                const estimatedMs = (wordCount / 150) * 60 * 1000;
                let elapsed = (progress / 100) * estimatedMs;

                if (progressInterval.current) clearInterval(progressInterval.current);
                progressInterval.current = setInterval(() => {
                    elapsed += 100;
                    const pct = Math.min((elapsed / estimatedMs) * 100, 100);
                    setProgress(pct);
                }, 100);
            }
        }

        return () => {
            if (synth.current) {
                synth.current.cancel();
            }
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [script]);

    const handlePlayPause = () => {
        if (!synth.current || !utterance.current) return;

        if (isPlaying && !isPaused) {
            synth.current.pause();
            setIsPaused(true);
        } else if (isPlaying && isPaused) {
            synth.current.resume();
            setIsPaused(false);
        } else {
            synth.current.cancel(); // Reset any existing speech
            synth.current.speak(utterance.current);
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        if (!synth.current) return;
        synth.current.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
    };

    return (
        <div className="bg-white border rounded-full p-2 flex items-center justify-between shadow-sm my-6 max-w-md border-indigo-100 relative overflow-hidden">
            {/* Progress background */}
            <div
                className="absolute top-0 left-0 h-full bg-indigo-50/50 -z-10 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
            />

            <div className="flex items-center gap-3 pl-2">
                <Volume2 size={16} className="text-indigo-400" />
                <span className="text-sm font-semibold text-slate-700">Audio Track:</span>
                <span className="text-sm text-slate-500 truncate">{title}</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={handlePlayPause}
                    className="w-8 h-8 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center transition-colors shadow-inner"
                    title={isPlaying && !isPaused ? "Pause" : "Play"}
                >
                    {isPlaying && !isPaused ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
                {isPlaying && (
                    <button
                        onClick={handleStop}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                        title="Stop"
                    >
                        <Square size={12} fill="currentColor" />
                    </button>
                )}
            </div>
        </div>
    );
}
