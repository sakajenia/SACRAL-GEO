import { useState } from 'react';
import { useStore } from '../../store';
import { CATALOG, CATALOG_GROUPS } from '../../lib/catalog';
import type { ShapeType } from '../../lib/types';
import { ShapeIcon } from './ShapeIcons';

const PRESETS: { key: import('../../store').PresetKey; label: string; subtitle: string }[] = [
  { key: 'merkaba-flower', label: 'Merkaba in Flower', subtitle: 'Star tetrahedron + flower of life' },
  { key: 'metatron-stack', label: 'Metatron Stack', subtitle: 'Cube · flower · tree of life' },
  { key: 'platonic-spin', label: 'Platonic Orbit', subtitle: 'All 5 platonic solids dancing' },
  { key: 'sri-portal', label: 'Sri Portal', subtitle: 'Yantra over flower of life' },
  { key: 'cosmic-egg', label: 'Cosmic Egg', subtitle: 'Egg of life within a sphere' },
  { key: 'flower-revolve', label: 'Flower Revolve', subtitle: '2D flower lathed into a 3D sphere' },
  { key: 'flower-sphere', label: 'Sphere of Flowers', subtitle: '60 flowers on a Fibonacci sphere' },
  { key: 'merkaba-lattice', label: 'Merkaba Lattice', subtitle: '4×4×4 crystal of merkabas' },
  { key: 'helix-of-life', label: 'Helix of Life', subtitle: 'Seed of life spiraling through space' },
  { key: 'golden-mandala', label: 'Golden Mandala', subtitle: '89 tetrahedra on the golden disc' },
];

export function LeftPanel({ collapsed = false }: { collapsed?: boolean }) {
  const addShape = useStore((s) => s.addShape);
  const shapes = useStore((s) => s.shapes);
  const selectedId = useStore((s) => s.selectedId);
  const selectShape = useStore((s) => s.selectShape);
  const removeShape = useStore((s) => s.removeShape);
  const duplicateShape = useStore((s) => s.duplicateShape);
  const reorderShape = useStore((s) => s.reorderShape);
  const updateShape = useStore((s) => s.updateShape);
  const loadPreset = useStore((s) => s.loadPreset);
  const clearScene = useStore((s) => s.clearScene);

  const [tab, setTab] = useState<'add' | 'scene' | 'presets'>('scene');
  const [search, setSearch] = useState('');

  return (
    <aside className={collapsed ? 'panel left collapsed' : 'panel left'}>
      <div className="brand">
        <svg viewBox="0 0 64 64" className="brand-mark">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#a78bfa" strokeWidth="1.4" />
          <polygon points="32,8 56,50 8,50" fill="none" stroke="#06b6d4" strokeWidth="1.4" />
          <polygon points="32,56 8,14 56,14" fill="none" stroke="#ec4899" strokeWidth="1.4" />
          <circle cx="32" cy="32" r="3" fill="#a78bfa" />
        </svg>
        <div className="brand-text">
          <span className="title">SACRAL · GEO</span>
          <span className="subtitle">Sacred Geometry Studio</span>
        </div>
      </div>

      <div className="panel-header" style={{ gap: 4, padding: '10px 12px' }}>
        <button
          className={tab === 'scene' ? 'btn primary' : 'btn'}
          style={{ flex: 1, fontSize: 11 }}
          onClick={() => setTab('scene')}
        >
          Scene · {shapes.length}
        </button>
        <button
          className={tab === 'add' ? 'btn primary' : 'btn'}
          style={{ flex: 1, fontSize: 11 }}
          onClick={() => setTab('add')}
        >
          Add
        </button>
        <button
          className={tab === 'presets' ? 'btn primary' : 'btn'}
          style={{ flex: 1, fontSize: 11 }}
          onClick={() => setTab('presets')}
        >
          Presets
        </button>
      </div>

      <div className="panel-body">
        {tab === 'add' && (
          <div>
            <div className="search-row">
              <input
                type="text"
                placeholder="Search 19 sacred forms…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            {CATALOG_GROUPS.map((g) => {
              const items = CATALOG.filter(
                (c) =>
                  c.group === g.key &&
                  (search.trim() === '' ||
                    c.label.toLowerCase().includes(search.toLowerCase()) ||
                    c.description.toLowerCase().includes(search.toLowerCase())),
              );
              if (items.length === 0) return null;
              return (
                <div key={g.key}>
                  <div className="section-title">{g.label}</div>
                  <div className="shape-grid">
                    {items.map((c) => (
                      <button
                        key={c.type}
                        className="shape-card"
                        title={c.description}
                        onClick={() => {
                          addShape(c.type as ShapeType);
                          setTab('scene');
                          setSearch('');
                        }}
                      >
                        <ShapeIcon type={c.type as ShapeType} />
                        <span className="label">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'scene' && (
          <div>
            {shapes.length === 0 ? (
              <p className="empty-hint">
                No shapes yet.
                <br />
                Switch to <strong>Add</strong> to bring forms into the scene.
              </p>
            ) : (
              <div className="scene-list">
                {shapes.map((s, i) => (
                  <div
                    key={s.id}
                    className={`scene-item ${selectedId === s.id ? 'selected' : ''}`}
                    onClick={() => selectShape(s.id)}
                  >
                    <span className="swatch" style={{ background: s.color, color: s.color }} />
                    <span className="name">{s.name}</span>
                    <button
                      className="icon-btn"
                      title={s.visible ? 'Hide' : 'Show'}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateShape(s.id, { visible: !s.visible });
                      }}
                    >
                      {s.visible ? '◉' : '○'}
                    </button>
                    <button
                      className="icon-btn"
                      title="Move up"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderShape(s.id, -1);
                      }}
                      disabled={i === 0}
                    >
                      ▲
                    </button>
                    <button
                      className="icon-btn"
                      title="Move down"
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderShape(s.id, 1);
                      }}
                      disabled={i === shapes.length - 1}
                    >
                      ▼
                    </button>
                    <button
                      className="icon-btn"
                      title="Duplicate"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateShape(s.id);
                      }}
                    >
                      ⧉
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeShape(s.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {shapes.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <button
                  className="btn danger"
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (confirm('Clear all shapes from the scene?')) clearScene();
                  }}
                >
                  Clear scene
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'presets' && (
          <div>
            <div className="section-title">Curated configurations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  className="btn"
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    gap: 2,
                  }}
                  onClick={() => {
                    loadPreset(p.key);
                    setTab('scene');
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{p.label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>{p.subtitle}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
