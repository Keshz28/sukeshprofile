"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * E2 — sound design, synthesised entirely with the Web Audio API (no assets):
 *   · ambient — two detuned low oscillators through a lowpass, breathing via a
 *     slow LFO: the hum of being somewhere very large and very empty
 *   · blips   — a short sine ping when hovering interactive elements
 *   · whoosh  — filtered noise burst on `kesh:warp`
 *
 * Off by default and only ever started from a real click, so we never fight
 * autoplay policy or ambush anyone. Preference persists in localStorage.
 */
const KEY = "kesh-sound";

export default function SoundFX() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const lastBlip = useRef(0);

  useEffect(() => {
    try {
      setOn(localStorage.getItem(KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;

    // pre-bake a second of white noise for whooshes
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseRef.current = buf;
    return ctx;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master || ambientRef.current) return;

    const bed = ctx.createGain();
    bed.gain.value = 0.055;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 320;
    bed.connect(lp).connect(master);

    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = 54;
    const o2 = ctx.createOscillator();
    o2.type = "triangle";
    o2.frequency.value = 81.5; // slight detune → slow beating
    o1.connect(bed);
    o2.connect(bed);

    // slow swell
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(bed.gain);

    o1.start();
    o2.start();
    lfo.start();

    ambientRef.current = {
      stop: () => {
        try {
          o1.stop();
          o2.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
        ambientRef.current = null;
      },
    };
  }, []);

  // toggle → start/stop the whole rig (always from a click)
  const toggle = useCallback(() => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }

    if (next) {
      const ctx = ensureCtx();
      if (!ctx) return;
      void ctx.resume();
      startAmbient();
      masterRef.current?.gain.exponentialRampToValueAtTime(
        0.5,
        ctx.currentTime + 1.2
      );
    } else {
      const ctx = ctxRef.current;
      if (ctx && masterRef.current) {
        masterRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + 0.4
        );
      }
      setTimeout(() => ambientRef.current?.stop(), 500);
    }
  }, [on, ensureCtx, startAmbient]);

  // one-shot voices
  useEffect(() => {
    if (!on) return;

    const blip = (freq: number, dur = 0.09, vol = 0.05) => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(master);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    };

    const whoosh = () => {
      const ctx = ctxRef.current;
      const master = masterRef.current;
      if (!ctx || !master || !noiseRef.current) return;
      const src = ctx.createBufferSource();
      src.buffer = noiseRef.current;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(280, ctx.currentTime);
      bp.frequency.exponentialRampToValueAtTime(2600, ctx.currentTime + 0.45);
      bp.Q.value = 1.1;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      src.connect(bp).connect(g).connect(master);
      src.start();
      src.stop(ctx.currentTime + 0.65);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest?.('a, button, [data-cursor="hover"]')) return;
      const now = performance.now();
      if (now - lastBlip.current < 90) return; // don't machine-gun
      lastBlip.current = now;
      blip(880 + Math.random() * 240);
    };
    const onClick = () => blip(520, 0.12, 0.06);

    document.addEventListener("mouseover", onOver);
    document.addEventListener("click", onClick);
    window.addEventListener("kesh:warp", whoosh);
    window.addEventListener("kesh:supernova", whoosh);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("click", onClick);
      window.removeEventListener("kesh:warp", whoosh);
      window.removeEventListener("kesh:supernova", whoosh);
    };
  }, [on]);

  // stop everything on unmount
  useEffect(
    () => () => {
      ambientRef.current?.stop();
      void ctxRef.current?.close();
    },
    []
  );

  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambient sound" : "Enable ambient sound"}
      title={on ? "Sound on" : "Sound off"}
      className="group grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-white/75 transition-colors duration-300 hover:border-white/30 hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" aria-hidden>
        <path
          d="M4 9v6h3.5L12 19V5L7.5 9H4Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {on ? (
          // radiating waves
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
            <path d="M18 7a7 7 0 0 1 0 10" />
          </g>
        ) : (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M16 10l5 4M21 10l-5 4" />
          </g>
        )}
      </svg>
    </button>
  );
}
