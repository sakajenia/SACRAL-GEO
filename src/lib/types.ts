export type ShapeType =
  | 'tetrahedron'
  | 'cube'
  | 'octahedron'
  | 'dodecahedron'
  | 'icosahedron'
  | 'sphere'
  | 'torus'
  | 'torusKnot'
  | 'vesicaPiscis'
  | 'seedOfLife'
  | 'eggOfLife'
  | 'flowerOfLife'
  | 'fruitOfLife'
  | 'metatronsCube'
  | 'merkaba'
  | 'sriYantra'
  | 'fibonacci'
  | 'phyllotaxis'
  | 'treeOfLife';

export type ArrayMode =
  | 'none'
  | 'linear'
  | 'polar'
  | 'spherical'
  | 'cubic'
  | 'helix'
  | 'disc'
  | 'revolve';

export type AxisKey = 'x' | 'y' | 'z';

export const AXES: readonly AxisKey[] = ['x', 'y', 'z'] as const;

export interface ArrayConfig {
  mode: ArrayMode;
  count: number;        // total copies (>=1)
  radius: number;       // for polar/spherical/helix
  spacing: number;      // for linear/cubic/disc
  axis: AxisKey;        // for linear/polar/helix/revolve
  countX: number;       // for cubic
  countY: number;
  countZ: number;
  height: number;       // for helix (along axis)
  turns: number;        // for helix (number of revolutions)
  sweep: number;        // for revolve: total sweep angle in radians (default 2π)
  faceOutward: boolean; // orient toward / away from anchor
  scaleFalloff: number; // -1..1 — outer copies shrink (>0) or grow (<0)
  twist: number;        // additional rotation per copy along its axis (radians)
}

export interface ShapeInstance {
  id: string;
  type: ShapeType;
  name: string;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: [number, number, number];
  scale: number;
  pulseAmplitude: number;
  pulseSpeed: number;
  breathing: boolean;
  color: string;
  emissive: number;
  wireframe: boolean;
  opacity: number;
  detail: number;
  thickness: number;
  showVertices: boolean;
  // — repeat —
  anchor: [number, number, number];
  array: ArrayConfig;
}

export const DEFAULT_ARRAY: ArrayConfig = {
  mode: 'none',
  count: 1,
  radius: 1.5,
  spacing: 0.6,
  axis: 'y',
  countX: 3,
  countY: 3,
  countZ: 3,
  height: 2,
  turns: 2,
  sweep: Math.PI * 2,
  faceOutward: true,
  scaleFalloff: 0,
  twist: 0,
};

export interface SceneState {
  shapes: ShapeInstance[];
  selectedId: string | null;
  bloomIntensity: number;
  bloomRadius: number;
  background: string;
  showStars: boolean;
  showAxes: boolean;
  showGoldenRatio: boolean;
  meditationMode: boolean;
  cameraDistance: number;
  autoRotateSpeed: number;
  globalRotationMultiplier: number;
}
