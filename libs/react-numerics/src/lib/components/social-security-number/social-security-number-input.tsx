import {
  FormattedNumericInput,
  FormattedNumericInputProps
} from "../../formatted-numeric-input";
import { filterToNumeric } from "../../filters/filters";
import { formatSocialSecurityNumber } from "../../formatters/formatters";

/**
 * Display a formatted U.S. Social Security Number. For example:
 * "123-45-6789".
 * @param props - Component props.<p>`numericValue` must only contain
 * digits.</p>
 */
export function SocialSecurityNumberInput(
  props: SocialSecurityNumberInputProps
) {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatSocialSecurityNumber}
      {...props}
    />
  );
}

export interface SocialSecurityNumberInputProps
  extends Omit<
    FormattedNumericInputProps,
    "converter" | "filter" | "formatter"
  > {}
