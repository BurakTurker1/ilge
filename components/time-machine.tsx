"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepBack, StepForward } from "lucide-react";
import { timeline } from "@/lib/data";

export function TimeMachine() {
  const [year, setYear] = useState(1071);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((value) => (value >= 2026 ? -500 : value + 10));
    }, 320);
    return () => window.clearInterval(timer);
  }, [playing]);

  const active = useMemo(() => {
    return [...timeline].reverse().find((event) => event.year <= year) ?? timeline[0];
  }, [year]);

  return (
    <section className="border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Zaman Makinesi</p>
          <h2 className="mt-2 font-display text-4xl text-white">{year}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="Geri" onClick={() => setYear((value) => Math.max(-500, value - 25))} className="icon-button">
            <StepBack className="h-4 w-4" />
          </button>
          <button aria-label={playing ? "Durdur" : "Baslat"} onClick={() => setPlaying((value) => !value)} className="icon-button">
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button aria-label="İleri" onClick={() => setYear((value) => Math.min(2026, value + 25))} className="icon-button">
            <StepForward className="h-4 w-4" />
          </button>
          <button aria-label="1071'e don" onClick={() => setYear(1071)} className="icon-button">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <input
        type="range"
        min={-500}
        max={2026}
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
        className="mt-5 w-full accent-brass"
      />
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_2fr]">
        <div className="border border-white/10 bg-ink/60 p-3">
          <p className="text-xs text-white/40">Aktif olay</p>
          <h3 className="mt-1 font-display text-2xl text-atlas">{active.title}</h3>
        </div>
        <p className="border border-white/10 bg-ink/60 p-3 text-sm leading-6 text-white/62">{active.summary}</p>
      </div>
    </section>
  );
}
