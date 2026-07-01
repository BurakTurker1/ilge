import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { treaties } from "@/lib/data";

export default function TreatiesPage() {
  return (
    <PageShell title="Anlaşmalar" description="Diplomatik kırılmalar, taraflar, sonuçlar ve uzun vadeli etkiler.">
      <RevealGrid>
        {treaties.map((treaty) => (
          <RevealItem key={treaty.id}>
            <ModuleCard title={treaty.name} meta={String(treaty.year)} description={treaty.result}>
              <div className="grid gap-2">
                <span>Taraflar: {treaty.parties.join(", ")}</span>
                <span>Etkiler: {treaty.effects.join(" | ")}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}

