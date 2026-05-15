import { getAuthUsers } from "@/lib/auth";
import { ensureAccessTables, getPool } from "@/lib/db";

export type AccessUser = {
  email: string;
  name: string;
  plan?: string | null;
};

export async function findActiveAccessUserByEmail(email: string): Promise<AccessUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const envUser = getAuthUsers().find((user) => user.email === normalizedEmail);

  if (envUser) {
    return envUser;
  }

  const hasDatabase = await ensureAccessTables();
  const database = getPool();

  if (!hasDatabase || !database) {
    return null;
  }

  const result = await database.query<AccessUser>(
    `
      select email, coalesce(name, email) as name, plan
      from user_access
      where email = $1
        and status = 'active'
        and (access_expires_at is null or access_expires_at > now())
      limit 1
    `,
    [normalizedEmail]
  );

  return result.rows[0] ?? null;
}

export async function upsertKiwifyAccess({
  email,
  name,
  status,
  plan,
  orderId,
  subscriptionId,
  eventType,
  payload,
  accessExpiresAt
}: {
  email: string;
  name?: string | null;
  status: "active" | "inactive";
  plan?: string | null;
  orderId?: string | null;
  subscriptionId?: string | null;
  eventType?: string | null;
  payload: unknown;
  accessExpiresAt?: Date | null;
}) {
  await ensureAccessTables();
  const database = getPool();

  if (!database) {
    throw new Error("DATABASE_URL nao configurada.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  await database.query(
    `
      insert into user_access (
        email,
        name,
        status,
        plan,
        kiwify_order_id,
        kiwify_subscription_id,
        last_event,
        raw_payload,
        access_expires_at,
        updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, now())
      on conflict (email)
      do update set
        name = coalesce(excluded.name, user_access.name),
        status = excluded.status,
        plan = coalesce(excluded.plan, user_access.plan),
        kiwify_order_id = coalesce(excluded.kiwify_order_id, user_access.kiwify_order_id),
        kiwify_subscription_id = coalesce(excluded.kiwify_subscription_id, user_access.kiwify_subscription_id),
        last_event = excluded.last_event,
        raw_payload = excluded.raw_payload,
        access_expires_at = excluded.access_expires_at,
        updated_at = now()
    `,
    [
      normalizedEmail,
      name || normalizedEmail,
      status,
      plan,
      orderId,
      subscriptionId,
      eventType,
      JSON.stringify(payload),
      accessExpiresAt ?? null
    ]
  );

  await database.query(
    `
      insert into kiwify_events (event_type, email, order_id, subscription_id, payload)
      values ($1, $2, $3, $4, $5::jsonb)
    `,
    [eventType, normalizedEmail, orderId, subscriptionId, JSON.stringify(payload)]
  );
}
