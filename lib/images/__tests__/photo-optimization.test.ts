import { createRequire } from "node:module";
import { afterEach, describe, expect, it } from "vitest";
import { isOptimizablePhotoUrl } from "../photo-optimization";

const require = createRequire(import.meta.url);
const nextConfig = require("../../../next.config.js") as {
  images: {
    remotePatterns: Array<{
      protocol: string;
      hostname: string;
      port?: string;
      pathname?: string;
    }>;
  };
};

const originalExtraHosts = process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS;

afterEach(() => {
  if (originalExtraHosts === undefined) {
    delete process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS;
  } else {
    process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS = originalExtraHosts;
  }
});

describe("isOptimizablePhotoUrl", () => {
  it("optimizes HTTPS files and extensionless keys under the exact WMPhotos path", () => {
    expect(
      isOptimizablePhotoUrl(
        "https://automanager.blob.core.windows.net/wmphotos/043297/abc/front.jpg"
      )
    ).toBe(true);
    expect(
      isOptimizablePhotoUrl(
        "https://automanager.blob.core.windows.net/wmphotos/043297/abc/extensionless-key?width=800"
      )
    ).toBe(true);
  });

  it("does not optimize other Azure paths, ports, lookalike hosts, or HTTP", () => {
    expect(
      isOptimizablePhotoUrl(
        "https://automanager.blob.core.windows.net/inventory/front.jpg"
      )
    ).toBe(false);
    expect(
      isOptimizablePhotoUrl(
        "https://automanager.blob.core.windows.net:444/wmphotos/dealer/front.jpg"
      )
    ).toBe(false);
    expect(
      isOptimizablePhotoUrl(
        "https://automanager.blob.core.windows.net.evil.example/wmphotos/dealer/front.jpg"
      )
    ).toBe(false);
    expect(
      isOptimizablePhotoUrl(
        "http://automanager.blob.core.windows.net/wmphotos/dealer/front.jpg"
      )
    ).toBe(false);
  });

  it("rejects credentialed and protocol-relative remote URLs", () => {
    expect(
      isOptimizablePhotoUrl(
        "https://user:secret@automanager.blob.core.windows.net/wmphotos/dealer/front.jpg"
      )
    ).toBe(false);
    expect(isOptimizablePhotoUrl("//automanager.com/front.jpg")).toBe(false);
  });

  it("continues to optimize vendor subdomains and local public assets", () => {
    expect(isOptimizablePhotoUrl("https://cdn.automanager.com/img/front.jpg")).toBe(true);
    expect(isOptimizablePhotoUrl("/repete-logo.png")).toBe(true);
  });

  it("treats environment-provided hostnames as exact config patterns", () => {
    process.env.NEXT_PUBLIC_INVENTORY_IMAGE_HOSTS = "images.example.com";

    expect(isOptimizablePhotoUrl("https://images.example.com/front.jpg")).toBe(true);
    expect(isOptimizablePhotoUrl("https://cdn.images.example.com/front.jpg")).toBe(false);
  });

  it("matches the exact WMPhotos rule in next.config.js", () => {
    const azurePatterns = nextConfig.images.remotePatterns.filter(
      (pattern) => pattern.hostname === "automanager.blob.core.windows.net"
    );

    expect(azurePatterns).toEqual([
      {
        protocol: "https",
        hostname: "automanager.blob.core.windows.net",
        port: "",
        pathname: "/wmphotos/**"
      }
    ]);
  });

  it("returns false for empty, malformed, and unknown URLs", () => {
    expect(isOptimizablePhotoUrl(null)).toBe(false);
    expect(isOptimizablePhotoUrl(undefined)).toBe(false);
    expect(isOptimizablePhotoUrl("not a URL")).toBe(false);
    expect(isOptimizablePhotoUrl("https://example.com/front.jpg")).toBe(false);
  });
});
