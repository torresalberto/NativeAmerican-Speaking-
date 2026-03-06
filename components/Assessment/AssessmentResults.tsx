
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
      <header>
        <h2 className="text-2xl font-bold text-white">Your Insider Profile</h2>
        <p className="text-gray-400 text-sm mt-1">Bridging the gap from Mexican-Spanish logic to American fluency.</p>
      </header>
      
      <div className="w-full max-w-sm">
        <div className="bg-gray-900 border border-indigo-500/30 rounded-lg p-6 shadow-xl">
          <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">Insider Score</p>
          <p className="text-6xl font-black text-indigo-400 my-2">{result.overallLevel * 10}<span className="text-2xl text-gray-600">/100</span></p>
          <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-full">
            <p className="text-lg font-bold text-indigo-300 uppercase tracking-tight">{result.levelName}</p>
          </div>
        </div>
      </div>
      
      {levelDef && (
        <div className="w-full text-left bg-indigo-900/20 border border-indigo-500/20 p-5 rounded-xl shadow-inner">
          <h3 className="font-black text-indigo-300 mb-2 text-xl text-center">The {levelDef.name} Reality</h3>
          <p className="text-center text-gray-300 italic mb-6 leading-relaxed">"{levelDef.description}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-800">
              <h4 className="font-bold text-green-400 mb-3 uppercase text-xs tracking-widest">✅ Current Assets</h4>
              <ul className="space-y-2 text-gray-300">
                {levelDef.canDo.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-green-500">•</span> {item}</li>)}
              </ul>
            </div>
            <div className="bg-gray-900/60 p-4 rounded-lg border border-gray-800">
              <h4 className="font-bold text-yellow-400 mb-3 uppercase text-xs tracking-widest">🚀 Breakthrough Goals</h4>
              <ul className="space-y-2 text-gray-300">
                {levelDef.workingOn.map((item, i) => <li key={i} className="flex items-start gap-2"><span className="text-yellow-500">•</span> {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="w-full text-left bg-gray-900/40 p-5 rounded-xl border border-gray-800">
        <h3 className="font-bold text-indigo-300 mb-5 text-center uppercase tracking-widest text-sm">Phonetic Diagnostic</h3>
        <div className="space-y-6">
          {(Object.keys(result.phoneticProfile) as Array<keyof PhoneticProfile>).map((key) => {
            const analysis = result.phoneticProfile[key];
            const isVibeKiller = analysis.priority === 'high' && analysis.score < 6;
            return (
              <div key={key} className={`p-3 rounded-lg transition-colors ${isVibeKiller ? 'bg-red-500/5 border border-red-500/20' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <p className={`font-bold ${isVibeKiller ? 'text-red-400' : 'text-white'}`}>
                    {categoryDisplayMap[key]}
                    {isVibeKiller && <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">Vibe Killer</span>}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-gray-400">{analysis.score * 10}</p>
                    <PriorityBadge priority={analysis.priority} />
                  </div>
                </div>
                <ProgressBar score={analysis.score * 10} />
                <p className="text-xs text-gray-400 mt-2 leading-relaxed italic border-l-2 border-gray-700 pl-3">"{analysis.feedback}"</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="font-bold text-green-400 text-xs uppercase mb-1">Top Strength</h4>
            <p className="text-gray-200 text-sm">{result.topStrength}</p>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <h4 className="font-bold text-red-400 text-xs uppercase mb-1">Critical Focus</h4>
            <p className="text-gray-200 text-sm">{result.primaryFocus}</p>
        </div>
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-bold text-blue-400 text-xs uppercase mb-1">Second Priority</h4>
            <p className="text-gray-200 text-sm">{result.secondaryFocus}</p>
        </div>
      </div>

      <div className="w-full text-left bg-indigo-900/40 border-2 border-indigo-500/50 p-6 rounded-2xl shadow-lg">
        <h3 className="font-black text-white mb-1 text-lg uppercase tracking-tight">Your Action Plan</h3>
        <p className="text-indigo-200 font-bold text-xl mb-2">{pathDisplayMap[result.recommendedPath].title}</p>
        <p className="text-indigo-100 text-sm mb-4 leading-snug">{pathDisplayMap[result.recommendedPath].description}</p>
        <p className="text-white italic bg-indigo-500/20 p-3 rounded-lg border border-indigo-400/30">"{result.encouragement}"</p>
      </div>
      
      <Button onClick={onStartPlan} className="w-full py-4 text-xl shadow-xl shadow-indigo-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all">
        Start My Breakthrough 🚀
      </Button>
    </div>
  );
};

export default AssessmentResults;
