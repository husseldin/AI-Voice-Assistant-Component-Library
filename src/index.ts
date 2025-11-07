// Core Components
export { VoiceOrb } from './components/core/VoiceOrb';
export { WaveformVisualizer } from './components/core/WaveformVisualizer';
export { ConversationBubble } from './components/core/ConversationBubble';
export { StatusIndicator } from './components/core/StatusIndicator';

// Interactive Components
export { ActionCard } from './components/interactive/ActionCard';
export { VoiceButton } from './components/interactive/VoiceButton';

// Hooks
export { useVoiceState, useSpeechRecognition, useAudioVisualization } from './hooks';

// Context
export { ThemeProvider, useTheme } from './context';

// Themes
export { purpleDreamTheme, blueOceanTheme } from './themes';

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
