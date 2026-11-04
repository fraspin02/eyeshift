"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { hasWebGL, useDeviceTier, type Tier } from "@/lib/hooks/useDeviceTier";
import { SceneLoader } from "./SceneLoader";
import { asset } from "@/lib/asset";

interface Props extends Omit<CanvasProps, "children"> {
  children: ReactNode | ((tier: Tier) => ReactNode);
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
  preserve?: boolean;
}

/**
 * Shared WebGL wrapper: static fallback when WebGL is missing, adaptive DPR,
 * tier-based quality, Suspense loader.
 */
export function SceneCanvas({ children, fallbackImage = "/images/studio-front.jpg", fallbackAlt = "Zaino EYE//SHIFT Knight, vista frontale", className = "", preserve = false, ...rest }: Props) {
  const tier = useDeviceTier();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    setWebgl(hasWebGL());
  }, []);
  useEffect(() => {
    setDpr(tier === "high" ? Math.min(window.devicePixelRatio, 2) : tier === "mid" ? Math.min(window.devicePixelRatio, 1.5) : 1);
  }, [tier]);

  if (webgl === false) {
    return (
      <div className={`relative ${className}`}>
        <Image src={fallbackImage.startsWith("/images") ? asset(fallbackImage) : fallbackImage} alt={fallbackAlt} fill sizes="100vw" className="object-contain" priority />
        <p className="absolute bottom-4 left-4 eyebrow">Vista statica — WebGL non disponibile</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {webgl && (
        <Canvas
          dpr={dpr}
          gl={{ antialias: tier !== "low", powerPreference: "high-performance", preserveDrawingBuffer: preserve, alpha: true }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            setReady(true);
          }}
          shadows={tier === "high"}
          {...rest}
        >
          <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))} onIncline={() => setDpr((d) => Math.min(tier === "high" ? 2 : 1.5, d + 0.25))}>
            <Suspense fallback={null}>{typeof children === "function" ? children(tier) : children}</Suspense>
          </PerformanceMonitor>
          <AdaptiveDpr pixelated={false} />
        </Canvas>
      )}
      <SceneLoader visible={!ready} />
    </div>
  );
}
