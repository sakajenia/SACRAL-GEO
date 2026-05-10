import { useMemo } from 'react';
import * as THREE from 'three';

export interface SolidProps {
  geometry: THREE.BufferGeometry;
  color: string;
  emissive: number;
  wireframe: boolean;
  opacity: number;
  showVertices?: boolean;
  vertexSize?: number;
}

/**
 * Renders any THREE.BufferGeometry either as wireframe edges or as a solid lit mesh.
 * Optionally draws small spheres at each vertex.
 */
export function Solid({
  geometry,
  color,
  emissive,
  wireframe,
  opacity,
  showVertices = false,
  vertexSize = 0.04,
}: SolidProps) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);
  const transparent = opacity < 1;

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

  return (
    <group>
      {wireframe ? (
        <lineSegments geometry={edges}>
          <lineBasicMaterial
            color={color}
            transparent={transparent || true}
            opacity={opacity}
            toneMapped={false}
          />
        </lineSegments>
      ) : (
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
      )}

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
