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
 * Accepts a string as input and returns a copy that has had invalid characters
 * removed.
 * @description When a user changes the value of the input field that value is
 * passed to the Filter. The Filter creates a new string that has had any
 * characters that are not allowed removed.
 * @param next The value to filter.
 * @param previous The previous filtered value.
 */
export interface Filter {
  (next: string, previous?: string): string;
}
