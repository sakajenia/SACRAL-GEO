# SACRAL · GEO

An interactive 3D playground for sacred geometry. Compose layered scenes from
the 5 Platonic solids, Flower of Life, Metatron's Cube, Merkaba, Sri Yantra,
Tree of Life, golden spirals, phyllotaxis, the torus and more — then animate
each shape on every axis, breathe life into them with pulse and breath
modulation, paint them with chakra-keyed colours, and orbit the whole field in
meditation mode.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production bundle in dist/
npm run preview  # preview production bundle
```

## Highlights

- **19 sacred forms** — five Platonic solids · Vesica Piscis · Seed / Egg /
  Flower / Fruit of Life · Metatron's Cube · Merkaba · Sri Yantra · Tree of
  Life · Torus · Torus Knot · Fibonacci spiral · Phyllotaxis · Sphere
- **Layered scene** — add, reorder, hide, duplicate or remove any number of
  shapes. Every shape carries its own colour, glow, pulse, breath, spin and
  position
- **Per-axis motion** — independent X / Y / Z spin, scale pulse, slow breath,
  optional meditation auto-orbit camera
- **Mystical neon look** — emissive wireframes with bloom + vignette
  post-processing
- **Chakra palette** — 7 sephirot-mapped colours one tap away on every shape
- **Golden-ratio overlay** — phi-spiral & vesica piscis construction lines
- **Shareable URL** — every parameter is encoded into the URL hash so
  configurations bookmark and share trivially
- **PNG export** — single click to download a 2× upscaled image of the
  current scene
- **Curated presets** — *Merkaba in Flower*, *Metatron Stack*, *Platonic
  Orbit*, *Sri Portal*, *Cosmic Egg*

## Keyboard

| Key | Action |
| --- | --- |
| `M` | Toggle meditation orbit |
| `[` | Toggle left panel |
| `]` | Toggle right panel |

## Tech

React · TypeScript · Vite · three.js · @react-three/fiber · @react-three/drei
· @react-three/postprocessing · zustand
