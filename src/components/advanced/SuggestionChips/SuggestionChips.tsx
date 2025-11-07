import React from 'react';
import { motion } from 'framer-motion';

export interface Suggestion {
  id: string;
  text: string;
  icon?: string;
  action?: () => void;
}

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  maxVisible?: number;
  className?: string;
}

/**
 * SuggestionChips - Quick reply suggestions for voice assistants
 * Shows contextual suggestions that users can tap
 */
const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionClick,
  maxVisible = 6,
  className = '',
}) => {
  const visibleSuggestions = suggestions.slice(0, maxVisible);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {visibleSuggestions.map((suggestion) => (
        <motion.button
          key={suggestion.id}
          variants={item}
          onClick={() => {
            suggestion.action?.();
            onSuggestionClick(suggestion);
          }}
          className="group relative px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
          }}
          whileHover={{
            scale: 1.05,
            background: 'rgba(255, 255, 255, 0.15)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)',
            }}
          />

          {/* Content */}
          <span className="relative z-10 flex items-center gap-2">
            {suggestion.icon && <span>{suggestion.icon}</span>}
            <span>{suggestion.text}</span>
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;
