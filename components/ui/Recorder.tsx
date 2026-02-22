
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from './Button';

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
    </svg>
);

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

const analysisPoints = [
    "Listening for rhythm and flow...",
    "Checking for connected speech...",
    "Analyzing intonation patterns...",
    "Gauging clarity and pronunciation...",
    "Identifying use of natural pauses...",
];

export const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [currentAnalysisPoint, setCurrentAnalysisPoint] = useState(analysisPoints[0]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const analysisIntervalRef = useRef<number | null>(null);

  const stopRecordingAndProcess = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
    if(analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setTimer(0);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.addEventListener("dataavailable", event => {
          audioChunksRef.current.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          onRecordingComplete(audioBlob);
          stream.getTracks().forEach(track => track.stop());
        });

        mediaRecorderRef.current.start();
        setIsRecording(true);
        timerIntervalRef.current = window.setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        let pointIndex = 0;
        analysisIntervalRef.current = window.setInterval(() => {
            pointIndex = (pointIndex + 1) % analysisPoints.length;
            setCurrentAnalysisPoint(analysisPoints[pointIndex]);
        }, 2000);

      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied. Please enable it in your browser settings.");
      }
    } else {
      setError("Audio recording is not supported by your browser.");
    }
  }, [onRecordingComplete]);

  useEffect(() => {
    if (timer >= 60) {
        stopRecordingAndProcess();
    }
  }, [timer, stopRecordingAndProcess]);

  useEffect(() => {
    return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (analysisIntervalRef.current) clearInterval(analysisIntervalRef.current);
    }
  }, []);


  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecordingAndProcess();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <Button onClick={handleToggleRecording} disabled={!!error || isProcessing}>
        {isProcessing ? (
           <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : isRecording ? (
          <span className="flex items-center space-x-2">
            <StopIcon />
            <span>Stop Recording</span>
          </span>
        ) : (
          <span className="flex items-center space-x-2">
            <MicIcon />
            <span>Start Recording</span>
          </span>
        )}
      </Button>
      {isRecording && 
        <div className="text-center">
            <div className="text-red-500 font-bold animate-pulse tabular-nums mb-2">
                Recording... {formatTime(timer)} / 01:00
            </div>
            <div className="text-indigo-300 text-sm transition-opacity duration-500">
                {currentAnalysisPoint}
            </div>
        </div>
      }
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
};
