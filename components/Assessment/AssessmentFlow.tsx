
import React, { useState } from 'react';
import { AppPhase } from '../../types';
import { ASSESSMENT_TEXTS } from '../../data/assessmentTexts';
import { Spinner } from '../ui/Spinner';
import { Recorder } from '../ui/Recorder';
import { Button } from '../ui/Button';

interface AssessmentFlowProps {
  currentPhase: AppPhase;
  assessmentIndex: number;
  onSingleRecordingComplete: (recording: Blob) => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ currentPhase, assessmentIndex, onSingleRecordingComplete }) => {
  const [error, setError] = useState<string | null>(null);

  const assessmentText = ASSESSMENT_TEXTS[assessmentIndex];
  const progressPercent = ((assessmentIndex + 1) / ASSESSMENT_TEXTS.length) * 100;

  // FIX: Correct typo from ASSESSMENT_ANALYZE to ASSESSMENT_ANALYZING.
  if (currentPhase === AppPhase.ASSESSMENT_ANALYZING) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <Spinner />
        <p className="mt-4 text-gray-400">Building your phonetic profile... The AI is analyzing your recordings.</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="text-center">
            <p className="text-red-400 text-center">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Start Over</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center animate-fade-in space-y-6">
      <div className="w-full text-center">
        <p className="text-gray-400 mt-1 mb-2">Diagnostic {assessmentIndex + 1} of {ASSESSMENT_TEXTS.length}</p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
            ></div>
        </div>
        <h2 className="text-xl font-bold text-indigo-400 mt-4">Calibrating Your Profile</h2>
      </div>

      <p className="text-center text-gray-300">
        Please record yourself reading the text below. This will help the AI understand your unique pronunciation.
      </p>
      <div className="w-full p-4 bg-gray-700/50 rounded-lg">
        <p className="text-gray-200 whitespace-pre-wrap leading-relaxed font-medium text-center">{assessmentText.text}</p>
      </div>
      <Recorder onRecordingComplete={onSingleRecordingComplete} key={assessmentIndex} />
    </div>
  );
};

export default AssessmentFlow;
