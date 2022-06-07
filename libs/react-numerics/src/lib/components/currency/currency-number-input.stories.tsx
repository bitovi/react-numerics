import { useEffect, useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { CurrencyNumberInput } from "./currency-number-input";

export default {
  argTypes: {
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
    roundingMode: {
      control: { type: "select" },
      options: [null, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  component: CurrencyNumberInput,
  title: "Inputs/Formatted/Currency Number Input"
} as ComponentMeta<typeof CurrencyNumberInput>;

const Template: Story<typeof CurrencyNumberInput> = args => {
  console.log("Story<CurrencyNumberInput>: args=", args);
  const { numericValue, onNumericChange, ...props } =
    args as unknown as React.ComponentPropsWithoutRef<
      typeof CurrencyNumberInput
    >;

  const [value, setValue] = useState<typeof numericValue>();

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  console.log("Story<CurrencyNumberInput>: value=", value);
  return (
    <CurrencyNumberInput
      {...props}
      onNumericChange={numeric => {
        onNumericChange(numeric);
        setValue(numeric);
      }}
      numericValue={value}
    />
  );
};

const Primary: Story = Template.bind({});
Primary.args = {
  locales: "en-US",
  numericValue: "1.239"
};

export { Primary };
