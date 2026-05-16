const INTERNAL_HOSTNAMES = new Set(["0.0.0.0", "::", "[::]"]);

export function getPublicUrl(path: string, request: Request) {
  return new URL(path, getPublicOrigin(request));
}

export function getPublicOrigin(request: Request) {
  const configuredOrigin = normalizeOrigin(
    process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? process.env.PUBLIC_APP_URL
  );

  if (configuredOrigin) {
    return configuredOrigin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (host && !isInternalHost(host)) {
    return `${forwardedProto.split(",")[0]}://${host.split(",")[0]}`;
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN ?? process.env.RAILWAY_STATIC_URL;

  if (railwayDomain) {
    return normalizeOrigin(railwayDomain) ?? `https://${railwayDomain}`;
  }

  const requestOrigin = new URL(request.url).origin;
  return requestOrigin.replace("://0.0.0.0", "://localhost");
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
