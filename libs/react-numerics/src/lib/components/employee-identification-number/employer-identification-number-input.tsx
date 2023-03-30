import React from "react";
import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatEmployerIdentificationNumber } from "../../formatters/formatters";

/**
 * Display a formatted U.S. Employer Identification Number. For example:
 * "12-3456789".
 * @param props - Component props.<p>`numericValue` must only contain
 * digits.</p>
 */
export const EmployerIdentificationNumberInput = React.forwardRef<
  HTMLInputElement,
  EmployerIdentificationNumberInputProps
>(function EmployerIdentificationNumberInputImpl(
  { inputMode = "numeric", ...props },
  ref
) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatEmployerIdentificationNumber}
      inputMode={inputMode}
      ref={ref}
      {...props}
    />
  );
});

export interface EmployerIdentificationNumberInputProps
  extends Omit<
    FormattedNumericInputProps,
    "converter" | "filter" | "formatter"
  > {}
