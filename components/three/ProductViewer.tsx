"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls, ContactShadows } from "@react-three/drei";
import { BackpackModel } from "./BackpackModel";
import { Lighting, type LightingMood } from "./Lighting";
import { Effects } from "./Effects";
import { SceneCanvas } from "./SceneCanvas";
import { EyeEngine } from "@/lib/eyes/engine";
import type { Look } from "@/lib/store";
import type { Tier } from "@/lib/hooks/useDeviceTier";

export type ViewPreset = "front" | "three-quarter" | "side" | "back" | "eyes";

const VIEWS: Record<ViewPreset, { az: number; polar: number; dist: number; ty: number }> = {
  front: { az: 0, polar: Math.PI / 2 - 0.03, dist: 1.5, ty: 0 },
  "three-quarter": { az: 0.62, polar: Math.PI / 2 - 0.1, dist: 1.5, ty: 0 },
  side: { az: Math.PI / 2, polar: Math.PI / 2 - 0.05, dist: 1.5, ty: 0 },
  back: { az: Math.PI, polar: Math.PI / 2 - 0.1, dist: 1.5, ty: 0 },
  eyes: { az: 0.08, polar: Math.PI / 2 - 0.02, dist: 0.88, ty: 0.05 },
};

/** Shared handle so pages can grab a screenshot of the current viewer. */
export const viewerHandle: { gl: THREE.WebGLRenderer | null; scene: THREE.Scene | null; camera: THREE.Camera | null; engine: EyeEngine | null } = {
  gl: null,
  scene: null,
  camera: null,
  engine: null,
};

function Capture({ engine }: { engine: EyeEngine }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    viewerHandle.gl = gl;
    viewerHandle.scene = scene;
    viewerHandle.camera = camera;
    viewerHandle.engine = engine;
    return () => {
      if (viewerHandle.gl === gl) {
        viewerHandle.gl = null;
        viewerHandle.engine = null;
      }
    };
  }, [gl, scene, camera, engine]);
  return null;
}

interface InnerProps {
  look: Look;
  tier: Tier;
  view: ViewPreset;
  /** bump to replay a small camera move (e.g. after a colour change) */
  nudge?: number;
  mood?: LightingMood;
  gesture: "orbit" | "swipe";
  autoRotate?: boolean;
  zoom?: boolean;
  floor?: boolean;
  children?: ReactNode;
}

function ViewerScene({ look, tier, view, nudge = 0, mood = "studio", gesture, autoRotate = false, zoom = true, floor = true, children }: InnerProps) {
  const controls = useRef<CameraControls>(null);
  const group = useRef<THREE.Group>(null);
  const engine = useMemo(() => new EyeEngine({ dot: tier === "low" ? 7 : 10, alive: true }), [tier]);
  useEffect(() => () => engine.dispose(), [engine]);
  const swipe = useRef({ ry: 0, vel: 0, dragging: false });
  const { gl } = useThree();

  // apply view presets with a smooth camera transition
  useEffect(() => {
    const v = VIEWS[view];
    const c = controls.current;
    if (c) {
      c.setTarget(0, v.ty, 0, true);
      c.rotateTo(v.az, v.polar, true);
      c.dollyTo(v.dist, true);
    } else if (gesture === "swipe") {
      swipe.current.ry = v.az;
    }
  }, [view, gesture]);

  useEffect(() => {
    if (!nudge) return;
    const c = controls.current;
    if (c) c.rotate(0.22, -0.04, true);
    else swipe.current.vel += 0.03;
  }, [nudge]);

  // swipe mode (mobile): horizontal drag rotates the model, vertical keeps scrolling the page
  useEffect(() => {
    if (gesture !== "swipe") return;
    const el = gl.domElement;
    el.style.touchAction = "pan-y";
    let sx = 0;
    let sy = 0;
    let axis: "x" | "y" | null = null;
    const down = (e: PointerEvent) => {
      sx = e.clientX;
      sy = e.clientY;
      axis = e.pointerType === "mouse" ? "x" : null;
      swipe.current.dragging = true;
    };
    const move = (e: PointerEvent) => {
      if (!swipe.current.dragging) return;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (!axis && Math.hypot(dx, dy) > 8) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis !== "x") return;
      swipe.current.ry += dx * 0.01;
      swipe.current.vel = dx * 0.004;
      sx = e.clientX;
      sy = e.clientY;
    };
    const up = () => {
      swipe.current.dragging = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gesture, gl]);

  const camGoal = useRef({ dist: VIEWS[view].dist, ty: VIEWS[view].ty });
  camGoal.current = { dist: VIEWS[view].dist, ty: VIEWS[view].ty };
  useFrame((state, dt) => {
    if (gesture === "swipe") {
      const k = 1 - Math.exp(-dt * 3);
      const cam = state.camera;
      cam.position.x += (0 - cam.position.x) * k;
      cam.position.y += (camGoal.current.ty + 0.02 - cam.position.y) * k;
      cam.position.z += (camGoal.current.dist - cam.position.z) * k;
      cam.lookAt(0, camGoal.current.ty, 0);
    }
    if (gesture === "swipe" && group.current) {
      const s = swipe.current;
      if (!s.dragging) {
        s.ry += s.vel;
        s.vel *= 0.93;
        if (autoRotate) s.ry += dt * 0.25;
      }
      group.current.rotation.y += (s.ry - group.current.rotation.y) * Math.min(1, dt * 10);
    }
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.004;
  });

  return (
    <>
      <Capture engine={engine} />
      <Lighting mood={mood} />
      {gesture === "orbit" ? (
        <CameraControls
          ref={controls}
          makeDefault
          minDistance={zoom ? 0.55 : 1.5}
          maxDistance={zoom ? 2.2 : 1.5}
          minPolarAngle={0.9}
          maxPolarAngle={Math.PI / 2 + 0.25}
          truckSpeed={0}
          smoothTime={0.35}
          dollySpeed={0.4}
        />
      ) : null}
      <AutoOrbit enabled={gesture === "orbit" && autoRotate} controls={controls} />
      <group ref={group}>
        <BackpackModel look={look} engine={engine} alive fps={tier === "low" ? 20 : 30}>
          {children}
        </BackpackModel>
      </group>
      {floor && <ContactShadows position={[0, -0.275, 0]} opacity={0.7} scale={1.6} blur={2.4} far={0.5} resolution={tier === "high" ? 1024 : 256} frames={tier === "low" ? 1 : Infinity} />}
      <Effects tier={tier} bloom={1} vignette={false} />
    </>
  );
}

function AutoOrbit({ enabled, controls }: { enabled: boolean; controls: React.RefObject<CameraControls | null> }) {
  useFrame((_, dt) => {
    if (enabled && controls.current && !controls.current.active) controls.current.azimuthAngle += dt * 0.15;
  });
  return null;
}

export interface ProductViewerProps extends Omit<InnerProps, "tier"> {
  className?: string;
  preserve?: boolean;
  label?: string;
}

/** Rotatable / zoomable 3D product viewer (desktop: orbit, mobile: swipe). */
export function ProductViewer({ className = "", preserve = false, label = "Visualizzatore 3D dello zaino", ...rest }: ProductViewerProps) {
  return (
    <div className={className} role="img" aria-label={label}>
      <SceneCanvas className="h-full w-full" preserve={preserve} camera={{ fov: 30, position: [0, 0.03, 1.5], near: 0.05, far: 20 }}>
        {(tier) => <ViewerScene tier={tier} {...rest} />}
      </SceneCanvas>
    </div>
  );
}

/** Mobile variant: horizontal swipe rotates, vertical swipe scrolls the page. */
export function MobileProductViewer(props: Omit<ProductViewerProps, "gesture">) {
  return <ProductViewer {...props} gesture="swipe" zoom={false} />;
}

/** Capture the current viewer as a PNG data URL (requires preserve=true). */
export function captureViewer(): string | null {
  const { gl } = viewerHandle;
  if (!gl) return null;
  return gl.domElement.toDataURL("image/png");
}
