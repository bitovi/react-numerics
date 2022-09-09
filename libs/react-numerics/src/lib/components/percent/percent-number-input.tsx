import { useMemo } from "react";
import { formatPercent } from "../../formatters/formatters";
import {
  FormattedNumberInput,
  FormattedNumberInputProps
} from "../../formatted-number-input";

/**
 * Create a number followed by the % sign. The percent sign will be appended
 * when the user leaves the field (i.e. `onBlur`).
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` allows: "-", digits 0-9, and ".".</p>
 */
export function PercentNumberInput({
  decimalPlaces,
  onNumericChange,
  roundingMode,
  locales,
  max,
  min,
  inputMode = "decimal",
  ...props
}: PercentNumberInputProps) {
  const formatter = useMemo(() => {
    return formatPercent(locales, { decimalPlaces, max, min, roundingMode });
  }, [decimalPlaces, locales, max, min, roundingMode]);

  return (
    <FormattedNumberInput
      {...props}
      formatter={formatter}
      onNumericChange={onNumericChange}
      inputMode={inputMode}
    />
  );
}

export interface PercentNumberInputProps
  extends Omit<FormattedNumberInputProps, "formatter"> {
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
}
