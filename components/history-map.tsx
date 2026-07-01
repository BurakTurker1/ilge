"use client";

import "leaflet/dist/leaflet.css";
import { Fragment, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import { cities, migrations, states, tradeRoutes, wars } from "@/lib/data";
import type { StateEntity } from "@/lib/types";

function markerIcon(label: string, color: string) {
  return divIcon({
    className: "ilge-marker",
    html: `<span style="--marker:${color}">${label.slice(0, 2).toLocaleUpperCase("tr-TR")}</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

type HistoryMapProps = {
  year?: number;
  mode?: "states" | "wars" | "migrations" | "all";
};

type LayerState = {
  states: boolean;
  wars: boolean;
  migrations: boolean;
  trade: boolean;
  cities: boolean;
};

const layerLabels: Record<keyof LayerState, string> = {
  states: "Devletler",
  wars: "Savaşlar",
  migrations: "Göçler",
  trade: "Ticaret yolları",
  cities: "Şehirler"
};

function initialLayers(mode: HistoryMapProps["mode"]): LayerState {
  return {
    states: mode === "states" || mode === "all",
    wars: mode === "wars" || mode === "all",
    migrations: mode === "migrations" || mode === "all",
    trade: mode === "all",
    cities: mode === "all"
  };
}

export function HistoryMap({ year = 1071, mode = "all" }: HistoryMapProps) {
  const [selectedState, setSelectedState] = useState<StateEntity | null>(null);
  const [layers, setLayers] = useState<LayerState>(() => initialLayers(mode));
  const visibleStates = useMemo(
    () => states.filter((state) => state.founded <= year && (!state.dissolved || state.dissolved >= year)),
    [year]
  );
  const showLayerPanel = mode === "all";

  return (
    <div className="relative min-h-[520px] overflow-hidden border border-white/10 bg-ink">
      <MapContainer center={[39.9, 55.5]} zoom={4} scrollWheelZoom className="h-[520px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {layers.states &&
          visibleStates.map((state) => (
            <Polygon
              key={state.id}
              positions={state.coordinates.map((point) => [point.lat, point.lng])}
              pathOptions={{ color: state.color, fillColor: state.color, fillOpacity: 0.28, weight: 2 }}
              eventHandlers={{ click: () => setSelectedState(state) }}
            >
              <Popup>
                <strong>{state.name}</strong>
                <br />
                {state.founded} - {state.dissolved ?? "gunumuz"}
              </Popup>
            </Polygon>
          ))}
        {layers.states &&
          visibleStates.map((state) => (
            <Marker key={`${state.id}-capital`} position={[state.center.lat, state.center.lng]} icon={markerIcon(state.name, state.color)}>
              <Popup>
                {state.capital}
                <br />
                {state.name}
              </Popup>
            </Marker>
          ))}
        {layers.wars &&
          wars
            .filter((war) => Math.abs(war.year - year) < 80 || mode === "wars")
            .map((war) => (
              <Fragment key={war.id}>
                <CircleMarker center={[war.location.lat, war.location.lng]} radius={8} pathOptions={{ color: "#ffdd78", fillOpacity: 0.9 }} />
                <Polyline positions={war.route.map((point) => [point.lat, point.lng])} pathOptions={{ color: "#ffdd78", dashArray: "8 10", weight: 3 }} />
              </Fragment>
            ))}
        {layers.migrations &&
          migrations.map((migration) => (
            <Polyline
              key={migration.id}
              positions={migration.route.map((point) => [point.lat, point.lng])}
              pathOptions={{ color: "#3aa6a1", dashArray: "2 12", weight: 4 }}
            />
          ))}
        {layers.trade &&
          tradeRoutes.map((route) => (
            <Polyline key={route.id} positions={route.route.map((point) => [point.lat, point.lng])} pathOptions={{ color: "#d7b978", dashArray: "1 10", weight: 3, opacity: 0.8 }} />
          ))}
        {layers.cities &&
          cities.map((city) => (
            <CircleMarker key={city.id} center={[city.location.lat, city.location.lng]} radius={5} pathOptions={{ color: "#ffffff", fillColor: "#caa24b", fillOpacity: 0.85, weight: 1 }}>
              <Popup>
                <strong>{city.name}</strong>
                <br />
                {city.oldNames.join(", ")}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
      {showLayerPanel ? (
        <aside className="absolute right-4 top-4 z-[500] w-56 border border-white/15 bg-ink/90 p-3 shadow-glow backdrop-blur">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brass">Tarih katmanları</p>
          <div className="grid gap-2">
            {(Object.keys(layerLabels) as Array<keyof LayerState>).map((key) => (
              <label key={key} className="flex items-center justify-between gap-3 border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/70">
                {layerLabels[key]}
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={(event) => setLayers((current) => ({ ...current, [key]: event.target.checked }))}
                  className="accent-brass"
                />
              </label>
            ))}
          </div>
        </aside>
      ) : null}
      {selectedState ? (
        <aside className="absolute bottom-4 left-4 right-4 z-[500] max-w-md border border-white/15 bg-ink/90 p-4 shadow-glow backdrop-blur">
          <button onClick={() => setSelectedState(null)} className="float-right text-sm text-white/45 hover:text-white" aria-label="Kapat">
            x
          </button>
          <h3 className="font-display text-2xl text-white">{selectedState.name}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-white/35">Kurulus</dt>
              <dd className="text-atlas">{selectedState.founded}</dd>
            </div>
            <div>
              <dt className="text-white/35">Yikilis</dt>
              <dd className="text-atlas">{selectedState.dissolved ?? "Devam ediyor"}</dd>
            </div>
            <div>
              <dt className="text-white/35">Baskent</dt>
              <dd className="text-atlas">{selectedState.capital}</dd>
            </div>
            <div>
              <dt className="text-white/35">Kurucu</dt>
              <dd className="text-atlas">{selectedState.founder}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-6 text-white/62">{selectedState.summary}</p>
        </aside>
      ) : null}
    </div>
  );
}
