import { AIProvider, AIMessage, AIProviderConfig, AIStreamChunk } from '../types';

/**
 * Mock Local Provider - For testing and development without API calls
 * Simulates AI responses locally
 */
export class MockLocalProvider implements AIProvider {
  name = 'MockLocal';
  private delay: number;

  constructor(delay = 50) {
    this.delay = delay;
  }

  async chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return 'Hello! How can I help you?';

    // Simple response generation
    const responses = [
      `I heard you say: "${lastUserMessage.content}". This is a mock response from a local AI.`,
      `That's an interesting question about "${lastUserMessage.content}". Let me help you with that.`,
      `I understand you're asking about "${lastUserMessage.content}". Here's what I think...`,
      `Based on what you said about "${lastUserMessage.content}", I can provide some insights.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void> {
    const response = await this.chat(messages, config);
    const words = response.split(' ');

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
      onChunk({
        content: words[i] + (i < words.length - 1 ? ' ' : ''),
        isComplete: i === words.length - 1,
      });
    }
  }
}

/**
 * Custom Provider - Bring your own API
 */
export class CustomProvider implements AIProvider {
  name = 'Custom';
  private endpoint: string;
  private headers: Record<string, string>;

  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.endpoint = endpoint;
    this.headers = headers;
  }

  async chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
        ...config?.headers,
      },
      body: JSON.stringify({
        messages,
        config,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.message || data.content || '';
  }

  async chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void> {
    // Fallback to non-streaming
    const response = await this.chat(messages, config);
    const words = response.split(' ');

    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onChunk({ content: word + ' ', isComplete: false });
    }
    onChunk({ content: '', isComplete: true });
  }
}
