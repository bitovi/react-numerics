import { useEffect, useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { FormattedNumberInput } from "./formatted-number-input";

export default {
  argTypes: {
    decimalPlaces: { type: "number" },
    locales: { options: ["en-US", "de-DE"] },
    numericValue: {
      control: { type: "text" },
      type: { required: true }
    },
    onNumericChange: {
      control: {
        disable: true
      },
      type: { required: true }
    },
    roundingMode: { options: [null, 1, 2, 3, 4, 5, 6, 7, 8] }
  },
  component: FormattedNumberInput,
  title: "Inputs/Formatted/Number Input"
} as ComponentMeta<typeof FormattedNumberInput>;

const Template: Story<typeof FormattedNumberInput> = args => {
  const { numericValue, onNumericChange, ...props } =
    args as unknown as React.ComponentPropsWithoutRef<
      typeof FormattedNumberInput
    >;

  const [value, setValue] = useState<typeof numericValue>();

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  return (
    <FormattedNumberInput
      {...props}
      numericValue={value}
      onNumericChange={numeric => {
        onNumericChange(numeric);
        setValue(numeric);
      }}
    />
  );
};

const Primary: Story = Template.bind({});
Primary.args = {
  decimalPlaces: 4,
  locales: "en-US",
  numericValue: "3.14"
};

export { Primary };
