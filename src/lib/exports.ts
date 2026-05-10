import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { StoreSnapshot } from '../store';
import { buildShareUrl } from './urlState';

declare global {
  interface Window {
    __sacralRenderer?: THREE.WebGLRenderer;
    __sacralScene?: THREE.Scene;
    __sacralCamera?: THREE.Camera;
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

export function exportGLB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const scene = window.__sacralScene;
    if (!scene) return reject(new Error('scene not ready'));

    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (result) => {
        const data = result as ArrayBuffer;
        const blob = new Blob([data], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `sacral-geo-${timestamp()}.glb`);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        resolve();
      },
      (err) => reject(new Error(String(err))),
      { binary: true, onlyVisible: true, embedImages: true },
    );
  });
}

export function setCameraPreset(angle: 'front' | 'side' | 'top' | 'iso'): void {
  const camera = window.__sacralCamera;
  if (!camera) return;
  const distance = 5.5;
  switch (angle) {
    case 'front':
      camera.position.set(0, 0, distance);
      break;
    case 'side':
      camera.position.set(distance, 0, 0);
      break;
    case 'top':
      camera.position.set(0, distance, 0.0001);
      break;
    case 'iso':
      camera.position.set(distance * 0.7, distance * 0.6, distance * 0.7);
      break;
  }
  camera.lookAt(0, 0, 0);
}
