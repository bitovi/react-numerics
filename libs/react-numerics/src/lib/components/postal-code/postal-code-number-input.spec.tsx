import React from "react";
import { render, screen } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { validateErrorsMap } from "../../validators/validators-types";
import { PostalCodeNumberInput } from "./postal-code-number-input";
import { Stateful } from "../../test/stateful";

describe("PostalCodeNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <PostalCodeNumberInput
        numericValue="22222"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("22222");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <PostalCodeNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("numeric");
      expect(myRef.current.getAttribute("inputmode")).toEqual("numeric");
      expect(myRef.current.hasAttribute("inputmode")).toEqual(true);
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <PostalCodeNumberInput
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

  it("validates on mount", () => {
    render(
      <Stateful
        numericValue="3"
        onNumericChange={jest.fn()}
        renderChild={props => <PostalCodeNumberInput {...props} validate />}
      />
    );

    const input = screen.getByDisplayValue("3") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeInvalid();
    expect(input.validationMessage).toBe(
      validateErrorsMap["INVALID_LESS_THAN_MIN_LENGTH"]
    );
  });

  it("validates on change and blur", async () => {
    const userEvent = userEvents.setup();

    render(
      <Stateful
        numericValue="55555"
        onNumericChange={jest.fn()}
        renderChild={props => <PostalCodeNumberInput {...props} validate />}
      />
    );

    // Valid input to start.
    const input = screen.getByDisplayValue("55555") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toBeValid();

    // Clear the input so the value is an empty string then blur; an empty
    // string is valid.
    await userEvent.clear(input);
    input.blur();
    expect(input).toBeValid();

    // Enter an incomplete value then blur; the input is only set invalid on
    // blur, a string with only three digits is not valid on blur.
    await userEvent.type(input, "765");
    expect(input).toBeValid();

    input.blur();
    expect(input).toBeInvalid();
    expect(input.validationMessage).toBe(
      validateErrorsMap["INVALID_LESS_THAN_MIN_LENGTH"]
    );

    // Now add two more digits then blur; when the input's value is changed the
    // input should be set to a valid state, on blur it should remain valid.
    await userEvent.type(input, "43");
    expect(input).toBeValid();

    input.blur();
    expect(input).toBeValid();
  });
});
