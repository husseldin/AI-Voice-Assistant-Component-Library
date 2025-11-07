// Core Components
export { VoiceOrb } from './components/core/VoiceOrb';
export { WaveformVisualizer } from './components/core/WaveformVisualizer';
export { ConversationBubble } from './components/core/ConversationBubble';
export { StatusIndicator } from './components/core/StatusIndicator';

// Interactive Components
export { ActionCard } from './components/interactive/ActionCard';
export { VoiceButton } from './components/interactive/VoiceButton';

// Advanced Components
export { ThreeDVoiceOrb } from './components/advanced/ThreeDVoiceOrb';
export { Spectrogram } from './components/advanced/Spectrogram';
export { CircularSpectrum } from './components/advanced/CircularSpectrum';
export { ChatInterface } from './components/advanced/ChatInterface';
export { SuggestionChips } from './components/advanced/SuggestionChips';
export { LiveCaptions } from './components/advanced/LiveCaptions';
export { SentimentDisplay } from './components/advanced/SentimentDisplay';

// Hooks
export { useVoiceState, useSpeechRecognition, useAudioVisualization, useAI } from './hooks';

// Context
export { ThemeProvider, useTheme } from './context';

// Themes
export {
  purpleDreamTheme,
  blueOceanTheme,
  darkModeTheme,
  neonCyberpunkTheme,
  forestGreenTheme,
  sunsetOrangeTheme,
  minimalWhiteTheme,
} from './themes';

// AI Providers
export {
  OpenAIProvider,
  OllamaProvider,
  AnthropicProvider,
  MockLocalProvider,
  CustomProvider,
} from './ai/providers';

// Types
export type {
  VoiceState,
  ComponentSize,
  VisualizationStyle,
  ConversationRole,
  ThemeConfig,
  VoiceOrbProps,
  WaveformVisualizerProps,
  ConversationBubbleProps,
  StatusIndicatorProps,
  ActionCardProps,
  VoiceButtonProps,
  UseVoiceStateReturn,
  UseSpeechRecognitionReturn,
  UseAudioVisualizationReturn,
  Action,
} from './types';

export type {
  AIMessage,
  AIStreamChunk,
  AIProvider,
  AIProviderConfig,
  AIContextMessage,
  UseAIReturn,
  TranscriptionResult,
  SentimentResult,
  IntentResult,
} from './ai/types';

export type { Suggestion } from './components/advanced/SuggestionChips';
