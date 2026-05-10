import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';
import { Shape } from './Shape';
import { GoldenOverlay } from './GoldenOverlay';

interface OrbitHandle {
  reset: () => void;
  update: () => void;
}

function CameraRig({ controls }: { controls: React.RefObject<OrbitHandle> }) {
  const { camera } = useThree();
  const meditation = useStore((s) => s.meditationMode);
  const auto = useStore((s) => s.autoRotateSpeed);
  const distance = useStore((s) => s.cameraDistance);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (meditation) {
      t.current += delta * auto;
      const r = distance;
      camera.position.x = Math.cos(t.current) * r;
      camera.position.z = Math.sin(t.current) * r;
      camera.position.y = Math.sin(t.current * 0.3) * (r * 0.25);
      camera.lookAt(0, 0, 0);
      controls.current?.update?.();
    }
  });

  return null;
}

function SceneContents() {
  const shapes = useStore((s) => s.shapes);
  const showStars = useStore((s) => s.showStars);
  const showAxes = useStore((s) => s.showAxes);
  const showGoldenRatio = useStore((s) => s.showGoldenRatio);

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[6, 6, 6]} intensity={0.6} color="#a78bfa" />
      <pointLight position={[-6, -4, -6]} intensity={0.45} color="#06b6d4" />
      <pointLight position={[0, 6, -4]} intensity={0.35} color="#ec4899" />

      {showStars && (
        <Stars radius={120} depth={60} count={4000} factor={3.5} saturation={0.6} fade speed={0.6} />
      )}

      {showAxes && <AxesHelper />}
      {showGoldenRatio && <GoldenOverlay />}

      {shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} />
      ))}
    </>
  );
}

function AxesHelper() {
  const geometry = useMemo(() => {
    const positions = new Float32Array([
      -10, 0, 0,  10, 0, 0,
      0, -10, 0,  0, 10, 0,
      0, 0, -10,  0, 0, 10,
    ]);
    const colors = new Float32Array([
      1.0, 0.3, 0.5,  1.0, 0.3, 0.5,
      0.3, 1.0, 0.6,  0.3, 1.0, 0.6,
      0.4, 0.7, 1.0,  0.4, 0.7, 1.0,
    ]);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial vertexColors transparent opacity={0.4} toneMapped={false} />
    </lineSegments>
  );
}

function CanvasReadyPing() {
  const { gl } = useThree();
  useEffect(() => {
    // expose renderer to window so the export button can call its toDataURL
    (window as unknown as { __sacralRenderer?: THREE.WebGLRenderer }).__sacralRenderer = gl;
  }, [gl]);
  return null;
}

function PostFx() {
  const bloomIntensity = useStore((s) => s.bloomIntensity);
  const bloomRadius = useStore((s) => s.bloomRadius);

  return (
    <EffectComposer multisampling={2}>
      <Bloom
        intensity={bloomIntensity}
        radius={bloomRadius}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.18} darkness={0.55} />
    </EffectComposer>
  );
}

export function Scene() {
  const controlsRef = useRef<OrbitHandle>(null);
  const background = useStore((s) => s.background);
  const distance = useStore((s) => s.cameraDistance);
  const meditation = useStore((s) => s.meditationMode);

  return (
    <Canvas
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
        alpha: false,
      }}
      camera={{ position: [0, 1.5, distance], fov: 50, near: 0.1, far: 200 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, distance + 4, distance + 20]} />

      <CanvasReadyPing />
      <SceneContents />

      <OrbitControls
        ref={controlsRef as never}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        panSpeed={0.6}
        enabled={!meditation}
        makeDefault
      />
      <CameraRig controls={controlsRef as React.RefObject<OrbitHandle>} />

      <PostFx />
    </Canvas>
  );
}
