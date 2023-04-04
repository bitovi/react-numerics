import { Dispatch, SetStateAction, useEffect, useState } from "react";
import type { FormattedNumericInputProps } from "../formatted-numeric-input";

/**
 * A wrapper component that maintains the `numericValue` and provides it to the
 * component that is being tested.
 */
export function Stateful<P extends Omit<FormattedNumericInputProps, "onBlur">>({
  numericValue: propsNumericValue,
  onBlur,
  onNumericChange,
  renderChild,
  ...props
}: P & {
  /** Provides the normal focus event and a second param to set the
   * `numericValue` of the child. */
  onBlur?: (
    evt: React.FocusEvent,
    setNumericValue: Dispatch<SetStateAction<string>>
  ) => void;
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

  const handleBlur: FormattedNumericInputProps["onBlur"] = evt => {
    onBlur && onBlur(evt, setNumericValue);
  };

  return renderChild({
    ...props,
    numericValue,
    onBlur: handleBlur,
    onNumericChange: handleNumericChange
  } as unknown as P);
}
