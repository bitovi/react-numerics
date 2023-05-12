import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatSocialSecurityNumber } from "../../formatters/formatters";
import type {
  ValidateMinLength,
  ValidationProps
} from "../../validators/validators-types";
import { useValidator } from "../../validators/use-validator";
import { validateNumericLength } from "../../validators/validators";

/**
 * Display a formatted U.S. Social Security Number. For example:
 * "123-45-6789".
 * @param props
 */
export const SocialSecurityNumberInput = React.forwardRef<
  HTMLInputElement,
  SocialSecurityNumberInputProps
>(function SocialSecurityNumberInputImpl(
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
    { minLength: 9, title },
    validateNumericLength
  );

  const nextProps: FormattedNumericInputProps = {
    ...props,
    filter: filterToNumeric,
    formatter: formatSocialSecurityNumber,
    inputMode,
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

/** Props implemented by a component that displays a U.S. social security
number. */
export interface SocialSecurityNumberInputProps // An empty interface rather than a type because the docs are better.
  extends Omit<
      FormattedNumericInputProps,
      "converter" | "filter" | "formatter" | "validator"
    >,
    ValidationProps<ValidateMinLength> {}
