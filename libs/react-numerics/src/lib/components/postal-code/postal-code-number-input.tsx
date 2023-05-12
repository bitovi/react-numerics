import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatPostalCodeNumber } from "../../formatters/formatters";
import type {
  ValidateMin,
  ValidationProps
} from "../../validators/validators-types";
import { validatePostalCode } from "../../validators/validators";
import { useValidator } from "../../validators/use-validator";

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
  PostalCodeNumberInputValidationProps
>(function PostalCodeNumberInputImpl(
  { inputMode = "numeric", updateCustomValidity, validate, ...props },
  ref
) {
  const validator = useValidator(
    { updateCustomValidity, validate },
    { min: 5 },
    validatePostalCode
  );

  return (
    <FormattedNumericInput
      inputMode={inputMode}
      {...props}
      filter={filterToNumeric}
      formatter={formatPostalCodeNumber}
      ref={ref}
      validator={validator}
    />
  );
});

/** Props implemented by a component that displays a postal code. */
export type PostalCodeNumberInputProps = Omit<
  FormattedNumericInputProps,
  "converter" | "filter" | "formatter"
>;

export type PostalCodeNumberInputValidationProps = PostalCodeNumberInputProps &
  ValidationProps<ValidateMin>;
