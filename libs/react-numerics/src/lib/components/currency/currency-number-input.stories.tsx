import { useEffect, useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { CurrencyNumberInput } from "./currency-number-input";

export default {
  argTypes: {
    locales: { options: ["en-US", "de-DE"] },
    numericValue: {
      control: {
        disable: true
      }
    },
    onNumericChange: { action: "onNumericChange" },
    roundingMode: {
      control: { type: "select" },
      options: [null, 1, 2, 3, 4, 5, 6, 7, 8]
    }
  },
  component: CurrencyNumberInput,
  title: "CurrencyNumberInput"
} as ComponentMeta<typeof CurrencyNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof CurrencyNumberInput>
> = args => {
  const { numericValue, onNumericChange, ...props } = args;

  const [value, setValue] = useState<typeof numericValue>("");

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  return (
    <CurrencyNumberInput
      {...props}
      onNumericChange={numeric => {
        onNumericChange && onNumericChange(numeric);
        setValue(numeric);
      }}
      numericValue={value}
    />
  );
};

const Primary = Template.bind({});
Primary.args = {
  locales: "en-US",
  numericValue: "1.239"
};

export { Primary };
