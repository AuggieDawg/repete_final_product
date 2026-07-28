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

function getExtraHosts(): string[] {
  return (process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

export function isOptimizablePhotoUrl(src: string | null | undefined): boolean {
  if (!src) return false;

  // Local assets in /public are always optimizable.
  if (src.startsWith("/")) return true;

  let hostname: string;

  try {
    const parsed = new URL(src);
    if (parsed.protocol !== "https:") return false;
    hostname = parsed.hostname.toLowerCase();
  } catch {
    return false;
  }

  if (
    DEFAULT_OPTIMIZED_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix)
    )
  ) {
    return true;
  }

  return getExtraHosts().some(
    (host) => hostname === host || hostname.endsWith(`.${host}`)
  );
}
