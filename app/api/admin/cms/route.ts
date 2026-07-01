import { NextResponse, type NextRequest } from "next/server";
import { cmsModules } from "@/lib/admin-cms";
import { requireAdmin } from "@/lib/admin-auth";
import { dbQuery, getLocalStackEnv } from "@/lib/db";
import { createLocalRow, deleteLocalRow, listLocalRows, updateLocalRow } from "@/lib/local-cms-store";

export const runtime = "nodejs";

type FeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    geometry?: {
      type: string;
      coordinates: unknown;
    } | null;
  }>;
};

type GeometryRule = {
  column: string;
  geometryTypes: string[];
  multi?: boolean;
};

const allowedTables = new Set([
  ...cmsModules.map((module) => module.tableName),
  "gorseller",
  "devlet_iliskileri",
  "ai_hazirlik_notlari"
]);

const geometryRules: Record<string, GeometryRule[]> = {
  devletler: [{ column: "harita_alani", geometryTypes: ["Polygon", "MultiPolygon"], multi: true }],
  savaslar: [
    { column: "konum", geometryTypes: ["Point"] },
    { column: "rota", geometryTypes: ["LineString"] }
  ],
  gocler: [{ column: "rota", geometryTypes: ["LineString"] }],
  anlasmalar: [{ column: "konum", geometryTypes: ["Point"] }],
  sehirler: [{ column: "konum", geometryTypes: ["Point"] }],
  ticaret_yollari: [{ column: "rota", geometryTypes: ["LineString"] }]
};

const arrayColumns = new Set(["taraflar", "eski_isimler", "iliskili_kayitlar"]);
const numberColumns = new Set(["kurulus_yili", "yikilis_yili", "tarih", "bitis_tarihi", "dogum", "olum", "yil"]);
const geometryColumns = new Set(Object.values(geometryRules).flatMap((rules) => rules.map((rule) => rule.column)));
const columnWhitelist = new Map(
  cmsModules.map((module) => [
    module.tableName,
    new Set([
      ...module.fields.map((field) => field.name),
      "id",
      "olusturulma_zamani",
      "guncellenme_zamani"
    ])
  ])
);

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });

  const env = getLocalStackEnv();
  if (!env.ok) return NextResponse.json({ message: "Yerel PostgreSQL ayarı eksik.", env }, { status: 503 });

  const table = request.nextUrl.searchParams.get("table");
  if (!table || !allowedTables.has(table)) return NextResponse.json({ message: "Geçersiz tablo." }, { status: 400 });

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("pageSize") ?? 25)));
  const offset = (page - 1) * pageSize;
  console.info("[admin-cms:get]", { table, page, pageSize, user: session.sub });

  try {
    const rows = await dbQuery(`select * from ${quoteIdent(table)} order by olusturulma_zamani desc limit $1 offset $2`, [pageSize, offset]);
    const count = await dbQuery<{ count: string }>(`select count(*) from ${quoteIdent(table)}`);
    return NextResponse.json({
      table,
      rows: rows.rows,
      pagination: { page, pageSize, total: Number(count.rows[0]?.count ?? 0) }
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const local = await listLocalRows(table, page, pageSize);
      return NextResponse.json({
        table,
        rows: local.rows,
        pagination: { page, pageSize, total: local.total },
        mode: "yerel-dosya-yedegi",
        warning: "PostgreSQL bağlantısı yok; kayıtlar yerel dosya yedeğinden okunuyor."
      });
    }

    console.error("[admin-cms:get:error]", { table, error });
    return NextResponse.json({ message: "Yerel veritabanı okuması başarısız.", details: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });

  const env = getLocalStackEnv();
  if (!env.ok) return NextResponse.json({ message: "Yerel PostgreSQL ayarı eksik.", env }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { table?: string; payload?: Record<string, unknown>; geojson?: unknown } | null;
  if (!body?.table || !allowedTables.has(body.table)) return NextResponse.json({ message: "Geçersiz tablo." }, { status: 400 });
  if (!body.payload || typeof body.payload !== "object") return NextResponse.json({ message: "Payload zorunlu." }, { status: 400 });

  try {
    const insert = buildInsert(body.table, body.payload, body.geojson);
    if (!insert) return NextResponse.json({ message: "Kaydedilecek alan bulunamadı." }, { status: 400 });

    console.info("[admin-cms:create]", { table: body.table, keys: insert.columns, user: session.sub });
    const result = await dbQuery(insert.sql, insert.params);
    return NextResponse.json({
      ok: true,
      table: body.table,
      row: result.rows[0],
      mode: "yerel-postgresql-postgis"
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const row = await createLocalRow(body.table, body.payload, body.geojson);
      return NextResponse.json({
        ok: true,
        table: body.table,
        row,
        mode: "yerel-dosya-yedegi",
        warning: "PostgreSQL bağlantısı yok; kayıt yerel dosya yedeğine yazıldı."
      });
    }

    console.error("[admin-cms:create:error]", { table: body.table, error });
    return NextResponse.json({ message: "Kayıt yerel veritabanına yazılamadı.", details: errorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });

  const env = getLocalStackEnv();
  if (!env.ok) return NextResponse.json({ message: "Yerel PostgreSQL ayarı eksik.", env }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { table?: string; id?: string; payload?: Record<string, unknown>; geojson?: unknown } | null;
  if (!body?.table || !allowedTables.has(body.table)) return NextResponse.json({ message: "Geçersiz tablo." }, { status: 400 });
  if (!body.id) return NextResponse.json({ message: "ID zorunlu." }, { status: 400 });

  try {
    const update = buildUpdate(body.table, body.id, body.payload ?? {}, body.geojson);
    if (!update) return NextResponse.json({ message: "Güncellenecek alan bulunamadı." }, { status: 400 });

    console.info("[admin-cms:update]", { table: body.table, id: body.id, user: session.sub });
    const result = await dbQuery(update.sql, update.params);
    return NextResponse.json({ ok: true, row: result.rows[0] });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const row = await updateLocalRow(body.table, body.id, body.payload ?? {}, body.geojson);
      return NextResponse.json({
        ok: true,
        row,
        mode: "yerel-dosya-yedegi",
        warning: "PostgreSQL bağlantısı yok; kayıt yerel dosya yedeğinde güncellendi."
      });
    }

    console.error("[admin-cms:update:error]", { table: body.table, id: body.id, error });
    return NextResponse.json({ message: "Kayıt güncellenemedi.", details: errorMessage(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });

  const env = getLocalStackEnv();
  if (!env.ok) return NextResponse.json({ message: "Yerel PostgreSQL ayarı eksik.", env }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { table?: string; id?: string } | null;
  if (!body?.table || !allowedTables.has(body.table)) return NextResponse.json({ message: "Geçersiz tablo." }, { status: 400 });
  if (!body.id) return NextResponse.json({ message: "ID zorunlu." }, { status: 400 });

  try {
    console.info("[admin-cms:delete]", { table: body.table, id: body.id, user: session.sub });
    await dbQuery(`delete from ${quoteIdent(body.table)} where id = $1`, [body.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const deleted = await deleteLocalRow(body.table, body.id);
      return NextResponse.json({
        ok: deleted,
        mode: "yerel-dosya-yedegi",
        warning: "PostgreSQL bağlantısı yok; silme yerel dosya yedeğinde uygulandı."
      });
    }

    console.error("[admin-cms:delete:error]", { table: body.table, id: body.id, error });
    return NextResponse.json({ message: "Kayıt silinemedi.", details: errorMessage(error) }, { status: 500 });
  }
}

function buildInsert(table: string, payload: Record<string, unknown>, geojson: unknown) {
  const prepared = preparePayload(table, payload);
  const collection = parseFeatureCollection(geojson);

  for (const rule of geometryRules[table] ?? []) {
    const geometry = findGeometry(collection, rule.geometryTypes);
    if (geometry) prepared.push({ column: rule.column, value: JSON.stringify(geometry), geometry: true, multi: Boolean(rule.multi) });
  }

  if (prepared.length === 0) return null;

  const params: unknown[] = [];
  const columns: string[] = [];
  const values: string[] = [];

  for (const item of prepared) {
    columns.push(quoteIdent(item.column));
    params.push(item.value);
    if (item.geometry) {
      const geom = `ST_SetSRID(ST_GeomFromGeoJSON($${params.length}), 4326)`;
      values.push(item.multi ? `ST_Multi(${geom})` : geom);
    } else {
      values.push(`$${params.length}`);
    }
  }

  return {
    columns,
    params,
    sql: `insert into ${quoteIdent(table)} (${columns.join(", ")}) values (${values.join(", ")}) returning *`
  };
}

function buildUpdate(table: string, id: string, payload: Record<string, unknown>, geojson: unknown) {
  const prepared = preparePayload(table, payload);
  const collection = parseFeatureCollection(geojson);

  for (const rule of geometryRules[table] ?? []) {
    const geometry = findGeometry(collection, rule.geometryTypes);
    if (geometry) prepared.push({ column: rule.column, value: JSON.stringify(geometry), geometry: true, multi: Boolean(rule.multi) });
  }

  if (prepared.length === 0) return null;

  const params: unknown[] = [];
  const setters: string[] = [];

  for (const item of prepared) {
    params.push(item.value);
    if (item.geometry) {
      const geom = `ST_SetSRID(ST_GeomFromGeoJSON($${params.length}), 4326)`;
      setters.push(`${quoteIdent(item.column)} = ${item.multi ? `ST_Multi(${geom})` : geom}`);
    } else {
      setters.push(`${quoteIdent(item.column)} = $${params.length}`);
    }
  }

  params.push(id);
  return {
    params,
    sql: `update ${quoteIdent(table)} set ${setters.join(", ")} where id = $${params.length} returning *`
  };
}

function preparePayload(table: string, payload: Record<string, unknown>) {
  const whitelist = columnWhitelist.get(table);
  return Object.entries(payload)
    .filter(([key, value]) => Boolean(whitelist?.has(key)) && !geometryColumns.has(key) && value !== "" && value !== null && value !== undefined)
    .map(([column, value]) => ({ column, value: normalizeValue(column, value), geometry: false, multi: false }));
}

function normalizeValue(column: string, value: unknown) {
  if (arrayColumns.has(column)) {
    if (Array.isArray(value)) return value.map(String);
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (numberColumns.has(column) && typeof value === "string" && /^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

function parseFeatureCollection(value: unknown): FeatureCollection | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as FeatureCollection;
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && "type" in value && value.type === "FeatureCollection") return value as FeatureCollection;
  return null;
}

function findGeometry(collection: FeatureCollection | null, geometryTypes: string[]) {
  return collection?.features.find((feature) => feature.geometry && geometryTypes.includes(feature.geometry.type))?.geometry ?? null;
}

function quoteIdent(value: string) {
  if (!allowedTables.has(value) && !/^[a-z_][a-z0-9_]*$/.test(value)) throw new Error("Geçersiz SQL adı.");
  return `"${value.replace(/"/g, '""')}"`;
}

function errorMessage(error: unknown) {
  if (error instanceof AggregateError) {
    const details = error.errors
      .map((item) => (item instanceof Error ? `${item.name}: ${item.message}` : String(item)))
      .filter(Boolean)
      .join(" | ");
    return details || error.message || "Veritabanı bağlantısı kurulamadı.";
  }

  if (error instanceof Error) {
    const code = "code" in error ? String(error.code) : "";
    return [code, error.message].filter(Boolean).join(": ") || "Bilinmeyen hata.";
  }

  return String(error);
}

function isDatabaseConnectionError(error: unknown) {
  if (error instanceof AggregateError) {
    return error.errors.some(isDatabaseConnectionError);
  }

  if (error instanceof Error && "code" in error) {
    return ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EHOSTUNREACH"].includes(String(error.code));
  }

  return false;
}
