import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatSocialSecurityNumber } from "../../formatters/formatters";

/**
 * Display a formatted U.S. Social Security Number. For example:
 * "123-45-6789".
 * @param props
 */
export const SocialSecurityNumberInput = React.forwardRef<
  HTMLInputElement,
  SocialSecurityNumberInputProps
>(function SocialSecurityNumberInputImpl(
  { inputMode = "numeric", ...props },
  ref
) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatSocialSecurityNumber}
      inputMode={inputMode}
      ref={ref}
      {...props}
    />
  );
});

/** Props implemented by a component that displays a U.S. social security
number. */
export interface SocialSecurityNumberInputProps
  extends Omit<
    FormattedNumericInputProps,
    "converter" | "filter" | "formatter" | "validator"
  > {}
