import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type LocalRow = Record<string, unknown> & {
  id: string;
  olusturulma_zamani: string;
  guncellenme_zamani: string;
};

const dataDir = path.join(process.cwd(), "database", "local-data");

function assertSafeTable(table: string) {
  if (!/^[a-z_][a-z0-9_]*$/.test(table)) {
    throw new Error("Geçersiz yerel tablo adı.");
  }
}

function fileFor(table: string) {
  assertSafeTable(table);
  return path.join(dataDir, `${table}.json`);
}

async function readRows(table: string): Promise<LocalRow[]> {
  try {
    const text = await readFile(fileFor(table), "utf8");
    const parsed = JSON.parse(text) as LocalRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeRows(table: string, rows: LocalRow[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(fileFor(table), JSON.stringify(rows, null, 2), "utf8");
}

export async function listLocalRows(table: string, page: number, pageSize: number) {
  const rows = await readRows(table);
  const sorted = [...rows].sort((a, b) => String(b.olusturulma_zamani).localeCompare(String(a.olusturulma_zamani)));
  const from = (page - 1) * pageSize;

  return {
    rows: sorted.slice(from, from + pageSize),
    total: rows.length
  };
}

export async function createLocalRow(table: string, payload: Record<string, unknown>, geojson: unknown) {
  const now = new Date().toISOString();
  const row: LocalRow = {
    id: randomUUID(),
    ...payload,
    geojson,
    olusturulma_zamani: now,
    guncellenme_zamani: now
  };
  const rows = await readRows(table);
  rows.push(row);
  await writeRows(table, rows);
  return row;
}

export async function updateLocalRow(table: string, id: string, payload: Record<string, unknown>, geojson: unknown) {
  const rows = await readRows(table);
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) throw new Error("Yerel kayit bulunamadi.");

  rows[index] = {
    ...rows[index],
    ...payload,
    geojson: geojson ?? rows[index].geojson,
    guncellenme_zamani: new Date().toISOString()
  };
  await writeRows(table, rows);
  return rows[index];
}

export async function deleteLocalRow(table: string, id: string) {
  const rows = await readRows(table);
  const nextRows = rows.filter((row) => row.id !== id);
  await writeRows(table, nextRows);
  return rows.length !== nextRows.length;
}

