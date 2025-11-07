import React from 'react';
import { motion } from 'framer-motion';
import { StatusIndicatorProps } from '../../../types';

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  subtitle,
  className = '',
}) => {
  const statusConfig = {
    idle: {
      icon: '⭕',
      text: 'Tap to speak',
      color: '#9ca3af',
    },
    listening: {
      icon: '🎤',
      text: 'Listening...',
      color: '#a855f7',
    },
    thinking: {
      icon: '🤔',
      text: 'Thinking...',
      color: '#ec4899',
    },
    speaking: {
      icon: '🔊',
      text: 'Speaking...',
      color: '#3b82f6',
    },
    error: {
      icon: '⚠️',
      text: 'Error occurred',
      color: '#ef4444',
    },
  };

  const config = statusConfig[status];

  const dotVariants = {
    animate: (i: number) => ({
      scale: [1, 1.2, 1],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        delay: i * 0.2,
        ease: 'easeInOut',
      },
    }),
  };

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    listening: {
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity },
    },
    thinking: {
      rotate: 360,
      transition: { duration: 2, repeat: Infinity, ease: 'linear' },
    },
    speaking: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.6, repeat: Infinity },
    },
    error: {
      x: [-2, 2, -2, 2, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className="text-4xl"
        variants={iconVariants}
        animate={status}
      >
        {config.icon}
      </motion.div>

      {/* Status Text */}
      <div className="flex items-center gap-2">
        <span
          className="text-lg font-medium"
          style={{ color: config.color }}
        >
          {config.text}
        </span>

        {/* Animated dots for listening/thinking/speaking */}
        {(status === 'listening' || status === 'thinking' || status === 'speaking') && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                animate="animate"
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="text-sm text-white/60"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default StatusIndicator;
