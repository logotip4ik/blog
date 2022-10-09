---
title: code highlighting testing
tags: [typescript, shiki, vite-ssg]
---

```ts {3} title="nuxt.config.ts"
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw 'unimplemented';
}

let a = createLabel('typescript');
```
