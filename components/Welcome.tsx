import React, { useState } from 'react';
import { Goal } from '../types';
import { Button } from './ui/Button';
import { CONTENT_STYLES } from '../data/contentStyles';

interface WelcomeProps {
  onStart: (goal: Goal) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const [goal, setGoal] = useState<Goal>(Goal.CASUAL);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(goal);
  };

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Ready to sound like a local?</h2>
      <p className="text-gray-400 mb-6">Let's kick things off. First, tell us your main goal.</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-medium text-gray-200 mb-3">
            What's your main goal?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            {(Object.values(Goal) as Goal[]).map(g => {
                const styleInfo = CONTENT_STYLES[g];
                return (
                    <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${goal === g ? 'bg-indigo-600/30 border-indigo-500 scale-105 shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-indigo-500'}`}
                    >
                        <p className="font-semibold text-white text-center text-lg">{g}</p>
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                            <ul className="text-sm text-gray-300 space-y-1">
                                {styleInfo.characteristics.map((char, i) => 
                                    <li key={i} className="flex items-start">
                                        <svg className="w-4 h-4 mr-2 mt-0.5 text-indigo-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>{char}</span>
                                    </li>
                                )}
                            </ul>
                            <div className="mt-4 pt-3 border-t border-gray-600/50">
                                <p className="text-xs text-gray-400 mb-1">Sounds like:</p>
                                <p className="text-sm text-indigo-200 italic">"{styleInfo.examplePhrases[0]}"</p>
                            </div>
                        </div>
                    </button>
                )
            })}
          </div>
        </div>
        
        <Button type="submit">Calibrate My Level 🚀</Button>
      </form>
    </div>
  );
};

export default Welcome;
