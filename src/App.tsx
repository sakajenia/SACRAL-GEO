import { useEffect, useRef, useState } from 'react';
import { Scene } from './components/Scene';
import { LeftPanel } from './components/ui/LeftPanel';
import { RightPanel } from './components/ui/RightPanel';
import { Toolbar } from './components/ui/Toolbar';
import { HelpOverlay } from './components/ui/HelpOverlay';
import { LoreModal } from './components/ui/LoreModal';
import { useStore } from './store';

const ONBOARD_KEY = 'sacral-geo-onboarded-v2';

export function App() {
  const loadFromUrl = useStore((s) => s.loadFromUrl);
  const meditation = useStore((s) => s.meditationMode);
  const setGlobal = useStore((s) => s.setGlobal);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const selectedId = useStore((s) => s.selectedId);
  const removeShape = useStore((s) => s.removeShape);
  const duplicateShape = useStore((s) => s.duplicateShape);
  const setTransformMode = useStore((s) => s.setTransformMode);

  const [helpOpen, setHelpOpen] = useState(false);
  const [loreOpen, setLoreOpen] = useState(false);
  const shapes = useStore((s) => s.shapes);
  const selectedShape = shapes.find((s) => s.id === selectedId);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const isNarrow =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 980px)').matches;
  const [leftCollapsed, setLeftCollapsed] = useState(isNarrow);
  const [rightCollapsed, setRightCollapsed] = useState(isNarrow);

  const [onboardOpen, setOnboardOpen] = useState(() => {
    try {
      return !localStorage.getItem(ONBOARD_KEY);
    } catch {
      return true;
    }
  });

  useEffect(() => {
    loadFromUrl();
  }, [loadFromUrl]);

  function dismissOnboard() {
    setOnboardOpen(false);
    try {
      localStorage.setItem(ONBOARD_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!onboardOpen) return;
    const t = window.setTimeout(() => {
      setOnboardOpen(false);
      try {
        localStorage.setItem(ONBOARD_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 14000);
    return () => window.clearTimeout(t);
  }, [onboardOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === 'z' || e.key === 'Z')) {
        if (e.shiftKey) redo();
        else undo();
        e.preventDefault();
        return;
      }
      if (mod && (e.key === 'y' || e.key === 'Y')) {
        redo();
        e.preventDefault();
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        setGlobal('meditationMode', !useStore.getState().meditationMode);
      }
      if (e.key === '[') setLeftCollapsed((v) => !v);
      if (e.key === ']') setRightCollapsed((v) => !v);
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeShape(selectedId);
        e.preventDefault();
      }
      if ((e.key === 'd' || e.key === 'D') && !mod && selectedId) {
        duplicateShape(selectedId);
      }
      if (e.key === '?') {
        setHelpOpen((v) => !v);
      }
      if (e.key === 'i' || e.key === 'I') {
        if (selectedId) setLoreOpen((v) => !v);
      }
      if (e.key === 't' || e.key === 'T') {
        if (selectedId) setTransformMode(useStore.getState().transformMode === 'translate' ? 'off' : 'translate');
      }
      if (e.key === 'r' || e.key === 'R') {
        if (selectedId) setTransformMode(useStore.getState().transformMode === 'rotate' ? 'off' : 'rotate');
      }
      if (e.key === 's' || e.key === 'S') {
        if (selectedId) setTransformMode(useStore.getState().transformMode === 'scale' ? 'off' : 'scale');
      }
      if (e.key === 'Escape') {
        setTransformMode('off');
        setHelpOpen(false);
        setLoreOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setGlobal, undo, redo, selectedId, removeShape, duplicateShape, setTransformMode]);

  function showToast(msg: string) {
    setToastMsg(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 1800);
  }

  return (
    <div className="app">
      <LeftPanel collapsed={leftCollapsed} />

      <div className="canvas-wrap">
        <Scene />

        <Toolbar
          toast={showToast}
          onHelp={() => setHelpOpen((v) => !v)}
          onLore={() => setLoreOpen((v) => !v)}
        />

        <button
          className="mobile-toggle left"
          onClick={() => setLeftCollapsed((v) => !v)}
          aria-label="Toggle left panel"
        >
          ☰
        </button>
        <button
          className="mobile-toggle right"
          onClick={() => setRightCollapsed((v) => !v)}
          aria-label="Toggle right panel"
        >
          ⚙
        </button>

        <div className="hud-info">
          {meditation
            ? '✦ meditation mode  ·  M to release  ✦'
            : 'drag canvas to orbit · scroll to zoom · click a shape to select'}
        </div>

        {onboardOpen && (
          <div className="onboard">
            <span className="icon">✦</span>
            <span className="text">
              Pick a sacred form from <b>Add</b>, click a shape in the canvas to select it, then
              tune <b>Transform</b>, <b>Material</b> and <b>Repeat</b> in the right panel.
              Try <b>Repeat → Revolve</b> to lathe a 2D form into a 3D sphere.
            </span>
            <button className="close" onClick={dismissOnboard} aria-label="Dismiss">
              ✕
            </button>
          </div>
        )}

        {toastMsg && <div className="toast">{toastMsg}</div>}

        {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
        {loreOpen && selectedShape && (
          <LoreModal type={selectedShape.type} onClose={() => setLoreOpen(false)} />
        )}
      </div>

      <RightPanel toast={showToast} collapsed={rightCollapsed} />
    </div>
  );
}
