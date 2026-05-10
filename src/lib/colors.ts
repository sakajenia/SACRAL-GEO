export interface Chakra {
  name: string;
  hex: string;
  hz: number;
}

export const CHAKRAS: Chakra[] = [
  { name: 'Root',         hex: '#ef4444', hz: 396 },
  { name: 'Sacral',       hex: '#f97316', hz: 417 },
  { name: 'Solar Plexus', hex: '#facc15', hz: 528 },
  { name: 'Heart',        hex: '#22c55e', hz: 639 },
  { name: 'Throat',       hex: '#06b6d4', hz: 741 },
  { name: 'Third Eye',    hex: '#6366f1', hz: 852 },
  { name: 'Crown',        hex: '#a855f7', hz: 963 },
];

export const ACCENT_PALETTE = [
  '#a78bfa',
  '#06b6d4',
  '#ec4899',
  '#f59e0b',
  '#22d3ee',
  '#84cc16',
  '#f43f5e',
  '#eab308',
];

export function pickAccent(index: number): string {
  return ACCENT_PALETTE[index % ACCENT_PALETTE.length];
}
