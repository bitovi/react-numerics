import React, { useCallback, useEffect, useRef, useState } from "react";
import { Filter } from "./filters/filters";
import { Formatter } from "./formatters/formatters";
import { Converter } from "./converters/converters";
import {
  FormattedInput,
  FormattedInputProps as FormattedInputPropsImported
} from "./formatted-input";
import type { Validator } from "./validators/validators-types";

/**
 * Expects a `numericValue` string containing either only number characters or
 * only characters that can be used to represent a number.
 * @see {@link FormattedNumberInput} for number-like numerics.
 * @description `numericValue` will be formatted for display. The owner will be
 * notified when the numeric string value changes by `onNumericChange`. If the
 * numericValue represents a number like a float or integer it must be formatted
 * in the en-US locale, i.e. uses a "." to separate the whole from the
 * fractional part.
 *
 * For example, feed in a string like "1234567890" with the correct filters and
 * formatters (e.g. US telephone) and it will be displayed as "(123) 456-7890".
 *
 * Or a number like "3.14" with the locale set to de-DE will be displayed as
 * "3,15".
 * @param props Props for this component.
 */
export const FormattedNumericInput = React.forwardRef<
  HTMLInputElement,
  FormattedNumericInputProps
>(function FormattedNumericInputImpl(
  {
    converter = v => v,
    filter = v => v,
    formatter = (v: string) => v,
    onBlur,
    onNumericChange,
    numericValue,
    validator,
    ...props
  },
  ref
) {
  /** Must be true when the user has entered a numeric value. This is passed to
   * the formatter when the numeric value changes and then is reset to false. */
  const userKeyedNumeric = useRef(false);
  const initialValidateRaised = useRef(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [displayValue, setDisplayValue] = useState("");

  // Only runs once on initial render to make sure the provided numericValue can
  // be displayed properly.
  useEffect(() => {
    const formatted = formatter(filter(numericValue));
    const filtered = filter(formatted);
    if (filtered !== numericValue) {
      onNumericChange && onNumericChange(filtered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sets the display value when the numericValue changes.
  useEffect(() => {
    setDisplayValue(current => {
      const filtered = filter(numericValue);
      const formatted = formatter(filtered, current, {
        userKeyed: userKeyedNumeric.current
      });

      userKeyedNumeric.current = false;

      return formatted;
    });
  }, [filter, formatter, numericValue]);

  // FormattedNumericInput keeps its own copy of a ref to the input element for
  // validation purposes, we need to manually pass along this reference to
  // `ref`, if it is provided.
  useEffect(() => {
    if (!ref) {
      return;
    }

    if ("current" in ref) {
      ref.current = inputRef;
    } else if (typeof ref === "function") {
      ref(inputRef);
    }
  }, [inputRef, ref]);

  // Do "mount" validation once when the `inputRef` is available; `inputRef`
  // will not be available until the second component render.
  useEffect(() => {
    if (!inputRef || initialValidateRaised.current) {
      return;
    }

    initialValidateRaised.current = true;
    validateInput(numericValue, "mount", inputRef, validator);
  }, [inputRef, numericValue, validator]);

  function handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
    const nextDisplayValue = formatter(filter(evt.target.value), displayValue, {
      type: "blur"
    });

    setDisplayValue(nextDisplayValue);

    onBlur && onBlur(evt);
    validateInput(numericValue, "blur", inputRef, validator);
  }

  const handleChange: FormattedInputPropsImported["onChange"] = useCallback(
    (value, changeType) => {
      // Value will have the format of the current locale. Before processing the
      // number convert it to an en-US representation.
      const enValue = converter ? converter(value) : value;

      const filteredValue = filter(enValue, numericValue);

      const next = formatter(filteredValue, displayValue, {
        type: "change",
        userKeyed: userKeyedNumeric.current
      });

      const deleteType = changeType !== "add" && changeType !== "replace";
      const nextDisplay = deleteType ? value : next;

      // The length of the string number might be controlled by the format, to
      // generate the en-US localized numeric value filter then convert.
      const nextNumeric = filter(
        converter ? converter(nextDisplay) : nextDisplay
      );

      if (deleteType) {
        setDisplayValue(nextNumeric.length < 1 ? "" : nextDisplay);
      }

      if (numericValue !== nextNumeric) {
        onNumericChange && onNumericChange(nextNumeric);
        validateInput(nextNumeric, "change", inputRef, validator);
      }
    },
    [
      converter,
      displayValue,
      filter,
      formatter,
      inputRef,
      numericValue,
      onNumericChange,
      validator
    ]
  );

  const handleKeyDown = useCallback<
    Required<FormattedInputPropsImported>["onKeyDown"]
  >(
    evt => {
      userKeyedNumeric.current = true;

      // If a modifier key is active do not filter the key (this is the case
      // when say doing "select all" or "copy").
      if (
        evt.altKey ||
        evt.ctrlKey ||
        evt.metaKey ||
        evt.nativeEvent.isComposing
      ) {
        return;
      }

      // If this is not a key that represents a single character (like a
      // Backspace) then it should not be filtered.
      if (evt.key.length !== 1) {
        return;
      }

      const filtered = filter(evt.key, numericValue);
      if (!filtered) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    },
    [filter, numericValue]
  );

  const nextProps: FormattedInputPropsImported = {
    formattedValue: displayValue,
    onBlur: handleBlur,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    ...props
  };

  return <FormattedInput {...nextProps} ref={setInputRef} />;
});

type FormattedInputProps = Omit<
  FormattedInputPropsImported,
  "formattedValue" | "onChange" | "onKeyDown"
>;

export interface FormattedNumericInputProps
  extends FormattedInputProps,
    NumericValidationProps {
  /** Converts a numeric string from the display locale to the en-US locale. For
   * example a de-DE value of "1.234,5" will be converted to an en-US string
   * "1,234.56". Normally the default converter (@see convertNumber) should
   * provide the correct result. */
  converter?: Converter;
  /** Function that can accept a string and return only the characters that make
   * up the numericValue. For example, if working with currency, input of
   * "$1.20" will result in a converted value of "1.20". This is the value that
   * will be returned by `onNumericChanged`. */
  filter?: Filter;
  /** Formats the numeric string for display. */
  formatter?: Formatter;
  /** A string containing a numeric representation. The string may only contain
   * '-', digits 0-9, and '.'. If the string represents a number the integer and
   * fractional parts of the number must be separated by a '.'. The length and
   * valid subset of characters in the string will vary by implementation
   * (restricted by the `filter` and `formatter`). */
  numericValue: string;
  /** Invoked when the numeric value of the input changes. In some cases the
   * display value will change, but the numeric value will not. */
  onNumericChange: ((value: string) => void) | null;
}

export interface NumericValidationProps {
  /** Invoke to validate a numericValue. */
  validator?: Validator;
}

function validateInput(
  numericValue: FormattedNumericInputProps["numericValue"],
  context: Parameters<Required<NumericValidationProps>["validator"]>[1],
  input: HTMLInputElement | null,
  validator?: NumericValidationProps["validator"]
) {
  if (validator && input) {
    const validateResult = validator(numericValue, context);
    if (validateResult) {
      validateResult.customValidity !== undefined &&
        input.setCustomValidity(validateResult.customValidity);
      validateResult.report && input.reportValidity();
    }
  }
}
