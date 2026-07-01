"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { allSearchItems } from "@/lib/data";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("tr-TR");
    if (!normalized) return allSearchItems.slice(0, 5);

    return allSearchItems
      .filter((item) => `${item.title} ${item.text} ${item.type}`.toLocaleLowerCase("tr-TR").includes(normalized))
      .slice(0, 8);
  }, [query]);

  return (
    <section className="border border-white/10 bg-ink/70 p-4 backdrop-blur">
      <label className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-3 py-3">
        <Search className="h-5 w-5 text-brass" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Selcuklu, Malazgirt, Kut, Istanbul..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
      </label>
      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {results.map((item) => (
          <div key={`${item.type}-${item.id}`} className="border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-1 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <span className="rounded bg-brass/15 px-2 py-1 text-xs text-atlas">{item.type}</span>
            </div>
            <p className="line-clamp-2 text-xs leading-5 text-white/55">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
