import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// ─── Vertex Shader ─────────────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// ─── Fragment Shader ────────────────────────────────────────────────────────
// Large rolling cloud banks that drift strictly left → right.
// Matches the Izanami reference: dense grey-white mist in the middle band,
// mountain peaks visible top, tree silhouettes visible bottom.
const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uDensity;
  varying vec2 vUv;

  // ── Value noise ──────────────────────────────────────────────────────────────
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.3);
    return fract(p.x * p.y);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); // quintic
    return mix(
      mix(hash(i),               hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)),   hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  // 6-octave fBm with slight rotation per octave
  float fbm(vec2 p) {
    float v = 0.0, a = 0.52;
    mat2 rot = mat2(0.8660, 0.5, -0.5, 0.8660); // 30° rotation
    for (int i = 0; i < 6; i++) {
      v += a * vnoise(p);
      p  = rot * p * 2.05;
      a *= 0.49;
    }
    return v;
  }

  void main() {
    // ── 1. Large-scale UVs ─────────────────────────────────────────────────
    vec2 uv = vUv * 0.7;

    // ── 2. Left → right wind (Purely time-based, automatic drifting) ───────
    // Background layer: steady, slow roll
    vec2 wind1 = vec2(uTime * 0.25, sin(uTime * 0.05) * 0.02);
    // Foreground layer: noticeably faster for depth
    vec2 wind2 = vec2(uTime * 0.35, sin(uTime * 0.08) * 0.015);

    // ── 3. Triple domain-warp fBm ──────────────────────────────────────────
    // Background layer — large, heavy mass
    float q1 = fbm(uv + wind1);
    float r1 = fbm(uv + vec2(q1 * 0.9) + wind1);
    float f1 = fbm(uv + vec2(r1 * 0.8) + wind1);

    // Foreground layer — thinner, faster wisps
    float q2 = fbm(uv * 1.3 + wind2);
    float f2 = fbm(uv * 1.3 + vec2(q2 * 0.7) + wind2);

    // Blend: 70% background mass + 30% foreground texture
    float fog = f1 * 0.70 + f2 * 0.30;

    // ── 4. Fog colour ──────────────────────────────────────────────────────
    vec3 fogColor = vec3(0.74, 0.78, 0.76);

    // ── 5. Alpha & Dynamics ────────────────────────────────────────────────
    // Base alpha — subtle mist across the entire image
    float alpha = smoothstep(0.1, 0.95, fog) * 0.85;
    
    // Make it much denser at the top of the image
    float topDensity = smoothstep(0.4, 1.0, vUv.y);
    alpha = max(alpha, topDensity * fog * 2.0);
    
    // Multiply by overall density
    alpha *= uDensity;

    // Fade out as hero scrolls deeply out of view (Phase 2), but otherwise keep it fixed over the image
    alpha *= 1.0 - clamp((uScroll - 800.0) / 1000.0, 0.0, 1.0);

    gl_FragColor = vec4(fogColor, clamp(alpha, 0.0, 1.0));
  }
`;

// ─── Component ──────────────────────────────────────────────────────────────
export default function FogOverlay() {
  const materialRef = useRef();
  const { viewport } = useThree();

  const scrollTarget  = useRef(0);
  const scrollCurrent = useRef(0);
  const currentDensity = useRef(1.0);

  const uniforms = useMemo(() => ({
    uTime:    { value: 0.0 },
    uScroll:  { value: 0.0 },
    uDensity: { value: 1.0 },
  }), []);

  useEffect(() => {
    const onScroll = () => { scrollTarget.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((state, delta) => {
    scrollCurrent.current +=
      (scrollTarget.current - scrollCurrent.current) * Math.min(delta * 2.5, 1);

    // Calculate if we are in the "Neram logo" phase to give a cinematic boost
    const vh = window.innerHeight;
    const distFromLogo = Math.abs(scrollCurrent.current - (vh * 1.4));
    const logoBoost = Math.max(0, 1.0 - (distFromLogo / (vh * 0.8)));

    // Base density with a bump for the logo
    const targetDensity = 0.9 + (logoBoost * 0.5);
    
    currentDensity.current += (targetDensity - currentDensity.current) * delta * 2.0;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value    = state.clock.elapsedTime;
      materialRef.current.uniforms.uScroll.value  = scrollCurrent.current;
      materialRef.current.uniforms.uDensity.value = currentDensity.current;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}