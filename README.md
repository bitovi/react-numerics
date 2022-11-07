# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

## Need help or have questions?

This project is supported by [Bitovi, an end-to-end JavaScript consultancy](https://www.bitovi.com/frontend-javascript-consulting/react-consulting) specializing in React. You can get help or ask questions on our:

- [Slack Community](https://www.bitovi.com/community/slack)
- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/frontend-javascript-consulting/react-consulting)


## Install & Usage

See the [@bitovi/react-numerics
documentation](https://bitovi.github.io/react-numerics/) for details on
installing and using the library.

## Publish

Execute the following steps starting in the workspace root directory (same as
this file).

See the publish workflow

# We want to hear from you.

Come chat with us about open source in our community [Slack](https://www.bitovi.com/community/slack).

See what we're up to by following us on [Twitter](https://twitter.com/bitovi).


# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

A [Bitovi React team](https://www.bitovi.com/frontend-javascript-consulting/react-consulting) project.

## Install

Install the package.

```sh
npm install @bitovi/react-numerics
```

## Usage

Import the component that you need.

```tsx
import { PercentNumberInput } from "@bitovi/react-numerics";

export function Form({ numericValue }: Props) {
  function handleNumericChange(value) {
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

Each component will render an `<input>` element with `type` equal to "text"
without styling.

### Reference to the input element

Each component allows an `inputRef` prop that will become a reference to the underlying html input element, if needed.

```tsx
import { PostalCodeNumberInput } from "@bitovi/react-numerics";

export function Form({ numericValue }: Props) {
  const myRef = React.createRef<HTMLInputElement>();
  // once rendered, `myRef.current` is the underlying <input> element

  function handleNumericChange(value) {
    // Do something with the value.
  }

  return (
    <PostalCodeNumberInput
      inputRef={myRef}
      numericValue="01970"
      onNumericChange={handleNumericChange}
    />
  );
}
```

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
