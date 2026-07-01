"use client";

import { useEffect, useMemo, useState } from "react";
import { GitCompareArrows, Layers3, Pause, Play, RotateCcw, Search, Sparkles } from "lucide-react";
import { migrations, states, timeline, wars } from "@/lib/data";

type Layers = {
  states: boolean;
  wars: boolean;
  migrations: boolean;
  trade: boolean;
};

const layerLabels: Record<keyof Layers, string> = {
  states: "devlet katmani",
  wars: "savas katmani",
  migrations: "goc katmani",
  trade: "ticaret yolu katmani"
};

export function HistorySimulationPanel() {
  const [year, setYear] = useState(1071);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState("1071 ne oldu?");
  const [layers, setLayers] = useState<Layers>({ states: true, wars: true, migrations: true, trade: false });
  const [leftState, setLeftState] = useState(states[4]?.id ?? states[0]?.id);
  const [rightState, setRightState] = useState(states[5]?.id ?? states[1]?.id);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setYear((current) => (current >= 1923 ? 552 : current + 5));
    }, 260);
    return () => window.clearInterval(timer);
  }, [playing]);

  const visibleStates = useMemo(() => states.filter((state) => state.founded <= year && (!state.dissolved || state.dissolved >= year)), [year]);
  const activeWars = useMemo(() => wars.filter((war) => Math.abs(war.year - year) <= 15), [year]);
  const activeMigrations = useMemo(() => migrations.filter((migration) => migration.startYear <= year && migration.endYear >= year), [year]);
  const selectedEvent = useMemo(() => [...timeline].reverse().find((event) => event.year <= year) ?? timeline[0], [year]);
  const searchResults = useMemo(() => {
    const queryYear = query.match(/\d{3,4}/)?.[0];
    const targetYear = queryYear ? Number(queryYear) : year;
    return {
      wars: wars.filter((war) => Math.abs(war.year - targetYear) <= 20),
      states: states.filter((state) => state.founded <= targetYear && (!state.dissolved || state.dissolved >= targetYear)),
      events: timeline.filter((event) => Math.abs(event.year - targetYear) <= 20)
    };
  }, [query, year]);

  const left = states.find((state) => state.id === leftState) ?? states[0];
  const right = states.find((state) => state.id === rightState) ?? states[1];
  const leftDuration = (left?.dissolved ?? 2026) - (left?.founded ?? 0);
  const rightDuration = (right?.dissolved ?? 2026) - (right?.founded ?? 0);

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Tarih Simulasyonu</p>
          <h2 className="mt-2 font-display text-3xl text-white">Canli Tarih Simulasyonu</h2>
          <p className="mt-2 text-sm text-white/55">Yil degistikce devlet, savas, goc ve ticaret katmanlari filtrelenir; olay akisi harita icin hazir veri uretir.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPlaying((value) => !value)} className="icon-button" aria-label={playing ? "Durdur" : "Oynat"}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => setYear(1071)} className="icon-button" aria-label="1071'e don">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="grid gap-4">
          <div className="border border-white/10 bg-ink/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.22em] text-white/42">Aktif yil</span>
              <span className="font-display text-4xl text-atlas">{year}</span>
            </div>
            <input type="range" min={552} max={1923} value={year} onChange={(event) => setYear(Number(event.target.value))} className="w-full accent-brass" />
            <div className="mt-4 border border-white/10 bg-white/[0.03] p-3">
              <p className="flex items-center gap-2 font-semibold text-white"><Sparkles className="h-4 w-4 text-atlas" />{selectedEvent.title}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{selectedEvent.summary}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="Gorunen devlet" value={layers.states ? visibleStates.length : 0} />
            <Metric label="Aktif savas" value={layers.wars ? activeWars.length : 0} />
            <Metric label="Aktif goc" value={layers.migrations ? activeMigrations.length : 0} />
          </div>
        </div>

        <aside className="grid content-start gap-4">
          <div className="border border-white/10 bg-ink/60 p-4">
            <p className="mb-3 flex items-center gap-2 text-atlas"><Layers3 className="h-4 w-4" />Katman sistemi</p>
            {Object.entries(layers).map(([key, enabled]) => (
              <label key={key} className="mb-2 flex items-center justify-between border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/62">
                {layerLabels[key as keyof Layers]}
                <input type="checkbox" checked={enabled} onChange={(event) => setLayers((current) => ({ ...current, [key]: event.target.checked }))} className="accent-brass" />
              </label>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="border border-white/10 bg-ink/60 p-4">
          <p className="mb-3 flex items-center gap-2 text-atlas"><Search className="h-4 w-4" />Akilli arama</p>
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-brass/60" />
          <p className="mt-3 text-sm leading-6 text-white/58">
            {searchResults.events[0]?.title ?? "Yakin olay bulunamadi."} {searchResults.wars[0] ? `Ilgili savas: ${searchResults.wars[0].name}.` : ""}
          </p>
          <p className="mt-2 text-xs text-white/42">Harita odağı: {searchResults.wars[0] ? `${searchResults.wars[0].location.lat}, ${searchResults.wars[0].location.lng}` : searchResults.states[0]?.capital ?? "yok"}</p>
        </div>

        <div className="border border-white/10 bg-ink/60 p-4">
          <p className="mb-3 flex items-center gap-2 text-atlas"><GitCompareArrows className="h-4 w-4" />Karsilastirma modu</p>
          <div className="grid gap-3 md:grid-cols-2">
            <select value={leftState} onChange={(event) => setLeftState(event.target.value)} className="h-11 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
              {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
            </select>
            <select value={rightState} onChange={(event) => setRightState(event.target.value)} className="h-11 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
              {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
            </select>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Metric label="Sure farki" value={Math.abs(leftDuration - rightDuration)} />
            <Metric label="Sol savas" value={wars.filter((war) => war.sides.some((side) => left?.name.includes(side))).length} />
            <Metric label="Sag savas" value={wars.filter((war) => war.sides.some((side) => right?.name.includes(side))).length} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-white/42">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-atlas">{value}</p>
    </div>
  );
}
