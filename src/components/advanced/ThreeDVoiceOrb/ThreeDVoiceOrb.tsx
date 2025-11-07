import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { VoiceState, ThemeConfig } from '../../../types';
import { purpleDreamTheme } from '../../../themes';

interface Particle3DProps {
  position: [number, number, number];
  color: string;
  speed: number;
}

const Particle3D: React.FC<Particle3DProps> = ({ position, color, speed }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(time * speed) * 0.3;
    ref.current.position.y = position[1] + Math.cos(time * speed) * 0.3;
    ref.current.position.z = position[2] + Math.sin(time * speed * 0.5) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
};

interface OrbCoreProps {
  state: VoiceState;
  theme: ThemeConfig;
  audioData: number[];
}

const OrbCore: React.FC<OrbCoreProps> = ({ state, theme, audioData }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate particles based on state
  const particles = useMemo(() => {
    if (state !== 'thinking' && state !== 'speaking') return [];

    return Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 2;
      return {
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 1.5,
        ] as [number, number, number],
        color: theme.orb.particles,
        speed: 0.5 + Math.random() * 0.5,
      };
    });
  }, [state, theme]);

  // Calculate audio average for scaling
  const audioAverage = useMemo(() => {
    if (audioData.length === 0) return 0;
    const sum = audioData.reduce((acc, val) => acc + val, 0);
    return sum / audioData.length / 255;
  }, [audioData]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    switch (state) {
      case 'idle':
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
        break;
      case 'listening':
        meshRef.current.rotation.y = time * 0.3;
        meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
        break;
      case 'thinking':
        meshRef.current.rotation.x = time * 0.5;
        meshRef.current.rotation.y = time * 0.7;
        meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.08);
        break;
      case 'speaking':
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.scale.setScalar(1 + audioAverage * 0.3);
        break;
      case 'error':
        meshRef.current.rotation.z = Math.sin(time * 10) * 0.1;
        break;
    }
  });

  const getDistortSpeed = () => {
    switch (state) {
      case 'listening':
        return 2;
      case 'thinking':
        return 3;
      case 'speaking':
        return 1 + audioAverage * 3;
      default:
        return 1;
    }
  };

  const getDistortIntensity = () => {
    switch (state) {
      case 'listening':
        return 0.3;
      case 'thinking':
        return 0.5;
      case 'speaking':
        return 0.2 + audioAverage * 0.5;
      case 'error':
        return 0.1;
      default:
        return 0.2;
    }
  };

  return (
    <group>
      {/* Main Orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={theme.orb.core}
            emissive={theme.orb.outer}
            emissiveIntensity={0.5}
            distort={getDistortIntensity()}
            speed={getDistortSpeed()}
            roughness={0.2}
            metalness={0.8}
            toneMapped={false}
          />
        </Sphere>
      </Float>

      {/* Glow layer */}
      <Sphere args={[1.1, 32, 32]}>
        <meshBasicMaterial
          color={theme.accent.glow}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Particles */}
      {particles.map((particle, i) => (
        <Particle3D key={i} {...particle} />
      ))}

      {/* Lights */}
      <pointLight position={[2, 2, 2]} intensity={1} color={theme.orb.core} />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color={theme.orb.outer} />
    </group>
  );
};

interface ThreeDVoiceOrbProps {
  state?: VoiceState;
  theme?: ThemeConfig;
  audioData?: number[];
  size?: number;
  className?: string;
  onTap?: () => void;
}

/**
 * 3D Voice Orb - WebGL powered voice assistant orb
 * Uses Three.js for stunning 3D effects
 */
const ThreeDVoiceOrb: React.FC<ThreeDVoiceOrbProps> = ({
  state = 'idle',
  theme = purpleDreamTheme,
  audioData = [],
  size = 400,
  className = '',
  onTap,
}) => {
  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        cursor: onTap ? 'pointer' : 'default',
      }}
      onClick={onTap}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{
          background: 'transparent',
        }}
      >
        <ambientLight intensity={0.5} />
        <OrbCore state={state} theme={theme} audioData={audioData} />
      </Canvas>
    </motion.div>
  );
};

export default ThreeDVoiceOrb;
