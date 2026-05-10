import type { ShapeType } from '../../lib/types';

const stroke = '#a78bfa';
const stroke2 = '#06b6d4';
const sw = 1.4;

interface IconProps {
  size?: number;
}

export function ShapeIcon({ type, size = 36 }: { type: ShapeType; size?: number }) {
  const props: IconProps = { size };
  switch (type) {
    case 'tetrahedron':
      return <Tetra {...props} />;
    case 'cube':
      return <Cube {...props} />;
    case 'octahedron':
      return <Octa {...props} />;
    case 'dodecahedron':
      return <Dodeca {...props} />;
    case 'icosahedron':
      return <Icosa {...props} />;
    case 'sphere':
      return <Sphere {...props} />;
    case 'vesicaPiscis':
      return <Vesica {...props} />;
    case 'seedOfLife':
      return <Seed {...props} />;
    case 'eggOfLife':
      return <Egg {...props} />;
    case 'flowerOfLife':
      return <Flower {...props} />;
    case 'fruitOfLife':
      return <Fruit {...props} />;
    case 'metatronsCube':
      return <Metatron {...props} />;
    case 'merkaba':
      return <Merk {...props} />;
    case 'sriYantra':
      return <Sri {...props} />;
    case 'treeOfLife':
      return <Tree {...props} />;
    case 'torus':
      return <TorusIcon {...props} />;
    case 'torusKnot':
      return <Knot {...props} />;
    case 'fibonacci':
      return <Fib {...props} />;
    case 'phyllotaxis':
      return <Phyllo {...props} />;
    case 'hexagram':
      return <HexagramIcon {...props} />;
    case 'pentagram':
      return <PentagramIcon {...props} />;
    case 'starOfLakshmi':
      return <LakshmiIcon {...props} />;
    case 'cuboctahedron':
      return <CuboctaIcon {...props} />;
  }
}

const Wrap = ({ size = 36, children }: { size?: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {children}
  </svg>
);

function Tetra({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,8 56,52 8,52" stroke={stroke} strokeWidth={sw} />
      <line x1="32" y1="8" x2="32" y2="52" stroke={stroke2} strokeWidth={sw} />
      <line x1="8" y1="52" x2="56" y2="52" stroke={stroke} strokeWidth={sw} />
    </Wrap>
  );
}
function Cube({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <rect x="14" y="18" width="28" height="28" stroke={stroke} strokeWidth={sw} />
      <rect x="22" y="10" width="28" height="28" stroke={stroke2} strokeWidth={sw} />
      <line x1="14" y1="18" x2="22" y2="10" stroke={stroke} strokeWidth={sw} />
      <line x1="42" y1="18" x2="50" y2="10" stroke={stroke} strokeWidth={sw} />
      <line x1="42" y1="46" x2="50" y2="38" stroke={stroke} strokeWidth={sw} />
      <line x1="14" y1="46" x2="22" y2="38" stroke={stroke} strokeWidth={sw} />
    </Wrap>
  );
}
function Octa({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,6 58,32 32,58 6,32" stroke={stroke} strokeWidth={sw} />
      <line x1="6" y1="32" x2="58" y2="32" stroke={stroke2} strokeWidth={sw} />
      <line x1="32" y1="6" x2="32" y2="58" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Dodeca({ size }: IconProps) {
  const pts = [];
  const cx = 32;
  const cy = 32;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${cx + Math.cos(a) * 24},${cy + Math.sin(a) * 24}`);
  }
  return (
    <Wrap size={size}>
      <polygon points={pts.join(' ')} stroke={stroke} strokeWidth={sw} />
      <polygon points={pts.map(p => p.split(',').map(Number)).map(([x,y]) => `${cx + (x-cx)*0.55},${cy + (y-cy)*0.55}`).join(' ')} stroke={stroke2} strokeWidth={sw} />
      {pts.map((p, i) => {
        const [x,y] = p.split(',').map(Number);
        return <line key={i} x1={x} y1={y} x2={cx + (x-cx)*0.55} y2={cy + (y-cy)*0.55} stroke={stroke} strokeWidth={sw} />;
      })}
    </Wrap>
  );
}
function Icosa({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,6 58,22 50,52 14,52 6,22" stroke={stroke} strokeWidth={sw} />
      <line x1="32" y1="6" x2="14" y2="52" stroke={stroke2} strokeWidth={sw} />
      <line x1="32" y1="6" x2="50" y2="52" stroke={stroke2} strokeWidth={sw} />
      <line x1="58" y1="22" x2="14" y2="52" stroke={stroke2} strokeWidth={sw} />
      <line x1="6" y1="22" x2="50" y2="52" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Sphere({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <circle cx="32" cy="32" r="24" stroke={stroke} strokeWidth={sw} />
      <ellipse cx="32" cy="32" rx="24" ry="9" stroke={stroke2} strokeWidth={sw} />
      <ellipse cx="32" cy="32" rx="9" ry="24" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Vesica({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <circle cx="24" cy="32" r="18" stroke={stroke} strokeWidth={sw} />
      <circle cx="40" cy="32" r="18" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Seed({ size }: IconProps) {
  const r = 9;
  const cx = 32;
  const cy = 32;
  const circles = [{ x: cx, y: cy }];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circles.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  return (
    <Wrap size={size}>
      {circles.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={r} stroke={i === 0 ? stroke2 : stroke} strokeWidth={sw} />
      ))}
    </Wrap>
  );
}
function Egg({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <ellipse cx="32" cy="34" rx="20" ry="24" stroke={stroke} strokeWidth={sw} />
      <circle cx="32" cy="22" r="6" stroke={stroke2} strokeWidth={sw} />
      <circle cx="22" cy="36" r="6" stroke={stroke2} strokeWidth={sw} />
      <circle cx="42" cy="36" r="6" stroke={stroke2} strokeWidth={sw} />
      <circle cx="32" cy="48" r="6" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Flower({ size }: IconProps) {
  const r = 7;
  const cx = 32;
  const cy = 32;
  const ring1 = [];
  const ring2 = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ring1.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    ring2.push({ x: cx + Math.cos(a) * 2 * r, y: cy + Math.sin(a) * 2 * r });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    ring2.push({ x: cx + Math.cos(a) * r * Math.sqrt(3), y: cy + Math.sin(a) * r * Math.sqrt(3) });
  }
  return (
    <Wrap size={size}>
      <circle cx={cx} cy={cy} r={r} stroke={stroke2} strokeWidth={sw} />
      {ring1.map((c, i) => <circle key={`a${i}`} cx={c.x} cy={c.y} r={r} stroke={stroke} strokeWidth={sw} />)}
      {ring2.map((c, i) => <circle key={`b${i}`} cx={c.x} cy={c.y} r={r} stroke={stroke} strokeWidth={sw} opacity={0.6} />)}
    </Wrap>
  );
}
function Fruit({ size }: IconProps) {
  const r = 5;
  const cx = 32;
  const cy = 32;
  const circles = [{ x: cx, y: cy }];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circles.push({ x: cx + Math.cos(a) * 2 * r, y: cy + Math.sin(a) * 2 * r });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    circles.push({ x: cx + Math.cos(a) * 2 * r * Math.sqrt(3), y: cy + Math.sin(a) * 2 * r * Math.sqrt(3) });
  }
  return (
    <Wrap size={size}>
      {circles.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={r} stroke={i === 0 ? stroke2 : stroke} strokeWidth={sw} />
      ))}
    </Wrap>
  );
}
function Metatron({ size }: IconProps) {
  const r = 4;
  const cx = 32;
  const cy = 32;
  const pts: { x: number; y: number }[] = [{ x: cx, y: cy }];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push({ x: cx + Math.cos(a) * 2 * r, y: cy + Math.sin(a) * 2 * r });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    pts.push({ x: cx + Math.cos(a) * 2 * r * Math.sqrt(3), y: cy + Math.sin(a) * 2 * r * Math.sqrt(3) });
  }
  return (
    <Wrap size={size}>
      {pts.flatMap((a, i) => pts.slice(i + 1).map((b, j) => (
        <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={0.5} opacity={0.7} />
      )))}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.2} fill={stroke2} />)}
    </Wrap>
  );
}
function Merk({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,6 58,52 6,52" stroke={stroke} strokeWidth={sw} />
      <polygon points="32,58 6,12 58,12" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Sri({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <circle cx="32" cy="32" r="28" stroke={stroke} strokeWidth={0.8} opacity={0.6} />
      <polygon points="32,8 56,50 8,50" stroke={stroke} strokeWidth={sw} />
      <polygon points="32,56 8,14 56,14" stroke={stroke2} strokeWidth={sw} />
      <polygon points="32,16 50,46 14,46" stroke={stroke} strokeWidth={sw} />
      <polygon points="32,48 14,18 50,18" stroke={stroke2} strokeWidth={sw} />
      <circle cx="32" cy="32" r="2" fill={stroke} />
    </Wrap>
  );
}
function Tree({ size }: IconProps) {
  const nodes = [
    [32, 8],
    [46, 18], [18, 18],
    [46, 30], [18, 30],
    [32, 36],
    [46, 46], [18, 46],
    [32, 50],
    [32, 58],
  ];
  const paths: [number, number][] = [
    [0,1],[0,2],[0,5],[1,2],[1,3],[1,5],[2,4],[2,5],
    [3,4],[3,5],[3,6],[4,5],[4,7],
    [5,6],[5,7],[5,8],[6,7],[6,8],[6,9],[7,8],[7,9],[8,9],
  ];
  return (
    <Wrap size={size}>
      {paths.map(([a,b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={stroke} strokeWidth={0.8} opacity={0.7} />
      ))}
      {nodes.map((n, i) => <circle key={i} cx={n[0]} cy={n[1]} r={2.4} fill={stroke2} />)}
    </Wrap>
  );
}
function TorusIcon({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <ellipse cx="32" cy="32" rx="24" ry="10" stroke={stroke} strokeWidth={sw} />
      <ellipse cx="32" cy="32" rx="10" ry="4" stroke={stroke2} strokeWidth={sw} />
    </Wrap>
  );
}
function Knot({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <path d="M 14 32 Q 24 6 32 32 Q 40 58 50 32 Q 40 6 32 32 Q 24 58 14 32 Z" stroke={stroke} strokeWidth={sw} fill="none" />
    </Wrap>
  );
}
function Fib({ size }: IconProps) {
  const pts: string[] = [];
  for (let i = 0; i < 100; i++) {
    const t = i / 100 * Math.PI * 6;
    const r = 1 + i * 0.22;
    pts.push(`${32 + Math.cos(t) * r},${32 + Math.sin(t) * r}`);
  }
  return (
    <Wrap size={size}>
      <polyline points={pts.join(' ')} stroke={stroke} strokeWidth={sw} fill="none" />
    </Wrap>
  );
}
function Phyllo({ size }: IconProps) {
  const ga = Math.PI * (3 - Math.sqrt(5));
  const dots: JSX.Element[] = [];
  for (let i = 0; i < 60; i++) {
    const r = 2 * Math.sqrt(i + 1);
    const a = i * ga;
    dots.push(
      <circle key={i} cx={32 + Math.cos(a) * r} cy={32 + Math.sin(a) * r} r={1.3} fill={i % 2 ? stroke : stroke2} />
    );
  }
  return <Wrap size={size}>{dots}</Wrap>;
}
function HexagramIcon({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,8 56,52 8,52" stroke={stroke} strokeWidth={sw} fill="none" />
      <polygon points="32,56 8,12 56,12" stroke={stroke2} strokeWidth={sw} fill="none" />
    </Wrap>
  );
}
function PentagramIcon({ size }: IconProps) {
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    pts.push(`${32 + Math.cos(a) * 24},${32 + Math.sin(a) * 24}`);
  }
  // Re-order to draw star with every-other
  const star = [pts[0], pts[2], pts[4], pts[1], pts[3], pts[0]].join(' ');
  return (
    <Wrap size={size}>
      <polyline points={star} stroke={stroke} strokeWidth={sw} fill="none" />
      <circle cx="32" cy="32" r="25" stroke={stroke2} strokeWidth={0.8} fill="none" opacity={0.6} />
    </Wrap>
  );
}
function LakshmiIcon({ size }: IconProps) {
  const sq = (rot: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      pts.push(`${32 + Math.cos(a) * 24},${32 + Math.sin(a) * 24}`);
    }
    return pts.join(' ');
  };
  return (
    <Wrap size={size}>
      <polygon points={sq(0)} stroke={stroke} strokeWidth={sw} fill="none" />
      <polygon points={sq(Math.PI / 4)} stroke={stroke2} strokeWidth={sw} fill="none" />
    </Wrap>
  );
}
function CuboctaIcon({ size }: IconProps) {
  return (
    <Wrap size={size}>
      <polygon points="32,6 54,18 54,42 32,54 10,42 10,18" stroke={stroke} strokeWidth={sw} fill="none" />
      <line x1="32" y1="6" x2="32" y2="54" stroke={stroke2} strokeWidth={sw} />
      <line x1="10" y1="18" x2="54" y2="42" stroke={stroke2} strokeWidth={sw} />
      <line x1="54" y1="18" x2="10" y2="42" stroke={stroke2} strokeWidth={sw} />
      <circle cx="32" cy="30" r="4" fill={stroke} />
    </Wrap>
  );
}
