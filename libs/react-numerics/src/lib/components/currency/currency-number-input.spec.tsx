import React from "react";
import { render, screen } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { validateErrorsMap } from "../../validators/validators-types";
import {
  CurrencyNumberInput,
  CurrencyNumberInputValidationProps
} from "./currency-number-input";
import { Stateful } from "../../test/stateful";

describe("CurrencyNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <CurrencyNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("$222.33");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <CurrencyNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("decimal");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <CurrencyNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        ref={myRef}
        inputMode="text"
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("text");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

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
    const user = userEvents.setup();

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

  it("cleared field accepts input of 0", async () => {
    const userEvent = userEvents.setup();
    const mockHandleNumericChange = jest.fn();

    render(
      <Stateful
        numericValue="0"
        onNumericChange={mockHandleNumericChange}
        renderChild={props => <CurrencyNumberInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$0");
    expect(input).toBeInTheDocument();

    // The padding stage triggers this invocation.
    expect(mockHandleNumericChange).toHaveBeenCalledTimes(1);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("0");

    await userEvent.clear(input);

    const inputAfterClear = screen.getByDisplayValue("");
    expect(inputAfterClear).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(2);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("");

    await userEvent.type(inputAfterClear, "0");

    expect(screen.getByDisplayValue("$0")).toBeInTheDocument();

    expect(mockHandleNumericChange).toHaveBeenCalledTimes(3);
    expect(mockHandleNumericChange).toHaveBeenLastCalledWith("0");
  });

  it("will validate input", async () => {
    const userEvent = userEvents.setup();

    const props: CurrencyNumberInputValidationProps = {
      min: 10,
      numericValue: "0",
      onInvalid: jest.fn(),
      onNumericChange: jest.fn(),
      validate: true
    };

    render(
      <Stateful
        {...props}
        renderChild={props => <CurrencyNumberInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$0") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeValid();
    await userEvent.clear(input);

    await userEvent.type(input, "9");
    expect(input).toHaveValue("$9");
    expect(props.onInvalid).toHaveBeenCalledTimes(0);
    expect(input).toBeValid();

    input.blur();
    expect(props.onInvalid).toHaveBeenCalledTimes(1);
    expect(props.onInvalid).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: input })
    );
    expect(input).toBeInvalid(); // This will raise `onInvalid` again.
    expect(input.validationMessage).toBe(
      validateErrorsMap["INVALID_LESS_THAN_MIN_VALUE"]
    );

    await userEvent.clear(input);
    await userEvent.type(input, "1");
    expect(input).toBeValid();

    await userEvent.type(input, "0");
    expect(input).toHaveValue("$10");
    expect(input).toBeValid();

    input.blur();
    expect(input).toBeValid();
  });

  it("will validate input with a custom validity message", async () => {
    const userEvent = userEvents.setup();

    const updateCustomValidity = jest.fn<
      ReturnType<
        Required<CurrencyNumberInputValidationProps>["updateCustomValidity"]
      >,
      Parameters<
        Required<CurrencyNumberInputValidationProps>["updateCustomValidity"]
      >
    >((number, context, error) => {
      // A custom validity message is provided for "INVALID_LESS_THAN_MIN."
      return error?.customValidity === "INVALID_LESS_THAN_MIN_VALUE"
        ? { ...error, customValidity: `${number} is not enough money.` }
        : error;
    });

    const props: CurrencyNumberInputValidationProps = {
      min: 7,
      numericValue: "0",
      onInvalid: jest.fn(),
      onNumericChange: jest.fn(),
      updateCustomValidity,
      validate: true
    };

    render(
      <Stateful
        {...props}
        renderChild={props => <CurrencyNumberInput {...props} />}
      />
    );

    // Validity invoked for "mount."
    expect(props.updateCustomValidity).toHaveBeenCalledTimes(1);
    expect(props.updateCustomValidity).toHaveBeenLastCalledWith(
      "",
      {
        min: 7,
        type: "mount",
        updateCustomValidity: expect.any(Function)
      },
      undefined
    );

    const input = screen.getByDisplayValue("$0") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeValid();

    // Validity invoked for "change."
    await userEvent.clear(input);
    expect(props.updateCustomValidity).toHaveBeenCalledTimes(2);
    expect(props.updateCustomValidity).toHaveBeenLastCalledWith(
      "",
      {
        min: 7,
        type: "change",
        updateCustomValidity: expect.any(Function)
      },
      { customValidity: "", report: true }
    );

    // Validity invoked for "change."
    await userEvent.type(input, "6");
    expect(props.updateCustomValidity).toHaveBeenCalledTimes(3);
    expect(props.updateCustomValidity).toHaveBeenLastCalledWith(
      "6",
      {
        min: 7,
        type: "change",
        updateCustomValidity: expect.any(Function)
      },
      { customValidity: "", report: true }
    );
    expect(input).toHaveValue("$6");
    expect(props.onInvalid).toHaveBeenCalledTimes(0);
    expect(input).toBeValid();

    // Validity invoked for "blur."
    input.blur();
    expect(props.updateCustomValidity).toHaveBeenCalledTimes(4);
    expect(props.updateCustomValidity).toHaveBeenLastCalledWith(
      "6",
      {
        min: 7,
        type: "blur",
        updateCustomValidity: expect.any(Function)
      },
      { customValidity: "INVALID_LESS_THAN_MIN_VALUE", report: true }
    );
    expect(props.onInvalid).toHaveBeenCalledTimes(1);
    expect(props.onInvalid).toHaveBeenLastCalledWith(
      expect.objectContaining({ target: input })
    );
    expect(input).toBeInvalid(); // This will raise `onInvalid` again.
    expect(input.validationMessage).toBe("6 is not enough money.");
  });

  it("validates input if `validate` is false but `updateCustomValidity` is provided", () => {
    const updateCustomValidity = jest
      .fn<
        ReturnType<
          Required<CurrencyNumberInputValidationProps>["updateCustomValidity"]
        >,
        Parameters<
          Required<CurrencyNumberInputValidationProps>["updateCustomValidity"]
        >
      >()
      .mockReturnValue({
        customValidity: "CUSTOM_VALIDATION_MESSAGE",
        report: true
      });

    const props: CurrencyNumberInputValidationProps = {
      min: 33,
      numericValue: "32.99",
      onInvalid: jest.fn(),
      onNumericChange: jest.fn(),
      updateCustomValidity,
      validate: false
    };

    render(
      <Stateful
        {...props}
        renderChild={props => <CurrencyNumberInput {...props} />}
      />
    );

    const input = screen.getByDisplayValue("$32.99") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(props.onInvalid).toHaveBeenCalledTimes(1);
    expect(input).toBeInvalid(); // This will raise `onInvalid` again.
    expect(input.validationMessage).toBe("CUSTOM_VALIDATION_MESSAGE");
  });
});
