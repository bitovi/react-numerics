import React from "react";
import { render } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { TelephoneNumberInput } from "./telephone-number-input";
// import { createFormattedNumberInputWrapper } from "../../test/wrapper";

describe("TelephoneNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <TelephoneNumberInput
        numericValue="2222222222"
        onNumericChange={jest.fn()}
        inputRef={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("(222) 222-2222");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  });

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <TelephoneNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        inputRef={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("tel");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  });

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <TelephoneNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        inputRef={myRef}
        inputMode="text"
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("text");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  });
});
