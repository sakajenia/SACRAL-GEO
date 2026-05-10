import { useMemo } from 'react';
import * as THREE from 'three';
import { Solid } from './Solid';
import type { ShapeInstance } from '../../lib/types';

const { PI, sin, cos } = Math;

interface Props {
  shape: ShapeInstance;
}

export function Merkaba({ shape }: Props) {
  const up = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);
  const down = useMemo(() => new THREE.TetrahedronGeometry(1, 0), []);
  return (
    <group>
      <group>
        <Solid
          geometry={up}
          color={shape.color}
          emissive={shape.emissive}
          wireframe={shape.wireframe}
          opacity={shape.opacity * 0.85}
          showVertices={shape.showVertices}
        />
      </group>
      <group rotation={[PI, 0, 0]}>
        <Solid
          geometry={down}
          color={shape.color}
          emissive={shape.emissive}
          wireframe={shape.wireframe}
          opacity={shape.opacity * 0.85}
          showVertices={shape.showVertices}
        />
      </group>
    </group>
  );
}

/**
 * Sri Yantra — 9 interlocking triangles (4 upward + 5 downward) within a bindu point.
 * The classic proportions are complex; we use a stylised, mathematically symmetric variant
 * with concentric triangle pairs scaled for visual harmony.
 */
export function SriYantra({ shape }: Props) {
  const lineGeom = useMemo(() => {
    const positions: number[] = [];
    // Build pairs of triangles at decreasing scales
    const triangles: { scale: number; flip: boolean; offsetY: number }[] = [
      { scale: 1.00, flip: false, offsetY:  0.04 },
      { scale: 0.92, flip: true,  offsetY: -0.04 },
      { scale: 0.78, flip: false, offsetY:  0.08 },
      { scale: 0.70, flip: true,  offsetY: -0.08 },
      { scale: 0.56, flip: false, offsetY:  0.06 },
      { scale: 0.48, flip: true,  offsetY: -0.06 },
      { scale: 0.36, flip: false, offsetY:  0.04 },
      { scale: 0.30, flip: true,  offsetY: -0.04 },
      { scale: 0.18, flip: false, offsetY:  0.00 },
    ];

    for (const t of triangles) {
      const v: [number, number][] = t.flip
        ? [
            [0, -t.scale],
            [-t.scale * 0.866, t.scale * 0.5],
            [t.scale * 0.866, t.scale * 0.5],
          ]
        : [
            [0, t.scale],
            [-t.scale * 0.866, -t.scale * 0.5],
            [t.scale * 0.866, -t.scale * 0.5],
          ];
      const verts = v.map(([x, y]) => [x, y + t.offsetY] as [number, number]);
      for (let i = 0; i < 3; i++) {
        const a = verts[i];
        const b = verts[(i + 1) % 3];
        positions.push(a[0], a[1], 0, b[0], b[1], 0);
      }
    }

    // outer ring
    const ringSegments = 96;
    const Ro = 1.18;
    for (let i = 0; i < ringSegments; i++) {
      const t0 = (i / ringSegments) * PI * 2;
      const t1 = ((i + 1) / ringSegments) * PI * 2;
      positions.push(cos(t0) * Ro, sin(t0) * Ro, 0, cos(t1) * Ro, sin(t1) * Ro, 0);
    }
    // 8 lotus petals — small circles around the outer ring
    const petals = 8;
    for (let p = 0; p < petals; p++) {
      const a = (p / petals) * PI * 2;
      const cx = cos(a) * 1.05;
      const cy = sin(a) * 1.05;
      const pr = 0.13;
      const seg = 24;
      for (let i = 0; i < seg; i++) {
        const t0 = (i / seg) * PI * 2;
        const t1 = ((i + 1) / seg) * PI * 2;
        positions.push(
          cx + cos(t0) * pr,
          cy + sin(t0) * pr,
          0,
          cx + cos(t1) * pr,
          cy + sin(t1) * pr,
          0,
        );
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <group>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={shape.color}
          transparent={shape.opacity < 1}
          opacity={shape.opacity}
          toneMapped={false}
        />
      </lineSegments>
      {/* Bindu point */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={shape.color} toneMapped={false} />
      </mesh>
    </group>
  );
}

/**
 * Tree of Life — 10 sephirot connected by 22 paths.
 */
export function TreeOfLife({ shape }: Props) {
  const sephirot = useMemo<[number, number, number][]>(() => {
    // Standard Kabbalistic positions (normalised to roughly fit in unit-ish box)
    return [
      [0,  1.4, 0], // 1 Keter
      [0.7,  1.0, 0], // 2 Chokhmah
      [-0.7, 1.0, 0], // 3 Binah
      [0.7,  0.4, 0], // 4 Chesed
      [-0.7, 0.4, 0], // 5 Geburah
      [0,    0.0, 0], // 6 Tiferet
      [0.7, -0.6, 0], // 7 Netzach
      [-0.7,-0.6, 0], // 8 Hod
      [0,   -1.0, 0], // 9 Yesod
      [0,   -1.6, 0], // 10 Malkhut
    ];
  }, []);

  // 22 paths (1-indexed pairs from Kabbalah)
  const paths: [number, number][] = useMemo(
    () => [
      [1, 2], [1, 3], [1, 6],
      [2, 3], [2, 4], [2, 6],
      [3, 5], [3, 6],
      [4, 5], [4, 6], [4, 7],
      [5, 6], [5, 8],
      [6, 7], [6, 8], [6, 9],
      [7, 8], [7, 9], [7, 10],
      [8, 9], [8, 10],
      [9, 10],
    ],
    [],
  );

  const lineGeom = useMemo(() => {
    const positions: number[] = [];
    for (const [a, b] of paths) {
      const p1 = sephirot[a - 1];
      const p2 = sephirot[b - 1];
      positions.push(...p1, ...p2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [sephirot, paths]);

  return (
    <group>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={shape.color}
          transparent={shape.opacity < 1}
          opacity={shape.opacity * 0.7}
          toneMapped={false}
        />
      </lineSegments>
      {sephirot.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={shape.emissive * 1.4}
            roughness={0.3}
            metalness={0.3}
            transparent={shape.opacity < 1}
            opacity={shape.opacity}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

