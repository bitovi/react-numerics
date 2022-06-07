import { render } from "@testing-library/react";
import { CurrencyNumberInput } from "./currency-number-input";

describe("CurrencyNumberInput", () => {
  it("rounds midpoint value up for display", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <CurrencyNumberInput
        numericValue="2.225"
        onNumericChange={handleNumericChange}
      />
    );

    expect(handleNumericChange).toHaveBeenCalledWith("2.225");
    expect(getByDisplayValue("$2.23")).toBeInTheDocument();
  });

  it("rounds '> midpoint' value up for display", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <CurrencyNumberInput
        numericValue="2.226"
        onNumericChange={handleNumericChange}
      />
    );

    expect(handleNumericChange).toHaveBeenCalledWith("2.226");
    expect(getByDisplayValue("$2.23")).toBeInTheDocument();
  });

  it("rounds '< midpoint' value down for display", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <CurrencyNumberInput
        numericValue="2.224"
        onNumericChange={handleNumericChange}
      />
    );

    expect(handleNumericChange).toHaveBeenCalledWith("2.224");
    expect(getByDisplayValue("$2.22")).toBeInTheDocument();
  });
});
