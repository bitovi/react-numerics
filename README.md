# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

## Need help or have questions?

This project is supported by [Bitovi, an end-to-end JavaScript
consultancy](https://www.bitovi.com/frontend-javascript-consulting/react-consulting)
specializing in React. You can get help or ask questions on our:

- [Discord Channel](https://discord.gg/fBA4HKABve)
- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free
consultation.](https://www.bitovi.com/frontend-javascript-consulting/react-consulting)

## Install & Usage

See the [@bitovi/react-numerics
documentation](https://bitovi.github.io/react-numerics/) for details on
installing and using the library.

## Publish

Execute the following steps starting in the workspace root directory (same as
this file).

- Bump the "libs/react-numerics/package.json" version field.
- Update the documentation `yarn typedoc`.
- Delete the `dist` directory.
- Build the library: `yarn build`.
- `cd` into the "dist/libs/react-numerics" directory.
- Run `npm publish --access=public`.

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

## We want to hear from you

Come chat with us about open source in our community
[Discord](https://discord.gg/fBA4HKABve).

See what we're up to by following us on [Twitter](https://twitter.com/bitovi).
