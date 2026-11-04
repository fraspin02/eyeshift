"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SHOTS, SHOT_BY_ID, type Shot } from "@/lib/render/shots";

const RenderStudio = dynamic(() => import("@/components/three/render/RenderStudio"), { ssr: false });

export function StudioClient() {
  const [shot, setShot] = useState<Shot | null>(null);
  const [list, setList] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("shot");
    if (id && SHOT_BY_ID[id]) setShot(SHOT_BY_ID[id]);
    else setList(true);
  }, []);
  if (shot) return <RenderStudio shot={shot} />;
  if (!list) return null;
  return (
    <main className="p-8">
      <h1 className="font-grotesk text-xl">Render studio — {SHOTS.length} asset</h1>
      <ul className="mt-4 grid gap-1 text-sm">
        {SHOTS.map((s) => (
          <li key={s.id}>
            <a className="text-cyan underline" href={`?shot=${s.id}`}>
              {s.id}
            </a>{" "}
            <span className="text-ice/50">
              {s.w}×{s.h}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
