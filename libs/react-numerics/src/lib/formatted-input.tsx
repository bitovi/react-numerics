import React, { useRef } from "react";
import { ChangeType } from "./types";

/**
 * Accepts a formatted value to display in a text field and fires a special
 * onChange event that includes additional information about the state of the
 * change.
 * @param props
 */
export function FormattedInput({
  formattedValue,
  onChange,
  onKeyDown,
  ...props
}: Props) {
  const key = useRef("");

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { selectionEnd, value } = evt.target;

    const valueChangeType =
      key.current === "Backspace"
        ? "backspace"
        : key.current === "Delete" || key.current === "Del"
        ? "delete"
        : selectionEnd < value.length
        ? "replace"
        : "add";

    // Truncate the value to the selection end.
    const truncValue = value.substring(0, selectionEnd);

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
      value={formattedValue}
    />
  );
}

interface Props
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "onChange" | "value"
  > {
  /** The formatted value to display. */
  formattedValue: string;
  /** onChange event with a simplified signature. */
  onChange: (value: string, changeType: ChangeType) => void;
  /** Pass a handler to be notified of key down events. */
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
}
