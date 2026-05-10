import { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function Slider({ label, value, min, max, step = 0.01, format, onChange }: SliderProps) {
  const id = useId();
  const display = format ? format(value) : value.toFixed(step >= 1 ? 0 : 2);
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
        />
        <span className="num">{display}</span>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="toggle-row" onClick={() => onChange(!value)} role="button">
      <label>{label}</label>
      <span className={value ? 'toggle on' : 'toggle'} aria-pressed={value} />
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="field">
      <label style={{ marginBottom: 4 }}>{label}</label>
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
