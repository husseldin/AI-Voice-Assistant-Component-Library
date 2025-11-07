import React from 'react';
import { motion } from 'framer-motion';

interface SentimentDisplayProps {
  score: number; // -1 to 1
  label?: 'positive' | 'neutral' | 'negative';
  magnitude?: number; // 0 to 1
  showLabel?: boolean;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * SentimentDisplay - Visual sentiment analysis indicator
 * Shows emotional tone of conversation
 */
const SentimentDisplay: React.FC<SentimentDisplayProps> = ({
  score,
  label,
  magnitude = 0.5,
  showLabel = true,
  showScore = false,
  size = 'md',
  className = '',
}) => {
  const getSentimentColor = () => {
    if (score > 0.3) return { bg: '#10b981', text: 'Positive' };
    if (score < -0.3) return { bg: '#ef4444', text: 'Negative' };
    return { bg: '#6b7280', text: 'Neutral' };
  };

  const sentiment = getSentimentColor();
  const displayLabel = label || sentiment.text.toLowerCase() as 'positive' | 'neutral' | 'negative';

  const sizeMap = {
    sm: { container: 'w-32', height: 'h-1', text: 'text-xs' },
    md: { container: 'w-48', height: 'h-2', text: 'text-sm' },
    lg: { container: 'w-64', height: 'h-3', text: 'text-base' },
  };

  const getEmoji = () => {
    if (score > 0.5) return '😊';
    if (score > 0.2) return '🙂';
    if (score > -0.2) return '😐';
    if (score > -0.5) return '😕';
    return '😞';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Emoji indicator */}
      <div className="flex items-center justify-between">
        <span className="text-2xl">{getEmoji()}</span>
        {showLabel && (
          <span className={`${sizeMap[size].text} font-medium`} style={{ color: sentiment.bg }}>
            {displayLabel.charAt(0).toUpperCase() + displayLabel.slice(1)}
          </span>
        )}
        {showScore && (
          <span className={`${sizeMap[size].text} text-white/60`}>
            {score.toFixed(2)}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={`${sizeMap[size].container} relative`}>
        {/* Background */}
        <div className={`w-full ${sizeMap[size].height} bg-white/10 rounded-full overflow-hidden`}>
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />

          {/* Sentiment bar */}
          <motion.div
            className={`${sizeMap[size].height} rounded-full`}
            style={{
              background: sentiment.bg,
              boxShadow: `0 0 10px ${sentiment.bg}`,
            }}
            initial={{ width: '50%', x: 0 }}
            animate={{
              width: `${Math.abs(score) * 50}%`,
              x: score > 0 ? '100%' : `${100 - Math.abs(score) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Magnitude indicator */}
        {magnitude > 0 && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${(score + 1) * 50}%`,
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div
              className="w-3 h-3 rounded-full border-2 border-white"
              style={{
                background: sentiment.bg,
                opacity: magnitude,
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SentimentDisplay;
