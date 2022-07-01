import { BigNumber } from "bignumber.js";
import { Locales } from "../types";
import {
  getCurrencyData,
  getDecimalSeparator,
  getGroupingSeparator,
  padRight
} from "../util/numbers";

/**
 * Format a number as localized currency.
 * @see CurrencyFormatterFactory
 * @see Formatter
 */
export const formatCurrency: CurrencyFormatterFactory =
  (
    locales = "en-US",
    { padRight: padRightOpt, showFraction = true, ...options } = {}
  ) =>
  (number: string, previousFormatted?: string, context?: FormatterContext) => {
    const locale = Array.isArray(locales) ? locales[0] : locales;

    const { fractionLength, symbol } = getCurrencyData(locale);

    let value = formatNumberString(
      number,
      {
        decimalPlaces: showFraction ? fractionLength : 0,
        locales,
        ...options,
        type: context?.type,
        userKeyed: context?.userKeyed
      },
      previousFormatted ?? ""
    );

    const decimalSeparator = getDecimalSeparator(locale);

    if (value && showFraction && (padRightOpt || context?.type === "blur")) {
      // Pad the fractional part with zeros.
      value = padNumericFraction(locale, value, {
        decimalSeparator,
        fractionLength
      });
    }

    return `${value ? symbol : ""}${value}`;
  };

/**
 * Format an employer identification number (EIN).
 */
export const formatEmployerIdentificationNumber: Formatter = (
  number: string
) => {
  return formatNumericString(["", "", "-", "", "", "", "", "", ""], number);
};

/**
 * Format a floating point number.
 * @see FloatFormatterFactory
 * @see Formatter
 */
export const formatFloat: FloatFormatterFactory =
  (locales, options) =>
  (number: string, previousFormatted?: string, context?: FormatterContext) =>
    formatNumberString(
      number,
      {
        locales,
        roundingMode: options?.roundingMode ?? BigNumber.ROUND_DOWN,
        ...options,
        type: context?.type,
        userKeyed: context?.userKeyed
      },
      previousFormatted
    );

/**
 * Format an integer.
 * @see FormatterFactory
 * @see Formatter
 */
export const formatInteger: FormatterFactory =
  (locales = "en-US") =>
  (number: string) =>
    formatNumberString(number, {
      locales,
      decimalPlaces: 0,
      roundingMode: BigNumber.ROUND_DOWN
    });

/**
 * Format a number with a percent sign when the input loses focus.
 * @see FloatFormatterFactory
 * @see Formatter
 */
export const formatPercent: FloatFormatterFactory =
  (locales, options) =>
  (number: string, previousFormatted?: string, context?: FormatterContext) => {
    const value = formatNumberString(
      number,
      {
        locales,
        ...options,
        type: context?.type,
        userKeyed: context?.userKeyed
      },
      previousFormatted
    );

    const { userKeyed = false } = context ?? {};
    const appendPercent = value && !userKeyed;

    return `${value}${appendPercent ? "%" : ""}`;
  };

/**
 * Format a US zip code.
 */
export const formatPostalCodeNumber: Formatter = (number: string) => {
  return formatNumericString(["", "", "", "", ""], number);
};

/**
 * Format a social security number (SSN).
 */
export const formatSocialSecurityNumber: Formatter = (number: string) => {
  return formatNumericString(["", "", "", "-", "", "-", "", "", ""], number);
};

/**
 * Format a telephone number.
 */
export const formatTelephoneNumber: FormatterFactory =
  (locales = "en-US") =>
  (number: string) => {
    return formatNumericString(
      ["(", "", "", ") ", "", "", "-", "", "", ""],
      number
    );
  };

/**
 * Right-zero-pad the fractional part of a number. If numericValue is an empty
 * string, null, or undefined then numericValue will be returned.
 * @param locales The locales used to get fractionLength and decimalSeparator if
 * not supplied.
 * @param numericValue The value to pad.
 * @param options These options override the values that would normally be used
 * based on the locales.
 * @returns
 */
export function padNumericFraction(
  locales: Locales,
  numericValue: string,
  options?: { decimalSeparator?: string; fractionLength?: number }
) {
  if (!numericValue) {
    return numericValue;
  }

  if (!locales) {
    return numericValue;
  }

  const [integer = "", fraction = ""] = numericValue.split(".");

  let safeFractionLength: number;
  if (!options?.fractionLength && options?.fractionLength !== 0) {
    ({ fractionLength: safeFractionLength } = getCurrencyData(
      Array.isArray(locales) ? locales[0] : locales
    ));
  } else {
    safeFractionLength = options.fractionLength;
  }

  let safeDecimalSeparator: string;
  if (!options?.decimalSeparator) {
    safeDecimalSeparator = getDecimalSeparator(
      Array.isArray(locales) ? locales[0] : locales
    );
  } else {
    safeDecimalSeparator = options.decimalSeparator;
  }

  const fractionPadded = padRight(fraction, "0".repeat(safeFractionLength));
  return `${integer}${
    fractionPadded ? safeDecimalSeparator : ""
  }${fractionPadded}`;
}

/**
 * Optionally accepts one or more locales and returns a Formatter that generates
 * a currency formatted string..
 */
export interface CurrencyFormatterFactory {
  (
    /** The locales to use when the Formatter is invoked. */
    locales?: FormatNumberStringOptions["locales"],
    options?: Partial<
      Omit<FormatNumberStringOptions, "locales"> &
        Pick<FormatFloatStringOptions, "roundingMode">
    > & {
      /** If true the currency will display a fractional component. */
      showFraction?: boolean;
      /** If true the fractional component will be right-padded with zeroes per
       * the specified locale. */
      padRight?: boolean;
    }
  ): Formatter;
}

/**
 * Optionally accepts one or more locales and returns a Formatter.
 * @param roundingMode
 */
export interface FloatFormatterFactory {
  (
    /** The locales to use when the Formatter is invoked. */
    locales?: FormatNumberStringOptions["locales"],
    options?: Partial<
      Omit<FormatNumberStringOptions, "locales"> & FormatFloatStringOptions
    >
  ): Formatter;
}

/**
 * Accepts a numeric input string and returns a string formatted for display.
 */
export interface Formatter {
  (
    /** The value to format. If the input represents a number like a float or
     * integer it must be formatted in the en-US locale, i.e. uses a "." to
     * separate the whole from the fractional part. */
    input: string
  ): string;
  (
    /** The value to format. If the input represents a number like a float or
     * integer it must be formatted in the en-US locale, i.e. uses a "." to
     * separate the whole from the fractional part. */
    input: string,
    /** The previous formatted value. */
    previousFormatted: string,
    /** The current context of the format request. */
    context: FormatterContext
  ): string;
}

/**
 * Optionally accepts one or more locales and returns a Formatter.
 */
export interface FormatterFactory {
  (
    /** The locales to use when the Formatter is invoked. */
    locales?: FormatNumberStringOptions["locales"]
  ): Formatter;
}

function formatNumberString(
  number: string,
  {
    decimalPlaces,
    locales = "en-US",
    roundingMode,
    type,
    userKeyed,
    ...opts
  }: Partial<
    FormatNumberStringOptions & FormatFloatStringOptions & FormatterContext
  >,
  previousFormatted = ""
) {
  const safeNumber = number.trim();

  if (!safeNumber) {
    return "";
  }

  const max =
    "max" in opts && typeof opts.max !== "undefined" && opts.max !== null
      ? new BigNumber(opts.max)
      : null;

  const min =
    "min" in opts && typeof opts.min !== "undefined" && opts.min !== null
      ? new BigNumber(opts.min)
      : null;

  if (max !== null && min !== null && max.lt(min)) {
    throw Error(
      `formatNumberString: Max value (${max}) is less than min value (${min}).`
    );
  }

  const signOnly = numberIsOnlySign(safeNumber);
  if (signOnly) {
    if (safeNumber[0] === "-") {
      // If the min is less than 0 then there can't be a negative sign.
      return min === null || min.lt(0) ? safeNumber : "";
    } else {
      // If the max is less than 0 then there can't be a positive sign.
      return max === null || max.lt(0) ? safeNumber : "";
    }
  }

  const locale = Array.isArray(locales) ? locales[0] : locales;

  const numberFormat: BigNumber.Format = {
    decimalSeparator: getDecimalSeparator(locale),
    groupSeparator: getGroupingSeparator(locale),
    groupSize: 3
  };

  const num = new BigNumber(safeNumber);

  if (num.isNaN()) {
    return safeNumber;
  }

  if ((min !== null && num.lt(min)) || (max !== null && max.lt(num))) {
    return previousFormatted;
  }

  const [, fraction = ""] = safeNumber.split(".");

  const decimalPlacesMax =
    typeof decimalPlaces === "number" ? decimalPlaces : 20;

  // If `type` is "change" and `userKeyed` is `true` set the rounding mode to
  // `floor`. The practical effect here is truncating the fractional part of the
  // number to the maximum number of decimal places that are allowed. This is
  // only done when the user is typing, other change types (like pasting an
  // input with more decimal places than allowed) will be rounded.
  let modifiedRoundingMode: BigNumber.RoundingMode | undefined = roundingMode;
  if (type === "change" && userKeyed) {
    modifiedRoundingMode = BigNumber.ROUND_DOWN;
  }

  // The toFormat documentation allows roundingMode to be undefined, the
  // signature type is wrong.
  const formatted = num.toFormat(
    fraction.length < decimalPlacesMax ? fraction.length : decimalPlacesMax,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modifiedRoundingMode as any,
    numberFormat
  );

  let includeSeparator = safeNumber.endsWith(".");
  if (type === "blur") {
    includeSeparator = false;
  } else if ((decimalPlaces ?? 1) < 1) {
    includeSeparator = false;
  }

  return (
    (numberStartsWithSign(safeNumber) &&
    !numberStartsWithSign(formatted) &&
    (min === null || min.lt(0)) // Preserve a negative sign on `-0.0`.
      ? safeNumber[0]
      : "") +
    formatted +
    (includeSeparator ? numberFormat.decimalSeparator : "")
  );
}

function formatNumericString(formatting: string[], number: string) {
  let output = "";
  for (let i = 0; i < number.length && i < formatting.length; i++) {
    output += formatting[i] + number[i];
  }

  return output;
}

function numberIsOnlySign(input: string) {
  return input === "+" || input === "-" ? input : "";
}

function numberStartsWithSign(input: string) {
  return input.startsWith("+") || input.startsWith("-");
}

/** Options that apply to numbers with a fractional part. */
interface FormatFloatStringOptions {
  /** The number of places to return in the formatted value. */
  decimalPlaces: number;
  /** How a number with more precision than the allowed decimal places should be
   * rounded. */
  roundingMode: BigNumber.RoundingMode;
}

/** Options that apply to all numerics that represent a number. */
interface FormatNumberStringOptions {
  /** The locales to use when the Formatter is invoked. */
  locales: Locales;
  /** The maximum allowed number value. */
  max: string | number;
  /** The minimum allowed number value. */
  min: string | number;
}

/** The context under which the formatter was invoked. */
interface FormatterContext {
  /** The name commonly used to refer to the specific event. */
  type?: "blur" | "change";
  /** True if the user typed a key to make the change. */
  userKeyed?: boolean;
}
