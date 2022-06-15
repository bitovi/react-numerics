import React, { useMemo } from "react";
import { convertNumber } from "./converters/converters";
import { FormattedNumericInput } from "./formatted-numeric-input";
import { filterToSignedFloat } from "./filters/filters";
import { formatFloat, FormatterFactory } from "./formatters/formatters";

/**
 * Create a formatted number. There are HOCs for some specific types of
 * formatted numbers: `CurrencyNumberInput`, `PercentNumberInput`
 *
 * To create formatted numbers of the following types:
 * - integer: set `decimalPlaces` to 0.
 * - positive number: set `min` to 0 or 1.
 * - decimal: set `decimalPlaces` to the maximum allowed, will be right padded
 *   with zeroes.
 *
 * @see CurrencyNumberInput
 * @see PercentNumberInput
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
}: Props) {
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
      numericValue={numericValue}
      onNumericChange={onNumericChange}
      {...props}
    />
  );
}

type FormattedNumericInputProps = React.ComponentPropsWithoutRef<
  typeof FormattedNumericInput
>;

type FormatFloatSecondParameter = NonNullable<
  Parameters<typeof formatFloat>[1]
>;

export interface Props
  extends Omit<FormattedNumericInputProps, "converter" | "filter"> {
  decimalPlaces?: FormatFloatSecondParameter["decimalPlaces"];
  locales?: Parameters<FormatterFactory>[0];
  roundingMode?: FormatFloatSecondParameter["roundingMode"];
}
