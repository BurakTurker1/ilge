import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { cities } from "@/lib/data";

export default function CitiesPage() {
  return (
    <PageShell title="Sehirler" description="Tarihi sehirlerin eski adlari, bagli olduklari devletler ve onemli olaylari.">
      <RevealGrid>
        {cities.map((city) => (
          <RevealItem key={city.id}>
            <ModuleCard title={city.name} meta={city.oldNames.join(", ")} description={city.summary}>
              <div className="grid gap-2">
                <span>Devletler: {city.states.join(", ")}</span>
                <span>Olaylar: {city.events.join(" | ")}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
