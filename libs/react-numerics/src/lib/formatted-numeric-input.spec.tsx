import { render, screen } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { filterToSignedFloat } from "./filters/filters";
import {
  formatCurrency,
  formatPostalCodeNumber
} from "./formatters/formatters";
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

  it("cleared field sets to 0 on blur", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();
    const mockHandleBlur = jest.fn(async (evt, setNumericValue) =>
      setNumericValue("0")
    );

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatCurrency("en-US")}
        numericValue="0"
        onBlur={mockHandleBlur}
        onNumericChange={mockHandleNumericChange}
        renderChild={props => <FormattedNumericInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$0");
    expect(input).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(0);

    await userEvent.clear(input);

    const inputAfterClear = screen.getByDisplayValue("");
    expect(inputAfterClear).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");

    inputAfterClear.blur();

    expect(mockHandleBlur).toHaveBeenCalledTimes(1);
    expect(mockHandleBlur).toHaveBeenLastCalledWith(
      expect.any(Object),
      expect.any(Function)
    );

    // We've triggered a render cycle inside `mockHandleBlur` so we need to let
    // that cycle complete.
    await new Promise<void>(resolve =>
      setTimeout(() => {
        resolve();
      }, 1)
    );

    const inputAfterBlur = screen.getByDisplayValue("$0");
    expect(inputAfterBlur).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");
  });

  it("cleared field accepts input of 0", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatCurrency("en-US")}
        numericValue="0"
        onNumericChange={mockHandleNumericChange}
        renderChild={props => <FormattedNumericInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$0");
    expect(input).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(0);

    await userEvent.clear(input);

    const inputAfterClear = screen.getByDisplayValue("");
    expect(inputAfterClear).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");

    await userEvent.type(inputAfterClear, "0");

    expect(screen.getByDisplayValue("$0")).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(2);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("0");
  });

  it("validates with a provided pattern", () => {
    const mockHandleNumericChange = jest.fn();
    const mockHandleInvalid = jest.fn();

    const { rerender } = render(
      <FormattedNumericInput
        formatter={formatPostalCodeNumber}
        onInvalid={mockHandleInvalid}
        numericValue="333"
        onNumericChange={mockHandleNumericChange}
        validationPattern={() => "^[0-9]{5,5}$"}
      />,
      {
        wrapper: ({ children }) => (
          <form action="/" name="FORM">
            {children}
          </form>
        )
      }
    );

    const input = screen.getByDisplayValue("333") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("pattern", "^[0-9]{5,5}$");

    const form = screen.getByRole("form") as HTMLFormElement;
    expect(form).toBeInTheDocument();

    let checkValidityResult = form.checkValidity();
    expect(checkValidityResult).toBe(false);
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);
    expect(mockHandleInvalid).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: input })
    );

    rerender(
      <FormattedNumericInput
        formatter={formatPostalCodeNumber}
        onInvalid={mockHandleInvalid}
        numericValue="33333"
        onNumericChange={mockHandleNumericChange}
        validationPattern={() => "^[0-9]{5,5}$"}
      />
    );

    checkValidityResult = form.checkValidity();
    expect(checkValidityResult).toBe(true);
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);
  });
});
