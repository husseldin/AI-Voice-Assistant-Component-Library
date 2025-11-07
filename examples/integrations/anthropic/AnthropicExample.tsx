import React, { useState } from 'react';
import {
  ThreeDVoiceOrb,
  ChatInterface,
  SuggestionChips,
  StatusIndicator,
  ThemeProvider,
  neonCyberpunkTheme,
  useAI,
} from '../../../src';
import { AnthropicProvider } from '../../../src/ai/providers';

/**
 * Anthropic Integration Example
 * Claude 3 integration with VoiceUI Pro
 */
function AnthropicExample() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('claude-3-sonnet-20240229');
  const [isConfigured, setIsConfigured] = useState(false);

  const ai = useAI();

  const models = [
    { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  ];

  const handleConfigure = () => {
    if (!apiKey) {
      alert('Please enter your Anthropic API key');
      return;
    }

    const provider = new AnthropicProvider(apiKey);
    ai.setProvider(provider);
    setIsConfigured(true);
  };

  const suggestions = [
    { id: '1', text: 'Analyze this code', icon: '🔍' },
    { id: '2', text: 'Write documentation', icon: '📝' },
    { id: '3', text: 'Explain concepts', icon: '💡' },
    { id: '4', text: 'Debug issues', icon: '🐛' },
  ];

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Configure Anthropic</h2>
          <p className="text-white/70 mb-4">
            Connect to Claude 3 - Advanced reasoning and analysis
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
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
                {models.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleConfigure}
              className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium transition-colors"
            >
              Connect to Claude
            </button>
          </div>

          <p className="text-white/50 text-sm mt-4">
            Get your API key from{' '}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300"
            >
              console.anthropic.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme={neonCyberpunkTheme}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-blue-900 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Anthropic Integration</h1>
          <p className="text-white/70 mb-8">Claude 3 + VoiceUI Pro</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Interface */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="flex flex-col items-center gap-6">
                  <ThreeDVoiceOrb
                    state={ai.isProcessing ? 'thinking' : 'idle'}
                    size={300}
                  />
                  <StatusIndicator
                    status={ai.isProcessing ? 'thinking' : 'idle'}
                    subtitle={ai.currentProvider}
                  />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Ask Claude</h3>
                <SuggestionChips
                  suggestions={suggestions}
                  onSuggestionClick={(s) => ai.sendMessageStream(s.text)}
                />
              </div>
            </div>

            {/* Right: Chat */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 h-[calc(100vh-200px)]">
              <ChatInterface
                messages={ai.messages}
                isProcessing={ai.isProcessing}
                showTimestamps
                showAvatars
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AnthropicExample;
