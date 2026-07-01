import { ArrowRight, CalendarDays, MapPinned, Sparkles } from "lucide-react";
import Link from "next/link";
import { ClientHistoryMap } from "@/components/client-history-map";
import { ModuleCard } from "@/components/module-card";
import { SearchPanel } from "@/components/search-panel";
import { TimeMachine } from "@/components/time-machine";
import { states, timeline } from "@/lib/data";

export default function Home() {
  const featured = timeline.filter((event) => [552, 1071, 1453, 1923].includes(event.year));

  return (
    <main className="min-h-screen pb-28 lg:ml-72 lg:pb-0">
      <section className="grid min-h-screen gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div className="flex flex-col justify-between gap-8 py-4">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 border border-brass/35 bg-brass/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-atlas">
              <Sparkles className="h-4 w-4" />
              Türk tarihi zaman makinesi
            </p>
            <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl xl:text-7xl">İLGE</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/66">
              Ansiklopedi, tarih atlası ve interaktif zaman çizgisini birleştiren modern Türk tarihi uygulaması. Devletleri,
              savaşları, göçleri, anlaşmaları, şehirleri ve kavramları tek bir tarih katmanında keşfet.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/harita" className="inline-flex items-center gap-2 bg-brass px-4 py-3 text-sm font-semibold text-ink transition hover:bg-atlas">
                Haritayı aç
                <MapPinned className="h-4 w-4" />
              </Link>
              <Link href="/zaman" className="inline-flex items-center gap-2 border border-white/12 px-4 py-3 text-sm font-semibold text-white transition hover:border-brass/50 hover:text-atlas">
                Zaman çizgisi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.035] p-4">
              <p className="text-3xl font-semibold text-atlas">10+</p>
              <p className="text-sm text-white/55">modül yapısı</p>
            </div>
            <div className="border border-white/10 bg-white/[0.035] p-4">
              <p className="text-3xl font-semibold text-atlas">552</p>
              <p className="text-sm text-white/55">başlangıç yılı</p>
            </div>
            <div className="border border-white/10 bg-white/[0.035] p-4">
              <p className="text-3xl font-semibold text-atlas">Harita</p>
              <p className="text-sm text-white/55">hazir mimari</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:py-4">
          <ClientHistoryMap year={1071} mode="all" />
          <div className="grid gap-4 xl:grid-cols-2">
            <TimeMachine />
            <SearchPanel />
          </div>
        </div>
      </section>
      <section className="px-4 pb-10 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((event) => (
            <ModuleCard key={event.id} title={event.title} meta={String(event.year)} description={event.summary}>
              <span className="inline-flex items-center gap-2 text-atlas">
                <CalendarDays className="h-4 w-4" />
                {event.type}
              </span>
            </ModuleCard>
          ))}
        </div>
        <div className="mx-auto mt-4 max-w-7xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="font-display text-2xl text-white">Türk devletleri zaman akışı</h2>
          <div className="mt-4 grid gap-3">
            {states.map((state) => (
              <div key={state.id} className="grid gap-2 md:grid-cols-[180px_1fr_90px] md:items-center">
                <span className="text-sm text-white/55">{state.name}</span>
                <div className="h-3 border border-white/10 bg-white/[0.04]">
                  <div
                    className="h-full"
                    style={{
                      marginLeft: `${Math.max(0, ((state.founded - 552) / (1923 - 552)) * 100)}%`,
                      width: `${Math.max(4, (((state.dissolved ?? 2026) - state.founded) / (2026 - 552)) * 100)}%`,
                      backgroundColor: state.color
                    }}
                  />
                </div>
                <span className="text-xs text-white/45">
                  {state.founded}-{state.dissolved ?? "gunumuz"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
