import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BigNumber from "bignumber.js";
import { FormattedNumberInput } from "./formatted-number-input";
import { createFormattedNumberInputWrapper } from "./test/wrapper";

describe("FormattedNumberInput: initial value", () => {
  it("default integer value", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="123"
        onNumericChange={handleNumericChange}
      />
    );

    getByDisplayValue("123");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("groups a large value", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="987654321.0001"
        onNumericChange={handleNumericChange}
      />
    );

    getByDisplayValue("987,654,321.0001");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("default float value", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="3.14"
        onNumericChange={handleNumericChange}
      />
    );

    getByDisplayValue("3.14");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("truncated float value -> down", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        decimalPlaces={1}
        numericValue="1.01"
        onNumericChange={handleNumericChange}
      />
    );

    getByDisplayValue("1.0");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("truncated float value; no roundingMode", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        decimalPlaces={1}
        numericValue="10.09"
        onNumericChange={handleNumericChange}
      />
    );

    getByDisplayValue("10.1");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("truncated float value; round half up -> down", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        decimalPlaces={1}
        numericValue="2.04"
        onNumericChange={handleNumericChange}
        roundingMode={BigNumber.ROUND_HALF_UP}
      />
    );

    getByDisplayValue("2.0");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("truncated float value; round half up -> up", () => {
    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        decimalPlaces={1}
        numericValue="3.06"
        onNumericChange={handleNumericChange}
        roundingMode={BigNumber.ROUND_HALF_UP}
      />
    );

    getByDisplayValue("3.1");

    expect(handleNumericChange).toHaveBeenCalledTimes(0);
  });

  it("throws if the max value is less than the min value", () => {
    expect(() => {
      render(
        <FormattedNumberInput
          max={1}
          min={2}
          numericValue="100"
          onNumericChange={jest.fn()}
          placeholder="TEST"
        />
      );
    }).toThrowError(
      "formatNumberString: Max value (1) is less than min value (2)."
    );
  });
});

describe("FormattedNumberInput: enter value", () => {
  it("replaces value on type", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="999"
        onNumericChange={handleNumericChange}
      />
    );

    const elem = getByDisplayValue("999") as HTMLInputElement;

    expect(handleNumericChange).toHaveBeenCalledTimes(0);

    const position = 0;
    elem.setSelectionRange(position, position);
    await user.type(elem, "1", { initialSelectionStart: position });

    expect(handleNumericChange).toHaveBeenCalledWith("1");
  });

  it("replaces mid value on type", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="54321"
        onNumericChange={handleNumericChange}
      />
    );

    const elem = getByDisplayValue("54,321") as HTMLInputElement;

    expect(handleNumericChange).toHaveBeenCalledTimes(0);

    const position = 2;
    elem.setSelectionRange(position, position);
    await user.type(elem, "0", { initialSelectionStart: position });

    expect(handleNumericChange).toHaveBeenCalledWith("540");
  });

  it("allows a typed '-' when the min is not set", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();

    const { getByPlaceholderText } = render(
      <FormattedNumberInput
        numericValue=""
        onNumericChange={null}
        placeholder="TEST"
      />,
      { wrapper: createFormattedNumberInputWrapper(handleNumericChange) }
    );

    const elem = getByPlaceholderText("TEST") as HTMLInputElement;
    expect(elem).toBeInTheDocument();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("");

    await user.type(elem, "-");
    expect(handleNumericChange).toHaveBeenCalledWith("-");
    expect(elem).toHaveDisplayValue("-");

    await user.type(elem, "135");
    expect(handleNumericChange).toHaveBeenLastCalledWith("-135");
    expect(elem).toHaveDisplayValue("-135");
  });

  it("allows a typed '-' when the min is less than 0", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();

    const { getByPlaceholderText } = render(
      <FormattedNumberInput
        min={-0.1}
        numericValue=""
        onNumericChange={null}
        placeholder="TEST"
      />,
      { wrapper: createFormattedNumberInputWrapper(handleNumericChange) }
    );

    const elem = getByPlaceholderText("TEST") as HTMLInputElement;
    expect(elem).toBeInTheDocument();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("");

    await user.type(elem, "-");
    expect(handleNumericChange).toHaveBeenCalledWith("-");
    expect(elem).toHaveDisplayValue("-");

    await user.type(elem, "0.1");
    expect(handleNumericChange).toHaveBeenLastCalledWith("-0.1");
    expect(elem).toHaveDisplayValue("-0.1");
  });

  it("ignores a typed '-' when the min is greater than or equal to 0", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();

    const { getByPlaceholderText } = render(
      <FormattedNumberInput
        min={0}
        numericValue=""
        onNumericChange={null}
        placeholder="TEST"
      />,
      { wrapper: createFormattedNumberInputWrapper(handleNumericChange) }
    );

    const elem = getByPlaceholderText("TEST") as HTMLInputElement;
    expect(elem).toBeInTheDocument();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("");

    await user.type(elem, "-");
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("");

    await user.type(elem, "3");
    expect(handleNumericChange).toHaveBeenCalledWith("3");
    expect(elem).toHaveDisplayValue("3");
  });
});

describe("FormattedNumberInput: format onBlur", () => {
  it("removes trailing decimal", async () => {
    const user = userEvent.setup();

    const handleNumericChange = jest.fn();
    const { getByDisplayValue } = render(
      <FormattedNumberInput
        numericValue="0."
        onNumericChange={handleNumericChange}
      />
    );

    const elem = getByDisplayValue("0.", { exact: true }) as HTMLInputElement;
    expect(elem).toBeInTheDocument();

    elem.focus();
    expect(elem).toHaveFocus();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);

    await user.tab();

    expect(elem).not.toHaveFocus();
    expect(handleNumericChange).toHaveBeenCalledTimes(0);
    expect(elem).toHaveDisplayValue("0");
  });
});
