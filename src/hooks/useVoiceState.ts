import { useState, useCallback } from 'react';
import { UseVoiceStateReturn, VoiceState } from '../types';

export const useVoiceState = (): UseVoiceStateReturn => {
  const [status, setStatus] = useState<VoiceState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    setStatus('listening');
    setIsRecording(true);
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    setStatus('thinking');
    setIsRecording(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    setStatus('speaking');
    setIsSpeaking(true);
    setError(null);

    try {
      // Use Web Speech API for TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
          setIsSpeaking(false);
          setStatus('idle');
        };

        utterance.onerror = (event) => {
          setError(`Speech synthesis error: ${event.error}`);
          setIsSpeaking(false);
          setStatus('error');
        };

        window.speechSynthesis.speak(utterance);
      } else {
        throw new Error('Speech synthesis not supported');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
      setIsSpeaking(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setIsRecording(false);
    setAudioLevel(0);
    setTranscript('');
    setIsSpeaking(false);
    setError(null);

    // Cancel any ongoing speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    status,
    isRecording,
    audioLevel,
    transcript,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    reset,
  };
};
