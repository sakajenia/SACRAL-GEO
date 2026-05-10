import { useStore } from '../../store';
import { CHAKRAS } from '../../lib/colors';
import { Slider, Toggle, ColorField, SectionTitle } from './Primitives';
import { ShapeIcon } from './ShapeIcons';
import { findCatalogEntry } from '../../lib/catalog';
import type { ShapeInstance } from '../../lib/types';
import { exportPng, copyShareLink } from '../../lib/exports';

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
    </div>
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
