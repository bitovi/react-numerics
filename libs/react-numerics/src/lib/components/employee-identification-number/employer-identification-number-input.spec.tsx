import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployerIdentificationNumberInput } from "./employer-identification-number-input";

describe("EmployerIdentificationNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <EmployerIdentificationNumberInput
        numericValue="222"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("22-2");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <EmployerIdentificationNumberInput
        numericValue="222.333"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("numeric");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <EmployerIdentificationNumberInput
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

  it("renders", () => {
    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <EmployerIdentificationNumberInput
        numericValue="227777777"
        onNumericChange={handleChange}
      />
    );

    getByDisplayValue("22-7777777");
    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("ignores appended characters", async () => {
    const user = userEvent.setup();

    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <EmployerIdentificationNumberInput
        numericValue="227777777"
        onNumericChange={handleChange}
      />
    );

    const elem = getByDisplayValue("22-7777777") as HTMLInputElement;

    expect(handleChange).toHaveBeenCalledTimes(0);

    await user.type(elem, "9");

    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("formats prepended characters", async () => {
    const user = userEvent.setup();

    const handleChange = jest.fn();
    const { getByDisplayValue, rerender } = render(
      <EmployerIdentificationNumberInput
        numericValue="123456789"
        onNumericChange={handleChange}
      />
    );

    const elem = getByDisplayValue("12-3456789") as HTMLInputElement;

    expect(handleChange).toHaveBeenCalledTimes(0);

    const position = 0;
    elem.setSelectionRange(position, position);
    await user.type(elem, "9", {
      initialSelectionStart: position,
      initialSelectionEnd: position
    });

    expect(handleChange).toHaveBeenCalledWith("9");

    // The owner of EmployerIdentificationNumberInput control is responsible for
    // maintaining and providing the numeric value, so even though it goes
    // against testing-library/react norms we use rerender to set the updated
    // value which tests a different path in EmployerIdentificationNumberInput.
    rerender(
      <EmployerIdentificationNumberInput
        numericValue={handleChange.mock.calls[0][0]}
        onNumericChange={handleChange}
      />
    );

    expect(elem.value).toEqual("9");
  });

  it("formats before non-numeric characters", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();
    const { getByDisplayValue, rerender } = render(
      <EmployerIdentificationNumberInput
        numericValue="987654321"
        onNumericChange={handleNumericChange}
      />
    );

    const elem = getByDisplayValue("98-7654321") as HTMLInputElement;

    expect(handleNumericChange).toHaveBeenCalledTimes(0);

    const position = 2;
    elem.setSelectionRange(position, position);
    await user.type(elem, "0", {
      initialSelectionStart: position,
      initialSelectionEnd: position
    });

    expect(handleNumericChange).toHaveBeenCalledWith("980");

    // The owner of EmployerIdentificationNumberInput control is responsible for
    // maintaining and providing the numeric value, so even though it goes
    // against testing-library/react norms we use rerender to set the updated
    // value which tests a different path in EmployerIdentificationNumberInput.
    rerender(
      <EmployerIdentificationNumberInput
        numericValue={handleNumericChange.mock.calls[0][0]}
        onNumericChange={handleNumericChange}
      />
    );

    expect(elem.value).toEqual("98-0");
  });

  it("formats after non-numeric characters", async () => {
    const user = userEvent.setup();

    const handleChange = jest.fn();
    const { getByDisplayValue, rerender } = render(
      <EmployerIdentificationNumberInput
        numericValue="227654321"
        onNumericChange={handleChange}
      />
    );

    const elem = getByDisplayValue("22-7654321") as HTMLInputElement;

    expect(handleChange).toHaveBeenCalledTimes(0);

    const position = 3;
    elem.setSelectionRange(position, position);
    await user.type(elem, "0", {
      initialSelectionStart: position,
      initialSelectionEnd: position
    });

    expect(handleChange).toHaveBeenCalledWith("220");

    // The owner of EmployerIdentificationNumberInput control is responsible for
    // maintaining and providing the numeric value, so even though it goes
    // against testing-library/react norms we use rerender to set the updated
    // value which tests a different path in EmployerIdentificationNumberInput.
    rerender(
      <EmployerIdentificationNumberInput
        numericValue={handleChange.mock.calls[0][0]}
        onNumericChange={handleChange}
      />
    );

    expect(elem.value).toEqual("22-0");
  });

  it("ignores non-numeric characters", async () => {
    const user = userEvent.setup();

    const handleChange = jest.fn();
    const { getByDisplayValue } = render(
      <EmployerIdentificationNumberInput
        numericValue="1"
        onNumericChange={handleChange}
      />
    );

    const elem = getByDisplayValue("1") as HTMLInputElement;

    expect(handleChange).toHaveBeenCalledTimes(0);

    await user.type(elem, "-");

    expect(handleChange).toHaveBeenCalledTimes(0);
  });

  it("rejects a string that is too long", async () => {
    const handleNumericChange = jest.fn();

    // onNumericChange invoked because the initial numericValue prop value is
    // "5432109876" which is too long for an EIN.
    render(
      <EmployerIdentificationNumberInput
        numericValue="5432109876"
        onNumericChange={handleNumericChange}
        placeholder="TEST"
      />
    );

    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(handleNumericChange).toHaveBeenLastCalledWith("543210987");
  });
});
