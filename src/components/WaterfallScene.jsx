'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float flowTime = uTime * 0.4;

    vec2 noiseUv = vec2(uv.x * 6.0, uv.y * 2.0 - flowTime);
    float n = noise(noiseUv);

    vec2 displacedUv = uv;
    float edgeMask = smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);

    displacedUv.y += (n - 0.5) * 0.015 * edgeMask;
    displacedUv.x += (n - 0.5) * 0.002 * edgeMask;

    vec4 color = texture2D(uTexture, displacedUv);
    gl_FragColor = color;
  }
`;

// Renders a full-viewport plane with a subtle flowing-water shader.
// Drop waterfall.jpg into your /public folder.
export default function WaterfallScene({ image = '/waterfall.jpg' }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();

  const texture = useTexture(image);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0.0 },
    }),
    [texture]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}