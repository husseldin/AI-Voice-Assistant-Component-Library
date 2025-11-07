import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WaveformVisualizerProps } from '../../../types';

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  audioData,
  style,
  color = '#a855f7',
  barCount = 64,
  height = 100,
  animate = true,
  showMirror = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prepare data
    const data = audioData.length > 0 ? audioData : Array(barCount).fill(0);
    const normalizedData = normalizeData(data, barCount);

    // Draw based on style
    switch (style) {
      case 'bars':
        drawBars(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
        break;
      case 'wave':
        drawWave(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
        break;
      case 'circular':
        drawCircular(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
        break;
      case 'orbital':
        drawOrbital(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
        break;
    }

    if (showMirror && (style === 'bars' || style === 'wave')) {
      ctx.save();
      ctx.scale(1, -1);
      ctx.translate(0, -height);
      ctx.globalAlpha = 0.3;

      if (style === 'bars') {
        drawBars(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
      } else {
        drawWave(ctx, normalizedData, canvas.width / window.devicePixelRatio, height, color);
      }

      ctx.restore();
    }
  }, [audioData, style, color, barCount, height, showMirror]);

  const normalizeData = (data: number[], targetLength: number): number[] => {
    const normalized: number[] = [];
    const step = data.length / targetLength;

    for (let i = 0; i < targetLength; i++) {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);
      const slice = data.slice(start, end);
      const average = slice.reduce((sum, val) => sum + val, 0) / slice.length;
      normalized.push(average / 255); // Normalize to 0-1
    }

    return normalized;
  };

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string | string[]
  ) => {
    const barWidth = width / data.length;
    const gap = barWidth * 0.2;

    data.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      // Gradient color
      if (Array.isArray(color)) {
        const gradient = ctx.createLinearGradient(x, y, x, height);
        color.forEach((c, i) => {
          gradient.addColorStop(i / (color.length - 1), c);
        });
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = color;
      }

      // Draw bar with rounded top
      ctx.beginPath();
      ctx.roundRect(x + gap / 2, y, barWidth - gap, barHeight, [4, 4, 0, 0]);
      ctx.fill();
    });
  };

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string | string[]
  ) => {
    const step = width / data.length;
    const midHeight = height / 2;

    ctx.beginPath();
    ctx.moveTo(0, midHeight);

    data.forEach((value, index) => {
      const x = index * step;
      const y = midHeight - value * midHeight * 0.8;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width, midHeight);
    ctx.lineTo(0, midHeight);
    ctx.closePath();

    // Gradient fill
    if (Array.isArray(color)) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      color.forEach((c, i) => {
        gradient.addColorStop(i / (color.length - 1), c);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = color;
    }

    ctx.fill();

    // Stroke
    ctx.strokeStyle = color[0] || color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawCircular = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string | string[]
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const angleStep = (Math.PI * 2) / data.length;

    data.forEach((value, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const barHeight = value * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      // Gradient
      if (Array.isArray(color)) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        color.forEach((c, i) => {
          gradient.addColorStop(i / (color.length - 1), c);
        });
        ctx.strokeStyle = gradient;
      } else {
        ctx.strokeStyle = color;
      }

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  };

  const drawOrbital = (
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string | string[]
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 4;

    // Draw multiple orbital rings
    const rings = 3;
    for (let ring = 0; ring < rings; ring++) {
      const radius = baseRadius + ring * 20;
      const ringData = data.filter((_, i) => i % rings === ring);
      const angleStep = (Math.PI * 2) / ringData.length;

      ctx.beginPath();
      ringData.forEach((value, index) => {
        const angle = index * angleStep;
        const r = radius + value * 30;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();

      // Gradient
      if (Array.isArray(color)) {
        const colorIndex = ring % color.length;
        ctx.strokeStyle = color[colorIndex];
      } else {
        ctx.strokeStyle = color;
      }

      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', height }}
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

export default WaveformVisualizer;
