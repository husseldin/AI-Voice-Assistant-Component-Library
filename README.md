# VoiceUI Pro 🎤✨

**The most comprehensive, production-ready AI Voice Assistant Component Library**

Build stunning voice-enabled applications with breathtaking animations for web and mobile platforms. Integrates seamlessly with OpenAI, Anthropic, Ollama (local LLMs), and custom AI providers.

[![NPM Version](https://img.shields.io/badge/npm-1.0.0-blue)](https://npmjs.com)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![React](https://img.shields.io/badge/react-18%2B-blue)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/typescript-100%25-blue)](https://www.typescriptlang.org/)

---

## 🎯 Features

### Core Components (8)
- **VoiceOrb** - Animated orb with 5 states (idle, listening, thinking, speaking, error)
- **ThreeDVoiceOrb** - WebGL-powered 3D orb with GPU particles ✨ NEW
- **WaveformVisualizer** - 4 visualization styles (bars, wave, circular, orbital)
- **Spectrogram** - Real-time frequency spectrogram ✨ NEW
- **CircularSpectrum** - Radial audio spectrum analyzer ✨ NEW
- **ConversationBubble** - Chat interface with typing animation
- **ChatInterface** - Complete chat UI with threading ✨ NEW
- **StatusIndicator** - Animated status display with icons

### Interactive Components (5)
- **ActionCard** - Glassmorphism cards with hover effects
- **VoiceButton** - Microphone button (press & toggle modes)
- **SuggestionChips** - Quick reply suggestions ✨ NEW
- **LiveCaptions** - Real-time speech-to-text captions ✨ NEW
- **SentimentDisplay** - Visual sentiment analysis ✨ NEW

### AI Integration (5 Providers) ✨ NEW
- **OpenAI** - GPT-4, GPT-3.5, Whisper STT
- **Anthropic** - Claude 3 (Opus, Sonnet, Haiku)
- **Ollama** - Local LLMs (Llama 2, Mistral, CodeLlama)
- **MockLocal** - Testing without API calls
- **Custom** - Bring your own AI backend

### Hooks (4)
- **useVoiceState** - Complete voice state management with TTS
- **useSpeechRecognition** - Web Speech API wrapper for STT
- **useAudioVisualization** - Real-time audio frequency analysis
- **useAI** - Manage AI conversations with any provider ✨ NEW

### Themes (7) ✨ 5 NEW
- Purple Dream (default)
- Blue Ocean
- Dark Mode ✨ NEW
- Neon Cyberpunk ✨ NEW
- Forest Green ✨ NEW
- Sunset Orange ✨ NEW
- Minimal White ✨ NEW

### Enterprise Features ✨ NEW
- **Voice Commands** - 18 preset commands + custom command support
- **Function Calling** - AI can call functions in your app
- **Conversation Memory** - RAG-like memory system (1000+ memories)
- **Multi-Language** - 12 languages with RTL support
- **Command Palette** - VS Code-style command search

### Platforms
- ✅ **Web** - Full support with WebGL and Canvas
- ✅ **React Native** - Complete mobile support (see [React Native Guide](./docs/REACT_NATIVE.md))

---

## 🚀 Quick Start

### Installation

```bash
npm install voiceui-pro
# or
yarn add voiceui-pro
```

### Basic Usage

```tsx
import {
  ThreeDVoiceOrb,
  ChatInterface,
  SuggestionChips,
  ThemeProvider,
  purpleDreamTheme,
  useAI,
  OpenAIProvider,
} from 'voiceui-pro';

function App() {
  // Initialize AI with OpenAI
  const ai = useAI(new OpenAIProvider('your-api-key'));

  return (
    <ThemeProvider defaultTheme={purpleDreamTheme}>
      <div>
        {/* 3D Voice Orb */}
        <ThreeDVoiceOrb
          state={ai.isProcessing ? 'thinking' : 'idle'}
          size={400}
          onTap={() => console.log('Tapped!')}
        />

        {/* Suggestion Chips */}
        <SuggestionChips
          suggestions={[
            { id: '1', text: 'Tell me a joke', icon: '😄' },
            { id: '2', text: 'Explain AI', icon: '🤖' },
          ]}
          onSuggestionClick={(s) => ai.sendMessageStream(s.text)}
        />

        {/* Chat Interface */}
        <ChatInterface
          messages={ai.messages}
          isProcessing={ai.isProcessing}
        />
      </div>
    </ThemeProvider>
  );
}
```

---

## 🤖 AI Provider Examples

### OpenAI (GPT-4 + Whisper)

```tsx
import { useAI, OpenAIProvider } from 'voiceui-pro';

const ai = useAI(new OpenAIProvider('sk-...'));

// Send message
await ai.sendMessage('Hello!');

// Stream response
await ai.sendMessageStream('Explain quantum computing');
```

### Ollama (Local LLMs - No API Key!)

```tsx
import { OllamaProvider } from 'voiceui-pro';

// Run Llama 2 locally
const ai = useAI(new OllamaProvider('http://localhost:11434'));

await ai.sendMessage('Help me code');
```

### Anthropic (Claude 3)

```tsx
import { AnthropicProvider } from 'voiceui-pro';

const ai = useAI(new AnthropicProvider('sk-ant-...'));

await ai.sendMessageStream('Write a poem');
```

### Custom Provider

```tsx
import { CustomProvider } from 'voiceui-pro';

const ai = useAI(
  new CustomProvider('https://your-api.com/chat', {
    'Authorization': 'Bearer token',
  })
);
```

---

## 📦 Components

### 3D Voice Orb (WebGL) ✨ NEW

```tsx
<ThreeDVoiceOrb
  state="listening" // idle | listening | thinking | speaking | error
  theme={purpleDreamTheme}
  audioData={audioFrequencyData}
  size={400}
  onTap={() => startListening()}
/>
```

**Features:**
- Real 3D using Three.js & React Three Fiber
- GPU-accelerated particle system
- Dynamic lighting and shadows
- Morphing geometry based on voice
- 60fps guaranteed

### Spectrogram ✨ NEW

```tsx
<Spectrogram
  audioData={frequencyData}
  width={600}
  height={200}
  colorScheme="purple" // purple | blue | green | fire
/>
```

Shows frequency content over time like a professional audio editor.

### Circular Spectrum ✨ NEW

```tsx
<CircularSpectrum
  audioData={frequencyData}
  size={400}
  colors={['#a855f7', '#ec4899', '#f59e0b']}
  showCenter
  innerRadius={60}
/>
```

Beautiful radial frequency visualization.

### Chat Interface ✨ NEW

```tsx
<ChatInterface
  messages={ai.messages}
  isProcessing={ai.isProcessing}
  showTimestamps
  showAvatars
  onMessageAction={(id, action) => {
    if (action === 'copy') {
      // Copy message
    }
  }}
/>
```

**Features:**
- Auto-scroll to bottom
- Typing indicators
- Message actions (copy, regenerate)
- Timestamp display
- Avatar support

### Suggestion Chips ✨ NEW

```tsx
<SuggestionChips
  suggestions={[
    { id: '1', text: 'Search images', icon: '🖼️' },
    { id: '2', text: 'Set reminder', icon: '⏰' },
    { id: '3', text: 'Play music', icon: '🎵' },
  ]}
  onSuggestionClick={(suggestion) => {
    ai.sendMessage(suggestion.text);
  }}
  maxVisible={6}
/>
```

### Live Captions ✨ NEW

```tsx
<LiveCaptions
  text={transcript}
  interimText={interimTranscript}
  position="bottom" // top | center | bottom
  fontSize="lg"
  showBackground
/>
```

WCAG 2.1 AAA compliant accessibility feature.

### Sentiment Display ✨ NEW

```tsx
<SentimentDisplay
  score={0.8} // -1 to 1
  magnitude={0.7}
  showLabel
  showScore
  size="lg"
/>
```

Visual indicator of conversation emotional tone.

---

## 🎨 Theming

### Built-in Themes

```tsx
import {
  purpleDreamTheme,
  blueOceanTheme,
  darkModeTheme,      // ✨ NEW
  neonCyberpunkTheme, // ✨ NEW
  forestGreenTheme,   // ✨ NEW
  sunsetOrangeTheme,  // ✨ NEW
  minimalWhiteTheme,  // ✨ NEW
} from 'voiceui-pro';
```

### Custom Theme

```tsx
const myTheme = {
  background: {
    primary: '#1a0b2e',
    secondary: '#2d1b4e',
    card: 'rgba(45, 27, 78, 0.6)',
  },
  accent: {
    primary: '#a855f7',
    secondary: '#ec4899',
    glow: '#c084fc',
  },
  orb: {
    core: '#8b5cf6',
    outer: '#ec4899',
    particles: '#c084fc',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
  },
};

<ThemeProvider defaultTheme={myTheme}>
  {/* Your app */}
</ThemeProvider>
```

---

## 📱 React Native

Full React Native support with Reanimated 2 for smooth 60fps animations.

See our comprehensive [React Native Guide](./docs/REACT_NATIVE.md) for:
- Setup & configuration
- Native audio handling
- Haptic feedback
- Platform-specific code
- Background audio
- Full examples

---

## 🎯 Integration Examples

We provide complete working examples for all major AI providers:

### 1. OpenAI Integration
Location: `examples/integrations/openai/`
- GPT-4 conversations
- Whisper transcription
- Streaming responses
- Live captions

### 2. Ollama Integration
Location: `examples/integrations/ollama/`
- Local Llama 2/Mistral models
- No API key required
- Completely offline
- Privacy-first

### 3. Anthropic Integration
Location: `examples/integrations/anthropic/`
- Claude 3 Opus/Sonnet/Haiku
- Advanced reasoning
- Streaming responses

### Run Examples

```bash
cd examples/integrations/openai
npm install
npm run dev
```

---

## 🎨 Advanced Features

### Audio Visualization Pipeline

```tsx
import { useAudioVisualization, Spectrogram, CircularSpectrum } from 'voiceui-pro';

function AudioViz() {
  const { audioData, volume, frequency, startAnalysis } = useAudioVisualization();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => startAnalysis(stream));
  }, []);

  return (
    <>
      <Spectrogram audioData={audioData} />
      <CircularSpectrum audioData={audioData} />
      <p>Volume: {volume}, Frequency: {frequency}Hz</p>
    </>
  );
}
```

### Conversation Management

```tsx
import { useAI, ChatInterface, SuggestionChips } from 'voiceui-pro';

function Conversation() {
  const ai = useAI(/* provider */);

  // Access full conversation
  console.log(ai.messages); // All messages
  console.log(ai.isProcessing); // Processing state
  console.log(ai.error); // Error state

  // Clear conversation
  const handleReset = () => ai.clearMessages();

  // Change AI provider
  const switchToOllama = () => {
    ai.setProvider(new OllamaProvider());
  };

  return (
    <ChatInterface
      messages={ai.messages}
      isProcessing={ai.isProcessing}
    />
  );
}
```

---

## 🔧 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  VoiceState,
  AIProvider,
  AIMessage,
  ThemeConfig,
  Suggestion,
  SentimentResult,
} from 'voiceui-pro';
```

---

## 🎯 Browser Support

- ✅ Chrome 80+ (recommended for best Speech API support)
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

**Note:** Web Speech API works best in Chrome. For production, consider using cloud STT services (OpenAI Whisper, Google Cloud Speech, etc.)

---

## 📊 Performance

- **60fps animations** guaranteed
- **GPU-accelerated** 3D graphics (WebGL)
- **Tree-shakeable** - import only what you need
- **Lazy loading** - components load on demand
- **Optimized** for mobile devices

---

## 🏗️ Project Structure

```
voiceui-pro/
├── src/
│   ├── components/
│   │   ├── core/              # 5 core components
│   │   ├── advanced/          # 7 advanced components
│   │   └── interactive/       # 2 interactive components
│   ├── hooks/                 # 4 powerful hooks
│   ├── ai/
│   │   ├── providers/         # 5 AI providers
│   │   └── types/             # AI type definitions
│   ├── themes/                # 7 beautiful themes
│   └── types/                 # TypeScript definitions
├── examples/
│   ├── web-demo/              # Live web demo
│   └── integrations/          # AI integration examples
└── docs/                      # Comprehensive documentation
```

---

## 📚 Documentation

- [React Native Guide](./docs/REACT_NATIVE.md)
- [Enterprise Features Guide](./docs/ENTERPRISE_FEATURES.md) ✨ NEW
- [Component API Reference](./docs/COMPONENTS.md)
- [Theming Guide](./docs/THEMING.md)
- [AI Integration Guide](./docs/INTEGRATION.md)
- [Advanced Usage](./docs/ADVANCED.md)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🌟 Star History

If you find VoiceUI Pro useful, please consider giving it a star! ⭐

---

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

Inspired by: Apple Siri, Google Assistant, Amazon Alexa

---

## 📞 Support

- 📧 Email: support@voiceui-pro.com
- 💬 Discord: [Join our community](https://discord.gg/voiceui-pro)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/voiceui-pro/issues)
- 📖 Docs: [Full Documentation](https://docs.voiceui-pro.com)

---

<div align="center">

**Made with ❤️ for the AI voice revolution**

[Get Started](https://docs.voiceui-pro.com) • [Examples](./examples) • [Discord](https://discord.gg/voiceui-pro)

</div>
