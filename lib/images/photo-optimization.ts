/**
 * Mirrors the images.remotePatterns allow-list in next.config.js.
 *
 * next/image throws at render time for remote hosts that are not in
 * remotePatterns. Vehicle photo URLs come from the AutoManager feed and
 * are not under our control, so instead of crashing on an unexpected
 * host, components use this check to fall back to `unoptimized` for
 * that one image while everything else stays optimized.
 *
 * Keep the default host list here in sync with next.config.js.
 */
const DEFAULT_OPTIMIZED_HOST_SUFFIXES = [".automanager.com"];
const AUTOMANAGER_WMPHOTOS_HOST = "automanager.blob.core.windows.net";
const AUTOMANAGER_WMPHOTOS_PATH_PREFIX = "/wmphotos/";

function getExtraHosts(): string[] {
  return (process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

export function isOptimizablePhotoUrl(src: string | null | undefined): boolean {
  if (!src) return false;

  // Local assets in /public are always optimizable.
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  let parsed: URL;

  try {
    parsed = new URL(src);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:") return false;
  if (parsed.username || parsed.password) return false;

  const hostname = parsed.hostname.toLowerCase();

  // Keep this exact host/path/port rule aligned with next.config.js. Returning
  // here also prevents an environment allow-list entry from broadening Azure
  // optimization beyond AutoManager's WMPhotos container.
  if (hostname === AUTOMANAGER_WMPHOTOS_HOST) {
    return (
      parsed.port === "" &&
      parsed.pathname.startsWith(AUTOMANAGER_WMPHOTOS_PATH_PREFIX) &&
      parsed.pathname.length > AUTOMANAGER_WMPHOTOS_PATH_PREFIX.length
    );
  }

  if (
    DEFAULT_OPTIMIZED_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix)
    )
  ) {
    return true;
  }

  // next.config.js adds environment-provided hostnames as exact patterns.
  return getExtraHosts().some((host) => hostname === host);
}
