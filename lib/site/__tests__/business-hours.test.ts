import { describe, expect, it } from "vitest";
import { getInventoryCachePolicy, isDealerOpen } from "../business-hours";

describe("Repete business hours", () => {
  it("is open on Friday at 10 AM Denver time", () => {
    const date = new Date("2026-05-22T16:00:00.000Z");
    expect(isDealerOpen(date)).toBe(true);
    expect(getInventoryCachePolicy(date).mode).toBe("business-hours");
  });

  it("is closed on Friday at 8 PM Denver time", () => {
    const date = new Date("2026-05-23T02:00:00.000Z");
    expect(isDealerOpen(date)).toBe(false);
    expect(getInventoryCachePolicy(date).mode).toBe("after-hours");
  });

  it("is closed on Sunday", () => {
    const date = new Date("2026-05-24T18:00:00.000Z");
    expect(isDealerOpen(date)).toBe(false);
    expect(getInventoryCachePolicy(date).mode).toBe("closed-sunday");
  });
});
