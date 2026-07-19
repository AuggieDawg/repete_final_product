import { describe, expect, it } from "vitest";
import {
  consumeLeadAttempt,
  markLeadAttempt,
  type LeadAttemptStorage
} from "../lead-attempt";

function createStorage(): LeadAttemptStorage {
  const values = new Map<string, string>();

  return {
    getItem: (key) => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key)
  };
}

describe("lead attempt markers", () => {
  it("does not confirm a direct thank-you visit without a form attempt", () => {
    const storage = createStorage();

    expect(consumeLeadAttempt(storage, "schedule_test_drive")).toBeUndefined();
  });

  it("consumes each valid form attempt once and allows a later attempt", () => {
    const storage = createStorage();

    markLeadAttempt(storage, "schedule_test_drive", "attempt-one");
    expect(consumeLeadAttempt(storage, "schedule_test_drive")).toBe("attempt-one");
    expect(consumeLeadAttempt(storage, "schedule_test_drive")).toBeUndefined();

    markLeadAttempt(storage, "schedule_test_drive", "attempt-two");
    expect(consumeLeadAttempt(storage, "schedule_test_drive")).toBe("attempt-two");
  });
});
