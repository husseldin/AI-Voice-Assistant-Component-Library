import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceOrbProps } from '../../../types';
import { purpleDreamTheme } from '../../../themes';
import styles from './VoiceOrb.module.css';

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state = 'idle',
  size = 'lg',
  theme = purpleDreamTheme,
  audioData = [],
  onTap,
  intensity = 0.5,
  showParticles = true,
  showRings = true,
  className = '',
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  // Generate particles for thinking/speaking states
  useEffect(() => {
    if (showParticles && (state === 'thinking' || state === 'speaking')) {
      const particleCount = 12;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        angle: (360 / particleCount) * i,
        distance: 60 + Math.random() * 40,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [state, showParticles]);

  // Size mapping
  const sizeMap = {
    sm: 80,
    md: 120,
    lg: 180,
    xl: 240,
  };

  const orbSize = sizeMap[size];

  // Animation variants based on state
  const orbVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'easeInOut',
      },
    },
    listening: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    thinking: {
      rotate: 360,
      scale: [1, 1.05, 1],
      transition: {
        rotate: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
        scale: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      },
    },
    speaking: {
      scale: audioData.length > 0 ? 1 + (Math.max(...audioData) / 255) * 0.2 : 1,
      transition: {
        duration: 0.1,
        ease: 'easeOut',
      },
    },
    error: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  // Pulse ring animations
  const ringVariants = {
    animate: {
      scale: [0.8, 1.4],
      opacity: [1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  };

  // Particle animations
  const particleVariants = {
    animate: (custom: { angle: number; distance: number }) => ({
      x: [0, Math.cos((custom.angle * Math.PI) / 180) * custom.distance],
      y: [0, Math.sin((custom.angle * Math.PI) / 180) * custom.distance],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  const cssVariables = {
    '--orb-core': theme.orb.core,
    '--orb-outer': theme.orb.outer,
    '--orb-particles': theme.orb.particles,
    '--accent-primary': theme.accent.primary,
    '--accent-glow': theme.accent.glow,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles['orb-container']} ${className}`}
      style={{
        width: orbSize,
        height: orbSize,
        ...cssVariables,
      }}
    >
      {/* Pulse Rings - visible during listening state */}
      {showRings && state === 'listening' && (
        <div className={styles['pulse-rings']}>
          {[0, 0.5, 1].map((delay) => (
            <motion.div
              key={delay}
              className={styles['pulse-ring']}
              style={{
                width: orbSize * 1.5,
                height: orbSize * 1.5,
                borderColor: theme.accent.primary,
              }}
              variants={ringVariants}
              animate="animate"
              transition={{
                ...ringVariants.animate.transition,
                delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Orb */}
      <motion.div
        className={`${styles.orb} ${styles[`size-${size}`]} ${styles[`state-${state}`]}`}
        variants={orbVariants}
        animate={state}
        onClick={onTap}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(135deg, ${theme.orb.core}, ${theme.orb.outer})`,
          boxShadow: `0 0 ${60 * intensity}px ${theme.accent.glow}`,
        }}
      >
        {/* Glass overlay effect */}
        <div className={styles['orb-glass']} />

        {/* Glow effect */}
        <motion.div
          className={styles['orb-glow']}
          style={{
            background: `radial-gradient(circle, ${theme.accent.glow}, transparent)`,
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Particles - visible during thinking/speaking states */}
      <AnimatePresence>
        {showParticles && particles.length > 0 && (
          <div className={styles.particles}>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className={styles.particle}
                style={{
                  left: '50%',
                  top: '50%',
                  background: theme.orb.particles,
                  boxShadow: `0 0 10px ${theme.orb.particles}`,
                }}
                custom={{ angle: particle.angle, distance: particle.distance }}
                variants={particleVariants}
                animate="animate"
                initial={{ opacity: 0, scale: 0 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceOrb;
