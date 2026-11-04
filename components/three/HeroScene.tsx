"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { BackpackModel } from "./BackpackModel";
import { FeatureHotspot } from "./FeatureHotspot";
import { Smoke } from "./Smoke";
import { Effects } from "./Effects";
import { EyeEngine } from "@/lib/eyes/engine";
import { getBackpackGeometries } from "@/lib/three/backpackGeometry";
import { FEATURES } from "@/lib/data/features";
import { LED_BY_ID } from "@/lib/data/eyes";
import { useResolvedLook } from "@/lib/store";
import { intro, pointer, rig, useHomeUI } from "@/lib/home/rig";
import type { Tier } from "@/lib/hooks/useDeviceTier";

const RED = new THREE.Color("#FF243E");
const CYAN = new THREE.Color("#00E5FF");
const mix = new THREE.Color();

/** The persistent home-page scene. All motion comes from the shared rig. */
export function HeroScene({ tier, reduced }: { tier: Tier; reduced: boolean }) {
  const look = useResolvedLook();
  const engine = useMemo(() => new EyeEngine({ dot: tier === "low" ? 7 : 10, alive: !reduced }), [tier, reduced]);
  useEffect(() => () => engine.dispose(), [engine]);

  const model = useRef<THREE.Group>(null);
  const key = useRef<THREE.SpotLight>(null);
  const rimL = useRef<THREE.PointLight>(null);
  const rimR = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const floor = useRef<THREE.Mesh>(null);
  const { camera, scene } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const geo = getBackpackGeometries();
  const hotspots = useHomeUI((s) => s.hotspots);
  const active = useHomeUI((s) => s.activeHotspot);
  const setActive = useHomeUI((s) => s.setActive);
  const lastShift = useRef(-1);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    // drag inertia, slowly returning to the choreographed pose
    if (!pointer.dragging) {
      pointer.dragRy += pointer.dragVel;
      pointer.dragVel *= 0.92;
      pointer.dragRy *= 1 - Math.min(1, dt * 0.6);
    }
    const m = model.current;
    if (m) {
      const f = reduced ? 0 : rig.float;
      m.position.set(rig.mx, rig.my + Math.sin(t * 0.8) * 0.008 * f, rig.mz);
      m.rotation.y = rig.ry + intro.ry + pointer.dragRy + (reduced ? 0 : pointer.x * 0.12);
      m.rotation.x = rig.rx + (reduced ? 0 : -pointer.y * 0.05 + Math.sin(t * 0.6) * 0.012 * f);
    }
    camera.position.set(rig.cx + pointer.x * 0.02, rig.cy + pointer.y * 0.015, rig.cz * (1 + intro.cz));
    lookAt.set(rig.lx, rig.ly, 0);
    camera.lookAt(lookAt);

    const L = intro.light;
    if (key.current) key.current.intensity = 26 * L;
    if (rimL.current) rimL.current.intensity = 3 * L;
    if (rimR.current) rimR.current.intensity = 2 * L;
    scene.environmentIntensity = 0.04 + L * rig.env;
    if (fill.current) fill.current.intensity = 0.9 * L;
    if (floor.current) {
      floor.current.visible = rig.floor > 0.01;
      const fm = floor.current.material as THREE.Material;
      fm.opacity = rig.floor;
    }

    engine.power = intro.power;
    engine.stripPower = intro.strip;
    engine.setPointer(pointer.x, pointer.y);

    // final call: red → cyan
    const shift = Math.round(rig.eyeShift * 40) / 40;
    if (shift !== lastShift.current) {
      lastShift.current = shift;
      if (shift > 0.001) {
        mix.copy(RED).lerp(CYAN, shift);
        engine.setLook({ color: `#${mix.getHexString()}` });
      } else {
        engine.setLook({ color: LED_BY_ID[look.led].hex });
      }
    }
  });

  return (
    <>
      <fog attach="fog" args={["#08090D", 1.8, 4.2]} />
      <ambientLight intensity={0.05} />
      <spotLight ref={key} position={[0.3, 3.2, 2.4]} angle={0.42} penumbra={1} intensity={0} distance={9} castShadow={tier === "high"} shadow-mapSize={[1024, 1024]} />
      <pointLight ref={rimL} position={[-1.3, 0.5, -0.7]} intensity={0} color="#00E5FF" distance={5} />
      <pointLight ref={fill} position={[0, -0.25, 1.1]} intensity={0} color="#b9c4dd" distance={3} />
      <pointLight ref={rimR} position={[1.4, 0.3, -0.7]} intensity={0} color="#8D46FF" distance={5} />
      <Environment resolution={tier === "low" ? 64 : 256} frames={1}>
        <color attach="background" args={["#020203"]} />
        <Lightformer form="rect" intensity={2.4} position={[0, 5, 1]} scale={[4, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} color="#00E5FF" position={[-5, 0.6, -1]} scale={[0.3, 5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.1} position={[5, 0.6, -1]} scale={[0.3, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.7} position={[0, 1, 5]} scale={[3, 1.5, 1]} />
      </Environment>

      <group ref={model}>
        <BackpackModel ref={undefined} look={look} engine={engine} alive={!reduced} fps={tier === "low" ? 20 : 30}>
          {FEATURES.map((f, i) => (
            <FeatureHotspot
              key={f.id}
              index={i}
              label={f.title}
              position={geo.anchors[f.anchor]}
              visible={hotspots}
              active={active === f.id}
              onSelect={() => setActive(active === f.id ? null : f.id)}
            />
          ))}
        </BackpackModel>
      </group>

      {tier === "high" ? (
        <mesh ref={floor} rotation-x={-Math.PI / 2} position={[0, -0.36, 0]}>
          <planeGeometry args={[12, 12]} />
          <MeshReflectorMaterial
            transparent
            resolution={512}
            mixBlur={1.2}
            mixStrength={1.6}
            blur={[400, 120]}
            roughness={0.9}
            depthScale={1}
            minDepthThreshold={0.6}
            maxDepthThreshold={1.2}
            color="#08090D"
            metalness={0.6}
            mirror={0.6}
          />
        </mesh>
      ) : (
        <mesh ref={floor} rotation-x={-Math.PI / 2} position={[0, -0.36, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#08090D" roughness={0.35} metalness={0.5} transparent />
        </mesh>
      )}
      {tier !== "low" && !reduced && <Smoke count={tier === "high" ? 12 : 6} y={-0.34} />}
      <Effects tier={tier} bloom={1.25} />
    </>
  );
}
