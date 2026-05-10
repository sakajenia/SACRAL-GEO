interface HelpOverlayProps {
  onClose: () => void;
}

const SHORTCUTS: { keys: string; desc: string }[] = [
  { keys: '⌘ Z  /  ⌘ ⇧ Z', desc: 'Undo / Redo' },
  { keys: 'T  /  R  /  S', desc: 'Move / Rotate / Scale gizmo' },
  { keys: 'Esc', desc: 'Drop the gizmo' },
  { keys: 'D', desc: 'Duplicate selected layer' },
  { keys: 'Delete', desc: 'Remove selected layer' },
  { keys: 'M', desc: 'Toggle meditation orbit' },
  { keys: '[  /  ]', desc: 'Toggle left / right panels' },
  { keys: '?', desc: 'Toggle this help overlay' },
  { keys: 'click in 3D', desc: 'Select that shape' },
  { keys: 'drag canvas', desc: 'Orbit camera' },
  { keys: 'scroll', desc: 'Zoom' },
];

const TIPS: string[] = [
  'In Repeat, pick Revolve and sweep 360° to lathe a 2D form into a sphere.',
  'Glass surface mode renders refractive crystals — try it on the Cuboctahedron.',
  'Tap the theme button (◐) in the toolbar to recolour the whole scene.',
  'Save your favourite configurations from Presets · Your creations.',
  'Copy the share link from the toolbar to bookmark or send the exact scene.',
];

export function HelpOverlay({ onClose }: HelpOverlayProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Keyboard &amp; controls</h3>
          <button className="close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="kbd-grid">
            {SHORTCUTS.map((s) => (
              <div key={s.keys} className="kbd-row">
                <span className="kbd">{s.keys}</span>
                <span className="kbd-desc">{s.desc}</span>
              </div>
            ))}
          </div>

          <div className="tip-list">
            <div className="section-title">Tips</div>
            <ul>
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
