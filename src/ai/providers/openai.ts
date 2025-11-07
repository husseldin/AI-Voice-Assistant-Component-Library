import { AIProvider, AIMessage, AIProviderConfig, AIStreamChunk, TranscriptionResult } from '../types';

/**
 * OpenAI Provider - GPT-4, GPT-3.5, Whisper
 */
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  async chat(messages: AIMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...config?.headers,
      },
      body: JSON.stringify({
        model: config?.model || 'gpt-4',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: config?.temperature || 0.7,
        max_tokens: config?.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async chatStream(
    messages: AIMessage[],
    onChunk: (chunk: AIStreamChunk) => void,
    config?: AIProviderConfig
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...config?.headers,
      },
      body: JSON.stringify({
        model: config?.model || 'gpt-4',
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature: config?.temperature || 0.7,
        max_tokens: config?.maxTokens || 2000,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
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
          if (data === '[DONE]') {
            onChunk({ content: '', isComplete: true });
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            if (content) {
              onChunk({ content, isComplete: false });
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  }

  async transcribe(audioBlob: Blob, config?: AIProviderConfig): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', config?.model || 'whisper-1');

    const response = await fetch(`${this.baseURL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.text,
      language: data.language,
      duration: data.duration,
    };
  }
}
