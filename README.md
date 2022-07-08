# react-numerics

A library of React components to render input fields that simplify displaying
formatted numbers such as currency or telephone numbers.

## Install & Usage

See the [@bitovi/react-numerics
documentation](https://bitovi.github.io/react-numerics/) for details on
installing and using the library.

## Publish

Execute the following steps starting in the workspace root directory (same as
this file).

- Bump the "libs/react-numerics/package.json" version field.
- Delete the `dist` directory.
- Build the library: `yarn build`.
- `cd` into the "dist/libs/react-numerics" directory.
- Run `npm publish --access=public`.
