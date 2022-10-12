import { useMemo } from "react"
import { convertNumber } from "./converters/converters"
import {
  FormattedNumericInput,
  FormattedNumericInputProps,
} from "./formatted-numeric-input"
import { filterToSignedFloat } from "./filters/filters"
import { formatFloat, FormatterFactory } from "./formatters/formatters"

/**
 * Create a formatted number. Generally this is not used directly in an
 * application but wrapped in a component at a higher level of abstraction.
 * react-numerics includes HOCs for selected types of formatted numbers.
 *
 * To create formatted numbers of the following types:
 * - integer: set `decimalPlaces` to 0.
 * - positive number: set `min` to 0 or 1.
 * - decimal: set `decimalPlaces` to the maximum allowed, will be right padded
 *   with zeroes.
 *
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` allows: "-", digits 0-9, and ".".</p>
 */
export function FormattedNumberInput({
  decimalPlaces,
  formatter: formatterProp,
  locales,
  min,
  max,
  numericValue,
  onNumericChange,
  roundingMode,
  ...props
}: FormattedNumberInputProps): JSX.Element {
  const converter = useMemo(() => convertNumber(locales), [locales])
  const formatter = useMemo(
    () =>
      formatterProp ??
      formatFloat(locales, { decimalPlaces, max, min, roundingMode }),
    [decimalPlaces, formatterProp, locales, max, min, roundingMode],
  )

  return (
    <FormattedNumericInput
      converter={converter}
      filter={filterToSignedFloat}
      formatter={formatter}
      numericValue={numericValue}
      onNumericChange={onNumericChange}
      {...props}
    />
  )
}

type FormatFloatSecondParameter = NonNullable<Parameters<typeof formatFloat>[1]>

export interface FormattedNumberInputProps
  extends Omit<FormattedNumericInputProps, "converter" | "filter"> {
  /** The number of places to return in the formatted value. */
  decimalPlaces?: FormatFloatSecondParameter["decimalPlaces"]
  /** The locales to use when the Formatter is invoked. */
  locales?: Parameters<FormatterFactory>[0]
  /** How a number with more precision than the allowed decimal places should be
   * rounded. */
  roundingMode?: FormatFloatSecondParameter["roundingMode"]
}
