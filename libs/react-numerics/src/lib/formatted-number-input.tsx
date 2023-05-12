import React, { useMemo } from "react";
import { convertNumber } from "./converters/converters";
import type { FormattedNumericInputProps } from "./formatted-numeric-input";
import { FormattedNumericInput } from "./formatted-numeric-input";
import { filterToSignedFloat } from "./filters/filters";
import type {
  FormatFloatStringOptions,
  FormatNumberStringOptions
} from "./formatters/formatters";
import { formatFloat } from "./formatters/formatters";

/**
 * Create a formatted number.
 * @see {@link FormattedNumericInput} for other types of numerics.
 * @description When an HOC deals with an actual number, like currency or
 * percent, this is the component to start with. Generally this is not used
 * directly in an application but wrapped in a component at a higher level of
 * abstraction. react-numerics includes HOCs for selected types of formatted
 * numbers.
 *
 * To create formatted numbers of the following types:
 * - integer: set `decimalPlaces` to 0.
 * - positive number: set `min` to 0 or 1.
 * - decimal: set `decimalPlaces` to the maximum allowed, will be right padded
 *   with zeroes.
 *
 * @param props
 */
export const FormattedNumberInput = React.forwardRef<
  HTMLInputElement,
  FormattedNumberInputProps
>(function FormattedNumberInputImpl(
  {
    decimalPlaces,
    formatter: formatterProp,
    locales,
    min,
    max,
    roundingMode,
    ...props
  },
  ref
) {
  const converter = useMemo(() => convertNumber(locales), [locales]);
  const formatter = useMemo(
    () =>
      formatterProp ??
      formatFloat(locales, { decimalPlaces, max, min, roundingMode }),
    [decimalPlaces, formatterProp, locales, max, min, roundingMode]
  );

  return (
    <FormattedNumericInput
      converter={converter}
      filter={filterToSignedFloat}
      formatter={formatter}
      ref={ref}
      {...props}
    />
  );
});

/** Props implemented by a component that displays a formatted number. */
export interface FormattedNumberInputProps
  extends Omit<FormattedNumericInputProps, "converter" | "filter">,
    Pick<Partial<FormatFloatStringOptions>, "decimalPlaces" | "roundingMode"> {
  /** The locales to use when the Formatter is invoked. */
  locales?: FormatNumberStringOptions["locales"];
}
