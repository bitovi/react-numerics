import { FormattedNumericInput } from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatPostalCodeNumber } from "../../formatters/formatters";

export function PostalCodeNumberInput(props: Props) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatPostalCodeNumber}
      {...props}
    />
  );
}

type FormattedNumericInputProps = Parameters<typeof FormattedNumericInput>[0];

interface Props
  extends Omit<FormattedNumericInputProps, "filter" | "formatter"> {}
