import { useCallback, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ShapeInstance } from '../lib/types';
import { Platonic } from './sacred/Platonic';
import {
  VesicaPiscis,
  SeedOfLife,
  EggOfLife,
  FlowerOfLife,
  FruitOfLife,
  MetatronsCube,
} from './sacred/Patterns';
import { Merkaba, SriYantra, TreeOfLife } from './sacred/Symbols';
import { Torus, TorusKnot, FibonacciSpiral, Phyllotaxis } from './sacred/Spirals';
import { useStore } from '../store';
import { computeArray, ARRAY_HARD_CAP, type ArrayItem } from '../lib/array';

interface Props {
  shape: ShapeInstance;
}

function ShapeBody({ shape }: Props) {
  switch (shape.type) {
    case 'tetrahedron':
    case 'cube':
    case 'octahedron':
    case 'dodecahedron':
    case 'icosahedron':
    case 'sphere':
      return <Platonic type={shape.type} shape={shape} />;
    case 'vesicaPiscis':
      return <VesicaPiscis shape={shape} />;
    case 'seedOfLife':
      return <SeedOfLife shape={shape} />;
    case 'eggOfLife':
      return <EggOfLife shape={shape} />;
    case 'flowerOfLife':
      return <FlowerOfLife shape={shape} />;
    case 'fruitOfLife':
      return <FruitOfLife shape={shape} />;
    case 'metatronsCube':
      return <MetatronsCube shape={shape} />;
    case 'merkaba':
      return <Merkaba shape={shape} />;
    case 'sriYantra':
      return <SriYantra shape={shape} />;
    case 'treeOfLife':
      return <TreeOfLife shape={shape} />;
    case 'torus':
      return <Torus shape={shape} />;
    case 'torusKnot':
      return <TorusKnot shape={shape} />;
    case 'fibonacci':
      return <FibonacciSpiral shape={shape} />;
    case 'phyllotaxis':
      return <Phyllotaxis shape={shape} />;
    default:
      return null;
  }
}

interface CopyProps {
  shape: ShapeInstance;
  item: ArrayItem;
  spinRef: (g: THREE.Group | null) => void;
  pulseRef: (g: THREE.Group | null) => void;
  onSelect: () => void;
}

function ShapeCopy({ shape, item, spinRef, pulseRef, onSelect }: CopyProps) {
  return (
    <group
      position={[item.offset.x, item.offset.y, item.offset.z]}
      quaternion={[item.quaternion.x, item.quaternion.y, item.quaternion.z, item.quaternion.w]}
    >
      <group rotation={shape.rotation}>
        <group ref={spinRef}>
          <group scale={shape.scale * item.scaleMul}>
            <mesh
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <sphereGeometry args={[1.3, 8, 8]} />
              <meshBasicMaterial visible={false} transparent opacity={0} depthWrite={false} />
            </mesh>
            <group ref={pulseRef}>
              <ShapeBody shape={shape} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export function Shape({ shape }: Props) {
  const items = useMemo(() => {
    const all = computeArray(shape.array);
    return all.length > ARRAY_HARD_CAP ? all.slice(0, ARRAY_HARD_CAP) : all;
  }, [shape.array]);

  const selectedId = useStore((s) => s.selectedId);
  const selectShape = useStore((s) => s.selectShape);
  const isSelected = selectedId === shape.id;

  const onSelect = useCallback(() => selectShape(shape.id), [shape.id, selectShape]);

  const spinRefs = useRef<(THREE.Group | null)[]>([]);
  const pulseRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, delta) => {
    const mul = useStore.getState().globalRotationMultiplier;
    const dx = shape.rotationSpeed[0] * delta * mul;
    const dy = shape.rotationSpeed[1] * delta * mul;
    const dz = shape.rotationSpeed[2] * delta * mul;
    const hasAnim = shape.pulseAmplitude > 0 || shape.breathing;
    const t = hasAnim ? performance.now() / 1000 : 0;

    const N = items.length;
    for (let i = 0; i < N; i++) {
      const spin = spinRefs.current[i];
      if (spin) {
        spin.rotation.x += dx;
        spin.rotation.y += dy;
        spin.rotation.z += dz;
      }
      const pulse = pulseRefs.current[i];
      if (!pulse) continue;
      if (hasAnim) {
        const phase = t + i * 0.137;
        let mod = 0;
        if (shape.pulseAmplitude > 0) {
          mod += Math.sin(phase * shape.pulseSpeed * Math.PI * 2) * shape.pulseAmplitude;
        }
        if (shape.breathing) {
          mod += Math.sin(phase * 0.6) * 0.04;
        }
        pulse.scale.setScalar(1 + mod);
      } else if (pulse.scale.x !== 1) {
        pulse.scale.setScalar(1);
      }
    }
  });

  const selectionRadius = useMemo(() => {
    let maxR = 1.3 * shape.scale;
    for (const item of items) {
      maxR = Math.max(maxR, item.offset.length() + 1.3 * shape.scale * item.scaleMul);
    }
    return maxR;
  }, [items, shape.scale]);

  if (!shape.visible) return null;

  return (
    <group position={shape.position}>
      <group position={shape.anchor}>
        {isSelected && (
          <mesh>
            <sphereGeometry args={[selectionRadius + 0.05, 24, 24]} />
            <meshBasicMaterial
              color="#a78bfa"
              wireframe
              transparent
              opacity={0.08}
              toneMapped={false}
            />
          </mesh>
        )}
        {items.map((item, i) => (
          <ShapeCopy
            key={i}
            shape={shape}
            item={item}
            spinRef={(g) => (spinRefs.current[i] = g)}
            pulseRef={(g) => (pulseRefs.current[i] = g)}
            onSelect={onSelect}
          />
        ))}
      </group>
    </group>
  );
}
