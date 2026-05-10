import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles, Stars, TransformControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';
import { Shape } from './Shape';
import { GoldenOverlay } from './GoldenOverlay';
import { THEMES } from '../lib/themes';

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

function ThemeLights() {
  const themeKey = useStore((s) => s.themeKey);
  const theme = THEMES[themeKey];
  return (
    <>
      <ambientLight intensity={theme.ambientLight} />
      {theme.pointLights.map((l, i) => (
        <pointLight key={i} color={l.color} position={l.position} intensity={l.intensity} />
      ))}
    </>
  );
}

function SceneContents() {
  const shapes = useStore((s) => s.shapes);
  const showStars = useStore((s) => s.showStars);
  const showAxes = useStore((s) => s.showAxes);
  const showGoldenRatio = useStore((s) => s.showGoldenRatio);
  const showParticles = useStore((s) => s.showParticles);
  const themeKey = useStore((s) => s.themeKey);
  const theme = THEMES[themeKey];

  return (
    <>
      <ThemeLights />

      {showStars && (
        <Stars radius={120} depth={60} count={4000} factor={3.5} saturation={0.6} fade speed={0.6} />
      )}

      {showParticles && (
        <Sparkles
          count={theme.particleCount}
          scale={[10, 10, 10]}
          size={3}
          speed={0.45}
          opacity={0.7}
          color={theme.particleColor}
          noise={1.5}
        />
      )}

      {showAxes && <AxesHelper />}
      {showGoldenRatio && <GoldenOverlay />}

      {shapes.map((shape) => (
        <Shape key={shape.id} shape={shape} />
      ))}

      <GizmoController />
    </>
  );
}

function GizmoController() {
  const transformMode = useStore((s) => s.transformMode);
  const selectedId = useStore((s) => s.selectedId);
  const updateShape = useStore((s) => s.updateShape);
  const { scene } = useThree();
  const targetRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<unknown>(null);

  useEffect(() => {
    if (!selectedId || transformMode === 'off') {
      targetRef.current = null;
      return;
    }
    // The Shape component tags its outer group with userData.shapeId
    let found: THREE.Object3D | null = null;
    scene.traverse((obj) => {
      if (obj.userData?.shapeId === selectedId && !found) {
        found = obj;
      }
    });
    targetRef.current = found;
  }, [selectedId, transformMode, scene]);

  if (!targetRef.current || transformMode === 'off') return null;

  const onChange = () => {
    const obj = targetRef.current;
    if (!obj || !selectedId) return;
    if (transformMode === 'translate') {
      updateShape(selectedId, {
        position: [obj.position.x, obj.position.y, obj.position.z],
      });
    } else if (transformMode === 'rotate') {
      updateShape(selectedId, {
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
      });
    } else if (transformMode === 'scale') {
      const s = (obj.scale.x + obj.scale.y + obj.scale.z) / 3;
      updateShape(selectedId, { scale: s });
    }
  };

  return (
    <TransformControls
      ref={controlsRef as never}
      object={targetRef.current}
      mode={transformMode}
      onObjectChange={onChange}
      size={0.7}
    />
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
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const w = window as unknown as {
      __sacralRenderer?: THREE.WebGLRenderer;
      __sacralScene?: THREE.Scene;
      __sacralCamera?: THREE.Camera;
    };
    w.__sacralRenderer = gl;
    w.__sacralScene = scene;
    w.__sacralCamera = camera;
  }, [gl, scene, camera]);
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
  const themeKey = useStore((s) => s.themeKey);
  const theme = THEMES[themeKey];

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
      <fog attach="fog" args={[background, theme.fogNear, theme.fogFar]} />

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
