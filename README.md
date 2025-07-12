# magnitce-code-tests
A custom `HTMLElement` that runs tests in-browser and displays the results. 

Package size: ~24kb minified, ~36kb verbose.

## Quick Reference
```html
<code-tests src="tests/library.tests.js" title="Library"></code-tests>
<script type="module" src="/path/to/code-tests[.min].js"></script>
```

## Demos
https://catapart.github.io/magnitce-code-tests/demo/

## Support
- Firefox
- Chrome
- Edge
- <s>Safari</s> (Has not been tested; should be supported, based on custom element support)

## Getting Started
 1. [Install/Reference the library](#referenceinstall)

### Reference/Install
#### HTML Import (not required for vanilla js/ts; alternative to import statement)
```html
<script type="module" src="/path/to/code-tests[.min].js"></script>
```
#### npm
```cmd
npm install @magnit-ce/code-tests
```

### Import
#### Vanilla js/ts
```js
import "/path/to/code-tests[.min].js"; // if you didn't reference from a <script>, reference with an import like this

import { CodeTestsElement, CodeTests, expect[, etc...] } from "/path/to/code-tests[.min].js";
```
#### npm
```js
import "@magnit-ce/code-tests"; // if you didn't reference from a <script>, reference with an import like this

import { CodeTestsElement, CodeTests, expect[, etc...] } from "@magnit-ce/code-tests";
```

---
---
---

## Overview
The `<code-tests>` element is a 

## Hooks
beforeAll:  
beforeEach:  
afterEach:  
afterAll:  

## Providers
`export` a constant named `providers` to inject arbitrary objects into test calls

## Events
The `<code-tests>` element dispatches the following events:
- `start`: 
- `finish`: 

## Attributes
The `<code-tests>` element uses the `src` attribute.
The  `test`, `tests`, `run`, and `path` attributes are aliases of the `src` attribute.

The `success` attribute is assigned to `true` or `false` when tests have finished.

## Styling
The `<code-tests>` element can be styled with CSS, normally, but it also makes use of the shadowDOM for it's layout and functionality. Each of the elements in the `<code-tests>` element's shadowRoot can be selected for styling, directly, by using the `::part()` selector.

In this example, the `header` part is being selected for styling:
```css
code-tests::part(header)
{
    /* styling */
}
```

## Parts

## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.