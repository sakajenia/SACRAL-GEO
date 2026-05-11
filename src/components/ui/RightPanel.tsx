import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { CHAKRAS } from '../../lib/colors';
import { Slider, Toggle, ColorField, SectionTitle, SelectField, Segmented } from './Primitives';
import { ShapeIcon } from './ShapeIcons';
import { findCatalogEntry } from '../../lib/catalog';
import type { ShapeInstance, ArrayMode, AxisKey, ArrayConfig, MaterialMode } from '../../lib/types';
import { AXES, DEFAULT_ARRAY } from '../../lib/types';
import { SHAPE_DEFAULTS, GLOBAL_DEFAULTS } from '../../lib/defaults';
import { exportPng, copyShareLink } from '../../lib/exports';
import { computeArray } from '../../lib/array';

const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

type LayerTab = 'transform' | 'material' | 'repeat';
type Tab = LayerTab | 'view';

interface ToastSetter {
  (msg: string): void;
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

  const [tab, setTab] = useState<Tab>('transform');

  useEffect(() => {
    if (!selected && tab !== 'view') setTab('view');
    if (selected && tab === 'view') setTab('transform');
  }, [selected, tab]);

  const tabs: { key: Tab; label: string; enabled: boolean }[] = [
    { key: 'transform', label: 'Transform', enabled: !!selected },
    { key: 'material', label: 'Material', enabled: !!selected },
    { key: 'repeat', label: 'Repeat', enabled: !!selected },
    { key: 'view', label: 'View', enabled: true },
  ];

  const heading = selected ? selected.name : 'Global view';

  return (
    <aside className={collapsed ? 'panel right collapsed' : 'panel right'}>
      <div className="panel-header" style={{ flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShapeIcon type={selected.type} size={22} />
              <h2 style={{ margin: 0 }}>{heading}</h2>
            </div>
          ) : (
            <h2>{heading}</h2>
          )}
        </div>
        <div className="tab-strip">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'tab on' : 'tab'}
              disabled={!t.enabled}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-body">
        {tab === 'transform' && selected && (
          <TransformTab shape={selected} onChange={(p) => updateShape(selected.id, p)} />
        )}
        {tab === 'material' && selected && (
          <MaterialTab shape={selected} onChange={(p) => updateShape(selected.id, p)} />
        )}
        {tab === 'repeat' && selected && (
          <RepeatTab
            shape={selected}
            onChange={(p) => updateShape(selected.id, p)}
          />
        )}
        {tab === 'view' && <ViewTab toast={toast} />}
      </div>
    </aside>
  );
}

/* ────────────────────────── Transform ────────────────────────── */

function TransformTab({
  shape,
  onChange,
}: {
  shape: ShapeInstance;
  onChange: (partial: Partial<ShapeInstance>) => void;
}) {
  const entry = findCatalogEntry(shape.type);
  return (
    <>
      <p className="hint">{entry.description}</p>

      <div className="field">
        <label style={{ marginBottom: 4 }}>Layer name</label>
        <input
          type="text"
          value={shape.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <SectionTitle>Position</SectionTitle>
      {AXES.map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={shape.position[i]}
          defaultValue={SHAPE_DEFAULTS.position[i]}
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

      <SectionTitle>Rotation</SectionTitle>
      {AXES.map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={shape.rotation[i] * RAD2DEG}
          defaultValue={SHAPE_DEFAULTS.rotation[i] * RAD2DEG}
          min={-360}
          max={360}
          step={1}
          format={(v) => `${v.toFixed(0)}°`}
          onChange={(v) => {
            const next = [...shape.rotation] as [number, number, number];
            next[i] = v * DEG2RAD;
            onChange({ rotation: next });
          }}
        />
      ))}

      <SectionTitle>Spin · °/sec</SectionTitle>
      {AXES.map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={shape.rotationSpeed[i] * RAD2DEG}
          defaultValue={SHAPE_DEFAULTS.rotationSpeed[i] * RAD2DEG}
          min={-360}
          max={360}
          step={1}
          format={(v) => `${v.toFixed(0)}°/s`}
          onChange={(v) => {
            const next = [...shape.rotationSpeed] as [number, number, number];
            next[i] = v * DEG2RAD;
            onChange({ rotationSpeed: next });
          }}
        />
      ))}

      <SectionTitle>Scale &amp; breath</SectionTitle>
      <Slider
        label="Scale"
        value={shape.scale}
        defaultValue={SHAPE_DEFAULTS.scale}
        min={0.05}
        max={4}
        step={0.01}
        onChange={(v) => onChange({ scale: v })}
      />
      <Slider
        label="Pulse amp"
        value={shape.pulseAmplitude}
        defaultValue={SHAPE_DEFAULTS.pulseAmplitude}
        min={0}
        max={0.5}
        step={0.005}
        onChange={(v) => onChange({ pulseAmplitude: v })}
      />
      {shape.pulseAmplitude > 0 && (
        <Slider
          label="Pulse Hz"
          value={shape.pulseSpeed}
          defaultValue={SHAPE_DEFAULTS.pulseSpeed}
          min={0.05}
          max={4}
          step={0.01}
          onChange={(v) => onChange({ pulseSpeed: v })}
        />
      )}
      <Toggle
        label="Slow breath"
        value={shape.breathing}
        defaultValue={SHAPE_DEFAULTS.breathing}
        onChange={(v) => onChange({ breathing: v })}
      />
    </>
  );
}

/* ────────────────────────── Material ────────────────────────── */

function MaterialTab({
  shape,
  onChange,
}: {
  shape: ShapeInstance;
  onChange: (partial: Partial<ShapeInstance>) => void;
}) {
  const caps = findCatalogEntry(shape.type).capabilities;

  return (
    <>
      <ColorField label="Color" value={shape.color} onChange={(v) => onChange({ color: v })} />
      <div className="chakra-row" style={{ marginTop: 2 }}>
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
      <p className="hint" style={{ marginTop: 2 }}>
        Tap a chakra hue to align the form with its Solfeggio frequency.
      </p>

      {caps.wireframe && (
        <SelectField<MaterialMode>
          label="Surface"
          value={shape.materialMode}
          options={[
            { value: 'wireframe', label: 'Wireframe — emissive lines' },
            { value: 'solid', label: 'Solid — emissive surface' },
            { value: 'glass', label: 'Glass — refractive crystal' },
            { value: 'holographic', label: 'Holographic — iridescent' },
          ]}
          onChange={(v) => onChange({ materialMode: v, wireframe: v === 'wireframe' })}
        />
      )}
      <Slider label="Glow" value={shape.emissive} defaultValue={SHAPE_DEFAULTS.emissive} min={0} max={4} step={0.05} onChange={(v) => onChange({ emissive: v })} />
      <Slider label="Opacity" value={shape.opacity} defaultValue={SHAPE_DEFAULTS.opacity} min={0.05} max={1} step={0.01} onChange={(v) => onChange({ opacity: v })} />
      {caps.thickness && (
        <Slider label="Line thickness" value={shape.thickness} defaultValue={SHAPE_DEFAULTS.thickness} min={0.003} max={0.06} step={0.001} onChange={(v) => onChange({ thickness: v })} />
      )}
      {caps.detail && (
        <Slider label="Detail" value={shape.detail} defaultValue={SHAPE_DEFAULTS.detail} min={0} max={4} step={1} onChange={(v) => onChange({ detail: v })} />
      )}
      <Toggle label="Mark vertices" value={shape.showVertices} defaultValue={SHAPE_DEFAULTS.showVertices} onChange={(v) => onChange({ showVertices: v })} />
    </>
  );
}

/* ────────────────────────── Repeat / Array ────────────────────────── */

const MODE_OPTIONS: { value: ArrayMode; label: string }[] = [
  { value: 'none', label: 'Off — single copy' },
  { value: 'revolve', label: 'Revolve / Lathe — spin around axis' },
  { value: 'linear', label: 'Linear — array along axis' },
  { value: 'polar', label: 'Polar ring — circle around axis' },
  { value: 'spherical', label: 'Spherical — Fibonacci sphere' },
  { value: 'cubic', label: 'Cubic lattice' },
  { value: 'helix', label: 'Helix' },
  { value: 'disc', label: 'Golden disc — phyllotaxis' },
];

const AXIS_OPTIONS: { value: AxisKey; label: string }[] = [
  { value: 'x', label: 'X' },
  { value: 'y', label: 'Y' },
  { value: 'z', label: 'Z' },
];

function RepeatTab({
  shape,
  onChange,
}: {
  shape: ShapeInstance;
  onChange: (partial: Partial<ShapeInstance>) => void;
}) {
  const array = shape.array;
  const anchor = shape.anchor;

  const onArray = (p: Partial<ArrayConfig>) => onChange({ array: { ...array, ...p } });
  const onAnchor = (a: [number, number, number]) => onChange({ anchor: a });

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
      <p className="hint">
        Clone this shape across space. <em>Revolve</em> rotates copies around an axis through the
        form itself (a 2D Flower of Life becomes a 3D sphere). <em>Spherical</em> distributes them
        on a Fibonacci sphere. Try them.
      </p>

      <SelectField<ArrayMode>
        label="Mode"
        value={array.mode}
        options={MODE_OPTIONS}
        onChange={(v) => onArray({ mode: v })}
      />

      {array.mode !== 'none' && (
        <>
          <div className="count-badge">
            <span>{liveCount}</span> {liveCount === 1 ? 'copy' : 'copies'} rendering
          </div>

          {showCount && !isCubic && (
            <Slider
              label="Count"
              value={array.count}
              defaultValue={DEFAULT_ARRAY.count}
              min={1}
              max={array.mode === 'spherical' ? 200 : 100}
              step={1}
              onChange={(v) => onArray({ count: v })}
            />
          )}
          {isCubic && (
            <>
              <Slider label="Count X" value={array.countX} defaultValue={DEFAULT_ARRAY.countX} min={1} max={9} step={1} onChange={(v) => onArray({ countX: v })} />
              <Slider label="Count Y" value={array.countY} defaultValue={DEFAULT_ARRAY.countY} min={1} max={9} step={1} onChange={(v) => onArray({ countY: v })} />
              <Slider label="Count Z" value={array.countZ} defaultValue={DEFAULT_ARRAY.countZ} min={1} max={9} step={1} onChange={(v) => onArray({ countZ: v })} />
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
            <Slider label="Radius" value={array.radius} defaultValue={DEFAULT_ARRAY.radius} min={0.1} max={6} step={0.01} onChange={(v) => onArray({ radius: v })} />
          )}
          {showSpacing && (
            <Slider label="Spacing" value={array.spacing} defaultValue={DEFAULT_ARRAY.spacing} min={0.05} max={3} step={0.01} onChange={(v) => onArray({ spacing: v })} />
          )}
          {isHelix && (
            <>
              <Slider label="Turns" value={array.turns} defaultValue={DEFAULT_ARRAY.turns} min={0.25} max={10} step={0.05} onChange={(v) => onArray({ turns: v })} />
              <Slider label="Height" value={array.height} defaultValue={DEFAULT_ARRAY.height} min={0.1} max={8} step={0.05} onChange={(v) => onArray({ height: v })} />
            </>
          )}
          {isRevolve && (
            <Slider
              label="Sweep"
              value={array.sweep * RAD2DEG}
              defaultValue={DEFAULT_ARRAY.sweep * RAD2DEG}
              min={5}
              max={360}
              step={1}
              format={(v) => `${v.toFixed(0)}°`}
              onChange={(v) => onArray({ sweep: v * DEG2RAD })}
            />
          )}
          {!isRevolve && (
            <Toggle label="Face outward" value={array.faceOutward} defaultValue={DEFAULT_ARRAY.faceOutward} onChange={(v) => onArray({ faceOutward: v })} />
          )}
          <Slider
            label="Twist / copy"
            value={array.twist * RAD2DEG}
            defaultValue={DEFAULT_ARRAY.twist * RAD2DEG}
            min={-180}
            max={180}
            step={1}
            format={(v) => `${v.toFixed(0)}°`}
            onChange={(v) => onArray({ twist: v * DEG2RAD })}
          />
          {showFalloff && (
            <Slider label="Scale falloff" value={array.scaleFalloff} defaultValue={DEFAULT_ARRAY.scaleFalloff} min={-1} max={1} step={0.01} onChange={(v) => onArray({ scaleFalloff: v })} />
          )}
        </>
      )}

      <SectionTitle>Anchor</SectionTitle>
      <p className="hint">Offset for the array centre, independent of the shape's own position.</p>
      {AXES.map((axis, i) => (
        <Slider
          key={axis}
          label={axis.toUpperCase()}
          value={anchor[i]}
          defaultValue={SHAPE_DEFAULTS.anchor[i]}
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

/* ────────────────────────── View / Globals ────────────────────────── */

function ViewTab({ toast }: { toast: ToastSetter }) {
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
    <>
      <SectionTitle>Camera &amp; field</SectionTitle>
      <Slider label="Distance" value={cameraDistance} defaultValue={GLOBAL_DEFAULTS.cameraDistance} min={1.5} max={14} step={0.05} onChange={(v) => setGlobal('cameraDistance', v)} />
      <Slider label="Spin mult" value={globalRotationMultiplier} defaultValue={GLOBAL_DEFAULTS.globalRotationMultiplier} min={0} max={3} step={0.01} onChange={(v) => setGlobal('globalRotationMultiplier', v)} />
      <Toggle label="Meditation orbit" value={meditationMode} defaultValue={GLOBAL_DEFAULTS.meditationMode} onChange={(v) => setGlobal('meditationMode', v)} />
      {meditationMode && (
        <Slider label="Orbit speed" value={autoRotateSpeed} defaultValue={GLOBAL_DEFAULTS.autoRotateSpeed} min={0.02} max={1.2} step={0.01} onChange={(v) => setGlobal('autoRotateSpeed', v)} />
      )}

      <SectionTitle>Atmosphere</SectionTitle>
      <ColorField label="Background" value={background} defaultValue={GLOBAL_DEFAULTS.background} onChange={(v) => setGlobal('background', v)} />
      <Slider label="Bloom" value={bloomIntensity} defaultValue={GLOBAL_DEFAULTS.bloomIntensity} min={0} max={3} step={0.01} onChange={(v) => setGlobal('bloomIntensity', v)} />
      <Slider label="Bloom radius" value={bloomRadius} defaultValue={GLOBAL_DEFAULTS.bloomRadius} min={0} max={1.5} step={0.01} onChange={(v) => setGlobal('bloomRadius', v)} />
      <Toggle label="Stars" value={showStars} defaultValue={GLOBAL_DEFAULTS.showStars} onChange={(v) => setGlobal('showStars', v)} />
      <Toggle label="Axes" value={showAxes} defaultValue={GLOBAL_DEFAULTS.showAxes} onChange={(v) => setGlobal('showAxes', v)} />
      <Toggle label="Golden-ratio overlay" value={showGoldenRatio} defaultValue={GLOBAL_DEFAULTS.showGoldenRatio} onChange={(v) => setGlobal('showGoldenRatio', v)} />

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
    </>
  );
}
