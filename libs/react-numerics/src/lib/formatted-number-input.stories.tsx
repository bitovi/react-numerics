import { useEffect, useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { FormattedNumberInput } from "./formatted-number-input";

export default {
  argTypes: {
    decimalPlaces: { type: "number" },
    locales: { options: ["en-US", "de-DE"] },
    numericValue: {
      control: {
        disable: true
      }
    },
    onNumericChange: { action: "onNumericChange" },
    roundingMode: { options: [null, 1, 2, 3, 4, 5, 6, 7, 8] }
  },
  component: FormattedNumberInput,
  title: "FormattedNumberInput"
} as ComponentMeta<typeof FormattedNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof FormattedNumberInput>
> = args => {
  const { numericValue, onNumericChange, ...props } = args;

  const [value, setValue] = useState<typeof numericValue>("");

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  return (
    <FormattedNumberInput
      {...props}
      numericValue={value}
      onNumericChange={numeric => {
        onNumericChange && onNumericChange(numeric);
        setValue(numeric);
      }}
    />
  );
};

const Primary = Template.bind({});
Primary.args = {
  decimalPlaces: 4,
  locales: "en-US",
  numericValue: "3.14"
};

export { Primary };
