import { useEffect, useRef, useState } from 'react';
import { Scene } from './components/Scene';
import { LeftPanel } from './components/ui/LeftPanel';
import { RightPanel } from './components/ui/RightPanel';
import { useStore } from './store';

export function App() {
  const loadFromUrl = useStore((s) => s.loadFromUrl);
  const meditation = useStore((s) => s.meditationMode);
  const setGlobal = useStore((s) => s.setGlobal);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const isNarrow =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 980px)').matches;
  const [leftCollapsed, setLeftCollapsed] = useState(isNarrow);
  const [rightCollapsed, setRightCollapsed] = useState(isNarrow);

  useEffect(() => {
    loadFromUrl();
  }, [loadFromUrl]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        setGlobal('meditationMode', !useStore.getState().meditationMode);
      }
      if (e.key === '[') setLeftCollapsed((v) => !v);
      if (e.key === ']') setRightCollapsed((v) => !v);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setGlobal]);

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
            ? '✦ meditation mode  ·  press M to release  ✦'
            : 'drag to orbit  ·  scroll to zoom  ·  press M for meditation'}
        </div>

        <div className="hud">
          <button
            className="btn"
            onClick={() => setGlobal('meditationMode', !meditation)}
          >
            {meditation ? 'Stop orbit' : 'Meditate'}
          </button>
        </div>

        {toastMsg && <div className="toast">{toastMsg}</div>}
      </div>

      <RightPanel toast={showToast} collapsed={rightCollapsed} />
    </div>
  );
}
