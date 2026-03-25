
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Exercise, PathModule, DetailedFeedback, Level } from '../../types';
import { analyzeAudioDetailed } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Recorder } from '../ui/Recorder';
import FeedbackDisplay from './FeedbackDisplay';

enum PracticeStep {
  WARMUP,
  MAIN,
  FEEDBACK,
  SUMMARY,
}

interface PracticeSessionProps {
  exercise: Exercise;
  level: Level;
  module: PathModule;
  moduleNumber: number;
  onSessionComplete: () => void;
}

const PracticeSession: React.FC<PracticeSessionProps> = ({ exercise, level, module, moduleNumber, onSessionComplete }) => {
    const [step, setStep] = useState<PracticeStep>(PracticeStep.WARMUP);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [mainFeedback, setMainFeedback] = useState<DetailedFeedback | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handleWarmupComplete = useCallback(() => {
        setStep(PracticeStep.MAIN);
    }, []);

    const handleMainRecordingComplete = useCallback(async (blob: Blob) => {
        if (!exercise.content?.text) {
            console.error("No exercise text available for analysis");
            setStep(PracticeStep.SUMMARY);
            return;
        }
        setIsAnalyzing(true);
        try {
            const analysis = await analyzeAudioDetailed(exercise.content.text, blob, module.objectives, level);
            setMainFeedback(analysis);
            setStep(PracticeStep.FEEDBACK);
        } catch (error) {
            console.error("Error analyzing main recording:", error);
            // In a real app, you'd show an error message to the user
            // For now, we'll just move on to prevent getting stuck
            setStep(PracticeStep.SUMMARY);
        } finally {
            setIsAnalyzing(false);
        }
    }, [exercise.content.text, module.objectives, level]);

    const playModelAudio = useCallback(() => {
        if (!exercise.content?.modelPronunciation) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        try {
            let base64Data = exercise.content.modelPronunciation;
            if (base64Data.includes(',')) {
                base64Data = base64Data.split(',')[1];
            }

            const binaryString = window.atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const rawMimeType = exercise.content.modelPronunciationMimeType || 'audio/mpeg';
            const mimeType = rawMimeType.split(';')[0].toLowerCase();
            
            let blob: Blob;
            
            // If it's PCM, wrap it in a WAV header
            if (mimeType.includes('pcm')) {
                let sampleRate = 24000;
                const rateMatch = rawMimeType.match(/rate=(\d+)/);
                if (rateMatch) {
                    sampleRate = parseInt(rateMatch[1], 10);
                }

                const header = new ArrayBuffer(44);
                const view = new DataView(header);
                view.setUint32(0, 0x52494646, false);
                view.setUint32(4, 36 + bytes.length, true);
                view.setUint32(8, 0x57415645, false);
                view.setUint32(12, 0x666d7420, false);
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, 1, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * 2, true);
                view.setUint16(32, 2, true);
                view.setUint16(34, 16, true);
                view.setUint32(36, 0x64617461, false);
                view.setUint32(40, bytes.length, true);

                const wavBytes = new Uint8Array(header.byteLength + bytes.length);
                wavBytes.set(new Uint8Array(header), 0);
                wavBytes.set(bytes, header.byteLength);
                blob = new Blob([wavBytes], { type: 'audio/wav' });
            } else {
                blob = new Blob([bytes], { type: mimeType === 'audio/x-wav' ? 'audio/wav' : mimeType });
            }
            
            const url = URL.createObjectURL(blob);
            const audio = new Audio();
            audio.src = url;
            audioRef.current = audio;

            audio.onplay = () => setIsPlaying(true);
            let currentUrl = url;
            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(currentUrl);
            };
            audio.onerror = () => {
                // If source not supported, try a fallback to audio/mpeg
                if (audio.error?.code === 4 && mimeType !== 'audio/mpeg') {
                    console.log("Retrying audio with audio/mpeg fallback...");
                    URL.revokeObjectURL(currentUrl);
                    const fallbackBlob = new Blob([bytes], { type: 'audio/mpeg' });
                    currentUrl = URL.createObjectURL(fallbackBlob);
                    audio.src = currentUrl;
                    audio.play().catch(err => {
                        console.error("Fallback audio playback failed:", err);
                        setIsPlaying(false);
                        URL.revokeObjectURL(currentUrl);
                    });
                } else {
                    console.error("Audio playback error details:", audio.error);
                    setIsPlaying(false);
                    URL.revokeObjectURL(currentUrl);
                }
            };

            audio.play().catch(err => {
                console.error("Error playing audio:", err);
                setIsPlaying(false);
                URL.revokeObjectURL(currentUrl);
            });
        } catch (err) {
            console.error("Error preparing audio playback:", err);
            setIsPlaying(false);
        }
    }, [exercise.content?.modelPronunciation, exercise.content?.modelPronunciationMimeType]);


    const renderContent = () => {
        if (isAnalyzing) {
            return (
                <div className="flex flex-col items-center justify-center text-center">
                    <Spinner />
                    <p className="mt-4 text-gray-400">Your coach is listening...</p>
                    <p className="mt-2 text-sm text-indigo-300 animate-pulse">Analyzing pronunciation, rhythm, and flow...</p>
                </div>
            );
        }
        
        switch (step) {
            case PracticeStep.WARMUP:
                return (
                    <div className="text-center space-y-6">
                        <h3 className="text-xl font-bold text-white">Warm-up Round</h3>
                        <p className="text-gray-400">Let's get started. Read the sentence below into your microphone. Don't worry about perfection, this is just to warm up.</p>
                        <div className="space-y-4">
                            <p className="text-lg text-gray-200 bg-gray-700/50 p-4 rounded-lg">{exercise.content?.text || "Exercise content missing."}</p>
                            {exercise.content?.modelPronunciation && (
                                <button 
                                    onClick={playModelAudio}
                                    disabled={isPlaying}
                                    className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-full border border-indigo-500/30 transition-all"
                                >
                                    {isPlaying ? (
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.828a1 1 0 01-1.414-1.414 5 5 0 000-7.072 1 1 0 011.414-1.414 7 7 0 010 9.9z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span>{isPlaying ? 'Playing...' : 'Hear Model'}</span>
                                </button>
                            )}
                        </div>
                        <Recorder onRecordingComplete={handleWarmupComplete} />
                    </div>
                );
            case PracticeStep.MAIN:
                return (
                    <div className="text-center space-y-6">
                        <h3 className="text-xl font-bold text-white">Main Exercise</h3>
                        <p className="text-gray-400">Great! Now, let's do it for real. Focus on the module objectives and give it your best shot. This one is for feedback.</p>
                        <div className="space-y-4">
                            <p className="text-lg text-gray-200 bg-gray-700/50 p-4 rounded-lg">{exercise.content?.text || "Exercise content missing."}</p>
                            {exercise.content?.modelPronunciation && (
                                <button 
                                    onClick={playModelAudio}
                                    disabled={isPlaying}
                                    className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 rounded-full border border-indigo-500/30 transition-all"
                                >
                                    {isPlaying ? (
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 14.828a1 1 0 01-1.414-1.414 5 5 0 000-7.072 1 1 0 011.414-1.414 7 7 0 010 9.9z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span>{isPlaying ? 'Playing...' : 'Hear Model'}</span>
                                </button>
                            )}
                        </div>
                        {exercise.content.tips && (
                            <div className="text-left text-sm p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/50">
                                <h4 className="font-bold text-indigo-300 mb-2">💡 Coach's Tips:</h4>
                                <ul className="list-disc list-inside text-gray-300 space-y-1">
                                    {exercise.content.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                </ul>
                            </div>
                        )}
                        <Recorder onRecordingComplete={handleMainRecordingComplete} />
                    </div>
                );
            case PracticeStep.FEEDBACK:
                return mainFeedback ? (
                    <FeedbackDisplay feedback={mainFeedback} onContinue={() => setStep(PracticeStep.SUMMARY)} />
                ) : (
                    <p className="text-red-400">Sorry, feedback is currently unavailable.</p>
                );
            case PracticeStep.SUMMARY:
                return (
                    <div className="text-center space-y-6">
                        <h3 className="text-3xl font-bold text-indigo-400">Great Work!</h3>
                        <p className="text-gray-300">Session complete. You're one step closer to your goal. Keep up the momentum!</p>
                        <p className="text-sm text-gray-400">Your progress has been saved.</p>
                        <Button onClick={onSessionComplete}>Back to Dashboard</Button>
                    </div>
                );
        }
    };
    
    const stepNames = ['Warmup', 'Main Exercise', 'Feedback', 'Summary'];
    const currentStepIndex = Object.values(PracticeStep).indexOf(step);

    return (
        <div className="flex flex-col animate-fade-in space-y-4 w-full">
            <header className="text-center">
                 <h2 className="text-lg font-bold text-indigo-400">Module {moduleNumber}: {module.name}</h2>
                 <p className="text-sm text-gray-400">{stepNames[step]}</p>
            </header>
            
            <div className="p-4 bg-gray-900/50 rounded-lg min-h-[350px] flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    );
};

export default PracticeSession;
