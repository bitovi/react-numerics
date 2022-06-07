import { getCurrencyData, localizedStringToNumber, padRight } from "./numbers";

describe("getCurrencyData", () => {
  it("returns US symbol and fraction length", () => {
    const { fractionLength, symbol } = getCurrencyData("en-US", "USD");
    expect(fractionLength).toBe(2);
    expect(symbol).toBe("$");
  });
});

describe("localizedStringToNumber", () => {
  it("converts from en-US to en-US", () => {
    expect(localizedStringToNumber("3,000.99", "en-US")).toBe("3000.99");
  });

  it("converts from de-DE to en-US", () => {
    expect(localizedStringToNumber("3.000,99", "de-DE")).toBe("3000.99");
  });

  it("handles empty string", () => {
    expect(localizedStringToNumber("", "de-DE")).toBe("");
  });

  it("handles '0,'", () => {
    expect(localizedStringToNumber("0,", "de-DE")).toBe("0.");
  });
});

describe("padRight", () => {
  it("pads to the right", () => {
    expect(padRight("3", "0".repeat(2))).toBe("30");
  });

  it("doesn't change input longer than the template", () => {
    expect(padRight("123", "00")).toBe("123");
  });
});
