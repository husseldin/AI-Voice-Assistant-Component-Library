import { useState, useCallback, useRef } from 'react';
import { AIProvider, AIContextMessage, UseAIReturn, AIProviderConfig } from '../ai/types';
import { MockLocalProvider } from '../ai/providers';

/**
 * useAI Hook - Manage AI conversations with any provider
 * Supports OpenAI, Ollama, Anthropic, Local LLMs, and custom providers
 */
export const useAI = (
  initialProvider?: AIProvider,
  config?: AIProviderConfig
): UseAIReturn => {
  const [messages, setMessages] = useState<AIContextMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProviderState] = useState<AIProvider>(
    initialProvider || new MockLocalProvider()
  );

  const messageIdCounter = useRef(0);

  const generateId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsProcessing(true);
      setError(null);

      // Add user message
      const userMessage: AIContextMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Create assistant message placeholder
      const assistantMessageId = generateId();
      const assistantMessage: AIContextMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages(prev => [...prev, assistantMessage]);

      try {
        // Get AI response
        const aiMessages = [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }));

        const response = await provider.chat(aiMessages, config);

        // Update assistant message with response
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: response, isStreaming: false }
              : msg
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);

        // Update assistant message with error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: 'Sorry, an error occurred.', error: errorMessage }
              : msg
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [messages, provider, config]
  );

  const sendMessageStream = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsProcessing(true);
      setError(null);

      // Add user message
      const userMessage: AIContextMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Create assistant message placeholder
      const assistantMessageId = generateId();
      const assistantMessage: AIContextMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      try {
        // Get AI response with streaming
        const aiMessages = [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }));

        let fullResponse = '';

        await provider.chatStream(
          aiMessages,
          chunk => {
            if (!chunk.isComplete) {
              fullResponse += chunk.content;
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: fullResponse }
                    : msg
                )
              );
            } else {
              // Streaming complete
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
                )
              );
            }
          },
          config
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);

        // Update assistant message with error
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: 'Sorry, an error occurred.',
                  error: errorMessage,
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [messages, provider, config]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const setProvider = useCallback((newProvider: AIProvider) => {
    setProviderState(newProvider);
  }, []);

  return {
    messages,
    sendMessage,
    sendMessageStream,
    clearMessages,
    isProcessing,
    error,
    setProvider,
    currentProvider: provider.name,
  };
};
