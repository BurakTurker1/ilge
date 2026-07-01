import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { concepts } from "@/lib/data";

export default function ConceptsPage() {
  return (
    <PageShell title="Kavramlar" description="Kut, tore, kurultay ve alp gibi Turk tarihi kavramlarini ansiklopedi yapisinda incele.">
      <RevealGrid>
        {concepts.map((concept) => (
          <RevealItem key={concept.id}>
            <ModuleCard title={concept.name} meta={concept.category} description={concept.summary}>
              {concept.details}
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}
