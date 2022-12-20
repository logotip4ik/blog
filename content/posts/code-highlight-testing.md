---
title: Code highlighting testing
date: 2022/10/11
draft: true
---

# Code highlight testing

- Without _twoslash_     
  <sup>Count for Line number starts from 0</sup>

```ts {14} title="nuxt.config.ts"
interface IdLabel {
  id: number /* some fields */
}
interface NameLabel {
  name: string /* other fields */
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw new Error('unimplemented');
}

const a = createLabel('typescript');
```

- With _twoslash_ enabled    
  <sup>Count for Line number starts from 1</sup>

```ts twoslash {5} title="nuxt.config.ts"
interface IdLabel {
  id: number /* some fields */
}
interface NameLabel {
  name: string /* other fields */
}
type NameOrId<T extends number | string> = T extends number ? IdLabel : NameLabel;
// This comment should not be included

// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw new Error('unimplemented');
}

const a = createLabel('typescript');
```

