import { render, screen } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { filterToSignedFloat } from "./filters/filters";
import {
  formatCurrency,
  formatPostalCodeNumber
} from "./formatters/formatters";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "./formatted-numeric-input";
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

  it("validates on mount", () => {
    const mockHandleInvalid = jest.fn();
    const mockValidate = jest.fn<
      ReturnType<Required<FormattedNumericInputProps>["validator"]>,
      Parameters<Required<FormattedNumericInputProps>["validator"]>
    >((numeric, context) =>
      context === "mount"
        ? 1 <= numeric.length && numeric.length < 5
          ? { customValidity: "TOO_SHORT_MOUNT" }
          : { customValidity: "" }
        : undefined
    );

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatPostalCodeNumber}
        numericValue="987"
        onInvalid={mockHandleInvalid}
        onNumericChange={jest.fn()}
        validator={mockValidate}
        renderChild={props => (
          <form action="/" name="FORM">
            <FormattedNumericInput {...props} />
          </form>
        )}
      />
    );

    const input = screen.getByDisplayValue("987") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeInvalid();
    expect(input.validationMessage).toEqual("TOO_SHORT_MOUNT");
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenLastCalledWith("987", "mount");
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);
  });

  it("validates on blur", async () => {
    const userEvent = userEvents.setup();

    const mockHandleInvalid = jest.fn();
    const mockValidate = jest.fn<
      ReturnType<Required<FormattedNumericInputProps>["validator"]>,
      Parameters<Required<FormattedNumericInputProps>["validator"]>
    >((numeric, context) =>
      context === "blur"
        ? 1 <= numeric.length && numeric.length < 5
          ? { customValidity: "TOO_SHORT_BLUR" }
          : { customValidity: "" }
        : undefined
    );

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatPostalCodeNumber}
        numericValue=""
        onInvalid={mockHandleInvalid}
        onNumericChange={jest.fn()}
        validator={mockValidate}
        renderChild={props => (
          <form action="/" name="FORM">
            <FormattedNumericInput {...props} />
            <button>Submit</button>
          </form>
        )}
      />
    );

    // Verify initial state, should not be any validation errors.
    const input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeValid();
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockHandleInvalid).toHaveBeenCalledTimes(0);

    // Type a single character then invoke `blur` on the input; there should be
    // validation errors because there is only 1 character and exactly 5 are
    // required.
    await userEvent.type(input, "1");
    input.blur();
    expect(input.validationMessage).toEqual("TOO_SHORT_BLUR");
    expect(input).toBeInvalid();
    expect(mockValidate).toHaveBeenCalledTimes(3);
    expect(mockValidate).toHaveBeenLastCalledWith("1", "blur");
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);

    // Enter characters to create a zip code with the required 5 characters then
    // verify that the input is still invalid because ti hasn't lost focus yet.
    await userEvent.type(input, "3579");
    expect(input.validationMessage).toEqual("TOO_SHORT_BLUR");
    expect(input).toBeInvalid();

    // Cause the input to lose focus and verify that the input is valid.
    input.blur();
    expect(input.validationMessage).toEqual("");
    expect(input).toBeValid();
  });

  it("validates on change", async () => {
    const userEvent = userEvents.setup();

    const mockHandleInvalid = jest.fn();
    const mockValidate = jest.fn<
      ReturnType<Required<FormattedNumericInputProps>["validator"]>,
      Parameters<Required<FormattedNumericInputProps>["validator"]>
    >((numeric, context) =>
      context === "change"
        ? 1 <= numeric.length && numeric.length < 5
          ? { customValidity: "TOO_SHORT_CHANGE" }
          : { customValidity: "" }
        : undefined
    );

    render(
      <Stateful
        filter={filterToSignedFloat}
        formatter={formatPostalCodeNumber}
        numericValue=""
        onInvalid={mockHandleInvalid}
        onNumericChange={jest.fn()}
        validator={mockValidate}
        renderChild={props => (
          <form action="/" name="FORM">
            <FormattedNumericInput {...props} />
          </form>
        )}
      />
    );

    const input = screen.getByDisplayValue("") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeValid();
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockHandleInvalid).toHaveBeenCalledTimes(0);

    // This type request should invoke the `validator` function and set an error
    // message because the zip code is only 1 character long.
    await userEvent.type(input, "9");

    expect(input.validationMessage).toEqual("TOO_SHORT_CHANGE");
    expect(input).toBeInvalid();
    expect(mockValidate).toHaveBeenCalledTimes(2);
    expect(mockValidate).toHaveBeenLastCalledWith("9", "change");
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);

    // This type request should invoke the `validator` function and clear the
    // error message because the zip code is 5 characters long.
    await userEvent.type(input, "7531");

    expect(input.validationMessage).toEqual("");
    expect(input).toBeValid();
    expect(mockValidate).toHaveBeenCalledTimes(6);
    expect(mockValidate).toHaveBeenLastCalledWith("97531", "change");
    expect(mockHandleInvalid).toHaveBeenCalledTimes(1);
  });
});
