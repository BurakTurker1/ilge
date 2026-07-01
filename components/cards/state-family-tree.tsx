import { states } from "@/lib/data";

const lineage = ["gokturk", "karahanli", "buyuk-selcuklu", "osmanli", "turkiye"];

export function StateFamilyTree() {
  const items = lineage.map((id) => states.find((state) => state.id === id)).filter(Boolean);

  return (
    <section className="border border-white/10 bg-white/[0.035] p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">Devlet soy ağı</p>
      <h2 className="mt-2 font-display text-3xl text-white">Siyasi süreklilik hattı</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {items.map((state, index) => (
          <div key={state!.id} className="relative border border-white/10 bg-ink/65 p-4">
            <div className="mb-3 h-1 w-14" style={{ backgroundColor: state!.color }} />
            <h3 className="font-display text-xl text-white">{state!.name}</h3>
            <p className="mt-2 text-xs text-white/50">
              {state!.founded}-{state!.dissolved ?? "günümüz"}
            </p>
            {index < items.length - 1 ? <div className="absolute -bottom-3 left-1/2 h-6 w-px bg-brass/60 md:-right-3 md:bottom-auto md:left-auto md:top-1/2 md:h-px md:w-6" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

