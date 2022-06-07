import { act, render, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PercentNumberInput } from "./percent-number-input";
import { createFormattedNumberInputWrapper } from "../../test/wrapper";

describe("PercentNumberInput", () => {
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
        onNumericChange={null}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper(handleNumericChange)
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
        onNumericChange={null}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper(handleNumericChange)
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
        onNumericChange={null}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper(handleNumericChange)
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
        onNumericChange={null}
        placeholder="TEST"
      />,
      {
        wrapper: createFormattedNumberInputWrapper(handleNumericChange, "45")
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

    let getAllByPlaceholderText: RenderResult["getAllByPlaceholderText"];

    // This render is wrapped in `act` because the initial render of
    // `PercentNumberInput` will cause `onNumericChange` to be invoked in a
    // `setTimeout` callback. It is invoked because the min prop value is "0"
    // and the initial provided value is "-23".
    await act(() => {
      getAllByPlaceholderText = render(
        <PercentNumberInput
          min={0}
          numericValue=""
          onNumericChange={null}
          placeholder="TEST"
        />,
        {
          wrapper: createFormattedNumberInputWrapper(handleNumericChange, "-23")
        }
      ).getAllByPlaceholderText;

      // Queue up a request that will resolve after `onNumericChange` is
      // invoked.
      return new Promise<void>(resolve => setTimeout(() => resolve(), 0));
    });

    const elem = (getAllByPlaceholderText("TEST") as HTMLInputElement[])[0];

    expect(elem).toBeInTheDocument();
    expect(handleNumericChange).toHaveBeenCalledWith("");
    expect(elem).toHaveDisplayValue("");

    elem.focus();
    expect(elem).toHaveFocus();

    await user.type(elem, "0");
    expect(handleNumericChange).toHaveBeenLastCalledWith("0");
    expect(elem).toHaveValue("0");
  });
});
