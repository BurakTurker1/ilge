import { BattleAnimation } from "@/components/animations/battle-animation";
import { ClientHistoryMap } from "@/components/client-history-map";
import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { wars } from "@/lib/data";

export default function WarsPage() {
  return (
    <PageShell title="Savaşlar" description="Taraflar, komutanlar, sonuç ve harita üzerindeki ordu hareketleriyle savaş arşivi.">
      <div className="mb-5">
        <ClientHistoryMap year={1071} mode="wars" />
      </div>
      <div className="mb-5">
        <BattleAnimation />
      </div>
      <RevealGrid>
        {wars.map((war) => (
          <RevealItem key={war.id}>
            <ModuleCard title={war.name} meta={String(war.year)} description={war.summary}>
              <div className="grid gap-2">
                <span>Taraflar: {war.sides.join(" / ")}</span>
                <span>Komutanlar: {war.commanders.join(", ")}</span>
                <span>Sonuc: {war.result}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
