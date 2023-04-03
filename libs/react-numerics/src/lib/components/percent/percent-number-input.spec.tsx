import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PercentNumberInput } from "./percent-number-input";
import { createFormattedNumberInputWrapper } from "../../test/wrapper";
import { Stateful } from "../../test/stateful";

describe("PercentNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <PercentNumberInput
        numericValue="222"
        onNumericChange={jest.fn()}
        ref={myRef}
      />
    );

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("222%");
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement");
    }
  });

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>();
    render(
      <PercentNumberInput
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
      <PercentNumberInput
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

  it("renders without rounding", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <PercentNumberInput
        numericValue="50.123"
        onNumericChange={handleNumericChange}
      />
    );

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(getByDisplayValue("50.123%")).toBeInTheDocument();
  });

  it("respects the max value", async () => {
    const user = userEvent.setup({ delay: 10 });

    const handleNumericChange = jest.fn();

    const { getAllByPlaceholderText } = render(
      <PercentNumberInput
        max={100}
        numericValue=""
        onNumericChange={handleNumericChange}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper()
      }
    );

    const elem = (getAllByPlaceholderText("TEST") as HTMLInputElement[])[0];
    expect(elem).toBeInTheDocument();

    await user.type(elem, "1");
    expect(handleNumericChange).toHaveBeenCalledWith("1");
    expect(elem).toHaveValue("1");

    await user.type(elem, "0");
    expect(handleNumericChange).toHaveBeenCalledTimes(2);
    expect(handleNumericChange).toHaveBeenLastCalledWith("10");
    expect(elem).toHaveValue("10");

    await user.type(elem, "1");

    expect(handleNumericChange).toHaveBeenCalledTimes(2);
    expect(elem).toHaveValue("10");
  });

  it("respects the min value", async () => {
    const user = userEvent.setup({ delay: 10 });

    const handleNumericChange = jest.fn();

    const { getAllByPlaceholderText } = render(
      <PercentNumberInput
        min={-1}
        numericValue=""
        onNumericChange={handleNumericChange}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper()
      }
    );

    const elem = (getAllByPlaceholderText("TEST") as HTMLInputElement[])[0];
    expect(elem).toBeInTheDocument();

    await user.type(elem, "-");
    expect(handleNumericChange).toHaveBeenCalledWith("-");
    expect(elem).toHaveValue("-");

    await user.type(elem, "2");
    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(elem).toHaveValue("-");
  });

  it("adds a percent symbol on paste", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();

    const { getAllByPlaceholderText } = render(
      <PercentNumberInput
        min={0}
        numericValue=""
        onNumericChange={handleNumericChange}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper()
      }
    );

    const elem = (getAllByPlaceholderText("TEST") as HTMLInputElement[])[0];
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveDisplayValue("");

    elem.focus();

    await user.paste("98");
    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(elem).toHaveValue("98%");
  });

  it("does not add a percent following backspace", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();

    const { getAllByPlaceholderText } = render(
      <PercentNumberInput
        numericValue=""
        onNumericChange={handleNumericChange}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper("45")
      }
    );

    const elem = (getAllByPlaceholderText("TEST") as HTMLInputElement[])[0];
    expect(elem).toBeInTheDocument();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("45%");

    elem.focus();
    expect(elem).toHaveFocus();

    await user.type(elem, "{Backspace}{Backspace}");
    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(elem).toHaveValue("4");

    await user.type(elem, "8");
    expect(handleNumericChange).toHaveBeenCalledTimes(2);
    expect(elem).toHaveValue("48");

    await user.tab();
    expect(elem).not.toHaveFocus();
    expect(handleNumericChange).toHaveBeenCalledTimes(2);
    expect(elem).toHaveValue("48%");
  });

  it("does not allow a negative when the min is 0 or greater", async () => {
    const user = userEvent.setup();
    const handleNumericChange = jest.fn();
    render(
      <Stateful
        min={0}
        numericValue="-23"
        onNumericChange={handleNumericChange}
        placeholder="TEST"
        renderChild={props => <PercentNumberInput {...props} />}
      />
    );

    const elem = (
      screen.getAllByPlaceholderText("TEST") as HTMLInputElement[]
    )[0];

    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue("");
    expect(handleNumericChange).toHaveBeenCalledTimes(0);

    elem.focus();
    expect(elem).toHaveFocus();

    await user.type(elem, "0");

    expect(handleNumericChange).toHaveBeenCalledTimes(1);
    expect(handleNumericChange).toHaveBeenLastCalledWith("0");
    expect(elem).toHaveValue("0");
  });
});
