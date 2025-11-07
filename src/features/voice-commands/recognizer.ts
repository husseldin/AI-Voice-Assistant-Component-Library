import { VoiceCommand, CommandIntent, VoiceCommandsConfig } from './types';

/**
 * Voice Command Recognizer
 * Matches speech input to registered commands using fuzzy matching
 */
export class VoiceCommandRecognizer {
  private commands: VoiceCommand[] = [];
  private config: VoiceCommandsConfig;

  constructor(config: VoiceCommandsConfig = {}) {
    this.config = {
      fuzzyMatch: true,
      confidenceThreshold: 0.6,
      maxSuggestions: 3,
      caseSensitive: false,
      ...config,
    };
  }

  registerCommand(command: VoiceCommand) {
    this.commands.push(command);
  }

  registerCommands(commands: VoiceCommand[]) {
    this.commands.push(...commands);
  }

  unregisterCommand(id: string) {
    this.commands = this.commands.filter(cmd => cmd.id !== id);
  }

  clearCommands() {
    this.commands = [];
  }

  recognize(input: string): CommandIntent | null {
    const normalizedInput = this.config.caseSensitive ? input : input.toLowerCase();

    let bestMatch: CommandIntent | null = null;
    let highestConfidence = 0;

    for (const command of this.commands) {
      if (!command.enabled && command.enabled !== undefined) continue;

      for (const phrase of command.phrases) {
        const normalizedPhrase = this.config.caseSensitive ? phrase : phrase.toLowerCase();
        const confidence = this.calculateConfidence(normalizedInput, normalizedPhrase);

        if (confidence > highestConfidence && confidence >= this.config.confidenceThreshold!) {
          highestConfidence = confidence;
          bestMatch = {
            command,
            confidence,
            params: this.extractParams(normalizedInput, normalizedPhrase),
          };
        }
      }
    }

    return bestMatch;
  }

  getSuggestions(input: string): CommandIntent[] {
    const normalizedInput = this.config.caseSensitive ? input : input.toLowerCase();
    const suggestions: CommandIntent[] = [];

    for (const command of this.commands) {
      if (!command.enabled && command.enabled !== undefined) continue;

      for (const phrase of command.phrases) {
        const normalizedPhrase = this.config.caseSensitive ? phrase : phrase.toLowerCase();
        const confidence = this.calculateConfidence(normalizedInput, normalizedPhrase);

        if (confidence >= this.config.confidenceThreshold!) {
          suggestions.push({
            command,
            confidence,
            params: this.extractParams(normalizedInput, normalizedPhrase),
          });
        }
      }
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, this.config.maxSuggestions);
  }

  private calculateConfidence(input: string, phrase: string): number {
    // Exact match
    if (input === phrase) return 1.0;

    // Contains match
    if (phrase.includes(input) || input.includes(phrase)) {
      const longer = Math.max(input.length, phrase.length);
      const shorter = Math.min(input.length, phrase.length);
      return shorter / longer;
    }

    // Fuzzy match using Levenshtein distance
    if (this.config.fuzzyMatch) {
      const distance = this.levenshteinDistance(input, phrase);
      const maxLength = Math.max(input.length, phrase.length);
      return 1 - distance / maxLength;
    }

    return 0;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private extractParams(input: string, phrase: string): Record<string, any> {
    const params: Record<string, any> = {};

    // Extract parameters from patterns like "set timer for {duration}"
    const paramPattern = /\{(\w+)\}/g;
    const matches = phrase.matchAll(paramPattern);

    for (const match of matches) {
      const paramName = match[1];
      const paramPattern = phrase.replace(`{${paramName}}`, '(.+)');
      const regex = new RegExp(paramPattern, 'i');
      const result = input.match(regex);

      if (result && result[1]) {
        params[paramName] = result[1].trim();
      }
    }

    return params;
  }

  getCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  getEnabledCommands(): VoiceCommand[] {
    return this.commands.filter(cmd => cmd.enabled !== false);
  }
}
