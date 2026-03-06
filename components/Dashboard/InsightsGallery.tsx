
import React from 'react';

interface InsightsGalleryProps {
  insights?: string[];
}

const InsightsGallery: React.FC<InsightsGalleryProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <h3 className="font-black text-indigo-300 uppercase tracking-widest text-xs text-center">Subconscious Breakthroughs</h3>
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight, i) => (
          <div 
            key={i} 
            className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:border-indigo-400 transition-all"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors" />
            <div className="flex gap-3">
                <span className="text-xl">💡</span>
                <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                    {insight}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsGallery;
