import React from "react"
import { render } from "@testing-library/react"
import { PostalCodeNumberInput } from "./postal-code-number-input"
import { vi } from "vitest"
describe("PostalCodeNumberInput", () => {
  it("inputRef works", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <PostalCodeNumberInput
        numericValue="22222"
        onNumericChange={vi.fn()}
        inputRef={myRef}
      />,
    )

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.value).toEqual("22222")
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  })

  it("inputMode has correct default", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <PostalCodeNumberInput
        numericValue="222.333"
        onNumericChange={vi.fn()}
        inputRef={myRef}
      />,
    )

    if (myRef.current instanceof HTMLInputElement) {
      expect(myRef.current.inputMode).toEqual("")
      expect(myRef.current.getAttribute("inputmode")).toEqual(null)
      expect(myRef.current.hasAttribute("inputmode")).toEqual(false)
    } else {
      expect("it wasn't").toBe("myRef should have been an HTMLInputElement")
    }
  })

  it("inputMode can be overwritten", () => {
    const myRef = React.createRef<HTMLInputElement>()
    render(
      <PostalCodeNumberInput
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
