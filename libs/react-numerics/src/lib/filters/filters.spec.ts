import {
  filterToNumeric,
  filterToSignedFloat,
  filterToSignedNumeric
} from "./filters";

describe("filterToNumeric", () => {
  it("filters out letters", () => {
    expect(filterToNumeric("Aa123Zz")).toBe("123");
  });

  it("filters out '-' sign", () => {
    expect(filterToNumeric("-999")).toBe("999");
  });

  it("filters out ' ", () => {
    expect(filterToNumeric("222 333")).toBe("222333");
  });
});

describe("filterToSignedFloat", () => {
  it("preserves negative and decimal", () => {
    expect(filterToSignedFloat("-41.3")).toBe("-41.3");
  });

  it("preserves positive and decimal", () => {
    expect(filterToSignedFloat("+41.3")).toBe("+41.3");
  });

  it("preserves a dangling decimal point", () => {
    expect(filterToSignedFloat("3.")).toBe("3.");
  });

  it("prevents duplicate decimal points", () => {
    expect(filterToSignedFloat("1.2.3")).toBe("1.23");
  });

  it("retains leading 0", () => {
    expect(filterToSignedFloat("0.5")).toBe("0.5");
  });
});

describe("filterToSignedNumeric", () => {
  it("preserves negative and decimal", () => {
    expect(filterToSignedNumeric("-41")).toBe("-41");
  });

  it("preserves positive and decimal", () => {
    expect(filterToSignedNumeric("+41")).toBe("+41");
  });

  it("ignores a dangling decimal point", () => {
    expect(filterToSignedNumeric("3.")).toBe("3");
  });

  it("ignores decimal points", () => {
    expect(filterToSignedNumeric("1.23")).toBe("123");
  });

  it("retains leading 0", () => {
    expect(filterToSignedNumeric("05")).toBe("05");
  });
});
