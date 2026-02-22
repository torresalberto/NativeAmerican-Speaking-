
import React from 'react';

interface ProgressBarProps {
  score: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ score }) => {
  const getBarColor = () => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor()}`}
        style={{ width: `${score}%` }}
      ></div>
    </div>
  );
};
