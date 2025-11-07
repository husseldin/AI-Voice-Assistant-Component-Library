import { AIProvider, AIMessage, AIProviderConfig, AIStreamChunk } from '../types';

/**
 * Anthropic Provider - Claude 3 models
 */
export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL = 'https://api.anthropic.com/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        ...config?.headers,
      },
      body: JSON.stringify({
        model: config?.model || 'claude-3-sonnet-20240229',
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content })),
        system: config?.systemPrompt || messages.find(m => m.role === 'system')?.content,
        temperature: config?.temperature || 0.7,
        max_tokens: config?.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  async chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        ...config?.headers,
      },
      body: JSON.stringify({
        model: config?.model || 'claude-3-sonnet-20240229',
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content })),
        system: config?.systemPrompt || messages.find(m => m.role === 'system')?.content,
        temperature: config?.temperature || 0.7,
        max_tokens: config?.maxTokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No reader available');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);

            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text || '';
              if (content) {
                onChunk({ content, isComplete: false });
              }
            } else if (parsed.type === 'message_stop') {
              onChunk({ content: '', isComplete: true });
              return;
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  }
}
