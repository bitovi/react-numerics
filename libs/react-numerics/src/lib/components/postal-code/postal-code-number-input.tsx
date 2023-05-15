import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatPostalCodeNumber } from "../../formatters/formatters";
import type {
  ValidateMinLength,
  ValidationProps
} from "../../validators/validators-types";
import { validateNumericLength } from "../../validators/validators";
import { useValidator } from "../../validators/use-validator";

/**
 * Create a formatted postal code. For example a U.S. 5 digit zip code "12345".
 * @description Supported locales: en-US (5 digit)
 * @param props
 * @category Components
 */
export const PostalCodeNumberInput = React.forwardRef<
  HTMLInputElement,
  PostalCodeNumberInputProps
>(function PostalCodeNumberInputImpl(
  {
    inputMode = "numeric",
    /** @deprecated Will be removed in next major version upgrade. */
    min, // TODO: in next major version update Omit to exclude `min` property; for now `min` is ignored when validate is true.
    /** @deprecated Will be removed in next major version upgrade. */
    minLength, // TODO: in next major version update Omit to exclude `minLength` property; for now `minLength` is ignored when validate is true.
    title,
    updateCustomValidity,
    validate,
    ...props
  },
  ref
) {
  const validator = useValidator(
    { updateCustomValidity, validate },
    { minLength: 5, title },
    validateNumericLength
  );

  const nextProps: FormattedNumericInputProps = {
    ...props,
    inputMode,
    filter: filterToNumeric,
    formatter: formatPostalCodeNumber,
    title
  };

  if (validator) {
    nextProps.validator = validator;
  } else {
    nextProps.min = min;
    nextProps.minLength = minLength;
  }

  return <FormattedNumericInput {...nextProps} ref={ref} />;
});

/**
 * Props implemented by a component that displays a postal code.
 * @interface
 */
export interface PostalCodeNumberInputProps // An empty interface rather than a type because the docs are better.
  extends Omit<
      FormattedNumericInputProps,
      "converter" | "filter" | "formatter" | "validator"
    >,
    ValidationProps<ValidateMinLength> {}
