import { getLore } from '../../lib/lore';
import { findCatalogEntry } from '../../lib/catalog';
import { ShapeIcon } from './ShapeIcons';
import type { ShapeType } from '../../lib/types';

interface Props {
  type: ShapeType;
  onClose: () => void;
}

export function LoreModal({ type, onClose }: Props) {
  const entry = findCatalogEntry(type);
  const lore = getLore(type);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal lore-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShapeIcon type={type} size={28} />
            <div>
              <h3 style={{ margin: 0 }}>{entry.label}</h3>
              {lore.epigraph && <div className="lore-epigraph">{lore.epigraph}</div>}
            </div>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body lore-body">
          {lore.sections.map((section) => (
            <section key={section.heading} className="lore-section">
              <h4>{section.heading}</h4>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
