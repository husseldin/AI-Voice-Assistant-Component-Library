import React, { useState } from 'react';
import {
  VoiceOrb,
  ChatInterface,
  Spectrogram,
  CircularSpectrum,
  ThemeProvider,
  blueOceanTheme,
  useAI,
  useAudioVisualization,
} from '../../../src';
import { OllamaProvider } from '../../../src/ai/providers';

/**
 * Ollama Integration Example
 * Run local LLMs (Llama 2, Mistral, etc.) with VoiceUI Pro
 * No API key needed - runs completely offline!
 */
function OllamaExample() {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [model, setModel] = useState('llama2');
  const [isConfigured, setIsConfigured] = useState(false);
  const [showSpectro, setShowSpectro] = useState(false);

  const audioViz = useAudioVisualization();
  const ai = useAI();

  const handleConfigure = () => {
    const provider = new OllamaProvider(ollamaUrl);
    ai.setProvider(provider);
    setIsConfigured(true);
  };

  const handleSendMessage = (text: string) => {
    ai.sendMessageStream(text);
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Configure Ollama</h2>
          <p className="text-white/70 mb-4">
            Run local LLMs on your machine - completely private and offline!
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Ollama URL</label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
              >
                <option value="llama2">Llama 2</option>
                <option value="mistral">Mistral</option>
                <option value="codellama">Code Llama</option>
                <option value="phi">Phi</option>
              </select>
            </div>

            <button
              onClick={handleConfigure}
              className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Connect to Ollama
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-sm">
              📦 Don't have Ollama? Install it from{' '}
              <a
                href="https://ollama.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline"
              >
                ollama.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme={blueOceanTheme}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Ollama Integration</h1>
              <p className="text-white/70">Local LLMs - Private & Offline</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSpectro(!showSpectro)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {showSpectro ? 'Show Circular' : 'Show Spectrogram'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Visualizations */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <VoiceOrb
                  state={ai.isProcessing ? 'thinking' : 'idle'}
                  size="xl"
                  showParticles
                  showRings
                />
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                {showSpectro ? (
                  <Spectrogram
                    audioData={audioViz.audioData}
                    width={500}
                    height={200}
                    colorScheme="blue"
                  />
                ) : (
                  <div className="flex justify-center">
                    <CircularSpectrum
                      audioData={audioViz.audioData}
                      size={400}
                      colors={['#3b82f6', '#06b6d4', '#60a5fa']}
                      showCenter
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Chat */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 h-[calc(100vh-200px)]">
              <ChatInterface
                messages={ai.messages}
                isProcessing={ai.isProcessing}
                showTimestamps
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default OllamaExample;
