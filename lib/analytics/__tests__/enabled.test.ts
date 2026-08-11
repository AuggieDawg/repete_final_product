import { describe, expect, it } from "vitest";
import { isAnalyticsEnabled } from "../enabled";

describe("analytics opt-in", () => {
  it("enables analytics only for the exact value true", () => {
    expect(isAnalyticsEnabled("true")).toBe(true);
  });

  it.each([undefined, "", "false", "TRUE", "1", "yes"])(
    "keeps analytics disabled for %s",
    (value) => {
      expect(isAnalyticsEnabled(value)).toBe(false);
    }
  );
});
