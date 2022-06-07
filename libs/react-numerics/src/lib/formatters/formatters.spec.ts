import { formatFloat, formatInteger } from "./formatters";

describe("formatFloat", () => {
  it("formats", () => {
    expect(formatFloat()("3.14")).toBe("3.14");
  });

  it("localizes a floating point number", () => {
    expect(formatFloat("de-DE")("3.14")).toBe("3,14");
  });

  it("preserves sign only", () => {
    expect(formatFloat()("-")).toBe("-");
    expect(formatFloat()("+")).toBe("+");
  });

  it("preserves leading 0", () => {
    expect(formatFloat()("0.5")).toBe("0.5");
  });

  it("preserves 0.0", () => {
    expect(formatFloat()("0.0")).toBe("0.0");
  });

  it("preserves -0.0", () => {
    expect(formatFloat()("-0.0")).toBe("-0.0");
  });

  it("accepts no leading 0", () => {
    expect(formatFloat()(".5")).toBe("0.5");
  });

  it("preserves a trailing decimal", () => {
    expect(formatFloat()("0.")).toBe("0.");
  });

  it("handles up to 20 fractional places", () => {
    expect(formatFloat()(".11111111111111111111")).toBe(
      "0.11111111111111111111"
    );
  });

  it("truncates more than 20 fractional places", () => {
    expect(formatFloat()(".111111111111111111111")).toBe(
      "0.11111111111111111111"
    );
    expect(formatFloat()(".111111111111111111119")).toBe(
      "0.11111111111111111111"
    );
  });

  it("groups the integer portion", () => {
    expect(formatFloat()("1234.5")).toBe("1,234.5");
  });

  it("removes whitespace", () => {
    expect(formatFloat()(` -0.0\n`)).toBe("-0.0");
  });
});

describe("formatInteger", () => {
  it("formats", () => {
    expect(formatInteger()("1234")).toBe("1,234");
  });

  it("localizes an integer number", () => {
    expect(formatInteger("de-DE")("7777777")).toBe("7.777.777");
  });

  it("truncates a fractional part", () => {
    expect(formatInteger()("123.9")).toBe("123");
    expect(formatInteger()("123.1")).toBe("123");
    expect(formatInteger()("123.0")).toBe("123");
    expect(formatInteger()("-123.9")).toBe("-123");
    expect(formatInteger()("-123.1")).toBe("-123");
    expect(formatInteger()("-123.0")).toBe("-123");
  });

  it("removes whitespace", () => {
    expect(formatFloat()(` 55555\n`)).toBe("55,555");
  });
});
