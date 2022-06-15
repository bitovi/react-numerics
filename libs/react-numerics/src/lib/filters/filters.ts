import {
  extractDigits,
  localizedStringToNumber,
  numberSign
} from "../util/numbers";

// export const filterToInteger: Filter = (next, previous = "") => {
//   return /^(-(?!0)|-?[1-9]+)[0-9]*$/m.test(next) ? next ?? "" : previous;
// };

/**
 * Removes all non-numeric characters from a string.
 */
export const filterToNumeric: Filter = input => {
  return input ? extractDigits(input) : "";
};

/**
 * Filters a string to numeric characters, a decimal separator, and a sign.
 * @param input A string containing a floating point value in the en-US locale.
 */
export const filterToSignedFloat: Filter = input => {
  return localizedStringToNumber(input, "en-US");
};

/**
 * Removes all non-numeric characters from a string EXCEPT for a leading sign (+
 * or -).
 */
export const filterToSignedNumeric: Filter = input => {
  return input ? numberSign(input) + extractDigits(input) : "";
};

/**
 * Accepts an input string and returns a version that has had invalid characters
 * removed.
 * @param next The value to filter.
 * @param previous The previous filtered value.
 */
export interface Filter {
  (next: string, previous?: string): string;
}
