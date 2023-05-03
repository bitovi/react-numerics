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

## Install

Install the package.

```sh
npm install @bitovi/react-numerics
```

-or-

```sh
yarn add @bitovi/react-numerics
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
component accepts values for most of the standard `HTMLInputElement` attributes
with the notable exception of `type`.

Each component will render an unstyled `<input>` element with `type` equal to
"text".

### Reference to the input element

Each component implements React's `forwardRef` interface that will return a
reference to the underlying `<input>` element.

```tsx
import { PostalCodeNumberInput } from "@bitovi/react-numerics";

export function Form({ numericValue }: Props) {
  const myRef = React.createRef<HTMLInputElement>();
  // Once rendered, `myRef.current` is the underlying <input> element.

  function handleNumericChange(value) {
    // Do something with the value.
  }

  return (
    <PostalCodeNumberInput
      numericValue="01970"
      onNumericChange={handleNumericChange}
      ref={myRef}
    />
  );
}
```

### Available components

The following types of components are currently available:

<table style="border-collapse:collapse;border-color:#ccc;border-spacing:0" class="tg"><thead><tr><th style="background-color:#f0f0f0;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Component</th><th style="background-color:#f0f0f0;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Locales</th><th style="background-color:#f0f0f0;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Note</th></tr></thead><tbody><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">CurrencyNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">en-US</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td></tr><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">PercentNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">any</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td></tr><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">TelephoneNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">en-US</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Requires area code and exchange.</td></tr><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">PostalCodeNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">en-US</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Only 5 digit zip code supported.</td></tr><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">SocialSecurityNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">en-US</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td></tr><tr><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">EmployerIdentificationNumberInput</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">en-US</td><td style="background-color:#fff;border-color:inherit;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal"></td></tr></tbody></table>

## We want to hear from you

Come chat with us about open source in our community
[Discord](https://discord.gg/fBA4HKABve).

See what we're up to by following us on [Twitter](https://twitter.com/bitovi).
