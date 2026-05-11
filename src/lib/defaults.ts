import type { ShapeInstance } from './types';

export const SHAPE_DEFAULTS: Omit<ShapeInstance, 'id' | 'type' | 'name' | 'visible' | 'color' | 'array'> = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  rotationSpeed: [0, 0.2, 0],
  scale: 1,
  pulseAmplitude: 0,
  pulseSpeed: 0.5,
  breathing: false,
  emissive: 1.6,
  opacity: 1,
  detail: 0,
  thickness: 0.012,
  showVertices: false,
  wireframe: true,
  materialMode: 'wireframe',
  anchor: [0, 0, 0],
};

export const GLOBAL_DEFAULTS = {
  bloomIntensity: 1.4,
  bloomRadius: 0.7,
  background: '#05030c',
  showStars: true,
  showAxes: false,
  showGoldenRatio: false,
  meditationMode: false,
  cameraDistance: 5.5,
  autoRotateSpeed: 0.25,
  globalRotationMultiplier: 1,
  showParticles: true,
} as const;
