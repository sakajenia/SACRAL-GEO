import * as THREE from 'three';
import type { ArrayConfig, AxisKey } from './types';

const { PI, sqrt, cos, sin, max } = Math;
const GOLDEN_ANGLE = PI * (3 - sqrt(5));

export interface ArrayItem {
  /** World-space offset from anchor */
  offset: THREE.Vector3;
  /** Rotation that aligns the shape's local +Y with its outward direction (or identity) */
  quaternion: THREE.Quaternion;
  /** Per-copy scale multiplier (1 = same as original, <1 = shrunk) */
  scaleMul: number;
}

const FORWARD = new THREE.Vector3(0, 1, 0);
const tmpDir = new THREE.Vector3();

function axisVec(axis: AxisKey): THREE.Vector3 {
  if (axis === 'x') return new THREE.Vector3(1, 0, 0);
  if (axis === 'y') return new THREE.Vector3(0, 1, 0);
  return new THREE.Vector3(0, 0, 1);
}

function falloffFactor(t: number, falloff: number): number {
  // t in 0..1 (0 = nearest to anchor, 1 = farthest)
  // falloff > 0: shrink outward; < 0: grow outward
  if (falloff === 0) return 1;
  const k = THREE.MathUtils.clamp(falloff, -1, 1);
  return max(0.05, 1 - k * t);
}

function makeOutwardQuat(offset: THREE.Vector3, faceOutward: boolean): THREE.Quaternion {
  const q = new THREE.Quaternion();
  if (!faceOutward || offset.lengthSq() < 1e-8) return q;
  tmpDir.copy(offset).normalize();
  q.setFromUnitVectors(FORWARD, tmpDir);
  return q;
}

function applyTwist(q: THREE.Quaternion, twist: number, axisLocal: THREE.Vector3): THREE.Quaternion {
  if (twist === 0) return q;
  const tw = new THREE.Quaternion().setFromAxisAngle(axisLocal, twist);
  return q.clone().multiply(tw);
}

export function computeArray(cfg: ArrayConfig): ArrayItem[] {
  const items: ArrayItem[] = [];
  const safeCount = Math.max(1, Math.floor(cfg.count));

  switch (cfg.mode) {
    case 'none': {
      items.push({
        offset: new THREE.Vector3(0, 0, 0),
        quaternion: new THREE.Quaternion(),
        scaleMul: 1,
      });
      break;
    }

    case 'linear': {
      const dir = axisVec(cfg.axis);
      const center = (safeCount - 1) / 2;
      for (let i = 0; i < safeCount; i++) {
        const offset = dir.clone().multiplyScalar((i - center) * cfg.spacing);
        const t = safeCount > 1 ? Math.abs(i - center) / Math.max(1, center) : 0;
        const q = makeOutwardQuat(offset, cfg.faceOutward);
        items.push({
          offset,
          quaternion: applyTwist(q, cfg.twist * (i - center), FORWARD),
          scaleMul: falloffFactor(t, cfg.scaleFalloff),
        });
      }
      break;
    }

    case 'polar': {
      const ax = cfg.axis;
      for (let i = 0; i < safeCount; i++) {
        const a = (i / safeCount) * PI * 2;
        const x = cos(a) * cfg.radius;
        const z = sin(a) * cfg.radius;
        let offset: THREE.Vector3;
        if (ax === 'y') offset = new THREE.Vector3(x, 0, z);
        else if (ax === 'x') offset = new THREE.Vector3(0, x, z);
        else offset = new THREE.Vector3(x, z, 0);
        const q = makeOutwardQuat(offset, cfg.faceOutward);
        items.push({
          offset,
          quaternion: applyTwist(q, cfg.twist * i, FORWARD),
          scaleMul: 1,
        });
      }
      break;
    }

    case 'spherical': {
      // Fibonacci sphere
      for (let i = 0; i < safeCount; i++) {
        const denom = Math.max(1, safeCount - 1);
        const yN = 1 - (2 * i) / denom; // 1 .. -1
        const r = sqrt(Math.max(0, 1 - yN * yN));
        const theta = i * GOLDEN_ANGLE;
        const offset = new THREE.Vector3(
          cos(theta) * r * cfg.radius,
          yN * cfg.radius,
          sin(theta) * r * cfg.radius,
        );
        const q = makeOutwardQuat(offset, cfg.faceOutward);
        items.push({
          offset,
          quaternion: applyTwist(q, cfg.twist * i, FORWARD),
          scaleMul: 1,
        });
      }
      break;
    }

    case 'cubic': {
      const cx = Math.max(1, Math.floor(cfg.countX));
      const cy = Math.max(1, Math.floor(cfg.countY));
      const cz = Math.max(1, Math.floor(cfg.countZ));
      const sx = (cx - 1) / 2;
      const sy = (cy - 1) / 2;
      const sz = (cz - 1) / 2;
      const maxDist = Math.max(1, sqrt(sx * sx + sy * sy + sz * sz));
      for (let i = 0; i < cx; i++) {
        for (let j = 0; j < cy; j++) {
          for (let k = 0; k < cz; k++) {
            const offset = new THREE.Vector3(
              (i - sx) * cfg.spacing,
              (j - sy) * cfg.spacing,
              (k - sz) * cfg.spacing,
            );
            const t = sqrt((i - sx) ** 2 + (j - sy) ** 2 + (k - sz) ** 2) / maxDist;
            const q = makeOutwardQuat(offset, cfg.faceOutward);
            items.push({
              offset,
              quaternion: applyTwist(q, cfg.twist, FORWARD),
              scaleMul: falloffFactor(t, cfg.scaleFalloff),
            });
          }
        }
      }
      break;
    }

    case 'helix': {
      const ax = cfg.axis;
      const center = (safeCount - 1) / 2;
      for (let i = 0; i < safeCount; i++) {
        const tNorm = safeCount > 1 ? i / (safeCount - 1) : 0.5;
        const along = (tNorm - 0.5) * cfg.height;
        const a = tNorm * PI * 2 * cfg.turns;
        const cx = cos(a) * cfg.radius;
        const sx = sin(a) * cfg.radius;
        let offset: THREE.Vector3;
        if (ax === 'y') offset = new THREE.Vector3(cx, along, sx);
        else if (ax === 'x') offset = new THREE.Vector3(along, cx, sx);
        else offset = new THREE.Vector3(cx, sx, along);
        const q = makeOutwardQuat(offset, cfg.faceOutward);
        const t = Math.abs(i - center) / Math.max(1, center);
        items.push({
          offset,
          quaternion: applyTwist(q, cfg.twist * i, FORWARD),
          scaleMul: falloffFactor(t, cfg.scaleFalloff),
        });
      }
      break;
    }

    case 'disc': {
      // Phyllotaxis on a flat disc, normal aligned with chosen axis
      const ax = cfg.axis;
      for (let i = 0; i < safeCount; i++) {
        const r = sqrt(i + 1) * cfg.spacing;
        const a = i * GOLDEN_ANGLE;
        const x = cos(a) * r;
        const y = sin(a) * r;
        let offset: THREE.Vector3;
        if (ax === 'y') offset = new THREE.Vector3(x, 0, y);
        else if (ax === 'x') offset = new THREE.Vector3(0, x, y);
        else offset = new THREE.Vector3(x, y, 0);
        const q = makeOutwardQuat(offset, cfg.faceOutward);
        const denom = Math.max(1, safeCount - 1);
        items.push({
          offset,
          quaternion: applyTwist(q, cfg.twist * i, FORWARD),
          scaleMul: falloffFactor(i / denom, cfg.scaleFalloff),
        });
      }
      break;
    }

    case 'revolve': {
      // Lathe / revolve: N copies at the SAME position, each rotated around the
      // chosen axis. A flat 2D form (e.g. Flower of Life) swept around its own
      // centre fills out a 3D sphere-like envelope of intersecting copies.
      const ax = axisVec(cfg.axis);
      const sweep = cfg.sweep;
      // If sweep is a full 2π and count > 1, last copy would overlap the first;
      // step by sweep/count so they're evenly spread. For partial sweeps step by
      // sweep/(count-1) so the endpoints are inclusive.
      const isFull = Math.abs(Math.abs(sweep) - Math.PI * 2) < 1e-3;
      const denom = isFull ? safeCount : Math.max(1, safeCount - 1);
      for (let i = 0; i < safeCount; i++) {
        const angle = (i * sweep) / denom;
        const q = new THREE.Quaternion().setFromAxisAngle(ax, angle);
        items.push({
          offset: new THREE.Vector3(0, 0, 0),
          quaternion: applyTwist(q, cfg.twist * i, FORWARD),
          scaleMul: 1,
        });
      }
      break;
    }
  }

  return items;
}

/** Soft cap so the user can't accidentally lock the browser. */
export const ARRAY_HARD_CAP = 400;
