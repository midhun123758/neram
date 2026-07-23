'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import WaterfallScene from './WaterfallScene';
import FogOverlay from './FogOverlay';

// Fixed, full-viewport WebGL background: waterfall shader + scroll-driven
// fog layered on top. Place this once near the root of your page —
// it stays pinned behind your scrollable content.
export default function WaterfallWithFog() {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 1], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <WaterfallScene image="/waterfall.jpg" />
          <FogOverlay />
        </Suspense>
      </Canvas>
    </div>
  );
}

/*
USAGE — Next.js (app router):
  WebGL canvases must be client-only. Either add 'use client' to the page
  that imports this (already present here), or load it lazily to be safe:

    import dynamic from 'next/dynamic';
    const WaterfallWithFog = dynamic(() => import('./WaterfallWithFog'), { ssr: false });

USAGE — Vite / CRA:
  Import and render directly, no changes needed:

    import WaterfallWithFog from './WaterfallWithFog';

    export default function App() {
      return (
        <>
          <WaterfallWithFog />
          <main style={{ position: 'relative', zIndex: 1, minHeight: '300vh' }}>
             ...your real page content, scrolled over the fixed canvas...
          </main>
        </>
      );
    }

Notes:
- WaterfallWithFog is `position: fixed`, so it won't scroll away — your
  page content should be `position: relative; zIndex: 1` and taller than
  100vh so there's something to scroll through.
- Drop your image at /public/waterfall.jpg (or pass a different path via
  the `image` prop on WaterfallScene).
- FogOverlay reads window.scrollY and eases toward it every frame, so the
  fog's fbm pattern drifts vertically as the page scrolls — same principle
  as the CSS layered-cloud effect, just computed per-pixel in a shader
  instead of moving pre-made images.
*/