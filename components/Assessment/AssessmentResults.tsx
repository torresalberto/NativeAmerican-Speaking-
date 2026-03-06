
import React from 'react';
import { DetailedAssessmentResult, PhoneticProfile, LearningPath } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { LEVEL_DEFINITIONS } from '../../data/levels';

interface AssessmentResultsProps {
  result: DetailedAssessmentResult | null;
  onStartPlan: () => void;
}

const categoryDisplayMap: Record<keyof PhoneticProfile, string> = {
  flapT: 'Flap T Sound',
  connectedSpeech: 'Connected Speech',
  thSounds: 'TH Sounds',
  vowelQuality: 'Vowel Quality',
  rhythmStress: 'Rhythm & Stress',
  rSound: 'R Sound',
  intonation: 'Intonation',
};

const pathDisplayMap: Record<LearningPath, { title: string, description: string }> = {
    [LearningPath.SOUND_ACCURACY]: { title: "Sound Accuracy", description: "Focus on mastering individual English sounds." },
    [LearningPath.CONNECTED_SPEECH]: { title: "Connected Speech", description: "Learn to link words together smoothly." },
    [LearningPath.RHYTHM_FLOW]: { title: "Rhythm & Flow", description: "Work on sentence stress and intonation." },
    [LearningPath.VOCABULARY_SLANG]: { title: "Vocabulary & Slang", description: "Expand your word choice and cultural fluency." },
};

const PriorityBadge: React.FC<{ priority: 'high' | 'medium' | 'low' | undefined }> = ({ priority }) => {
    if (!priority) return null;
    const styles = {
        'high': 'bg-red-500/80 border-red-400',
        'medium': 'bg-yellow-500/80 border-yellow-400',
        'low': 'bg-green-500/80 border-green-400',
    }
    return <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full border ${styles[priority]}`}>{priority}</span>
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, onStartPlan }) => {
  if (!result) {
    return (
      <div className="text-center">
        <p>Loading assessment results...</p>
      </div>
    );
  }
  
  const levelDef = LEVEL_DEFINITIONS.find(def => def.name === result.levelName);

  return (
    <div className="flex flex-col items-center text-center animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white">Here's Your Detailed Profile</h2>
      
      <div className="w-full max-w-sm">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Your Overall Score</p>
          <p className="text-4xl font-bold text-indigo-400">{result.overallLevel * 10} / 100</p>
          <p className="text-lg font-semibold text-white">{result.levelName}</p>
        </div>
      </div>
      
      {levelDef && (
        <div className="w-full text-left bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-bold text-indigo-300 mb-2 text-xl text-center">{levelDef.name} Level</h3>
          <p className="text-center text-gray-300 italic mb-4">"{levelDef.description}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 p-3 rounded">
              <h4 className="font-semibold text-white mb-2">✅ What you can do:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {levelDef.canDo.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div className="bg-gray-800/50 p-3 rounded">
              <h4 className="font-semibold text-white mb-2">💪 What you're working on:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {levelDef.workingOn.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-400">Target time to next level: <span className="font-semibold">{levelDef.targetTimeToNextLevel}</span></p>
          </div>
        </div>
      )}

      <div className="w-full text-left bg-gray-700/50 p-4 rounded-lg">
        <h3 className="font-bold text-indigo-300 mb-4 text-center">Phonetic Breakdown</h3>
        <div className="space-y-4">
          {(Object.keys(result.phoneticProfile) as Array<keyof PhoneticProfile>).map((key) => {
            const analysis = result.phoneticProfile[key];
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-white">{categoryDisplayMap[key]}</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-300">{analysis.score * 10} / 100</p>
                    <PriorityBadge priority={analysis.priority} />
                  </div>
                </div>
                <ProgressBar score={analysis.score * 10} />
                <p className="text-xs text-gray-400 mt-1 italic">"{analysis.feedback}"</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full text-left bg-gray-700/50 p-4 rounded-lg">
        <h3 className="font-bold text-indigo-300 mb-2">Key Takeaways</h3>
        <div className="space-y-2 text-sm">
            <p><strong className="text-green-400">👍 Top Strength:</strong> {result.topStrength}</p>
            <p><strong className="text-yellow-400">🎯 Primary Focus:</strong> {result.primaryFocus}</p>
            <p><strong className="text-blue-400">👀 Secondary Focus:</strong> {result.secondaryFocus}</p>
        </div>
      </div>

      <div className="w-full text-left bg-gray-700/50 p-4 rounded-lg">
        <h3 className="font-bold text-indigo-300 mb-2">Your Recommended Path</h3>
        <p className="text-white font-semibold">{pathDisplayMap[result.recommendedPath].title}</p>
        <p className="text-gray-300 text-sm mb-3">{pathDisplayMap[result.recommendedPath].description}</p>
        <p className="text-gray-200 italic">"{result.encouragement}"</p>
      </div>
      
      <Button onClick={onStartPlan}>
        Let's Start My Plan!
      </Button>
    </div>
  );
};

export default AssessmentResults;
