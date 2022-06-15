import React, { useCallback, useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import {
  FormattedNumberInput,
  Props as FormattedNumberInputProps
} from "../../formatted-number-input";
import { Locales } from "../../types";
import { formatCurrency } from "../../formatters/formatters";
import { getCurrencyData, padRight } from "../../util/numbers";

/**
 * Allow the user to enter a currency value. Currency format and display are
 * driven by the locale. The ability to enter fractional parts of a currency
 * (e.g. cents) can also be controlled.
 */
export function CurrencyNumberInput({
  numericValue,
  onBlur,
  onNumericChange,
  roundingMode = BigNumber.ROUND_HALF_UP,
  showFraction = true,
  locales,
  ...props
}: Props) {
  const [paddingStage, setPaddingStage] = useState<
    typeof paddingStages[keyof typeof paddingStages]
  >(paddingStages.pending);

  useEffect(() => {
    if (paddingStage === paddingStages.pending) {
      if (typeof numericValue === "string") {
        setPaddingStage(paddingStages.active);
        onNumericChange && onNumericChange(padFraction(locales, numericValue));
      }
    } else if (paddingStage === paddingStages.active) {
      setPaddingStage(paddingStages.complete);
    }
  }, [locales, numericValue, onNumericChange, paddingStage]);

  const formatter = useMemo(() => {
    return formatCurrency(locales, {
      showFraction,
      roundingMode
    });
  }, [locales, roundingMode, showFraction]);

  const handleBlur = useCallback(
    (evt: React.FocusEvent<HTMLInputElement>) => {
      if (showFraction) {
        onNumericChange && onNumericChange(padFraction(locales, numericValue));
      }

      onBlur && onBlur(evt);
    },
    [locales, numericValue, onBlur, onNumericChange, showFraction]
  );

  const nextNumericValue =
    paddingStage !== paddingStages.complete ? "" : numericValue;

  return (
    <FormattedNumberInput
      {...props}
      formatter={formatter}
      numericValue={nextNumericValue}
      onBlur={handleBlur}
      onNumericChange={onNumericChange}
    />
  );
}

const paddingStages = { pending: -1, active: 0, complete: 1 };

function padFraction(locales: Locales, numericValue: string) {
  if (!numericValue) {
    return numericValue;
  }

  if (!locales) {
    return numericValue;
  }

  const [integer = "", fraction = ""] = numericValue.split(".");
  const { fractionLength } = getCurrencyData(
    Array.isArray(locales) ? locales[0] : locales
  );
  const fractionPadded = padRight(fraction, "0".repeat(fractionLength));
  return `${integer}.${fractionPadded}`;
}

interface Props
  extends Omit<FormattedNumberInputProps, "formatter" | "decimalPlaces"> {
  /** Control whether the user can enter fractional parts of the currency (e.g.
   * cents); defaults to true */
  showFraction?: boolean;
}
