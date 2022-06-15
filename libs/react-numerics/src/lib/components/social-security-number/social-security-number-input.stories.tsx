import { useState } from "react";
import { ComponentMeta, Story } from "@storybook/react";
import { SocialSecurityNumberInput } from "./social-security-number-input";

export default {
  argTypes: {
    numericValue: {
      control: {
        disable: true
      }
    },
    onNumericChange: { action: "onNumericChange" }
  },
  component: SocialSecurityNumberInput,
  title: "SocialSecurityNumberInput"
} as ComponentMeta<typeof SocialSecurityNumberInput>;

const Template: Story<
  React.ComponentPropsWithoutRef<typeof SocialSecurityNumberInput>
> = args => {
  const { numericValue, onNumericChange, ...props } = args;

  const [value, setValue] = useState(numericValue);

  return (
    <SocialSecurityNumberInput
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
  numericValue: "333221234"
};

export { Primary };
