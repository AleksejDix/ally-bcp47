import { describe, it, expect } from "vitest";
import { parseLanguageTag } from "../validators/parser";
import { ValidationErrorType } from "../types";

describe("Language Tag Parser", () => {
  it("should parse a simple language tag", () => {
    const { parsed, errors } = parseLanguageTag("en");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "en",
      language: "en",
    });
  });

  it("should parse a language tag with region", () => {
    const { parsed, errors } = parseLanguageTag("en-US");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "en-us",
      language: "en",
      region: "us",
    });
  });

  it("should parse a language tag with script", () => {
    const { parsed, errors } = parseLanguageTag("zh-Hant");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "zh-hant",
      language: "zh",
      script: "hant",
    });
  });

  it("should parse a language tag with extlang", () => {
    const { parsed, errors } = parseLanguageTag("zh-cmn");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "zh-cmn",
      language: "zh",
      extlang: ["cmn"],
    });
  });

  it("should parse a language tag with multiple extlangs", () => {
    const { parsed, errors } = parseLanguageTag("zh-cmn-yue");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "zh-cmn-yue",
      language: "zh",
      extlang: ["cmn", "yue"],
    });
  });

  it("should parse a language tag with variants", () => {
    const { parsed, errors } = parseLanguageTag("sl-rozaj-biske");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "sl-rozaj-biske",
      language: "sl",
      variants: ["rozaj", "biske"],
    });
  });

  it("should parse a language tag with extensions", () => {
    const { parsed, errors } = parseLanguageTag("en-US-u-ca-gregory");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "en-us-u-ca-gregory",
      language: "en",
      region: "us",
    });
    expect(parsed?.extensions).toBeDefined();
    expect(parsed?.extensions?.u).toEqual(["ca", "gregory"]);
  });

  it("should parse a language tag with multiple extensions", () => {
    const { parsed, errors } = parseLanguageTag(
      "en-US-u-ca-gregory-t-m0-ascii"
    );
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "en-us-u-ca-gregory-t-m0-ascii",
      language: "en",
      region: "us",
    });
    expect(parsed?.extensions).toBeDefined();
    expect(parsed?.extensions?.u).toEqual(["ca", "gregory"]);
    expect(parsed?.extensions?.t).toEqual(["m0", "ascii"]);
  });

  it("should parse a language tag with private use", () => {
    const { parsed, errors } = parseLanguageTag("en-x-private");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "en-x-private",
      language: "en",
      privateuse: ["private"],
    });
  });

  it("should parse a private-use-only tag", () => {
    const { parsed, errors } = parseLanguageTag("x-private");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "x-private",
      privateUseOnly: true,
      privateuse: ["private"],
    });
  });

  it("should parse a grandfathered tag", () => {
    const { parsed, errors } = parseLanguageTag("i-klingon");
    expect(errors).toHaveLength(0);
    expect(parsed).toMatchObject({
      tag: "i-klingon",
      grandfathered: true,
    });
  });

  it("should handle empty tags", () => {
    const { parsed, errors } = parseLanguageTag("");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.MALFORMED_TAG);
  });

  it("should handle invalid private use subtags", () => {
    const { parsed, errors } = parseLanguageTag("x-private!");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_PRIVATE_USE);
  });

  it("should handle invalid primary language subtag", () => {
    const { parsed, errors } = parseLanguageTag("e");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_SYNTAX);
  });

  it("should handle duplicate script subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-Latn-Latn");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_SYNTAX);
  });

  it("should handle duplicate region subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-US-US");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_SYNTAX);
  });

  it("should handle duplicate variant subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-rozaj-rozaj");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.DUPLICATE_VARIANT);
  });

  it("should handle duplicate singleton subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-a-ext-a-another");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.DUPLICATE_SINGLETON);
  });

  it("should handle invalid singleton extension with no subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-a");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_EXTENSION);
  });

  it("should handle invalid subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-$");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_SYNTAX);
  });

  it("should handle invalid extension subtags", () => {
    const { parsed, errors } = parseLanguageTag("en-u-!");
    expect(parsed).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_EXTENSION);
  });
});
