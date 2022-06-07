import { convertNumber } from "./converters";

describe("convertNumber", () => {
  it("accepts input and input locale args", () => {
    expect(convertNumber("en-US")("3.14", "en-US")).toBe("3.14");
  });

  it("accepts input, input locale, and output locale args", () => {
    expect(convertNumber("en-US")("3.14", "de-DE")).toBe("3,14");
  });

  it("converts from german to english", () => {
    expect(convertNumber("de-DE")("3,14")).toBe("3.14");
  });

  it("accepts a sign", () => {
    expect(convertNumber("de-DE")("-3,14")).toBe("-3.14");
  });

  it("removes grouping separators when the locales are different", () => {
    expect(convertNumber()("111,222,333.4444", "de-DE")).toBe("111222333,4444");
  });

  it("removes grouping separators when the locale is the same", () => {
    expect(convertNumber()("111,222,333.4444")).toBe("111222333.4444");
  });
});
