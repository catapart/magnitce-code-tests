"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/code-tests.ts
var code_tests_exports = {};
__export(code_tests_exports, {
  AFTERALL: () => AFTERALL,
  AFTEREACH: () => AFTEREACH,
  BEFOREALL: () => BEFOREALL,
  BEFOREEACH: () => BEFOREEACH,
  CodeTestEventType: () => CodeTestEventType,
  CodeTests: () => CodeTests,
  CodeTestsElement: () => CodeTestsElement,
  expect: () => expect
});
module.exports = __toCommonJS(code_tests_exports);

// src/code-tests.css?raw
var code_tests_default = `:host\r
{\r
    /*** gray ***/\r
    --uchu-light-gray-raw: 95.57% 0.003 286.35;\r
    --uchu-light-gray: oklch(var(--uchu-light-gray-raw));\r
\r
    --uchu-gray-raw: 84.68% 0.002 197.12;\r
    --uchu-gray: oklch(var(--uchu-gray-raw));\r
\r
    --uchu-dark-gray-raw: 63.12% 0.004 219.55;\r
    --uchu-dark-gray: oklch(var(--uchu-dark-gray-raw));\r
\r
    /*** red ***/\r
    --uchu-light-red-raw: 88.98% 0.052 3.28;\r
    --uchu-light-red: oklch(var(--uchu-light-red-raw));\r
\r
    --uchu-dark-red-raw: 45.8% 0.177 17.7;\r
    --uchu-dark-red: oklch(var(--uchu-dark-red-raw));\r
\r
    /*** purple ***/\r
    --uchu-light-purple-raw: 89.1% 0.046 305.24;\r
    --uchu-light-purple: oklch(var(--uchu-light-purple-raw));\r
\r
    --uchu-dark-purple-raw: 39.46% 0.164 298.29;\r
    --uchu-dark-purple: oklch(var(--uchu-dark-purple-raw));\r
\r
    /*** blue ***/\r
    --uchu-light-blue-raw: 89.66% 0.046 260.67;\r
    --uchu-light-blue: oklch(var(--uchu-light-blue-raw));\r
\r
    --uchu-blue-raw: 62.39% 0.181 258.33;\r
    --uchu-blue: oklch(var(--uchu-blue-raw));\r
\r
    --uchu-dark-blue-raw: 43.48% 0.17 260.2;\r
    --uchu-dark-blue: oklch(var(--uchu-dark-blue-raw));\r
\r
    /*** green ***/\r
    --uchu-light-green-raw: 93.96% 0.05 148.74;\r
    --uchu-light-green: oklch(var(--uchu-light-green-raw));\r
\r
    --uchu-green-raw: 79.33% 0.179 145.62;\r
    --uchu-green: oklch(var(--uchu-green-raw));\r
\r
    --uchu-dark-green-raw: 58.83% 0.158 145.05;\r
    --uchu-dark-green: oklch(var(--uchu-dark-green-raw));\r
\r
    /*** general ***/\r
    --uchu-yang-raw: 99.4% 0 0;\r
    --uchu-yang: oklch(var(--uchu-yang-raw));\r
\r
    --uchu-yin-raw: 14.38% 0.007 256.88;\r
    --uchu-yin: oklch(var(--uchu-yin-raw));\r
\r
    /*** code-tests vars ***/\r
\r
    --spacer: calc(1em - 7px);\r
    --small-spacer: calc(var(--spacer) / 2);\r
\r
    --color-success: var(--uchu-green);\r
    --color-fail: var(--uchu-red);\r
    --color-process: var(--uchu-blue);\r
\r
    --text-surface: var(--uchu-yin);\r
    --text-result: var(--uchu-yang); /* --uchu-yang: #fdfdfd; */\r
    --text-collapse-icon: var(--uchu-dark-gray);  /* --uchu-dark-gray: #878a8b; */\r
    --text-hook-summary: var(--uchu-dark-purple);\r
    --text-success: var(--uchu-dark-green); /* --uchu-dark-green: #2e943a; */\r
    --text-fail: var(--uchu-dark-red); /* --uchu-dark-red: #a30d30; */\r
    --text-process: var(--uchu-dark-blue); /* --uchu-dark-blue: #0949ac; */\r
    --text-button: var(--uchu-yang); /* --uchu-dark-blue: #0949ac; */\r
    --text-placeholder: var(--uchu-dark-gray);\r
\r
    --surface-0: var(--uchu-light-gray);\r
    --surface-test: var(--uchu-yang);\r
    --surface-test-summary: var(--uchu-gray);\r
    --surface-hook-summary: var(--uchu-light-purple);\r
    --surface-success: var(--uchu-light-green);\r
    --surface-fail: var(--uchu-light-red);\r
    --surface-process: var(--uchu-light-blue);\r
    --surface-button: var(--uchu-blue); /* --uchu-blue: #3984f2 */\r
    --surface-button-hover: var(--uchu-light-blue);\r
    --surface-button-active: var(--uchu-dark-blue);\r
\r
    --border-test: solid 1px var(--uchu-dark-gray);\r
    --border-hook: solid 1px var(--uchu-dark-purple);\r
    --border-success: solid 1px var(--uchu-dark-green);\r
    --border-fail: solid 1px var(--uchu-dark-red);\r
    --border-process: solid 1px var(--uchu-dark-blue);\r
    --border-button: solid 1px var(--uchu-blue);\r
\r
    --info-icon: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2022.812714%2022.814663%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20style%3D%22fill%3Atransparent%3Bstroke%3Atransparent%3Bstroke-width%3A0.999999%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A6.3%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A29.2913%3Bstroke-opacity%3A1%22%20d%3D%22M%2022.295505%2C11.407332%20A%2010.889144%2C10.889144%200%200%201%2011.406424%2C22.296479%2010.889144%2C10.889144%200%200%201%200.51720881%2C11.407332%2010.889144%2C10.889144%200%200%201%2011.406424%2C0.51818382%2010.889144%2C10.889144%200%200%201%2022.295505%2C11.407332%20Z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22m%2013.945668%2C4.3053761%20c%200.150778%2C-0.96462%20-0.30687%2C-1.43709%20-1.36997%2C-1.43709%20-1.063%2C0%20-1.668452%2C0.47247%20-1.81923%2C1.43709%20-0.150779%2C0.96462%200.306971%2C1.43708%201.369971%2C1.43708%201.004%2C0%201.66845%2C-0.47246%201.819229%2C-1.43708%20z%20M%2011.693889%2C17.829726%2013.373994%2C7.0811161%20h%20-2.9333%20L%208.7605887%2C17.829726%20Z%22%20style%3D%22font-size%3A19.6861px%3Bfont-family%3APassageway%3B-inkscape-font-specification%3APassageway%3Bfill%3A%23a30d30%3Bstroke-width%3A2.5%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A6.3%3Bstroke-dashoffset%3A29.2913%22%20aria-label%3D%22i%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E');\r
\r
    --font-text: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\r
\r
    /*** styles ***/\r
\r
    color-scheme: light dark;\r
    display: grid;\r
    gap: var(--spacer);\r
    background-color: var(--surface-0);\r
    color: var(--text-surface); \r
    padding: var(--small-spacer);\r
    font-family: var(--font-text);\r
}\r
@media (prefers-color-scheme: dark) \r
{\r
    :host\r
    {\r
        --text-surface: var(--uchu-yang);\r
        --text-result: var(--uchu-yang);\r
\r
        --surface-0: var(--uchu-yin);\r
        --surface-test: oklch(25.11% 0.006 258.36);\r
        --surface-test-summary: oklch(35.02% 0.005 236.66);\r
    }\r
}\r
\r
#header\r
{\r
    display: grid;\r
    grid-template-columns: 1fr auto;\r
    align-items: center;\r
    gap: var(--spacer);\r
    border-bottom: solid 2px;\r
    padding: var(--spacer);\r
    margin-bottom: var(--spacer);\r
    user-select: none;\r
}\r
\r
#title\r
{\r
    font-weight: bold;\r
    font-size: 16px;\r
}\r
\r
.hook\r
{\r
    display: none;\r
}\r
:host(.has-before-hook) #before-all-details\r
,:host(.has-before-hook) #after-all-details\r
{\r
    display: initial;\r
}\r
\r
#tests\r
{\r
    margin: 0;\r
    padding: 0;\r
    list-style: none;\r
    display: grid;\r
    grid-auto-rows: max-content;\r
    gap: var(--spacer);\r
}\r
\r
summary\r
{\r
    display: grid;\r
    gap: var(--spacer);\r
    padding: var(--small-spacer) var(--spacer);\r
    align-items: center;\r
}\r
summary::before\r
{\r
    content: '';\r
    width: 16px;\r
    height: 16px;\r
    background: url("data:image/svg+xml,%3Csvg%20viewBox%3D'0%200%2020%2020'%20width%3D'14px'%20height%3D'14px'%20fill%3D'none'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cg%20stroke-width%3D'0'%3E%3C%2Fg%3E%3Cg%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3C%2Fg%3E%3Cg%3E%3Cpath%20d%3D'M8.72798%2015.795L3.72798%207.795C3.10356%206.79593%203.82183%205.5%204.99998%205.5L15%205.5C16.1781%205.5%2016.8964%206.79593%2016.272%207.795L11.272%2015.795C10.6845%2016.735%209.31549%2016.735%208.72798%2015.795Z'%20fill%3D'%23878a8b'%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");\r
    transform: rotate(-90deg);\r
    transition: transform ease-out 200ms;\r
}\r
[open] > summary::before\r
{\r
    transform: rotate(0);\r
    /* background: var(--surface-test-summary); */\r
}\r
\r
#before-all-summary\r
,#after-all-summary\r
{\r
    background: var(--surface-hook-summary);\r
    color: var(--text-hook-summary);\r
    grid-template-columns: auto auto 1fr;\r
}\r
\r
.result-icon\r
{\r
    --size: 24px;\r
    width: var(--size);\r
    height: var(--size);\r
\r
    display: flex;\r
    align-items: center;\r
    justify-content: center;\r
\r
    border: solid 1px currentColor;\r
    border-radius: 50%;\r
}\r
.result-icon::before\r
{\r
    content: '\u22EF';\r
}\r
\r
.hook\r
{\r
    border: var(--border-hook);\r
}\r
\r
.test\r
,#before-all-details\r
,#after-all-details\r
{\r
    border: var(--border-test);\r
    border-radius: 2px;\r
}\r
\r
.test summary\r
{\r
    background: var(--surface-test-summary);\r
    grid-template-columns: auto auto 1fr auto;\r
}\r
\r
.test.running .result-icon\r
,.hook.running .result-icon\r
{\r
    border: var(--border-process);\r
    background: var(--surface-process);\r
}\r
.test.success .result-icon\r
,.hook.success .result-icon\r
{\r
    border: var(--border-success);\r
    background: var(--surface-success)\r
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%232e943a" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>');\r
    background-repeat: no-repeat;\r
    background-position: center;\r
    background-size: 16px 16px;\r
}\r
.test.fail .result-icon\r
,.hook.fail .result-icon\r
{\r
    border: var(--border-fail);\r
    background: var(--surface-fail)\r
    var(--info-icon);\r
    background-repeat: no-repeat;\r
    background-position: center;\r
    transform: rotate(175deg);\r
}\r
.test:is(.success,.fail) .result-icon::before\r
,.hook:is(.success,.fail) .result-icon::before\r
{\r
    display: none;\r
}\r
.test:is(.running) .result-icon::before\r
,.hook:is(.running) .result-icon::before\r
{\r
    content: '';\r
    --size: 18px;\r
    --color: var(--text-process);\r
    --animation-timing-function: linear;\r
    --animation-duration: 2s;\r
    width: var(--size);\r
    height: var(--size);\r
    mask-image: radial-gradient(circle at 50% 50%, transparent calc(var(--size) / 3), black calc(var(--size) / 3));\r
    background-image: conic-gradient(transparent, transparent 135deg, var(--color));\r
    border-radius: 50%;\r
    animation: var(--animation-timing-function) var(--animation-duration) infinite spin;\r
    margin: 2px;\r
}\r
\r
.description\r
{\r
    user-select: none;\r
}\r
\r
.test .result\r
,.hook .result\r
{\r
    background: var(--surface-test);\r
    border: var(--border-test);\r
    border-radius: 2px;\r
    margin: var(--small-spacer);\r
}\r
\r
.test .result:empty::before\r
,.results:empty::before\r
{\r
    content: "[Test has not been run]";\r
    font-style: italic;\r
    font-size: 11px;\r
    color: var(--text-placeholder);\r
}\r
.results:empty::before\r
{\r
    content: "[Tests have not been run]";\r
}\r
.before-result:empty\r
,.after-result:empty\r
{\r
    display: none;\r
}\r
\r
.test .result\r
,.results\r
,.before-result\r
,.after-result\r
{\r
    padding: var(--small-spacer) var(--spacer);\r
}\r
\r
pre\r
{\r
    margin: var(--small-spacer);\r
}\r
\r
.run\r
{\r
    width: auto;\r
    min-width: auto;\r
    max-width: auto;\r
    appearance: none;\r
    display: inline-flex;\r
    justify-content: center;\r
    align-items: center;\r
    padding: 3px 10px 3px 7px;\r
    font-size: 11px;\r
    gap: var(--small-spacer);\r
    border: var(--border-button);\r
    background: var(--surface-button);\r
    border-radius: 4px;\r
    text-shadow: 1px 1px rgb(0 0 0 / .2);\r
    color: var(--text-button);\r
}\r
.run:hover\r
{\r
    background: oklch(68.39% 0.181 258.33);\r
}\r
.run:active\r
{\r
    background: oklch(50.39% 0.181 258.33);\r
}\r
.run::before\r
{\r
    content: '';\r
    display: block;\r
    width: 16px;\r
    height: 16px;\r
    transform: rotate(-90deg);\r
    background: \r
    url("data:image/svg+xml,%3Csvg%20viewBox%3D'0%200%2020%2020'%20width%3D'16px'%20height%3D'16px'%20fill%3D'none'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Cg%20stroke-width%3D'0'%3E%3C%2Fg%3E%3Cg%20stroke-linecap%3D'round'%20stroke-linejoin%3D'round'%3E%3C%2Fg%3E%3Cg%3E%3Cpath%20d%3D'M8.72798%2015.795L3.72798%207.795C3.10356%206.79593%203.82183%205.5%204.99998%205.5L15%205.5C16.1781%205.5%2016.8964%206.79593%2016.272%207.795L11.272%2015.795C10.6845%2016.735%209.31549%2016.735%208.72798%2015.795Z'%20fill%3D'%23fdfdfd'%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");\r
}\r
\r
\r
\r
@keyframes spin\r
{\r
    from { transform: rotate(0deg); }\r
    to { transform: rotate(360deg); }\r
}`;

// src/code-tests.html?raw
var code_tests_default2 = '<slot name="header">\r\n    <header id="header">\r\n        <span id="title"><slot name="title"><span id="title-text">Tests</span></slot></span>\r\n        <slot name="play-button">\r\n            <button type="button" class="run" data-all>\r\n                <slot name="play-button-label">\r\n                    <span id="play-button-label" class="button-label label icon">Run Tests</span>\r\n                </slot>\r\n            </button>\r\n        </slot>\r\n        <slot name="details"></slot>\r\n    </header>\r\n</slot>\r\n<details id="before-all-details" class="hook">\r\n    <summary id="before-all-summary">\r\n        <span id="before-all-result-icon" class="result-icon"></span>\r\n        <span id="before-all-description" class="description">Results from Before All Hook</span>\r\n    </summary>\r\n    <div id="before-all-results" class="results"></div>\r\n</details>\r\n<ul id="tests"></ul>\r\n<details id="after-all-details" class="hook">\r\n    <summary id="after-all-summary">\r\n        <span id="after-all-result-icon" class="result-icon"></span>\r\n        <span id="after-all-description" class="description">Results from After All Hook</span>\r\n    </summary>\r\n    <div id="after-all-results" class="results"></div>\r\n</details>';

// src/api.ts
var TestPromise = class extends Promise {
  async toBeDefined(valueName) {
    const target = await this;
    if (target == void 0) {
      throw new Error(`${valueName != null ? valueName : "Value"} is undefined`);
    }
  }
  async toBe(value, exact = false) {
    const target = await this;
    const result = exact == true ? target === value : target == value;
    if (result == false) {
      throw new Error(`  Value is not equal.
  Expected: ${value}
  Result: ${target}`);
    }
  }
  async toContainText(value) {
    const target = await this;
  }
  async toHaveAttribute(value) {
    const target = await this;
    if (!(target instanceof HTMLElement)) {
      throw new Error("Unable to check for attribute on non-HTMLElement target");
    }
    if (target.getAttribute(value)) {
      throw new Error("Taret does not have attribute");
    }
  }
};
var BEFOREALL = Symbol("beforeAll");
var BEFOREEACH = Symbol("beforeEach");
var AFTERALL = Symbol("afterAll");
var AFTEREACH = Symbol("afterEach");
var CodeTests = class {
  static timeoutMS = 500;
  static #expectInterval;
  static #expectPromise;
  static expect(value) {
    const promise = new TestPromise(async (resolve, reject) => {
      if (value instanceof Promise) {
        const result = await value;
        resolve(result);
        return;
      }
      resolve(value);
    });
    return promise;
  }
  static expectSync(value) {
    const promise = new TestPromise(async (resolve, reject) => {
      if (value instanceof Promise) {
        const result = await value;
        resolve(result);
        return;
      }
      resolve(value);
    });
    return promise;
  }
  static expectBefore(value) {
    const promise = new TestPromise(async (resolve, reject) => {
      if (value instanceof Promise) {
        const result = await value;
        resolve(result);
        return;
      }
      resolve(value);
    });
    return promise;
  }
};
function expect(value) {
  return CodeTests.expect(value);
}

// node_modules/.pnpm/ce-part-utils@0.0.0/node_modules/ce-part-utils/dist/ce-part-utils.js
var DEFAULT_ELEMENT_SELECTOR = ":not(slot,defs,g,rect,path,circle,ellipse,line,polygon,text,tspan,use,svg image,svg title,desc,template,template *)";
function assignClassAndIdToPart(shadowRoot) {
  const identifiedElements = [...shadowRoot.querySelectorAll(`${DEFAULT_ELEMENT_SELECTOR}[id]`)];
  for (let i = 0; i < identifiedElements.length; i++) {
    identifiedElements[i].part.add(identifiedElements[i].id);
  }
  const classedElements = [...shadowRoot.querySelectorAll(`${DEFAULT_ELEMENT_SELECTOR}[class]`)];
  for (let i = 0; i < classedElements.length; i++) {
    classedElements[i].part.add(...classedElements[i].classList);
  }
}

// src/code-tests.ts
var CodeTestEventType = /* @__PURE__ */ ((CodeTestEventType2) => {
  CodeTestEventType2["BeforeAll"] = "beforeall";
  CodeTestEventType2["AfterAll"] = "afterall";
  CodeTestEventType2["BeforeTest"] = "beforetest";
  CodeTestEventType2["AfterTest"] = "aftertest";
  return CodeTestEventType2;
})(CodeTestEventType || {});
var NOTESTDEFINED = Symbol("No Test Defined");
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(code_tests_default);
var COMPONENT_TAG_NAME = "code-tests";
var CodeTestsElement = class extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getElement(id) {
    if (this.componentParts.get(id) == null) {
      const part = this.findElement(id);
      if (part != null) {
        this.componentParts.set(id, part);
      }
    }
    return this.componentParts.get(id);
  }
  findElement(id) {
    return this.shadowRoot.getElementById(id);
  }
  #hooks = /* @__PURE__ */ new Map();
  #hookIds = {
    [BEFOREALL]: generateId(),
    [BEFOREEACH]: generateId(),
    [AFTEREACH]: generateId(),
    [AFTERALL]: generateId()
  };
  #continueRunningTests = true;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = code_tests_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.#boundClickHandler = this.#onClick.bind(this);
  }
  connectedCallback() {
    assignClassAndIdToPart(this.shadowRoot);
    this.addEventListener("click", this.#boundClickHandler);
    if (this.getAttribute("auto") == "false") {
      return;
    }
    const testsPath = this.getAttribute("src") ?? this.getAttribute("test") ?? this.getAttribute("tests") ?? this.getAttribute("run") ?? this.getAttribute("path");
    if (testsPath == null) {
      return;
    }
    this.loadTests(testsPath);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.#boundClickHandler);
  }
  #boundClickHandler;
  #onClick(event) {
    const runButton = event.composedPath().find((item) => item instanceof HTMLButtonElement && item.classList.contains("run"));
    if (runButton == null) {
      return;
    }
    const parentListItem = runButton.closest("li");
    if (parentListItem == null) {
      const isRunAll = runButton.hasAttribute("data-all");
      if (isRunAll == true) {
        this.runTests();
      }
      return;
    }
    const testId = parentListItem.dataset.testId;
    if (testId == null) {
      return;
    }
    const test = this.#tests.get(testId);
    if (test == null) {
      return;
    }
    this.#runTest(testId, test);
  }
  async loadTests(path) {
    try {
      this.getElement("tests").innerHTML = "";
      this.#tests.clear();
      this.classList.remove("has-before-hook");
      this.classList.remove("has-after-hook");
      const lastSlashIndexInCurrentPath = window.location.href.lastIndexOf("/");
      const currentPathHasExtension = window.location.href.substring(lastSlashIndexInCurrentPath).indexOf(".") != -1;
      const currentPath = currentPathHasExtension == true ? window.location.href.substring(0, lastSlashIndexInCurrentPath + 1) : window.location.href;
      const moduleDirectory = currentPath + path.substring(0, path.lastIndexOf("/") + 1);
      const modulePath = currentPath + path;
      let moduleContent = await (await fetch(modulePath)).text();
      moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
      const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf("/")), { type: "text/javascript" });
      const moduleURL = URL.createObjectURL(moduleFile);
      const module2 = await import(moduleURL);
      const tests = module2.tests ?? module2.default;
      if (tests == void 0) {
        throw new Error(`Unable to find tests definition in file at path: ${path}`);
      }
      const beforeAll = tests[BEFOREALL];
      if (beforeAll != null) {
        const hookMap = this.#hooks.get(BEFOREALL);
        if (hookMap == null) {
          const map = /* @__PURE__ */ new Map();
          map.set(beforeAll, /* @__PURE__ */ new Set());
          this.#hooks.set(BEFOREALL, map);
        }
        this.classList.add("has-before-hook");
      }
      const beforeEach = tests[BEFOREEACH];
      if (beforeEach != null) {
        const hookMap = this.#hooks.get(BEFOREEACH);
        if (hookMap == null) {
          const map = /* @__PURE__ */ new Map();
          map.set(beforeEach, /* @__PURE__ */ new Set());
          this.#hooks.set(BEFOREEACH, map);
        }
      }
      const afterAll = tests[AFTERALL];
      if (afterAll != null) {
        const hookMap = this.#hooks.get(AFTERALL);
        if (hookMap == null) {
          const map = /* @__PURE__ */ new Map();
          map.set(afterAll, /* @__PURE__ */ new Set());
          this.#hooks.set(AFTERALL, map);
        }
        this.classList.add("has-after-hook");
      }
      const afterEach = tests[AFTEREACH];
      if (afterEach != null) {
        const hookMap = this.#hooks.get(AFTEREACH);
        if (hookMap == null) {
          const map = /* @__PURE__ */ new Map();
          map.set(afterEach, /* @__PURE__ */ new Set());
          this.#hooks.set(AFTEREACH, map);
        }
      }
      for (const [description, test] of Object.entries(tests)) {
        const id = this.#addTest(description, test);
        if (beforeAll != null) {
          const hookMap = this.#hooks.get(BEFOREALL);
          if (hookMap != null) {
            const testIds = hookMap.get(beforeAll);
            if (testIds != null) {
              testIds.add(id);
            }
          }
        }
        if (beforeEach != null) {
          const hookMap = this.#hooks.get(BEFOREEACH);
          if (hookMap != null) {
            const testIds = hookMap.get(beforeEach);
            if (testIds != null) {
              testIds.add(id);
            }
          }
        }
        if (afterAll != null) {
          const hookMap = this.#hooks.get(AFTERALL);
          if (hookMap != null) {
            const testIds = hookMap.get(afterAll);
            if (testIds != null) {
              testIds.add(id);
            }
          }
        }
        if (afterEach != null) {
          const hookMap = this.#hooks.get(AFTEREACH);
          if (hookMap != null) {
            const testIds = hookMap.get(afterEach);
            if (testIds != null) {
              testIds.add(id);
            }
          }
        }
      }
    } catch (error) {
      this.#addProcessError("An error occurred while loading the tasks:", error);
    }
  }
  async runTests() {
    this.dispatchEvent(new CustomEvent("beforeall" /* BeforeAll */, { bubbles: true, composed: true }));
    this.#continueRunningTests = true;
    this.classList.add("running");
    this.toggleAttribute("success", false);
    this.#clearTestStatuses();
    const inOrder = this.hasAttribute("in-order");
    const beforeHooks = this.#hooks.get(BEFOREALL);
    if (beforeHooks != null) {
      let hookResult;
      try {
        const beforeAllHookElement = this.getElement(`before-all-details`);
        beforeAllHookElement.classList.add("running");
        beforeAllHookElement.part.add("running");
        for (const [hook, ids] of beforeHooks) {
          hookResult = await hook();
          this.#handleHookResult(hookResult, true, "before");
        }
        beforeAllHookElement.part.remove("running");
        beforeAllHookElement.classList.remove("running");
      } catch (error) {
        this.#handleHookResult(hookResult, false, "before", error);
        console.error(error);
        this.#continueRunningTests = false;
        this.classList.remove("running");
        this.part.remove("running");
        this.dispatchEvent(new CustomEvent("afterall" /* AfterAll */, { bubbles: true, composed: true }));
        return;
      }
    }
    if (inOrder == false) {
      const promises = [];
      for (const [id, test] of this.#tests) {
        promises.push(this.#runTest(id, test));
      }
      await Promise.all(promises);
    } else {
      for (const [id, test] of this.#tests) {
        if (this.#continueRunningTests == false) {
          break;
        }
        await this.#runTest(id, test);
      }
    }
    if (this.#continueRunningTests == false) {
      this.classList.remove("running");
      this.part.remove("running");
      this.dispatchEvent(new CustomEvent("afterall" /* AfterAll */, { bubbles: true, composed: true }));
      return;
    }
    const afterHooks = this.#hooks.get(AFTERALL);
    if (afterHooks != null) {
      let hookResult;
      try {
        const afterAllHookElement = this.getElement(`after-all-details`);
        afterAllHookElement.classList.add("running");
        afterAllHookElement.part.add("running");
        for (const [hook, ids] of afterHooks) {
          hookResult = await hook();
          this.#handleHookResult(hookResult, true, "after");
        }
        afterAllHookElement.part.remove("running");
        afterAllHookElement.classList.remove("running");
      } catch (error) {
        this.#handleHookResult(hookResult, false, "after", error);
        console.error(error);
        this.#continueRunningTests = false;
        this.classList.remove("running");
        this.part.remove("running");
        this.dispatchEvent(new CustomEvent("afterall" /* AfterAll */, { bubbles: true, composed: true }));
        return;
      }
    }
    const failedTests = this.shadowRoot.querySelectorAll('[success="false"]');
    this.setAttribute("success", failedTests.length == 0 ? "true" : "false");
    this.classList.remove("running");
    this.part.remove("running");
    this.dispatchEvent(new CustomEvent("afterall" /* AfterAll */, { bubbles: true, composed: true }));
  }
  #clearTestStatuses() {
    for (const [testId, test] of this.#tests) {
      const testElement = this.getElement("tests").querySelector(`[data-test-id="${testId}"]`);
      if (testElement == null) {
        this.#addProcessError(`Unable to find test element for test: ${testId}`);
        return;
      }
      testElement.toggleAttribute("success", false);
      testElement.classList.remove("success", "fail");
      testElement.part.remove("success", "fail");
    }
    const beforeAllHookElement = this.getElement(`before-all-details`);
    beforeAllHookElement.toggleAttribute("success", false);
    beforeAllHookElement.classList.remove("success", "fail");
    beforeAllHookElement.part.remove("success", "fail");
    const afterAllHookElement = this.getElement(`after-all-details`);
    afterAllHookElement.toggleAttribute("success", false);
    afterAllHookElement.classList.remove("success", "fail");
    afterAllHookElement.part.remove("success", "fail");
  }
  async #runTest(testId, test) {
    const testElement = this.getElement("tests").querySelector(`[data-test-id="${testId}"]`);
    if (testElement == null) {
      this.#addProcessError(`Unable to find test element for test: ${testId}`);
      return;
    }
    testElement.toggleAttribute("success", false);
    testElement.classList.add("running");
    testElement.part.add("running");
    testElement.classList.remove("success", "fail");
    testElement.part.remove("success", "fail");
    const iconElement = testElement.querySelector(".result-icon");
    iconElement?.classList.remove("success", "fail");
    iconElement?.part.remove("success", "fail");
    iconElement?.classList.add("running");
    iconElement?.part.add("running");
    const errorMessageElement = testElement.querySelector(".error-message");
    if (errorMessageElement != null) {
      errorMessageElement.textContent = "";
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = false;
    }
    let beforeResult = NOTESTDEFINED;
    let testResult;
    let afterResult = NOTESTDEFINED;
    let testType;
    try {
      const allowTest = this.dispatchEvent(new CustomEvent("beforetest" /* BeforeTest */, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));
      if (allowTest == true) {
        const beforeHooks = this.#hooks.get(BEFOREEACH);
        if (beforeHooks != null) {
          for (const [hook, ids] of beforeHooks) {
            if (ids.has(testId)) {
              beforeResult = await hook();
              break;
            }
          }
        }
        testResult = await test();
        const afterHooks = this.#hooks.get(AFTEREACH);
        if (afterHooks != null) {
          for (const [hook, ids] of afterHooks) {
            if (ids.has(testId)) {
              afterResult = await hook();
              break;
            }
          }
        }
        testType = "before";
        if (beforeResult != NOTESTDEFINED) {
          this.#handleTestResult(testElement, beforeResult, true, void 0, testType);
        }
        testType = void 0;
        this.#handleTestResult(testElement, testResult, true, void 0, testType);
        testType = "after";
        if (afterResult != NOTESTDEFINED) {
          this.#handleTestResult(testElement, afterResult, true, void 0, testType);
        }
      }
    } catch (error) {
      this.#handleTestResult(testElement, testResult, false, error, testType);
      console.error(error);
      this.#continueRunningTests = false;
    } finally {
      testElement?.classList.remove("running");
      testElement?.part.remove("running");
      iconElement?.classList.remove("running");
      iconElement?.part.remove("running");
      this.dispatchEvent(new CustomEvent("aftertest" /* AfterTest */, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));
    }
  }
  #handleTestResult(testElement, result, finishedTest, error, beforeOrAfter) {
    if (result instanceof HTMLElement) {
      this.#setTestResult(testElement, result, finishedTest, beforeOrAfter);
    } else if (result == void 0) {
      const trueMessage = beforeOrAfter == void 0 ? "Passed" : "Hook Ran Successfully";
      const defaultResult = this.#createDefaultResult(finishedTest == true ? `${trueMessage}` : `Failed${error != null ? `:
${error.message}` : ""}`, finishedTest, beforeOrAfter);
      this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
    } else if (typeof result == "string") {
      const defaultResult = this.#createDefaultResult(`${result}${error == null ? "" : `:
${error.message}`}`, finishedTest, beforeOrAfter);
      this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
    } else if (typeof result == "object") {
      const objectResult = result;
      if (objectResult.success != void 0 && objectResult.expected != void 0 && objectResult.value != void 0) {
        const trueMessage = beforeOrAfter == void 0 ? "Passed" : "Success";
        const falseMessage = beforeOrAfter == void 0 ? "Failed" : "Fail";
        const defaultResult = this.#createDefaultResult(
          `${objectResult.success == true ? `${trueMessage}:` : `${falseMessage}:`}
Expected:${objectResult.expected}
Result:${objectResult.value}`,
          objectResult.success,
          beforeOrAfter
        );
        this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
      }
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = true;
    }
  }
  #handleHookResult(result, finishedTest, beforeOrAfter, error) {
    if (result instanceof HTMLElement) {
      this.#setHookResult(result, finishedTest, beforeOrAfter);
    } else {
      let defaultResult;
      if (result == void 0) {
        defaultResult = this.#createDefaultResult(finishedTest == true ? "Hook Ran Successfully" : `Failed${error != null ? `:
${error.message}` : ""}`, finishedTest);
        this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
      } else if (typeof result == "string") {
        defaultResult = this.#createDefaultResult(`${result}${error == null ? "" : `:
${error.message}`}`, finishedTest);
        this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
      } else if (typeof result == "object") {
        const objectResult = result;
        if (objectResult.success != void 0 && objectResult.expected != void 0 && objectResult.value != void 0) {
          defaultResult = this.#createDefaultResult(
            `${objectResult.success == true ? "Success:" : "Fail:"}
Expected:${objectResult.expected}
Result:${objectResult.value}`,
            objectResult.success
          );
          this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
        }
      }
    }
    const detailsElement = this.getElement(`${beforeOrAfter}-all-details`);
    if (detailsElement != null) {
      detailsElement.open = true;
    }
  }
  static create(properties) {
    const element = document.createElement("code-tests");
    console.log(properties);
    return element;
  }
  #tests = /* @__PURE__ */ new Map();
  #addTest(description, test) {
    const testId = generateId();
    this.#tests.set(testId, test);
    const testElement = this.#createTest(testId, description);
    this.getElement("tests").append(testElement);
    return testId;
  }
  #createTest(testId, description) {
    const testElement = document.createElement("li");
    testElement.dataset.testId = testId;
    testElement.classList.add("test");
    testElement.part.add("test");
    const detailsElement = document.createElement("details");
    detailsElement.classList.add("test-details");
    detailsElement.part.add("test-details");
    const summaryElement = document.createElement("summary");
    summaryElement.classList.add("test-summary");
    summaryElement.part.add("test-summary");
    const resultIcon = document.createElement("div");
    resultIcon.classList.add("result-icon");
    resultIcon.part.add("result-icon");
    summaryElement.append(resultIcon);
    const descriptionElement = document.createElement("span");
    descriptionElement.classList.add("description", "test-description");
    descriptionElement.textContent = description;
    summaryElement.append(descriptionElement);
    const runButton = document.createElement("button");
    runButton.classList.add("run", "test-run");
    runButton.part.add("run", "test-run");
    runButton.textContent = "Run Test";
    runButton.title = "Run Test";
    summaryElement.append(runButton);
    const beforeResultElement = document.createElement("div");
    beforeResultElement.classList.add("before-result", "test-before-result");
    beforeResultElement.part.add("before-result", "test-before-result");
    const resultElement = document.createElement("div");
    resultElement.classList.add("result", "test-result");
    resultElement.part.add("result", "test-result");
    const afterResultElement = document.createElement("div");
    afterResultElement.classList.add("after-result", "test-after-result");
    afterResultElement.part.add("after-result", "test-after-result");
    detailsElement.append(summaryElement);
    detailsElement.append(beforeResultElement);
    detailsElement.append(resultElement);
    detailsElement.append(afterResultElement);
    testElement.append(detailsElement);
    return testElement;
  }
  #setTestResult(testElement, valueElement, success, beforeOrAfter) {
    testElement.setAttribute("success", success == true ? "true" : "false");
    testElement.classList.toggle("success", success);
    testElement.part.toggle("success", success);
    testElement.classList.toggle("fail", !success);
    testElement.part.toggle("fail", !success);
    const iconElement = testElement.querySelector(".result-icon");
    iconElement?.classList.toggle("success", success);
    iconElement?.part.toggle("success", success);
    iconElement?.classList.toggle("fail", !success);
    iconElement?.part.toggle("fail", !success);
    const resultElement = testElement.querySelector(`.${beforeOrAfter == void 0 ? "result" : beforeOrAfter == "before" ? "before-result" : "after-result"}`);
    if (resultElement == null) {
      this.#addProcessError(`Unable to find result element`);
      return;
    }
    resultElement.innerHTML = "";
    resultElement.appendChild(valueElement);
  }
  #createDefaultResult(message, success, beforeOrAfter) {
    const codeElement = document.createElement("code");
    codeElement.classList.add("code");
    codeElement.part.add("code");
    const preElement = document.createElement("pre");
    preElement.textContent = message;
    const className = success == true ? "success-message" : "error-message";
    preElement.classList.add("pre", className);
    preElement.part.add("pre", className);
    codeElement.appendChild(preElement);
    return codeElement;
  }
  #setHookResult(valueElement, success, beforeOrAfter) {
    const detailsElement = this.getElement(`${beforeOrAfter}-all-details`);
    const resultsElement = this.getElement(`${beforeOrAfter}-all-results`);
    detailsElement.setAttribute("success", success == true ? "true" : "false");
    detailsElement.classList.toggle("success", success);
    detailsElement.part.toggle("success", success);
    detailsElement.classList.toggle("fail", !success);
    detailsElement.part.toggle("fail", !success);
    resultsElement.innerHTML = "";
    resultsElement.appendChild(valueElement);
  }
  #addProcessError(message, error) {
    if (error instanceof Error) {
      message += `
${error.message}`;
      console.error(error);
    }
    const errorElement = document.createElement("li");
    errorElement.classList.add("error", "process-error");
    errorElement.part.add("error", "process-error");
    const codeElement = document.createElement("code");
    codeElement.classList.add("code", "process-error-code");
    codeElement.part.add("code", "process-error-code");
    const preElement = document.createElement("pre");
    preElement.classList.add("pre", "process-error-pre");
    preElement.part.add("pre", "process-error-pre");
    preElement.textContent = message;
    codeElement.append(preElement);
    errorElement.append(codeElement);
    this.getElement("tests").append(errorElement);
  }
  #updateListType(type) {
    if (type == "ordered") {
      const list = this.shadowRoot.querySelector("ul");
      if (list == null) {
        return;
      }
      const items = this.shadowRoot?.querySelectorAll("li");
      const newList = document.createElement("ol");
      if (items != null) {
        newList.append(...items);
      }
      newList.id = "tests";
      list.replaceWith(newList);
    } else {
      const list = this.shadowRoot.querySelector("ol");
      if (list == null) {
        return;
      }
      const items = this.shadowRoot?.querySelectorAll("li");
      const newList = document.createElement("ul");
      newList.id = "tests";
      if (items != null) {
        newList.append(...items);
      }
      list.replaceWith(newList);
    }
  }
  static observedAttributes = ["in-order"];
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName == "in-order") {
      if (newValue == void 0) {
        this.#updateListType("unordered");
      } else {
        this.#updateListType("ordered");
      }
    }
  }
};
function generateId() {
  const rnd = new Uint8Array(20);
  crypto.getRandomValues(rnd);
  const b64 = [].slice.apply(rnd).map(function(ch) {
    return String.fromCharCode(ch);
  }).join("");
  const secret = btoa(b64).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
  return secret;
}
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AFTERALL,
  AFTEREACH,
  BEFOREALL,
  BEFOREEACH,
  CodeTestEventType,
  CodeTests,
  CodeTestsElement,
  expect
});
