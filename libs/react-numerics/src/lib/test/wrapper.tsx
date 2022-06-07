import React, { useState } from "react";
import { FormattedNumberInput } from "../formatted-number-input";

/**
 * Create a Wrapper component that maintains the `numericValue` and provides it
 * to the component that is being tested.
 * @param handleNumericChange Invoked when the numericValue in the child
 * changes.
 * @param initialNumericValue The initial value for the input, defaults to an
 * empty string.
 */
export function createFormattedNumberInputWrapper(
  handleNumericChange: jest.Mock,
  initialNumericValue = ""
) {
  return function Wrapper({ children }: React.PropsWithChildren<never>) {
    const [numericValue, setNumericValue] =
      useState<string>(initialNumericValue);

    handleNumericChange.mockImplementation(value => setNumericValue(value));

    const cloneProps: Pick<
      React.ComponentPropsWithoutRef<typeof FormattedNumberInput>,
      "numericValue" | "onNumericChange"
    > = {
      numericValue,
      onNumericChange: handleNumericChange
    };

    return React.cloneElement(children as any, cloneProps);
  };
}
