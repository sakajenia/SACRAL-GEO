import { useState } from 'react';
import { useStore } from '../../store';
import { exportPng, copyShareLink, exportGLB, setCameraPreset } from '../../lib/exports';
import { THEMES, THEME_KEYS, type ThemeKey } from '../../lib/themes';
import type { TransformMode } from '../../store';

interface ToolbarProps {
  toast: (msg: string) => void;
  onHelp: () => void;
  onLore: () => void;
}

const TRANSFORM_BUTTONS: { mode: TransformMode; label: string; title: string; glyph: string }[] = [
  { mode: 'translate', label: 'Move', title: 'Translate gizmo (T)', glyph: '⤧' },
  { mode: 'rotate', label: 'Turn', title: 'Rotate gizmo (R)', glyph: '↻' },
  { mode: 'scale', label: 'Size', title: 'Scale gizmo (S)', glyph: '⤡' },
];

export function Toolbar({ toast, onHelp, onLore }: ToolbarProps) {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.past.length > 0);
  const canRedo = useStore((s) => s.future.length > 0);
  const randomizeColors = useStore((s) => s.randomizeColors);
  const setGlobal = useStore((s) => s.setGlobal);
  const meditation = useStore((s) => s.meditationMode);
  const showParticles = useStore((s) => s.showParticles);
  const serialize = useStore((s) => s.serialize);
  const themeKey = useStore((s) => s.themeKey);
  const applyTheme = useStore((s) => s.applyTheme);
  const transformMode = useStore((s) => s.transformMode);
  const setTransformMode = useStore((s) => s.setTransformMode);
  const selectedId = useStore((s) => s.selectedId);

  const [themesOpen, setThemesOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <div className="toolbar">
      <button
        className="tb-btn"
        title="Undo (⌘Z)"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
      >
        ↶
      </button>
      <button
        className="tb-btn"
        title="Redo (⌘⇧Z)"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
      >
        ↷
      </button>

      <span className="tb-divider" />

      {TRANSFORM_BUTTONS.map((tb) => (
        <button
          key={tb.mode}
          className={transformMode === tb.mode ? 'tb-btn primary' : 'tb-btn'}
          title={tb.title}
          disabled={!selectedId}
          onClick={() => setTransformMode(transformMode === tb.mode ? 'off' : tb.mode)}
        >
          {tb.glyph}
        </button>
      ))}

      <span className="tb-divider" />

      <div className="tb-popover">
        <button
          className={themesOpen ? 'tb-btn primary' : 'tb-btn'}
          title="Theme"
          onClick={() => {
            setThemesOpen((v) => !v);
            setCameraOpen(false);
          }}
        >
          ◐
        </button>
        {themesOpen && (
          <div className="tb-menu" onMouseLeave={() => setThemesOpen(false)}>
            {THEME_KEYS.map((k) => (
              <button
                key={k}
                className={themeKey === k ? 'tb-menu-item on' : 'tb-menu-item'}
                onClick={() => {
                  applyTheme(k as ThemeKey);
                  setThemesOpen(false);
                  toast(`Theme · ${THEMES[k].label}`);
                }}
              >
                <span className="theme-dot" style={{ background: THEMES[k].palette[0] }} />
                {THEMES[k].label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="tb-popover">
        <button
          className={cameraOpen ? 'tb-btn primary' : 'tb-btn'}
          title="Camera angle"
          onClick={() => {
            setCameraOpen((v) => !v);
            setThemesOpen(false);
          }}
        >
          ⌖
        </button>
        {cameraOpen && (
          <div className="tb-menu" onMouseLeave={() => setCameraOpen(false)}>
            {(['front', 'iso', 'side', 'top'] as const).map((a) => (
              <button
                key={a}
                className="tb-menu-item"
                onClick={() => {
                  setCameraPreset(a);
                  setCameraOpen(false);
                }}
              >
                {a[0].toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="tb-btn"
        title="Randomize colours"
        onClick={() => {
          randomizeColors();
          toast('Colours randomised');
        }}
      >
        ✱
      </button>
      <button
        className={showParticles ? 'tb-btn primary' : 'tb-btn'}
        title="Toggle particle field"
        onClick={() => setGlobal('showParticles', !showParticles)}
      >
        ✧
      </button>
      <button
        className={meditation ? 'tb-btn primary' : 'tb-btn'}
        title="Meditation orbit (M)"
        onClick={() => setGlobal('meditationMode', !meditation)}
      >
        ✦
      </button>

      <span className="tb-divider" />

      <button
        className="tb-btn"
        title="Save PNG"
        onClick={() => {
          try {
            exportPng(2);
            toast('PNG saved');
          } catch (e) {
            toast(`Export failed: ${(e as Error).message}`);
          }
        }}
      >
        ⤓
      </button>
      <button
        className="tb-btn"
        title="Export 3D model (.glb)"
        onClick={async () => {
          try {
            await exportGLB();
            toast('GLB saved');
          } catch (e) {
            toast(`Export failed: ${(e as Error).message}`);
          }
        }}
      >
        ▣
      </button>
      <button
        className="tb-btn"
        title="Copy share link"
        onClick={async () => {
          try {
            await copyShareLink(serialize());
            toast('Share link copied');
          } catch {
            toast('Copy failed');
          }
        }}
      >
        ⇗
      </button>

      <span className="tb-divider" />

      <button
        className="tb-btn"
        title="Origin & meaning of the selected shape (I)"
        onClick={onLore}
        disabled={!selectedId}
      >
        𓂀
      </button>
      <button className="tb-btn" title="Keyboard shortcuts (?)" onClick={onHelp}>
        ?
      </button>
    </div>
  );
}
