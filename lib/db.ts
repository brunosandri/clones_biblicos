import { Pool } from "pg";

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
}

export async function ensureAccessTables() {
  const database = getPool();

  if (!database) {
    return false;
  }

  await database.query(`
    create table if not exists user_access (
      email text primary key,
      name text,
      status text not null default 'active',
      plan text,
      kiwify_order_id text,
      kiwify_subscription_id text,
      last_event text,
      raw_payload jsonb,
      access_expires_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists kiwify_events (
      id bigserial primary key,
      event_type text,
      email text,
      order_id text,
      subscription_id text,
      payload jsonb not null,
      created_at timestamptz not null default now()
    );
  `);

  return true;
}
