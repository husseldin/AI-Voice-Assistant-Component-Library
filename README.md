# VoiceUI Pro 🎤✨

Production-ready AI Voice Assistant Component Library for React with breathtaking animations.

## Features

- 🎨 **Beautiful Animations** - Smooth, professional animations using Framer Motion
- 🎯 **5 Voice States** - Idle, Listening, Thinking, Speaking, Error
- 📊 **4 Visualization Styles** - Bars, Wave, Circular, Orbital
- 🎨 **Theme System** - Purple Dream & Blue Ocean themes (customizable)
- 🔊 **Web Speech API** - Built-in Speech Recognition & TTS
- 📱 **Responsive** - Works on mobile and desktop
- 🧩 **Modular** - Import only what you need
- 💪 **TypeScript** - Full type safety
- ♿ **Accessible** - Keyboard navigation support

## Quick Start

### Installation

```bash
npm install voiceui-pro
# or
yarn add voiceui-pro
```

### Basic Usage

```tsx
import { VoiceOrb, ThemeProvider, purpleDreamTheme } from 'voiceui-pro';

function App() {
  return (
    <ThemeProvider defaultTheme={purpleDreamTheme}>
      <VoiceOrb
        state="listening"
        size="lg"
        onTap={() => console.log('Orb tapped!')}
      />
    </ThemeProvider>
  );
}
```

## Components

### VoiceOrb

The centerpiece component with 5 animated states.

```tsx
<VoiceOrb
  state="listening" // idle | listening | thinking | speaking | error
  size="lg" // sm | md | lg | xl
  theme={purpleDreamTheme}
  audioData={audioDataArray}
  onTap={() => handleTap()}
  showParticles
  showRings
/>
```

### WaveformVisualizer

Real-time audio visualization with 4 styles.

```tsx
<WaveformVisualizer
  audioData={audioDataArray}
  style="bars" // bars | wave | circular | orbital
  color={['#a855f7', '#ec4899']}
  barCount={64}
  height={150}
  animate
  showMirror
/>
```

### ConversationBubble

Chat bubbles with typing animation.

```tsx
<ConversationBubble
  role="assistant"
  content="Hello! How can I help you?"
  timestamp={new Date()}
  isTyping={false}
  animateIn
/>
```

### StatusIndicator

Visual status with animated icons.

```tsx
<StatusIndicator
  status="listening"
  subtitle="Speak now..."
/>
```

### ActionCard

Glassmorphism action cards.

```tsx
<ActionCard
  icon="🎨"
  title="Change Theme"
  description="Switch color scheme"
  onClick={() => toggleTheme()}
/>
```

### VoiceButton

Microphone button with press/toggle modes.

```tsx
<VoiceButton
  mode="toggle" // press | toggle
  onStart={() => startRecording()}
  onStop={() => stopRecording()}
  size="lg"
/>
```

## Hooks

### useVoiceState

Complete voice interaction state management.

```tsx
const {
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
} = useVoiceState();
```

### useSpeechRecognition

Web Speech API wrapper for STT.

```tsx
const {
  transcript,
  interimTranscript,
  isListening,
  start,
  stop,
  reset,
  error,
} = useSpeechRecognition();
```

### useAudioVisualization

Real-time audio analysis.

```tsx
const {
  audioData,
  volume,
  frequency,
  startAnalysis,
  stopAnalysis,
} = useAudioVisualization();
```

## Themes

### Built-in Themes

```tsx
import { purpleDreamTheme, blueOceanTheme } from 'voiceui-pro';
```

### Custom Theme

```tsx
const customTheme = {
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
```

## Development

### Run Demo

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build Library

```bash
npm run build
```

## Browser Support

- Chrome 80+ (recommended)
- Firefox 75+
- Safari 14+
- Edge 80+

**Note:** Speech Recognition works best in Chrome.

## Tech Stack

- React 18
- TypeScript
- Framer Motion
- Tailwind CSS
- Vite
- Web Speech API

## License

MIT

## Author

VoiceUI Pro - Production-Ready Voice Assistant Components

---

Made with ❤️ and lots of animations
