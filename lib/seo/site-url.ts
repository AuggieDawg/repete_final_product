export function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.repeteauto.com").replace(/\/$/, "");
}

export function createAbsoluteUrl(path = "/") {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function shouldIndexSite() {
  return process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";
}
