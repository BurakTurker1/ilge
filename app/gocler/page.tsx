import { MigrationAnimation } from "@/components/animations/migration-animation";
import { ClientHistoryMap } from "@/components/client-history-map";
import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { migrations } from "@/lib/data";

export default function MigrationsPage() {
  return (
    <PageShell title="Göçler" description="Orta Asya'dan Anadolu'ya uzanan hareketleri rota çizgileri, tarih aralıkları ve etkileriyle izle.">
      <div className="mb-5">
        <ClientHistoryMap mode="migrations" />
      </div>
      <div className="mb-5">
        <MigrationAnimation />
      </div>
      <RevealGrid>
        {migrations.map((migration) => (
          <RevealItem key={migration.id}>
            <ModuleCard title={migration.name} meta={`${migration.startYear}-${migration.endYear}`} description={migration.result} accent="#3aa6a1">
              <div className="grid gap-2">
                <span>Baslangic: {migration.origin}</span>
                <span>Varis: {migration.destination}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
