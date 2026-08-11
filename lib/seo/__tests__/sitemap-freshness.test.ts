import { beforeEach, describe, expect, it, vi } from "vitest";

const { connectionMock, getInventorySnapshotMock } = vi.hoisted(() => ({
  connectionMock: vi.fn(async () => undefined),
  getInventorySnapshotMock: vi.fn()
}));

vi.mock("next/server", () => ({
  connection: connectionMock
}));

vi.mock("@/lib/inventory/get-inventory", () => ({
  getInventorySnapshot: getInventorySnapshotMock
}));

vi.mock("@/lib/seo/site-url", () => ({
  createAbsoluteUrl: (pathname: string) => `https://www.repeteauto.com${pathname}`
}));

import sitemap from "@/app/sitemap";

describe("inventory sitemap freshness", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getInventorySnapshotMock.mockResolvedValue({
      vehicles: [{ slug: "2024-john-deere-1025r-r1234" }],
      fetchedAt: "2026-08-11T18:00:00.000Z",
      parsedAt: "2026-08-11T18:00:00.000Z"
    });
  });

  it("request-renders before reading the cached inventory snapshot", async () => {
    const entries = await sitemap();

    expect(connectionMock).toHaveBeenCalledOnce();
    expect(getInventorySnapshotMock).toHaveBeenCalledOnce();
    expect(connectionMock.mock.invocationCallOrder[0]).toBeLessThan(
      getInventorySnapshotMock.mock.invocationCallOrder[0]
    );
    expect(entries).toContainEqual(
      expect.objectContaining({
        url: "https://www.repeteauto.com/inventory/2024-john-deere-1025r-r1234"
      })
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });
});
