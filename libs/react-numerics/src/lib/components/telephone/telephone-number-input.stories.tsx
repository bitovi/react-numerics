import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { TelephoneNumberInput } from "./telephone-number-input";

export default {
  argTypes: {
    numericValue: {
      control: {
        disable: true
      }
    },
    onNumericChange: { action: "onNumericChange" }
  },
  component: TelephoneNumberInput,
  title: "TelephoneNumberInput"
} as ComponentMeta<typeof TelephoneNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof TelephoneNumberInput>
> = args => {
  const { numericValue, onNumericChange, ...props } = args;

  const [value, setValue] = useState(numericValue);

  return (
    <TelephoneNumberInput
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
  locales: "en-US",
  numericValue: "5551239876"
};

export { Primary };
