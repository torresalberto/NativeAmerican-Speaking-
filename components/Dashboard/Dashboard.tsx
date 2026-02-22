
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
        <div className="flex flex-col animate-fade-in space-y-6 w-full">
            <header className="text-center">
                <h2 className="text-2xl font-bold text-white">Your Dashboard</h2>
                <p className="text-gray-400">Ready for your next step, Insider?</p>
            </header>

            <LevelBadge userProgress={userProgress} />
            <StreakTracker userProgress={userProgress} />

            <div className="w-full text-center bg-gray-900/40 p-6 rounded-lg border border-indigo-500/50">
                <h3 className="font-bold text-lg text-indigo-300">Today's Session</h3>
                <p className="text-white mt-1 text-xl font-semibold">{currentModule ? currentModule.name : "Path Complete!"}</p>
                <p className="text-gray-400 text-sm mt-1">{currentModule ? currentModule.description : "You've mastered this path."}</p>
                <Button onClick={onStartSession} className="mt-4">
                    {currentModule ? `Start Module ${currentModuleIndex + 1}` : "Review Path"}
                </Button>
            </div>
            
            <ProgressChart phoneticProfile={userProgress.phoneticProfile} />

            <PathOverview 
                userProgress={userProgress}
                learningPath={learningPath}
                currentModuleIndex={currentModuleIndex}
            />
        </div>
    );
};

export default Dashboard;
