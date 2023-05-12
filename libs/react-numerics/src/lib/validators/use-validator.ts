import { useMemo } from "react";
import type {
  ValidateContext,
  ValidationProps,
  Validator
} from "./validators-types";

/**
 * Creates a Validator function (if configured to do so by props) using the
 * provided factory function to create the Validator with the necessary context.
 * @param props
 * @param context
 * @param factory
 */
export function useValidator<ValidationProperties = unknown>(
  { updateCustomValidity, validate = false }: ValidationProps<unknown>,
  context: ValidateContext<ValidationProperties>,
  factory: ValidatorFactory<ValidationProperties>
): Validator | undefined {
  return useMemo<Validator | undefined>(() => {
    if (!validate && !updateCustomValidity) {
      return;
    }

    if (updateCustomValidity) {
      context.updateCustomValidity = updateCustomValidity;
    }

    return factory(context);
  }, [context, factory, updateCustomValidity, validate]);
}

interface ValidatorFactory<ValidationProperties = unknown> {
  (context: ValidateContext<ValidationProperties>): Validator;
}
