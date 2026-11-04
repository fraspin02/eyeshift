"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KF_DESKTOP, KF_MOBILE, intro, pointer, resetHomeRig, rig, useHomeUI, type Keyframe } from "@/lib/home/rig";
import { useLook } from "@/lib/store";
import { useReducedMotionPref } from "@/lib/hooks/useDeviceTier";
import type { EyeAnimationId, EyePresetId, LedColorId } from "@/lib/data/eyes";
import { SceneCanvas } from "@/components/three/SceneCanvas";
import { HeroSection } from "./HeroSection";
import { ChangeEyesSection, ChooseColorSection, ControlSection, DetailsSection, FinalSection } from "./StorySections";
import { NightSection } from "./NightSection";
import { CollectionSection } from "./CollectionSection";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), { ssr: false });

gsap.registerPlugin(ScrollTrigger);
// headless capture (asset renders / QA) runs at very low fps: disable lag smoothing there
if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture")) gsap.ticker.lagSmoothing(0);

/** Scene 02 demo sequence — scroll cycles through these until the user picks one. */
const EYE_DEMO: { preset: EyePresetId; led: LedColorId; animation: EyeAnimationId }[] = [
  { preset: "predator", led: "red", animation: "blink" },
  { preset: "cyber", led: "cyan", animation: "scan" },
  { preset: "phantom", led: "violet", animation: "pulse" },
  { preset: "ghost", led: "white", animation: "blink" },
  { preset: "glitch", led: "red", animation: "glitch" },
];

export function ScrollExperience() {
  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPref();
  const paused = useHomeUI((s) => s.paused);
  const [controlActive, setControlActive] = useState(false);
  const userPicked = useRef(false);

  // ── Awakening intro ────────────────────────────────────────────
  useLayoutEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    resetHomeRig((mobile ? KF_MOBILE : KF_DESKTOP).hero);
    const ctx = gsap.context(() => {
      if (reduced) {
        Object.assign(intro, { cz: 0, ry: 0, light: 1, power: 1, strip: 1, done: true });
        gsap.set(".hero-line", { yPercent: 0 });
        gsap.set(".hero-reveal", { autoAlpha: 1 });
        return;
      }
      gsap.set(".hero-line", { yPercent: 110 });
      gsap.set(".hero-reveal", { autoAlpha: 0, y: 16 });
      const tl = gsap.timeline({ delay: 0.5, onComplete: () => void (intro.done = true) });
      tl.to(intro, { strip: 1, duration: 0.7, ease: "power2.in" }) // 1. the thin red line ignites
        .to(intro, { power: 1, duration: 1.3, ease: "power1.inOut" }, "+=0.15") // 2. LED eyes wake up
        .to(intro, { light: 1, duration: 2, ease: "power2.out" }, "-=0.6") // 3. light reveals the shell
        .to(intro, { ry: 0, duration: 2.4, ease: "expo.inOut" }, "-=1.8") // 4. slight rotation
        .to(intro, { cz: 0, duration: 2.6, ease: "expo.inOut" }, "<") // 5. camera pulls back
        .to(".hero-line", { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, "-=1.2") // 6. headline
        .to(".hero-reveal", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, "-=0.9");
      // never block navigation: scrolling fast-forwards the awakening
      const skip = () => {
        if (window.scrollY > 40 && tl.progress() < 1) tl.timeScale(6);
      };
      window.addEventListener("scroll", skip, { passive: true });
      return () => window.removeEventListener("scroll", skip);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // ── Scroll choreography ────────────────────────────────────────
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const setOverride = useLook.getState().setOverride;
    mm.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" }, (c) => {
      const KF = c.conditions?.mobile ? KF_MOBILE : KF_DESKTOP;
      const scrub = reduced ? true : 1;
      const seg = (trigger: string, start: string, end: string, from: Keyframe, to: Keyframe, ease = "power2.inOut", endTrigger?: string) =>
        gsap.fromTo(rig, { ...from }, { ...to, ease, immediateRender: false, scrollTrigger: { trigger, start, end, scrub, endTrigger } });

      seg("#s-eyes", "top bottom", "top top", KF.hero, KF.eyes);
      seg("#s-color", "top bottom", "top top", KF.eyes, KF.color);
      seg("#s-details", "top bottom", "top top", KF.color, KF.detailsA);
      seg("#s-details", "top top", "bottom bottom", KF.detailsA, KF.detailsB, "none");
      seg("#s-control", "top bottom", "top top", KF.detailsB, KF.control);
      seg("#s-night", "top top", "bottom top", KF.control, KF.finalA, "none", "#s-collection");
      seg("#s-final", "top bottom", "bottom bottom", KF.finalA, KF.finalB, "power1.inOut");

      // Scene 02: eyes cycle through expressions while scrolling
      ScrollTrigger.create({
        trigger: "#s-eyes",
        start: "top 40%",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (userPicked.current) return;
          const i = Math.min(EYE_DEMO.length - 1, Math.floor(self.progress * EYE_DEMO.length));
          const cur = useLook.getState().override;
          const d = EYE_DEMO[i];
          if (cur?.preset !== d.preset) setOverride({ ...d });
        },
        onLeave: () => !userPicked.current && setOverride(null),
        onLeaveBack: () => !userPicked.current && setOverride(null),
      });

      // Scene 04: hotspots
      ScrollTrigger.create({
        trigger: "#s-details",
        start: "top 30%",
        end: "bottom 70%",
        onToggle: (self) => useHomeUI.getState().setHotspots(self.isActive),
      });

      // Scene 05: graphite background + phone demo
      gsap.fromTo(
        backdrop.current,
        { backgroundColor: "#08090D" },
        { backgroundColor: "#171A21", ease: "none", immediateRender: false, scrollTrigger: { trigger: "#s-control", start: "top 70%", end: "top top", scrub: true } }
      );
      gsap.fromTo(
        backdrop.current,
        { backgroundColor: "#171A21" },
        { backgroundColor: "#08090D", ease: "none", immediateRender: false, scrollTrigger: { trigger: "#s-control", start: "bottom bottom", end: "bottom top", scrub: true } }
      );
      ScrollTrigger.create({ trigger: "#s-control", start: "top 40%", end: "bottom 60%", onToggle: (self) => setControlActive(self.isActive) });

      // Scenes 06–07 fully cover the canvas → pause rendering to save battery
      ScrollTrigger.create({
        trigger: "#s-night",
        start: "top top",
        endTrigger: "#s-collection",
        end: "bottom bottom",
        onToggle: (self) => useHomeUI.getState().setPaused(self.isActive),
      });

      // Scene 06: parallax layers
      if (!reduced) {
        gsap.fromTo(".night-bg", { yPercent: -4, scale: 1.08 }, { yPercent: 4, scale: 1, ease: "none", scrollTrigger: { trigger: "#s-night", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".night-fg", { yPercent: 6 }, { yPercent: -3, ease: "none", scrollTrigger: { trigger: "#s-night", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(".night-copy", { yPercent: 30 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: "#s-night", start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
    return () => {
      mm.revert();
      setOverride(null);
      useHomeUI.getState().setHotspots(false);
      useHomeUI.getState().setPaused(false);
    };
  }, [reduced]);

  // ── Pointer: parallax + gaze + drag-to-rotate ──────────────────
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const drag = useRef<{ x: number; y: number; id: number; horizontal: boolean | null } | null>(null);
  const onDown = (e: RPointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, horizontal: e.pointerType === "mouse" ? true : null };
    pointer.dragVel = 0;
  };
  const onDragMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    // touch: decide axis first so vertical swipes keep scrolling the page
    if (d.horizontal === null && Math.hypot(dx, dy) > 8) d.horizontal = Math.abs(dx) > Math.abs(dy);
    if (!d.horizontal) return;
    pointer.dragging = true;
    pointer.dragRy += dx * 0.009;
    pointer.dragVel = dx * 0.0035;
    d.x = e.clientX;
    d.y = e.clientY;
  };
  const onUp = () => {
    drag.current = null;
    pointer.dragging = false;
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") pointer.dragVel -= 0.04;
    if (e.key === "ArrowRight") pointer.dragVel += 0.04;
  };

  return (
    <div ref={root} className="relative">
      <div ref={backdrop} className="fixed inset-0 z-0 bg-obsidian" aria-hidden />
      <div
        ref={stage}
        className="fixed inset-0 z-[1] cursor-grab touch-pan-y active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onDragMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        onKeyDown={onKey}
        tabIndex={0}
        role="img"
        aria-label="Modello 3D interattivo dello zaino EYE//SHIFT Knight. Trascina o usa le frecce sinistra e destra per ruotarlo."
      >
        <SceneCanvas className="h-full w-full" camera={{ fov: 30, near: 0.05, far: 30, position: [0, 0, 1.45] }} frameloop={paused ? "never" : "always"} fallbackImage="/images/hero-16x9.jpg">
          {(tier) => <HeroScene tier={tier} reduced={reduced} />}
        </SceneCanvas>
      </div>
      <main id="main" className="pointer-events-none relative z-[2]">
        <HeroSection />
        <ChangeEyesSection onUserPick={() => (userPicked.current = true)} />
        <ChooseColorSection />
        <DetailsSection />
        <ControlSection active={controlActive} />
        <NightSection />
        <CollectionSection />
        <FinalSection />
      </main>
    </div>
  );
}
