import { useMemo } from 'react';
import * as THREE from 'three';
import type { ShapeInstance } from '../../lib/types';

const { PI, sin, cos, sqrt } = Math;

interface PatternProps {
  shape: ShapeInstance;
}

interface CirclePoint {
  position: [number, number, number];
}

function hexLatticePoints(rings: number, spacing: number): CirclePoint[] {
  const pts: CirclePoint[] = [{ position: [0, 0, 0] }];
  for (let r = 1; r <= rings; r++) {
    for (let side = 0; side < 6; side++) {
      const a0 = (side * PI) / 3;
      const a1 = ((side + 1) * PI) / 3;
      const start = [r * spacing * cos(a0), r * spacing * sin(a0)];
      const end = [r * spacing * cos(a1), r * spacing * sin(a1)];
      for (let s = 0; s < r; s++) {
        const t = s / r;
        const x = start[0] + (end[0] - start[0]) * t;
        const y = start[1] + (end[1] - start[1]) * t;
        pts.push({ position: [x, y, 0] });
      }
    }
  }
  return pts;
}

function Ring({
  position,
  radius,
  tube,
  color,
  emissive,
  opacity,
  axis = 'z',
}: {
  position: [number, number, number];
  radius: number;
  tube: number;
  color: string;
  emissive: number;
  opacity: number;
  axis?: 'x' | 'y' | 'z';
}) {
  const rotation: [number, number, number] =
    axis === 'z' ? [0, 0, 0] : axis === 'x' ? [0, PI / 2, 0] : [PI / 2, 0, 0];

  return (
    <mesh position={position} rotation={rotation}>
      <torusGeometry args={[radius, tube, 12, 96]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissive}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.3}
        metalness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

function SphereDot({
  position,
  radius,
  color,
  emissive,
  opacity,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: number;
  opacity: number;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissive}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.3}
        metalness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

export function VesicaPiscis({ shape }: PatternProps) {
  const r = 0.7;
  const tube = Math.max(0.005, shape.thickness);
  return (
    <group>
      <Ring
        position={[-r * 0.5, 0, 0]}
        radius={r}
        tube={tube}
        color={shape.color}
        emissive={shape.emissive}
        opacity={shape.opacity}
      />
      <Ring
        position={[r * 0.5, 0, 0]}
        radius={r}
        tube={tube}
        color={shape.color}
        emissive={shape.emissive}
        opacity={shape.opacity}
      />
    </group>
  );
}

export function SeedOfLife({ shape }: PatternProps) {
  const r = 0.45;
  const tube = Math.max(0.005, shape.thickness);
  const points: [number, number, number][] = [[0, 0, 0]];
  for (let i = 0; i < 6; i++) {
    const a = (i * PI) / 3;
    points.push([cos(a) * r, sin(a) * r, 0]);
  }
  return (
    <group>
      {points.map((p, i) => (
        <Ring
          key={i}
          position={p}
          radius={r}
          tube={tube}
          color={shape.color}
          emissive={shape.emissive}
          opacity={shape.opacity}
        />
      ))}
    </group>
  );
}

export function EggOfLife({ shape }: PatternProps) {
  const r = 0.4;
  const points: [number, number, number][] = [];
  // Hexagonal close packing — central plane (6) + 1 above + 1 below
  for (let i = 0; i < 6; i++) {
    const a = (i * PI) / 3;
    points.push([cos(a) * r, 0, sin(a) * r]);
  }
  points.push([0, r, 0]);
  points.push([0, -r, 0]);
  return (
    <group>
      {points.map((p, i) => (
        <SphereDot
          key={i}
          position={p}
          radius={r * 0.95}
          color={shape.color}
          emissive={shape.emissive}
          opacity={Math.min(0.45, shape.opacity)}
        />
      ))}
    </group>
  );
}

export function FlowerOfLife({ shape }: PatternProps) {
  const rings = Math.max(1, Math.min(4, Math.round(shape.detail) || 2));
  const r = 0.3;
  const tube = Math.max(0.005, shape.thickness);
  const points = hexLatticePoints(rings, r);
  return (
    <group>
      {points.map((p, i) => (
        <Ring
          key={i}
          position={p.position}
          radius={r}
          tube={tube}
          color={shape.color}
          emissive={shape.emissive}
          opacity={shape.opacity}
        />
      ))}
    </group>
  );
}

export function FruitOfLife({ shape }: PatternProps) {
  const r = 0.28;
  const tube = Math.max(0.005, shape.thickness);
  const points: [number, number, number][] = [[0, 0, 0]];
  // Inner hexagon (radius 2r — non overlapping)
  for (let i = 0; i < 6; i++) {
    const a = (i * PI) / 3;
    points.push([cos(a) * 2 * r, sin(a) * 2 * r, 0]);
  }
  // Outer 6 (radius 2r*sqrt(3), 30° offset)
  for (let i = 0; i < 6; i++) {
    const a = (i * PI) / 3 + PI / 6;
    points.push([cos(a) * 2 * r * sqrt(3), sin(a) * 2 * r * sqrt(3), 0]);
  }
  return (
    <group>
      {points.map((p, i) => (
        <Ring
          key={i}
          position={p}
          radius={r}
          tube={tube}
          color={shape.color}
          emissive={shape.emissive}
          opacity={shape.opacity}
        />
      ))}
    </group>
  );
}

export function MetatronsCube({ shape }: PatternProps) {
  const r = 0.18;
  const tube = Math.max(0.005, shape.thickness * 0.6);
  const sphereR = 0.07;

  const centers = useMemo<[number, number, number][]>(() => {
    const c: [number, number, number][] = [[0, 0, 0]];
    const inner = 2 * r;
    for (let i = 0; i < 6; i++) {
      const a = (i * PI) / 3;
      c.push([cos(a) * inner, sin(a) * inner, 0]);
    }
    const outer = 2 * r * sqrt(3);
    for (let i = 0; i < 6; i++) {
      const a = (i * PI) / 3 + PI / 6;
      c.push([cos(a) * outer, sin(a) * outer, 0]);
    }
    return c;
  }, []);

  // Build all C(13,2) = 78 connecting line positions
  const linePositions = useMemo(() => {
    const segs: number[] = [];
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        segs.push(...centers[i], ...centers[j]);
      }
    }
    return new Float32Array(segs);
  }, [centers]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return g;
  }, [linePositions]);

  return (
    <group>
      {/* 13 outer rings */}
      {centers.map((p, i) => (
        <Ring
          key={`r${i}`}
          position={p}
          radius={r}
          tube={tube}
          color={shape.color}
          emissive={shape.emissive}
          opacity={shape.opacity * 0.85}
        />
      ))}
      {/* connecting lines */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={shape.color}
          transparent
          opacity={shape.opacity * 0.55}
          toneMapped={false}
        />
      </lineSegments>
      {/* sphere at each node */}
      {centers.map((p, i) => (
        <SphereDot
          key={`s${i}`}
          position={p}
          radius={sphereR}
          color={shape.color}
          emissive={shape.emissive * 1.2}
          opacity={shape.opacity}
        />
      ))}
    </group>
  );
}
