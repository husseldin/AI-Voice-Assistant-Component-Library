// AI Provider Types - Supports OpenAI, Ollama, Anthropic, Local LLMs, etc.

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface AIStreamChunk {
  content: string;
  isComplete: boolean;
  metadata?: Record<string, any>;
}

export interface AIProviderConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  systemPrompt?: string;
  headers?: Record<string, string>;
}

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  language?: string;
  segments?: TranscriptionSegment[];
  duration?: number;
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface SpeechSynthesisOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  language?: string;
}

export interface SentimentResult {
  score: number; // -1 to 1
  magnitude: number; // 0 to 1
  label: 'positive' | 'neutral' | 'negative';
  emotions?: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
  };
}

export interface IntentResult {
  intent: string;
  confidence: number;
  entities?: Record<string, any>;
}

// Base AI Provider Interface
export interface AIProvider {
  name: string;

  // Chat completion
  chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string>;
  chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void>;

  // Speech-to-Text
  transcribe?(audioBlob: Blob, config?: AIProviderConfig): Promise<TranscriptionResult>;
  transcribeStream?(
    audioStream: MediaStream,
    onTranscript: (result: TranscriptionResult) => void,
    config?: AIProviderConfig
  ): Promise<void>;

  // Text-to-Speech
  speak?(text: string, options?: SpeechSynthesisOptions): Promise<void>;
  synthesize?(text: string, options?: SpeechSynthesisOptions): Promise<Blob>;

  // Advanced Features
  analyzeSentiment?(text: string): Promise<SentimentResult>;
  detectIntent?(text: string): Promise<IntentResult>;
  embeddings?(text: string): Promise<number[]>;
}

export interface AIContextMessage extends AIMessage {
  id: string;
  isStreaming?: boolean;
  error?: string;
}

export interface AIConversationContext {
  messages: AIContextMessage[];
  currentProvider: string;
  isProcessing: boolean;
  config?: AIProviderConfig;
}

export interface UseAIReturn {
  messages: AIContextMessage[];
  sendMessage: (content: string) => Promise<void>;
  sendMessageStream: (content: string) => Promise<void>;
  clearMessages: () => void;
  isProcessing: boolean;
  error: string | null;
  setProvider: (provider: AIProvider) => void;
  currentProvider: string;
}
