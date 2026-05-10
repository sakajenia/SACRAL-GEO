import type { ShapeInstance, ShapeType } from './types';

export interface ShapeCatalogEntry {
  type: ShapeType;
  label: string;
  group: 'platonic' | 'pattern' | 'symbol' | 'spiral';
  description: string;
  defaults: Partial<ShapeInstance>;
}

export const CATALOG: ShapeCatalogEntry[] = [
  // Platonic solids
  {
    type: 'tetrahedron',
    label: 'Tetrahedron',
    group: 'platonic',
    description: 'Element of fire — 4 triangular faces.',
    defaults: { detail: 0 },
  },
  {
    type: 'cube',
    label: 'Hexahedron',
    group: 'platonic',
    description: 'Element of earth — 6 square faces.',
    defaults: { detail: 0 },
  },
  {
    type: 'octahedron',
    label: 'Octahedron',
    group: 'platonic',
    description: 'Element of air — 8 triangular faces.',
    defaults: { detail: 0 },
  },
  {
    type: 'dodecahedron',
    label: 'Dodecahedron',
    group: 'platonic',
    description: 'Element of aether — 12 pentagonal faces.',
    defaults: { detail: 0 },
  },
  {
    type: 'icosahedron',
    label: 'Icosahedron',
    group: 'platonic',
    description: 'Element of water — 20 triangular faces.',
    defaults: { detail: 0 },
  },
  {
    type: 'sphere',
    label: 'Sphere',
    group: 'platonic',
    description: 'The unity, the All — perfect symmetry.',
    defaults: { detail: 2 },
  },
  // Patterns / multi-circle
  {
    type: 'vesicaPiscis',
    label: 'Vesica Piscis',
    group: 'pattern',
    description: 'Two overlapping circles — the womb of creation.',
    defaults: {},
  },
  {
    type: 'seedOfLife',
    label: 'Seed of Life',
    group: 'pattern',
    description: '7 circles — the seven days of creation.',
    defaults: {},
  },
  {
    type: 'eggOfLife',
    label: 'Egg of Life',
    group: 'pattern',
    description: '8 spheres — the second stage of cell division.',
    defaults: {},
  },
  {
    type: 'flowerOfLife',
    label: 'Flower of Life',
    group: 'pattern',
    description: '19 overlapping circles — blueprint of all forms.',
    defaults: { detail: 2 },
  },
  {
    type: 'fruitOfLife',
    label: 'Fruit of Life',
    group: 'pattern',
    description: '13 circles holding the cube of Metatron.',
    defaults: {},
  },
  // Symbols / sacred constructions
  {
    type: 'metatronsCube',
    label: "Metatron's Cube",
    group: 'symbol',
    description: '13 spheres connected — contains all platonic solids.',
    defaults: {},
  },
  {
    type: 'merkaba',
    label: 'Merkaba',
    group: 'symbol',
    description: 'Star tetrahedron — divine vehicle of light.',
    defaults: {},
  },
  {
    type: 'sriYantra',
    label: 'Sri Yantra',
    group: 'symbol',
    description: '9 interlocking triangles — the cosmic womb.',
    defaults: {},
  },
  {
    type: 'treeOfLife',
    label: 'Tree of Life',
    group: 'symbol',
    description: '10 sephirot — the kabbalistic tree.',
    defaults: {},
  },
  // Spirals
  {
    type: 'torus',
    label: 'Torus',
    group: 'spiral',
    description: 'Donut form — the field of energetic flow.',
    defaults: { detail: 1 },
  },
  {
    type: 'torusKnot',
    label: 'Torus Knot',
    group: 'spiral',
    description: '(p,q)-torus knot — woven flow lines.',
    defaults: { detail: 1 },
  },
  {
    type: 'fibonacci',
    label: 'Golden Spiral',
    group: 'spiral',
    description: 'Phi-based logarithmic spiral.',
    defaults: { detail: 2 },
  },
  {
    type: 'phyllotaxis',
    label: 'Phyllotaxis',
    group: 'spiral',
    description: 'Sunflower seed packing using the golden angle.',
    defaults: { detail: 2 },
  },
];

export const CATALOG_GROUPS: Array<{ key: string; label: string }> = [
  { key: 'platonic', label: 'Platonic Solids' },
  { key: 'pattern', label: 'Sacred Patterns' },
  { key: 'symbol', label: 'Sacred Symbols' },
  { key: 'spiral', label: 'Spirals & Fields' },
];

export function findCatalogEntry(type: ShapeType): ShapeCatalogEntry {
  const entry = CATALOG.find((c) => c.type === type);
  if (!entry) throw new Error(`Unknown shape type: ${type}`);
  return entry;
}
