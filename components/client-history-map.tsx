"use client";

import dynamic from "next/dynamic";

export const ClientHistoryMap = dynamic(() => import("./history-map").then((module) => module.HistoryMap), {
  ssr: false,
  loading: () => <div className="grid min-h-[520px] place-items-center border border-white/10 bg-ink text-white/50">Harita yukleniyor...</div>
});
