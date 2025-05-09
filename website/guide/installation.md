# Installation

## Package Managers

You can install the `@aleksejdix/ally-bcp47` library using your preferred package manager:

### npm

```bash
npm install @aleksejdix/ally-bcp47
```

### yarn

```bash
yarn add @aleksejdix/ally-bcp47
```

### pnpm

```bash
pnpm add @aleksejdix/ally-bcp47
```

## Requirements

The library has the following requirements:

- **Node.js**: Version 16.0.0 or higher
- **TypeScript**: Version 4.5.0 or higher (if using TypeScript)

It has zero production dependencies, making it lightweight and safe to use in any project.

## Import Methods

### ESM (Recommended)

```typescript
import { validateLanguageTag } from "@aleksejdix/ally-bcp47";
```

### CommonJS

```javascript
const { validateLanguageTag } = require("@aleksejdix/ally-bcp47");
```

## Browser Usage

The library can also be used directly in the browser:

```html
<script type="module">
  import { validateLanguageTag } from "./node_modules/@aleksejdix/ally-bcp47/dist/index.js";

  const result = validateLanguageTag("en-US");
  console.log(result.isValid); // true
</script>
```

## CDN Usage

You can also use the library via a CDN:

```html
<script type="module">
  import { validateLanguageTag } from "https://unpkg.com/@aleksejdix/ally-bcp47/dist/index.js";

  const result = validateLanguageTag("en-US");
  console.log(result.isValid); // true
</script>
```

## TypeScript Support

The library includes TypeScript typings out of the box. You do not need to install any additional `@types` packages.

## Next Steps

Once installed, check out the [Getting Started](./getting-started) guide to learn how to use the library.
