import React, { useMemo } from "react";
import { formatPercent } from "../../formatters/formatters";
import {
  FormattedNumberInput,
  FormattedNumberInputProps
} from "../../formatted-number-input";
import type {
  ValidateMin,
  ValidationProps
} from "../../validators/validators-types";
import { useValidator } from "../../validators/use-validator";
import { validateMinValue } from "../../validators/validators";

/**
 * Create a number followed by the % sign. The percent sign will be appended
 * when the user leaves the field (i.e. `onBlur`).
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` allows: "-", digits 0-9, and ".".</p>
 */
export const PercentNumberInput = React.forwardRef<
  HTMLInputElement,
  PercentNumberInputProps
>(function PercentNumberInputImpl(
  {
    decimalPlaces,
    inputMode = "decimal",
    locales,
    max,
    min,
    roundingMode,
    title,
    updateCustomValidity,
    validate,
    ...props
  },
  ref
) {
  const formatter = useMemo(() => {
    return formatPercent(locales, { decimalPlaces, max, min, roundingMode });
  }, [decimalPlaces, locales, max, min, roundingMode]);

  const validator = useValidator(
    { updateCustomValidity, validate },
    { min, title },
    validateMinValue
  );

  const nextProps: FormattedNumberInputProps = {
    ...props,
    formatter,
    inputMode,
    title
  };

  if (validator) {
    nextProps.validator = validator;
  } else {
    nextProps.min = min;
  }

  return <FormattedNumberInput {...nextProps} ref={ref} />;
});

/**
 * Props implemented by a component that displays a number as a percent.
 * @interface
 */
export interface PercentNumberInputProps // An empty interface rather than a type because the docs are better.
  extends Omit<FormattedNumberInputProps, "formatter" | "validator">,
    ValidationProps<ValidateMin> {}
