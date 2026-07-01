import { ModuleCard } from "@/components/module-card";
import { PageShell } from "@/components/page-shell";
import { RevealGrid, RevealItem } from "@/components/reveal-grid";
import { cultureItems } from "@/lib/data";

export default function CulturePage() {
  return (
    <PageShell title="Kültür Modülü" description="Sanat, mimari, müzik, yemek, silah ve kıyafet başlıklarını tarihsel dönemleriyle incele.">
      <RevealGrid>
        {cultureItems.map((item) => (
          <RevealItem key={item.id}>
            <ModuleCard title={item.title} meta={item.category} description={item.summary}>
              <span className="text-atlas">Dönem:</span> {item.period}
            </ModuleCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </PageShell>
  );
}

