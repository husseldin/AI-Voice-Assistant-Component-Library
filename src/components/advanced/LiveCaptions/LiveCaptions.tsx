import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveCaptionsProps {
  text: string;
  interimText?: string;
  position?: 'top' | 'bottom' | 'center';
  maxLines?: number;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
}

/**
 * LiveCaptions - Real-time speech-to-text captions
 * Accessibility-first live transcription display
 */
const LiveCaptions: React.FC<LiveCaptionsProps> = ({
  text,
  interimText = '',
  position = 'bottom',
  maxLines = 3,
  fontSize = 'lg',
  showBackground = true,
  className = '',
}) => {
  const fontSizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const positionMap = {
    top: 'top-8',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-8',
  };

  // Split text into lines based on maxLines
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).split(' ').length > 10 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const displayLines = lines.slice(-maxLines);

  return (
    <AnimatePresence>
      {(text || interimText) && (
        <motion.div
          initial={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'bottom' ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-1/2 -translate-x-1/2 ${positionMap[position]} z-50 max-w-4xl px-4 ${className}`}
        >
          <div
            className={`${fontSizeMap[fontSize]} font-medium text-white text-center px-6 py-4 rounded-2xl ${
              showBackground ? 'bg-black/80 backdrop-blur-md border border-white/10' : ''
            }`}
            style={{
              textShadow: showBackground ? 'none' : '2px 2px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            {displayLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {line}
              </motion.div>
            ))}

            {/* Interim text (gray/italic) */}
            {interimText && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/60 italic ml-2"
              >
                {interimText}
              </motion.span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveCaptions;
