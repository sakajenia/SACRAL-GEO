import type { ShapeInstance, ShapeType } from './types';

export interface ShapeCapabilities {
  detail: boolean;
  thickness: boolean;
  wireframe: boolean;
}

export interface ShapeCatalogEntry {
  type: ShapeType;
  label: string;
  group: 'platonic' | 'pattern' | 'symbol' | 'spiral';
  description: string;
  defaults: Partial<ShapeInstance>;
  capabilities: ShapeCapabilities;
}

const SOLID_CAPS: ShapeCapabilities = { detail: true, thickness: false, wireframe: true };
const RING_CAPS: ShapeCapabilities = { detail: false, thickness: true, wireframe: false };
const DETAILED_RING_CAPS: ShapeCapabilities = { detail: true, thickness: true, wireframe: false };
const PURE_LINE_CAPS: ShapeCapabilities = { detail: false, thickness: false, wireframe: false };
const WIRE_ONLY_CAPS: ShapeCapabilities = { detail: false, thickness: false, wireframe: true };

export const CATALOG: ShapeCatalogEntry[] = [
  // Platonic solids
  { type: 'tetrahedron',  label: 'Tetrahedron',  group: 'platonic', description: 'Element of fire — 4 triangular faces.',          defaults: { detail: 0 }, capabilities: SOLID_CAPS },
  { type: 'cube',         label: 'Hexahedron',   group: 'platonic', description: 'Element of earth — 6 square faces.',             defaults: { detail: 0 }, capabilities: SOLID_CAPS },
  { type: 'octahedron',   label: 'Octahedron',   group: 'platonic', description: 'Element of air — 8 triangular faces.',           defaults: { detail: 0 }, capabilities: SOLID_CAPS },
  { type: 'dodecahedron', label: 'Dodecahedron', group: 'platonic', description: 'Element of aether — 12 pentagonal faces.',       defaults: { detail: 0 }, capabilities: SOLID_CAPS },
  { type: 'icosahedron',  label: 'Icosahedron',  group: 'platonic', description: 'Element of water — 20 triangular faces.',        defaults: { detail: 0 }, capabilities: SOLID_CAPS },
  { type: 'sphere',       label: 'Sphere',       group: 'platonic', description: 'The unity, the All — perfect symmetry.',         defaults: { detail: 2 }, capabilities: SOLID_CAPS },
  // Patterns / multi-circle
  { type: 'vesicaPiscis', label: 'Vesica Piscis',group: 'pattern',  description: 'Two overlapping circles — the womb of creation.',defaults: {},            capabilities: RING_CAPS },
  { type: 'seedOfLife',   label: 'Seed of Life', group: 'pattern',  description: '7 circles — the seven days of creation.',        defaults: {},            capabilities: RING_CAPS },
  { type: 'eggOfLife',    label: 'Egg of Life',  group: 'pattern',  description: '8 spheres — the second stage of cell division.', defaults: {},            capabilities: PURE_LINE_CAPS },
  { type: 'flowerOfLife', label: 'Flower of Life',group: 'pattern', description: '19 overlapping circles — blueprint of all forms.',defaults:{ detail: 2 }, capabilities: DETAILED_RING_CAPS },
  { type: 'fruitOfLife',  label: 'Fruit of Life',group: 'pattern',  description: '13 circles holding the cube of Metatron.',       defaults: {},            capabilities: RING_CAPS },
  // Symbols / sacred constructions
  { type: 'metatronsCube',label: "Metatron's Cube",group:'symbol',  description: '13 spheres connected — contains all platonic solids.',defaults:{},        capabilities: RING_CAPS },
  { type: 'merkaba',      label: 'Merkaba',      group: 'symbol',   description: 'Star tetrahedron — divine vehicle of light.',    defaults: {},            capabilities: WIRE_ONLY_CAPS },
  { type: 'sriYantra',    label: 'Sri Yantra',   group: 'symbol',   description: '9 interlocking triangles — the cosmic womb.',    defaults: {},            capabilities: PURE_LINE_CAPS },
  { type: 'treeOfLife',   label: 'Tree of Life', group: 'symbol',   description: '10 sephirot — the kabbalistic tree.',            defaults: {},            capabilities: PURE_LINE_CAPS },
  // Spirals
  { type: 'torus',        label: 'Torus',        group: 'spiral',   description: 'Donut form — the field of energetic flow.',      defaults: { detail: 1 }, capabilities: SOLID_CAPS },
  { type: 'torusKnot',    label: 'Torus Knot',   group: 'spiral',   description: '(p,q)-torus knot — woven flow lines.',           defaults: { detail: 1 }, capabilities: SOLID_CAPS },
  { type: 'fibonacci',    label: 'Golden Spiral',group: 'spiral',   description: 'Phi-based logarithmic spiral.',                  defaults: { detail: 2 }, capabilities: DETAILED_RING_CAPS },
  { type: 'phyllotaxis',  label: 'Phyllotaxis',  group: 'spiral',   description: 'Sunflower seed packing using the golden angle.', defaults: { detail: 2 }, capabilities: DETAILED_RING_CAPS },
  // Stars & 6-fold symmetry
  { type: 'hexagram',      label: 'Hexagram',      group: 'symbol', description: 'Star of David — two interlocking triangles.',  defaults: {},            capabilities: RING_CAPS },
  { type: 'pentagram',     label: 'Pentagram',     group: 'symbol', description: '5-pointed star — phi-encoded sacred star.',    defaults: {},            capabilities: RING_CAPS },
  { type: 'starOfLakshmi', label: 'Star of Lakshmi',group:'symbol', description: '8-pointed octagram — two overlapping squares.',defaults: {},            capabilities: RING_CAPS },
  { type: 'cuboctahedron', label: 'Vector Equilibrium',group:'platonic',description:'Cuboctahedron — Bucky\'s perfect balance.',defaults: { detail: 0 }, capabilities: SOLID_CAPS },
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
