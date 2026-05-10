import { useMemo } from 'react';
import * as THREE from 'three';

const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Construction-line overlay: golden spiral, vesica piscis, golden rectangle nesting.
 * Renders semi-transparent so the user can use it as a guide.
 */
export function GoldenOverlay() {
  const lineGeom = useMemo(() => {
    const pts: number[] = [];

    // Golden spiral via quarter-circle approximations on Fibonacci rectangles
    let x = 0;
    let y = 0;
    let size = 1;
    let dir = 0;
    const rectangles = 7;
    const pushArc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
      const seg = 32;
      for (let i = 0; i < seg; i++) {
        const t0 = a0 + (a1 - a0) * (i / seg);
        const t1 = a0 + (a1 - a0) * ((i + 1) / seg);
        pts.push(cx + Math.cos(t0) * r, cy + Math.sin(t0) * r, 0);
        pts.push(cx + Math.cos(t1) * r, cy + Math.sin(t1) * r, 0);
      }
    };
    for (let i = 0; i < rectangles; i++) {
      const a0 = (dir * Math.PI) / 2;
      const a1 = a0 + Math.PI / 2;
      pushArc(x, y, size, a0, a1);
      // advance: rotate direction CCW, place next rect offset
      const nextSize = size * PHI;
      const off = nextSize - size;
      switch (dir) {
        case 0: x -= off; break;
        case 1: y -= off; break;
        case 2: x += off; break;
        case 3: y += off; break;
      }
      size = nextSize;
      dir = (dir + 1) % 4;
    }

    // Vesica piscis (two intersecting circles, axis along X)
    const vpR = 1.4;
    const vpSeg = 96;
    for (const cx of [-vpR / 2, vpR / 2]) {
      for (let i = 0; i < vpSeg; i++) {
        const t0 = (i / vpSeg) * Math.PI * 2;
        const t1 = ((i + 1) / vpSeg) * Math.PI * 2;
        pts.push(
          cx + Math.cos(t0) * vpR,
          Math.sin(t0) * vpR,
          0,
          cx + Math.cos(t1) * vpR,
          Math.sin(t1) * vpR,
          0,
        );
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  return (
    <group scale={0.6}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#facc15" transparent opacity={0.18} toneMapped={false} />
      </lineSegments>
    </group>
  );
}
