import { useMemo } from "react";
import { formatPercent } from "../../formatters/formatters";
import {
  FormattedNumberInput,
  Props as FormattedNumberInputProps
} from "../../formatted-number-input";

export function PercentNumberInput({
  decimalPlaces,
  onNumericChange,
  roundingMode,
  locales,
  max,
  min,
  ...props
}: Props) {
  const formatter = useMemo(() => {
    return formatPercent(locales, { decimalPlaces, max, min, roundingMode });
  }, [decimalPlaces, locales, max, min, roundingMode]);

  return (
    <FormattedNumberInput
      {...props}
      formatter={formatter}
      onNumericChange={onNumericChange}
    />
  );
}

interface Props extends Omit<FormattedNumberInputProps, "formatter"> {}
