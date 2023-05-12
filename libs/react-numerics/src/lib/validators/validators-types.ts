import type { FormattedNumericInputProps } from "../formatted-numeric-input";
import { Locales } from "../types";

/**
 * Implemented by a client that wants to alter a validation result before it is
 * applied to the input.
 *
 * The returned value will be used to set the validation state of the input.
 * This is invoked with the default validation which indicates the type of
 * validation error that has occurred.
 *
 * To immediately clear an invalid state return an object where `customValidity`
 * is an empty string and `report` is true.
 *
 * To prevent an error popup from being displayed by the browser when setting
 * the input invalid, set the return value's `report` to false.
 * @template ValidationProperties Part of the `context` argument; for example
 * `ValidateMin`.
 */
export interface UpdateCustomValidity<ValidationProperties> {
  (
    /** The current `numericValue` of the input. */
    number: FormattedNumericInputProps["numericValue"],
    /** Information about the current validation status. */
    context: ValidationProperties & { type: ValidateContextType },
    /** The current validation result. */
    result?: ValidateResultInternal | undefined
  ): ValidateResult | void;
}

/**
 * Implemented by components that allow clients to control validation.
 * @template ValidationProperties The type that will be passed as context to
 * `updateCustomValidity`.
 */
export interface ValidationProps<ValidationProperties> {
  /**
   * If provided the react-numeric validation will be enabled (i.e. `validate`
   * will always be true).
   */
  updateCustomValidity?: UpdateCustomValidity<ValidationProperties>;
  /** If true the the react-numeric validation will be enabled; defaults to
   * `false`. Does not need to be included if `updateCustomValidity` is
   * provided. */
  validate?: boolean;
}

/**
 * Provides the `updateCustomValidity` function so clients can modify validation
 * if desired before it is applied to an input coupled with
 * `ValidationProperties` (like "min", "max", etc.).
 * @template ValidationProperties The type that will be passed as context to
 * `updateCustomValidity`.
 * @interface
 */
export type ValidateContext<ValidationProperties> = ValidationProperties & {
  /** Locale information that may be necessary to do proper validation. */
  locales?: Locales;
  /** If a `title` is provided it will be set as the value of customValidity as
   * long as the value is NOT an empty string. */
  title?: HTMLInputElement["title"];
  /**
   * Implemented by a client if it wants the opportunity to change the custom
   * validity.
   */
  updateCustomValidity?: UpdateCustomValidity<ValidationProperties>;
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
 * Implemented by Validator contexts that are concerned with a minimum numeric
 * value.
 * @interface
 */
export interface ValidateMin
  extends Pick<React.InputHTMLAttributes<HTMLInputElement>, "min"> {}

/**
 * Implemented by Validator contexts that are concerned with a minimum numeric
 * string length.
 * @interface
 */
export interface ValidateMinLength
  extends Pick<React.InputHTMLAttributes<HTMLInputElement>, "minLength"> {}

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
 * @internal
 */
export interface ValidateResultInternal
  extends Omit<ValidateResult, "customValidity"> {
  /** Set to the type error. Provide an empty string to set the input to a valid
   * state. */
  customValidity: ValidateErrorTypes | "";
}

export interface Validator {
  /**
   * Implementations of this function examine the current `numericValue` and
   * determine if it is valid or not and if the validity should be reported to
   * the user.
   *
   * Set `customValidity` to an empty string to make the input valid.
   * @returns If an object is returned the value of `customValidity` will be set
   * as the element's custom validity, if null or undefined the validity message
   * will not be updated.
   */
  (
    /** Usually the current `numericValue` of the input. */
    number: FormattedNumericInputProps["numericValue"],
    /** Information about the conditions under which the validation is
     * occurring. */
    type: ValidateContextType
  ): ValidateResult | void;
}
