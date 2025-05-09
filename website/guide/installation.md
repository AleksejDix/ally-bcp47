# Installation

## Package Managers

You can install the `ally-bcp-47` library using your preferred package manager:

### npm

```bash
npm install ally-bcp-47
```

### yarn

```bash
yarn add ally-bcp-47
```

### pnpm

```bash
pnpm add ally-bcp-47
```

## Requirements

The library has the following requirements:

- **Node.js**: Version 16.0.0 or higher
- **TypeScript**: Version 4.5.0 or higher (if using TypeScript)

It has zero production dependencies, making it lightweight and safe to use in any project.

## Import Methods

### ESM (Recommended)

```typescript
import { validateLanguageTag } from "ally-bcp-47";
```

### CommonJS

```javascript
const { validateLanguageTag } = require("ally-bcp-47");
```

## Browser Usage

The library can also be used directly in the browser:

```html
<script type="module">
  import { validateLanguageTag } from "./node_modules/ally-bcp-47/dist/index.js";

  const result = validateLanguageTag("en-US");
  console.log(result.isValid); // true
</script>
```

## CDN Usage

You can also use the library via a CDN:

```html
<script type="module">
  import { validateLanguageTag } from "https://unpkg.com/ally-bcp-47/dist/index.js";

  const result = validateLanguageTag("en-US");
  console.log(result.isValid); // true
</script>
```

## TypeScript Support

The library includes TypeScript typings out of the box. You do not need to install any additional `@types` packages.

## Next Steps

Once installed, check out the [Getting Started](./getting-started) guide to learn how to use the library.
