import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceButtonProps } from '../../../types';

const VoiceButton: React.FC<VoiceButtonProps> = ({
  mode = 'toggle',
  isActive = false,
  onStart,
  onStop,
  size = 'lg',
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [internalActive, setInternalActive] = useState(isActive);

  const sizeMap = {
    sm: 48,
    md: 64,
    lg: 80,
    xl: 96,
  };

  const buttonSize = sizeMap[size];

  const handleMouseDown = () => {
    if (mode === 'press') {
      setIsPressed(true);
      onStart?.();
    }
  };

  const handleMouseUp = () => {
    if (mode === 'press') {
      setIsPressed(false);
      onStop?.();
    }
  };

  const handleClick = () => {
    if (mode === 'toggle') {
      const newActive = !internalActive;
      setInternalActive(newActive);
      if (newActive) {
        onStart?.();
      } else {
        onStop?.();
      }
    }
  };

  const active = mode === 'press' ? isPressed : internalActive;

  return (
    <motion.button
      className={`relative rounded-full flex items-center justify-center cursor-pointer ${className}`}
      style={{
        width: buttonSize,
        height: buttonSize,
        background: active
          ? 'linear-gradient(135deg, #a855f7, #ec4899)'
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: active
          ? '0 0 40px rgba(168, 85, 247, 0.6), 0 8px 32px rgba(31, 38, 135, 0.37)'
          : '0 8px 32px rgba(31, 38, 135, 0.37)',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: active ? [1, 1.05, 1] : 1,
      }}
      transition={{
        scale: {
          duration: 1,
          repeat: active ? Infinity : 0,
          ease: 'easeInOut',
        },
      }}
    >
      {/* Pulse rings when active */}
      {active && (
        <>
          {[0, 0.3, 0.6].map((delay) => (
            <motion.div
              key={delay}
              className="absolute inset-0 rounded-full border-2 border-purple-500"
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: 1.5,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Microphone Icon */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: active ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: active ? Infinity : 0,
        }}
      >
        <svg
          width={buttonSize * 0.4}
          height={buttonSize * 0.4}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
            fill={active ? 'white' : '#a855f7'}
          />
          <path
            d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 6.84 21.16 11.75 21.95V25H12.25V21.95C17.16 21.16 21 16.97 21 12V10H19Z"
            fill={active ? 'white' : '#a855f7'}
          />
        </svg>
      </motion.div>

      {/* Hold instruction for press mode */}
      {mode === 'press' && !isPressed && (
        <motion.div
          className="absolute -bottom-8 text-xs text-white/60 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Hold to speak
        </motion.div>
      )}
    </motion.button>
  );
};

export default VoiceButton;
