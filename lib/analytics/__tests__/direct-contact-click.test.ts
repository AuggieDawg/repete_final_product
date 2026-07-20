import { describe, expect, it } from "vitest";
import { getDirectContactClick } from "../direct-contact-click";

describe("getDirectContactClick", () => {
  it("returns controlled call and SMS payload data without the destination address", () => {
    expect(getDirectContactClick("tel:14357892886")).toEqual({
      name: "call_click",
      destination: "phone"
    });
    expect(getDirectContactClick("sms:+14356212553?body=private-message")).toEqual({
      name: "sms_click",
      destination: "sms"
    });
  });

  it("ignores non-contact links", () => {
    expect(getDirectContactClick("/inventory")).toBeNull();
  });
});
