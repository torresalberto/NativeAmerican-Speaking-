
import React, { useRef, useEffect } from 'react';
import { playPcmAudio } from '../../utils/audio';
import { Button } from './Button';

interface AudioPlayerProps {
    base64Audio: string;
    children?: React.ReactNode;
}

const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>;

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio, children }) => {
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        // Initialize AudioContext on mount
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Cleanup AudioContext on unmount
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const handlePlay = () => {
        if (base64Audio && audioContextRef.current) {
            playPcmAudio(base64Audio, audioContextRef.current);
        }
    };

    return (
        <Button onClick={handlePlay}>
            {children || <><PlayIcon /> Play Audio</>}
        </Button>
    );
};
