
import React from 'react';
// FIX: UserProgress is exported from types.ts, not store/userProgress.ts.
import { UserProgress, LearningPathDefinition } from '../../types';

interface PathOverviewProps {
  userProgress: UserProgress;
  learningPath: LearningPathDefinition;
  currentModuleIndex: number;
}

const PathOverview: React.FC<PathOverviewProps> = ({ userProgress, learningPath, currentModuleIndex }) => {
    return (
        <div className="w-full text-left">
            <h4 className="font-bold text-lg text-white mb-3 text-center">Your Learning Path: <span className="text-indigo-300">{learningPath.name}</span></h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {learningPath.modules.map((module, index) => {
                    const isCompleted = userProgress.completedModules.includes(module.id);
                    const isCurrent = index === currentModuleIndex;
                    return (
                        <div key={module.id} className={`p-3 rounded-lg flex items-center space-x-3 transition-all ${isCurrent ? 'bg-indigo-600/30 border border-indigo-500' : 'bg-gray-700/60'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-indigo-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <div>
                                <h5 className={`font-semibold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{module.name}</h5>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PathOverview;
