import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function SimpleRain({ isRain }) {
  const RAIN_COUNT = 4500;
  const FIELD_W = 60, FIELD_H = 50, FIELD_D = 60;

  const { positions, velocities, linePositions } = useMemo(() => {
    const positions = new Float32Array(RAIN_COUNT * 3);
    const velocities = new Float32Array(RAIN_COUNT);
    const linePositions = new Float32Array(RAIN_COUNT * 2 * 3);

    for (let i = 0; i < RAIN_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * FIELD_W;
      positions[i * 3 + 1] = Math.random() * FIELD_H - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_D - 10;
      velocities[i] = 0.15 + Math.random() * 0.2;
    }

    return { positions, velocities, linePositions };
  }, []);

  const geomRef = useRef();

  useFrame(() => {
    if (!isRain) return;
    
    if (geomRef.current) {
      const arr = geomRef.current.attributes.position.array;
      for (let i = 0; i < RAIN_COUNT; i++) {
        // move
        positions[i * 3 + 1] -= velocities[i];
        if (positions[i * 3 + 1] < -12) {
          positions[i * 3 + 1] = FIELD_H - 10;
          positions[i * 3 + 0] = (Math.random() - 0.5) * FIELD_W;
          positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_D - 10;
        }

        const x = positions[i * 3 + 0];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        const idx = i * 6;
        arr[idx]     = x;
        arr[idx + 1] = y;
        arr[idx + 2] = z;
        arr[idx + 3] = x;
        arr[idx + 4] = y - 0.5;
        arr[idx + 5] = z;
      }
      geomRef.current.attributes.position.needsUpdate = true;
    }
  });

  if (!isRain) return null;

  return (
    <>
      <fogExp2 attach="fog" args={[0x101826, 0.02]} />
      <ambientLight color={0x88a0c0} intensity={1.4} />
      <lineSegments>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={0xbccbe0} transparent opacity={0.35} />
      </lineSegments>
    </>
  );
}
