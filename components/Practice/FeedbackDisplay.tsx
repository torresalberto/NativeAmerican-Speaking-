
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
    <div className="flex flex-col animate-fade-in space-y-4 w-full text-left max-h-[450px] overflow-y-auto pr-2">
        <header className="text-center">
            <h3 className="text-2xl font-bold text-white">Your Feedback</h3>
            <p className="text-gray-400 text-sm">Overall Score</p>
            <p className="text-5xl font-bold text-indigo-400">{feedback.overallScore * 10}<span className="text-3xl text-gray-500">/100</span></p>
        </header>

        <div className="p-3 bg-green-900/40 border border-green-500/50 rounded-lg">
           <h4 className="font-bold text-green-300">👍 What you did well!</h4>
           <p className="text-gray-300 text-sm">{feedback.celebration}</p>
        </div>

        <div className="p-3 bg-yellow-900/40 border border-yellow-500/50 rounded-lg">
           <h4 className="font-bold text-yellow-300">🎯 Your #1 Focus</h4>
           <p className="text-gray-300 text-sm">{feedback.oneThingToFix}</p>
        </div>
        
        <div className="p-3 bg-gray-700/50 rounded-lg">
            <h4 className="font-bold text-indigo-300 mb-3 text-center">Detailed Analysis</h4>
            {feedback.targetFeaturesAnalysis.length > 0 ? (
                feedback.targetFeaturesAnalysis.map((feat, i) => (
                    <FeatureAnalysisCard key={i} analysis={feat} />
                ))
            ) : (
                <p className="text-sm text-gray-400 text-center">No specific target features were analyzed for this exercise.</p>
            )}

             <div className="grid grid-cols-3 gap-3 text-center mt-4 border-t border-gray-600 pt-3">
                <div>
                    <p className="text-sm text-gray-400">Rhythm</p>
                    <ProgressBar score={feedback.rhythm.score * 10} />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Clarity</p>
                    <ProgressBar score={feedback.clarity.score * 10} />
                </div>
                <div>
                    <p className="text-sm text-gray-400">Naturalness</p>
                    <ProgressBar score={feedback.naturalness.score * 10} />
                </div>
             </div>
        </div>

         <div className="p-3 bg-blue-900/40 border border-blue-500/50 rounded-lg">
           <h4 className="font-bold text-blue-300"> COACH'S RECOMMENDATION</h4>
           <p className="text-gray-300 text-sm">{feedback.practiceRecommendation}</p>
        </div>

        <div className="pt-2 text-center">
            <Button onClick={onContinue}>Got It, Continue!</Button>
        </div>
    </div>
  );
};

export default FeedbackDisplay;
