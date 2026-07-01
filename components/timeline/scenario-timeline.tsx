"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { timeline } from "@/lib/data";

function formatYear(year: number) {
  return year < 0 ? `MÖ ${Math.abs(year)}` : String(year);
}

export function ScenarioTimeline() {
  const [year, setYear] = useState(1071);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => (current >= 2026 ? -500 : current + 12));
    }, 420);
    return () => window.clearInterval(timer);
  }, [playing]);

  const events = useMemo(() => timeline.filter((event) => event.year >= year).slice(0, 4), [year]);
  const active = [...timeline].reverse().find((event) => event.year <= year) ?? timeline[0];

  return (
    <section className="border border-white/10 bg-ink/72 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brass">Senaryo modu</p>
          <h2 className="mt-2 font-display text-3xl text-white">{formatYear(year)}</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying((value) => !value)} className="icon-button" aria-label={playing ? "Durdur" : "Oynat"}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setYear(1071)} className="icon-button" aria-label="1071'e dön">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <input type="range" min={-500} max={2026} value={year} onChange={(event) => setYear(Number(event.target.value))} className="mt-5 w-full accent-brass" />
      <div className="mt-4 border border-white/10 bg-white/[0.035] p-3">
        <p className="text-xs text-white/40">Aktif sahne</p>
        <h3 className="mt-1 font-display text-2xl text-atlas">{active.title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/58">{active.summary}</p>
      </div>
      <div className="mt-4 grid gap-2">
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-[72px_1fr] gap-3 border border-white/10 bg-white/[0.025] p-2 text-sm">
            <span className="text-atlas">{formatYear(event.year)}</span>
            <span className="text-white/62">{event.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

