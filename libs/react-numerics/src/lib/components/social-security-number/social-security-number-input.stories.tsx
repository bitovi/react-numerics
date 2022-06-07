import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { SocialSecurityNumberInput } from "./social-security-number-input";

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
  component: SocialSecurityNumberInput,
  title: "Inputs/Formatted/Social Security Number Input"
} as ComponentMeta<typeof SocialSecurityNumberInput>;

const Template: Story<typeof SocialSecurityNumberInput> = args => {
  const [value, setValue] = useState((args as any).numericValue);

  return (
    <SocialSecurityNumberInput
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
  numericValue: "333221234"
};

export { Primary };
