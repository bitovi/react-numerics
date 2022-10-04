import React, { useCallback, useEffect, useRef, useState } from "react"
import { Filter } from "./filters/filters"
import { Formatter } from "./formatters/formatters"
import { Converter } from "./converters/converters"
import {
  FormattedInput,
  FormattedInputProps as FormattedInputPropsImported,
} from "./formatted-input"

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
  converter = (v) => v,
  filter = (v) => v,
  formatter = (v: string) => v,
  onBlur,
  onNumericChange,
  numericValue,
  ...props
}: FormattedNumericInputProps) {
  const numeric = useRef(filter(numericValue))
  /** Must be true when the user has entered a numeric value. This is passed to
   * the formatter when the numeric value changes and then is reset to false. */
  const userKeyedNumeric = useRef(false)
  const [displayValue, setDisplayValue] = useState(
    getInitialDisplayValue(numericValue, filter, formatter, onNumericChange),
  )

  useEffect(() => {
    if (!numericValue && numericValue !== "") {
      return
    }

    setDisplayValue((current) => {
      const filtered = filter(numericValue)
      const formatted = formatter(filtered, current, {
        userKeyed: userKeyedNumeric.current,
      })

      userKeyedNumeric.current = false

      return formatted
    })
  }, [filter, formatter, numericValue])

  function handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
    const nextDisplayValue = formatter(filter(evt.target.value), displayValue, {
      type: "blur",
    })

    setDisplayValue(nextDisplayValue)

    if (onBlur) {
      onBlur(evt)
    }
  }

  const handleChange: FormattedInputPropsImported["onChange"] = useCallback(
    (value, changeType) => {
      // Value will have the format of the current locale. Before processing the
      // number convert it to an en-US representation.
      const enValue = converter ? converter(value) : value

      let next = filter(enValue, numeric.current)

      next = formatter(next, displayValue, {
        type: "change",
        userKeyed: userKeyedNumeric.current,
      })

      const deleteType = changeType !== "add" && changeType !== "replace"
      const nextDisplay = deleteType ? value : next

      // If characters are being deleted, don't reformat the string. Also this
      // must not set the userKeyedNumeric ref because the user did not press a
      // numeric key.
      if (deleteType) {
        setDisplayValue(nextDisplay)
      }

      // The length of the string number might be controlled by the format, to
      // generate the en-US localized numeric value filter then convert.
      const nextNumeric = filter(
        converter ? converter(nextDisplay) : nextDisplay,
      )

      if (numeric.current !== nextNumeric) {
        numeric.current = nextNumeric
        onNumericChange && onNumericChange(nextNumeric)
      }
    },
    [converter, displayValue, filter, formatter, onNumericChange],
  )

  const handleKeyDown: FormattedInputPropsImported["onKeyDown"] = useCallback(
    (evt: React.KeyboardEvent) => {
      userKeyedNumeric.current = true

      // If this is not a key that represents a single character (like a
      // Backspace) then it should not be filtered.
      if (evt.key.length !== 1) {
        return
      }

      const filtered = filter(evt.key, numericValue)
      if (!filtered) {
        evt.preventDefault()
        evt.stopPropagation()
      }
    },
    [filter, numericValue],
  )

  return (
    <FormattedInput
      formattedValue={displayValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

type FormattedInputProps = Omit<
  FormattedInputPropsImported,
  "formattedValue" | "onChange" | "onKeyDown"
>

export interface FormattedNumericInputProps extends FormattedInputProps {
  /** Converts a numeric string from the display locale to the en-US locale. For
   * example a de-DE value of "1.234,5" will be converted to an en-US string
   * "1,234.56". Normally the default converter (@see convertNumber) should
   * provide the correct result. */
  converter?: Converter
  /** Function that can accept a string and return only the characters that make
   * up the numericValue. For example, if working with currency, input of
   * "$1.20" will result in a converted value of "1.20". This is the value that
   * will be returned by `onNumericChanged`. */
  filter?: Filter
  /** Formats the numeric string for display. */
  formatter?: Formatter
  /** A string containing a numeric representation. The string may only contain
   * '-', digits 0-9, and '.'. If the string represents a number the integer and
   * fractional parts of the number must be separated by a '.'. The length and
   * valid subset of characters in the string will vary by implementation
   * (restricted by the `filter` and `formatter`). */
  numericValue: string
  /** Invoked when the numeric value of the input changes. In some cases the
   * display value will change, but the numeric value will not. */
  onNumericChange: ((value: string) => void) | null
}

function getInitialDisplayValue(
  numericValue: string,
  filter: Required<FormattedNumericInputProps>["filter"],
  formatter: Required<FormattedNumericInputProps>["formatter"],
  onNumericChange: FormattedNumericInputProps["onNumericChange"],
) {
  const formatted = formatter(filter(numericValue))
  const filtered = filter(formatted)

  // getInitialDisplayValue is invoked during the first render of the component,
  // the provided number doesn't match the allowed inputs so this component is
  // rejecting the initial provided value. The invocation of the
  // `onNumericChange` with the allowed value needs to be queued to let the
  // React render stack unwind first.
  filtered !== numericValue &&
    onNumericChange &&
    setTimeout(() => onNumericChange(filtered), 0)

  return formatted
}
