
import React from 'react';
import { UserProgress, LearningPathDefinition } from '../../types';
import { Button } from '../ui/Button';
import LevelBadge from './LevelBadge';
import StreakTracker from './StreakTracker';
import PathOverview from '../LearningPath/PathOverview';
import ProgressChart from './ProgressChart';

interface DashboardProps {
  userProgress: UserProgress;
  learningPath: LearningPathDefinition;
  currentModuleIndex: number;
  onStartSession: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, learningPath, currentModuleIndex, onStartSession }) => {
    const currentModule = learningPath.modules[currentModuleIndex];

    return (
        <div className="flex flex-col animate-fade-in space-y-8 w-full">
            <header className="flex flex-col items-center">
                <div className="flex items-center space-x-2 bg-white/5 px-4 py-1 rounded-full border border-white/10 mb-4">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Learning Session</p>
                </div>
                <h2 className="text-3xl font-black text-white">Welcome back, Insider</h2>
                <p className="text-gray-400 font-medium">Your journey to authentic fluency continues.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LevelBadge userProgress={userProgress} />
                <StreakTracker userProgress={userProgress} />
            </div>

            <div className="w-full text-center bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                <h3 className="font-bold text-sm text-indigo-400 uppercase tracking-widest mb-2">Next Milestone</h3>
                <p className="text-2xl font-black text-white tracking-tight">{currentModule ? currentModule.name : "Path Complete!"}</p>
                <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">{currentModule ? currentModule.description : "You've mastered every module in this journey."}</p>
                
                <Button onClick={onStartSession} className="mt-8 px-10 py-4 rounded-full text-lg shadow-xl shadow-indigo-500/20">
                    {currentModule ? `Resume Module ${currentModuleIndex + 1}` : "Explore New Paths"}
                </Button>
            </div>

            {currentModule && currentModule.vocabulary && currentModule.vocabulary.length > 0 && (
               <div className="bg-gray-800/30 p-6 rounded-3xl border border-white/5">
                  <h3 className="font-bold text-white mb-4 flex items-center">
                     <span className="mr-2">📚</span> Quick Vocabulary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {currentModule.vocabulary.slice(0, 4).map((v, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-2xl border border-white/5">
                           <div>
                              <p className="text-indigo-300 font-bold">{v.word}</p>
                              <p className="text-xs text-gray-500 font-mono">{v.pronunciation}</p>
                           </div>
                           <p className="text-[10px] text-gray-400 max-w-[120px] text-right leading-tight">{v.meaning}</p>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            <ProgressChart phoneticProfile={userProgress.phoneticProfile} />

            <div className="pt-4 border-t border-white/5">
               <PathOverview 
                   userProgress={userProgress}
                   learningPath={learningPath}
                   currentModuleIndex={currentModuleIndex}
               />
            </div>
        </div>
    );
};

export default Dashboard;
