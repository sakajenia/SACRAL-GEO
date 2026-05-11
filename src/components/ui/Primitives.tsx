import { memo, useEffect, useId, useState } from 'react';

const ResetButton = memo(function ResetButton({
  canReset,
  onReset,
  title,
}: {
  canReset: boolean;
  onReset: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={canReset ? 'reset-btn on' : 'reset-btn'}
      title={title ?? (canReset ? 'Reset to default' : 'Already at default')}
      aria-label="Reset"
      disabled={!canReset}
      onClick={onReset}
    >
      ↺
    </button>
  );
});

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  defaultValue?: number;
  onChange: (v: number) => void;
}

export function Slider({ label, value, min, max, step = 0.01, format, defaultValue, onChange }: SliderProps) {
  const id = useId();
  const decimals = step >= 1 ? 0 : 2;
  const display = format ? format(value) : value.toFixed(decimals);
  const tol = Math.max(step * 0.5, 1e-6);
  const canReset = defaultValue !== undefined && Math.abs(value - defaultValue) > tol;
  const reset = () => defaultValue !== undefined && onChange(defaultValue);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(display);

  useEffect(() => {
    if (!editing) setDraft(display);
  }, [display, editing]);

  const commit = (txt: string) => {
    const match = txt.replace(',', '.').match(/-?\d+(\.\d+)?/);
    if (match) {
      const n = parseFloat(match[0]);
      if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
    }
    setEditing(false);
  };

  return (
    <div className="field">
      <div className="field-row">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onDoubleClick={reset}
        />
        <input
          type="text"
          className="num num-input"
          value={editing ? draft : display}
          onFocus={() => {
            setDraft(format ? String(Number(value.toFixed(decimals))) : value.toFixed(decimals));
            setEditing(true);
          }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            if (e.key === 'Escape') {
              setEditing(false);
              setDraft(display);
            }
          }}
          inputMode="decimal"
          spellCheck={false}
        />
        <ResetButton
          canReset={canReset}
          onReset={reset}
          title={canReset ? `Reset to ${format ? format(defaultValue!) : defaultValue}` : undefined}
        />
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  value: boolean;
  defaultValue?: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, value, defaultValue, onChange }: ToggleProps) {
  const canReset = defaultValue !== undefined && value !== defaultValue;
  return (
    <div className="toggle-row">
      <label onClick={() => onChange(!value)}>{label}</label>
      <ResetButton canReset={canReset} onReset={() => defaultValue !== undefined && onChange(defaultValue)} />
      <span
        className={value ? 'toggle on' : 'toggle'}
        aria-pressed={value}
        role="button"
        onClick={() => onChange(!value)}
      />
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  defaultValue?: string;
  onChange: (v: string) => void;
}

export function ColorField({ label, value, defaultValue, onChange }: ColorFieldProps) {
  const canReset = defaultValue !== undefined && value.toLowerCase() !== defaultValue.toLowerCase();
  return (
    <div className="field">
      <div className="field-header">
        <label>{label}</label>
        <ResetButton canReset={canReset} onReset={() => defaultValue !== undefined && onChange(defaultValue)} />
      </div>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <div className="section-title">{children}</div>;
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <div className="field">
      <label style={{ marginBottom: 4 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="field">
      {label && <label style={{ marginBottom: 4 }}>{label}</label>}
      <div className="segmented">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={value === o.value ? 'on' : ''}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
