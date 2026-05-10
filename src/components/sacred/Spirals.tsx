import { useMemo } from 'react';
import * as THREE from 'three';
import { Solid } from './Solid';
import type { ShapeInstance } from '../../lib/types';

const { PI, sin, cos, sqrt, pow } = Math;
const PHI = (1 + sqrt(5)) / 2;
const GOLDEN_ANGLE = PI * (3 - sqrt(5));

interface Props {
  shape: ShapeInstance;
}

export function Torus({ shape }: Props) {
  const geometry = useMemo(() => {
    const detail = Math.max(0, Math.min(4, Math.round(shape.detail)));
    return new THREE.TorusGeometry(0.8, 0.28, 16 + detail * 8, 64 + detail * 32);
  }, [shape.detail]);

  return (
    <Solid
      geometry={geometry}
      color={shape.color}
      emissive={shape.emissive}
      wireframe={shape.wireframe}
      opacity={shape.opacity}
      showVertices={shape.showVertices}
    />
  );
}

export function TorusKnot({ shape }: Props) {
  const geometry = useMemo(() => {
    const detail = Math.max(0, Math.min(4, Math.round(shape.detail)));
    const p = 2 + (detail % 3);
    const q = 3 + ((detail + 1) % 3);
    return new THREE.TorusKnotGeometry(0.7, 0.18, 128 + detail * 64, 16 + detail * 8, p, q);
  }, [shape.detail]);

  return (
    <Solid
      geometry={geometry}
      color={shape.color}
      emissive={shape.emissive}
      wireframe={shape.wireframe}
      opacity={shape.opacity}
      showVertices={shape.showVertices}
    />
  );
}

/**
 * Logarithmic golden spiral: r = a · phi^(2θ/π)
 * Rendered as a tube curving through 3D space (with optional Z lift for true 3D feel).
 */
export function FibonacciSpiral({ shape }: Props) {
  const detail = Math.max(0, Math.min(4, Math.round(shape.detail)));
  const turns = 3 + detail;
  const points = useMemo(() => {
    const segments = 220 + detail * 80;
    const pts: THREE.Vector3[] = [];
    const a = 0.04;
    for (let i = 0; i < segments; i++) {
      const t = (i / segments) * turns * PI * 2;
      const r = a * pow(PHI, (2 * t) / PI);
      const x = r * cos(t);
      const y = r * sin(t);
      const z = (i / segments - 0.5) * (r * 0.6); // gentle 3D lift
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [turns, detail]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points]);
  const tube = Math.max(0.005, shape.thickness);
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 220 + detail * 80, tube, 12, false),
    [curve, detail, tube],
  );

  return (
    <Solid
      geometry={geometry}
      color={shape.color}
      emissive={shape.emissive}
      wireframe={false}
      opacity={shape.opacity}
    />
  );
}

/**
 * Phyllotaxis (sunflower seed packing) using the golden angle.
 * Each seed is a small sphere; their distance from centre grows as sqrt(i).
 */
export function Phyllotaxis({ shape }: Props) {
  const detail = Math.max(0, Math.min(4, Math.round(shape.detail)));
  const count = 80 + detail * 80; // 80 .. 400
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    const c = 0.05;
    for (let i = 0; i < count; i++) {
      const angle = i * GOLDEN_ANGLE;
      const radius = c * sqrt(i + 1);
      pos.push([radius * cos(angle), radius * sin(angle), 0]);
    }
    return pos;
  }, [count]);

  const ringRadius = 0.025 + Math.max(0, shape.thickness) * 1.2;

  return (
    <group>
      {positions.map((p, i) => {
        const t = i / count;
        const size = ringRadius * (1 - t * 0.5);
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[Math.max(0.005, size), 12, 12]} />
            <meshStandardMaterial
              color={shape.color}
              emissive={shape.color}
              emissiveIntensity={shape.emissive * (0.8 + 0.6 * (1 - t))}
              transparent={shape.opacity < 1}
              opacity={shape.opacity}
              roughness={0.3}
              metalness={0.2}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

