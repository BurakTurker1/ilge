"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { migrations } from "@/lib/data";

export function MigrationAnimation() {
  const [selectedId, setSelectedId] = useState(migrations[0]?.id);
  const [replayKey, setReplayKey] = useState(0);
  const migration = migrations.find((item) => item.id === selectedId) ?? migrations[0];

  if (!migration) return null;

  return (
    <section className="border border-white/10 bg-ink/72 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Göç animasyonu</p>
          <h2 className="mt-2 font-display text-3xl text-white">{migration.name}</h2>
        </div>
        <div className="flex gap-2">
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="h-10 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
            {migrations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <button type="button" onClick={() => setReplayKey((key) => key + 1)} className="icon-button" aria-label="Oynat">
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-5 border border-white/10 bg-white/[0.03] p-4">
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
          <div className="border border-turquoise/40 bg-turquoise/10 p-3 text-center text-sm text-white/70">{migration.origin}</div>
          <div className="relative h-16 overflow-hidden">
            <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-turquoise/50" />
            <div key={replayKey} className="absolute top-1/2 h-3 w-14 -translate-y-1/2 bg-brass motion-safe:animate-[routeReplay_2.4s_ease-in-out]" />
          </div>
          <div className="border border-brass/40 bg-brass/10 p-3 text-center text-sm text-white/70">{migration.destination}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/62">
        <span className="border border-white/10 bg-white/[0.03] px-3 py-2">{migration.startYear}-{migration.endYear}</span>
        <span>{migration.result}</span>
      </div>
      <button type="button" onClick={() => setReplayKey((key) => key + 1)} className="mt-4 inline-flex items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 hover:border-brass/50">
        <RotateCcw className="h-4 w-4" />
        Replay
      </button>
    </section>
  );
}

