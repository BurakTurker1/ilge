import { StateFamilyTree } from "@/components/cards/state-family-tree";
import { ComparisonMode } from "@/components/forms/comparison-mode";
import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { states } from "@/lib/data";

export default function StatesPage() {
  return (
    <PageShell title="Devletler" description="Türk devletlerinin kuruluş, yıkılış, hükümdar, başkent, kültür, ordu ve ekonomi bilgileri.">
      <div className="mb-5 grid gap-5">
        <StateFamilyTree />
        <ComparisonMode />
      </div>
      <RevealGrid>
        {states.map((state) => (
          <RevealItem key={state.id}>
            <ModuleCard title={state.name} meta={`${state.founded}-${state.dissolved ?? "gunumuz"}`} description={state.summary} accent={state.color}>
              <div className="grid gap-2">
                <span>Kurucu: {state.founder}</span>
                <span>Baskent: {state.capital}</span>
                <span>Ordu: {state.army}</span>
                <span>Kultur: {state.culture}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
