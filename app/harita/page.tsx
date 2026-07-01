import { ClientHistoryMap } from "@/components/client-history-map";
import { MapSystemPanel } from "@/components/maps/map-system-panel";
import { PageShell } from "@/components/page-shell";
import { TimeMachine } from "@/components/time-machine";

export default function MapPage() {
  return (
    <PageShell title="Tarih Haritası" description="Devlet sınırları, başkentler, savaş noktaları, ticaret yolları ve göç rotaları tek harita katmanında gösterilir.">
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <ClientHistoryMap year={1071} mode="all" />
        <MapSystemPanel />
      </div>
      <div className="mt-5">
        <TimeMachine />
      </div>
    </PageShell>
  );
}
