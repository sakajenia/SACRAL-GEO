import type { ShapeType } from './types';
import { LORE_EN } from './lore-en';
import { LORE_IT } from './lore-it';

export type Lang = 'en' | 'it';

export interface LoreSection {
  heading: string;
  body: string;
}

export interface LoreEntry {
  epigraph?: string;
  sections: LoreSection[];
}

export type LoreCatalog = Record<ShapeType, LoreEntry>;

export function getLore(type: ShapeType, lang: Lang): LoreEntry {
  const catalog = lang === 'it' ? LORE_IT : LORE_EN;
  return catalog[type] ?? LORE_EN[type];
}
