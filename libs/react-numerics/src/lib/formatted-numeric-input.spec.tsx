import { render, screen, waitFor } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { FormattedNumericInput } from "./formatted-numeric-input";
import { formatCurrency } from "./formatters/formatters";

describe("FormattedNumericInput", () => {
  it("formats the initial value", async () => {
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        formatter={formatCurrency("en-US")}
        numericValue="1.23"
        onNumericChange={mockHandleNumericChange}
      />
    );

    // The `numericValue` is formatted on the first render. After this format is
    // complete `onNumericChange` is invoked from a `setTimeout`; for that
    // reason we need to use `waitFor` here to check and see when that initial
    // format is completed.
    await waitFor(() =>
      expect(mockHandleNumericChange).toHaveBeenCalledTimes(1)
    );
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$1.23");
  });

  it("formats a pasted value and raises onNumericChange", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        formatter={formatCurrency("en-US")}
        numericValue="2.00"
        onNumericChange={mockHandleNumericChange}
      />
    );

    // The `numericValue` is formatted on the first render. After this format is
    // complete `onNumericChange` is invoked from a `setTimeout`; for that
    // reason we need to use `waitFor` here to check and see when that initial
    // format is completed.
    await waitFor(() =>
      expect(mockHandleNumericChange).toHaveBeenCalledTimes(1)
    );
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$2.00");

    const input = screen.getByDisplayValue("$2.00") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();
    input.select();
    await userEvent.paste("1000.99");

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(2);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$1,000.99");
  });

  it("Ctrl+a selects the field value", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        formatter={formatCurrency("en-US")}
        numericValue="56.33"
        onNumericChange={mockHandleNumericChange}
      />
    );

    // The `numericValue` is formatted on the first render. After this format is
    // complete `onNumericChange` is invoked from a `setTimeout`; for that
    // reason we need to use `waitFor` here to check and see when that initial
    // format is completed.
    await waitFor(() =>
      expect(mockHandleNumericChange).toHaveBeenCalledTimes(1)
    );
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$56.33");

    const input = screen.getByDisplayValue("$56.33") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();

    expect(input.selectionStart).toBe(6);
    expect(input.selectionEnd).toBe(6);

    await userEvent.keyboard("{Control>}a{/Control}");

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$56.33");
  });

  it("cut event clears the field value", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        formatter={formatCurrency("en-US")}
        numericValue="7.98"
        onNumericChange={mockHandleNumericChange}
      />
    );

    // The `numericValue` is formatted on the first render. After this format is
    // complete `onNumericChange` is invoked from a `setTimeout`; for that
    // reason we need to use `waitFor` here to check and see when that initial
    // format is completed.
    await waitFor(() =>
      expect(mockHandleNumericChange).toHaveBeenCalledTimes(1)
    );
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("$7.98");

    const input = screen.getByDisplayValue("$7.98") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();
    input.select();

    // "{Control>}x{/Control}" raises a `cut` event in the browser but not in
    // jsdom, so invoke `userEvent.cut`.
    await userEvent.cut();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(2);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");
  });
});
