import {
  extractDigits,
  getDecimalSeparator,
  numberSign
} from "../util/numbers";

/**
 * Convert a number string from one locale to another. All characters except
 * sign, digits, and decimal separator will be removed from the string.
 */
export const convertNumber: ConverterFactory =
  (inputLocale = "en-US") =>
  (number, outputLocale = "en-US") => {
    if (!number) {
      return "";
    }

    const inputSeparator = getDecimalSeparator(
      Array.isArray(inputLocale) ? inputLocale[0] : inputLocale
    );
    const outputSeparator = getDecimalSeparator(outputLocale);

    let separatorFound = false;
    let output = numberSign(number);
    output += extractDigits(number, char => {
      if (!separatorFound && inputSeparator === char) {
        separatorFound = true;
        return outputSeparator;
      }
    });

    return output;
  };

/**
 * Accepts an input string of the specified locale and returns a string
 * formatted to the en-US locale.
 * @param input The value to convert. The input locale is supplied as the
 * `locale` argument to the ConverterFactory.
 * @param outputLocale The locale of the return value.
 */
export interface Converter {
  (input: string, outputLocale?: string): string;
}

/**
 * Optionally accepts one or more locales and returns a Filter.
 * @param locales The locales that describe the input number to be converted.
 */
export interface ConverterFactory {
  (locale?: string | string[]): Converter;
}
