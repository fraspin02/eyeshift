"use client";

import { forwardRef, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getBackpackGeometries } from "@/lib/three/backpackGeometry";
import { getCarbonTextures, getFabricBump, getShellGrain } from "@/lib/three/textures";
import { SHELL_BY_ID } from "@/lib/data/variants";
import { LED_BY_ID } from "@/lib/data/eyes";
import type { Look } from "@/lib/store";
import { EyeEngine } from "@/lib/eyes/engine";

export interface BackpackModelProps {
  look: Look;
  /** pass an engine to control it from outside (intro timelines, renders) */
  engine?: EyeEngine;
  alive?: boolean;
  /** 0..1 separation of the main parts (exploded view) */
  exploded?: number;
  /** snap materials instantly (still renders) */
  instant?: boolean;
  /** LED texture redraw rate */
  fps?: number;
  /** emissive multiplier for the displays (>1 feeds bloom) */
  glow?: number;
  children?: ReactNode;
}

const tmp = new THREE.Color();

export const BackpackModel = forwardRef<THREE.Group, BackpackModelProps>(function BackpackModel(
  { look, engine: externalEngine, alive = false, exploded = 0, instant = false, fps = 30, glow = 1.6, children },
  ref
) {
  const geo = useMemo(() => getBackpackGeometries(), []);
  const internalEngine = useMemo(
    () => (externalEngine ? null : new EyeEngine({ dot: 10, alive })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [externalEngine]
  );
  const engine = (externalEngine ?? internalEngine)!;

  useEffect(() => () => internalEngine?.dispose(), [internalEngine]);
  useEffect(() => {
    engine.alive = alive;
  }, [engine, alive]);

  const ledHex = LED_BY_ID[look.led].hex;
  useEffect(() => {
    engine.setLook({ preset: look.preset, color: ledHex, animation: look.animation, playing: look.playing });
    if (instant) engine.snapColor();
  }, [engine, look.preset, ledHex, look.animation, look.playing, instant]);

  const mats = useMemo(() => {
    const grain = getShellGrain();
    const fabricBump = getFabricBump();
    const shell = new THREE.MeshPhysicalMaterial({
      color: "#0e0f13",
      roughness: 0.5,
      metalness: 0.15,
      clearcoat: 0.3,
      clearcoatRoughness: 0.5,
      roughnessMap: grain,
      envMapIntensity: 1,
    });
    const bezel = new THREE.MeshPhysicalMaterial({
      color: "#050507",
      roughness: 0.22,
      metalness: 0.4,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const eyes = new THREE.MeshBasicMaterial({ map: engine.texture, toneMapped: false });
    const lens = new THREE.MeshPhysicalMaterial({
      color: "#000000",
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.22,
      clearcoat: 1,
      depthWrite: false,
      envMapIntensity: 1.4,
    });
    const body = new THREE.MeshStandardMaterial({
      color: "#121318",
      roughness: 0.9,
      metalness: 0,
      bumpMap: fabricBump,
      bumpScale: 0.6,
    });
    const strap = new THREE.MeshStandardMaterial({
      color: "#0d0e11",
      roughness: 0.85,
      bumpMap: fabricBump,
      bumpScale: 0.8,
    });
    const rubber = new THREE.MeshStandardMaterial({ color: "#0a0a0c", roughness: 0.6 });
    const hardware = new THREE.MeshStandardMaterial({ color: "#26282e", roughness: 0.35, metalness: 0.6 });
    const seam = new THREE.MeshStandardMaterial({ color: "#1c1d22", roughness: 0.4, metalness: 0.5 });
    const strip = new THREE.MeshBasicMaterial({ color: "#ff243e", toneMapped: false });
    return { shell, bezel, eyes, lens, body, strap, rubber, hardware, seam, strip };
  }, [engine]);

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose());
    },
    [mats]
  );

  const variant = SHELL_BY_ID[look.shell];
  const target = useRef({
    color: new THREE.Color(variant.material.color),
    body: new THREE.Color(variant.material.body),
    bezel: new THREE.Color(variant.material.bezel),
    roughness: variant.material.roughness,
    metalness: variant.material.metalness,
    clearcoat: variant.material.clearcoat,
    clearcoatRoughness: variant.material.clearcoatRoughness,
  });

  useEffect(() => {
    const m = variant.material;
    const t = target.current;
    t.color.set(m.color);
    t.body.set(m.body);
    t.bezel.set(m.bezel);
    t.roughness = m.roughness;
    t.metalness = m.metalness;
    t.clearcoat = m.clearcoat;
    t.clearcoatRoughness = m.clearcoatRoughness;
    const shell = mats.shell;
    if (m.carbon) {
      const { map, roughnessMap } = getCarbonTextures();
      shell.map = map;
      shell.roughnessMap = roughnessMap;
    } else {
      shell.map = null;
      shell.roughnessMap = getShellGrain();
    }
    shell.needsUpdate = true;
    if (instant) snap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, mats, instant]);

  function snap() {
    const t = target.current;
    mats.shell.color.copy(t.color);
    if (mats.shell.map) mats.shell.color.set("#ffffff");
    mats.body.color.copy(t.body);
    mats.bezel.color.copy(t.bezel);
    mats.shell.roughness = t.roughness;
    mats.shell.metalness = t.metalness;
    mats.shell.clearcoat = t.clearcoat;
    mats.shell.clearcoatRoughness = t.clearcoatRoughness;
  }

  // parts that move in the exploded view
  const shellGroup = useRef<THREE.Group>(null);
  const eyeGroup = useRef<THREE.Group>(null);
  const backGroup = useRef<THREE.Group>(null);
  const strapGroup = useRef<THREE.Group>(null);
  const handleRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    engine.update(state.clock.elapsedTime, fps);
    // LED strip follows the LED colour and the engine's strip level
    tmp.set(ledHex).multiplyScalar(0.25 + engine.stripLevel * glow * 1.4);
    mats.strip.color.copy(tmp);
    mats.eyes.color.setScalar(glow);

    // material transitions
    if (!instant) {
      const k = 1 - Math.exp(-delta * 5);
      const t = target.current;
      const shell = mats.shell;
      const col = shell.map ? tmp.set("#ffffff") : t.color;
      shell.color.lerp(col, k);
      shell.roughness += (t.roughness - shell.roughness) * k;
      shell.metalness += (t.metalness - shell.metalness) * k;
      shell.clearcoat += (t.clearcoat - shell.clearcoat) * k;
      shell.clearcoatRoughness += (t.clearcoatRoughness - shell.clearcoatRoughness) * k;
      mats.body.color.lerp(t.body, k);
      mats.bezel.color.lerp(t.bezel, k);
    }

    const e = exploded;
    if (shellGroup.current) shellGroup.current.position.z = e * 0.14;
    if (eyeGroup.current) eyeGroup.current.position.z = e * 0.06;
    if (backGroup.current) backGroup.current.position.z = -e * 0.07;
    if (strapGroup.current) strapGroup.current.position.z = -e * 0.15;
    if (handleRef.current) handleRef.current.position.y = e * 0.07;
  });

  return (
    <group ref={ref} dispose={null}>
      <group ref={shellGroup}>
        <mesh geometry={geo.shell} material={mats.shell} castShadow receiveShadow />
        <mesh geometry={geo.shellRim} material={mats.shell} castShadow />
        <mesh geometry={geo.stripHousing} material={mats.bezel} />
        <mesh geometry={geo.strip} material={mats.strip} />
        <group ref={eyeGroup}>
          <mesh geometry={geo.bezel} material={mats.bezel} />
          <mesh geometry={geo.eyes} material={mats.eyes} />
          <mesh geometry={geo.eyes} material={mats.lens} position={[0, 0, 0.0015]} renderOrder={2} />
        </group>
      </group>
      <mesh geometry={geo.body} material={mats.body} castShadow receiveShadow />
      <mesh geometry={geo.seam} material={mats.seam} />
      <mesh ref={handleRef} geometry={geo.handle} material={mats.rubber} castShadow />
      <group ref={backGroup}>
        <mesh geometry={geo.backPanel} material={mats.strap} castShadow />
        <mesh geometry={geo.backPads} material={mats.body} />
      </group>
      <group ref={strapGroup}>
        <mesh geometry={geo.strapL} material={mats.strap} castShadow />
        <mesh geometry={geo.strapR} material={mats.strap} castShadow />
        <mesh geometry={geo.hardware} material={mats.hardware} />
      </group>
      {children}
    </group>
  );
});
