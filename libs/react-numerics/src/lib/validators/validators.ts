import BigNumber from "bignumber.js";
import type {
  ValidateContext,
  ValidateErrorTypes,
  ValidateMin,
  ValidateResult,
  ValidateResultInternal,
  Validator
} from "./validators-types";
import { validateErrorsMap } from "./validators-types";

/**
 * Factory function to create a Validator that will test a currency value for
 * validity.
 * @param context Information that will be used in the `Validator` that is
 * returned to test validity.
 */
export function validateCurrency(
  context: ValidateContext<ValidateMin>
): Validator {
  // The filter and formatter should handle `max` for us by refusing to allow
  // a value greater than the max to be entered. The same goes for characters
  // that are not numbers.
  return (number, type) =>
    updateDefaultCustomValidity(
      validateMinValue(number, type, context),
      context
    );
}

export function validatePostalCode(
  context: ValidateContext<ValidateMin>
): Validator {
  return (number, type) =>
    updateDefaultCustomValidity(
      validateMinValue(
        number.length ? "" + number.length : "",
        type,
        context,
        "INVALID_LESS_THAN_MIN_LENGTH"
      ),
      context
    );
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
function updateDefaultCustomValidity(
  validatorResult: ReturnType<Validator>,
  context: ValidateContext<unknown>
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

/** Normal min validation:
 *   - change: set input valid
 *   - blur: set invalid if less than min and show error
 *   - mount: set invalid if less than min
 */
function validateMinValue(
  number: Parameters<Validator>[0],
  type: Parameters<Validator>[1],
  context: ValidateContext<ValidateMin>,
  customValidity: ValidateErrorTypes = "INVALID_LESS_THAN_MIN_VALUE"
): ReturnType<Validator> {
  let result: ValidateResultInternal | undefined;

  if (type === "change") {
    // If the user is changing the value so set the input to be valid for now.
    result = { customValidity: "", report: true };
  } else if (type === "blur") {
    if (!compareMinValue(number, context.min)) {
      result = { customValidity, report: true };
    } else {
      result = { customValidity: "", report: true };
    }
  } else if (type === "mount") {
    // The initial value provided to the input is invalid, set the input
    // invalid but don't raise an error - that would be annoying.
    if (!compareMinValue(number, context.min)) {
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
