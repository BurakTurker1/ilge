"use client";

import { useState } from "react";
import { Play, RotateCcw, Swords } from "lucide-react";
import { wars } from "@/lib/data";

export function BattleAnimation() {
  const [selectedId, setSelectedId] = useState(wars[0]?.id);
  const [replayKey, setReplayKey] = useState(0);
  const war = wars.find((item) => item.id === selectedId) ?? wars[0];

  if (!war) return null;

  return (
    <section className="border border-white/10 bg-ink/72 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Savaş animasyonu</p>
          <h2 className="mt-2 font-display text-3xl text-white">{war.name}</h2>
        </div>
        <div className="flex gap-2">
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="h-10 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
            {wars.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <button type="button" onClick={() => setReplayKey((key) => key + 1)} className="icon-button" aria-label="Oynat">
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-5 overflow-hidden border border-white/10 bg-white/[0.03] p-4">
        <div className="relative h-32">
          <div className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-turquoise/60 bg-turquoise/20 text-white">
            <Swords className="h-5 w-5" />
          </div>
          <div className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-ember/60 bg-ember/20 text-white">
            <Swords className="h-5 w-5" />
          </div>
          <div className="absolute left-16 right-16 top-1/2 h-px -translate-y-1/2 bg-white/15">
            <div key={replayKey} className="h-1 w-1/3 -translate-y-1/2 bg-brass shadow-glow motion-safe:animate-[routeReplay_2.2s_ease-in-out]" />
          </div>
          <div key={`${replayKey}-impact`} className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/60 bg-brass/20 motion-safe:animate-ping" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Metric label="Taraflar" value={war.sides.join(" / ")} />
        <Metric label="Komutanlar" value={war.commanders.join(", ")} />
        <Metric label="Sonuç" value={war.result} />
      </div>
      <button type="button" onClick={() => setReplayKey((key) => key + 1)} className="mt-4 inline-flex items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 hover:border-brass/50">
        <RotateCcw className="h-4 w-4" />
        Tekrar oynat
      </button>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.025] p-3">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-sm leading-6 text-white/68">{value}</p>
    </div>
  );
}

