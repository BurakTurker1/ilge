"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Building2,
  Castle,
  Database,
  Eye,
  FileImage,
  FileText,
  Flag,
  ImagePlus,
  LogOut,
  Map,
  Route,
  Save,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Timer,
  Trash2,
  Upload,
  UserRound,
  Waves
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { adminMetrics, cmsModules, sampleRows, type AdminSection, type CmsField, type CmsModule } from "@/lib/admin-cms";
import { states, wars, migrations, treaties, people, cities } from "@/lib/data";
import { MapboxEditor } from "./mapbox-editor";
import { HistorySimulationPanel } from "./history-simulation";

const menu: Array<{ id: AdminSection; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "Kontrol Paneli", icon: BarChart3 },
  { id: "states", label: "Devletler", icon: Flag },
  { id: "map", label: "Harita Editoru", icon: Map },
  { id: "wars", label: "Savaşlar", icon: Swords },
  { id: "migrations", label: "Göçler", icon: Waves },
  { id: "treaties", label: "Anlasmalar", icon: FileText },
  { id: "people", label: "Kişiler", icon: UserRound },
  { id: "cities", label: "Şehirler", icon: Castle },
  { id: "concepts", label: "Kavramlar", icon: BookOpen },
  { id: "images", label: "Görseller", icon: FileImage },
  { id: "timeline", label: "Zaman Çizelgesi", icon: Timer },
  { id: "trade", label: "Ticaret Yolları", icon: Route },
  { id: "culture", label: "Kültür", icon: Sparkles },
  { id: "settings", label: "Ayarlar", icon: Settings }
];

type EnvStatus = {
  ok: boolean;
  missing: string[];
  services: { database: boolean; redis: boolean; minio: boolean };
  databaseConnected?: boolean;
  databaseError?: string | null;
  fallbackMode?: boolean;
};

const emptyGeoJson = JSON.stringify({ type: "FeatureCollection", features: [] }, null, 2);

function emptyValueFor(field: CmsField) {
  if (field.type === "color") return "#caa24b";
  if (field.type === "geojson") return emptyGeoJson;
  return "";
}

function moduleInitialValues(module: CmsModule) {
  return Object.fromEntries(module.fields.map((field) => [field.name, emptyValueFor(field)]));
}

export function AdminPanel({ initialSection = "dashboard" }: { initialSection?: AdminSection } = {}) {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>(initialSection);
  const activeModule = cmsModules.find((module) => module.section === section) ?? cmsModules[0];
  const [formValues, setFormValues] = useState<Record<string, string>>(moduleInitialValues(activeModule));
  const [geoJson, setGeoJson] = useState(emptyGeoJson);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string; details?: string }>({ type: "idle", message: "" });
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [selectedStateId, setSelectedStateId] = useState(states[4]?.id ?? states[0]?.id);
  const [recordsVersion, setRecordsVersion] = useState(0);

  const selectedState = useMemo(() => states.find((state) => state.id === selectedStateId) ?? states[0], [selectedStateId]);
  const related = useMemo(
    () => ({
      wars: wars.filter((war) => war.sides.some((side) => selectedState?.name.includes(side) || side.includes(selectedState?.name ?? ""))),
      migrations: migrations.filter((migration) => migration.result.toLocaleLowerCase("tr-TR").includes("turk")),
      treaties: treaties.filter((treaty) => treaty.parties.some((party) => selectedState?.name.includes(party) || party.includes(selectedState?.name ?? ""))),
      people: people.filter((person) => selectedState && person.period.toLocaleLowerCase("tr-TR").includes(selectedState.name.split(" ")[0].toLocaleLowerCase("tr-TR"))),
      cities: cities.filter((city) => selectedState && city.states.some((state) => selectedState.name.includes(state) || state.includes(selectedState.name)))
    }),
    [selectedState]
  );

  const setValue = useCallback((name: string, value: string) => {
    setFormValues((current) => ({ ...current, [name]: value }));
  }, []);

  useEffect(() => {
    fetch("/api/admin/env")
      .then(async (response) => {
        const body = (await response.json()) as EnvStatus;
        setEnvStatus(body);
      })
      .catch((error) => setEnvStatus({ ok: false, missing: [error instanceof Error ? error.message : "ortam ayarı kontrol edilemedi"], services: { database: false, redis: false, minio: false } }));
  }, []);

  const setGeoJsonValue = useCallback(
    (value: string) => {
      setGeoJson(value);
      setValue("harita_alani", value);
      setValue("konum", value);
      setValue("rota", value);
    },
    [setValue]
  );

  async function saveActiveModule() {
    setStatus({ type: "loading", message: "Kayıt yerel PostGIS veri tabanına gönderiliyor..." });

    try {
      const response = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: activeModule.tableName,
          payload: formValues,
          geojson: geoJson
        })
      });
      const body = (await response.json().catch(() => null)) as { message?: string; details?: string; code?: string; row?: { id?: string }; env?: { missing?: string[] }; warning?: string; mode?: string } | null;

      if (!response.ok) {
        setStatus({
          type: "error",
          message: body?.message ?? "Kayıt başarısız.",
          details: body?.env?.missing?.length ? `Eksik ortam ayari: ${body.env.missing.join(", ")}` : body?.details ?? body?.code
        });
        return;
      }

      setStatus({
        type: "success",
        message: `Kayıt tamamlandı. ID: ${body?.row?.id ?? "oluşturuldu"}`,
        details: body?.warning ?? (body?.mode ? `Kayıt modu: ${body.mode}` : undefined)
      });
      setRecordsVersion((value) => value + 1);
    } catch (error) {
      setStatus({ type: "error", message: "Arayuz ile veri arabirimi baglantisi basarisiz.", details: error instanceof Error ? error.message : String(error) });
    }
  }

  async function deletePlaceholder() {
    setStatus({ type: "error", message: "Silme için önce veritabanından bir kayıt seçilmeli.", details: "Liste canlı PostgreSQL verisine bağlandığında seçili kayıt kimliği ile silme işlemi çalışır." });
  }

  function switchSection(nextSection: AdminSection) {
    setSection(nextSection);
    const nextModule = cmsModules.find((module) => module.section === nextSection);
    if (nextModule) setFormValues(moduleInitialValues(nextModule));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen px-4 pb-28 pt-6 sm:px-6 lg:ml-72 lg:px-8 lg:pb-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-brass">İLGE YÖNETİM PANELİ</p>
            <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">Profesyonel İçerik Yönetimi</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
              Devlet, harita, savaş, göç, anlaşma, kişi, şehir, kavram, görsel ve zaman çizelgesi kayıtlarını tek yerden yönet.
            </p>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-ember/50 hover:text-white">
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[250px_1fr]">
          <aside className="border border-white/10 bg-ink/75 p-3 backdrop-blur">
            <nav className="grid gap-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => switchSection(item.id)}
                    className={`flex items-center gap-3 px-3 py-3 text-left text-sm transition ${
                      active ? "bg-brass/15 text-atlas" : "text-white/58 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <section className="min-w-0">
            {section === "dashboard" ? <Dashboard setSection={switchSection} envStatus={envStatus} /> : null}
            {section === "map" ? <MapEditorPanel geoJson={geoJson} setGeoJson={setGeoJsonValue} /> : null}
            {section === "images" ? <ImagesPanel /> : null}
            {section === "settings" ? <SettingsPanel /> : null}
            {section === "states" ? (
              <div className="grid gap-5 2xl:grid-cols-[1fr_390px]">
                <ModuleEditor module={activeModule} values={formValues} setValue={setValue} geoJson={geoJson} setGeoJson={setGeoJsonValue} status={status} onSave={saveActiveModule} onDelete={deletePlaceholder} refreshKey={recordsVersion} />
                <StateDetail selectedStateId={selectedStateId} setSelectedStateId={setSelectedStateId} related={related} />
              </div>
            ) : null}
            {cmsModules.some((module) => module.section === section) && section !== "states" ? (
              <ModuleEditor module={activeModule} values={formValues} setValue={setValue} geoJson={geoJson} setGeoJson={setGeoJsonValue} status={status} onSave={saveActiveModule} onDelete={deletePlaceholder} refreshKey={recordsVersion} />
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}

function Dashboard({
  setSection,
  envStatus
}: {
  setSection: (section: AdminSection) => void;
  envStatus: EnvStatus | null;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <button key={metric.table} onClick={() => setSection(metric.table === "states" ? "states" : (metric.table as AdminSection))} className="border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-1 hover:border-brass/45">
            <p className="text-sm text-white/48">{metric.label}</p>
            <p className="mt-2 text-4xl font-semibold text-atlas">{metric.value}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">{metric.tableLabel}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-5 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-atlas" />
          <h2 className="font-display text-2xl text-white">Yönetim akışı</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["1", "İçeriği gir", "Zorunlu alanları ve ilişkili kayıtları tamamla."],
              ["2", "Haritada çiz", "Çokgen, nokta veya çizgi harita verisi olarak kaydedilir."],
              ["3", "Yayınla", "Yerel PostGIS, MinIO ve imzalı yönetici oturumu ile güvenli yayın akışı."]
            ].map(([step, title, text]) => (
              <div key={step} className="border border-white/10 bg-ink/55 p-4">
                <p className="text-2xl font-semibold text-atlas">{step}</p>
                <h3 className="mt-2 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center gap-2 text-atlas">
            <Database className="h-5 w-5" />
            Yerel servis durumu
          </div>
          <p className="text-sm leading-6 text-white/58">
            {envStatus?.databaseConnected
              ? "PostgreSQL/PostGIS bağlantısı hazır. Redis cache ve MinIO dosya alanı Docker Compose ile yerel çalışır."
              : envStatus?.fallbackMode
                ? "PostgreSQL şu anda kapalı. Kayıtlar geçici olarak yerel dosya yedeğine yazılacak."
                : `Eksik yerel ayar: ${envStatus?.missing?.join(", ") ?? "kontrol ediliyor"}`}
          </p>
          <div className="mt-3 grid gap-2 text-xs text-white/50">
            <span>PostgreSQL: {envStatus?.databaseConnected ? "bağlandı" : envStatus?.services.database ? "bağlantı bekliyor" : "ayar eksik"}</span>
            <span>Redis: {envStatus?.services.redis ? "hazır" : "opsiyonel ayar eksik"}</span>
            <span>MinIO: {envStatus?.services.minio ? "hazır" : "opsiyonel ayar eksik"}</span>
          </div>
          {envStatus?.fallbackMode ? <p className="mt-3 border border-brass/40 bg-brass/10 p-2 text-xs text-atlas">Veritabanı açıldığında ana kayıt hedefi yeniden PostgreSQL/PostGIS olur.</p> : null}
          {!envStatus?.ok ? <p className="mt-3 border border-ember/40 bg-ember/10 p-2 text-xs text-red-100">Kayıt işlemleri ortam ayarları tamamlanana kadar veritabanına yazmaz; sistem görünür hata döndürür.</p> : null}
        </div>
      </div>
      <HistorySimulationPanel />
    </motion.div>
  );
}

function ModuleEditor({
  module,
  values,
  setValue,
  geoJson,
  setGeoJson,
  status,
  onSave,
  onDelete,
  refreshKey
}: {
  module: CmsModule;
  values: Record<string, string>;
  setValue: (name: string, value: string) => void;
  geoJson: string;
  setGeoJson: (value: string) => void;
  status: { type: "idle" | "loading" | "success" | "error"; message: string; details?: string };
  onSave: () => void;
  onDelete: () => void;
  refreshKey: number;
}) {
  const fallbackRows = useMemo(
    () => (sampleRows[module.tableName as keyof typeof sampleRows] ?? []) as Array<Record<string, unknown>>,
    [module.tableName]
  );
  const [rows, setRows] = useState<Array<Record<string, unknown>>>(fallbackRows);
  const hasGeoField = module.fields.some((field) => field.type === "geojson");

  useEffect(() => {
    let cancelled = false;
    setRows(fallbackRows);

    fetch(`/api/admin/cms?table=${encodeURIComponent(module.tableName)}&pageSize=25`)
      .then(async (response) => {
        if (!response.ok) return;
        const body = (await response.json()) as { rows?: Array<Record<string, unknown>> };
        if (!cancelled && body.rows) setRows(body.rows);
      })
      .catch(() => {
        if (!cancelled) setRows(fallbackRows);
      });

    return () => {
      cancelled = true;
    };
  }, [fallbackRows, module.tableName, refreshKey]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5">
      <section className="border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brass">{module.tableName}</p>
            <h2 className="mt-2 font-display text-3xl text-white">{module.title}</h2>
            <p className="mt-2 text-sm text-white/55">{module.description}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 border border-white/10 px-4 py-3 text-sm text-white/65 hover:border-ember/50">
              <Trash2 className="h-4 w-4" />
              Sil
            </button>
            <button type="button" onClick={onSave} disabled={status.type === "loading"} className="inline-flex items-center gap-2 bg-brass px-4 py-3 text-sm font-semibold text-ink hover:bg-atlas disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-4 w-4" />
              {status.type === "loading" ? "Kaydediliyor" : "Kaydet"}
            </button>
          </div>
        </div>
        {status.type !== "idle" ? (
          <div className={`mb-5 border p-3 text-sm ${status.type === "success" ? "border-moss/40 bg-moss/10 text-green-100" : status.type === "error" ? "border-ember/45 bg-ember/10 text-red-100" : "border-brass/40 bg-brass/10 text-atlas"}`}>
            <p className="font-semibold">{status.message}</p>
            {status.details ? <p className="mt-1 text-xs opacity-80">{status.details}</p> : null}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {module.fields.filter((field) => field.type !== "geojson").map((field) => (
            <FieldRenderer key={field.name} field={field} value={values[field.name] ?? emptyValueFor(field)} setValue={(value) => setValue(field.name, value)} />
          ))}
        </div>
        {hasGeoField ? (
          <div className="mt-5">
            <MapboxEditor value={geoJson} onChange={setGeoJson} color={values.color || "#caa24b"} expectedGeometry={expectedGeometryFor(module.tableName)} />
          </div>
        ) : null}
      </section>

      <section className="border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-white">Kayıtlar</h3>
          <span className="rounded border border-white/10 px-2 py-1 text-xs text-white/45">sayfalama hazir</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-[0.16em] text-white/40">
                <th className="py-3">Baslik</th>
                <th className="py-3">Meta</th>
                <th className="py-3">Durum</th>
                <th className="py-3 text-right">Islem</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 6).map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-b border-white/10 text-white/65">
                  <td className="py-3 font-medium text-white">{String(row.isim ?? row.baslik ?? row.name ?? row.title ?? "Kayıt")}</td>
                  <td className="py-3">{String(row.tarih ?? row.yil ?? row.kurulus_yili ?? row.year ?? row.founded ?? row.kategori ?? row.category ?? row.period ?? "-")}</td>
                  <td className="py-3"><span className="rounded bg-moss/20 px-2 py-1 text-xs text-green-100">taslak</span></td>
                  <td className="py-3 text-right"><button className="inline-flex items-center gap-1 text-atlas hover:text-white"><Eye className="h-3 w-3" />Duzenle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
}

function expectedGeometryFor(tableName: string) {
  if (tableName === "devletler") return "polygon" as const;
  if (tableName === "gocler" || tableName === "ticaret_yollari") return "line_string" as const;
  return "point" as const;
}

function FieldRenderer({ field, value, setValue }: { field: CmsField; value: string; setValue: (value: string) => void }) {
  const className = field.type === "textarea" || field.type === "geojson" ? "md:col-span-2" : "";
  const label = (
    <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">
      {field.label} {field.required ? <span className="text-atlas">*</span> : null}
    </span>
  );

  if (field.type === "textarea" || field.type === "geojson") {
    return (
      <label className={className}>
        {label}
        <textarea value={value} onChange={(event) => setValue(event.target.value)} className="min-h-32 w-full border border-white/10 bg-ink/65 p-3 text-sm leading-6 text-white outline-none focus:border-brass/60" />
      </label>
    );
  }

  if (field.type === "select" || field.type === "multiselect") {
    return (
      <label className={className}>
        {label}
        <select value={value} onChange={(event) => setValue(event.target.value)} className="h-12 w-full border border-white/10 bg-ink/65 px-3 text-sm text-white outline-none focus:border-brass/60">
          <option value="">Secim yap</option>
          {field.options?.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <label className={className}>
        {label}
        <span className="flex h-12 cursor-pointer items-center gap-2 border border-dashed border-white/15 bg-ink/65 px-3 text-sm text-white/50 hover:border-brass/50">
          <Upload className="h-4 w-4 text-atlas" />
          MinIO dosya alanı için dosya seç
        </span>
        <input type="file" className="sr-only" />
      </label>
    );
  }

  return (
    <label className={className}>
      {label}
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        type={field.type === "number" ? "number" : field.type}
        placeholder={field.placeholder}
        className="h-12 w-full border border-white/10 bg-ink/65 px-3 text-sm text-white outline-none focus:border-brass/60"
      />
    </label>
  );
}

function MapEditorPanel({ geoJson, setGeoJson }: { geoJson: string; setGeoJson: (value: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 2xl:grid-cols-[1fr_360px]">
      <MapboxEditor value={geoJson} onChange={setGeoJson} />
      <aside className="grid content-start gap-4">
        <div className="border border-white/10 bg-white/[0.035] p-4">
          <Route className="mb-3 h-5 w-5 text-atlas" />
          <h3 className="font-display text-2xl text-white">Çizim modları</h3>
          <p className="mt-3 text-sm leading-6 text-white/58">Çokgen devlet sınırı, nokta şehir/savaş/anlaşma konumu, çizgi göç ve ordu hareketi için kullanılır.</p>
        </div>
        <div className="border border-white/10 bg-white/[0.035] p-4">
          <Shield className="mb-3 h-5 w-5 text-atlas" />
          <h3 className="font-display text-2xl text-white">Kayıt stratejisi</h3>
          <p className="mt-3 text-sm leading-6 text-white/58">Harita verisi ilgili veritabanı tablolarında içerik bağlantısı ile saklanır.</p>
        </div>
      </aside>
    </motion.div>
  );
}

function ImagesPanel() {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-5 border-b border-white/10 pb-5">
        <p className="text-xs uppercase tracking-[0.28em] text-brass">MinIO Dosya Alanı</p>
        <h2 className="mt-2 font-display text-3xl text-white">Görsel Sistemi</h2>
        <p className="mt-2 text-sm text-white/55">Kapak, galeri, harita, çizim ve savaş görselleri her içeriğe bağlanabilir.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Kapak görseli", "Galeri", "Savaş çizimi"].map((title) => (
          <label key={title} className="grid min-h-44 cursor-pointer place-items-center border border-dashed border-white/15 bg-ink/60 p-4 text-center hover:border-brass/50">
            <div>
              <ImagePlus className="mx-auto mb-3 h-8 w-8 text-atlas" />
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs text-white/45">Yukleme ve kapak secimi</p>
            </div>
            <input type="file" multiple className="sr-only" />
          </label>
        ))}
      </div>
    </motion.section>
  );
}

function StateDetail({
  selectedStateId,
  setSelectedStateId,
  related
}: {
  selectedStateId: string;
  setSelectedStateId: (id: string) => void;
  related: { wars: unknown[]; migrations: unknown[]; treaties: unknown[]; people: unknown[]; cities: unknown[] };
}) {
  const state = states.find((item) => item.id === selectedStateId) ?? states[0];
  if (!state) return null;

  return (
    <aside className="border border-white/10 bg-white/[0.035] p-4">
      <label className="mb-4 block">
        <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-white/45">Devlet detay</span>
        <select value={selectedStateId} onChange={(event) => setSelectedStateId(event.target.value)} className="h-12 w-full border border-white/10 bg-ink/65 px-3 text-sm text-white outline-none focus:border-brass/60">
          {states.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>
      <div className="mb-4 h-1 w-20" style={{ backgroundColor: state.color }} />
      <h3 className="font-display text-3xl text-white">{state.name}</h3>
      <p className="mt-3 text-sm leading-6 text-white/58">{state.summary}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><dt className="text-white/35">Kurulus</dt><dd className="text-atlas">{state.founded}</dd></div>
        <div><dt className="text-white/35">Yikilis</dt><dd className="text-atlas">{state.dissolved ?? "Gunumuz"}</dd></div>
        <div><dt className="text-white/35">Baskent</dt><dd className="text-atlas">{state.capital}</dd></div>
        <div><dt className="text-white/35">Kurucu</dt><dd className="text-atlas">{state.founder}</dd></div>
      </dl>
      <div className="mt-5 grid gap-2 text-sm text-white/58">
        <RelationRow label="Bagli savas" value={related.wars.length} />
        <RelationRow label="Bagli goc" value={related.migrations.length} />
        <RelationRow label="Bagli antlasma" value={related.treaties.length} />
        <RelationRow label="Bagli kisi" value={related.people.length} />
        <RelationRow label="Bagli sehir" value={related.cities.length} />
      </div>
    </aside>
  );
}

function RelationRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border border-white/10 bg-ink/55 px-3 py-2">
      <span>{label}</span>
      <span className="text-atlas">{value}</span>
    </div>
  );
}

function SettingsPanel() {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 xl:grid-cols-2">
      <div className="border border-white/10 bg-white/[0.035] p-5">
        <Building2 className="mb-3 h-5 w-5 text-atlas" />
        <h2 className="font-display text-3xl text-white">Kurulum</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">Varsayilan yonetici bilgileri ortam ayarlari ile degistirilebilir. Gizli oturum anahtari canli ortamda mutlaka farkli olmalidir.</p>
      </div>
      <div className="border border-white/10 bg-white/[0.035] p-5">
        <Shield className="mb-3 h-5 w-5 text-atlas" />
        <h2 className="font-display text-3xl text-white">Guvenlik</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">Cerez tabanli imzali oturum, deneme kilidi, korumali veri arabirimi, satir guvenligi ve rol tabanli yetki modeline hazir tablo tasarimi bulunur.</p>
      </div>
    </motion.section>
  );
}
