import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CircularSpectrumProps {
  audioData: number[];
  size?: number;
  innerRadius?: number;
  barWidth?: number;
  gap?: number;
  colors?: string[];
  showCenter?: boolean;
  className?: string;
}

/**
 * CircularSpectrum - Circular audio spectrum analyzer
 * Beautiful radial visualization of audio frequencies
 */
const CircularSpectrum: React.FC<CircularSpectrumProps> = ({
  audioData,
  size = 400,
  innerRadius = 60,
  barWidth = 4,
  gap = 2,
  colors = ['#a855f7', '#ec4899', '#f59e0b'],
  showCenter = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = size / 2;
    const centerY = size / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    if (showCenter) {
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        innerRadius
      );
      gradient.addColorStop(0, colors[0] + '40');
      gradient.addColorStop(1, colors[0] + '10');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Prepare data
    const data = audioData.length > 0 ? audioData : Array(128).fill(0);
    const barCount = Math.min(data.length, 180);
    const angleStep = (Math.PI * 2) / barCount;

    // Draw bars
    data.slice(0, barCount).forEach((value, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = value / 255;
      const barHeight = normalizedValue * (size / 2 - innerRadius - 20);

      // Calculate color
      const colorIndex = Math.floor((index / barCount) * (colors.length - 1));
      const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
      const blend = ((index / barCount) * (colors.length - 1)) % 1;

      const color1 = colors[colorIndex];
      const color2 = colors[nextColorIndex];

      // Create gradient for bar
      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * (innerRadius + barHeight);
      const y2 = centerY + Math.sin(angle) * (innerRadius + barHeight);

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = barWidth;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Add glow effect for high values
      if (normalizedValue > 0.7) {
        ctx.shadowColor = colors[nextColorIndex];
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Draw center pulse
    if (showCenter && audioData.length > 0) {
      const avgValue = audioData.reduce((sum, val) => sum + val, 0) / audioData.length / 255;
      const pulseRadius = innerRadius * (0.7 + avgValue * 0.3);

      const pulseGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        pulseRadius
      );
      pulseGradient.addColorStop(0, colors[0] + 'ff');
      pulseGradient.addColorStop(0.7, colors[1] + '80');
      pulseGradient.addColorStop(1, colors[1] + '00');

      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [audioData, size, innerRadius, barWidth, gap, colors, showCenter]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </motion.div>
  );
};

export default CircularSpectrum;
