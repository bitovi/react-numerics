import React, { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import type { FormattedNumberInputProps } from "../../formatted-number-input";
import { FormattedNumberInput } from "../../formatted-number-input";
import {
  formatCurrency,
  padNumericFraction
} from "../../formatters/formatters";
import type {
  ValidateMin,
  ValidationProps
} from "../../validators/validators-types";
import { validateMinValue } from "../../validators/validators";
import { useValidator } from "../../validators/use-validator";

/**
 * Allow the user to enter a currency value.
 * @description Currency format and display are driven by the locale. The
 * ability to enter fractional parts of a currency (e.g. cents) can also be
 * controlled.
 *
 * The display will show the localized currency symbol then the amount as the
 * user types. For example "$1.23".
 *
 * Supported locales: en-US
 *
 * @param props
 * @category Components
 */
export const CurrencyNumberInput = React.forwardRef<
  HTMLInputElement,
  CurrencyNumberInputProps
>(function CurrencyNumberInputImpl(
  {
    inputMode = "decimal",
    locales,
    min,
    numericValue,
    onBlur,
    onNumericChange,
    roundingMode = BigNumber.ROUND_HALF_UP,
    showFraction = true,
    title,
    updateCustomValidity,
    validate,
    ...props
  },
  ref
) {
  const [paddingStage, setPaddingStage] = useState<
    (typeof paddingStages)[keyof typeof paddingStages]
  >(paddingStages.pending);

  useEffect(() => {
    if (paddingStage === paddingStages.pending) {
      if (typeof numericValue === "string") {
        setPaddingStage(paddingStages.active);
        onNumericChange &&
          onNumericChange(
            padNumericFraction(locales, numericValue, { decimalSeparator: "." })
          );
      }
    } else if (paddingStage === paddingStages.active) {
      setPaddingStage(paddingStages.complete);
    }
  }, [locales, numericValue, onNumericChange, paddingStage]);

  const formatter = useMemo(
    () =>
      formatCurrency(locales, {
        showFraction,
        roundingMode
      }),
    [locales, roundingMode, showFraction]
  );

  const handleBlur = useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      if (showFraction) {
        onNumericChange &&
          onNumericChange(
            padNumericFraction(locales, numericValue, { decimalSeparator: "." })
          );
      }

      onBlur && onBlur(evt);
    },
    [locales, numericValue, onBlur, onNumericChange, showFraction]
  );

  const validator = useValidator(
    { updateCustomValidity, validate },
    { min, title },
    validateMinValue
  );

  const nextNumericValue =
    paddingStage !== paddingStages.complete ? "" : numericValue;

  return (
    <FormattedNumberInput
      {...props}
      formatter={formatter}
      inputMode={inputMode}
      min={min}
      numericValue={nextNumericValue}
      onBlur={handleBlur}
      onNumericChange={onNumericChange}
      ref={ref}
      title={title}
      validator={validator}
    />
  );
});

const paddingStages = { pending: -1, active: 0, complete: 1 };

/**
 * Implemented by a component that displays a number as currency.
 */
export interface CurrencyNumberInputProps
  extends Omit<
      FormattedNumberInputProps,
      "formatter" | "decimalPlaces" | "validator"
    >,
    ValidationProps<ValidateMin> {
  /** Control whether the user can enter fractional parts of the currency (e.g.
   * cents). */
  showFraction?: boolean;
}
