import React from 'react';
import { motion } from 'framer-motion';
import { ActionCardProps } from '../../../types';

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  loading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden rounded-2xl p-6 text-left ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
      }}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -4 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.2), transparent)',
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 text-3xl"
          animate={loading ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: 'linear' }}
        >
          {loading ? '⟳' : icon}
        </motion.div>

        {/* Text content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-white/70">{description}</p>}
        </div>
      </div>

      {/* Border glow animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: 0,
        }}
        whileHover={!disabled && !loading ? { opacity: 0.5 } : {}}
        transition={{ duration: 0.3 }}
      />

      {/* Disabled overlay */}
      {disabled && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center"
        >
          <span className="text-white/50 text-sm font-medium">Disabled</span>
        </div>
      )}
    </motion.button>
  );
};

export default ActionCard;
