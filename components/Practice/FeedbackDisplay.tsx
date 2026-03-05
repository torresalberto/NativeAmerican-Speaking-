
import React from 'react';
import { DetailedFeedback, FeatureAnalysis } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

interface FeedbackDisplayProps {
  feedback: DetailedFeedback;
  onContinue: () => void;
}

const FeatureAnalysisCard: React.FC<{ analysis: FeatureAnalysis }> = ({ analysis }) => (
    <div className="border-b border-gray-700 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0">
        <div className="flex justify-between items-center">
            <p className="font-semibold text-white">{analysis.feature}</p>
            <p className="font-bold text-indigo-300">{analysis.score * 10}</p>
        </div>
        <p className="text-xs text-gray-400 italic bg-gray-800 p-2 rounded mt-1">
            <span className="font-semibold text-gray-300">How it looks:</span> "{analysis.howItLooks}" → <span className="font-semibold text-gray-300">How it sounds:</span> "{analysis.howItSounds}"
        </p>
        <p className="text-xs text-gray-300 mt-2"><strong className="text-blue-300">💡 Tip:</strong> {analysis.tip}</p>
    </div>
);


const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, onContinue }) => {
  return (
    <div className="flex flex-col animate-fade-in space-y-6 w-full text-left max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        <header className="text-center bg-gray-900/50 p-6 rounded-3xl border border-white/5">
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Session Result</p>
            <div className="flex items-center justify-center space-x-4">
               <p className="text-7xl font-black text-gradient leading-none">{feedback.overallScore * 10}</p>
               <div className="text-left">
                  <p className="text-2xl font-bold text-white leading-tight">Great effort!</p>
                  <p className="text-gray-500 font-medium">out of 100 points</p>
               </div>
            </div>
        </header>

        {feedback.mispronouncedWords && feedback.mispronouncedWords.length > 0 && (
           <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <h4 className="font-bold text-rose-400 flex items-center mb-3">
                 <span className="mr-2">🎯</span> Words to watch out for
              </h4>
              <div className="flex flex-wrap gap-2">
                 {feedback.mispronouncedWords.map((word, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-500/20 text-rose-200 rounded-full text-sm font-bold border border-rose-500/30">
                       {word}
                    </span>
                 ))}
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <h4 className="font-bold text-emerald-400 flex items-center mb-2">
                 <span className="mr-2">⭐</span> Coach's Praise
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{feedback.celebration}</p>
           </div>

           <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <h4 className="font-bold text-amber-400 flex items-center mb-2">
                 <span className="mr-2">🔥</span> Top Priority
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{feedback.oneThingToFix}</p>
           </div>
        </div>
        
        {feedback.improvementSuggestions && feedback.improvementSuggestions.length > 0 && (
           <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
              <h4 className="font-bold text-indigo-400 flex items-center mb-3">
                 <span className="mr-2">💡</span> Pro Tips
              </h4>
              <ul className="space-y-2">
                 {feedback.improvementSuggestions.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                       <span className="text-indigo-400 mr-2">•</span> {tip}
                    </li>
                 ))}
              </ul>
           </div>
        )}

        <div className="p-6 bg-gray-800/30 rounded-3xl border border-white/5 shadow-inner">
            <h4 className="font-bold text-white mb-6 text-lg">Phonetic Breakdown</h4>
            <div className="space-y-6">
               {feedback.targetFeaturesAnalysis.length > 0 ? (
                   feedback.targetFeaturesAnalysis.map((feat, i) => (
                       <FeatureAnalysisCard key={i} analysis={feat} />
                   ))
               ) : (
                   <p className="text-sm text-gray-400 text-center py-4">No specific target features were analyzed for this exercise.</p>
               )}
            </div>

             <div className="grid grid-cols-3 gap-6 text-center mt-10 pt-8 border-t border-white/5">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Rhythm</p>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500" style={{ width: `${feedback.rhythm.score * 10}%` }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Clarity</p>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${feedback.clarity.score * 10}%` }}></div>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Natural</p>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500" style={{ width: `${feedback.naturalness.score * 10}%` }}></div>
                    </div>
                </div>
             </div>
        </div>

        <div className="pt-4 text-center pb-6">
            <Button onClick={onContinue} className="w-full sm:w-auto px-12 py-4 rounded-full text-lg shadow-xl shadow-indigo-500/20">Keep Going! 🚀</Button>
        </div>
    </div>
  );
};

export default FeedbackDisplay;
