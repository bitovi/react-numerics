import React, { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import type { FormattedNumberInputProps } from "../../formatted-number-input";
import { FormattedNumberInput } from "../../formatted-number-input";
import {
  formatCurrency,
  padNumericFraction
} from "../../formatters/formatters";
import type {
  ValidateAndUpdateProps,
  ValidateMinValue,
  ValidateProps,
  Validator
} from "../../validators/validators-types";
import { validateCurrency } from "../../validators/validators";

/**
 * Allow the user to enter a currency value. Currency format and display are
 * driven by the locale. The ability to enter fractional parts of a currency
 * (e.g. cents) can also be controlled.
 *
 * The display will show the localized currency symbol then the amount as the
 * user types. For example "$1.23".
 *
 * Supported locales: U.S.
 *
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` must only contain digits.</p>
 */
export const CurrencyNumberInput = React.forwardRef<
  HTMLInputElement,
  CurrencyNumberInputProps | CurrencyNumberInputValidationProps
>(function CurrencyNumberInputImpl(props, ref) {
  // Spreading here because we want to cast `props` as
  // `CurrencyNumberInputValidateAndUpdateProps` so the `validate` and
  // `updateCustomValidity` props can be extracted and not passed on ultimately
  // to the input element (if they exist).
  const {
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
    validate = false,
    ...remainingProps
  } = props as CurrencyNumberInputValidateAndUpdateProps;

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

  const validator = useMemo<Validator | undefined>(() => {
    if (!validate) {
      return;
    }

    const context: Parameters<typeof validateCurrency>[0] = {
      min,
      title
    };

    if (updateCustomValidity) {
      context.updateCustomValidity = updateCustomValidity;
    }

    return validateCurrency(context);
  }, [min, title, updateCustomValidity, validate]);

  const nextNumericValue =
    paddingStage !== paddingStages.complete ? "" : numericValue;

  return (
    <FormattedNumberInput
      {...remainingProps}
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

export interface CurrencyNumberInputProps
  extends Omit<
    FormattedNumberInputProps,
    "formatter" | "decimalPlaces" | "validatePattern" | "validator"
  > {
  /** Control whether the user can enter fractional parts of the currency (e.g.
   * cents). */
  showFraction?: boolean;
}

export type CurrencyNumberInputValidationProps =
  | CurrencyNumberInputValidateProps
  | CurrencyNumberInputValidateAndUpdateProps;

export type CurrencyNumberInputValidateProps = CurrencyNumberInputProps &
  ValidateProps;

export type CurrencyNumberInputValidateAndUpdateProps =
  CurrencyNumberInputProps & ValidateAndUpdateProps<ValidateMinValue>;
