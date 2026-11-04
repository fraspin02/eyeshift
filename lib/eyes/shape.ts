/**
 * Shared 2D definition of the faceted front mask (metres, front view, x → right, y → up).
 * Right half is authored by hand, the left half is mirrored.
 * The same eye polygon drives the 3D geometry AND the LED matrix mask, so the
 * graphics drawn by the eye engine always sit exactly inside the physical display.
 */

export type P3 = [number, number, number];
export type P2 = [number, number];

/** Outline of the shell (right half, top centre → bottom centre). z = rim height. */
export const OUTLINE_RIGHT: P3[] = [
  [0, 0.25, 0.012],
  [0.072, 0.244, 0.012],
  [0.138, 0.222, 0.012],
  [0.176, 0.17, 0.012],
  [0.184, 0.075, 0.012],
  [0.18, -0.04, 0.012],
  [0.168, -0.135, 0.012],
  [0.136, -0.205, 0.012],
  [0.078, -0.24, 0.012],
  [0, -0.252, 0.012],
];

/** Interior relief points (right half incl. centre ridge). */
export const RELIEF_RIGHT: P3[] = [
  // centre ridge (x = 0)
  [0, 0.222, 0.05],
  [0, 0.128, 0.084],
  [0, 0.058, 0.094],
  [0, -0.035, 0.104],
  [0, -0.118, 0.088],
  [0, -0.19, 0.066],
  // forehead plates
  [0.012, 0.222, 0.05],
  [0.012, 0.13, 0.084],
  [0.064, 0.204, 0.054],
  [0.126, 0.18, 0.042],
  [0.162, 0.12, 0.03],
  // brow
  [0.06, 0.118, 0.079],
  [0.148, 0.128, 0.044],
  // temple / cheek
  [0.168, 0.05, 0.034],
  [0.162, -0.02, 0.042],
  [0.064, -0.034, 0.088],
  [0.128, -0.048, 0.062],
  // jaw
  [0.05, -0.122, 0.078],
  [0.108, -0.112, 0.058],
  [0.146, -0.108, 0.04],
  [0.1, -0.176, 0.052],
  [0.046, -0.206, 0.056],
];

/** Eye display polygon (right eye), counter-clockwise starting at inner-top. */
export const EYE_RIGHT: P3[] = [
  [0.02, 0.064, 0.09],
  [0.138, 0.114, 0.05],
  [0.153, 0.076, 0.046],
  [0.124, 0.02, 0.062],
  [0.032, 0.008, 0.094],
];

/** Constrained crease lines (indices refer to the combined right-half point list built in geometry). */
export const EYE_BOUNDS = (() => {
  const xs = EYE_RIGHT.map((p) => p[0]);
  const ys = EYE_RIGHT.map((p) => p[1]);
  const xmin = Math.min(...xs);
  const xmax = Math.max(...xs);
  const ymin = Math.min(...ys);
  const ymax = Math.max(...ys);
  return { xmin, xmax, ymin, ymax, w: xmax - xmin, h: ymax - ymin };
})();

/** Eye polygon in normalised eye space (u: inner→outer 0..1, v: bottom→top 0..1). */
export const EYE_POLY_UV: P2[] = EYE_RIGHT.map(([x, y]) => [
  (x - EYE_BOUNDS.xmin) / EYE_BOUNDS.w,
  (y - EYE_BOUNDS.ymin) / EYE_BOUNDS.h,
]);

/** Aspect of the eye (width / height) — used for isotropic drawing space. */
export const EYE_ASPECT = EYE_BOUNDS.w / EYE_BOUNDS.h;

/** Eye polygon in isotropic space: X = u * aspect, Y = v. */
export const EYE_POLY_ISO: P2[] = EYE_POLY_UV.map(([u, v]) => [u * EYE_ASPECT, v]);

/** Vertical LED strip on the forehead ridge (y range, centre x = 0). */
export const STRIP = { yTop: 0.212, yBottom: 0.138, width: 0.009 };

export function pointInPolygon(x: number, y: number, poly: P2[] | P3[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Signed distance to polygon (negative inside). */
export function sdPolygon(x: number, y: number, poly: P2[]): number {
  let d = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const ax = poly[j][0];
    const ay = poly[j][1];
    const bx = poly[i][0];
    const by = poly[i][1];
    const ex = bx - ax;
    const ey = by - ay;
    const wx = x - ax;
    const wy = y - ay;
    const t = Math.max(0, Math.min(1, (wx * ex + wy * ey) / (ex * ex + ey * ey)));
    const dx = wx - ex * t;
    const dy = wy - ey * t;
    d = Math.min(d, Math.hypot(dx, dy));
  }
  return pointInPolygon(x, y, poly) ? -d : d;
}
