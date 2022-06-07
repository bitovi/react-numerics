import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { TelephoneNumberInput } from "./telephone-number-input";

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
  component: TelephoneNumberInput,
  title: "Inputs/Formatted/Telephone Number Input"
} as ComponentMeta<typeof TelephoneNumberInput>;

const Template: Story<typeof TelephoneNumberInput> = args => {
  const [value, setValue] = useState((args as any).numericValue);

  return (
    <TelephoneNumberInput
      locales={(args as any).locales}
      numericValue={value}
      onNumericChange={numeric => {
        (args as any).onNumericChange(numeric);
        setValue(numeric);
      }}
    />
  );
};

const Primary: Story = Template.bind({});
Primary.args = {
  locales: "en-US",
  numericValue: "5551239876"
};

export { Primary };
