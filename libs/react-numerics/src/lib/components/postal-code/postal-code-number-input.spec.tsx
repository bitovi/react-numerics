import React from "react";
import { render } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { PostalCodeNumberInput } from "./postal-code-number-input";
// import { createFormattedNumberInputWrapper } from "../../test/wrapper";

describe("PostalCodeNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <PostalCodeNumberInput
        numericValue="22222"
        onNumericChange={jest.fn()}
        inputRef={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("22222");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  });
});
