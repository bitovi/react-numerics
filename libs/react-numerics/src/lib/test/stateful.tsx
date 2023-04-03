import { useEffect, useState } from "react";
import type { FormattedNumericInputProps } from "../formatted-numeric-input";

/**
 * A wrapper component that maintains the `numericValue` and provides it to the
 * component that is being tested.
 */
export function Stateful<P extends FormattedNumericInputProps>({
  numericValue: propsNumericValue,
  onNumericChange,
  renderChild,
  ...props
}: P & {
  renderChild: (props: P) => JSX.Element;
}) {
  const [numericValue, setNumericValue] =
    useState<FormattedNumericInputProps["numericValue"]>("");

  useEffect(() => {
    setNumericValue(propsNumericValue);
  }, [propsNumericValue]);

  const handleNumericChange: FormattedNumericInputProps["onNumericChange"] =
    value => {
      setNumericValue(value);
      onNumericChange && onNumericChange(value);
    };

  return renderChild({
    ...props,
    numericValue,
    onNumericChange: handleNumericChange
  } as unknown as P);
}
