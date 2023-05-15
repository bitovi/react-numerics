import BigNumber from "bignumber.js";
import type {
  ValidateContext,
  ValidateErrorTypes,
  ValidateMin,
  ValidateMinLength,
  ValidateResult,
  ValidateResultInternal,
  Validator
} from "./validators-types";
import { validateErrorsMap } from "./validators-types";

/**
 * Factory function to create a Validator that will test a value to see if it is
 * equal to or greater than a minimum value.
 * @param context Information that will be used in the `Validator` that is
 * returned to test validity.
 */
export function validateMinValue(
  context: ValidateContext<ValidateMin>
): Validator {
  return (number, type) =>
    updateDefaultCustomValidity(
      validateMin(
        number,
        type,
        context,
        "INVALID_LESS_THAN_MIN_VALUE",
        context.min
      ),
      context
    );
}

/**
 * Factory function to create a Validator that will test the string length of a
 * numeric value
 * @param context Information that will be used in the `Validator` that is
 * returned to test validity.
 */
export function validateNumericLength(
  context: ValidateContext<ValidateMinLength>
): Validator {
  return (number, type) => {
    // Using the spread operator causes the string to break the string into
    // characters (which is what we need) in an array that we can then count. We
    // could probably just use `number.length` but there are some characters
    // that would not be counted correctly.
    //
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length
    const charLength = [...number].length;
    return updateDefaultCustomValidity(
      validateMin(
        charLength ? "" + charLength : "",
        type,
        context,
        "INVALID_LESS_THAN_MIN_LENGTH",
        context.minLength
      ),
      context
    );
  };
}

/**
 * Factory function to create a Validator that will test the string length of a
 * telephone number.
 * @param context Information that will be used in the `Validator` that is
 * returned to test validity. `locales` defaults to "en-US".
 */
export function validateTelephoneNumber({
  locales = "en-US",
  ...context
}: ValidateContext<unknown>): Validator {
  return (number, type) => {
    let minLength = 0;
    if (locales === "en-US") {
      // Defaults to a telephone number that includes area code, exchange,
      minLength = 10;
    }

    const factory = validateNumericLength({ ...context, locales, minLength });
    return factory(number, type);
  };
}

/**
 * Compares a number against a minimum allowed value and returns true if the
 * number is greater than, or equal to, the min.
 * @param number The number to compare.
 * @param [min] The minimum acceptable value.
 */
function compareMinValue(
  number: string | number,
  min?: ValidateMin["min"]
): boolean {
  if (!min && min !== 0) {
    return true;
  }

  // Don't consider an empty string to be invalid, that should be covered by the
  // `required` attribute.
  if (!number) {
    return true;
  }

  return new BigNumber(min).lte(new BigNumber(number));
}

/**
 * If `validatorResult`'s `customValidity` is a string that matches a property
 * in `validateErrorsMap` then get the value for that property which is a human
 * readable string.
 * @param validatorResult The result from a Validator function.
 */
function updateDefaultCustomValidity<ValidationProperties>(
  validatorResult: ReturnType<Validator>,
  context: ValidateContext<ValidationProperties>
): ReturnType<Validator> {
  const nextResult = validatorResult ? { ...validatorResult } : validatorResult;

  if (nextResult && nextResult.customValidity in validateErrorsMap) {
    // Convert the `customValidity` "tag" into a default human
    // readable error message.
    nextResult.customValidity = (validateErrorsMap as Record<string, string>)[
      nextResult.customValidity
    ];
  }

  // If the input element has a title tag and that should be used
  if (nextResult?.customValidity && context.title) {
    nextResult.customValidity = context.title;
  }

  return nextResult;
}

// type PickByValueType<T, U> = {
//   [K in keyof T as T[K] extends U | undefined ? K : never]: T[K];
// };
// type PickByValueTypeKeys<T, U> = keyof PickByValueType<T, U>;

/** Compare the number to a value:
 *   - change: set input valid
 *   - blur: set invalid if less than min and show error
 *   - mount: set invalid if less than min
 */
function validateMin<T extends ValidateMin | ValidateMinLength>(
  number: Parameters<Validator>[0],
  type: Parameters<Validator>[1],
  context: ValidateContext<T>,
  customValidity: ValidateErrorTypes,
  min?: string | number
) {
  let result: ValidateResultInternal | undefined;

  if (type === "change") {
    // If the user is changing the value so set the input to be valid for now.
    result = { customValidity: "", report: true };
  } else if (type === "blur") {
    if (!compareMinValue(number, min)) {
      result = { customValidity, report: true };
    } else {
      result = { customValidity: "", report: true };
    }
  } else if (type === "mount") {
    // The initial value provided to the input is invalid, set the input
    // invalid but don't raise an error - that would be annoying.
    if (!compareMinValue(number, min)) {
      result = { customValidity };
    }
  }

  if (context.updateCustomValidity) {
    (result as ValidateResult | void) = context.updateCustomValidity(
      number,
      { ...context, type },
      result
    );
  }

  return result;
}
