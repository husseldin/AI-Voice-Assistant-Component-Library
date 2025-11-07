import React, { useState, useEffect } from 'react';
import {
  VoiceOrb,
  WaveformVisualizer,
  ConversationBubble,
  StatusIndicator,
  ActionCard,
  VoiceButton,
  ThemeProvider,
  useVoiceState,
  useSpeechRecognition,
  useAudioVisualization,
  purpleDreamTheme,
  blueOceanTheme,
  VoiceState,
  VisualizationStyle,
} from '../../src';

function App() {
  const [currentTheme, setCurrentTheme] = useState(purpleDreamTheme);
  const [visualizationStyle, setVisualizationStyle] = useState<VisualizationStyle>('bars');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);

  const voiceState = useVoiceState();
  const speechRecognition = useSpeechRecognition();
  const audioVisualization = useAudioVisualization();

  // Generate mock audio data for demo
  const [mockAudioData, setMockAudioData] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (voiceState.status === 'listening' || voiceState.status === 'speaking') {
        const data = Array.from({ length: 64 }, () => Math.random() * 255);
        setMockAudioData(data);
      } else {
        setMockAudioData([]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [voiceState.status]);

  const handleVoiceStart = () => {
    voiceState.startListening();
    speechRecognition.start();
  };

  const handleVoiceStop = () => {
    voiceState.stopListening();
    speechRecognition.stop();

    // Add user message
    if (speechRecognition.transcript) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: speechRecognition.transcript,
          timestamp: new Date(),
        },
      ]);

      // Simulate AI response
      setTimeout(() => {
        const response = `I heard you say: "${speechRecognition.transcript}". This is a demo response!`;
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          },
        ]);
        voiceState.speak(response);
      }, 1000);

      speechRecognition.reset();
    }
  };

  const toggleTheme = () => {
    setCurrentTheme((prev) =>
      prev === purpleDreamTheme ? blueOceanTheme : purpleDreamTheme
    );
  };

  const cycleVisualizationStyle = () => {
    const styles: VisualizationStyle[] = ['bars', 'wave', 'circular', 'orbital'];
    const currentIndex = styles.indexOf(visualizationStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setVisualizationStyle(styles[nextIndex]);
  };

  return (
    <ThemeProvider defaultTheme={currentTheme}>
      <div
        className="min-h-screen p-8 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.background.primary}, ${currentTheme.background.secondary})`,
        }}
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">VoiceUI Pro</h1>
          <p className="text-white/70">Production-Ready AI Voice Assistant Component Library</p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Voice Interaction */}
          <div className="space-y-8">
            {/* Voice Orb Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Voice Orb</h2>
              <div className="flex flex-col items-center gap-6">
                <VoiceOrb
                  state={voiceState.status}
                  size="xl"
                  theme={currentTheme}
                  audioData={mockAudioData}
                  onTap={() => {
                    if (voiceState.status === 'idle') {
                      handleVoiceStart();
                    } else {
                      handleVoiceStop();
                    }
                  }}
                  showParticles
                  showRings
                />
                <StatusIndicator
                  status={voiceState.status}
                  subtitle={speechRecognition.isListening ? speechRecognition.interimTranscript : undefined}
                />
                <VoiceButton
                  mode="toggle"
                  onStart={handleVoiceStart}
                  onStop={handleVoiceStop}
                  size="lg"
                />
              </div>
            </div>

            {/* Waveform Visualizer */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Waveform Visualizer</h2>
                <button
                  onClick={cycleVisualizationStyle}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
                >
                  Style: {visualizationStyle}
                </button>
              </div>
              <WaveformVisualizer
                audioData={mockAudioData.length > 0 ? mockAudioData : Array(64).fill(Math.random() * 100)}
                style={visualizationStyle}
                color={[currentTheme.accent.primary, currentTheme.accent.secondary]}
                barCount={64}
                height={150}
                animate
                showMirror={visualizationStyle === 'bars' || visualizationStyle === 'wave'}
              />
            </div>

            {/* Action Cards */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <ActionCard
                  icon="🎨"
                  title="Change Theme"
                  description="Switch color scheme"
                  onClick={toggleTheme}
                />
                <ActionCard
                  icon="🎵"
                  title="Visualization"
                  description="Change viz style"
                  onClick={cycleVisualizationStyle}
                />
                <ActionCard
                  icon="🔄"
                  title="Reset"
                  description="Clear conversation"
                  onClick={() => {
                    setMessages([]);
                    voiceState.reset();
                  }}
                />
                <ActionCard
                  icon="ℹ️"
                  title="About"
                  description="Library info"
                  onClick={() => alert('VoiceUI Pro - Production-Ready Voice Assistant Components')}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Conversation */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 h-[calc(100vh-120px)] flex flex-col">
              <h2 className="text-2xl font-semibold text-white mb-6">Conversation</h2>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/50 text-center">
                      Start speaking to see the conversation here!<br />
                      <span className="text-sm">Click the orb or voice button to begin</span>
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <ConversationBubble
                        key={index}
                        role={message.role}
                        content={message.content}
                        timestamp={message.timestamp}
                        animateIn
                        showActions={false}
                      />
                    ))}
                    {voiceState.status === 'thinking' && (
                      <ConversationBubble
                        role="assistant"
                        content=""
                        isTyping
                        animateIn
                      />
                    )}
                  </>
                )}
              </div>

              {/* Status Info */}
              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Status:</span>
                    <span className="ml-2 text-white">{voiceState.status}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Messages:</span>
                    <span className="ml-2 text-white">{messages.length}</span>
                  </div>
                  <div>
                    <span className="text-white/50">Theme:</span>
                    <span className="ml-2 text-white">
                      {currentTheme === purpleDreamTheme ? 'Purple Dream' : 'Blue Ocean'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50">Viz Style:</span>
                    <span className="ml-2 text-white capitalize">{visualizationStyle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-white/50 text-sm">
            VoiceUI Pro - Built with React, TypeScript, Framer Motion & Tailwind CSS
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
