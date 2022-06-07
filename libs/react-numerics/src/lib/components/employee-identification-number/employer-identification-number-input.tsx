import { FormattedNumericInput } from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatEmployerIdentificationNumber } from "../../formatters/formatters";

export function EmployerIdentificationNumberInput(props: Props) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatEmployerIdentificationNumber}
      {...props}
    />
  );
}

type FormattedNumericInputProps = Parameters<typeof FormattedNumericInput>[0];

interface Props
  extends Omit<FormattedNumericInputProps, "filter" | "formatter"> {}
