"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

let smokeTex: THREE.CanvasTexture | null = null;
function getSmokeTexture() {
  if (smokeTex) return smokeTex;
  const S = 128;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  for (let i = 0; i < 26; i++) {
    const x = S / 2 + (Math.random() - 0.5) * S * 0.4;
    const y = S / 2 + (Math.random() - 0.5) * S * 0.4;
    const r = S * (0.15 + Math.random() * 0.25);
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,0.12)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
  }
  smokeTex = new THREE.CanvasTexture(c);
  return smokeTex;
}

/** Light volumetric haze: a handful of slow additive sprites (cheap, reduced on mobile). */
export function Smoke({ count = 10, color = "#8fa6c8", opacity = 0.35, spread = [2.4, 0.5, 1.2], y = -0.3 }: { count?: number; color?: string; opacity?: number; spread?: [number, number, number]; y?: number }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * spread[0],
        y: y + Math.random() * spread[1],
        z: -0.4 - Math.random() * spread[2],
        s: 0.9 + Math.random() * 1.2,
        sp: 0.01 + Math.random() * 0.025,
        r: Math.random() * Math.PI,
      })),
    [count, spread, y]
  );
  const mat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: getSmokeTexture(),
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, opacity]
  );
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((c, i) => {
      c.position.x += items[i].sp * dt * (i % 2 ? 1 : -1);
      if (c.position.x > spread[0] / 2) c.position.x = -spread[0] / 2;
      if (c.position.x < -spread[0] / 2) c.position.x = spread[0] / 2;
      (c as THREE.Sprite).material.rotation += dt * 0.01;
    });
  });
  return (
    <group ref={group}>
      {items.map((it, i) => (
        <sprite key={i} position={[it.x, it.y, it.z]} scale={[it.s, it.s * 0.6, 1]} material={mat} />
      ))}
    </group>
  );
}
