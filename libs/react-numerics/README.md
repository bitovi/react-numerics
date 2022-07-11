# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

## Install

Install the package.

```sh
yarn install @bitovi/react-numerics
```

## Usage

Import the component that you need.

```tsx
import { PercentNumberInput } from "@bitovi/react-numerics";

export function Form({ numericValue }: Props){
  function handleNumericChange(value){
    // Do something with the value.
  }

  return (
    <PercentNumberInput
      numericValue={numericValue}
      onNumericChange={handleNumericChange}
    />
  );
}
```

Components require the `numericValue` and `onNumericChange` props. Each
component accepts values for most of the standard `HTMLInputElement` attributes.

Each component will render an `<input>` element without styling.

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
