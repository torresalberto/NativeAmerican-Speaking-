
import React from 'react';
import { PhoneticProfile } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

interface ProgressChartProps {
    phoneticProfile: PhoneticProfile;
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

const ProgressChart: React.FC<ProgressChartProps> = ({ phoneticProfile }) => {
    return (
        <div className="w-full text-left bg-gray-700/50 p-4 rounded-lg">
            <h3 className="font-bold text-indigo-300 mb-4 text-center">Your Phonetic Profile</h3>
            <div className="space-y-3">
                {(Object.keys(phoneticProfile) as Array<keyof PhoneticProfile>).map((key) => {
                    const analysis = phoneticProfile[key];
                    if (!analysis) return null;
                    
                    return (
                        <div key={key}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <p className="font-semibold text-white">{categoryDisplayMap[key]}</p>
                                <p className="font-medium text-gray-300">{analysis.score * 10} / 100</p>
                            </div>
                            <ProgressBar score={analysis.score * 10} />
                        </div>
                    );
                })}
            </div>
      </div>
    );
};

export default ProgressChart;
