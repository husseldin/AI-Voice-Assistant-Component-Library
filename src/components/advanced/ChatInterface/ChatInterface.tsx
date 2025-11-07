import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationBubble } from '../../core/ConversationBubble';
import { AIContextMessage } from '../../../ai/types';

interface ChatInterfaceProps {
  messages: AIContextMessage[];
  isProcessing?: boolean;
  showTimestamps?: boolean;
  showAvatars?: boolean;
  userAvatar?: string;
  assistantAvatar?: string;
  onMessageAction?: (messageId: string, action: string) => void;
  className?: string;
}

/**
 * ChatInterface - Complete chat UI with threading and rich messages
 * Displays AI conversation with automatic scrolling and actions
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isProcessing = false,
  showTimestamps = true,
  showAvatars = true,
  userAvatar,
  assistantAvatar,
  onMessageAction,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, autoScroll]);

  // Detect manual scrolling
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const getMessageActions = (message: AIContextMessage) => {
    if (message.role === 'user') return [];

    return [
      {
        id: 'copy',
        label: 'Copy',
        icon: '📋',
        onClick: () => {
          navigator.clipboard.writeText(message.content);
          onMessageAction?.(message.id, 'copy');
        },
      },
      {
        id: 'regenerate',
        label: 'Regenerate',
        icon: '🔄',
        onClick: () => {
          onMessageAction?.(message.id, 'regenerate');
        },
      },
    ];
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
        }}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-white/50 text-center"
            >
              <div>
                <div className="text-4xl mb-4">💬</div>
                <p className="text-lg">Start a conversation</p>
                <p className="text-sm mt-2">Your messages will appear here</p>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <ConversationBubble
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={showTimestamps ? message.timestamp : undefined}
                isTyping={message.isStreaming}
                avatar={
                  showAvatars
                    ? message.role === 'user'
                      ? userAvatar
                      : assistantAvatar
                    : undefined
                }
                actions={getMessageActions(message)}
                showActions={true}
                animateIn={true}
              />
            ))
          )}

          {/* Processing indicator */}
          {isProcessing && messages[messages.length - 1]?.role !== 'assistant' && (
            <ConversationBubble
              key="processing"
              role="assistant"
              content=""
              isTyping={true}
              animateIn={true}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {!autoScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => {
              setAutoScroll(true);
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
              });
            }}
            className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full p-3 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↓
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
