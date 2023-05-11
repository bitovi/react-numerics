/** Implemented by components that allow clients to control validation. */
export interface ValidateAndUpdateProps<T> {
  updateCustomValidity?: ValidateContext<T>["updateCustomValidity"];
  /** If true the data in the input will be validated; defaults to `false`. */
  validate: true;
}

/**
 * Provides the `updateCustomValidity` function so clients can modify validation
 * if desired before it is applied to an input coupled with
 * `ValidationProperties` (like "min", "max", etc.) that is required by
 * validation functions to complete their work.
 */
export type ValidateContext<ValidationProperties> = ValidationProperties & {
  /** If a `title` is provided it will be set as the value of customValidity as
   * long as the value is NOT an empty string. */
  title?: HTMLInputElement["title"];
  /**
   * Whatever value is returned will be used to set the validation state of the
   * This will be invoked after the validation process has been completed.
   * input.
   *
   * To immediately clear an invalid state return an object where
   * `customValidity` is an empty string and `report` is true.
   *
   * To prevent an error popup from being displayed by the browser when setting
   * the input invalid set `report` to false.
   */
  updateCustomValidity?: (
    number: Parameters<Validator>[0],
    context: ValidationProperties & { type: ValidateContextType },
    error: ValidateResultError | undefined
  ) => ValidateResult | void;
};

/** Information about the conditions under which the validate request is
 * happening. */
export type ValidateContextType =
  | "blur" // The element lost focus.
  | "change" // The element value changed.
  | "mount"; // The component has mounted.

/** A map of validation error "tags" to a human readable message.
 * `ValidateErrorTypes` is derived from the keys of this object. These are the
 * default messages displayed when an input is invalid for the reason to
 * described by the key. */
export const validateErrorsMap = {
  INVALID_LESS_THAN_MIN_LENGTH:
    "The entered value is shorter than the required minimum number of characters.",
  INVALID_LESS_THAN_MIN_VALUE:
    "The entered value is less than the required minimum value."
} as const;

export type ValidateErrorTypes = keyof typeof validateErrorsMap;

/**
 * Implemented by Validator contexts that are concerned with a minimum value.
 */
export interface ValidateMinValue {
  min?: React.InputHTMLAttributes<HTMLInputElement>["min"];
}

export interface ValidateProps {
  /** If true the data in the input will be validated; defaults to `false`. */
  validate?: boolean;
}

/**
 * Indicates how to respond to a validation request.
 */
export interface ValidateResult {
  /** Set a custom validity value on the input element. Provide an empty
   * string to set the input to a valid state. */
  customValidity: string;
  /** If true the input's `reportValidity` method will be invoked which will
   * cause the browser to display the value of customValidity. */
  report?: boolean;
}

/**
 * A variation of `ValidateResult` where `customValidity` is a
 * `ValidateErrorTypes`.
 */
export interface ValidateResultError
  extends Omit<ValidateResult, "customValidity"> {
  customValidity: ValidateErrorTypes | "";
}

/** Implementations of this function examine the current `numericValue` and
 * determine if it is valid or not and if the validity should be reported to the
 * user. */
export interface Validator {
  /**
   * Update the validity of the input. Set `customValidity` to an empty string
   * to make the element valid.
   * @returns If an object is returned the value of `customValidity` will be set
   * as the element's custom validity, if null or undefined the validity message
   * will not be updated.
   */
  (
    /** Usually the current `numericValue` of the input. */
    number: string,
    /** Information about the conditions under which the validation is
     * occurring. */
    type: ValidateContextType
  ): ValidateResult | void;
}
