
import React from 'react';
import { UserProgress } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

interface LevelBadgeProps {
  userProgress: UserProgress;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ userProgress }) => (
    <div className="w-full bg-gray-700/50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-white">Your Level: <span className="text-indigo-300">{userProgress.currentLevelName}</span></p>
            <p className="text-sm font-bold text-indigo-300">{userProgress.currentLevel * 10}<span className="text-gray-400">/100</span></p>
        </div>
        <ProgressBar score={userProgress.currentLevel * 10} />
        <p className="text-xs text-gray-400 mt-1 text-right">Level up to unlock new challenges!</p>
    </div>
);

export default LevelBadge;
