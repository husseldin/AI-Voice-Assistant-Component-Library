import React from 'react';
import { motion } from 'framer-motion';
import { ConversationBubbleProps } from '../../../types';

const ConversationBubble: React.FC<ConversationBubbleProps> = ({
  role,
  content,
  timestamp,
  isTyping = false,
  actions = [],
  avatar,
  showActions = true,
  animateIn = true,
  className = '',
}) => {
  const isUser = role === 'user';

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const typingDotVariants = {
    animate: (i: number) => ({
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.1,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}
      variants={bubbleVariants}
      initial={animateIn ? 'hidden' : 'visible'}
      animate="visible"
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
        {/* Avatar */}
        {avatar && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500">
            <img src={avatar} alt={role} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-br-sm'
                : 'bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-bl-sm'
            }`}
            style={{
              boxShadow: isUser
                ? '0 4px 20px rgba(168, 85, 247, 0.3)'
                : '0 4px 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            {isTyping ? (
              <div className="flex gap-1 py-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={typingDotVariants}
                    animate="animate"
                    className="w-2 h-2 rounded-full bg-white/60"
                  />
                ))}
              </div>
            ) : (
              <div className="text-sm leading-relaxed">{content}</div>
            )}
          </div>

          {/* Timestamp */}
          {timestamp && (
            <div
              className={`text-xs text-white/50 px-2 ${
                isUser ? 'text-right' : 'text-left'
              }`}
            >
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {/* Actions */}
          {showActions && actions.length > 0 && !isTyping && (
            <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {actions.map((action) => (
                <motion.button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.loading}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.loading ? (
                    <span className="inline-block animate-spin">⟳</span>
                  ) : (
                    <>
                      {action.icon && <span className="mr-1">{action.icon}</span>}
                      {action.label}
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversationBubble;
