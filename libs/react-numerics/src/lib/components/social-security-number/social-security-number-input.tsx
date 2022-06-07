import { FormattedNumericInput } from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatSocialSecurityNumber } from "../../formatters/formatters";

export function SocialSecurityNumberInput(props: Props) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatSocialSecurityNumber}
      {...props}
    />
  );
}

type FormattedNumericInputProps = Parameters<typeof FormattedNumericInput>[0];

interface Props
  extends Omit<FormattedNumericInputProps, "filter" | "formatter"> {}
