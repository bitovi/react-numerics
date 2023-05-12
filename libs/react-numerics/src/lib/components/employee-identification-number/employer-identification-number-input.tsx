import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatEmployerIdentificationNumber } from "../../formatters/formatters";
import type {
  ValidateMinLength,
  ValidationProps
} from "../../validators/validators-types";
import { validateNumericLength } from "../../validators/validators";
import { useValidator } from "../../validators/use-validator";

/**
 * Display a formatted U.S. Employer Identification Number. For example:
 * "12-3456789".
 * @param props
 * @category Components
 */
export const EmployerIdentificationNumberInput = React.forwardRef<
  HTMLInputElement,
  EmployerIdentificationNumberInputProps
>(function EmployerIdentificationNumberInputImpl(
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
    formatter: formatEmployerIdentificationNumber,
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

/**
 * Props implemented by a component that displays a U.S. employer identification
 * number.
 * @interface
 */
export interface EmployerIdentificationNumberInputProps // An empty interface rather than a type because the docs are better.
  extends Omit<
      FormattedNumericInputProps,
      "converter" | "filter" | "formatter" | "validator"
    >,
    ValidationProps<ValidateMinLength> {}
