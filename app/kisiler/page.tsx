import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { people } from "@/lib/data";

export default function PeoplePage() {
  return (
    <PageShell title="Kisiler" description="Hukumdarlar, komutanlar, dusunurler ve Turk tarihindeki onemli sahsiyetler.">
      <RevealGrid>
        {people.map((person) => (
          <RevealItem key={person.id}>
            <ModuleCard title={person.name} meta={person.years} description={person.summary}>
              <div className="grid gap-2">
                <span>Donem: {person.period}</span>
                <span>Rol: {person.role}</span>
                <span>Basarilar: {person.achievements.join(", ")}</span>
              </div>
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
