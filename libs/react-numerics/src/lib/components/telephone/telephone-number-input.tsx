import { FormattedNumericInput } from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import {
  formatTelephoneNumber,
  FormatterFactory
} from "../../formatters/formatters";

export function TelephoneNumberInput({ locales, ...props }: Props) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatTelephoneNumber(locales)}
      {...props}
    />
  );
}

type FormattedNumericInputProps = Parameters<typeof FormattedNumericInput>[0];

interface Props
  extends Omit<FormattedNumericInputProps, "filter" | "formatter"> {
  locales?: Parameters<FormatterFactory>[0];
}
