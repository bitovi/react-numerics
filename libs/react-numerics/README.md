# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

## API

- `CurrencyNumberInput`
- `EmployerIdentificationNumberInput` - U.S.
- `FormattedNumberInput` - low-level base component of concrete implementations.
- `PercentNumberInput`
- `SocialSecurityNumberInput` - U.S.
- `TelephoneNumberInput` - U.S.

## Architecture

There are three high-level things to know:

- The string values passed to the components via the `numericValue` property may
  only contain the non-digit characters '-' '.' or a digit: 0-9. If the string
  represents a number the integer and fractional parts of the number must be
  separated by a '.'. The value provided by `onNumericChange` follows these same
  rules.
- The first step in processing user input is to remove any characters that are
  not allowed for the specific numeric implementation. This is done using a
  function that implements the `Filter` interface.
- To create a number for display, functions that implement the `Format`
  interface are provided to the numeric component.
