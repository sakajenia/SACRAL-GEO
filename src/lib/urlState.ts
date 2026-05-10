import type { StoreSnapshot } from '../store';

const VERSION = 1;

interface Wrapped {
  v: number;
  d: StoreSnapshot;
}

let writeTimer: number | null = null;

export function encodeStateToUrl(snap: StoreSnapshot): void {
  if (writeTimer !== null) {
    window.clearTimeout(writeTimer);
  }
  writeTimer = window.setTimeout(() => {
    try {
      const wrapped: Wrapped = { v: VERSION, d: snap };
      const json = JSON.stringify(wrapped);
      const encoded = base64UrlEncode(json);
      const url = new URL(window.location.href);
      url.hash = `s=${encoded}`;
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore — non-fatal
    }
    writeTimer = null;
  }, 250);
}

export function decodeStateFromUrl(): StoreSnapshot | null {
  try {
    const hash = window.location.hash || '';
    const m = hash.match(/(?:^#|&)s=([^&]+)/);
    if (!m) return null;
    const json = base64UrlDecode(m[1]);
    const wrapped = JSON.parse(json) as Wrapped;
    if (!wrapped || wrapped.v !== VERSION) return null;
    return wrapped.d;
  } catch {
    return null;
  }
}

export function buildShareUrl(snap: StoreSnapshot): string {
  const wrapped: Wrapped = { v: VERSION, d: snap };
  const json = JSON.stringify(wrapped);
  const encoded = base64UrlEncode(json);
  const url = new URL(window.location.href);
  url.hash = `s=${encoded}`;
  return url.toString();
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  const b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(str: string): string {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
