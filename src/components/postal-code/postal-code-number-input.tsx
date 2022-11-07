import {
  FormattedNumericInput,
  FormattedNumericInputProps,
} from "../../formatted-numeric-input"
import { filterToNumeric } from "../../filters/filters"
import { formatPostalCodeNumber } from "../../formatters/formatters"

/**
 * Create a formatted postal code. For example a U.S. 5 digit zip code "12345".
 *
 * Supported locales: U.S.
 *
 * @param props - Component props.<p>`locales` defaults to
 * "en-US".</p><p>`numericValue` must only contain digits.</p>
 */
export function PostalCodeNumberInput(
  props: PostalCodeNumberInputProps,
): JSX.Element {
  return (
    <FormattedNumericInput
      filter={filterToNumeric}
      formatter={formatPostalCodeNumber}
      {...props}
    />
  )
}

export type PostalCodeNumberInputProps = Omit<
  FormattedNumericInputProps,
  "converter" | "filter" | "formatter"
>
