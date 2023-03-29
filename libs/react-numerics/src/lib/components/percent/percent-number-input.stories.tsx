import { useEffect, useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { PercentNumberInput } from "./percent-number-input";

export default {
  argTypes: {
    decimalPlaces: {
      control: { type: "number", min: 0, max: 20, step: 1 }
    },
    locales: { options: ["en-US", "de-DE"] },
    max: {
      control: { type: "number" }
    },
    min: {
      control: { type: "number" }
    },
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
  component: PercentNumberInput,
  title: "PercentNumberInput"
} as ComponentMeta<typeof PercentNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof PercentNumberInput>
> = args => {
  const { numericValue, onNumericChange, ...props } = args;

  const [value, setValue] = useState<typeof numericValue>("");

  useEffect(() => {
    setValue(numericValue);
  }, [numericValue]);

  return (
    <PercentNumberInput
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
  decimalPlaces: 3,
  locales: "en-US",
  max: 100,
  min: 0,
  numericValue: "50.1"
};

export { Primary };
