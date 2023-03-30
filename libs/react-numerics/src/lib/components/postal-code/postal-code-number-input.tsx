import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatPostalCodeNumber } from "../../formatters/formatters";

/**
 * Create a formatted postal code. For example a U.S. 5 digit zip code "12345".
 *
 * Supported locales: U.S.
 *
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` must only contain digits.</p>
 */
export const PostalCodeNumberInput = React.forwardRef<
  HTMLInputElement,
  PostalCodeNumberInputProps
>(function PostalCodeNumberInputImpl({ inputMode = "numeric", ...props }, ref) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatPostalCodeNumber}
      inputMode={inputMode}
      ref={ref}
      {...props}
    />
  );
});

export interface PostalCodeNumberInputProps
  extends Omit<
    FormattedNumericInputProps,
    "converter" | "filter" | "formatter"
  > {}
