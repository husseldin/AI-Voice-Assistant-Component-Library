import { useState, useCallback, useRef, useEffect } from 'react';
import { UseAudioVisualizationReturn } from '../types';

export const useAudioVisualization = (): UseAudioVisualizationReturn => {
  const [audioData, setAudioData] = useState<number[]>([]);
  const [volume, setVolume] = useState(0);
  const [frequency, setFrequency] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startAnalysis = useCallback((stream: MediaStream) => {
    try {
      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      // Create analyser
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      source.connect(analyserRef.current);

      // Create data array
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Start analysis loop
      const analyze = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Update audio data
        setAudioData(Array.from(dataArrayRef.current));

        // Calculate volume (average of all frequencies)
        const sum = dataArrayRef.current.reduce((acc, val) => acc + val, 0);
        const avg = sum / dataArrayRef.current.length;
        setVolume(avg);

        // Calculate dominant frequency
        const maxIndex = dataArrayRef.current.indexOf(Math.max(...dataArrayRef.current));
        const dominantFreq = (maxIndex * audioContextRef.current!.sampleRate) / (analyserRef.current.fftSize * 2);
        setFrequency(dominantFreq);

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err) {
      console.error('Error starting audio analysis:', err);
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    // Cancel animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset state
    setAudioData([]);
    setVolume(0);
    setFrequency(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return {
    audioData,
    volume,
    frequency,
    startAnalysis,
    stopAnalysis,
  };
};
