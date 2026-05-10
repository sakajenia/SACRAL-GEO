export type ThemeKey = 'neon' | 'crystal' | 'sunset' | 'mono';

export interface Theme {
  key: ThemeKey;
  label: string;
  background: string;
  fogNear: number;
  fogFar: number;
  bloomIntensity: number;
  bloomRadius: number;
  ambientLight: number;
  pointLights: { color: string; position: [number, number, number]; intensity: number }[];
  palette: string[];
  particleColor: string;
  particleCount: number;
}

export const THEMES: Record<ThemeKey, Theme> = {
  neon: {
    key: 'neon',
    label: 'Mystical neon',
    background: '#05030c',
    fogNear: 9.5,
    fogFar: 25.5,
    bloomIntensity: 1.4,
    bloomRadius: 0.7,
    ambientLight: 0.25,
    pointLights: [
      { color: '#a78bfa', position: [6, 6, 6], intensity: 0.6 },
      { color: '#06b6d4', position: [-6, -4, -6], intensity: 0.45 },
      { color: '#ec4899', position: [0, 6, -4], intensity: 0.35 },
    ],
    palette: ['#a78bfa', '#06b6d4', '#ec4899', '#f59e0b', '#22d3ee', '#84cc16', '#f43f5e', '#eab308'],
    particleColor: '#a78bfa',
    particleCount: 220,
  },
  crystal: {
    key: 'crystal',
    label: 'Crystal field',
    background: '#020714',
    fogNear: 10,
    fogFar: 28,
    bloomIntensity: 1.7,
    bloomRadius: 0.85,
    ambientLight: 0.22,
    pointLights: [
      { color: '#67e8f9', position: [5, 6, 6], intensity: 0.7 },
      { color: '#22d3ee', position: [-6, -4, -6], intensity: 0.55 },
      { color: '#a5f3fc', position: [0, 6, -4], intensity: 0.4 },
    ],
    palette: ['#67e8f9', '#22d3ee', '#06b6d4', '#0ea5e9', '#3b82f6', '#818cf8', '#a78bfa', '#e0f2fe'],
    particleColor: '#67e8f9',
    particleCount: 260,
  },
  sunset: {
    key: 'sunset',
    label: 'Solar temple',
    background: '#0d0408',
    fogNear: 9,
    fogFar: 24,
    bloomIntensity: 1.55,
    bloomRadius: 0.75,
    ambientLight: 0.3,
    pointLights: [
      { color: '#fbbf24', position: [6, 6, 6], intensity: 0.7 },
      { color: '#f97316', position: [-6, -4, -6], intensity: 0.5 },
      { color: '#ec4899', position: [0, 6, -4], intensity: 0.4 },
    ],
    palette: ['#fde68a', '#fbbf24', '#f59e0b', '#f97316', '#ef4444', '#ec4899', '#fb7185', '#fcd34d'],
    particleColor: '#fcd34d',
    particleCount: 200,
  },
  mono: {
    key: 'mono',
    label: 'Pure light',
    background: '#0a0a0a',
    fogNear: 11,
    fogFar: 28,
    bloomIntensity: 1.9,
    bloomRadius: 0.9,
    ambientLight: 0.18,
    pointLights: [
      { color: '#ffffff', position: [6, 6, 6], intensity: 0.55 },
      { color: '#e5e7eb', position: [-6, -4, -6], intensity: 0.5 },
      { color: '#f3f4f6', position: [0, 6, -4], intensity: 0.4 },
    ],
    palette: ['#ffffff', '#f3f4f6', '#e5e7eb', '#d4d4d8', '#c7d2fe', '#f5f5f4', '#fefce8', '#fafaf9'],
    particleColor: '#ffffff',
    particleCount: 180,
  },
};

export const THEME_KEYS: ThemeKey[] = ['neon', 'crystal', 'sunset', 'mono'];

export function applyThemeToShapes<T extends { color: string }>(
  shapes: T[],
  theme: Theme,
): T[] {
  return shapes.map((s, i) => ({ ...s, color: theme.palette[i % theme.palette.length] }));
}
