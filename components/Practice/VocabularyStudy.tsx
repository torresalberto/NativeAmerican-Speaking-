
import React, { useState } from 'react';
import { VocabularyWord } from '../../types';
import { Button } from '../ui/Button';
import { AudioPlayer } from '../ui/AudioPlayer';
import { generateTTSAudio } from '../../services/geminiService';

interface VocabularyStudyProps {
  vocabulary: VocabularyWord[];
  onComplete: () => void;
}

const VocabularyStudy: React.FC<VocabularyStudyProps> = ({ vocabulary, onComplete }) => {
  const [audioCache, setAudioCache] = useState<Record<string, string>>({});
  const [loadingWord, setLoadingWord] = useState<string | null>(null);

  const handlePlayAudio = async (word: string) => {
    if (audioCache[word]) return;
    
    setLoadingWord(word);
    try {
      const audio = await generateTTSAudio(word);
      setAudioCache(prev => ({ ...prev, [word]: audio }));
    } catch (error) {
      console.error("Failed to load audio for word:", word);
    } finally {
      setLoadingWord(null);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in space-y-6 w-full text-left">
      <header className="text-center">
        <h3 className="text-2xl font-extrabold text-white">Target Vocabulary</h3>
        <p className="text-gray-400 text-sm">Listen and repeat to master the American accent</p>
      </header>

      <div className="space-y-4">
        {vocabulary.map((v, i) => (
          <div key={i} className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-3">
                 <h4 className="text-xl font-bold text-indigo-300">{v.word}</h4>
                 <div onClick={() => handlePlayAudio(v.word)}>
                    <AudioPlayer 
                        variant="icon" 
                        base64Audio={audioCache[v.word] || ""} 
                        isLoading={loadingWord === v.word} 
                    />
                 </div>
              </div>
              <span className="text-sm font-mono text-gray-500 bg-gray-900 px-2 py-0.5 rounded">{v.pronunciation}</span>
            </div>
            <p className="text-gray-300 text-sm mb-3 leading-relaxed">{v.meaning}</p>
            <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/30">
              <p className="text-xs text-indigo-200 italic flex items-center">
                <span className="font-bold uppercase tracking-widest mr-3 opacity-50 text-[10px]">Usage</span>
                "{v.usage}"
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-center">
        <Button onClick={onComplete} className="w-full sm:w-auto px-12">I've Mastered These!</Button>
      </div>
    </div>
  );
};

export default VocabularyStudy;
