import { getLore, type Lang } from '../../lib/lore';
import { findCatalogEntry } from '../../lib/catalog';
import { ShapeIcon } from './ShapeIcons';
import { useStore } from '../../store';
import type { ShapeType } from '../../lib/types';

interface Props {
  type: ShapeType;
  onClose: () => void;
}

const CLOSE_LABEL: Record<Lang, string> = { en: 'Close', it: 'Chiudi' };

export function LoreModal({ type, onClose }: Props) {
  const lang = useStore((s) => s.lang);
  const setLang = useStore((s) => s.setLang);
  const entry = findCatalogEntry(type);
  const lore = getLore(type, lang);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === 'en' ? 'on' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={lang === 'it' ? 'on' : ''}
                onClick={() => setLang('it')}
              >
                IT
              </button>
            </div>
            <button className="close" onClick={onClose} aria-label={CLOSE_LABEL[lang]} title={CLOSE_LABEL[lang]}>
              ✕
            </button>
          </div>
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
