"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BackpackModel } from "../BackpackModel";
import { Lighting } from "../Lighting";
import { Smoke } from "../Smoke";
import { Figure } from "./Figure";
import { ConcreteSet, NightCity, StudioSweep } from "./Sets";
import { EyeEngine } from "@/lib/eyes/engine";
import { SHELL_VARIANTS } from "@/lib/data/variants";
import { DEFAULT_LOOK, type Look } from "@/lib/store";
import type { Shot } from "@/lib/render/shots";

declare global {
  interface Window {
    __RENDER_READY?: boolean;
    __SHOT_SIZE?: { w: number; h: number };
  }
}

function useStillEngine(power = 1) {
  const engine = useMemo(() => new EyeEngine({ dot: 14, alive: false }), []);
  useEffect(() => {
    engine.power = power;
    engine.stripPower = power > 0 ? 1 : 0.06;
  }, [engine, power]);
  return engine;
}

function CameraRig({ shot }: { shot: Shot }) {
  const { camera } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...shot.cam);
    cam.fov = shot.fov ?? 30;
    cam.near = 0.02;
    cam.far = 120;
    cam.lookAt(new THREE.Vector3(...shot.target));
    cam.updateProjectionMatrix();
  }, [camera, shot]);
  return null;
}

function ReadySignal() {
  const frames = useRef(0);
  const start = useRef(performance.now());
  useFrame(() => {
    frames.current++;
    if (frames.current > 10 && performance.now() - start.current > 2500) window.__RENDER_READY = true;
  });
  return null;
}

function Product({ shot, exploded = 0, engine }: { shot: Shot; exploded?: number; engine?: EyeEngine }) {
  const look: Look = { ...DEFAULT_LOOK, animation: "static", ...shot.look };
  const own = useStillEngine(shot.power ?? 1);
  return <BackpackModel look={look} engine={engine ?? own} instant exploded={exploded} fps={60} glow={2.3} />;
}

function HeroSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#020203"]} />
      <fog attach="fog" args={["#020203", 1.3, 3.2]} />
      <Lighting mood="hero" />
      <pointLight position={[0, -0.2, 1.1]} intensity={0.8} color="#b9c4dd" distance={3} />
      <group rotation-y={shot.rotY ?? 0} position={[0, 0.02, 0]}>
        <Product shot={shot} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.34, 0]}>
        <planeGeometry args={[10, 10]} />
        <MeshReflectorMaterial resolution={1024} mixBlur={1} mixStrength={1.4} blur={[300, 100]} roughness={0.85} depthScale={1} minDepthThreshold={0.5} maxDepthThreshold={1.2} color="#040406" metalness={0.6} mirror={0.7} />
      </mesh>
      <Smoke count={6} y={-0.36} opacity={0.07} />
    </>
  );
}

function StudioSet({ shot, dark = true }: { shot: Shot; dark?: boolean }) {
  return (
    <>
      <color attach="background" args={[dark ? "#0b0c10" : "#d9dce2"]} />
      <StudioSweep color={dark ? "#0e1015" : "#cfd3da"} floorY={-0.27} />
      <Lighting mood="studio" intensity={1.05} />
      <spotLight position={[-1.6, 1.4, -0.8]} angle={0.5} penumbra={1} intensity={8} color="#00E5FF" />
      <group rotation-y={shot.rotY ?? 0}>
        <Product shot={shot} />
      </group>
      <ContactShadows position={[0, -0.268, 0]} opacity={0.75} scale={2} blur={2.4} far={0.6} resolution={1024} />
    </>
  );
}

function ColorsSet() {
  const spacing = 0.47;
  return (
    <>
      <color attach="background" args={["#0b0c10"]} />
      <StudioSweep color="#101218" floorY={-0.27} />
      <Lighting mood="studio" intensity={1.1} />
      {SHELL_VARIANTS.map((v, i) => {
        const x = (i - (SHELL_VARIANTS.length - 1) / 2) * spacing;
        const shot: Shot = { id: v.id, file: "", w: 0, h: 0, kind: "studio", cam: [0, 0, 0], target: [0, 0, 0], look: { shell: v.id, preset: "predator", led: "red" } };
        return (
          <group key={v.id} position={[x, 0, -Math.abs(x) * 0.25]} rotation-y={-x * 0.35 + 0.15}>
            <Product shot={shot} />
          </group>
        );
      })}
      <ContactShadows position={[0, -0.268, 0]} opacity={0.7} scale={5} blur={2.2} far={0.6} resolution={1024} />
    </>
  );
}

function EyesSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#020203"]} />
      <Lighting mood="macro" intensity={0.8} />
      <Product shot={shot} />
    </>
  );
}

function MacroSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#020203"]} />
      <Lighting mood="macro" />
      <group rotation-y={shot.rotY ?? 0}>
        <Product shot={shot} />
      </group>
    </>
  );
}

function ExplodedSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#08090d"]} />
      <Lighting mood="graphite" />
      <group rotation-y={shot.rotY ?? 0}>
        <Product shot={shot} exploded={1} />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.34, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0a0b0f" roughness={0.6} />
      </mesh>
      <gridHelper args={[4, 40, "#1d2028", "#14161c"]} position={[0, -0.339, 0]} />
    </>
  );
}

function NightSet({ shot }: { shot: Shot }) {
  const layer = shot.layer ?? "all";
  return (
    <>
      {layer !== "fg" && <color attach="background" args={["#04050a"]} />}
      {layer !== "fg" && <NightCity />}
      <Lighting mood="night" intensity={layer === "bg" ? 0.0001 : 1} />
      {layer !== "bg" && (
        <>
          <pointLight position={[0.8, 1.6, 1.6]} intensity={2.5} color="#b8c7ff" distance={5} />
          <group rotation-y={shot.rotY ?? 0}>
            <Figure outfit="rider">
              <Product shot={shot} />
            </Figure>
          </group>
        </>
      )}
    </>
  );
}

function UrbanSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#16181d"]} />
      <ConcreteSet />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.6} position={[0, 5, 2]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1} position={[-5, 2, 2]} scale={[2, 5, 1]} rotation-y={Math.PI / 2} />
      </Environment>
      <group rotation-y={shot.rotY ?? 0}>
        <Figure outfit="street" pose="walk">
          <Product shot={shot} />
        </Figure>
      </group>
    </>
  );
}

function WornSet({ shot }: { shot: Shot }) {
  return (
    <>
      <color attach="background" args={["#0b0c10"]} />
      <StudioSweep color="#0e1015" floorY={0} />
      <Lighting mood="studio" intensity={1.1} />
      <spotLight position={[-2, 2.4, -1.5]} angle={0.5} penumbra={1} intensity={20} color="#00E5FF" />
      <group rotation-y={shot.rotY ?? 0}>
        <Figure outfit="street">
          <Product shot={shot} />
        </Figure>
      </group>
      <ContactShadows position={[0, 0.002, 0]} opacity={0.8} scale={3} blur={2.5} far={1} />
    </>
  );
}

function Post({ shot }: { shot: Shot }) {
  if (shot.alpha) return null;
  const dof = shot.kind === "macro" || shot.kind === "night" || shot.kind === "urban";
  const focus = new THREE.Vector3(...shot.target);
  const camPos = new THREE.Vector3(...shot.cam);
  const dist = camPos.distanceTo(focus);
  return (
    <EffectComposer multisampling={4}>
      {dof ? (
        <DepthOfField target={focus} focalLength={shot.kind === "macro" ? 0.02 : 0.06} bokehScale={shot.kind === "macro" ? 6 : 3} height={1080} worldFocusRange={shot.kind === "macro" ? dist * 0.15 : 0.6} />
      ) : (
        <></>
      )}
      <Bloom intensity={shot.kind === "night" ? 1.4 : 1.15} luminanceThreshold={1} luminanceSmoothing={0.2} mipmapBlur radius={0.75} />
      <Vignette offset={0.25} darkness={shot.kind === "studio" || shot.kind === "variant" ? 0.45 : 0.75} />
    </EffectComposer>
  );
}

export default function RenderStudio({ shot }: { shot: Shot }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    window.__RENDER_READY = false;
    window.__SHOT_SIZE = { w: shot.w, h: shot.h };
    if (shot.alpha) document.body.style.background = "transparent";
    setOk(true);
  }, [shot]);
  if (!ok) return null;
  return (
    <div style={{ width: shot.w, height: shot.h }}>
      <Canvas
        dpr={1}
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true, alpha: !!shot.alpha }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          if (shot.alpha) gl.setClearColor(0x000000, 0);
        }}
        camera={{ fov: shot.fov ?? 30 }}
      >
        <CameraRig shot={shot} />
        {shot.kind === "hero" && <HeroSet shot={shot} />}
        {(shot.kind === "studio" || shot.kind === "variant") && <StudioSet shot={shot} />}
        {shot.kind === "colors" && <ColorsSet />}
        {shot.kind === "eyes" && <EyesSet shot={shot} />}
        {shot.kind === "macro" && <MacroSet shot={shot} />}
        {shot.kind === "exploded" && <ExplodedSet shot={shot} />}
        {shot.kind === "night" && <NightSet shot={shot} />}
        {shot.kind === "urban" && <UrbanSet shot={shot} />}
        {shot.kind === "worn" && <WornSet shot={shot} />}
        <Post shot={shot} />
        <ReadySignal />
      </Canvas>
    </div>
  );
}
