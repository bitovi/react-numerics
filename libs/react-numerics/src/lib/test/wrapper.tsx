import React, { useState } from "react";
import { act } from "@testing-library/react";
import { FormattedNumberInput } from "../formatted-number-input";

/**
 * Create a Wrapper component that maintains the `numericValue` and provides it
 * to the component that is being tested.
 * @param initialNumericValue The initial value for the input, defaults to an
 * empty string.
 */
export function createFormattedNumberInputWrapper(initialNumericValue = "") {
  return function Wrapper({ children }: WrapperProps) {
    const [numericValue, setNumericValue] = useState<string>();

    const cloneProps: ChildrenProps = {
      numericValue: numericValue ?? initialNumericValue,
      onNumericChange: value => {
        act(() => {
          setNumericValue(value);
        });

        children?.props?.onNumericChange &&
          children.props.onNumericChange(value);
      }
    };

    return React.cloneElement(children as React.ReactElement, cloneProps);
  };
}

type ChildrenProps = Pick<
  React.ComponentPropsWithoutRef<typeof FormattedNumberInput>,
  "numericValue" | "onNumericChange"
>;

interface WrapperProps {
  children: React.ReactElement<ChildrenProps>;
}
