import { Layers3, MapPinned, Route } from "lucide-react";

export function MapSystemPanel() {
  return (
    <aside className="grid content-start gap-4">
      <div className="border border-white/10 bg-white/[0.035] p-4">
        <MapPinned className="mb-3 h-5 w-5 text-atlas" />
        <h2 className="font-display text-2xl text-white">Harita motoru</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">
          Admin çizimleri Mapbox GL Draw ile üretilir, GeoJSON PostGIS geometrisine çevrilir. Public görünümde Leaflet hazır yedek motor olarak çalışır.
        </p>
      </div>
      <div className="border border-white/10 bg-white/[0.035] p-4">
        <Layers3 className="mb-3 h-5 w-5 text-atlas" />
        <h2 className="font-display text-2xl text-white">Katmanlar</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">Devlet, savaş, göç, ticaret yolu ve şehir katmanları harita üzerinden açılıp kapatılır.</p>
      </div>
      <div className="border border-white/10 bg-white/[0.035] p-4">
        <Route className="mb-3 h-5 w-5 text-atlas" />
        <h2 className="font-display text-2xl text-white">Çizim akışı</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">Devlet için çokgen, savaş ve şehir için nokta, göç ve ticaret için rota çizimi kullanılır.</p>
      </div>
    </aside>
  );
}

