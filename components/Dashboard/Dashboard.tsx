
import React from 'react';
import { UserProgress, LearningPathDefinition } from '../../types';
import { Button } from '../ui/Button';
import LevelBadge from './LevelBadge';
import StreakTracker from './StreakTracker';
import PathOverview from '../LearningPath/PathOverview';
import ProgressChart from './ProgressChart';
import InsightsGallery from './InsightsGallery';

interface DashboardProps {
  userProgress: UserProgress;
  learningPath: LearningPathDefinition;
  currentModuleIndex: number;
  onStartSession: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, learningPath, currentModuleIndex, onStartSession }) => {
    const currentModule = learningPath.modules[currentModuleIndex];

    return (
        <div className="flex flex-col animate-fade-in space-y-6 w-full">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Your Insider Dashboard</h2>
                <p className="text-gray-400 text-sm">Mapping your transition to American English.</p>
            </header>

            <LevelBadge userProgress={userProgress} />
            <StreakTracker userProgress={userProgress} />

            <div className="w-full text-center bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/30 shadow-xl shadow-indigo-500/5">
                <h3 className="font-black text-xs text-indigo-400 uppercase tracking-widest mb-2">Target for Today</h3>
                <p className="text-white text-xl font-bold">{currentModule ? currentModule.name : "Path Complete!"}</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">{currentModule ? currentModule.description : "You've mastered this path."}</p>
                <Button onClick={onStartSession} className="mt-5 w-full sm:w-auto px-10 shadow-lg shadow-indigo-500/20">
                    {currentModule ? `Resume Module ${currentModuleIndex + 1}` : "Review Path"}
                </Button>
            </div>
            
            <ProgressChart phoneticProfile={userProgress.phoneticProfile} />

            <InsightsGallery insights={userProgress.strategicInsights} />

            <PathOverview 
                userProgress={userProgress}
                learningPath={learningPath}
                currentModuleIndex={currentModuleIndex}
            />
        </div>
    );
};

export default Dashboard;
