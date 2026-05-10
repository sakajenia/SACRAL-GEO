import { useMemo } from 'react';
import * as THREE from 'three';
import { Solid } from './Solid';
import type { ShapeInstance, ShapeType } from '../../lib/types';

interface Props {
  type: ShapeType;
  shape: ShapeInstance;
}

export function Platonic({ type, shape }: Props) {
  const geometry = useMemo(() => {
    const detail = Math.max(0, Math.min(4, Math.round(shape.detail)));
    switch (type) {
      case 'tetrahedron':
        return new THREE.TetrahedronGeometry(1, detail);
      case 'cube':
        return detail > 0
          ? new THREE.BoxGeometry(1.6, 1.6, 1.6, detail + 1, detail + 1, detail + 1)
          : new THREE.BoxGeometry(1.6, 1.6, 1.6);
      case 'octahedron':
        return new THREE.OctahedronGeometry(1, detail);
      case 'dodecahedron':
        return new THREE.DodecahedronGeometry(1, detail);
      case 'icosahedron':
        return new THREE.IcosahedronGeometry(1, detail);
      case 'sphere':
        return new THREE.SphereGeometry(1, 16 + detail * 12, 12 + detail * 8);
      default:
        return new THREE.IcosahedronGeometry(1, detail);
    }
  }, [type, shape.detail]);

  return (
    <Solid
      geometry={geometry}
      color={shape.color}
      emissive={shape.emissive}
      wireframe={shape.wireframe}
      materialMode={shape.materialMode}
      opacity={shape.opacity}
      showVertices={shape.showVertices}
    />
  );
}
