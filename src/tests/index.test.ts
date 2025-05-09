import { describe, it, expect, vi } from "vitest";
import {
  validateLanguageTag,
  isWellFormed,
  isValid,
  parseTag,
  VERSION,
} from "../index";
import * as validator from "../validators/validator";

describe("BCP-47 Library Exports", () => {
  it("should export validateLanguageTag function", () => {
    expect(typeof validateLanguageTag).toBe("function");
    const result = validateLanguageTag("en-US");
    expect(result.isWellFormed).toBe(true);
  });

  it("should export isWellFormed function", () => {
    expect(typeof isWellFormed).toBe("function");
    expect(isWellFormed("en-US")).toBe(true);
    expect(isWellFormed("en--US")).toBe(false);
  });

  it("should export isValid function", () => {
    expect(typeof isValid).toBe("function");
    expect(isValid("en-US")).toBe(true);
    expect(isValid("en--US")).toBe(false);
  });

  it("should export parseTag function", () => {
    expect(typeof parseTag).toBe("function");
    const parsed = parseTag("en-US");
    expect(parsed).toMatchObject({
      tag: "en-us",
      language: "en",
      region: "us",
    });
  });

  it("should export VERSION constant", () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe("string");
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning format
  });
});
