import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("does not zero pad when the value is an empty string", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <CurrencyNumberInput
        numericValue=""
        onNumericChange={handleNumericChange}
      />
    );

    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(handleNumericChange).toHaveBeenCalledWith("");

    const elem = getByDisplayValue("", { exact: true }) as HTMLInputElement;
    expect(elem).toBeInTheDocument();

    elem.focus();
    expect(elem).toHaveFocus();

    await user.tab();

    expect(elem).not.toHaveFocus();
    expect(handleNumericChange).toHaveBeenCalledTimes(2);
    expect(elem).toHaveDisplayValue("");
  });
});
