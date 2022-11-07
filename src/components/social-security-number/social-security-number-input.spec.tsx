import React from "react"
import { render } from "@testing-library/react"
import { SocialSecurityNumberInput } from "./social-security-number-input"
import { vi } from "vitest"
describe("SocialSecurityNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <SocialSecurityNumberInput
        numericValue="222222222"
        onNumericChange={vi.fn()}
        inputRef={myRef}
      />,
    )

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("222-22-2222")
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  })

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <SocialSecurityNumberInput
        numericValue="222.333"
        onNumericChange={vi.fn()}
        inputRef={myRef}
      />,
    )

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("numeric")
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  })

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <SocialSecurityNumberInput
        numericValue="222.333"
        onNumericChange={vi.fn()}
        inputRef={myRef}
        inputMode="text"
      />,
    )

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("text")
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  })
})
