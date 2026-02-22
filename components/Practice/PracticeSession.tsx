
import React, { useState, useCallback } from 'react';
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

    const handleWarmupComplete = useCallback(() => {
        setStep(PracticeStep.MAIN);
    }, []);

    const handleMainRecordingComplete = useCallback(async (blob: Blob) => {
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
                        <p className="text-lg text-gray-200 bg-gray-700/50 p-4 rounded-lg">{exercise.content.text}</p>
                        <Recorder onRecordingComplete={handleWarmupComplete} />
                    </div>
                );
            case PracticeStep.MAIN:
                return (
                    <div className="text-center space-y-6">
                        <h3 className="text-xl font-bold text-white">Main Exercise</h3>
                        <p className="text-gray-400">Great! Now, let's do it for real. Focus on the module objectives and give it your best shot. This one is for feedback.</p>
                        <p className="text-lg text-gray-200 bg-gray-700/50 p-4 rounded-lg">{exercise.content.text}</p>
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
