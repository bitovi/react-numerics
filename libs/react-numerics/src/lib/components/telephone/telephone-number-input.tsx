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
export function TelephoneNumberInput({
  locales,
  ...props
}: TelephoneNumberInputProps) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatTelephoneNumber(locales)}
      {...props}
    />
  );
}

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
