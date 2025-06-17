// src/code-tests.css?raw
var code_tests_default = ':host\r\n{\r\n    user-select: none;\r\n}\r\n\r\n:host([success="true"])\r\n{\r\n    color: green;\r\n}\r\n:host(.running)\r\n{\r\n    color: blue;\r\n}\r\n:host([success="false"])\r\n{\r\n    color: red;\r\n}\r\n\r\nli[success="true"]\r\n{\r\n    color: green;\r\n}\r\n\r\nli[success="false"]\r\n{\r\n    color: red;\r\n}\r\nli.running\r\n{\r\n    color: blue;\r\n}';

// src/code-tests.html?raw
var code_tests_default2 = '<slot name="header">\r\n    <header id="header">\r\n        <slot name="title">Tests</slot>\r\n        <button type="button" class="run" data-all>\u23F5</button>\r\n    </header>\r\n</slot>\r\n<ul id="tests"></ul>';

// src/api.ts
var TestPromise = class extends Promise {
  async toBeDefined() {
    const target = await this;
    if (target == void 0) {
      throw new Error("Value is undefined");
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
};
function expect(value) {
  return CodeTests.expect(value);
}

// src/code-tests.ts
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
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = code_tests_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.#boundClickHandler = this.#onClick.bind(this);
  }
  connectedCallback() {
    this.addEventListener("click", this.#boundClickHandler);
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
      const lastSlashIndexInCurrentPath = window.location.href.lastIndexOf("/");
      const currentPathHasExtension = window.location.href.substring(lastSlashIndexInCurrentPath).indexOf(".") != -1;
      const currentPath = currentPathHasExtension == true ? window.location.href.substring(0, lastSlashIndexInCurrentPath + 1) : window.location.href;
      const moduleDirectory = currentPath + path.substring(0, path.lastIndexOf("/") + 1);
      const modulePath = currentPath + path;
      let moduleContent = await (await fetch(modulePath)).text();
      moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
      const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf("/")), { type: "text/javascript" });
      const moduleURL = URL.createObjectURL(moduleFile);
      const module = await import(moduleURL);
      const tests = module.tests ?? module.default;
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
        const element = this.#createTest(this.#hookIds[BEFOREALL], this.getAttribute("before-all-label") ?? "Before All:");
        element.toggleAttribute("data-before-all", true);
        this.getElement("tests").prepend(element);
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
    this.classList.add("running");
    this.toggleAttribute("success", false);
    const inOrder = this.hasAttribute("in-order");
    const beforeHooks = this.#hooks.get(BEFOREALL);
    if (beforeHooks != null) {
      for (const [hook, ids] of beforeHooks) {
        hook();
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
        await this.#runTest(id, test);
      }
    }
    const afterHooks = this.#hooks.get(AFTERALL);
    if (afterHooks != null) {
      for (const [hook, ids] of afterHooks) {
        hook();
      }
    }
    const failedTests = this.shadowRoot.querySelectorAll('[success="false"]');
    this.setAttribute("success", failedTests.length == 0 ? "true" : "false");
    this.classList.remove("running");
  }
  async #runTest(testId, test) {
    const testElement = this.getElement("tests").querySelector(`[data-test-id="${testId}"]`);
    if (testElement == null) {
      this.#addProcessError(`Unable to find test element for test: ${testId}`);
      return;
    }
    testElement.toggleAttribute("success", false);
    testElement.classList.add("running");
    const errorMessageElement = testElement.querySelector(".error-message");
    if (errorMessageElement != null) {
      errorMessageElement.textContent = "";
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = false;
    }
    let beforeResult;
    let testResult;
    let afterResult;
    try {
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
      if (beforeResult != null) {
        this.#handleTestResult(testElement, beforeResult, true);
      }
      this.#handleTestResult(testElement, testResult, true);
      if (afterResult != null) {
        this.#handleTestResult(testElement, afterResult, true);
      }
    } catch (error) {
      this.#handleTestResult(testElement, testResult, false, error);
      console.error(error);
    } finally {
      testElement?.classList.remove("running");
    }
  }
  #handleTestResult(testElement, result, finishedTest, error) {
    if (result instanceof HTMLElement) {
      this.#setResult(testElement, result, finishedTest);
    } else if (result == void 0) {
      this.#setDefaultResult(testElement, finishedTest == true ? "Passed" : `Failed${error != null ? `:
${error.message}` : ""}`, finishedTest);
    } else if (typeof result == "string") {
      this.#setDefaultResult(testElement, `${result}${error == null ? "" : `:
${error.message}`}`, finishedTest);
    } else if (typeof result == "object") {
      const objectResult = result;
      if (objectResult.success != void 0 && objectResult.expected != void 0 && objectResult.value != void 0) {
        this.#setDefaultResult(
          testElement,
          `${objectResult.success == true ? "Passed:" : "Failed:"}
Expected:${objectResult.expected}
Result:${objectResult.value}`,
          objectResult.success
        );
      }
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = true;
    }
  }
  async #runHook(testId, test) {
    const testElement = this.getElement("tests").querySelector(`[data-test-id="${testId}"]`);
    if (testElement == null) {
      this.#addProcessError(`Unable to find test element for test: ${testId}`);
      return;
    }
    testElement.toggleAttribute("success", false);
    testElement.classList.add("running");
    const errorMessageElement = testElement.querySelector(".error-message");
    if (errorMessageElement != null) {
      errorMessageElement.textContent = "";
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = false;
    }
    let beforeResult;
    let testResult;
    let afterResult;
    try {
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
      if (beforeResult != null) {
        this.#handleTestResult(testElement, beforeResult, true);
      }
      this.#handleTestResult(testElement, testResult, true);
      if (afterResult != null) {
        this.#handleTestResult(testElement, afterResult, true);
      }
    } catch (error) {
      this.#handleTestResult(testElement, testResult, false, error);
      console.error(error);
    } finally {
      testElement?.classList.remove("running");
    }
  }
  #handleHookResult(testElement, result, finishedTest, error) {
    if (result instanceof HTMLElement) {
      this.#setResult(testElement, result, finishedTest);
    } else if (result == void 0) {
      this.#setDefaultResult(testElement, finishedTest == true ? "Passed" : `Failed${error != null ? `:
${error.message}` : ""}`, finishedTest);
    } else if (typeof result == "string") {
      this.#setDefaultResult(testElement, `${result}${error == null ? "" : `:
${error.message}`}`, finishedTest);
    } else if (typeof result == "object") {
      const objectResult = result;
      if (objectResult.success != void 0 && objectResult.expected != void 0 && objectResult.value != void 0) {
        this.#setDefaultResult(
          testElement,
          `${objectResult.success == true ? "Passed:" : "Failed:"}
Expected:${objectResult.expected}
Result:${objectResult.value}`,
          objectResult.success
        );
      }
    }
    const detailsElement = testElement.querySelector("details");
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
    const detailsElement = document.createElement("details");
    const summaryElement = document.createElement("summary");
    const descriptionElement = document.createElement("span");
    descriptionElement.classList.add("description");
    descriptionElement.textContent = description;
    summaryElement.append(descriptionElement);
    const runButton = document.createElement("button");
    runButton.classList.add("run");
    runButton.textContent = "\u23F5";
    runButton.title = "Run Test";
    summaryElement.append(runButton);
    const resultElement = document.createElement("div");
    resultElement.classList.add("result");
    detailsElement.append(summaryElement);
    detailsElement.append(resultElement);
    testElement.append(detailsElement);
    return testElement;
  }
  #setResult(testElement, valueElement, success) {
    testElement.setAttribute("success", success == true ? "true" : "false");
    const resultElement = testElement.querySelector(`.result`);
    if (resultElement == null) {
      this.#addProcessError(`Unable to find result element`);
      return;
    }
    resultElement.innerHTML = "";
    resultElement.appendChild(valueElement);
  }
  #setDefaultResult(testElement, message, success) {
    const codeElement = document.createElement("code");
    const preElement = document.createElement("pre");
    preElement.textContent = message;
    preElement.classList.add(success == true ? "success-message" : "error-message");
    codeElement.appendChild(preElement);
    this.#setResult(testElement, codeElement, success);
  }
  // #setTestError(testElement: HTMLLIElement, message: string, error?: unknown)
  // {
  //     if(error instanceof Error)
  //     {
  //         message += `\n${error.message}`;
  //     }
  //     testElement.setAttribute('success', 'false');
  //     const errorMessageElement = testElement.querySelector(".error-message");
  //     if(errorMessageElement != null)
  //     {
  //         errorMessageElement.textContent = message;
  //     }
  //     const detailsElement = testElement.querySelector('details');
  //     if(detailsElement != null)
  //     {
  //         detailsElement.open = true;
  //     }
  // }
  #addProcessError(message, error) {
    if (error instanceof Error) {
      message += `
${error.message}`;
      console.error(error);
    }
    const errorElement = document.createElement("li");
    const codeElement = document.createElement("code");
    const preElement = document.createElement("pre");
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
export {
  AFTERALL,
  AFTEREACH,
  BEFOREALL,
  BEFOREEACH,
  CodeTests,
  CodeTestsElement,
  expect
};
