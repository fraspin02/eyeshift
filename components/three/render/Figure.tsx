"use client";

import { useMemo, type ReactNode } from "react";
import * as THREE from "three";

/**
 * Stylised CGI wearer (rider / streetwear) used only for campaign renders.
 * Faces −z, so its back — and the backpack — face the camera at +z.
 */
export function Figure({
  outfit = "rider",
  pose = "stand",
  children,
}: {
  outfit?: "rider" | "street";
  pose?: "stand" | "walk";
  children?: ReactNode;
}) {
  const mats = useMemo(() => {
    const jacket =
      outfit === "rider"
        ? new THREE.MeshPhysicalMaterial({ color: "#0b0b0d", roughness: 0.42, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.35, sheen: 0.4, sheenColor: new THREE.Color("#3a3f4a") })
        : new THREE.MeshPhysicalMaterial({ color: "#1d1f24", roughness: 0.85, sheen: 1, sheenRoughness: 0.6, sheenColor: new THREE.Color("#5b606b") });
    const pants = new THREE.MeshStandardMaterial({ color: outfit === "rider" ? "#0d0e12" : "#24262c", roughness: 0.8 });
    const boots = new THREE.MeshStandardMaterial({ color: "#060607", roughness: 0.45, metalness: 0.1 });
    const helmet = new THREE.MeshPhysicalMaterial({ color: "#08080a", roughness: 0.18, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 });
    const skin = new THREE.MeshStandardMaterial({ color: "#6b4a3a", roughness: 0.6 });
    const cap = new THREE.MeshStandardMaterial({ color: "#121316", roughness: 0.9 });
    return { jacket, pants, boots, helmet, skin, cap };
  }, [outfit]);

  const torso = useMemo(() => {
    const pts = [
      [0.0, 0.0],
      [0.16, 0.0],
      [0.17, 0.08],
      [0.155, 0.2],
      [0.17, 0.34],
      [0.205, 0.46],
      [0.215, 0.53],
      [0.18, 0.6],
      [0.08, 0.64],
      [0.055, 0.68],
      [0.0, 0.69],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const g = new THREE.LatheGeometry(pts, 40);
    g.scale(1.12, 1, 0.62);
    return g;
  }, []);

  const limb = (r: number, len: number) => {
    const g = new THREE.CapsuleGeometry(r, len, 8, 20);
    return g;
  };

  const walk = pose === "walk";
  return (
    <group>
      {/* torso + jacket */}
      <mesh geometry={torso} material={mats.jacket} position={[0, 0.9, 0]} castShadow />
      {/* collar */}
      <mesh material={mats.jacket} position={[0, 1.55, 0.0]} castShadow>
        <cylinderGeometry args={[0.075, 0.085, 0.07, 24]} />
      </mesh>
      {/* head */}
      {outfit === "rider" ? (
        <mesh material={mats.helmet} position={[0, 1.7, 0]} scale={[1, 1.05, 1.12]} castShadow>
          <sphereGeometry args={[0.145, 48, 32]} />
        </mesh>
      ) : (
        <group position={[0, 1.69, 0]}>
          <mesh material={mats.skin} scale={[0.92, 1.1, 1]} castShadow>
            <sphereGeometry args={[0.105, 32, 24]} />
          </mesh>
          {/* hood */}
          <mesh material={mats.jacket} position={[0, 0.0, 0.025]} scale={[1.08, 1.12, 1.05]} castShadow>
            <sphereGeometry args={[0.122, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
          </mesh>
          <mesh material={mats.cap} position={[0, 0.07, 0]} rotation-x={-0.12}>
            <sphereGeometry args={[0.112, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
        </group>
      )}
      {/* arms */}
      {[1, -1].map((s) => (
        <group key={s} position={[0.235 * s, 1.43, 0]} rotation={[walk ? 0.25 * s : 0.05, 0, 0.12 * s]}>
          <mesh geometry={limb(0.058, 0.24)} material={mats.jacket} position={[0, -0.15, 0]} castShadow />
          <group position={[0, -0.3, 0]} rotation-x={walk ? -0.35 : -0.18}>
            <mesh geometry={limb(0.048, 0.22)} material={mats.jacket} position={[0, -0.14, 0]} castShadow />
            <mesh material={outfit === "rider" ? mats.boots : mats.skin} position={[0, -0.3, 0]} scale={[0.8, 1.1, 0.5]}>
              <sphereGeometry args={[0.05, 16, 12]} />
            </mesh>
          </group>
        </group>
      ))}
      {/* legs */}
      {[1, -1].map((s) => (
        <group key={s} position={[0.095 * s, 0.93, 0]} rotation-x={walk ? 0.28 * s : 0}>
          <mesh geometry={limb(0.082, 0.36)} material={mats.pants} position={[0, -0.22, 0]} castShadow />
          <group position={[0, -0.44, 0]} rotation-x={walk ? (s > 0 ? -0.05 : 0.35) : 0}>
            <mesh geometry={limb(0.062, 0.36)} material={mats.pants} position={[0, -0.21, 0]} castShadow />
            <mesh material={mats.boots} position={[0, -0.44, -0.04]} castShadow>
              <boxGeometry args={[0.11, 0.1, 0.27]} />
            </mesh>
          </group>
        </group>
      ))}
      {/* backpack worn on the back */}
      <group position={[0, 1.22, 0.335]} rotation-x={0.06}>
        {children}
      </group>
    </group>
  );
}
