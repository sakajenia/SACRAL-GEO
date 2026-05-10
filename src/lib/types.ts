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
}

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
