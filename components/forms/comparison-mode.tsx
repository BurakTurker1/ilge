"use client";

import { useMemo, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { states, wars } from "@/lib/data";

export function ComparisonMode() {
  const [leftId, setLeftId] = useState(states[4]?.id ?? states[0]?.id);
  const [rightId, setRightId] = useState(states[5]?.id ?? states[1]?.id);

  const left = states.find((state) => state.id === leftId) ?? states[0];
  const right = states.find((state) => state.id === rightId) ?? states[1];

  const rows = useMemo(() => {
    const leftDuration = (left.dissolved ?? 2026) - left.founded;
    const rightDuration = (right.dissolved ?? 2026) - right.founded;
    const warCount = (name: string) => wars.filter((war) => war.sides.some((side) => name.includes(side) || side.includes(name))).length;

    return [
      ["Yaşam süresi", `${leftDuration} yıl`, `${rightDuration} yıl`],
      ["Başkent", left.capital, right.capital],
      ["Savaş", String(warCount(left.name)), String(warCount(right.name))],
      ["Hükümdarlar", String(left.rulers.length), String(right.rulers.length)],
      ["Önemli olaylar", String(left.events.length), String(right.events.length)]
    ];
  }, [left, right]);

  return (
    <section className="border border-white/10 bg-ink/72 p-5">
      <div className="mb-4 flex items-center gap-2 text-atlas">
        <GitCompareArrows className="h-5 w-5" />
        <h2 className="font-display text-2xl text-white">Karşılaştırma modu</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <select value={leftId} onChange={(event) => setLeftId(event.target.value)} className="h-12 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
          {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
        </select>
        <select value={rightId} onChange={(event) => setRightId(event.target.value)} className="h-12 border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
          {states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}
        </select>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <tbody>
            {rows.map(([label, leftValue, rightValue]) => (
              <tr key={label} className="border-b border-white/10">
                <th className="py-3 text-left font-medium text-white/50">{label}</th>
                <td className="px-3 py-3 text-atlas">{leftValue}</td>
                <td className="px-3 py-3 text-atlas">{rightValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

