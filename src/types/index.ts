// Core types for VoiceUI Pro

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

export type VisualizationStyle = 'bars' | 'wave' | 'circular' | 'orbital';

export type ConversationRole = 'user' | 'assistant';

export interface ThemeConfig {
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  accent: {
    primary: string;
    secondary: string;
    glow: string;
  };
  orb: {
    core: string;
    outer: string;
    particles: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
}

export interface VoiceOrbProps {
  state: VoiceState;
  size?: ComponentSize;
  theme?: ThemeConfig;
  audioData?: number[];
  onTap?: () => void;
  intensity?: number;
  showParticles?: boolean;
  showRings?: boolean;
  className?: string;
}

export interface WaveformVisualizerProps {
  audioData: number[];
  style: VisualizationStyle;
  color?: string | string[];
  barCount?: number;
  height?: number;
  animate?: boolean;
  showMirror?: boolean;
  className?: string;
}

export interface ConversationBubbleProps {
  role: ConversationRole;
  content: string | React.ReactNode;
  timestamp?: Date;
  isTyping?: boolean;
  actions?: Action[];
  avatar?: string;
  showActions?: boolean;
  animateIn?: boolean;
  className?: string;
}

export interface Action {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}

export interface StatusIndicatorProps {
  status: VoiceState;
  subtitle?: string;
  className?: string;
}

export interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface VoiceButtonProps {
  mode?: 'press' | 'toggle';
  isActive?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  size?: ComponentSize;
  className?: string;
}

export interface UseVoiceStateReturn {
  status: VoiceState;
  isRecording: boolean;
  audioLevel: number;
  transcript: string;
  isSpeaking: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
  reset: () => void;
}

export interface UseSpeechRecognitionReturn {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  error: string | null;
}

export interface UseAudioVisualizationReturn {
  audioData: number[];
  volume: number;
  frequency: number;
  startAnalysis: (stream: MediaStream) => void;
  stopAnalysis: () => void;
}
