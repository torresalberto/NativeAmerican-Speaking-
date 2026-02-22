
import React from 'react';
import { Button } from '../ui/Button';

interface PathCompleteProps {
  onRestart: () => void;
}

const PathComplete: React.FC<PathCompleteProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in space-y-6">
      <h2 className="text-3xl font-bold text-indigo-400">🎉 Path Complete! 🎉</h2>
      <p className="text-lg text-gray-300">
        Congratulations! You've completed all the modules in this learning path. You've taken a huge step towards sounding more natural.
      </p>
      <p className="text-gray-400">
        Keep practicing what you've learned. When you're ready for the next challenge, you can start a new journey.
      </p>
      <Button onClick={onRestart}>
        Start a New Journey
      </Button>
    </div>
  );
};

export default PathComplete;
