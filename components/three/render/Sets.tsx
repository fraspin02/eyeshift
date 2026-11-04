"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function windowTexture(seed: number, warm: boolean) {
  const rnd = seeded(seed);
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#050608";
  g.fillRect(0, 0, 128, 256);
  for (let y = 6; y < 256; y += 12) {
    for (let x = 6; x < 128; x += 10) {
      const r = rnd();
      if (r > 0.72) {
        const k = rnd();
        g.fillStyle = warm ? `rgba(255,${170 + k * 60},${110 + k * 50},${0.5 + k * 0.5})` : `rgba(${150 + k * 60},${200 + k * 40},255,${0.4 + k * 0.5})`;
        g.fillRect(x, y, 6, 7);
      } else if (r > 0.6) {
        g.fillStyle = "rgba(60,70,90,0.35)";
        g.fillRect(x, y, 6, 7);
      }
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function concreteTexture(seed: number) {
  const rnd = seeded(seed);
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "#5d5f63";
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * S;
    const y = rnd() * S;
    const r = rnd() * 22 + 2;
    const v = 70 + rnd() * 50;
    g.fillStyle = `rgba(${v},${v},${v + 4},0.08)`;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // formwork panel joints and tie holes
  g.strokeStyle = "rgba(30,30,32,0.5)";
  g.lineWidth = 2;
  for (let i = 0; i <= S; i += S / 2) {
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(S, i);
    g.moveTo(i, 0);
    g.lineTo(i, S);
    g.stroke();
  }
  g.fillStyle = "rgba(25,25,28,0.7)";
  for (const [x, y] of [
    [64, 64],
    [192, 64],
    [320, 64],
    [448, 64],
    [64, 192],
    [192, 192],
    [320, 192],
    [448, 192],
  ]) {
    for (const oy of [0, 256]) {
      g.beginPath();
      g.arc(x, y + oy, 4, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Wet night street with emissive facades, neon accents and practical lights. */
export function NightCity({ showStreet = true }: { showStreet?: boolean }) {
  const buildings = useMemo(() => {
    const rnd = seeded(42);
    const list: { x: number; z: number; w: number; d: number; h: number; tex: THREE.Texture }[] = [];
    const texA = windowTexture(3, true);
    const texB = windowTexture(9, false);
    for (const side of [-1, 1]) {
      let z = 2;
      while (z > -60) {
        const d = 4 + rnd() * 6;
        const w = 6 + rnd() * 4;
        const h = 8 + rnd() * 26;
        list.push({ x: side * (5.2 + w / 2), z: z - d / 2, w, d, h, tex: rnd() > 0.5 ? texA : texB });
        z -= d + 0.4 + rnd() * 1.5;
      }
    }
    return list;
  }, []);
  const neons = useMemo(() => {
    const rnd = seeded(5);
    return Array.from({ length: 16 }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      return {
        x: side * (5.15 + rnd() * 0.1),
        y: 3 + rnd() * 6,
        z: -2 - i * 3.4 - rnd() * 2,
        h: 1 + rnd() * 3,
        color: rnd() > 0.5 ? "#FF243E" : rnd() > 0.4 ? "#00E5FF" : "#8D46FF",
      };
    });
  }, []);
  return (
    <group>
      <fog attach="fog" args={["#05070d", 6, 48]} />
      {showStreet && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, -20]} receiveShadow>
          <planeGeometry args={[60, 90]} />
          <MeshReflectorMaterial
            resolution={1024}
            mixBlur={0.6}
            mixStrength={4}
            blur={[160, 60]}
            roughness={0.55}
            depthScale={0.6}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#0a0b10"
            metalness={0.75}
            mirror={0.85}
          />
        </mesh>
      )}
      {/* sidewalks */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 4.4, 0.08, -20]} receiveShadow>
          <boxGeometry args={[1.6, 0.16, 90]} />
          <meshStandardMaterial color="#14161c" roughness={0.7} />
        </mesh>
      ))}
      {/* lane markings */}
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} position={[0, 0.005, 1 - i * 4.2]}>
          <planeGeometry args={[0.12, 1.8]} />
          <meshStandardMaterial color="#6d717c" roughness={0.6} />
        </mesh>
      ))}
      {buildings.map((b, i) => {
        const tex = b.tex.clone();
        tex.repeat.set(b.d / 6, b.h / 12);
        tex.needsUpdate = true;
        return (
          <mesh key={i} position={[b.x, b.h / 2, b.z]}>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#0b0c10" roughness={0.6} metalness={0.3} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={1.4} />
          </mesh>
        );
      })}
      {neons.map((n, i) => (
        <group key={i} position={[n.x, n.y, n.z]}>
          <mesh>
            <boxGeometry args={[0.08, n.h, 0.08]} />
            <meshBasicMaterial color={new THREE.Color(n.color).multiplyScalar(4)} toneMapped={false} />
          </mesh>
          {i < 4 && <pointLight color={n.color} intensity={8} distance={9} />}
        </group>
      ))}
      {/* street lamps */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={i} position={[(i % 2 ? 1 : -1) * 3.9, 0, -3 - i * 7]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 6, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[(i % 2 ? -1 : 1) * 0.6, 6, 0]}>
            <boxGeometry args={[1.2, 0.08, 0.2]} />
            <meshBasicMaterial color={new THREE.Color("#ffd9b0").multiplyScalar(3)} toneMapped={false} />
          </mesh>
          {i < 3 && <pointLight position={[(i % 2 ? -1 : 1) * 0.8, 5.8, 0]} color="#ffcfa0" intensity={22} distance={16} />}
        </group>
      ))}
      {/* distant tail lights */}
      {[
        [-1.2, -26],
        [1.4, -34],
        [-0.8, -44],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.75, z]}>
          {[-0.6, 0.6].map((o) => (
            <mesh key={o} position={[o, 0, 0]}>
              <boxGeometry args={[0.35, 0.08, 0.05]} />
              <meshBasicMaterial color={new THREE.Color("#FF243E").multiplyScalar(5)} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
      <hemisphereLight args={["#1b2a4a", "#05060a", 0.35]} />
    </group>
  );
}

/** Brutalist concrete set for the streetwear editorial. */
export function ConcreteSet() {
  const tex = useMemo(() => concreteTexture(11), []);
  const wallTex = useMemo(() => {
    const t = tex.clone();
    t.repeat.set(3, 2);
    t.needsUpdate = true;
    return t;
  }, [tex]);
  return (
    <group>
      <fog attach="fog" args={["#16181d", 8, 26]} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, -4]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial map={tex} color="#7a7c82" roughness={0.92} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 4, -6]} receiveShadow>
        <boxGeometry args={[18, 8, 0.6]} />
        <meshStandardMaterial map={wallTex} color="#8a8c92" roughness={0.95} />
      </mesh>
      {/* side wall casting a hard diagonal shadow */}
      <mesh position={[-3.2, 3.5, -2.5]} receiveShadow castShadow>
        <boxGeometry args={[0.6, 7, 7]} />
        <meshStandardMaterial map={wallTex} color="#7d7f85" roughness={0.95} />
      </mesh>
      {/* steps */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[2.6, 0.09 + i * 0.18, -2.4 - i * 0.32]} receiveShadow castShadow>
          <boxGeometry args={[3.4, 0.18, 0.34 + (5 - i) * 0.0]} />
          <meshStandardMaterial map={tex} color="#85878d" roughness={0.95} />
        </mesh>
      ))}
      {/* overhead slab */}
      <mesh position={[1, 6.2, -3]} castShadow>
        <boxGeometry args={[9, 0.5, 5]} />
        <meshStandardMaterial map={wallTex} color="#6f7177" roughness={0.95} />
      </mesh>
      <hemisphereLight args={["#aab4c8", "#2a2c31", 0.45]} />
      <directionalLight position={[5, 7, 4]} intensity={2.4} color="#e9eef8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0003} />
    </group>
  );
}

/** Seamless studio sweep with soft gradient. */
export function StudioSweep({ color = "#0d0f14", floorY = -0.27 }: { color?: string; floorY?: number }) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-6, 0);
    shape.lineTo(6, 0);
    shape.lineTo(6, 0.01);
    shape.lineTo(-6, 0.01);
    // L-shaped sweep: floor curving into back wall
    const curve = new THREE.CurvePath<THREE.Vector3>();
    curve.add(new THREE.LineCurve3(new THREE.Vector3(0, 0, 4), new THREE.Vector3(0, 0, -1.5)));
    curve.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, -1.5), new THREE.Vector3(0, 0, -2.5), new THREE.Vector3(0, 1, -2.5)));
    curve.add(new THREE.LineCurve3(new THREE.Vector3(0, 1, -2.5), new THREE.Vector3(0, 6, -2.5)));
    const pts = curve.getSpacedPoints(80);
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    const idx: number[] = [];
    pts.forEach((p) => {
      pos.push(-8, p.y, p.z, 8, p.y, p.z);
    });
    for (let i = 0; i < pts.length - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[0, floorY, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
  );
}
