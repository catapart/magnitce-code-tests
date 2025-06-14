// src/code-tests.css?raw
var code_tests_default = ':host([success="true"])\r\n{\r\n    color: green;\r\n}\r\n:host(.running)\r\n{\r\n    color: blue;\r\n}\r\n:host([success="false"])\r\n{\r\n    color: red;\r\n}\r\n\r\nli[success="true"]\r\n{\r\n    color: green;\r\n}\r\n\r\nli[success="false"]\r\n{\r\n    color: red;\r\n}\r\nli.running\r\n{\r\n    color: blue;\r\n}';

// src/code-tests.html?raw
var code_tests_default2 = '<slot name="header">\r\n    <header id="header">\r\n        <slot name="title">Tests</slot>\r\n        <button type="button" class="run" data-all>\u23F5</button>\r\n    </header>\r\n</slot>\r\n<ul id="tests"></ul>';

// src/api.ts
var TestPromise = class extends Promise {
  async toBeDefined() {
    const target = await this;
    if (typeof target == "undefined") {
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
var CodeTests = class _CodeTests {
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
      if (typeof value !== "undefined") {
        resolve(value);
        return;
      }
      if (this.#expectInterval != null) {
        clearInterval(this.#expectInterval);
      }
      const startTime = Date.now();
      this.#expectInterval = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime - startTime > _CodeTests.timeoutMS) {
          clearInterval(this.#expectInterval);
          reject();
        }
        if (typeof value !== "undefined") {
          clearInterval(this.#expectInterval);
          if (_CodeTests.#expectPromise != null) {
            resolve(value);
          } else {
            console.error("Expect Promise is not set");
            reject();
          }
        }
      }, 20);
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
      const currentPath = window.location.href;
      const moduleDirectory = currentPath + path.replace(/(.*?)[^/]*\..*$/, "$1");
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
      for (const [description, test] of Object.entries(tests)) {
        this.#addTest(description, test);
      }
    } catch (error) {
      this.#addProcessError("An error occurred while loading the tasks:", error);
    }
  }
  async runTests() {
    this.classList.add("running");
    this.toggleAttribute("success", false);
    const promises = [];
    for (const [id, test] of this.#tests) {
      promises.push(this.#runTest(id, test));
    }
    await Promise.all(promises);
    const failedTests = this.shadowRoot.querySelectorAll('[success="false"]');
    this.setAttribute("success", failedTests.length == 0 ? "true" : "false");
    this.classList.remove("running");
  }
  async #runTest(testId, test) {
    const testElement = this.getElement("tests").querySelector(`[data-test-id="${testId}"]`);
    testElement?.toggleAttribute("success", false);
    testElement?.classList.add("running");
    const errorMessageElement = testElement?.querySelector(".error-message");
    if (errorMessageElement != null) {
      errorMessageElement.textContent = "";
    }
    const detailsElement = testElement?.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = false;
    }
    try {
      await test();
      testElement?.classList.remove("running");
      if (testElement != null) {
        testElement.setAttribute("success", "true");
      }
    } catch (error) {
      testElement?.classList.remove("running");
      if (testElement != null) {
        this.#setTestError(testElement, "Failed:", error);
      }
      console.error(error);
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
    const errorElement = document.createElement("div");
    errorElement.classList.add("error");
    const codeElement = document.createElement("code");
    const preElement = document.createElement("pre");
    preElement.classList.add("error-message");
    codeElement.appendChild(preElement);
    errorElement.appendChild(codeElement);
    detailsElement.append(summaryElement);
    detailsElement.append(errorElement);
    testElement.append(detailsElement);
    this.getElement("tests").append(testElement);
  }
  #setTestError(testElement, message, error) {
    if (error instanceof Error) {
      message += `
${error.message}`;
    }
    testElement.setAttribute("success", "false");
    const errorMessageElement = testElement.querySelector(".error-message");
    if (errorMessageElement != null) {
      errorMessageElement.textContent = message;
    }
    const detailsElement = testElement.querySelector("details");
    if (detailsElement != null) {
      detailsElement.open = true;
    }
  }
  #addProcessError(message, error) {
    if (error instanceof Error) {
      message += `
${error.message}`;
    }
    const errorElement = document.createElement("li");
    const codeElement = document.createElement("code");
    const preElement = document.createElement("pre");
    preElement.textContent = message;
    codeElement.append(preElement);
    errorElement.append(codeElement);
    this.getElement("tests").append(errorElement);
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
  CodeTests,
  CodeTestsElement,
  expect
};
