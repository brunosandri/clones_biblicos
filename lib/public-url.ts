const INTERNAL_HOSTNAMES = new Set(["0.0.0.0", "::", "[::]"]);

export function getPublicUrl(path: string, request: Request) {
  return new URL(path, getBase(request));
}

export function getBase(request: Request): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
  const fwdHost = request.headers.get("x-forwarded-host")?.split(",")[0];

  if (fwdHost) {
    return `${proto}://${fwdHost}`;
  }

  const host = request.headers.get("host");

  if (host && !isInternalHost(host)) {
    return `${proto}://${host.split(",")[0]}`;
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN ?? process.env.RAILWAY_STATIC_URL;

  if (railwayDomain) {
    return `https://${railwayDomain.replace(/^https?:\/\//, "")}`;
  }

  return new URL(request.url).origin.replace("://0.0.0.0", "://localhost");
}

/** @deprecated use getBase */
export function getPublicOrigin(request: Request): string {
  return getBase(request);
}

function normalizeOrigin(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const trimmedValue = value.trim();
    const withProtocol = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return null;
  }
}

function isInternalHost(host: string) {
  const hostname = host.split(",")[0].split(":")[0].trim();
  return INTERNAL_HOSTNAMES.has(hostname);
}
