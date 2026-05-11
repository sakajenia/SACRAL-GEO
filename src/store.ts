import { create } from 'zustand';
import type { ShapeInstance, ShapeType, MaterialMode } from './lib/types';
import { DEFAULT_ARRAY } from './lib/types';
import { findCatalogEntry } from './lib/catalog';
import { ACCENT_PALETTE, pickAccent } from './lib/colors';
import { decodeStateFromUrl, encodeStateToUrl } from './lib/urlState';
import { THEMES, type ThemeKey, applyThemeToShapes } from './lib/themes';
import { SHAPE_DEFAULTS, GLOBAL_DEFAULTS } from './lib/defaults';

export type TransformMode = 'off' | 'translate' | 'rotate' | 'scale';

const CUSTOM_PRESETS_KEY = 'sacral-geo-custom-presets';

export interface CustomPreset {
  id: string;
  name: string;
  createdAt: number;
  snapshot: StoreSnapshot;
}

function loadCustomPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomPreset[];
  } catch {
    return [];
  }
}

function saveCustomPresets(list: CustomPreset[]) {
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export interface Store {
  // Scene
  shapes: ShapeInstance[];
  selectedId: string | null;

  // Globals
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
  themeKey: ThemeKey;
  showParticles: boolean;
  transformMode: TransformMode;

  // Persisted user presets
  customPresets: CustomPreset[];

  // History
  past: StoreSnapshot[];
  future: StoreSnapshot[];

  // Actions
  addShape: (type: ShapeType) => string;
  removeShape: (id: string) => void;
  updateShape: (id: string, partial: Partial<ShapeInstance>) => void;
  selectShape: (id: string | null) => void;
  duplicateShape: (id: string) => void;
  reorderShape: (id: string, direction: -1 | 1) => void;
  clearScene: () => void;
  loadPreset: (preset: PresetKey) => void;
  randomizeColors: () => void;
  applyTheme: (key: ThemeKey) => void;
  setTransformMode: (m: TransformMode) => void;
  saveCustomPreset: (name: string) => void;
  loadCustomPreset: (id: string) => void;
  removeCustomPreset: (id: string) => void;
  setGlobal: <K extends GlobalKeys>(key: K, value: Store[K]) => void;
  syncToUrl: () => void;
  loadFromUrl: () => boolean;
  serialize: () => StoreSnapshot;
  hydrate: (snap: StoreSnapshot) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

type GlobalKeys =
  | 'bloomIntensity'
  | 'bloomRadius'
  | 'background'
  | 'showStars'
  | 'showAxes'
  | 'showGoldenRatio'
  | 'meditationMode'
  | 'cameraDistance'
  | 'autoRotateSpeed'
  | 'globalRotationMultiplier'
  | 'showParticles';

export interface StoreSnapshot {
  shapes: ShapeInstance[];
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
  themeKey?: ThemeKey;
  showParticles?: boolean;
}

export type PresetKey =
  | 'merkaba-flower'
  | 'metatron-stack'
  | 'platonic-spin'
  | 'sri-portal'
  | 'cosmic-egg'
  | 'flower-revolve'
  | 'flower-sphere'
  | 'merkaba-lattice'
  | 'helix-of-life'
  | 'golden-mandala';

let idCounter = 0;
const newId = () => `s_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

function makeShape(type: ShapeType, index: number): ShapeInstance {
  const entry = findCatalogEntry(type);
  const base: ShapeInstance = {
    ...SHAPE_DEFAULTS,
    id: newId(),
    type,
    name: entry.label,
    visible: true,
    color: pickAccent(index),
    array: { ...DEFAULT_ARRAY },
  };
  return { ...base, ...entry.defaults } as ShapeInstance;
}

function resolveMaterialMode(s: Partial<ShapeInstance>): MaterialMode {
  if (s.materialMode) return s.materialMode;
  // v1 URLs only had `wireframe: boolean` — bridge to the new MaterialMode union.
  return s.wireframe === false ? 'solid' : 'wireframe';
}

function normalizeShape(s: Partial<ShapeInstance> & { id: string; type: ShapeType }): ShapeInstance {
  return {
    ...SHAPE_DEFAULTS,
    name: findCatalogEntry(s.type).label,
    visible: true,
    color: '#a78bfa',
    ...s,
    materialMode: resolveMaterialMode(s),
    array: { ...DEFAULT_ARRAY, ...(s.array ?? {}) },
  };
}

function defaultShapes(): ShapeInstance[] {
  const flower = makeShape('flowerOfLife', 0);
  flower.color = '#a78bfa';
  flower.scale = 1.4;
  flower.opacity = 0.9;
  return [flower];
}

const initialShapes = defaultShapes();

const HISTORY_LIMIT = 30;

export const useStore = create<Store>((set, get) => ({
  shapes: initialShapes,
  selectedId: initialShapes[0]?.id ?? null,

  ...GLOBAL_DEFAULTS,
  themeKey: 'neon',
  transformMode: 'off',

  customPresets: loadCustomPresets(),

  past: [],
  future: [],

  pushHistory: () => {
    const snap = get().serialize();
    set((s) => {
      const next = [...s.past, snap];
      if (next.length > HISTORY_LIMIT) next.shift();
      return { past: next, future: [] };
    });
  },

  undo: () => {
    const s = get();
    if (s.past.length === 0) return;
    const current = s.serialize();
    const previous = s.past[s.past.length - 1];
    set({ past: s.past.slice(0, -1), future: [current, ...s.future] });
    s.hydrate(previous);
  },

  redo: () => {
    const s = get();
    if (s.future.length === 0) return;
    const current = s.serialize();
    const next = s.future[0];
    set({ past: [...s.past, current], future: s.future.slice(1) });
    s.hydrate(next);
  },

  addShape: (type) => {
    get().pushHistory();
    const shape = makeShape(type, get().shapes.length);
    set((s) => ({ shapes: [...s.shapes, shape], selectedId: shape.id }));
    get().syncToUrl();
    return shape.id;
  },

  removeShape: (id) => {
    get().pushHistory();
    set((s) => ({
      shapes: s.shapes.filter((x) => x.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
    get().syncToUrl();
  },

  updateShape: (id, partial) => {
    set((s) => ({
      shapes: s.shapes.map((x) => (x.id === id ? { ...x, ...partial } : x)),
    }));
    get().syncToUrl();
  },

  selectShape: (id) => set({ selectedId: id }),

  duplicateShape: (id) => {
    const src = get().shapes.find((x) => x.id === id);
    if (!src) return;
    get().pushHistory();
    const copy: ShapeInstance = {
      ...src,
      id: newId(),
      name: `${src.name} ·`,
      position: [src.position[0] + 0.4, src.position[1], src.position[2]],
    };
    set((s) => ({ shapes: [...s.shapes, copy], selectedId: copy.id }));
    get().syncToUrl();
  },

  reorderShape: (id, direction) => {
    set((s) => {
      const idx = s.shapes.findIndex((x) => x.id === id);
      if (idx < 0) return {};
      const next = idx + direction;
      if (next < 0 || next >= s.shapes.length) return {};
      const copy = [...s.shapes];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return { shapes: copy };
    });
    get().syncToUrl();
  },

  clearScene: () => {
    get().pushHistory();
    set({ shapes: [], selectedId: null });
    get().syncToUrl();
  },

  loadPreset: (preset) => {
    get().pushHistory();
    const shapes = buildPreset(preset);
    set({ shapes, selectedId: shapes[0]?.id ?? null });
    get().syncToUrl();
  },

  randomizeColors: () => {
    get().pushHistory();
    set((s) => ({
      shapes: s.shapes.map((x) => ({
        ...x,
        color: ACCENT_PALETTE[Math.floor(Math.random() * ACCENT_PALETTE.length)],
      })),
    }));
    get().syncToUrl();
  },

  applyTheme: (key) => {
    get().pushHistory();
    const t = THEMES[key];
    set((s) => ({
      themeKey: key,
      background: t.background,
      bloomIntensity: t.bloomIntensity,
      bloomRadius: t.bloomRadius,
      shapes: applyThemeToShapes(s.shapes, t),
    }));
    get().syncToUrl();
  },

  setTransformMode: (m) => set({ transformMode: m }),

  saveCustomPreset: (name) => {
    const snap = get().serialize();
    const preset: CustomPreset = {
      id: `cp_${Date.now().toString(36)}`,
      name: name.trim() || 'Untitled',
      createdAt: Date.now(),
      snapshot: snap,
    };
    const next = [preset, ...get().customPresets].slice(0, 30);
    saveCustomPresets(next);
    set({ customPresets: next });
  },

  loadCustomPreset: (id) => {
    const preset = get().customPresets.find((p) => p.id === id);
    if (!preset) return;
    get().pushHistory();
    get().hydrate(preset.snapshot);
    get().syncToUrl();
  },

  removeCustomPreset: (id) => {
    const next = get().customPresets.filter((p) => p.id !== id);
    saveCustomPresets(next);
    set({ customPresets: next });
  },

  setGlobal: (key, value) => {
    set({ [key]: value } as Partial<Store>);
    get().syncToUrl();
  },

  syncToUrl: () => {
    const snap = get().serialize();
    encodeStateToUrl(snap);
  },

  loadFromUrl: () => {
    const snap = decodeStateFromUrl();
    if (!snap) return false;
    get().hydrate(snap);
    return true;
  },

  serialize: () => {
    const s = get();
    return {
      shapes: s.shapes,
      bloomIntensity: s.bloomIntensity,
      bloomRadius: s.bloomRadius,
      background: s.background,
      showStars: s.showStars,
      showAxes: s.showAxes,
      showGoldenRatio: s.showGoldenRatio,
      meditationMode: s.meditationMode,
      cameraDistance: s.cameraDistance,
      autoRotateSpeed: s.autoRotateSpeed,
      globalRotationMultiplier: s.globalRotationMultiplier,
      themeKey: s.themeKey,
      showParticles: s.showParticles,
    };
  },

  hydrate: (snap) => {
    const shapes = snap.shapes.map((s) => normalizeShape(s));
    set({
      shapes,
      bloomIntensity: snap.bloomIntensity,
      bloomRadius: snap.bloomRadius,
      background: snap.background,
      showStars: snap.showStars,
      showAxes: snap.showAxes,
      showGoldenRatio: snap.showGoldenRatio,
      meditationMode: snap.meditationMode,
      cameraDistance: snap.cameraDistance,
      autoRotateSpeed: snap.autoRotateSpeed,
      globalRotationMultiplier: snap.globalRotationMultiplier,
      themeKey: snap.themeKey ?? 'neon',
      showParticles: snap.showParticles ?? true,
      selectedId: shapes[0]?.id ?? null,
    });
  },
}));

function buildPreset(key: PresetKey): ShapeInstance[] {
  switch (key) {
    case 'merkaba-flower': {
      return defaultShapes();
    }
    case 'metatron-stack': {
      const m = makeShape('metatronsCube', 0);
      m.color = '#a78bfa';
      m.scale = 1.5;
      m.rotationSpeed = [0, 0.25, 0];
      const f = makeShape('flowerOfLife', 1);
      f.color = '#06b6d4';
      f.scale = 1.6;
      f.rotation = [Math.PI / 2, 0, 0];
      f.opacity = 0.6;
      f.rotationSpeed = [0, 0, 0.1];
      const t = makeShape('treeOfLife', 2);
      t.color = '#ec4899';
      t.position = [0, 0, -1.2];
      t.scale = 1;
      t.opacity = 0.8;
      return [f, m, t];
    }
    case 'platonic-spin': {
      const types: ShapeType[] = [
        'tetrahedron',
        'cube',
        'octahedron',
        'dodecahedron',
        'icosahedron',
      ];
      return types.map((type, i) => {
        const s = makeShape(type, i);
        const angle = (i / types.length) * Math.PI * 2;
        s.position = [Math.cos(angle) * 1.7, 0, Math.sin(angle) * 1.7];
        s.scale = 0.55;
        s.rotationSpeed = [0.4, 0.3, 0.2];
        s.emissive = 1.8;
        return s;
      });
    }
    case 'sri-portal': {
      const sri = makeShape('sriYantra', 0);
      sri.color = '#f59e0b';
      sri.scale = 1.4;
      sri.rotationSpeed = [0, 0, 0.05];
      const flower = makeShape('flowerOfLife', 1);
      flower.color = '#a78bfa';
      flower.scale = 1.3;
      flower.opacity = 0.55;
      flower.rotationSpeed = [0, 0, -0.08];
      return [flower, sri];
    }
    case 'cosmic-egg': {
      const egg = makeShape('eggOfLife', 0);
      egg.color = '#ec4899';
      egg.rotationSpeed = [0.15, 0.25, 0.05];
      egg.scale = 1.1;
      egg.opacity = 0.45;
      const sphere = makeShape('sphere', 1);
      sphere.color = '#06b6d4';
      sphere.scale = 1.6;
      sphere.opacity = 0.18;
      sphere.wireframe = true;
      sphere.detail = 1;
      sphere.rotationSpeed = [0, 0.05, 0];
      return [sphere, egg];
    }
    case 'flower-revolve': {
      // 2D Flower of Life revolved around its own axis to form a 3D sphere
      const flower = makeShape('flowerOfLife', 0);
      flower.color = '#a78bfa';
      flower.scale = 1.4;
      flower.opacity = 0.6;
      flower.rotationSpeed = [0, 0.15, 0];
      flower.detail = 2;
      flower.array = {
        ...DEFAULT_ARRAY,
        mode: 'revolve',
        count: 18,
        axis: 'y',
        sweep: Math.PI,
        faceOutward: false,
      };
      return [flower];
    }
    case 'flower-sphere': {
      // Sphere of Flowers of Life — Fibonacci sphere of mini flowers
      const flower = makeShape('flowerOfLife', 0);
      flower.color = '#a78bfa';
      flower.scale = 0.45;
      flower.opacity = 0.85;
      flower.rotationSpeed = [0, 0.25, 0];
      flower.detail = 2;
      flower.array = {
        ...DEFAULT_ARRAY,
        mode: 'spherical',
        count: 60,
        radius: 2.4,
        faceOutward: true,
      };
      return [flower];
    }
    case 'merkaba-lattice': {
      const m = makeShape('merkaba', 0);
      m.color = '#06b6d4';
      m.scale = 0.32;
      m.rotationSpeed = [0.4, 0.6, 0.2];
      m.array = {
        ...DEFAULT_ARRAY,
        mode: 'cubic',
        countX: 4,
        countY: 4,
        countZ: 4,
        spacing: 1,
        faceOutward: false,
        scaleFalloff: 0.35,
      };
      return [m];
    }
    case 'helix-of-life': {
      const seed = makeShape('seedOfLife', 0);
      seed.color = '#facc15';
      seed.scale = 0.45;
      seed.opacity = 0.9;
      seed.rotationSpeed = [0, 0.6, 0];
      seed.array = {
        ...DEFAULT_ARRAY,
        mode: 'helix',
        count: 24,
        radius: 1.4,
        height: 4.5,
        turns: 3,
        axis: 'y',
        faceOutward: true,
        twist: Math.PI / 6,
      };
      return [seed];
    }
    case 'golden-mandala': {
      const tetra = makeShape('tetrahedron', 0);
      tetra.color = '#ec4899';
      tetra.scale = 0.22;
      tetra.rotationSpeed = [0.3, 0.4, 0];
      tetra.array = {
        ...DEFAULT_ARRAY,
        mode: 'disc',
        count: 89,
        spacing: 0.18,
        axis: 'y',
        faceOutward: true,
        scaleFalloff: 0.5,
        twist: Math.PI / 7,
      };
      return [tetra];
    }
  }
}
