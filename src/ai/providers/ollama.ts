import { AIProvider, AIMessage, AIProviderConfig, AIStreamChunk } from '../types';

/**
 * Ollama Provider - Local LLMs (Llama, Mistral, CodeLlama, etc.)
 * Runs models locally, no API key needed
 */
export class OllamaProvider implements AIProvider {
  name = 'Ollama';
  private baseURL: string;

  constructor(baseURL = 'http://localhost:11434') {
    this.baseURL = baseURL;
  }

  async chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || 'llama2',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        options: {
          temperature: config?.temperature || 0.7,
          num_predict: config?.maxTokens || 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  }

  async chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config?.model || 'llama2',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature: config?.temperature || 0.7,
          num_predict: config?.maxTokens || 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        onChunk({ content: '', isComplete: true });
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            onChunk({ content: parsed.message.content, isComplete: false });
          }
          if (parsed.done) {
            onChunk({ content: '', isComplete: true });
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}
