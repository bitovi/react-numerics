import { useState } from "react"
import { ComponentMeta, Story } from "@storybook/react"
import { PostalCodeNumberInput } from "./postal-code-number-input"

export default {
  argTypes: {
    numericValue: {
      control: {
        disable: true,
      },
    },
    onNumericChange: { action: "onNumericChange" },
  },
  component: PostalCodeNumberInput,
  title: "PostalCodeNumberInput",
} as ComponentMeta<typeof PostalCodeNumberInput>

const Template: Story<
  React.ComponentPropsWithoutRef<typeof PostalCodeNumberInput>
> = (args) => {
  const { numericValue, onNumericChange, ...props } = args

  const [value, setValue] = useState(numericValue)

  return (
    <PostalCodeNumberInput
      {...props}
      onNumericChange={(numeric) => {
        onNumericChange && onNumericChange(numeric)
        setValue(numeric)
      }}
      numericValue={value}
    />
  )
}

const Primary = Template.bind({})
Primary.args = {
  numericValue: "54343",
}

export { Primary }
