import { render, screen } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { filterToSignedFloat } from "./filters/filters";
import { formatCurrency } from "./formatters/formatters";
import { FormattedNumericInput } from "./formatted-numeric-input";
import { Stateful } from "./test/stateful";

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

    const input = screen.getByDisplayValue("$1.23") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it("accepts a pasted value and raises onNumericChange", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        filter={filterToSignedFloat}
        formatter={formatCurrency("en-US")}
        numericValue="2.00"
        onNumericChange={mockHandleNumericChange}
      />
    );

    const input = screen.getByDisplayValue("$2.00") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();
    input.select();
    await userEvent.paste("1000.99");

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("1000.99");
  });

  it("Ctrl+a selects the field value", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        filter={filterToSignedFloat}
        formatter={formatCurrency("en-US")}
        numericValue="56.33"
        onNumericChange={mockHandleNumericChange}
      />
    );

    const input = screen.getByDisplayValue("$56.33") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();

    expect(input.selectionStart).toBe(6);
    expect(input.selectionEnd).toBe(6);

    await userEvent.keyboard("{Control>}a{/Control}");

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("Backspace clears the field value", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();
    const formatter = formatCurrency("en-US");

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatter}
        numericValue="56.33"
        onNumericChange={mockHandleNumericChange}
        renderChild={props => <FormattedNumericInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$56.33") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();
    input.select();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(0);

    await userEvent.keyboard("{Backspace}");

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");
  });

  it("cut event clears the field value", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <FormattedNumericInput
        filter={filterToSignedFloat}
        formatter={formatCurrency("en-US")}
        numericValue="7.98"
        onNumericChange={mockHandleNumericChange}
      />
    );

    const input = screen.getByDisplayValue("$7.98") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    input.focus();
    input.select();

    // "{Control>}x{/Control}" raises a `cut` event in the browser but not in
    // jsdom, so invoke `userEvent.cut`.
    await userEvent.cut();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");
  });
});
