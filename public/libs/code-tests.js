const style$1 = `:host\r
{\r
    --gap: 7px;\r
    --gap-small: 3px;\r
    --gap-medium: 14px;\r
    --gap-large: 24px;\r
    \r
    --surface-success: oklch(93.96% 0.05 148.74);\r
    --primary-success: oklch(58.83% 0.158 145.05);\r
    --border-success: solid 1px var(--primary-success);\r
\r
    --surface-fail: oklch(88.98% 0.052 3.28);\r
    --primary-fail: oklch(45.8% 0.177 17.7);\r
    --border-fail: solid 1px var(--primary-fail);\r
\r
    --surface-process: oklch(89.66% 0.046 260.67);\r
    --primary-process: oklch(43.48% 0.17 260.2);\r
    --border-process: solid 1px var(--primary-process);\r
\r
\r
\r
    --surface-test-summary: var(--uchu-gray);\r
    --surface-hook-summary: var(--uchu-light-purple);\r
    --surface-hook-any-summary: var(--uchu-light-blue);\r
    \r
    --border-test: solid 1px var(--uchu-dark-gray);\r
    --border-hook: solid 1px var(--uchu-dark-purple);\r
    --border-hook-any: solid 1px var(--uchu-dark-blue);\r
    --border-button: solid 1px var(--uchu-blue);\r
    \r
    --success-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%232e943a" d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>');\r
    --info-icon: url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2022.812714%2022.814663%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Asvg%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20style%3D%22fill%3Atransparent%3Bstroke%3Atransparent%3Bstroke-width%3A0.999999%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A6.3%3Bstroke-dasharray%3Anone%3Bstroke-dashoffset%3A29.2913%3Bstroke-opacity%3A1%22%20d%3D%22M%2022.295505%2C11.407332%20A%2010.889144%2C10.889144%200%200%201%2011.406424%2C22.296479%2010.889144%2C10.889144%200%200%201%200.51720881%2C11.407332%2010.889144%2C10.889144%200%200%201%2011.406424%2C0.51818382%2010.889144%2C10.889144%200%200%201%2022.295505%2C11.407332%20Z%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22m%2013.945668%2C4.3053761%20c%200.150778%2C-0.96462%20-0.30687%2C-1.43709%20-1.36997%2C-1.43709%20-1.063%2C0%20-1.668452%2C0.47247%20-1.81923%2C1.43709%20-0.150779%2C0.96462%200.306971%2C1.43708%201.369971%2C1.43708%201.004%2C0%201.66845%2C-0.47246%201.819229%2C-1.43708%20z%20M%2011.693889%2C17.829726%2013.373994%2C7.0811161%20h%20-2.9333%20L%208.7605887%2C17.829726%20Z%22%20style%3D%22font-size%3A19.6861px%3Bfont-family%3APassageway%3B-inkscape-font-specification%3APassageway%3Bfill%3A%23a30d30%3Bstroke-width%3A2.5%3Bstroke-linejoin%3Around%3Bstroke-miterlimit%3A6.3%3Bstroke-dashoffset%3A29.2913%22%20aria-label%3D%22i%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E');\r
\r
\r
    display: grid;\r
    gap: var(--gap);\r
    grid-auto-rows: max-content;\r
}\r
\r
#header\r
{\r
    flex: 1;\r
    display: flex;\r
    align-items: center;\r
    gap: var(--gap);\r
    padding: var(--gap-small) var(--gap);\r
}\r
#title\r
{\r
    flex: 1;\r
}\r
\r
#tests\r
,#component-content\r
{\r
    display: grid;\r
    gap: var(--gap);\r
    grid-auto-rows: max-content;\r
}\r
\r
/* Run button */\r
button .arrow-icon\r
{\r
    width: .75em;\r
    height: .75em;\r
    transform: rotate(-90deg);\r
    margin-inline: 3px;\r
}\r
:host(.running) .run-all-button-icon\r
,:host(.fail) .run-all-button-icon\r
{\r
    transform: rotate(0);\r
}\r
\r
/* Dropdown Layout */\r
summary > .run-test-button\r
, #run-all-button\r
{\r
    justify-self: flex-end;\r
    margin-left: auto;\r
}\r
\r
summary:not(#component-summary)\r
{\r
    padding: var(--gap-small) var(--gap);\r
}\r
#component-summary\r
{\r
    padding-block: var(--gap-small);\r
}\r
\r
\r
/* Dropdown Markers */\r
summary\r
{\r
    display: flex;\r
    align-items: center;\r
    gap: var(--gap);\r
}\r
summary > .arrow-icon\r
{\r
    background: var(--arrow-icon);\r
    transform: rotate(-90deg);\r
    transition: transform ease-out 90ms;\r
    width: .5em;\r
    height: .5em;\r
}\r
details[open] > summary > .arrow-icon\r
{\r
    transform: rotate(0);\r
}\r
\r
/* Result Icon */\r
.result-icon\r
{\r
    --background-size: 16px;\r
    width: var(--background-size);\r
    height: var(--background-size);\r
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
    content: '⋯';\r
    font-size: 10px;\r
}\r
\r
:host(.running) #component-summary .result-icon\r
,.test.running .test-summary > .result-icon\r
,.hook.running .result-icon\r
,.processing-details.running .processing-result-icon\r
{\r
    border: var(--border-process);\r
    background: var(--surface-process);\r
}\r
:host(.success) #component-summary .result-icon\r
,.test.success .test-summary > .result-icon\r
,.hook.success .result-icon\r
,.processing-details.success .processing-result-icon\r
{\r
    border: var(--border-success);\r
    background: var(--surface-success)\r
    var(--success-icon);\r
    background-repeat: no-repeat;\r
    background-position: center;\r
    background-size: var(--icon-size, 12px) var(--icon-size, 12px);\r
}\r
:host(.fail) #component-summary .result-icon\r
,.test.fail .test-summary > .result-icon\r
,.hook.fail .result-icon\r
,.processing-details.fail .processing-result-icon\r
{\r
    border: var(--border-fail);\r
    background: var(--surface-fail)\r
    var(--info-icon);\r
    background-size: var(--icon-size, 16px) var(--icon-size, 16px);\r
    background-repeat: no-repeat;\r
    background-position: center;\r
    transform: rotate(175deg);\r
}\r
:host(:is(.success,.fail)) #component-summary .result-icon::before\r
,.test:is(.success,.fail) .test-summary > .result-icon::before\r
,.hook:is(.success,.fail) .result-icon::before\r
,.processing-details:is(.success,.fail) .processing-result-icon::before\r
{\r
    display: none;\r
}\r
:host(.running) #component-summary .result-icon::before\r
,.test:is(.running) .test-summary > .result-icon::before\r
,.hook:is(.running) .result-icon::before\r
,.processing-details:is(.running) .processing-result-icon::before\r
{\r
    content: '';\r
    --color: var(--primary-process, currentColor);\r
    --animation-timing-function: linear;\r
    --animation-duration: 2s;\r
    width: var(--icon-size, 14px);\r
    height: var(--icon-size, 14px);\r
    mask-image: radial-gradient(circle at 50% 50%, transparent calc(var(--icon-size, 14px) / 3), black calc(var(--icon-size, 14px) / 3));\r
    background-image: conic-gradient(transparent, transparent 135deg, var(--color));\r
    border-radius: 50%;\r
    animation: var(--animation-timing-function) var(--animation-duration) infinite spin;\r
    margin: 2px;\r
}\r
\r
/* Smaller Result icon settings for sub-test icons */\r
.before-each-result-icon\r
,.after-each-result-icon\r
,.processing-result-icon\r
{\r
    --background-size: 12px;\r
}\r
.before-each-result-icon::before\r
,.after-each-result-icon::before\r
,.processing-result-icon::before\r
{\r
    font-size: 9px;\r
}\r
.hook.success .before-each-result-icon\r
,.hook.success .after-each-result-icon\r
,.processing-details.success .processing-result-icon\r
{\r
    --icon-size: 8px;\r
}\r
.hook.fail .before-each-result-icon\r
,.hook.fail .after-each-result-icon\r
,.processing-details.fail .processing-result-icon\r
{\r
    --icon-size: 12px;\r
}\r
.hook:is(.running) .before-each-result-icon::before\r
,.hook:is(.running) .after-each-result-icon::before\r
,.processing-details:is(.running) .processing-result-icon::before\r
{\r
    --icon-size: 9px;\r
}\r
\r
/* Hook Display */\r
.hook\r
{\r
    display: none;\r
}\r
:host(.has-before-all-hook) #before-all-details\r
,:host(.has-after-all-hook) #after-all-details\r
{\r
    display: initial;\r
}\r
:host(.has-before-each-hook) .before-each-details\r
,:host(.has-after-each-hook) .after-each-details\r
{\r
    display: initial;\r
}\r
:host(.has-required-before-hook) #required-before-any-details\r
,:host(.has-required-after-hook) #required-after-any-details\r
{\r
    display: initial;\r
}\r
\r
/* Test Display */\r
code-test .results\r
{\r
    display: grid;\r
    gap: var(--gap-small);\r
    padding-inline-start: 1em;\r
}\r
\r
code-test .results details .result\r
,.hook > .results\r
{\r
    margin-inline-start: 1em;\r
}\r
\r
.result.message:empty\r
{\r
    padding: .5em 1em;\r
}\r
.result.message:empty::before\r
{\r
    content: '[ this function has not been run ]';\r
    font-family: monospace;\r
    font-size: 12px;\r
    font-style: italic;\r
}\r
\r
/* Ordered Display */\r
#tests\r
{\r
    counter-reset: tests;\r
}\r
code-test\r
{\r
    counter-increment: tests;\r
}\r
:host(:not([ordered="false"])) code-test > details > summary > .description::before\r
{\r
    content: counter(tests) ". ";\r
}\r
\r
/* Hook Name */\r
.hook-name,.processing-description\r
{\r
    border-radius: 3px;\r
    border: solid 1px;\r
    /* background: rgb(0 0 0 / .2); */\r
    font-family: monospace;\r
    text-transform: uppercase;\r
    font-size: 11px;\r
    padding: 3px 7px;\r
}\r
\r
@keyframes spin\r
{\r
    from { transform: rotate(0deg); }\r
    to { transform: rotate(360deg); }\r
}`;
const html = '<details id="component-details" class="details">\r\n    <summary id="component-summary" class="summary">\r\n        <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>\r\n        <slot name="header">\r\n            <header id="header">\r\n                <span id="component-result-icon" class="result-icon"></span>\r\n                <span id="title"><slot name="title"><span id="title-text">Tests</span></slot></span>\r\n                <slot name="run-all-button">\r\n                    <button type="button" id="run-all-button" title="Run All Tests">\r\n                        <slot name="run-all-button-content">\r\n                            <slot name="run-all-button-icon"><svg class="icon arrow-icon run-button-icon run-all-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>\r\n                            <slot name="run-all-button-label"><span class="run-all-button-label run-button-label button-label label icon">Run Tests</span></slot>\r\n                        </slot>\r\n                    </button>\r\n                </slot>\r\n                <slot name="header-details"></slot>\r\n            </header>\r\n        </slot>\r\n    </summary>\r\n    <div id="component-content" class="content">\r\n        <details id="required-before-any-details" class="hook">\r\n            <summary id="required-before-any-summary">\r\n                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>\r\n                <span id="required-before-any-result-icon" class="result-icon"></span>\r\n                <span id="required-before-any-description" class="description hook-name">Required Before Any Hook</span>\r\n            </summary>\r\n            <div class="results">\r\n                <div id="required-before-any-results" class="result message"></div>\r\n            </div>\r\n        </details>\r\n        <details id="before-all-details" class="hook">\r\n            <summary id="before-all-summary">\r\n                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>\r\n                <span id="before-all-result-icon" class="result-icon"></span>\r\n                <span id="before-all-description" class="description hook-name">Before All Hook</span>\r\n            </summary>\r\n            <div class="results">\r\n                <div id="before-all-results" class="result message"></div>\r\n            </div>\r\n        </details>\r\n        <div id="tests"></div>\r\n        <details id="after-all-details" class="hook">\r\n            <summary id="after-all-summary">\r\n                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>\r\n                <span id="after-all-result-icon" class="result-icon"></span>\r\n                <span id="after-all-description" class="description hook-name">After All Hook</span>\r\n            </summary>\r\n            <div class="results">\r\n                <div id="after-all-results" class="result message"></div>\r\n            </div>\r\n        </details>\r\n        <details id="required-after-any-details" class="hook">\r\n            <summary id="required-after-any-summary">\r\n                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>\r\n                <span id="required-after-any-result-icon" class="result-icon"></span>\r\n                <span id="required-after-any-description" class="description hook-name">Required After Any Hook</span>\r\n            </summary>\r\n            <div class="results">\r\n                <div id="required-after-any-results" class="result message"></div>\r\n            </div>\r\n        </details>\r\n    </div>\r\n</details>\r\n<div id="icon-definitions" style="display: none;">\r\n    <svg id="icon-definition_arrow" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">\r\n        <path d="m3.26,6.81l-2.93,-4.69c-0.37,-0.58 0.05,-1.34 0.74,-1.34l5.87,0c0.69,0 1.11,0.76 0.74,1.34l-2.93,4.69c-0.35,0.55 -1.14,0.55 -1.49,0z" fill="var(--fill-color, currentcolor)" />\r\n    </svg>\r\n    <svg id="icon-definition_reset" class="icon reset" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">\r\n        <path\r\n            style="fill:var(--fill-color, currentcolor);stroke-linecap:round;stroke-linejoin:round;-inkscape-stroke:none;paint-order:markers stroke fill"\r\n            d="M 5.484375 0.43359375 A 1.5224222 1.5224222 0 0 0 4.2558594 1.2011719 L 0.99804688 6.9453125 A 1.5224222 1.5224222 0 0 0 2.5488281 9.2011719 L 9.34375 8.171875 A 1.5224222 1.5224222 0 0 0 10.332031 5.7539062 L 9.4746094 4.6113281 C 11.949333 3.8016718 14.718209 4.258351 16.822266 5.9570312 C 19.510764 8.1275534 20.456787 11.785479 19.160156 14.988281 C 17.863527 18.191083 14.6405 20.15873 11.199219 19.847656 C 7.7579362 19.536584 4.9376009 17.022073 4.2363281 13.638672 A 1.5 1.5 0 0 0 2.4628906 12.474609 A 1.5 1.5 0 0 0 1.2988281 14.248047 C 2.2656928 18.912838 6.1831413 22.407052 10.927734 22.835938 C 15.672328 23.264824 20.153706 20.531029 21.941406 16.115234 C 23.729107 11.699441 22.413741 6.6156073 18.707031 3.6230469 C 16.853677 2.1267667 14.61485 1.3255701 12.347656 1.2324219 C 10.738216 1.1662975 9.1150542 1.4598646 7.6035156 2.1132812 L 6.7988281 1.0390625 A 1.5224222 1.5224222 0 0 0 5.484375 0.43359375 z " />\r\n    </svg>\r\n    <svg id="icon-definition_cancel" class="icon cancel" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">\r\n    <path\r\n        style="fill:var(--fill-color, currentcolor);stroke-linecap:round;stroke-linejoin:round;-inkscape-stroke:none;paint-order:markers stroke fill"\r\n        d="M -7.063234 9.5244002 C -5.8135728 7.6769245 -5.0820528 5.453265 -5.0820528 3.0633809 C -5.0820529 -3.3096433 -10.278145 -8.5098163 -16.65117 -8.5098163 C -23.024193 -8.5098163 -28.22385 -3.3110105 -28.22385 3.0620137 C -28.22385 9.4350379 -23.025043 14.634694 -16.65202 14.634694 C -12.668879 14.634694 -9.1460028 12.603526 -7.063234 9.5244002 z M -9.5406311 7.8637601 C -11.076991 10.143147 -13.683157 11.63463 -16.652974 11.63463 C -19.960499 11.63463 -22.814085 9.782061 -24.244824 7.0543029 L -24.236684 7.0527515 L -8.1332524 3.983715 L -8.1305391 3.9831979 C -8.2815631 5.4121635 -8.7798709 6.7350751 -9.5406311 7.8637601 z M -9.0610781 -0.92890828 L -9.069218 -0.92735695 L -25.17265 2.1416796 L -25.175363 2.1421967 C -24.719122 -2.1725739 -21.093311 -5.5092358 -16.652928 -5.5092358 C -13.345403 -5.5092358 -10.491243 -3.6566663 -9.0610781 -0.92890828 z "\r\n        transform="rotate(-124.20981)" />\r\n    </svg>\r\n</div>';
class TestPromise extends Promise {
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
  async toContainText(_value) {
  }
  async toHaveAttribute(value) {
    const target = await this;
    if (!(target instanceof HTMLElement)) {
      throw new Error("Unable to check for attribute on non-HTMLElement target");
    }
    if (target.getAttribute(value)) {
      throw new Error("Target does not have attribute");
    }
  }
}
class CodeTests {
  static timeoutMS = 500;
  // static #expectInterval?: ReturnType<typeof setInterval>;
  // static #expectPromise?: TestPromise<void>;
  static expect(value) {
    const promise = new TestPromise(async (resolve, _reject) => {
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
    const promise = new TestPromise(async (resolve, _reject) => {
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
    const promise = new TestPromise(async (resolve, _reject) => {
      if (value instanceof Promise) {
        const result = await value;
        resolve(result);
        return;
      }
      resolve(value);
    });
    return promise;
  }
  static async prompt(host, parent, message, options) {
    return new Promise((resolve, _reject) => {
      const template = host.findElement("prompt-template");
      const promptElement = CodeTests.createElementFromTemplate(template);
      promptElement.querySelector(".label").textContent = message;
      const clickHandler = (event) => {
        const composedPath = event.composedPath();
        const acceptButton = composedPath.find((item) => item instanceof HTMLButtonElement && item.classList.contains("accept"));
        if (acceptButton != null) {
          const result = options?.onAccept?.() ?? true;
          promptElement.removeEventListener("click", clickHandler);
          resolve(result);
          return;
        }
        const rejectButton = composedPath.find((item) => item instanceof HTMLButtonElement && item.classList.contains("reject"));
        if (rejectButton != null) {
          const result = options?.onReject?.() ?? false;
          promptElement.removeEventListener("click", clickHandler);
          resolve(result);
          return;
        }
      };
      promptElement.addEventListener("click", clickHandler);
      if (options?.acceptLabel != null) {
        promptElement.querySelector(".accept").textContent = options.acceptLabel;
      }
      if (options?.rejectLabel != null) {
        promptElement.querySelector(".reject").textContent = options.rejectLabel;
      }
      const details = parent instanceof HTMLDetailsElement ? parent : parent.querySelector(".test-details");
      if (details != null) {
        details.open = true;
      }
      parent.querySelector(".result")?.append(promptElement);
    });
  }
  static createElementFromTemplate(target, parent) {
    const templateNode = target instanceof HTMLTemplateElement ? target : document.querySelector(target);
    if (templateNode == null) {
      throw new Error(`Unable to find template element from selector: ${target}`);
    }
    const firstChild = templateNode.content.cloneNode(true).querySelector("*");
    if (firstChild == null) {
      throw new Error(`Unable to find first child of template element`);
    }
    parent?.append(firstChild);
    return firstChild;
  }
}
function expect(value) {
  return CodeTests.expect(value);
}
function prompt(host, parent, message, options) {
  return CodeTests.prompt(host, parent, message, options);
}
const NOTESTDEFINED = /* @__PURE__ */ Symbol("No Test Defined");
const CodeTestEvent = {
  BeforeAll: "beforeall",
  AfterAll: "afterall",
  BeforeTest: "beforetest",
  AfterTest: "aftertest",
  BeforeHook: "beforehook",
  AfterHook: "afterhook",
  Cancel: "cancel",
  Context: "context",
  Reset: "reset"
};
const style = "";
const COMPONENT_STYLESHEET$1 = new CSSStyleSheet();
COMPONENT_STYLESHEET$1.replaceSync(`${style}`);
const COMPONENT_TAG_NAME$1 = "code-test";
class CodeTestElement extends HTMLElement {
  state = {
    testId: "",
    description: "none",
    testState: void 0,
    beforeEachState: void 0,
    afterEachState: void 0
  };
  setState(state) {
    this.state = state;
    this.#render();
  }
  setStateProperties(state) {
    this.setState({
      ...this.state,
      ...state
    });
  }
  setTestStateProperties(key, state) {
    if (this.state[key] == null) {
      return;
    }
    this.setState({
      ...this.state,
      [key]: {
        ...this.state[key],
        ...state
      }
    });
  }
  findElement(query) {
    return this.shadowRoot.querySelector(query);
  }
  findElements(query) {
    return Array.from(this.shadowRoot.querySelectorAll(query));
  }
  isRunning() {
    return this.state.testState?.isRunning == true || this.state.beforeEachState?.isRunning == true || this.state.afterEachState?.isRunning == true;
  }
  hasRun() {
    return this.state.testState?.hasRun == true || this.state.beforeEachState?.hasRun == true || this.state.afterEachState?.hasRun == true;
  }
  resultCategory() {
    const testCategory = this.state.testState?.resultCategory ?? "none";
    const beforeEachCategory = this.state.beforeEachState?.resultCategory ?? "none";
    const afterEachCategory = this.state.afterEachState?.resultCategory ?? "none";
    if (testCategory == "none" && beforeEachCategory == "none" && afterEachCategory == "none") {
      return "none";
    }
    if (this.state.beforeEachState == null && this.state.afterEachState == null) {
      return testCategory;
    } else if (this.state.beforeEachState != null && this.state.afterEachState == null) {
      if (testCategory == "fail" || beforeEachCategory == "fail") {
        return "fail";
      }
      if (testCategory == "success" && beforeEachCategory == "success") {
        return "success";
      }
      return "none";
    } else if (this.state.beforeEachState == null && this.state.afterEachState != null) {
      if (testCategory == "fail" || afterEachCategory == "fail") {
        return "fail";
      }
      if (testCategory == "success" && afterEachCategory == "success") {
        return "success";
      }
      return "none";
    } else if (this.state.beforeEachState != null && this.state.afterEachState != null) {
      if (testCategory == "fail" || beforeEachCategory == "fail" || afterEachCategory == "fail") {
        return "fail";
      }
      if (testCategory == "success" && beforeEachCategory == "success" && afterEachCategory == "success") {
        return "success";
      }
      return "none";
    }
  }
  constructor() {
    super();
  }
  connectedCallback() {
    this.#render();
  }
  #render() {
    this.innerHTML = `<details class="test-details" part="test-details" ${this.isRunning() == true || this.hasRun() == true ? " open" : ""}>
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon test-result-icon${this.state.testState?.resultCategory != "none" ? ` ${this.state.testState?.resultCategory}` : ""}" part="result-icon"></div>
                <span class="test-description description">${this.state.description}</span>
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test">
                    <slot name="run-button-content">
                        <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
                        <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Test</span></slot>
                    </slot>
                </button>
            </summary>
            <div class="results" part="results">
                ${this.state.beforeEachState == null ? "" : `<details class="before-each-details hook${this.state.beforeEachState.resultCategory == "none" ? "" : ` ${this.state.beforeEachState.resultCategory}`}${this.state.beforeEachState.isRunning == true ? " running" : ""}" part="before-each-details hook">
                        <summary class="before-each-summary" part="before-each-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="before-each-result-icon result-icon${this.state.beforeEachState.resultCategory != "none" ? ` ${this.state.beforeEachState.resultCategory}` : ""}" part="before-each-result-icon"></div>
                            <span class="before-each-description description hook-name">Before Each Hook</span>
                        </summary>
                        <div class="before-each-result result message" part="before-each-result result message">${typeof this.state.beforeEachState.resultContent != "string" ? "" : this.state.beforeEachState.resultContent}</div>
                    </details>`}
                ${this.state.testState == null ? "" : this.state.beforeEachState == null && this.state.afterEachState == null ? `<div class="test-result result message" part="test-result result message">${typeof this.state.testState.resultContent != "string" ? "" : this.state.testState.resultContent}</div>` : `<details class="processing-details${this.state.testState.resultCategory == "none" ? "" : ` ${this.state.testState.resultCategory}`}${this.state.testState.isRunning == true ? " running" : ""}" part="processing-details"${this.state.testState.hasRun == true ? " open" : ""}>
                        <summary class="processing-summary" part="processing-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="processing-result-icon result-icon${this.state.testState.resultCategory != "none" ? ` ${this.state.testState.resultCategory}` : ""}" part="processing-result-icon result-icon"></div>
                            <span class="processing-description description">Test</span>
                        </summary>
                        <div class="test-result result message" part="test-result result message">${typeof this.state.testState.resultContent != "string" ? "" : this.state.testState.resultContent}</div>
                    </details>`}                
                ${this.state.afterEachState == null ? "" : `<details class="after-each-details hook${this.state.afterEachState.resultCategory == "none" ? "" : ` ${this.state.afterEachState.resultCategory}`}${this.state.afterEachState.isRunning == true ? " running" : ""}" part="after-each-detail hooks">
                        <summary class="after-each-summary" part="after-each-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="after-each-result-icon result-icon${this.state.afterEachState.resultCategory != "none" ? ` ${this.state.afterEachState.resultCategory}` : ""}" part="before-each-result-icon"></div>
                            <span class="after-each-description description hook-name">After Each Hook</span>
                        </summary>
                        <div class="after-each-result result message" part="after-each-result result message">${typeof this.state.afterEachState.resultContent != "string" ? "" : this.state.afterEachState.resultContent}</div>
                    </details>`}
            </div>
        </details>`;
    this.dataset.testId = this.state.testId;
    this.classList.add("test");
    this.part.add("test");
    this.toggleAttribute("success", this.resultCategory() == "success");
    this.classList.toggle("success", this.resultCategory() == "success");
    this.part.toggle("success", this.resultCategory() == "success");
    this.classList.toggle("fail", this.resultCategory() == "fail");
    this.part.toggle("fail", this.resultCategory() == "fail");
    this.classList.toggle("running", this.isRunning());
    this.part.toggle("running", this.isRunning());
    if (this.state.beforeEachState?.resultContent instanceof HTMLElement) {
      this.querySelector(".before-each-result").append(this.state.beforeEachState.resultContent);
    }
    if (this.state.testState?.resultContent instanceof HTMLElement) {
      this.querySelector(".test-result").append(this.state.testState.resultContent);
    }
    if (this.state.afterEachState?.resultContent instanceof HTMLElement) {
      this.querySelector(".after-each-result").append(this.state.afterEachState.resultContent);
    }
  }
  async runTest(contextManager, testContext) {
    if (this.state.testState?.test == null) {
      return;
    }
    this.reset();
    let testResult;
    let stateProperties = {};
    try {
      if (contextManager.shouldContinueRunningTests == false) {
        throw new Error("Tests have been disabled from continuing to run.");
      }
      const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
      if (allowTest == false) {
        throw new Error("Test has been prevented.");
      }
      this.setTestStateProperties("testState", { isRunning: true });
      contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state);
      testResult = await this.state.testState.test(contextManager.codeTestsElement, this, testContext);
      this.setTestStateProperties("testState", { isRunning: false, hasRun: true });
      contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state);
      const testParsedResult = contextManager.parseTestResult(testResult, true);
      stateProperties = {
        testState: {
          test: this.state.testState.test,
          resultContent: testParsedResult.result,
          resultCategory: testParsedResult.resultCategory,
          hasRun: this.state.testState.hasRun,
          isRunning: false
        }
      };
    } catch (error) {
      const errorParsedResult = contextManager.parseTestResult(testResult, false, error);
      stateProperties = {
        testState: {
          test: this.state.testState.test,
          resultContent: errorParsedResult.result,
          resultCategory: errorParsedResult.resultCategory,
          hasRun: this.state.testState.hasRun,
          isRunning: false
        }
      };
      console.error(error);
      contextManager.shouldContinueRunningTests = false;
    } finally {
      this.setStateProperties({ ...stateProperties });
      contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state);
      this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
    }
  }
  reset() {
    const testState = this.state.testState != null ? {
      resultCategory: "none",
      resultContent: "",
      test: this.state.testState.test,
      hasRun: this.state.testState.hasRun,
      isRunning: this.state.testState.isRunning
    } : void 0;
    if (testState == void 0) {
      return;
    }
    this.setTestStateProperties("testState", testState);
  }
  // static observedAttributes = [ "myprop" ];
  // attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) 
  // {
  //     if(attributeName == "myprop")
  //     {
  //     }
  // }
}
if (customElements.get(COMPONENT_TAG_NAME$1) == null) {
  customElements.define(COMPONENT_TAG_NAME$1, CodeTestElement);
}
class TestManager {
  // #hooks: Hooks = { };
  #tests = /* @__PURE__ */ new Map();
  async loadTests(path) {
    const module = await this.#loadModule(path);
    const tests = module.tests ?? module.default;
    if (tests == void 0) {
      throw new Error(`Unable to find tests definition in file at path: ${path}`);
    }
    const hooks = {};
    const beforeAll = tests[Hook.BeforeAll];
    if (beforeAll != null) {
      hooks[Hook.BeforeAll] = beforeAll;
      delete tests[Hook.BeforeAll];
    }
    const afterAll = tests[Hook.AfterAll];
    if (afterAll != null) {
      hooks[Hook.AfterAll] = afterAll;
      delete tests[Hook.AfterAll];
    }
    const beforeEach = tests[Hook.BeforeEach];
    if (beforeEach != null) {
      hooks[Hook.BeforeEach] = beforeEach;
      delete tests[Hook.BeforeEach];
    }
    const afterEach = tests[Hook.AfterEach];
    if (afterEach != null) {
      hooks[Hook.AfterEach] = afterEach;
      delete tests[Hook.AfterEach];
    }
    const requiredBeforeAny = tests[Hook.RequiredBeforeAny];
    if (requiredBeforeAny != null) {
      hooks[Hook.RequiredBeforeAny] = requiredBeforeAny;
      delete tests[Hook.RequiredBeforeAny];
    }
    const requiredAfterAny = tests[Hook.RequiredAfterAny];
    if (requiredAfterAny != null) {
      hooks[Hook.RequiredAfterAny] = requiredAfterAny;
      delete tests[Hook.RequiredAfterAny];
    }
    const resetHook = tests[Hook.Reset];
    if (resetHook != null) {
      hooks[Hook.Reset] = resetHook;
      delete tests[Hook.Reset];
    }
    const contextHook = tests[Hook.Context];
    if (contextHook != null) {
      hooks[Hook.Context] = contextHook;
      delete tests[Hook.Context];
    }
    this.#tests = new Map(Object.entries(tests));
    return { tests, hooks };
  }
  async #loadModule(path) {
    const lastSlashIndexInCurrentPath = window.location.href.lastIndexOf("/");
    const currentPathHasExtension = window.location.href.substring(lastSlashIndexInCurrentPath).indexOf(".") != -1;
    const currentPath = currentPathHasExtension == true ? window.location.href.substring(0, lastSlashIndexInCurrentPath + 1) : window.location.href;
    const moduleDirectory = currentPath + path.substring(0, path.lastIndexOf("/") + 1);
    const modulePath = currentPath + path;
    let moduleContent = await (await fetch(modulePath)).text();
    moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
    const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf("/")), { type: "text/javascript" });
    const moduleURL = URL.createObjectURL(moduleFile);
    const module = await import(
      /* @vite-ignore */
      moduleURL
    );
    return module;
  }
  addTest(testId, test) {
    this.#tests.set(testId, test);
  }
  async runBeforeAllHook() {
  }
  async runAfterAllHook() {
  }
  async runRequiredBeforeAnyHook() {
  }
  async runRequiredAfterAnyHook() {
  }
  // async runHook(contextManager: ContextManager, hook: Test)
  // {
  //     try
  //     {
  //         if(contextManager.codeTestsElement.state.isCanceled == true) { throw new Error("Tests have been cancelled"); }
  //         return await hook(contextManager.codeTestsElement, contextManager.codeTestsElement);
  //     }
  //     catch(error)
  //     {
  //         console.error(error);
  //         contextManager.shouldContinueRunningTests = false;
  //         return { success: false, value: `Failed: ${(error as Error).message}` }
  //     }
  //     // return await hook(contextManager.codeTestsElement);
  //     //     try
  //     //     {
  //     //         const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
  //     //         requiredAfterAnyHookElement.classList.add('running');
  //     //         requiredAfterAnyHookElement.part.add('running');
  //     //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
  //     //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
  //     //         hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);
  //     //         this.#handleHookResult(hookResult, true, 'after', true);
  //     //         requiredAfterAnyHookElement.part.remove('running');
  //     //         requiredAfterAnyHookElement.classList.remove('running');
  //     //     }
  //     //     catch(error)
  //     //     {
  //     //         this.#handleHookResult(hookResult, false, 'after', true, error as Error);
  //     //         console.error(error);
  //     //         this.#continueRunningTests = false;
  //     //     }
  // }
}
class ContextManager {
  codeTestsElement;
  #testManager;
  constructor(parent) {
    this.codeTestsElement = parent;
    this.#testManager = new TestManager();
  }
  async loadTests(path) {
    if (path == null) {
      return;
    }
    try {
      const { tests, hooks } = await this.#testManager.loadTests(path);
      console.log(tests, hooks);
      const beforeAll = hooks[Hook.BeforeAll];
      if (beforeAll != null) {
        this.codeTestsElement.classList.add("has-before-hook", "has-before-all-hook");
        this.codeTestsElement.part.add("has-before-hook", "has-before-all-hook");
      }
      const afterAll = hooks[Hook.AfterAll];
      if (afterAll != null) {
        this.codeTestsElement.classList.add("has-after-hook", "has-after-all-hook");
        this.codeTestsElement.part.add("has-after-hook", "has-after-all-hook");
      }
      const beforeEach = hooks[Hook.BeforeEach];
      if (beforeEach != null) {
        this.codeTestsElement.classList.add("has-before-hook", "has-before-each-hook");
        this.codeTestsElement.part.add("has-before-hook", "has-before-each-hook");
      }
      const afterEach = hooks[Hook.AfterEach];
      if (afterEach != null) {
        this.codeTestsElement.classList.add("has-after-hook", "has-after-each-hook");
        this.codeTestsElement.part.add("has-after-hook", "has-after-each-hook");
      }
      const requiredBeforeAny = hooks[Hook.RequiredBeforeAny];
      if (requiredBeforeAny != null) {
        this.codeTestsElement.classList.add("has-before-hook", "has-required-before-hook");
        this.codeTestsElement.part.add("has-before-hook", "has-required-before-hook");
      }
      const requiredAfterAny = hooks[Hook.RequiredAfterAny];
      if (requiredAfterAny != null) {
        this.codeTestsElement.classList.add("has-after-hook", "has-required-after-hook");
        this.codeTestsElement.part.add("has-after-hook", "has-required-after-hook");
      }
      const beforeAllState = beforeAll == null ? void 0 : { resultCategory: "none", resultContent: "", test: beforeAll, hasRun: false, isRunning: false };
      const afterAllState = afterAll == null ? void 0 : { resultCategory: "none", resultContent: "", test: afterAll, hasRun: false, isRunning: false };
      const beforeEachState = beforeEach == null ? void 0 : { resultCategory: "none", resultContent: "", test: beforeEach, hasRun: false, isRunning: false };
      const afterEachState = afterEach == null ? void 0 : { resultCategory: "none", resultContent: "", test: afterEach, hasRun: false, isRunning: false };
      const requiredBeforeAnyState = requiredBeforeAny == null ? void 0 : { resultCategory: "none", resultContent: "", test: requiredBeforeAny, hasRun: false, isRunning: false };
      const requiredAfterAnyState = requiredAfterAny == null ? void 0 : { resultCategory: "none", resultContent: "", test: requiredAfterAny, hasRun: false, isRunning: false };
      this.codeTestsElement.setStateProperties({
        beforeAllState,
        afterAllState,
        beforeEachState,
        afterEachState,
        requiredBeforeAnyState,
        requiredAfterAnyState
      });
      for (const [description, test] of Object.entries(tests)) {
        this.#addTest(description, test);
      }
    } catch (error) {
      console.error(error);
    }
  }
  #addTest(description, test) {
    const testId = generateId();
    this.#testManager.addTest(testId, test);
    const testElement = new CodeTestElement();
    testElement.setStateProperties({
      testId,
      description,
      testState: { test, resultCategory: "none", resultContent: "", isRunning: false, hasRun: false },
      beforeEachState: this.codeTestsElement.state.beforeEachState == null ? void 0 : {
        isRunning: this.codeTestsElement.state.beforeEachState.isRunning,
        hasRun: this.codeTestsElement.state.beforeEachState.hasRun,
        resultCategory: this.codeTestsElement.state.beforeEachState.resultCategory,
        resultContent: this.codeTestsElement.state.beforeEachState.resultContent
      },
      afterEachState: this.codeTestsElement.state.afterEachState == null ? void 0 : {
        isRunning: this.codeTestsElement.state.afterEachState.isRunning,
        hasRun: this.codeTestsElement.state.afterEachState.hasRun,
        resultCategory: this.codeTestsElement.state.afterEachState.resultCategory,
        resultContent: this.codeTestsElement.state.afterEachState.resultContent
      }
    });
    this.codeTestsElement.findElement("#tests").append(testElement);
    return testId;
  }
  shouldContinueRunningTests = true;
  async runTests(tests) {
    const allowTests = this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeAll, { bubbles: true, composed: true, cancelable: true }));
    if (allowTests == false) {
      throw new Error("Tests have been prevented.");
    }
    await this.codeTestsElement.reset();
    const context = await this.createTestContext();
    await this.runHook("requiredBeforeAnyState", void 0, context);
    if (this.shouldContinueRunningTests == false) {
      await this.runHook("requiredAfterAnyState", void 0, context);
      this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
      return;
    }
    await this.runHook("beforeAllState", void 0, context);
    if (this.shouldContinueRunningTests == false) {
      await this.runHook("requiredAfterAnyState", void 0, context);
      this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
      return;
    }
    const inOrder = this.codeTestsElement.getAttribute("ordered") != "false";
    if (inOrder == false) {
      const promises = tests.map((item) => this.runTest(item, true, context));
      await Promise.all(promises);
    } else {
      for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        if (this.shouldContinueRunningTests == false) {
          break;
        }
        await this.runTest(test, true, context);
      }
    }
    if (this.shouldContinueRunningTests == false) {
      await this.runHook("requiredAfterAnyState", void 0, context);
      this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
      return;
    }
    await this.runHook("afterAllState", void 0, context);
    await this.runHook("requiredAfterAnyState", void 0, context);
    this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
  }
  async runTest(test, inLoop, testContext) {
    if (test == null) {
      return;
    }
    testContext = testContext ?? await this.createTestContext();
    if (inLoop == false) {
      await this.runHook("requiredBeforeAnyState", void 0, testContext);
      if (this.shouldContinueRunningTests == false) {
        if (inLoop == false) {
          await this.runHook("requiredAfterAnyState", void 0, testContext);
        }
        return;
      }
    }
    await this.runHook("beforeEachState", test, testContext);
    if (this.shouldContinueRunningTests == false) {
      if (inLoop == false) {
        await this.runHook("requiredAfterAnyState", void 0, testContext);
      }
      return;
    }
    await test.runTest(this, testContext);
    if (this.shouldContinueRunningTests == false) {
      if (inLoop == false) {
        await this.runHook("requiredAfterAnyState", void 0, testContext);
      }
      return;
    }
    await this.runHook("afterEachState", test, testContext);
    if (inLoop == false) {
      await this.runHook("requiredAfterAnyState", void 0, testContext);
    }
  }
  async runHook(testStateName, test, testContext) {
    const testState = this.codeTestsElement.state[testStateName];
    if (testState == null) {
      return NOTESTDEFINED;
    }
    let hookResult;
    try {
      if (this.shouldContinueRunningTests == false && (testStateName != "requiredAfterAnyState" || this.codeTestsElement.getAttribute("required-after") == "error")) {
        throw new Error("Tests have been disabled from continuing to run.");
      }
      if (test != null) {
        test.setTestStateProperties(testStateName, { isRunning: true });
      }
      this.codeTestsElement.setTestStateProperties(testStateName, { isRunning: true });
      hookResult = await testState.test(this.codeTestsElement, this.codeTestsElement, testContext);
      if (test != null) {
        test.setTestStateProperties(testStateName, { isRunning: false, hasRun: true });
      }
      this.codeTestsElement.setTestStateProperties(testStateName, { isRunning: false, hasRun: true });
      const hookParsedResult = this.parseTestResult(hookResult, true, void 0);
      if (test != null) {
        test.setTestStateProperties(testStateName, {
          resultCategory: hookParsedResult.resultCategory,
          resultContent: hookParsedResult.result
        });
      }
      this.codeTestsElement.setTestStateProperties(testStateName, {
        resultCategory: hookParsedResult.resultCategory,
        resultContent: hookParsedResult.result
      });
    } catch (error) {
      console.error(error);
      this.shouldContinueRunningTests = false;
      hookResult = { success: false, value: `Failed: ${error.message}` };
      const errorParsedResult = this.parseTestResult(hookResult, false, error);
      if (test != null) {
        test.setTestStateProperties(
          testStateName,
          {
            isRunning: false,
            hasRun: true,
            resultContent: errorParsedResult.result,
            resultCategory: errorParsedResult.resultCategory
          }
        );
      }
      this.codeTestsElement.setTestStateProperties(testStateName, {
        isRunning: false,
        hasRun: true,
        resultCategory: errorParsedResult.resultCategory,
        resultContent: errorParsedResult.result
      });
    } finally {
      this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterHook, { bubbles: true, composed: true, detail: hookResult }));
      return hookResult;
    }
  }
  parseTestResult(result, finishedTest, error) {
    if (result == NOTESTDEFINED) {
      return { result: "", resultCategory: "none" };
    }
    if (result == void 0) {
      const message = finishedTest == true ? "Passed" : `Failed${error != null ? `:
${error.message}` : ""}`;
      const className = finishedTest == true ? "success-message" : "error-message";
      return {
        result: `<code class="code" part="code">
                    <pre class="pre ${className}" part="pre ${className}">${message}</pre>
                </code>`,
        resultCategory: finishedTest == true ? "success" : "fail"
      };
    } else if (typeof result == "function") {
      console.log("function");
      return { result: `[A function was returned]`, resultCategory: "none" };
    } else if (result instanceof HTMLElement || typeof result == "string") {
      return { result, resultCategory: "none" };
    } else if (typeof result == "object") {
      const objectResult = result;
      const className = finishedTest == true ? "success-message" : "error-message";
      if (objectResult.success != void 0 && objectResult.expected != void 0 && objectResult.value != void 0) {
        return {
          result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${objectResult.success == true ? "Passed" : "Failed"}
Expected:${objectResult.expected}
Result:${objectResult.value}</pre>
                    </code>`,
          resultCategory: objectResult.success == true ? "success" : "fail"
        };
      } else if (objectResult.success != void 0) {
        return {
          result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${JSON.stringify(result, void 0, 2)}</pre>
                    </code>`,
          resultCategory: objectResult.success == true ? "success" : "fail"
        };
      } else {
        const className2 = finishedTest == true ? "success-message" : "error-message";
        return {
          result: `<code class="code" part="code">
                        <pre class="pre ${className2}" part="pre ${className2}">${JSON.stringify(result, void 0, 2)}</pre>
                    </code>`,
          resultCategory: finishedTest == true ? "success" : "fail"
        };
      }
    }
    throw new Error("Unable to parse result type: Unknown result type");
  }
  async createTestContext() {
    const context = {
      isCanceled: false,
      detail: {}
    };
    if (this.codeTestsElement.state.contextHook != null) {
      await this.codeTestsElement.state.contextHook(this.codeTestsElement, this.codeTestsElement, context);
    }
    this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.Context, { bubbles: true, composed: true, detail: { context } }));
    return context;
  }
  // resetHook(hookName: keyof Pick<CodeTestsState, 'requiredBeforeAnyState'|'requiredAfterAnyState'|'beforeEachState'|'afterEachState'|'beforeAllState'|'afterAllState'>)
  // {
  //     this.codeTestsElement.setTestStateProperties(hookName, { resultContent: '', resultCategory: 'none', hasRun: false });
  // }
}
function generateId() {
  const rnd = new Uint8Array(20);
  crypto.getRandomValues(rnd);
  const b64 = [].slice.apply(rnd).map(function(ch) {
    return String.fromCharCode(ch);
  }).join("");
  const secret = btoa(b64).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
  return secret;
}
const Hook = {
  BeforeAll: "beforeall",
  AfterAll: "afterall",
  BeforeEach: "beforeeach",
  AfterEach: "aftereach",
  RequiredBeforeAny: "requiredbeforeany",
  RequiredAfterAny: "requiredafterany",
  Reset: "reset",
  Context: "context"
};
const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style$1);
const COMPONENT_TAG_NAME = "code-tests";
class CodeTestsElement extends HTMLElement {
  state = {
    // isOpen: false,
    // isRunning: false,
    isCanceled: false,
    // groupResultType: 'none',
    // hasRun: false,
    beforeAllState: void 0,
    afterAllState: void 0,
    beforeEachState: void 0,
    afterEachState: void 0,
    requiredBeforeAnyState: void 0,
    requiredAfterAnyState: void 0,
    resetHook: void 0,
    contextHook: void 0
  };
  setState(state) {
    this.state = state;
    this.#render();
  }
  setStateProperties(state) {
    this.setState({
      ...this.state,
      ...state
    });
  }
  setTestStateProperties(key, state) {
    if (this.state[key] == null) {
      return;
    }
    this.setState({
      ...this.state,
      [key]: {
        ...this.state[key],
        ...state
      }
    });
  }
  findElement(query) {
    return this.shadowRoot.querySelector(query);
  }
  findElements(query) {
    return Array.from(this.shadowRoot.querySelectorAll(query));
  }
  getIsRunning() {
    const testsAreRunning = this.findElements("code-test").find((item) => item.isRunning() == true) != null;
    return testsAreRunning == true || this.state.requiredBeforeAnyState?.isRunning == true || this.state.requiredAfterAnyState?.isRunning == true || this.state.beforeAllState?.isRunning == true || this.state.afterAllState?.isRunning == true;
  }
  getResultCategory() {
    const testCategory = this.findElements("code-test").reduce((result, item, _index) => {
      const category = item.resultCategory();
      if (result == "fail" || category == "fail") {
        return "fail";
      }
      if ((result == "success" || result == "") && category == "success") {
        return "success";
      }
      if (category == "none") {
        return "none";
      }
      return "none";
    }, "");
    const states = [
      this.state.requiredBeforeAnyState,
      this.state.requiredAfterAnyState,
      this.state.beforeAllState,
      this.state.afterAllState
    ];
    const statesCategory = states.reduce((result, item, _index) => {
      if (item == null) {
        return null;
      }
      const category = item?.resultCategory;
      if (result == "fail" || category == "fail") {
        return "fail";
      }
      if ((result == "success" || result == "") && category == "success") {
        return "success";
      }
      if (category == "none") {
        return "none";
      }
      return "none";
    }, "");
    if (testCategory == "none" && statesCategory == null) {
      return "none";
    } else if (testCategory == "fail" || statesCategory == "fail") {
      return "fail";
    } else if (testCategory == "success" && statesCategory == "success") {
      return "success";
    }
    return "none";
  }
  #contextManager;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = html;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.#contextManager = new ContextManager(this);
  }
  connectedCallback() {
    this.#init();
  }
  disconnectedCallback() {
    this.#destroy();
  }
  #isInitialized = false;
  async #init() {
    if (this.#isInitialized == true) {
      return;
    }
    await this.#initHandlers();
    this.#isInitialized = true;
    if (this.getAttribute("auto") == "false") {
      return;
    }
    const testsPath = this.#getCurrentTestsPath();
    this.#contextManager.loadTests(testsPath);
  }
  async #initHandlers() {
    this.addEventListener("click", this.#boundClickHandler);
  }
  #destroy() {
    this.removeEventListener("click", this.#boundClickHandler);
  }
  #boundClickHandler = this.#onClick.bind(this);
  #onClick(event) {
    const runAllButton = event.composedPath().find((item) => item instanceof HTMLButtonElement && item.id == "run-all-button");
    if (runAllButton != null) {
      if (this.classList.contains("running")) {
        this.#contextManager.shouldContinueRunningTests = false;
      } else if (this.classList.contains("fail") || this.classList.contains("success")) {
        this.reset();
      } else {
        this.runTests();
      }
      return;
    }
    const runButton = event.composedPath().find((item) => item instanceof HTMLButtonElement && item.classList.contains("run-test-button"));
    if (runButton == null) {
      return;
    }
    const test = runButton.closest("code-test") ?? void 0;
    this.#contextManager.runTest(test, false);
  }
  // #boundDetailsToggleHandler: (event: Event) => void = this.#componentDetails_onToggle.bind(this);
  // #componentDetails_onToggle(event: Event)
  // {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     return false;
  //     // this.setStateProperties({ isOpen: false })
  // }
  #getCurrentTestsPath() {
    return this.getAttribute("src") ?? this.getAttribute("test") ?? this.getAttribute("tests") ?? this.getAttribute("run") ?? this.getAttribute("path") ?? void 0;
  }
  #render() {
    const isRunning = this.getIsRunning();
    const resultCategory = this.getResultCategory();
    this.classList.toggle("canceled", this.state.isCanceled);
    this.part.toggle("canceled", this.state.isCanceled);
    this.classList.toggle("running", isRunning == true);
    this.part.toggle("running", isRunning == true);
    this.toggleAttribute("success", resultCategory == "success");
    this.classList.toggle("success", resultCategory == "success");
    this.part.toggle("success", resultCategory == "success");
    this.classList.toggle("fail", resultCategory == "fail");
    this.part.toggle("fail", resultCategory == "fail");
    const runAllButtonLabel = this.findElement(".run-all-button-label");
    if (runAllButtonLabel != null) {
      runAllButtonLabel.textContent = isRunning == true ? "Cancel" : resultCategory == "fail" ? "Reset" : "Run Tests";
    }
    const runAllIcon = this.findElement(".run-all-button-icon");
    if (runAllIcon != null) {
      runAllIcon.innerHTML = isRunning == true ? '<use href="#icon-definition_cancel"></use>' : resultCategory == "fail" ? '<use href="#icon-definition_reset"></use>' : '<use href="#icon-definition_arrow"></use>';
    }
    this.#renderHook(this.state.beforeAllState, "#before-all-results");
    this.#renderHook(this.state.afterAllState, "#after-all-results");
    this.#renderHook(this.state.requiredBeforeAnyState, "#required-before-any-results");
    this.#renderHook(this.state.requiredAfterAnyState, "#required-after-any-results");
  }
  #renderHook(hookState, elementSelector) {
    const resultsElement = this.findElement(elementSelector);
    if (hookState?.resultContent instanceof HTMLElement) {
      resultsElement.append(hookState.resultContent);
    } else if (typeof hookState?.resultContent == "string") {
      resultsElement.innerHTML = hookState.resultContent;
    }
    const detailsElement = resultsElement.closest("details");
    detailsElement.toggleAttribute("open", hookState != void 0 && hookState.resultCategory != "none");
    detailsElement.classList.toggle("running", hookState?.isRunning == true);
    detailsElement.part.toggle("running", hookState?.isRunning == true);
    detailsElement.toggleAttribute("success", hookState?.resultCategory == "success");
    detailsElement.classList.toggle("success", hookState?.resultCategory == "success");
    detailsElement.part.toggle("success", hookState?.resultCategory == "success");
    detailsElement.classList.toggle("fail", hookState?.resultCategory == "fail");
    detailsElement.part.toggle("fail", hookState?.resultCategory == "fail");
  }
  async runTests() {
    const tests = this.findElements("code-test");
    return this.#contextManager.runTests(tests);
  }
  async reset() {
    const tests = this.findElements("code-test");
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const beforeEachState2 = this.state.beforeEachState != null ? {
        resultCategory: "none",
        resultContent: "",
        hasRun: this.state.beforeEachState.hasRun,
        isRunning: this.state.beforeEachState.isRunning
      } : void 0;
      const afterEachState2 = this.state.afterEachState != null ? {
        resultCategory: "none",
        resultContent: "",
        hasRun: this.state.afterEachState.hasRun,
        isRunning: this.state.afterEachState.isRunning
      } : void 0;
      if (beforeEachState2 != null) {
        test.state.beforeEachState = beforeEachState2;
      }
      if (afterEachState2 != null) {
        test.state.afterEachState = afterEachState2;
      }
      test.reset();
    }
    const beforeAllState = this.state.beforeAllState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.beforeAllState.test, isRunning: false, hasRun: false };
    const afterAllState = this.state.afterAllState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.afterAllState.test, isRunning: false, hasRun: false };
    const beforeEachState = this.state.beforeEachState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.beforeEachState.test, isRunning: false, hasRun: false };
    const afterEachState = this.state.afterEachState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.afterEachState.test, isRunning: false, hasRun: false };
    const requiredBeforeAnyState = this.state.requiredBeforeAnyState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.requiredBeforeAnyState.test, isRunning: false, hasRun: false };
    const requiredAfterAnyState = this.state.requiredAfterAnyState == void 0 ? void 0 : { resultContent: "", resultCategory: "none", test: this.state.requiredAfterAnyState.test, isRunning: false, hasRun: false };
    this.setStateProperties({
      isCanceled: false,
      beforeAllState,
      afterAllState,
      beforeEachState,
      afterEachState,
      requiredAfterAnyState,
      requiredBeforeAnyState
    });
    this.#contextManager.shouldContinueRunningTests = true;
    if (this.state.resetHook != null) {
      await this.state.resetHook(this, this, { isCanceled: false, detail: {} });
    }
    this.dispatchEvent(new CustomEvent(CodeTestEvent.Reset, { bubbles: true, composed: true }));
  }
  // isCanceled: boolean = false;
  // cancel()
  // {
  //     this.isCanceled = true;
  //     this.classList.add('canceled');
  //     this.part.add('canceled');
  //     this.dispatchEvent(new CustomEvent(CodeTestEvent.Cancel, { bubbles: true, composed: true }));
  // }
  static observedAttributes = ["open"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "open") {
      this.findElement("#component-details").toggleAttribute("open", newValue != void 0);
    }
  }
}
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}
export {
  CodeTests,
  CodeTestsElement,
  Hook,
  expect,
  prompt
};
