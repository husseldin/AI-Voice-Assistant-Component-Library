export interface VoiceCommand {
  id: string;
  name: string;
  phrases: string[];
  description?: string;
  category?: string;
  icon?: string;
  handler: (params?: Record<string, any>) => void | Promise<void>;
  enabled?: boolean;
}

export interface CommandIntent {
  command: VoiceCommand;
  confidence: number;
  params?: Record<string, any>;
}

export interface CommandCategory {
  id: string;
  name: string;
  icon?: string;
  commands: VoiceCommand[];
}

export interface VoiceCommandsConfig {
  fuzzyMatch?: boolean;
  confidenceThreshold?: number;
  maxSuggestions?: number;
  caseSensitive?: boolean;
}
