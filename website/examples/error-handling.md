# Error Handling

This page demonstrates how to work with validation errors from the `ally-bcp-47` library.

## Understanding Error Types

The library provides detailed error information to help you understand and address validation issues:

```typescript
import { validateLanguageTag, ValidationErrorType } from "ally-bcp-47";

const result = validateLanguageTag("en-UK");

if (!result.isValid && result.errors) {
  for (const error of result.errors) {
    console.log(`Error type: ${error.type}`);
    console.log(`Message: ${error.message}`);

    if (error.subtag) {
      console.log(`Invalid subtag: ${error.subtag}`);
    }

    if (error.suggestedReplacement) {
      console.log(`Suggested replacement: ${error.suggestedReplacement}`);
    }
  }
}
```

## Common Error Types

The library defines several error types:

```typescript
enum ValidationErrorType {
  MALFORMED_TAG = "malformed_tag", // General syntax error
  INVALID_SYNTAX = "invalid_syntax", // Specific syntax error
  UNKNOWN_SUBTAG = "unknown_subtag", // Subtag not in registry
  DUPLICATE_SUBTAG = "duplicate_subtag", // Subtag appears multiple times
  INVALID_ORDER = "invalid_order", // Subtags in wrong order
  UNKNOWN_SINGLETON = "unknown_singleton", // Unknown extension singleton
}
```

## User-Friendly Error Messages

You can provide user-friendly error messages based on validation results:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function getUserFriendlyError(tag) {
  const result = validateLanguageTag(tag);

  if (result.isValid) {
    return null; // No error
  }

  if (!result.isWellFormed) {
    return "The language tag has syntax errors. Please check for typos.";
  }

  if (result.errors) {
    const error = result.errors[0]; // Get the first error

    if (error.suggestedReplacement) {
      return `Invalid language tag: ${error.message}. Did you mean "${error.suggestedReplacement}"?`;
    }

    return `Invalid language tag: ${error.message}`;
  }

  return "Invalid language tag";
}

// Examples
console.log(getUserFriendlyError("en-US")); // null
console.log(getUserFriendlyError("en--US")); // 'The language tag has syntax errors. Please check for typos.'
console.log(getUserFriendlyError("en-UK")); // 'Invalid language tag: Unknown region subtag: UK. Did you mean "GB"?'
console.log(getUserFriendlyError("en-ZZ")); // 'Invalid language tag: Unknown region subtag: ZZ'
```

## Handling Multiple Errors

Sometimes a tag might have multiple validation errors:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function getAllErrors(tag) {
  const result = validateLanguageTag(tag);

  if (result.isValid) {
    return [];
  }

  return result.errors || [];
}

// Example with multiple errors
const errors = getAllErrors("xx-ABCD-00");
errors.forEach((error) => {
  console.log(`- ${error.message}`);
});
// Output:
// - Unknown language subtag: xx
// - Unknown script subtag: ABCD
// - Unknown region subtag: 00
```

## Suggested Replacements

The library provides suggested replacements for common mistakes:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function getSuggestion(tag) {
  const result = validateLanguageTag(tag);

  if (result.isValid) {
    return { valid: true, tag };
  }

  // Look for errors with suggestions
  const suggestionError = result.errors?.find((e) => e.suggestedReplacement);

  if (
    suggestionError &&
    suggestionError.subtag &&
    suggestionError.suggestedReplacement
  ) {
    // Create corrected tag by replacing the invalid subtag
    const correctedTag = tag.replace(
      new RegExp(`\\b${suggestionError.subtag}\\b`, "i"),
      suggestionError.suggestedReplacement
    );

    return {
      valid: false,
      originalTag: tag,
      suggestedTag: correctedTag,
      reason: suggestionError.message,
    };
  }

  return {
    valid: false,
    originalTag: tag,
    reason: result.errors?.[0]?.message || "Invalid tag",
  };
}

// Examples
console.log(getSuggestion("en-UK"));
// {
//   valid: false,
//   originalTag: 'en-UK',
//   suggestedTag: 'en-GB',
//   reason: 'Unknown region subtag: UK'
// }

console.log(getSuggestion("ch-DE"));
// {
//   valid: false,
//   originalTag: 'ch-DE',
//   suggestedTag: 'zh-DE',
//   reason: 'Unknown language subtag: ch'
// }
```

## Form Validation Example

Here's an example of validating a language tag in a form:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function validateLanguageForm(formData) {
  const languageTag = formData.languageTag;

  if (!languageTag) {
    return {
      valid: false,
      field: "languageTag",
      message: "Language tag is required",
    };
  }

  const result = validateLanguageTag(languageTag);

  if (!result.isValid) {
    let message = "Invalid language tag";
    let suggestion = null;

    if (result.errors && result.errors.length > 0) {
      message = result.errors[0].message;
      suggestion = result.errors[0].suggestedReplacement;
    }

    return {
      valid: false,
      field: "languageTag",
      message,
      suggestion,
    };
  }

  return { valid: true };
}

// Example usage
const formData = { languageTag: "en-UK" };
const validation = validateLanguageForm(formData);

if (!validation.valid) {
  console.log(`Error: ${validation.message}`);

  if (validation.suggestion) {
    console.log(`Did you mean ${validation.suggestion}?`);
  }
}
// Output:
// Error: Unknown region subtag: UK
// Did you mean GB?
```

## Error Classification

You might want to classify errors by severity:

```typescript
import { validateLanguageTag, ValidationErrorType } from "ally-bcp-47";

function classifyErrors(tag) {
  const result = validateLanguageTag(tag);

  if (result.isValid) {
    return { severity: "none" };
  }

  if (!result.isWellFormed) {
    return {
      severity: "high",
      message: "Syntax error in language tag",
    };
  }

  // Check for unknown language - this is serious
  const unknownLanguage = result.errors?.some(
    (e) =>
      e.type === ValidationErrorType.UNKNOWN_SUBTAG &&
      e.subtagType === "language"
  );

  if (unknownLanguage) {
    return {
      severity: "high",
      message: "Unknown language code",
    };
  }

  // Other registry errors are medium severity
  return {
    severity: "medium",
    message: "Invalid subtag in language tag",
  };
}

// Examples
console.log(classifyErrors("en-US")); // { severity: 'none' }
console.log(classifyErrors("en--US")); // { severity: 'high', message: 'Syntax error in language tag' }
console.log(classifyErrors("xx-US")); // { severity: 'high', message: 'Unknown language code' }
console.log(classifyErrors("en-ZZ")); // { severity: 'medium', message: 'Invalid subtag in language tag' }
```

## Try It Out

Here's an interactive example where you can test error handling:

<div class="custom-block">
  <LanguageTagValidator />
</div>

## Next Steps

- [Working with Parsed Tags](./working-with-parsed-tags) - Learn how to work with successfully parsed tags
- [Canonicalization](./canonicalization) - Learn how to normalize tags to their canonical forms
