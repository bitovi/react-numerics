import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import {
  formatTelephoneNumber,
  FormatterFactory
} from "../../formatters/formatters";

/**
 * Display a formatted telephone number.
 *
 * Supported locales: U.S. (10 digit)

* @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` must only contain digits.</p>
 */
export const TelephoneNumberInput = React.forwardRef<
  HTMLInputElement,
  TelephoneNumberInputProps
>(function TelephoneNumberInputImpl(
  { locales, inputMode = "tel", ...props },
  ref
) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatTelephoneNumber(locales)}
      inputMode={inputMode}
      ref={ref}
      {...props}
    />
  );
});

/**
 * Implemented by a component that renders a telephone number.
 */
export interface TelephoneNumberInputProps
  extends Omit<
    FormattedNumericInputProps,
    "converter" | "filter" | "formatter"
  > {
  /** The locales to use when the Formatter is invoked. */
  locales?: Parameters<FormatterFactory>[0];
}
