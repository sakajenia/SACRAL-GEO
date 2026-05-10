import { useStore } from '../../store';
import { CHAKRAS } from '../../lib/colors';
import { Slider, Toggle, ColorField, SectionTitle, SelectField, Segmented } from './Primitives';
import { ShapeIcon } from './ShapeIcons';
import { findCatalogEntry } from '../../lib/catalog';
import type { ShapeInstance, ArrayMode, AxisKey, ArrayConfig } from '../../lib/types';
import { exportPng, copyShareLink } from '../../lib/exports';
import { computeArray } from '../../lib/array';

interface ToastSetter {
  (msg: string): void;
}

function ShapeEditor({
  shape,
  onChange,
}: {
  shape: ShapeInstance;
  onChange: (partial: Partial<ShapeInstance>) => void;
}) {
  const entry = findCatalogEntry(shape.type);

  const supportsDetail =
    ['flowerOfLife', 'fibonacci', 'phyllotaxis', 'sphere', 'torus', 'torusKnot', 'tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron'].includes(shape.type);
  const supportsThickness = [
    'vesicaPiscis',
    'seedOfLife',
    'flowerOfLife',
    'fruitOfLife',
    'metatronsCube',
    'fibonacci',
    'phyllotaxis',
  ].includes(shape.type);
  const supportsWireframe = [
    'tetrahedron',
    'cube',
    'octahedron',
    'dodecahedron',
    'icosahedron',
    'sphere',
    'torus',
    'torusKnot',
    'merkaba',
  ].includes(shape.type);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 12px' }}>
        <ShapeIcon type={shape.type} size={32} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.label}</div>
          <div style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>{entry.description}</div>
        </div>
      </div>

      <div className="field">
        <label style={{ marginBottom: 4 }}>Layer name</label>
        <input
          type="text"
          value={shape.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <SectionTitle>Position</SectionTitle>
      {(['x', 'y', 'z'] as const).map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={shape.position[i]}
          min={-4}
          max={4}
          step={0.01}
          onChange={(v) => {
            const next = [...shape.position] as [number, number, number];
            next[i] = v;
            onChange({ position: next });
          }}
        />
      ))}

      <SectionTitle>Rotation (snapshot)</SectionTitle>
      {(['x', 'y', 'z'] as const).map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={shape.rotation[i]}
          min={-Math.PI * 2}
          max={Math.PI * 2}
          step={0.01}
          format={(v) => `${((v * 180) / Math.PI).toFixed(0)}°`}
          onChange={(v) => {
            const next = [...shape.rotation] as [number, number, number];
            next[i] = v;
            onChange({ rotation: next });
          }}
        />
      ))}

      <SectionTitle>Spin (rad/s)</SectionTitle>
      {(['x', 'y', 'z'] as const).map((axis, i) => (
        <Slider
          key={axis}
          label={`${axis.toUpperCase()} spin`}
          value={shape.rotationSpeed[i]}
          min={-2}
          max={2}
          step={0.01}
          onChange={(v) => {
            const next = [...shape.rotationSpeed] as [number, number, number];
            next[i] = v;
            onChange({ rotationSpeed: next });
          }}
        />
      ))}

      <SectionTitle>Scale & breath</SectionTitle>
      <Slider
        label="Scale"
        value={shape.scale}
        min={0.05}
        max={4}
        step={0.01}
        onChange={(v) => onChange({ scale: v })}
      />
      <Slider
        label="Pulse amp"
        value={shape.pulseAmplitude}
        min={0}
        max={0.5}
        step={0.005}
        onChange={(v) => onChange({ pulseAmplitude: v })}
      />
      <Slider
        label="Pulse Hz"
        value={shape.pulseSpeed}
        min={0.05}
        max={4}
        step={0.01}
        onChange={(v) => onChange({ pulseSpeed: v })}
      />
      <Toggle
        label="Slow breath"
        value={shape.breathing}
        onChange={(v) => onChange({ breathing: v })}
      />

      <SectionTitle>Material</SectionTitle>
      <ColorField
        label="Color"
        value={shape.color}
        onChange={(v) => onChange({ color: v })}
      />
      <div className="chakra-row">
        {CHAKRAS.map((c) => (
          <button
            key={c.name}
            type="button"
            title={`${c.name} · ${c.hz} Hz`}
            className={`chakra-swatch ${shape.color.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}`}
            style={{ background: c.hex, color: c.hex }}
            onClick={() => onChange({ color: c.hex })}
          />
        ))}
      </div>
      <Slider
        label="Glow"
        value={shape.emissive}
        min={0}
        max={4}
        step={0.05}
        onChange={(v) => onChange({ emissive: v })}
      />
      <Slider
        label="Opacity"
        value={shape.opacity}
        min={0.05}
        max={1}
        step={0.01}
        onChange={(v) => onChange({ opacity: v })}
      />
      {supportsWireframe && (
        <Toggle
          label="Wireframe"
          value={shape.wireframe}
          onChange={(v) => onChange({ wireframe: v })}
        />
      )}
      {supportsThickness && (
        <Slider
          label="Line"
          value={shape.thickness}
          min={0.003}
          max={0.06}
          step={0.001}
          onChange={(v) => onChange({ thickness: v })}
        />
      )}
      {supportsDetail && (
        <Slider
          label="Detail"
          value={shape.detail}
          min={0}
          max={4}
          step={1}
          onChange={(v) => onChange({ detail: v })}
        />
      )}
      <Toggle
        label="Mark vertices"
        value={shape.showVertices}
        onChange={(v) => onChange({ showVertices: v })}
      />

      <ArrayEditor
        array={shape.array}
        anchor={shape.anchor}
        onArray={(p) => onChange({ array: { ...shape.array, ...p } })}
        onAnchor={(a) => onChange({ anchor: a })}
      />
    </div>
  );
}

const MODE_OPTIONS: { value: ArrayMode; label: string }[] = [
  { value: 'none', label: 'Off' },
  { value: 'revolve', label: 'Revolve / Lathe (spin around axis)' },
  { value: 'linear', label: 'Linear' },
  { value: 'polar', label: 'Polar ring' },
  { value: 'spherical', label: 'Spherical' },
  { value: 'cubic', label: 'Cubic lattice' },
  { value: 'helix', label: 'Helix' },
  { value: 'disc', label: 'Golden disc' },
];

const AXIS_OPTIONS: { value: AxisKey; label: string }[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'z', label: 'Z' },
];

function ArrayEditor({
  array,
  anchor,
  onArray,
  onAnchor,
}: {
  array: ArrayConfig;
  anchor: [number, number, number];
  onArray: (p: Partial<ArrayConfig>) => void;
  onAnchor: (a: [number, number, number]) => void;
}) {
  const liveCount = computeArray(array).length;
  const showAxis = ['linear', 'polar', 'helix', 'disc', 'revolve'].includes(array.mode);
  const showRadius = ['polar', 'spherical', 'helix'].includes(array.mode);
  const showSpacing = ['linear', 'cubic', 'disc'].includes(array.mode);
  const showCount = ['linear', 'polar', 'spherical', 'helix', 'disc', 'revolve'].includes(array.mode);
  const isCubic = array.mode === 'cubic';
  const isHelix = array.mode === 'helix';
  const isRevolve = array.mode === 'revolve';
  const showFalloff = ['linear', 'cubic', 'helix', 'disc'].includes(array.mode);

  return (
    <>
      <SectionTitle>Repeat / Array {liveCount > 1 ? `· ${liveCount} copies` : ''}</SectionTitle>
      <SelectField<ArrayMode>
        label="Mode"
        value={array.mode}
        options={MODE_OPTIONS}
        onChange={(v) => onArray({ mode: v })}
      />

      {array.mode !== 'none' && (
        <>
          {showCount && (
            <Slider
              label="Count"
              value={array.count}
              min={1}
              max={array.mode === 'spherical' ? 200 : 80}
              step={1}
              onChange={(v) => onArray({ count: v })}
            />
          )}
          {isCubic && (
            <>
              <Slider
                label="Count X"
                value={array.countX}
                min={1}
                max={9}
                step={1}
                onChange={(v) => onArray({ countX: v })}
              />
              <Slider
                label="Count Y"
                value={array.countY}
                min={1}
                max={9}
                step={1}
                onChange={(v) => onArray({ countY: v })}
              />
              <Slider
                label="Count Z"
                value={array.countZ}
                min={1}
                max={9}
                step={1}
                onChange={(v) => onArray({ countZ: v })}
              />
            </>
          )}
          {showAxis && (
            <Segmented<AxisKey>
              label="Axis"
              value={array.axis}
              options={AXIS_OPTIONS}
              onChange={(v) => onArray({ axis: v })}
            />
          )}
          {showRadius && (
            <Slider
              label="Radius"
              value={array.radius}
              min={0.1}
              max={6}
              step={0.01}
              onChange={(v) => onArray({ radius: v })}
            />
          )}
          {showSpacing && (
            <Slider
              label="Spacing"
              value={array.spacing}
              min={0.05}
              max={3}
              step={0.01}
              onChange={(v) => onArray({ spacing: v })}
            />
          )}
          {isHelix && (
            <>
              <Slider
                label="Turns"
                value={array.turns}
                min={0.25}
                max={10}
                step={0.05}
                onChange={(v) => onArray({ turns: v })}
              />
              <Slider
                label="Height"
                value={array.height}
                min={0.1}
                max={8}
                step={0.05}
                onChange={(v) => onArray({ height: v })}
              />
            </>
          )}
          {isRevolve && (
            <Slider
              label="Sweep"
              value={array.sweep}
              min={0.1}
              max={Math.PI * 2}
              step={0.01}
              format={(v) => `${((v * 180) / Math.PI).toFixed(0)}°`}
              onChange={(v) => onArray({ sweep: v })}
            />
          )}
          <Toggle
            label="Face outward"
            value={array.faceOutward}
            onChange={(v) => onArray({ faceOutward: v })}
          />
          <Slider
            label="Twist"
            value={array.twist}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            format={(v) => `${((v * 180) / Math.PI).toFixed(0)}°`}
            onChange={(v) => onArray({ twist: v })}
          />
          {showFalloff && (
            <Slider
              label="Scale falloff"
              value={array.scaleFalloff}
              min={-1}
              max={1}
              step={0.01}
              onChange={(v) => onArray({ scaleFalloff: v })}
            />
          )}
        </>
      )}

      <SectionTitle>Anchor</SectionTitle>
      {(['x', 'y', 'z'] as const).map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={anchor[i]}
          min={-4}
          max={4}
          step={0.01}
          onChange={(v) => {
            const next: [number, number, number] = [anchor[0], anchor[1], anchor[2]];
            next[i] = v;
            onAnchor(next);
          }}
        />
      ))}
    </>
  );
}

function GlobalControls({ toast }: { toast: ToastSetter }) {
  const bloomIntensity = useStore((s) => s.bloomIntensity);
  const bloomRadius = useStore((s) => s.bloomRadius);
  const background = useStore((s) => s.background);
  const showStars = useStore((s) => s.showStars);
  const showAxes = useStore((s) => s.showAxes);
  const showGoldenRatio = useStore((s) => s.showGoldenRatio);
  const meditationMode = useStore((s) => s.meditationMode);
  const cameraDistance = useStore((s) => s.cameraDistance);
  const autoRotateSpeed = useStore((s) => s.autoRotateSpeed);
  const globalRotationMultiplier = useStore((s) => s.globalRotationMultiplier);
  const setGlobal = useStore((s) => s.setGlobal);
  const serialize = useStore((s) => s.serialize);

  return (
    <div>
      <SectionTitle>Camera & Field</SectionTitle>
      <Slider
        label="Distance"
        value={cameraDistance}
        min={1.5}
        max={14}
        step={0.05}
        onChange={(v) => setGlobal('cameraDistance', v)}
      />
      <Slider
        label="Spin mult"
        value={globalRotationMultiplier}
        min={0}
        max={3}
        step={0.01}
        onChange={(v) => setGlobal('globalRotationMultiplier', v)}
      />
      <Toggle
        label="Meditation orbit"
        value={meditationMode}
        onChange={(v) => setGlobal('meditationMode', v)}
      />
      <Slider
        label="Orbit speed"
        value={autoRotateSpeed}
        min={0.02}
        max={1.2}
        step={0.01}
        onChange={(v) => setGlobal('autoRotateSpeed', v)}
      />

      <SectionTitle>Atmosphere</SectionTitle>
      <ColorField
        label="Background"
        value={background}
        onChange={(v) => setGlobal('background', v)}
      />
      <Slider
        label="Bloom"
        value={bloomIntensity}
        min={0}
        max={3}
        step={0.01}
        onChange={(v) => setGlobal('bloomIntensity', v)}
      />
      <Slider
        label="Bloom radius"
        value={bloomRadius}
        min={0}
        max={1.5}
        step={0.01}
        onChange={(v) => setGlobal('bloomRadius', v)}
      />
      <Toggle label="Stars" value={showStars} onChange={(v) => setGlobal('showStars', v)} />
      <Toggle label="Axes" value={showAxes} onChange={(v) => setGlobal('showAxes', v)} />
      <Toggle
        label="Golden-ratio overlay"
        value={showGoldenRatio}
        onChange={(v) => setGlobal('showGoldenRatio', v)}
      />

      <SectionTitle>Output</SectionTitle>
      <div className="btn-row">
        <button
          className="btn primary"
          onClick={() => {
            try {
              exportPng(2);
              toast('PNG saved');
            } catch (e) {
              toast(`Export failed: ${(e as Error).message}`);
            }
          }}
        >
          Save PNG
        </button>
        <button
          className="btn"
          onClick={async () => {
            try {
              await copyShareLink(serialize());
              toast('Share link copied');
            } catch {
              toast('Copy failed');
            }
          }}
        >
          Copy link
        </button>
      </div>
    </div>
  );
}

interface RightPanelProps {
  toast: ToastSetter;
  collapsed?: boolean;
}

export function RightPanel({ toast, collapsed = false }: RightPanelProps) {
  const shapes = useStore((s) => s.shapes);
  const selectedId = useStore((s) => s.selectedId);
  const updateShape = useStore((s) => s.updateShape);

  const selected = shapes.find((s) => s.id === selectedId) ?? null;

  return (
    <aside className={collapsed ? 'panel right collapsed' : 'panel right'}>
      <div className="panel-header">
        <h2>{selected ? 'Layer · ' + selected.name : 'Global'}</h2>
      </div>
      <div className="panel-body">
        {selected ? (
          <ShapeEditor
            shape={selected}
            onChange={(p) => updateShape(selected.id, p)}
          />
        ) : (
          <p className="empty-hint" style={{ textAlign: 'left', padding: '0 4px 14px' }}>
            Pick a layer to tune its parameters, or work with the global controls below.
          </p>
        )}
        <div style={{ borderTop: '1px solid var(--panel-border)', marginTop: 14, paddingTop: 12 }}>
          <GlobalControls toast={toast} />
        </div>
      </div>
    </aside>
  );
}
