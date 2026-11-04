declare module "cdt2d" {
  type Pt = [number, number];
  export default function cdt2d(
    points: Pt[],
    edges?: [number, number][],
    options?: { delaunay?: boolean; interior?: boolean; exterior?: boolean; infinity?: boolean }
  ): [number, number, number][];
}
