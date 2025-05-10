# BCP-47 Language Tag Validation Library: Technical Requirements

This document outlines the technical requirements for implementing a complete BCP-47 language tag validation library based on RFC 5646 (Tags for Identifying Languages).

## Overview

BCP-47 language tags are used to identify human languages in various applications and protocols. A proper validation library must ensure that language tags conform to the syntax and rules defined in RFC 5646, which is the authoritative specification.

## Core Requirements

### 1. Syntax Validation

The library must validate that language tags conform to the ABNF grammar defined in RFC 5646. The primary structure of a language tag is:

```
Language-Tag  = langtag             ; normal language tags
              / privateuse          ; private use tag
              / grandfathered       ; grandfathered tags

langtag       = language
                ["-" script]
                ["-" region]
                *("-" variant)
                *("-" extension)
                ["-" privateuse]
```

The complete ABNF grammar includes detailed definitions for each component, including:

- Primary language subtags (2-3 characters, 4 characters for future use, or 5-8 characters for registered languages)
- Extended language subtags (3 characters, up to 3 subtags)
- Script codes (4 characters)
- Region codes (2 characters for countries or 3 digits for regions)
- Variant subtags (5-8 alphanumeric characters or 4 characters starting with a digit)
- Extension subtags (single alphanumeric character followed by at least one subtag of 2-8 alphanumeric characters)
- Private use subtags (subtags following "x-")
- Grandfathered and irregular tags (predefined list of tags from RFC 3066)

### 2. Well-Formedness and Validity Checks

The library must distinguish between:

- **Well-formed tags**: Tags that conform to the syntax rules
- **Valid tags**: Tags that are well-formed AND whose subtags appear in the IANA Language Subtag Registry

Validation should check:

- No duplicate variant subtags
- No duplicate singleton (extension) subtags
- Proper ordering of subtags (language, script, region, variant, extension, private use)
- Proper casing of subtags (typically lowercase, with specific exceptions)

### 3. Registry Integration

The library must validate against the IANA Language Subtag Registry, which includes:

- Language subtags (from ISO 639)
- Script subtags (from ISO 15924)
- Region subtags (from ISO 3166-1 and UN M.49)
- Variant subtags (registered according to RFC 5646)
- Grandfathered and redundant tags

Implementation options:

- Bundle a copy of the registry with the library
- Download and cache the registry
- Allow updates to the registry data
- Validate against a specific version of the registry

### 4. Case Insensitivity

The library must handle case insensitivity correctly:

- Treat language tags as case-insensitive for matching and comparison
- Support RFC 5646 recommended casing for formatting tags:
  - Language subtags in lowercase ('en')
  - Script subtags with initial capital letter ('Latn')
  - Region subtags in uppercase ('US')
  - All other subtags in lowercase

### 5. Canonicalization

The library should support canonicalization of tags according to RFC 5646:

- Replace deprecated subtags with their preferred values
- Apply 'Preferred-Value' mappings from the registry
- Order extension sequences by singleton
- Remove script subtags that match the language's 'Suppress-Script'
- Handle extended language subtag canonicalization

### 6. Special Handling Requirements

#### Grandfathered and Redundant Tags

- Support the fixed list of grandfathered tags
- Handle both regular and irregular grandfathered tags
- Support redundant tags (tags that can now be formed with standard subtags)

#### Extension Subtags

- Validate extension subtags according to their specific requirements
- Support singleton subtags and their associated extension rules
- Ensure extension subtags appear in the correct position

#### Private Use Subtags

- Support private use subtag sequences starting with 'x-'
- Ensure private use subtags follow all other subtags
- Support tags consisting entirely of private use subtags

#### Support for Extended Language Subtags

- Validate that extended language subtags have appropriate prefixes
- Apply proper canonicalization to extended language subtags

## Advanced Features

### 1. Lookup and Matching

Support for language tag matching according to RFC 4647:

- Basic filtering
- Extended filtering
- Language tag lookup

### 2. Tag Generation and Manipulation

- Functions to build valid language tags from components
- Methods to add, remove, or replace subtags
- Support for tag truncation according to RFC 5646 rules

### 3. Subtag Information

- Methods to extract and identify subtag types
- Access to registry information for subtags
- Information about subtag deprecation and replacement
- Access to descriptions and other metadata

### 4. Error Reporting

- Detailed error messages for invalid tags
- Specific identification of which part of a tag is problematic
- Suggestions for fixing invalid tags

## Implementation Considerations

### 1. Performance Optimization

- Efficient parsing algorithms
- Caching of validation results
- Optimized registry lookup

### 2. Size Constraints

- Handle the maximum length of language tags
- Support working with limited buffer sizes
- Implement truncation methods that preserve meaning

### 3. Registry Updates

- Mechanism to update the registry data
- Version tracking for the registry
- Support for validating against specific registry versions

### 4. Security Considerations

- Avoid locale-specific casing issues (e.g., Turkish dotless i)
- Proper handling of character encoding
- Protection against malformed input

## Compliance Levels

The library should define compliance levels:

1. **Basic Compliance**: Support for well-formedness checks and basic validation
2. **Standard Compliance**: Support for well-formedness, validation, and canonicalization
3. **Full Compliance**: Complete implementation of all requirements including matching algorithms

## Testing Requirements

The library should be tested against:

- A comprehensive test suite of valid and invalid tags
- Examples from RFC 5646 and the IANA registry
- Edge cases and corner cases
- Performance benchmarks

## Platform Compatibility

The library should consider:

- Multi-language support (JavaScript, Python, Rust, etc.)
- Browser compatibility
- Server-side compatibility
- Minimal dependencies
- Consistent behavior across platforms

## Documentation

The library should include:

- Clear API documentation
- Usage examples
- Explanation of BCP-47 concepts
- Reference to relevant RFCs
- Version history and change logs
