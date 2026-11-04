"use client";

import { Environment, Lightformer } from "@react-three/drei";

export type LightingMood = "hero" | "studio" | "graphite" | "night" | "macro";

/**
 * Procedural studio lighting — no HDR downloads.
 * Lightformers give the faceted shell its crisp reflections; real lights shape it.
 */
export function Lighting({ mood = "hero", intensity = 1, accent = "#00E5FF" }: { mood?: LightingMood; intensity?: number; accent?: string }) {
  const i = intensity;
  if (mood === "studio") {
    return (
      <>
        <ambientLight intensity={0.25 * i} />
        <directionalLight position={[2, 3, 3]} intensity={2.2 * i} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
        <directionalLight position={[-3, 1, -2]} intensity={1.2 * i} color="#cfe8ff" />
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#0b0c10"]} />
          <Lightformer form="rect" intensity={3 * i} position={[0, 4, 2]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2 * i} position={[-4, 1, 2]} scale={[2, 5, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2 * i} position={[4, 1, 2]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={1.2 * i} position={[0, 1, -5]} scale={[8, 3, 1]} />
        </Environment>
      </>
    );
  }
  if (mood === "graphite") {
    return (
      <>
        <ambientLight intensity={0.2 * i} />
        <directionalLight position={[2, 2.5, 3]} intensity={1.8 * i} />
        <pointLight position={[-1.2, 0.4, 0.8]} intensity={3 * i} color={accent} distance={4} />
        <Environment resolution={128} frames={1}>
          <color attach="background" args={["#121419"]} />
          <Lightformer form="rect" intensity={2.5 * i} position={[0, 4, 1]} scale={[5, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2 * i} color={accent} position={[-4, 0.5, 1]} scale={[1, 4, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.4 * i} position={[4, 0.5, 1]} scale={[1, 4, 1]} rotation-y={-Math.PI / 2} />
        </Environment>
      </>
    );
  }
  if (mood === "macro") {
    return (
      <>
        <ambientLight intensity={0.05 * i} />
        <directionalLight position={[3, 0.4, 0.6]} intensity={3.5 * i} />
        <pointLight position={[-0.6, 0.2, 0.5]} intensity={2 * i} color={accent} distance={2} />
        <Environment resolution={128} frames={1}>
          <color attach="background" args={["#020203"]} />
          <Lightformer form="rect" intensity={4 * i} position={[4, 0.5, 1]} scale={[0.6, 4, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={1.5 * i} color={accent} position={[-4, 0.5, 1]} scale={[0.4, 4, 1]} rotation-y={Math.PI / 2} />
        </Environment>
      </>
    );
  }
  if (mood === "night") {
    return (
      <>
        <ambientLight intensity={0.08 * i} color="#7aa0ff" />
        <pointLight position={[-2.5, 1.5, -1]} intensity={14 * i} color="#00E5FF" distance={8} />
        <pointLight position={[2.5, 1.2, -1.5]} intensity={14 * i} color="#FF243E" distance={8} />
        <directionalLight position={[0, 4, 2]} intensity={0.35 * i} color="#9fb4ff" />
        <Environment resolution={128} frames={1}>
          <color attach="background" args={["#030407"]} />
          <Lightformer form="rect" intensity={2.4 * i} color="#00E5FF" position={[-5, 1, -1]} scale={[1, 6, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.4 * i} color="#FF243E" position={[5, 1, -1]} scale={[1, 6, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="rect" intensity={0.6 * i} position={[0, 5, 0]} scale={[8, 3, 1]} rotation-x={Math.PI / 2} />
        </Environment>
      </>
    );
  }
  // hero: dark void, cyan rim light, soft top key
  return (
    <>
      <ambientLight intensity={0.06 * i} />
      <spotLight position={[0, 3.2, 2.2]} angle={0.45} penumbra={1} intensity={30 * i} distance={8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-1.4, 0.6, -0.6]} intensity={3 * i} color={accent} distance={5} />
      <pointLight position={[1.4, 0.4, -0.6]} intensity={2 * i} color={accent} distance={5} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#020203"]} />
        <Lightformer form="rect" intensity={2.2 * i} position={[0, 5, 1]} scale={[4, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.4 * i} color={accent} position={[-5, 0.6, -1]} scale={[0.3, 5, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2 * i} position={[5, 0.6, -1]} scale={[0.3, 5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.8 * i} position={[0, 1, 5]} scale={[3, 1.5, 1]} />
      </Environment>
    </>
  );
}
