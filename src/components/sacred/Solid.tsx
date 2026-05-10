import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MaterialMode } from '../../lib/types';

export interface SolidProps {
  geometry: THREE.BufferGeometry;
  color: string;
  emissive: number;
  wireframe: boolean;
  materialMode?: MaterialMode;
  opacity: number;
  showVertices?: boolean;
  vertexSize?: number;
}

const HOLO_VERTEX = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vV = -mvPos.xyz;
  gl_Position = projectionMatrix * mvPos;
}
`;

const HOLO_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying vec3 vN;
varying vec3 vV;
void main() {
  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 1.5);
  float band = sin(dot(n, vec3(1.0)) * 6.0 + uTime * 1.7);
  band = 0.5 + 0.5 * band;
  vec3 col = mix(uColorA, uColorB, band);
  col += fres * 0.6;
  gl_FragColor = vec4(col, uOpacity);
}
`;

function HoloMesh({
  geometry,
  color,
  opacity,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  opacity: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => {
    const c = new THREE.Color(color);
    const c2 = c.clone().offsetHSL(0.18, 0, 0);
    return {
      uTime: { value: 0 },
      uColorA: { value: c },
      uColorB: { value: c2 },
      uOpacity: { value: opacity },
    };
  }, [color, opacity]);

  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={HOLO_VERTEX}
        fragmentShader={HOLO_FRAGMENT}
        transparent={opacity < 1}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export function Solid({
  geometry,
  color,
  emissive,
  wireframe,
  materialMode,
  opacity,
  showVertices = false,
  vertexSize = 0.04,
}: SolidProps) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);
  const transparent = opacity < 1;
  const mode: MaterialMode = materialMode ?? (wireframe ? 'wireframe' : 'solid');

  const positions = useMemo(() => {
    if (!showVertices) return null;
    const pos = geometry.getAttribute('position');
    if (!pos) return null;
    const seen = new Set<string>();
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      if (!seen.has(key)) {
        seen.add(key);
        pts.push(new THREE.Vector3(x, y, z));
      }
    }
    return pts;
  }, [geometry, showVertices]);

  let body: React.ReactNode;
  if (mode === 'wireframe') {
    body = (
      <lineSegments geometry={edges}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          toneMapped={false}
        />
      </lineSegments>
    );
  } else if (mode === 'glass') {
    body = (
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive * 0.4}
          transmission={0.9}
          thickness={0.6}
          ior={1.45}
          roughness={0.05}
          metalness={0}
          attenuationColor={color}
          attenuationDistance={2.5}
          transparent
          opacity={Math.max(opacity, 0.7)}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  } else if (mode === 'holographic') {
    body = <HoloMesh geometry={geometry} color={color} opacity={opacity} />;
  } else {
    body = (
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissive}
          roughness={0.35}
          metalness={0.1}
          transparent={transparent}
          opacity={opacity}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }

  return (
    <group>
      {body}
      {positions && (
        <group>
          {positions.map((p, i) => (
            <mesh key={i} position={p}>
              <sphereGeometry args={[vertexSize, 12, 12]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
