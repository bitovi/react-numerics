import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { EmployerIdentificationNumberInput } from "./employer-identification-number-input";

export default {
  argTypes: {
    numericValue: {
      control: {
        disable: true
      }
    },
    onNumericChange: { action: "onNumericChange" }
  },
  component: EmployerIdentificationNumberInput,
  title: "EmployerIdentificationNumberInput"
} as ComponentMeta<typeof EmployerIdentificationNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof EmployerIdentificationNumberInput>
> = args => {
  const { numericValue, onNumericChange } = args;

  const [value, setValue] = useState(numericValue);

  return (
    <EmployerIdentificationNumberInput
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
  numericValue: "123456789"
};

export { Primary };
