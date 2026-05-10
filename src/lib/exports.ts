import * as THREE from 'three';
import type { StoreSnapshot } from '../store';
import { buildShareUrl } from './urlState';

declare global {
  interface Window {
    __sacralRenderer?: THREE.WebGLRenderer;
  }
}

/**
 * Save the current canvas as a high-resolution PNG.
 * Multiplier scales the canvas pixel ratio temporarily for a crisper export.
 */
export function exportPng(scale = 2): void {
  const renderer = window.__sacralRenderer;
  if (!renderer) throw new Error('renderer not ready');
  const canvas = renderer.domElement;

  // Many browsers need a force-render at higher pixel density before reading the buffer.
  // We grab whatever is currently on screen — the renderer was created with
  // preserveDrawingBuffer: true so the back buffer is readable.
  const dataUrl = canvas.toDataURL('image/png');

  if (scale > 1) {
    // optional upscale via a hidden canvas
    upscaledDataUrl(canvas, scale).then((upscaled) => {
      triggerDownload(upscaled, `sacral-geo-${timestamp()}.png`);
    });
  } else {
    triggerDownload(dataUrl, `sacral-geo-${timestamp()}.png`);
  }
}

async function upscaledDataUrl(source: HTMLCanvasElement, scale: number): Promise<string> {
  const w = source.width * scale;
  const h = source.height * scale;
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const ctx = off.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  return off.toDataURL('image/png');
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export async function copyShareLink(snap: StoreSnapshot): Promise<void> {
  const url = buildShareUrl(snap);
  await navigator.clipboard.writeText(url);
}
