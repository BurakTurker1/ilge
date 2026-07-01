import { ScenarioTimeline } from "@/components/timeline/scenario-timeline";
import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { TimeMachine } from "@/components/time-machine";
import { timeline } from "@/lib/data";

export default function TimelinePage() {
  return (
    <PageShell title="Zaman Çizgisi" description="Yıl arama, dönem filtreleme ve ileri-geri tarih akışı için tasarlanmış Türk tarihi kronolojisi.">
      <div className="mb-5 grid gap-5 xl:grid-cols-[1fr_420px]">
        <TimeMachine />
        <ScenarioTimeline />
      </div>
      <RevealGrid>
        {timeline.map((event) => (
          <RevealItem key={event.id}>
            <ModuleCard title={event.title} meta={String(event.year)} description={event.summary}>
              <span className="text-atlas">{event.era}</span> dönemi, {event.type} kaydı
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}

