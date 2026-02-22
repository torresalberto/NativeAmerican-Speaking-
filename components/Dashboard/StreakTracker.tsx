
import React from 'react';
import { UserProgress } from '../../types';

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-900/50 rounded-full flex items-center justify-center text-indigo-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </div>
);

interface StreakTrackerProps {
  userProgress: UserProgress;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ userProgress }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" /></svg>}
            label="Practice Streak"
            value={`${userProgress.streakDays} Days`}
        />
         <StatCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            label="Sessions Completed"
            value={userProgress.totalSessions}
        />
    </div>
);

export default StreakTracker;
