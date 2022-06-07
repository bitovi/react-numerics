import React, { useCallback, useEffect, useRef, useState } from "react";
import { Logr } from "@blast-client/logr";
import useLog from "../../hooks/use-log";
import { Filter } from "./filters/filters";
import { Formatter } from "./formatters/formatters";
import { Converter } from "./converters/converters";
import { FormattedInput } from "./formatted-input";

/**
 * Expects a `numericValue` string containing either only number characters or
 * only characters that can be used to represent a number. This string will be
 * formatted for display. The owner will be notified when the numeric string
 * value changes by `onNumericChange`.
 *
 * If the numericValue represents a number like a float or integer it must be
 * formatted in the en-US locale, i.e. uses a "." to separate the whole from the
 * fractional part.
 *
 * For example, feed in a string like "1234567890" with the correct filters and
 * formatters (e.g. US telephone) and it will be displayed as "(123) 456-7890".
 *
 * Or a number like "3.14" with the locale set to de-DE will be displayed as
 * "3,15".
 * @param props Props for this component.
 */
export function FormattedNumericInput({
  converter = v => v,
  filter = v => v,
  formatter = (v: string) => v,
  onBlur,
  onNumericChange,
  numericValue,
  ...props
}: Props) {
  const logr = useLog("frm");
  const numeric = useRef(filter(numericValue));
  /** Must be true when the user has entered a numeric value. This is passed to
   * the formatter when the numeric value changes and then is reset to false. */
  const userKeyedNumeric = useRef(false);
  const [displayValue, setDisplayValue] = useState(
    getInitialDisplayValue(
      numericValue,
      filter,
      formatter,
      onNumericChange,
      logr
    )
  );

  useEffect(() => {
    if (!numericValue && numericValue !== "") {
      return;
    }

    setDisplayValue(current => {
      const filtered = filter(numericValue);
      const formatted = formatter(filtered, current, {
        userKeyed: userKeyedNumeric.current
      });

      logr.debug(
        () =>
          `FormattedNumericInput useEffect: numericValue='${numericValue}', formatted='${formatted}', userKeyedNumeric.current=${userKeyedNumeric.current} `
      );
      userKeyedNumeric.current = false;

      return formatted;
    });
  }, [filter, formatter, logr, numericValue]);

  function handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
    const nextDisplayValue = formatter(filter(evt.target.value), null, {
      type: "blur"
    });

    setDisplayValue(nextDisplayValue);

    if (onBlur) {
      onBlur(evt);
    }
  }

  const handleChange: NumericInputProps["onChange"] = useCallback(
    (value, changeType) => {
      // Value will have the format of the current locale. Before processing the
      // number convert it to an en-US representation.
      const enValue = converter ? converter(value) : value;
      logr.debug(
        () => `FormattedNumericInput handleChange: value='${enValue}'`
      );

      let next = filter(enValue, numeric.current);
      logr.debug(
        () => `FormattedNumericInput handleChange[filter]: next='${next}'`
      );

      next = formatter(next, displayValue, { type: "change" });
      logr.debug(
        () => `FormattedNumericInput handleChange[formatter]: next='${next}'`
      );

      const deleteType = changeType !== "add" && changeType !== "replace";
      const nextDisplay = deleteType ? value : next;
      logr.debug(
        () =>
          `FormattedNumericInput handleChange: nextDisplay='${nextDisplay}', changeType='${changeType}'`
      );

      // If characters are being deleted, don't reformat the string. Also this
      // must not set the userKeyedNumeric ref because the user did not press a
      // numeric key.
      if (deleteType) {
        setDisplayValue(nextDisplay);
      }

      // The length of the string number might be controlled by the format, to
      // generate the en-US localized numeric value filter then convert.
      const nextNumeric = filter(
        converter ? converter(nextDisplay) : nextDisplay
      );
      logr.debug(
        () =>
          `FormattedNumericInput handleChange: numeric='${numeric.current}', nextNumeric='${nextNumeric}'`
      );

      if (numeric.current !== nextNumeric) {
        logr.debug(
          () =>
            `FormattedNumericInput handleChange; numeric.current='${numeric.current}',  nextNumeric='${nextNumeric}'`
        );

        numeric.current = nextNumeric;
        onNumericChange(nextNumeric);
      }
    },
    [converter, displayValue, filter, formatter, logr, onNumericChange]
  );

  const handleKeyDown: NumericInputProps["onKeyDown"] = useCallback(
    evt => {
      userKeyedNumeric.current = true;

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

  logr.debug(
    () =>
      `FormattedNumericInput: numericValue='${numericValue}', displayValue='${displayValue}', userKeyedNumeric.current=${userKeyedNumeric.current}`
  );

  return (
    <FormattedInput
      formattedValue={displayValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

type NumericInputProps = React.ComponentPropsWithoutRef<typeof FormattedInput>;

interface Props extends Omit<NumericInputProps, "formattedValue" | "onChange"> {
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
  /** A string containing a numeric representation. This must have the same
   * format provided by the `filter` output. */
  numericValue: string;
  /** Invoked when the numeric value of the input changes (as determined by
   * comparing the `numericValue` to the result of `filter`). */
  onNumericChange: (value: string) => void;
}

function getInitialDisplayValue(
  numericValue: string,
  filter: Props["filter"],
  formatter: Props["formatter"],
  onNumericChange: Props["onNumericChange"],
  log: Logr
) {
  const formatted = formatter(filter(numericValue));
  const filtered = filter(formatted);

  log.debug(
    () =>
      `getInitialDisplayValue: numericValue='${numericValue}', formatted='${formatted}', filtered='${filtered}'`
  );

  // getInitialDisplayValue is invoked during the first render of the component,
  // the provided number doesn't match the allowed inputs so this component is
  // rejecting the initial provided value. The invocation of the
  // `onNumericChange` with the allowed value needs to be queued to let the
  // React render stack unwind first.
  filtered !== numericValue && setTimeout(() => onNumericChange(filtered), 0);

  return formatted;
}
