import * as THREE from "three";

/** Procedural textures generated once and shared (no network, no image files). */

let carbon: THREE.CanvasTexture | null = null;
let carbonRough: THREE.CanvasTexture | null = null;
let fabric: THREE.CanvasTexture | null = null;
let shellGrain: THREE.CanvasTexture | null = null;

function tex(canvas: HTMLCanvasElement, repeat: number, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** 2×2 twill carbon weave. */
export function getCarbonTextures() {
  if (carbon && carbonRough) return { map: carbon, roughnessMap: carbonRough };
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const r = document.createElement("canvas");
  r.width = r.height = S;
  const rg = r.getContext("2d")!;
  const n = 8;
  const cell = S / n;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const horizontal = (x + y) % 4 < 2;
      const grad = horizontal
        ? g.createLinearGradient(x * cell, y * cell, x * cell, (y + 1) * cell)
        : g.createLinearGradient(x * cell, y * cell, (x + 1) * cell, y * cell);
      grad.addColorStop(0, "#202227");
      grad.addColorStop(0.5, "#5a5e68");
      grad.addColorStop(1, "#1b1d22");
      g.fillStyle = grad;
      g.fillRect(x * cell, y * cell, cell, cell);
      rg.fillStyle = horizontal ? "#6a6a6a" : "#9a9a9a";
      rg.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  carbon = tex(c, 6);
  carbonRough = tex(r, 6, false);
  return { map: carbon, roughnessMap: carbonRough };
}

/** Subtle micro-grain used as roughness variation on the plastic shell. */
export function getShellGrain() {
  if (shellGrain) return shellGrain;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const img = g.createImageData(S, S);
  for (let i = 0; i < S * S; i++) {
    const v = 205 + Math.random() * 30;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  shellGrain = tex(c, 3, false);
  return shellGrain;
}

/** Ripstop-like woven fabric used as bump map on the soft body and straps. */
export function getFabricBump() {
  if (fabric) return fabric;
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < S; i += 4) {
    g.fillStyle = i % 8 === 0 ? "#9a9a9a" : "#6e6e6e";
    g.fillRect(0, i, S, 2);
    g.fillStyle = i % 8 === 0 ? "rgba(160,160,160,0.5)" : "rgba(100,100,100,0.5)";
    g.fillRect(i, 0, 2, S);
  }
  g.strokeStyle = "rgba(200,200,200,0.35)";
  g.lineWidth = 1.5;
  for (let i = 0; i < S; i += 32) {
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(S, i);
    g.moveTo(i, 0);
    g.lineTo(i, S);
    g.stroke();
  }
  fabric = tex(c, 4, false);
  return fabric;
}
