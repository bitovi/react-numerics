import React, { useRef } from "react";
import { ChangeType } from "./types";

/**
 * Accepts a formatted value to display in a text field and fires a special
 * onChange event that includes additional information about the state of the
 * change.
 * @param props
 */
export const FormattedInput = React.forwardRef<
  HTMLInputElement,
  FormattedInputProps
>(function FormattedInputImpl(
  { formattedValue, onChange, onKeyDown, ...props },
  ref
) {
  const key = useRef<string | null>(null);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { selectionEnd, value } = evt.target;

    // What type of change happened?
    let valueChangeType: ChangeType = "add";
    if (key.current === "Backspace") {
      valueChangeType = "backspace";
    } else if (key.current === "Delete" || key.current === "Del") {
      valueChangeType = "delete";
    }

    if ((selectionEnd ?? value.length) < value.length) {
      valueChangeType = "replace";
    }

    // Truncate the value to the selection end.
    const truncValue = value.substring(0, selectionEnd ?? value.length);

    onChange(truncValue, valueChangeType);
    key.current = null;
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    key.current = evt.key;
    onKeyDown && onKeyDown(evt);
  }

  return (
    <input
      {...props}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      ref={ref}
      value={formattedValue}
    />
  );
});

export interface FormattedInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange" | "ref" | "value"
  > {
  /** The formatted value to display. */
  formattedValue: string;
  /** onChange event with a simplified signature. */
  onChange: (value: string, changeType: ChangeType) => void;
  /** Pass a handler to be notified of key down events. */
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
}
