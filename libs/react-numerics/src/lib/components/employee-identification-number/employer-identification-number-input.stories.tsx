import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { EmployerIdentificationNumberInput } from "./employer-identification-number-input";

export default {
  argTypes: {
    numericValue: {
      control: {
        disable: true
      },
      type: { required: true }
    },
    onNumericChange: {
      control: {
        disable: true
      },
      type: { required: true }
    }
  },
  component: EmployerIdentificationNumberInput,
  title: "Inputs/Formatted/Employer Identification Number Input"
} as ComponentMeta<typeof EmployerIdentificationNumberInput>;

const Template: Story<typeof EmployerIdentificationNumberInput> = args => {
  const [value, setValue] = useState((args as any).numericValue);

  return (
    <EmployerIdentificationNumberInput
      onNumericChange={numeric => {
        (args as any).onNumericChange(numeric);
        setValue(numeric);
      }}
      numericValue={value}
    />
  );
};

const Primary: Story = Template.bind({});
Primary.args = {
  numericValue: "123456789"
};

export { Primary };
