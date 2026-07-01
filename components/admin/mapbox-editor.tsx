"use client";

import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import mapboxgl from "mapbox-gl";
import { Braces, Eraser, MapPinned, MousePointer2, Play, Route, SquareDashedMousePointer } from "lucide-react";

type MapboxEditorProps = {
  value: string;
  onChange: (value: string) => void;
  color?: string;
  expectedGeometry?: "polygon" | "point" | "line_string";
};

const fallbackGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Ornek sinir" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [38.8, 28.9],
            [57.8, 40.2],
            [69.4, 36.2],
            [51.3, 25.1],
            [38.8, 28.9]
          ]
        ]
      }
    }
  ]
};

const geometryLabels = {
  polygon: "cokgen",
  point: "nokta",
  line_string: "cizgi"
};

export function MapboxEditor({ value, onChange, color = "#caa24b", expectedGeometry = "polygon" }: MapboxEditorProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initialValueRef = useRef(value);
  const [mode, setMode] = useState(expectedGeometry);
  const [featureCount, setFeatureCount] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const sync = useCallback(() => {
    const data = drawRef.current?.getAll() ?? { type: "FeatureCollection", features: [] };
    setFeatureCount(data.features.length);
    onChange(JSON.stringify(data, null, 2));
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || !token || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [42.5, 39.5],
      zoom: 3.2,
      attributionControl: false
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        point: true,
        line_string: true,
        trash: true
      },
      styles: [
        {
          id: "ilge-polygon-fill",
          type: "fill",
          filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          paint: { "fill-color": color, "fill-outline-color": color, "fill-opacity": 0.28 }
        },
        {
          id: "ilge-line",
          type: "line",
          filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
          paint: { "line-color": color, "line-width": 3, "line-dasharray": [2, 2] }
        },
        {
          id: "ilge-point",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: { "circle-radius": 7, "circle-color": color, "circle-stroke-color": "#ffffff", "circle-stroke-width": 1 }
        }
      ]
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-left");
    map.addControl(draw, "top-left");
    map.on("load", () => {
      if (initialValueRef.current) {
        try {
          const parsed = JSON.parse(initialValueRef.current) as GeoJSON.FeatureCollection;
          draw.set(parsed);
          setFeatureCount(parsed.features.length);
        } catch {
          draw.set(fallbackGeoJson as GeoJSON.FeatureCollection);
          setFeatureCount(fallbackGeoJson.features.length);
        }
      }
    });

    map.on("draw.create", sync);
    map.on("draw.update", sync);
    map.on("draw.delete", sync);

    mapRef.current = map;
    drawRef.current = draw;

    return () => {
      map.remove();
      mapRef.current = null;
      drawRef.current = null;
    };
  }, [color, sync, token]);

  useEffect(() => {
    setMode(expectedGeometry);
    if (drawRef.current) drawRef.current.changeMode(`draw_${expectedGeometry}`);
  }, [expectedGeometry]);

  function changeMode(nextMode: "polygon" | "point" | "line_string") {
    setMode(nextMode);
    drawRef.current?.changeMode(`draw_${nextMode}`);
  }

  function loadExample() {
    const text = JSON.stringify(fallbackGeoJson, null, 2);
    onChange(text);
    drawRef.current?.set(fallbackGeoJson as GeoJSON.FeatureCollection);
    setFeatureCount(fallbackGeoJson.features.length);
  }

  function clearMap() {
    drawRef.current?.deleteAll();
    setFeatureCount(0);
    onChange(JSON.stringify({ type: "FeatureCollection", features: [] }, null, 2));
  }

  return (
    <section className="border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Mapbox Harita Duzenleyici</p>
          <h2 className="mt-1 font-display text-2xl text-white">Harita Editoru</h2>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => changeMode("polygon")} className={`icon-button ${mode === "polygon" ? "text-atlas" : ""}`} aria-label="Cokgen ciz">
            <SquareDashedMousePointer className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => changeMode("point")} className={`icon-button ${mode === "point" ? "text-atlas" : ""}`} aria-label="Nokta ekle">
            <MapPinned className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => changeMode("line_string")} className={`icon-button ${mode === "line_string" ? "text-atlas" : ""}`} aria-label="Rota ciz">
            <Route className="h-4 w-4" />
          </button>
          <button type="button" onClick={loadExample} className="icon-button" aria-label="Ornek yukle">
            <Braces className="h-4 w-4" />
          </button>
          <button type="button" onClick={clearMap} className="icon-button" aria-label="Cizimi temizle">
            <Eraser className="h-4 w-4" />
          </button>
        </div>
      </div>
      {token ? (
        <div ref={containerRef} className="h-[440px] overflow-hidden border border-white/10 bg-ink" />
      ) : (
        <div className="grid min-h-[260px] place-items-center border border-dashed border-brass/35 bg-ink/70 p-6 text-center">
          <div>
            <MousePointer2 className="mx-auto mb-3 h-8 w-8 text-atlas" />
            <p className="font-semibold text-white">Mapbox anahtari bekleniyor</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/58">
              Canli cizim icin Mapbox ortam anahtari eklenmeli. Anahtar yokken harita verisi onizlemesi ve ornek veriyle icerik yonetimi akisi calisir.
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="border border-white/10 bg-ink/65 p-3">
          <p className="text-xs text-white/35">Beklenen geometri</p>
          <p className="mt-1 font-semibold text-atlas">{geometryLabels[expectedGeometry]}</p>
        </div>
        <div className="border border-white/10 bg-ink/65 p-3">
          <p className="text-xs text-white/35">Cizilen katman</p>
          <p className="mt-1 font-semibold text-atlas">{featureCount}</p>
        </div>
        <button type="button" onClick={() => setReplayKey((key) => key + 1)} className="flex items-center justify-center gap-2 border border-white/10 bg-ink/65 p-3 text-sm text-white/70 hover:border-brass/50">
          <Play className="h-4 w-4" />
          Animasyonu oynat
        </button>
      </div>
      <div className="mt-3 h-2 overflow-hidden border border-white/10 bg-ink/80">
        <div key={replayKey} className="h-full w-1/3 bg-brass motion-safe:animate-[routeReplay_2.2s_ease-in-out]" />
      </div>
      <details className="mt-4 border border-white/10 bg-ink/65 p-3">
        <summary className="cursor-pointer text-sm text-white/60">Harita verisi onizleme</summary>
        <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-white/50">{value}</pre>
      </details>
    </section>
  );
}
