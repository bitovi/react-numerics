import React from "react";
import { Locales } from "../../types";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatTelephoneNumber } from "../../formatters/formatters";
import type { ValidationProps } from "../../validators/validators-types";
import { useValidator } from "../../validators/use-validator";
import { validateTelephoneNumber } from "../../validators/validators";

/**
 * Display a formatted telephone number.
 * @description Supported locales: en-US (10 digit)
 * @param props
 * @category Components
 */
export const TelephoneNumberInput = React.forwardRef<
  HTMLInputElement,
  TelephoneNumberInputProps
>(function TelephoneNumberInputImpl(
  {
    inputMode = "tel",
    locales,
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
    { locales, title },
    validateTelephoneNumber
  );

  const nextProps: FormattedNumericInputProps = {
    ...props,
    filter: filterToNumeric,
    formatter: formatTelephoneNumber(locales),
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
 * Implemented by a component that renders a telephone number.
 */
export interface TelephoneNumberInputProps
  extends Omit<
      FormattedNumericInputProps,
      "converter" | "filter" | "formatter" | "validator"
    >,
    ValidationProps<unknown> {
  /** The locales to use when the Formatter is invoked. */
  locales?: Locales;
}
