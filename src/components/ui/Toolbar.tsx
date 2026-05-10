import { useStore } from '../../store';
import { exportPng, copyShareLink } from '../../lib/exports';

interface ToolbarProps {
  toast: (msg: string) => void;
}

export function Toolbar({ toast }: ToolbarProps) {
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const canUndo = useStore((s) => s.past.length > 0);
  const canRedo = useStore((s) => s.future.length > 0);
  const randomizeColors = useStore((s) => s.randomizeColors);
  const setGlobal = useStore((s) => s.setGlobal);
  const meditation = useStore((s) => s.meditationMode);
  const serialize = useStore((s) => s.serialize);

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

      <button
        className="tb-btn"
        title="Randomize colours"
        onClick={() => {
          randomizeColors();
          toast('Colours randomised');
        }}
        aria-label="Randomize"
      >
        ✱
      </button>
      <button
        className="tb-btn"
        title="Recenter view"
        onClick={() => {
          setGlobal('cameraDistance', 5.5);
          toast('View recentred');
        }}
        aria-label="Recenter view"
      >
        ⌖
      </button>
      <button
        className={meditation ? 'tb-btn primary' : 'tb-btn'}
        title="Meditation orbit (M)"
        onClick={() => setGlobal('meditationMode', !meditation)}
        aria-label="Toggle meditation orbit"
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
        aria-label="Save PNG"
      >
        ⤓
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
        aria-label="Copy share link"
      >
        ⇗
      </button>
    </div>
  );
}
