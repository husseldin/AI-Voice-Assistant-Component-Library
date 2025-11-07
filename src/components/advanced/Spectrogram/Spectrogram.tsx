import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SpectrogramProps {
  audioData: number[];
  width?: number;
  height?: number;
  colorScheme?: 'purple' | 'blue' | 'green' | 'fire';
  className?: string;
}

/**
 * Spectrogram - Real-time audio spectrogram visualization
 * Shows frequency content over time
 */
const Spectrogram: React.FC<SpectrogramProps> = ({
  audioData,
  width = 600,
  height = 200,
  colorScheme = 'purple',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[][]>([]);

  const getColorForValue = (value: number): string => {
    const schemes = {
      purple: [
        [26, 11, 46],   // Dark purple
        [139, 92, 246], // Medium purple
        [236, 72, 153], // Pink
        [255, 255, 255], // White
      ],
      blue: [
        [10, 25, 47],
        [37, 99, 235],
        [14, 165, 233],
        [255, 255, 255],
      ],
      green: [
        [6, 78, 59],
        [34, 197, 94],
        [134, 239, 172],
        [255, 255, 255],
      ],
      fire: [
        [0, 0, 0],
        [139, 0, 0],
        [255, 140, 0],
        [255, 255, 0],
      ],
    };

    const colors = schemes[colorScheme];
    const index = Math.floor(value * (colors.length - 1));
    const nextIndex = Math.min(index + 1, colors.length - 1);
    const blend = (value * (colors.length - 1)) % 1;

    const color1 = colors[index];
    const color2 = colors[nextIndex];

    const r = Math.floor(color1[0] + (color2[0] - color1[0]) * blend);
    const g = Math.floor(color1[1] + (color2[1] - color1[1]) * blend);
    const b = Math.floor(color1[2] + (color2[2] - color1[2]) * blend);

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Add current audio data to history
    if (audioData.length > 0) {
      historyRef.current.push([...audioData]);
      // Keep only last N frames
      const maxHistory = Math.floor(width / 2);
      if (historyRef.current.length > maxHistory) {
        historyRef.current.shift();
      }
    }

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw spectrogram
    const columnWidth = width / historyRef.current.length;
    const barHeight = height / (audioData.length || 128);

    historyRef.current.forEach((frame, frameIndex) => {
      const x = frameIndex * columnWidth;

      frame.forEach((value, freqIndex) => {
        const y = height - (freqIndex + 1) * barHeight;
        const normalizedValue = value / 255;

        ctx.fillStyle = getColorForValue(normalizedValue);
        ctx.fillRect(x, y, columnWidth + 1, barHeight + 1);
      });
    });
  }, [audioData, width, height, colorScheme]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '8px',
        }}
      />
    </motion.div>
  );
};

export default Spectrogram;
