
import React, { useRef, useEffect } from 'react';
import { playPcmAudio } from '../../utils/audio';
import { Button } from './Button';
import { Spinner } from './Spinner';

interface AudioPlayerProps {
    base64Audio: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'ghost' | 'icon';
    isLoading?: boolean;
}

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio, children, variant = 'primary', isLoading = false }) => {
    const audioContextRef = useRef<AudioContext | null>(null);

    const handlePlay = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (base64Audio && audioContextRef.current) {
            playPcmAudio(base64Audio, audioContextRef.current);
        }
    };

    if (variant === 'icon') {
        return (
            <button 
                onClick={handlePlay} 
                disabled={isLoading || !base64Audio}
                className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-full transition-all disabled:opacity-30"
                title="Listen to pronunciation"
            >
                {isLoading ? <Spinner className="w-4 h-4" /> : <PlayIcon />}
            </button>
        );
    }

    return (
        <Button onClick={handlePlay} disabled={isLoading || !base64Audio} className={variant === 'ghost' ? 'bg-transparent border border-white/10 hover:bg-white/5 shadow-none' : ''}>
            {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : <PlayIcon />}
            {children || ' Listen to Coach'}
        </Button>
    );
};
