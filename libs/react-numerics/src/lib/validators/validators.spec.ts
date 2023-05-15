import type { ValidateContext, ValidateMin } from "./validators-types";
import { validateErrorsMap } from "./validators-types";
import { validateMinValue } from "./validators";

describe("validateMinValue", () => {
  it("valid on mount", () => {
    const validator = validateMinValue({ min: 1 });
    expect(validator("1", "mount")).toEqual(undefined);
  });

  it("invalid on mount; no report", () => {
    const validator = validateMinValue({ min: 100 });
    expect(validator("99", "mount")).toEqual({
      customValidity: validateErrorsMap["INVALID_LESS_THAN_MIN_VALUE"]
    });
  });

  it("valid on change; less than min; report", () => {
    const validator = validateMinValue({ min: 3 });
    expect(validator("2", "change")).toEqual({
      customValidity: "",
      report: true
    });
  });

  it("valid on change; greater than min; report", () => {
    const validator = validateMinValue({ min: 30 });
    expect(validator("300", "change")).toEqual({
      customValidity: "",
      report: true
    });
  });

  it("valid on blur", () => {
    const validator = validateMinValue({ min: 9 });
    expect(validator("9.01", "blur")).toEqual({
      customValidity: "",
      report: true
    });
  });

  it("valid on blur; empty string", () => {
    const validator = validateMinValue({ min: 111 });
    expect(validator("", "blur")).toEqual({
      customValidity: "",
      report: true
    });
  });

  it("invalid on blur", () => {
    const validator = validateMinValue({ min: 2 });
    expect(validator("1.99", "blur")).toEqual({
      customValidity: validateErrorsMap["INVALID_LESS_THAN_MIN_VALUE"],
      report: true
    });
  });

  it("supports updating the custom validity result", () => {
    const mockUpdateCustomValidity = jest
      .fn<
        ReturnType<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >,
        Parameters<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >
      >()
      .mockReturnValue({
        customValidity: validateErrorsMap["INVALID_LESS_THAN_MIN_VALUE"],
        report: false
      });

    const ctx: ValidateContext<ValidateMin> = {
      updateCustomValidity: mockUpdateCustomValidity,
      min: 10000
    };

    const validator = validateMinValue(ctx);

    expect(validator("1", "blur")).toEqual({
      customValidity: validateErrorsMap["INVALID_LESS_THAN_MIN_VALUE"],
      report: false
    });
    expect(mockUpdateCustomValidity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCustomValidity).toHaveBeenLastCalledWith(
      "1",
      { ...ctx, type: "blur" },
      {
        customValidity: "INVALID_LESS_THAN_MIN_VALUE",
        report: true
      }
    );
  });

  it("sets customValidity to title if title is provided; initial customValidity is ValidateErrorTypes", () => {
    const mockUpdateCustomValidity = jest
      .fn<
        ReturnType<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >,
        Parameters<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >
      >()
      .mockReturnValue({
        customValidity: "INVALID_LESS_THAN_MIN_VALUE",
        report: false
      });

    const ctx: ValidateContext<ValidateMin> = {
      min: 78,
      title: "ELEMENT_TITLE_ATTRIBUTE_1",
      updateCustomValidity: mockUpdateCustomValidity
    };

    const validator = validateMinValue(ctx);

    expect(validator("1", "blur")).toEqual({
      customValidity: "ELEMENT_TITLE_ATTRIBUTE_1",
      report: false
    });
    expect(mockUpdateCustomValidity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCustomValidity).toHaveBeenLastCalledWith(
      "1",
      { ...ctx, type: "blur" },
      {
        customValidity: "INVALID_LESS_THAN_MIN_VALUE",
        report: true
      }
    );
  });

  it("sets customValidity to title if title is provided; initial customValidity is text", () => {
    const mockUpdateCustomValidity = jest
      .fn<
        ReturnType<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >,
        Parameters<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >
      >()
      .mockReturnValue({
        customValidity: "This is a custom invalidity message.",
        report: false
      });

    const ctx: ValidateContext<ValidateMin> = {
      min: 5723,
      title: "ELEMENT_TITLE_ATTRIBUTE_2",
      updateCustomValidity: mockUpdateCustomValidity
    };

    const validator = validateMinValue(ctx);

    expect(validator("1", "blur")).toEqual({
      customValidity: "ELEMENT_TITLE_ATTRIBUTE_2",
      report: false
    });
    expect(mockUpdateCustomValidity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCustomValidity).toHaveBeenLastCalledWith(
      "1",
      { ...ctx, type: "blur" },
      {
        customValidity: "INVALID_LESS_THAN_MIN_VALUE",
        report: true
      }
    );
  });

  it("maintains customValidity if it is an empty string even when title is provided", () => {
    const mockUpdateCustomValidity = jest
      .fn<
        ReturnType<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >,
        Parameters<
          Required<ValidateContext<ValidateMin>>["updateCustomValidity"]
        >
      >()
      .mockReturnValue({
        customValidity: "",
        report: false
      });

    const ctx: ValidateContext<ValidateMin> = {
      min: 31,
      title: "ELEMENT_TITLE_ATTRIBUTE_3",
      updateCustomValidity: mockUpdateCustomValidity
    };

    const validator = validateMinValue(ctx);

    expect(validator("1", "blur")).toEqual({
      customValidity: "",
      report: false
    });
    expect(mockUpdateCustomValidity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCustomValidity).toHaveBeenLastCalledWith(
      "1",
      { ...ctx, type: "blur" },
      {
        customValidity: "INVALID_LESS_THAN_MIN_VALUE",
        report: true
      }
    );
  });
});