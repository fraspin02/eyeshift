import * as THREE from "three";
import cdt2d from "cdt2d";
import earcut from "earcut";
import { EYE_BOUNDS, EYE_RIGHT, OUTLINE_RIGHT, RELIEF_RIGHT, STRIP, pointInPolygon, type P3 } from "@/lib/eyes/shape";

/**
 * Procedural reconstruction of the Knight backpack.
 * Front shell: hand-authored relief points → constrained Delaunay → flat-shaded facets.
 * The eye displays are recessed pockets cut into the same mesh, so the LEDs are
 * physically integrated in the shell (no floating screens).
 */

export interface BackpackGeometries {
  shell: THREE.BufferGeometry;
  shellRim: THREE.BufferGeometry;
  bezel: THREE.BufferGeometry;
  eyes: THREE.BufferGeometry;
  body: THREE.BufferGeometry;
  seam: THREE.BufferGeometry;
  backPanel: THREE.BufferGeometry;
  backPads: THREE.BufferGeometry;
  strapL: THREE.BufferGeometry;
  strapR: THREE.BufferGeometry;
  handle: THREE.BufferGeometry;
  hardware: THREE.BufferGeometry;
  stripHousing: THREE.BufferGeometry;
  strip: THREE.BufferGeometry;
  /** anchors for hotspots / cameras (local space) */
  anchors: Record<string, THREE.Vector3>;
}

const mirror = (p: P3): P3 => [-p[0], p[1], p[2]];
const EYE_RECESS = 0.0075;

function fullOutline(): P3[] {
  // clockwise from top centre around the right side, back up the left side
  const right = OUTLINE_RIGHT;
  const left = OUTLINE_RIGHT.slice(1, -1)
    .map(mirror)
    .reverse();
  return [...right, ...left];
}

function pushTri(arr: number[], a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, outward?: THREE.Vector3) {
  const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
  const ref = outward ?? new THREE.Vector3(0, 0, 1);
  if (n.dot(ref) < 0) {
    arr.push(a.x, a.y, a.z, c.x, c.y, c.z, b.x, b.y, b.z);
  } else {
    arr.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  }
}

function planarUV(geo: THREE.BufferGeometry, scale = 1) {
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + 0.2) * scale * 2.5;
    uv[i * 2 + 1] = (pos.getY(i) + 0.26) * scale * 2.5;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

function fromArray(arr: number[], uvScale = 1): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
  g.computeVertexNormals(); // non-indexed → flat facets
  planarUV(g, uvScale);
  return g;
}

function buildShell() {
  const outline = fullOutline();
  const reliefLeft = RELIEF_RIGHT.filter((p) => p[0] > 0.0001).map(mirror);
  const eyeL = EYE_RIGHT.map(mirror);
  const points: P3[] = [...outline, ...RELIEF_RIGHT, ...reliefLeft, ...EYE_RIGHT, ...eyeL];

  const idx = (p: P3) => points.findIndex((q) => Math.abs(q[0] - p[0]) < 1e-6 && Math.abs(q[1] - p[1]) < 1e-6);
  const edges: [number, number][] = [];
  const loop = (poly: P3[]) => poly.forEach((p, i) => edges.push([idx(p), idx(poly[(i + 1) % poly.length])]));
  const line = (poly: P3[]) => poly.slice(0, -1).forEach((p, i) => edges.push([idx(p), idx(poly[i + 1])]));
  loop(outline);
  loop(EYE_RIGHT);
  loop(eyeL);
  // creases: centre ridge + forehead strip rails + brow + cheekbone
  const R = (x: number, y: number) => RELIEF_RIGHT.find((p) => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6)!;
  const ridge = RELIEF_RIGHT.filter((p) => p[0] === 0).sort((a, b) => b[1] - a[1]);
  line([ridge[1], ridge[2], ridge[3], ridge[4], ridge[5]]);
  const rail: P3[] = [R(0.012, 0.222), R(0.012, 0.13)];
  line(rail);
  line(rail.map(mirror));
  const brow: P3[] = [R(0.06, 0.118), R(0.148, 0.128)];
  line(brow);
  line(brow.map(mirror));
  const cheek: P3[] = [R(0.064, -0.034), R(0.128, -0.048), R(0.162, -0.02)];
  line(cheek);
  line(cheek.map(mirror));
  const jaw: P3[] = [R(0.05, -0.122), R(0.108, -0.112), R(0.146, -0.108)];
  line(jaw);
  line(jaw.map(mirror));

  const tris = cdt2d(
    points.map((p) => [p[0], p[1]] as [number, number]),
    edges.filter(([a, b]) => a >= 0 && b >= 0 && a !== b),
    { exterior: true, interior: true }
  );

  const shell: number[] = [];
  const v = (i: number) => new THREE.Vector3(points[i][0], points[i][1], points[i][2]);
  for (const [a, b, c] of tris) {
    const cx = (points[a][0] + points[b][0] + points[c][0]) / 3;
    const cy = (points[a][1] + points[b][1] + points[c][1]) / 3;
    if (!pointInPolygon(cx, cy, outline)) continue;
    if (pointInPolygon(cx, cy, EYE_RIGHT) || pointInPolygon(cx, cy, eyeL)) continue;
    pushTri(shell, v(a), v(b), v(c));
  }

  // rim: bevelled lip running around the shell, then a short skirt back to the body
  const rim: number[] = [];
  const n = outline.length;
  const ring = (scaleXY: number, z: number) =>
    outline.map((p) => new THREE.Vector3(p[0] * scaleXY, p[1] * (1 + (scaleXY - 1) * 0.8), z));
  const r0 = outline.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const r1 = ring(1.03, -0.006);
  const r2 = ring(1.03, -0.042);
  const r3 = ring(0.985, -0.048);
  for (const [A, B] of [
    [r0, r1],
    [r1, r2],
    [r2, r3],
  ] as const) {
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const mid = A[i].clone().add(A[j]).multiplyScalar(0.5);
      const out = new THREE.Vector3(mid.x, mid.y, 0).normalize().add(new THREE.Vector3(0, 0, A === r0 ? 0.3 : 0));
      pushTri(rim, A[i], A[j], B[j], out);
      pushTri(rim, A[i], B[j], B[i], out);
    }
  }

  // eye pockets
  const bezel: number[] = [];
  const eyePos: number[] = [];
  const eyeUv: number[] = [];
  const buildEye = (poly: P3[], half: 0 | 1) => {
    const surf = poly.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    // pocket floor follows a plane slightly behind the surface
    const floor = poly.map((p) => new THREE.Vector3(p[0] * 0.985, p[1], p[2] - EYE_RECESS));
    for (let i = 0; i < poly.length; i++) {
      const j = (i + 1) % poly.length;
      const c = new THREE.Vector3(
        poly.reduce((s, p) => s + p[0], 0) / poly.length,
        poly.reduce((s, p) => s + p[1], 0) / poly.length,
        0
      );
      const mid = surf[i].clone().add(surf[j]).multiplyScalar(0.5);
      const inward = c.clone().sub(new THREE.Vector3(mid.x, mid.y, 0)).normalize().add(new THREE.Vector3(0, 0, 0.2));
      pushTri(bezel, surf[i], surf[j], floor[j], inward);
      pushTri(bezel, surf[i], floor[j], floor[i], inward);
    }
    const flat = floor.flatMap((p) => [p.x, p.y]);
    const tri = earcut(flat);
    for (let k = 0; k < tri.length; k += 3) {
      const a = floor[tri[k]];
      const b = floor[tri[k + 1]];
      const c = floor[tri[k + 2]];
      const before = eyePos.length;
      pushTri(eyePos, a, b, c);
      for (let q = before; q < eyePos.length; q += 3) {
        const x = Math.abs(eyePos[q]) / 0.985;
        const y = eyePos[q + 1];
        const u = (x - EYE_BOUNDS.xmin) / EYE_BOUNDS.w;
        const vv = (y - EYE_BOUNDS.ymin) / EYE_BOUNDS.h;
        eyeUv.push(half * 0.5 + u * 0.5, vv);
      }
    }
  };
  buildEye(EYE_RIGHT, 0);
  buildEye(eyeL, 1);

  const eyes = new THREE.BufferGeometry();
  eyes.setAttribute("position", new THREE.Float32BufferAttribute(eyePos, 3));
  eyes.setAttribute("uv", new THREE.Float32BufferAttribute(eyeUv, 2));
  eyes.computeVertexNormals();

  return { shell: fromArray(shell), shellRim: fromArray(rim), bezel: fromArray(bezel), eyes, outline };
}

function outlineShape(outline: P3[], sx: number, sy: number) {
  const shape = new THREE.Shape();
  outline.forEach((p, i) => {
    const x = p[0] * sx;
    const y = p[1] * sy;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  });
  shape.closePath();
  return shape;
}

function smoothShape(outline: P3[], sx: number, sy: number, divisions = 64) {
  const pts = outline.map((p) => new THREE.Vector2(p[0] * sx, p[1] * sy));
  const curve = new THREE.SplineCurve([...pts, pts[0]]);
  return new THREE.Shape(curve.getSpacedPoints(divisions));
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function strap(side: 1 | -1) {
  const x = 0.085 * side;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(x * 0.8, 0.2, -0.19),
    new THREE.Vector3(x * 0.9, 0.24, -0.225),
    new THREE.Vector3(x, 0.19, -0.255),
    new THREE.Vector3(x * 1.1, 0.06, -0.262),
    new THREE.Vector3(x * 1.3, -0.08, -0.252),
    new THREE.Vector3(x * 1.55, -0.19, -0.222),
    new THREE.Vector3(x * 1.62, -0.225, -0.195),
  ]);
  const shape = roundedRect(0.016, 0.062, 0.006);
  const geo = new THREE.ExtrudeGeometry(shape, { steps: 64, extrudePath: curve, bevelEnabled: false });
  return geo;
}

let cache: BackpackGeometries | null = null;

export function getBackpackGeometries(): BackpackGeometries {
  if (cache) return cache;
  const { shell, shellRim, bezel, eyes, outline } = buildShell();

  // soft body behind the shell
  const bodyShape = smoothShape(outline, 0.95, 0.955);
  const body = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.018,
    bevelSegments: 6,
    curveSegments: 48,
  });
  body.translate(0, 0, -0.165);
  planarUV(body, 4);

  // zipper seam between shell and body
  const seamPts = smoothShape(outline, 0.975, 0.975)
    .getSpacedPoints(160)
    .map((p) => new THREE.Vector3(p.x, p.y, -0.052));
  const seam = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seamPts, true), 220, 0.0035, 6, true);

  // padded back panel
  const backPanel = new THREE.ExtrudeGeometry(roundedRect(0.3, 0.43, 0.07), {
    depth: 0.014,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 4,
  });
  backPanel.translate(0, -0.005, -0.2);
  const pad = new THREE.ExtrudeGeometry(roundedRect(0.1, 0.14, 0.04), {
    depth: 0.008,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.01,
    bevelSegments: 5,
  });
  const pads: THREE.BufferGeometry[] = [];
  for (const [px, py] of [
    [-0.072, 0.09],
    [0.072, 0.09],
    [-0.072, -0.09],
    [0.072, -0.09],
  ]) {
    const p = pad.clone();
    p.translate(px, py, -0.218);
    pads.push(p);
  }
  const backPads = mergeSimple(pads);

  const strapL = strap(-1);
  const strapR = strap(1);

  // top handle
  const handleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.045, 0.235, -0.12),
    new THREE.Vector3(-0.035, 0.275, -0.125),
    new THREE.Vector3(0, 0.287, -0.127),
    new THREE.Vector3(0.035, 0.275, -0.125),
    new THREE.Vector3(0.045, 0.235, -0.12),
  ]);
  const handle = new THREE.TubeGeometry(handleCurve, 48, 0.0075, 10, false);

  // hardware: buckles and adjusters near strap ends, zipper pulls
  const parts: THREE.BufferGeometry[] = [];
  const buckle = new THREE.BoxGeometry(0.05, 0.03, 0.012);
  for (const side of [1, -1]) {
    const b = buckle.clone();
    b.rotateX(-0.5);
    b.translate(0.13 * side, -0.185, -0.232);
    parts.push(b);
    const pull = new THREE.CapsuleGeometry(0.004, 0.022, 4, 8);
    pull.rotateZ(0.2 * side);
    pull.translate(0.168 * side, 0.12, -0.06);
    parts.push(pull);
  }
  const hardware = mergeSimple(parts);

  // forehead strip: dark housing + emissive bar following the ridge
  const top = new THREE.Vector3(0, STRIP.yTop, 0.052);
  const bottom = new THREE.Vector3(0, STRIP.yBottom, 0.082);
  const len = top.distanceTo(bottom);
  const housing = new THREE.BoxGeometry(STRIP.width * 2.2, len + 0.012, 0.008);
  const bar = new THREE.BoxGeometry(STRIP.width, len, 0.006);
  const angle = Math.atan2(top.z - bottom.z, top.y - bottom.y);
  const mid = top.clone().add(bottom).multiplyScalar(0.5);
  for (const [g, off] of [
    [housing, 0.0],
    [bar, 0.0032],
  ] as const) {
    g.rotateX(angle);
    g.translate(mid.x, mid.y, mid.z + off);
  }

  const anchors: Record<string, THREE.Vector3> = {
    shell: new THREE.Vector3(0.11, -0.07, 0.07),
    eyes: new THREE.Vector3(-0.09, 0.07, 0.085),
    strip: new THREE.Vector3(0, 0.19, 0.075),
    structure: new THREE.Vector3(-0.19, -0.02, -0.1),
    straps: new THREE.Vector3(0.14, -0.12, -0.24),
    handle: new THREE.Vector3(0, 0.29, -0.125),
  };

  cache = {
    shell,
    shellRim,
    bezel,
    eyes,
    body,
    seam,
    backPanel,
    backPads,
    strapL,
    strapR,
    handle,
    hardware,
    stripHousing: housing,
    strip: bar,
    anchors,
  };
  return cache;
}

/** Minimal merge for non-indexed / indexed geometries sharing position+normal (+uv). */
function mergeSimple(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const list = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  const pos: number[] = [];
  const nor: number[] = [];
  const uv: number[] = [];
  for (const g of list) {
    const p = g.getAttribute("position");
    const n = g.getAttribute("normal");
    const u = g.getAttribute("uv");
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      if (n) nor.push(n.getX(i), n.getY(i), n.getZ(i));
      uv.push(u ? u.getX(i) : 0, u ? u.getY(i) : 0);
    }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  if (nor.length === pos.length) out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  else out.computeVertexNormals();
  return out;
}
