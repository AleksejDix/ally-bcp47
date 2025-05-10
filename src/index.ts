import { validateLanguageTag, isWellFormed, isValid, parseTag } from "./validators/validator.js";
import { canonicalizeTag } from "./registry/index.js";
import { ValidationErrorType } from "./types/index.js";

export {
  validateLanguageTag,
  isWellFormed,
  isValid,
  parseTag,
  canonicalizeTag,
  ValidationErrorType,
};

// Export version
export const VERSION = "1.0.0"; 