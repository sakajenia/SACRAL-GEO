import { useMemo, useRef } from 'react';
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
  phaseSeed: number;
}

function ShapeCopy({ shape, item, phaseSeed }: CopyProps) {
  const spinRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const spin = spinRef.current;
    const pulse = pulseRef.current;
    if (!spin || !pulse) return;

    const mul = useStore.getState().globalRotationMultiplier;

    spin.rotation.x += shape.rotationSpeed[0] * delta * mul;
    spin.rotation.y += shape.rotationSpeed[1] * delta * mul;
    spin.rotation.z += shape.rotationSpeed[2] * delta * mul;

    if (shape.pulseAmplitude > 0 || shape.breathing) {
      const t = performance.now() / 1000 + phaseSeed;
      let mod = 0;
      if (shape.pulseAmplitude > 0) {
        mod += Math.sin(t * shape.pulseSpeed * Math.PI * 2) * shape.pulseAmplitude;
      }
      if (shape.breathing) {
        mod += Math.sin(t * 0.6) * 0.04;
      }
      pulse.scale.setScalar(1 + mod);
    } else if (pulse.scale.x !== 1) {
      pulse.scale.setScalar(1);
    }
  });

  return (
    <group
      position={[item.offset.x, item.offset.y, item.offset.z]}
      quaternion={[
        item.quaternion.x,
        item.quaternion.y,
        item.quaternion.z,
        item.quaternion.w,
      ]}
    >
      <group rotation={shape.rotation}>
        <group ref={spinRef}>
          <group scale={shape.scale * item.scaleMul}>
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

  if (!shape.visible) return null;

  // The shape's own world position is shape.position; the array anchor adds an
  // additional offset within that local frame.
  return (
    <group position={shape.position}>
      <group position={shape.anchor}>
        {items.map((item, i) => (
          <ShapeCopy key={i} shape={shape} item={item} phaseSeed={i * 0.137} />
        ))}
      </group>
    </group>
  );
}
