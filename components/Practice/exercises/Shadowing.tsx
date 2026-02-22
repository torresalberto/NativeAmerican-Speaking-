
import React from 'react';
import { TargetedScript, TargetInstance } from '../../../types';
import { Recorder } from '../../ui/Recorder';

interface ShadowingProps {
  script: TargetedScript;
  onComplete: (blob: Blob) => void;
  mode: 'standard' | 'delayed' | 'mumble';
}

// Helper function to render the script with highlighted target phrases
const renderHighlightedScript = (scriptText: string, targets: TargetInstance[]) => {
    if (!targets || targets.length === 0) {
        return <p className="text-lg text-gray-200 leading-relaxed">{scriptText}</p>;
    }

    // Create a regex that finds any of the target phrases
    const regex = new RegExp(`(${targets.map(t => t.phrase).join('|')})`, 'g');
    const parts = scriptText.split(regex);

    return (
        <p className="text-lg text-gray-200 leading-relaxed">
            {parts.map((part, index) => 
                targets.some(t => t.phrase === part) ? (
                    <span key={index} className="bg-indigo-900/60 text-indigo-200 font-semibold rounded px-1.5 py-0.5 mx-0.5">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </p>
    );
};

const ShadowingExercise: React.FC<ShadowingProps> = ({ script, onComplete, mode }) => {
    const modeDetails = {
        standard: {
            title: "Standard Shadowing",
            instructions: "Your goal is to speak at the exact same time as the model speaker. Match their rhythm, intonation, and speed perfectly. Don't fall behind!"
        },
        delayed: {
            title: "Delayed Shadowing",
            instructions: "Listen to a short phrase from the speaker, and then repeat it exactly as you heard it during the pause. Focus on precise imitation."
        },
        mumble: {
            title: "Mumble Shadowing (Rhythm Practice)",
            instructions: "Forget about clear words. Your only goal is to copy the 'music' of the speech. Mumble along, matching the rhythm and intonation contours."
        }
    };

    const currentMode = modeDetails[mode];

    return (
        <div className="flex flex-col animate-fade-in space-y-4 w-full text-left">
            <header className="text-center">
                <h3 className="text-xl font-bold text-white">{currentMode.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{currentMode.instructions}</p>
            </header>

            <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-xs text-gray-400 mb-2 italic">Context: {script.context}</p>
                {renderHighlightedScript(script.script, script.targetInstances)}
            </div>

            <div className="bg-gray-900/40 p-4 rounded-lg border border-indigo-500/30">
                <h4 className="font-bold text-indigo-300 mb-3">Focus Points</h4>
                <ul className="space-y-3">
                    {script.targetInstances.map((target, index) => (
                        <li key={index} className="text-sm border-b border-gray-700 pb-2 last:border-b-0 last:pb-0">
                           <p className="font-semibold text-white">{target.phrase}</p>
                           <p className="text-gray-300 italic">
                                <span className="text-gray-400">Looks like:</span> "{target.howItLooks}" → <span className="text-gray-400">Sounds like:</span> "{target.howItSounds}"
                           </p>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="pt-2 text-center">
                 <p className="text-sm text-gray-300 mb-4">Ready? Press record and start shadowing.</p>
                <Recorder onRecordingComplete={onComplete} />
            </div>
        </div>
    );
};

export default ShadowingExercise;
