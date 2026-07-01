import { Pool, type QueryResult, type QueryResultRow } from "pg";

type LocalStackEnv = {
  ok: boolean;
  missing: string[];
  services: {
    database: boolean;
    redis: boolean;
    minio: boolean;
  };
};

const requiredEnv = ["DATABASE_URL"] as const;

export function getLocalStackEnv(): LocalStackEnv {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  return {
    ok: missing.length === 0,
    missing,
    services: {
      database: Boolean(process.env.DATABASE_URL),
      redis: Boolean(process.env.REDIS_URL),
      minio: Boolean(process.env.MINIO_ENDPOINT && process.env.MINIO_ACCESS_KEY && process.env.MINIO_SECRET_KEY)
    }
  };
}

const globalForPg = globalThis as unknown as {
  ilgePgPool?: Pool;
};

export function getDbPool() {
  const env = getLocalStackEnv();
  if (!env.ok) {
    throw new Error(`Yerel veritabanı ayarı eksik: ${env.missing.join(", ")}`);
  }

  if (!globalForPg.ilgePgPool) {
    globalForPg.ilgePgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.POSTGRES_POOL_MAX ?? 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    });
  }

  return globalForPg.ilgePgPool;
}

export function dbQuery<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<QueryResult<T>> {
  return getDbPool().query<T>(text, params);
}

