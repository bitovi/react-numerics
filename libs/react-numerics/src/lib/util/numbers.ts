/**
 * Iterate over string, copy characters that are digits to the output; an
 * optional callback is invoked for characters that aren't digits, the callback
 * returns a string (an empty string will have no effect on the function
 * output).
 * @param value The string to iterate over.
 * @param nonDigitHandler Invoked when a character is not a digit.
 * @returns A string containing digits and the results from nonDigitHandler.
 */
export function extractDigits(
  value: string,
  nonDigitHandler: (
    char: string,
    index: number,
    value: string
  ) => string | null | undefined = () => ""
) {
  let output = "";

  for (let i = 0; i < value.length; i++) {
    if (isDigitCharacter(value[i])) {
      // numbers
      output += value[i];
    } else {
      output += nonDigitHandler(value[i], i, value) ?? "";
    }
  }

  return output;
}

const mapLocaleToCurrencySymbol: Record<
  string,
  { fractionLength: number; symbol: string }
> = {};

/**
 * Get the currency information for a locale.
 * @param locale The locale to use.
 * @param currency The ISO three letter currency ID.
 * @returns The currency data.
 */
export function getCurrencyData(locale: string, currency = "USD") {
  if (!(locale in mapLocaleToCurrencySymbol)) {
    const formatted = Intl.NumberFormat(locale, {
      currency,
      currencyDisplay: "symbol",
      style: "currency"
    }).formatToParts(1.1);

    mapLocaleToCurrencySymbol[locale] = {
      fractionLength:
        formatted.find(p => p.type === "fraction")?.value?.length ?? 0,
      symbol: formatted.find(p => p.type === "currency")?.value ?? "$"
    };
  }

  return mapLocaleToCurrencySymbol[locale];
}

const mapLocaleToDecimalSeparator: Record<string, string> = {};

/**
 * Get the decimal separator for a locale.
 * @param locale The locale to use.
 * @returns The character used to separate the integral and fractional parts of
 * a number.
 */
export function getDecimalSeparator(locale: string) {
  if (!(locale in mapLocaleToDecimalSeparator)) {
    const decimal = Intl.NumberFormat(locale)
      .formatToParts(1.1)
      .find(part => part.type === "decimal")?.value;

    mapLocaleToDecimalSeparator[locale] = decimal ?? ".";
  }

  return mapLocaleToDecimalSeparator[locale];
}

const mapLocaleToGroupingSeparator: Record<string, string> = {};

/**
 * Get the grouping separator for a locale.
 * @param locale The locale to use.
 * @returns The character used to separate the integral and fractional parts of
 * a number.
 */
export function getGroupingSeparator(locale: string) {
  if (!(locale in mapLocaleToGroupingSeparator)) {
    const grouping = Intl.NumberFormat(locale)
      .formatToParts(4444)
      .find(part => part.type === "group")?.value;

    mapLocaleToGroupingSeparator[locale] = grouping ?? ".";
  }

  return mapLocaleToGroupingSeparator[locale];
}

/**
 * Return true if the string contains a single character that is a digit
 * (character codes 48 through 57).
 * @param char A string with a single character.
 * @returns True if the character is a digit.
 */
export function isDigitCharacter(char: string) {
  if (char.length !== 1) {
    throw Error("Requires a string with only one character.");
  }

  const charCode = char.charCodeAt(0);
  return 48 <= charCode && charCode <= 57;
}

/**
 * Converts a localized string to a string representation that can be parsed.
 * For example if the value is an de-DE localized string of "3,14" (note the
 * comma decimal separator) the returned result will be "3.14".
 * @param value The localized numeric string value.
 * @param locale The locale of the value.
 */
export function localizedStringToNumber(value: string, locale: string) {
  if (!value) {
    return "";
  }

  const separator = getDecimalSeparator(locale);

  let separatorFound = false;
  let output = numberSign(value);
  output += extractDigits(value, char => {
    if (!separatorFound && separator === char) {
      separatorFound = true;
      return ".";
    }
  });

  return output;
}

/**
 * Pad a number on the right side using the template string.
 * @param input The string to pad.
 * @param template A string whose characters will be used to fill to the right
 * of the input if needed.
 * @returns
 */
export function padRight(input: string, template: string) {
  if (template.length <= input.length) {
    return input;
  }

  let result = "";

  for (let i = 0; i < template.length; i++) {
    result += i < input.length ? input[i] : template[i];
  }

  return result;
}

export function numberSign(input: string) {
  const trimmed = input.trim();
  return trimmed[0] === "+" || trimmed[0] === "-" ? trimmed[0] : "";
}
