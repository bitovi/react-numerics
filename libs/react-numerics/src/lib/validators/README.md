# Validation

How it works:

1. Check to see if the value meets the requirements.
1. If there is an error create the customValidity string that _may_ be set on
   the input.
1. Allow the numeric component owner to alter the customValidity and whether or
   not the validation will be reported.

## Gotchas

Using the `pattern` attribute along with custom JS validation is not
recommended. This is not unique to react-numerics it simply mixes HTML and JS
validation techniques.
