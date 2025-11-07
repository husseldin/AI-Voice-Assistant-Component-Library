import React, { useState } from 'react';
import {
  ThreeDVoiceOrb,
  ChatInterface,
  SuggestionChips,
  LiveCaptions,
  SentimentDisplay,
  ThemeProvider,
  purpleDreamTheme,
  useAI,
  useSpeechRecognition,
} from '../../../src';
import { OpenAIProvider } from '../../../src/ai/providers';

/**
 * OpenAI Integration Example
 * Shows how to integrate GPT-4 and Whisper with VoiceUI Pro
 */
function OpenAIExample() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState([
    { id: '1', text: 'Tell me a joke', icon: '😄' },
    { id: '2', text: 'Explain quantum computing', icon: '⚛️' },
    { id: '3', text: 'Write a poem', icon: '✍️' },
    { id: '4', text: 'Help with coding', icon: '💻' },
  ]);

  const speechRecognition = useSpeechRecognition();

  // Initialize AI with OpenAI provider
  const ai = useAI();

  const handleConfigure = () => {
    if (!apiKey) {
      alert('Please enter your OpenAI API key');
      return;
    }

    const provider = new OpenAIProvider(apiKey);
    ai.setProvider(provider);
    setIsConfigured(true);
  };

  const handleSuggestionClick = (suggestion: any) => {
    ai.sendMessageStream(suggestion.text);
  };

  const handleVoiceInput = () => {
    if (!speechRecognition.isListening) {
      speechRecognition.start();
    } else {
      speechRecognition.stop();
      if (speechRecognition.transcript) {
        ai.sendMessageStream(speechRecognition.transcript);
        speechRecognition.reset();
      }
    }
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Configure OpenAI</h2>
          <p className="text-white/70 mb-4">
            Enter your OpenAI API key to start using GPT-4 and Whisper
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 mb-4"
          />
          <button
            onClick={handleConfigure}
            className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
          >
            Connect to OpenAI
          </button>
          <p className="text-white/50 text-sm mt-4">
            Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              platform.openai.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme={purpleDreamTheme}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">OpenAI Integration</h1>
          <p className="text-white/70 mb-8">GPT-4 + Whisper + VoiceUI Pro</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Voice Interface */}
            <div className="space-y-6">
              {/* 3D Voice Orb */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="flex justify-center">
                  <ThreeDVoiceOrb
                    state={
                      speechRecognition.isListening
                        ? 'listening'
                        : ai.isProcessing
                        ? 'thinking'
                        : 'idle'
                    }
                    size={300}
                    onTap={handleVoiceInput}
                  />
                </div>
              </div>

              {/* Live Captions */}
              {speechRecognition.transcript && (
                <LiveCaptions
                  text={speechRecognition.transcript}
                  interimText={speechRecognition.interimTranscript}
                  position="center"
                />
              )}

              {/* Suggestion Chips */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <SuggestionChips
                  suggestions={currentSuggestions}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>

              {/* Sentiment Display */}
              {ai.messages.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Conversation Tone</h3>
                  <SentimentDisplay
                    score={0.5}
                    magnitude={0.7}
                    showLabel
                    showScore
                    size="lg"
                  />
                </div>
              )}
            </div>

            {/* Right: Chat Interface */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 h-[calc(100vh-200px)]">
              <ChatInterface
                messages={ai.messages}
                isProcessing={ai.isProcessing}
                showTimestamps
                showAvatars
                assistantAvatar="🤖"
                userAvatar="👤"
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default OpenAIExample;
