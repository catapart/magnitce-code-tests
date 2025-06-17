import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { AFTERALL, AFTEREACH, BEFOREALL, BEFOREEACH, CodeTests, expect, Test, TestResultType, Tests } from './api';

export type CodeTestsProperties = 
{
    
}

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'code-tests';
export class CodeTestsElement extends HTMLElement
{
    componentParts: Map<string, HTMLElement> = new Map();
    getElement<T extends HTMLElement = HTMLElement>(id: string)
    {
        if(this.componentParts.get(id) == null)
        {
            const part = this.findElement(id);
            if(part != null) { this.componentParts.set(id, part); }
        }

        return this.componentParts.get(id) as T;
    }
    findElement<T extends HTMLElement = HTMLElement>(id: string) { return this.shadowRoot!.getElementById(id) as T; }

    #hooks: Map<symbol, Map<Test, Set<string>>> = new Map();
    #hookIds: {
        [BEFOREALL]: string,
        [BEFOREEACH]: string,
        [AFTEREACH]: string,
        [AFTERALL]: string,
    } = {
        [BEFOREALL]: generateId(),
        [BEFOREEACH]: generateId(),
        [AFTEREACH]: generateId(),
        [AFTERALL]: generateId(),
    }

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.#boundClickHandler = this.#onClick.bind(this);
    }

    connectedCallback()
    {
        this.addEventListener('click', this.#boundClickHandler)
        const testsPath = this.getAttribute('src')
        ?? this.getAttribute('test')
        ?? this.getAttribute('tests')
        ?? this.getAttribute('run')
        ?? this.getAttribute('path');

        if(testsPath == null) { return; }

        this.loadTests(testsPath);
    }
    disconnectedCallback()
    {
        this.removeEventListener('click', this.#boundClickHandler);
    }

    #boundClickHandler!: (event: Event) => void;
    #onClick(event: Event)
    {
        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run')) as HTMLButtonElement;
        if(runButton == null) { return; }

        const parentListItem = runButton.closest('li');
        if(parentListItem == null)
        {
            const isRunAll = runButton.hasAttribute('data-all');
            if(isRunAll == true)
            { 
                this.runTests();
            }
            return;
        }

        const testId = parentListItem.dataset.testId;
        if(testId == null) { return; }
        const test = this.#tests.get(testId);
        if(test == null) { return; }
        this.#runTest(testId, test);
    }

    async loadTests(path: string)
    {
        try
        {
            const lastSlashIndexInCurrentPath = window.location.href.lastIndexOf('/');
            const currentPathHasExtension = window.location.href.substring(lastSlashIndexInCurrentPath).indexOf('.') != -1;
            const currentPath = (currentPathHasExtension == true)
            ? window.location.href.substring(0, lastSlashIndexInCurrentPath + 1)
            : window.location.href;
            const moduleDirectory = currentPath + path.substring(0, path.lastIndexOf('/') + 1);
            const modulePath = currentPath + path;
            let moduleContent = await (await fetch(modulePath)).text();
            moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
            // console.log(moduleContent);
            // console.log(moduleContent);
            const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf('/')), { type: 'text/javascript' });
            const moduleURL = URL.createObjectURL(moduleFile);
            // const module = await import(`data:text/javascript,${encodeURIComponent(moduleContent)}`);
            // const module = await (await fetch(moduleURL)).text();
            const module = await import(moduleURL);
            // console.log(module);
            const tests: Tests = module.tests ?? module.default;
            if(tests == undefined)
            {
                throw new Error(`Unable to find tests definition in file at path: ${path}`);
            }

            const beforeAll = tests[BEFOREALL];
            if(beforeAll != null)
            {
                const hookMap = this.#hooks.get(BEFOREALL);
                if(hookMap == null)
                {
                    const map = new Map();
                    map.set(beforeAll, new Set());
                    this.#hooks.set(BEFOREALL, map);
                }
                const element = this.#createTest(this.#hookIds[BEFOREALL], this.getAttribute('before-all-label') ?? "Before All:");
                element.toggleAttribute('data-before-all', true);
                this.getElement('tests').prepend(element);
            }
            const beforeEach = tests[BEFOREEACH];
            if(beforeEach != null)
            {
                const hookMap = this.#hooks.get(BEFOREEACH);
                if(hookMap == null)
                {
                    const map = new Map();
                    map.set(beforeEach, new Set());
                    this.#hooks.set(BEFOREEACH, map);
                }
            }
            const afterAll = tests[AFTERALL];
            if(afterAll != null)
            {
                const hookMap = this.#hooks.get(AFTERALL);
                if(hookMap == null)
                {
                    const map = new Map();
                    map.set(afterAll, new Set());
                    this.#hooks.set(AFTERALL, map);
                }
            }
            const afterEach = tests[AFTEREACH];
            if(afterEach != null)
            {
                const hookMap = this.#hooks.get(AFTEREACH);
                if(hookMap == null)
                {
                    const map = new Map();
                    map.set(afterEach, new Set());
                    this.#hooks.set(AFTEREACH, map);
                }
            }

            for(const [description, test] of Object.entries(tests))
            {
                const id = this.#addTest(description, test);

                if(beforeAll != null)
                {
                    const hookMap = this.#hooks.get(BEFOREALL);
                    if(hookMap != null)
                    {
                        const testIds = hookMap.get(beforeAll);
                        if(testIds != null)
                        {
                            testIds.add(id);
                        }
                    }
                }
                if(beforeEach != null)
                {
                    const hookMap = this.#hooks.get(BEFOREEACH);
                    if(hookMap != null)
                    {
                        const testIds = hookMap.get(beforeEach);
                        if(testIds != null)
                        {
                            testIds.add(id);
                        }
                    }
                }
                if(afterAll != null)
                {
                    const hookMap = this.#hooks.get(AFTERALL);
                    if(hookMap != null)
                    {
                        const testIds = hookMap.get(afterAll);
                        if(testIds != null)
                        {
                            testIds.add(id);
                        }
                    }
                }
                if(afterEach != null)
                {
                    const hookMap = this.#hooks.get(AFTEREACH);
                    if(hookMap != null)
                    {
                        const testIds = hookMap.get(afterEach);
                        if(testIds != null)
                        {
                            testIds.add(id);
                        }
                    }
                }
            }
        }
        catch(error)
        {
            this.#addProcessError("An error occurred while loading the tasks:", error);
        }
    }

    async runTests()
    {
        this.classList.add('running');
        this.toggleAttribute('success', false);

        const inOrder = this.hasAttribute('in-order');

        const beforeHooks = this.#hooks.get(BEFOREALL);
        if(beforeHooks != null)
        {
            for(const [hook, ids] of beforeHooks)
            {
                hook();
            }
        }
        if(inOrder == false)
        {
            const promises = [];
            for(const [id, test] of this.#tests)
            {
                promises.push(this.#runTest(id, test));
            }
            await Promise.all(promises);
        }
        else
        {
            for(const [id, test] of this.#tests)
            {
                await this.#runTest(id, test)
            } 
        }
        const afterHooks = this.#hooks.get(AFTERALL);
        if(afterHooks != null)
        {
            for(const [hook, ids] of afterHooks)
            {
                hook();
            }
        }

        const failedTests = this.shadowRoot!.querySelectorAll('[success="false"]');
        this.setAttribute('success', failedTests.length == 0 ? 'true' : 'false');
        this.classList.remove('running');
    }
    async #runTest(testId: string, test: Test)
    {
        const testElement = this.getElement('tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
        if(testElement == null)
        {
            this.#addProcessError(`Unable to find test element for test: ${testId}`);
            return;
        }
        testElement.toggleAttribute('success', false);
        testElement.classList.add('running');
        
        // clean up old test result
        const errorMessageElement = testElement.querySelector(".error-message");
        if(errorMessageElement != null)
        {
            errorMessageElement.textContent = "";
        }
        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = false;
        }

        // execute test
        let beforeResult;
        let testResult;
        let afterResult;

        try
        {
            const beforeHooks = this.#hooks.get(BEFOREEACH);
            if(beforeHooks != null)
            {
                for(const [hook, ids] of beforeHooks)
                {
                    if(ids.has(testId))
                    {
                        beforeResult = await hook();
                        break;
                    }
                }
            }

            testResult = await test();

            const afterHooks = this.#hooks.get(AFTEREACH);
            if(afterHooks != null)
            {
                for(const [hook, ids] of afterHooks)
                {
                    if(ids.has(testId))
                    {
                        afterResult = await hook();
                        break;
                    }
                }
            }

            if(beforeResult != null)
            {
                this.#handleTestResult(testElement, beforeResult, true);
            }

            this.#handleTestResult(testElement, testResult, true);

            if(afterResult != null)
            {
                this.#handleTestResult(testElement, afterResult, true);
            }

        }
        catch(error)
        {
            this.#handleTestResult(testElement, testResult, false, error as Error);
            console.error(error);
        }
        finally
        {
            testElement?.classList.remove('running');
        }
    }
    #handleTestResult(testElement: HTMLElement, result: TestResultType, finishedTest: boolean, error?: Error)
    {
        if(result instanceof HTMLElement)
        {
            this.#setResult(testElement, result, finishedTest);
        }
        else if(result == undefined)
        {
            this.#setDefaultResult(testElement, finishedTest == true ? 'Passed' : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest);
        }
        else if(typeof result == 'string')
        {
            this.#setDefaultResult(testElement, `${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest);
        }
        else if(typeof result == 'object')
        {
            const objectResult = result as any;
            if(objectResult.success != undefined
            && objectResult.expected != undefined
            && objectResult.value != undefined)
            {
                this.#setDefaultResult(testElement,
                `${(objectResult.success == true) ?'Passed:' : 'Failed:'}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
                objectResult.success);
            }
        }

        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = true;
        }
    }
    async #runHook(testId: string, test: Test)
    {
        const testElement = this.getElement('tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
        if(testElement == null)
        {
            this.#addProcessError(`Unable to find test element for test: ${testId}`);
            return;
        }
        testElement.toggleAttribute('success', false);
        testElement.classList.add('running');
        
        // clean up old test result
        const errorMessageElement = testElement.querySelector(".error-message");
        if(errorMessageElement != null)
        {
            errorMessageElement.textContent = "";
        }
        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = false;
        }

        // execute test
        let beforeResult;
        let testResult;
        let afterResult;

        try
        {
            const beforeHooks = this.#hooks.get(BEFOREEACH);
            if(beforeHooks != null)
            {
                for(const [hook, ids] of beforeHooks)
                {
                    if(ids.has(testId))
                    {
                        beforeResult = await hook();
                        break;
                    }
                }
            }

            testResult = await test();

            const afterHooks = this.#hooks.get(AFTEREACH);
            if(afterHooks != null)
            {
                for(const [hook, ids] of afterHooks)
                {
                    if(ids.has(testId))
                    {
                        afterResult = await hook();
                        break;
                    }
                }
            }

            if(beforeResult != null)
            {
                this.#handleTestResult(testElement, beforeResult, true);
            }

            this.#handleTestResult(testElement, testResult, true);

            if(afterResult != null)
            {
                this.#handleTestResult(testElement, afterResult, true);
            }

        }
        catch(error)
        {
            this.#handleTestResult(testElement, testResult, false, error as Error);
            console.error(error);
        }
        finally
        {
            testElement?.classList.remove('running');
        }
    }
    #handleHookResult(testElement: HTMLElement, result: TestResultType, finishedTest: boolean, error?: Error)
    {
        if(result instanceof HTMLElement)
        {
            this.#setResult(testElement, result, finishedTest);
        }
        else if(result == undefined)
        {
            this.#setDefaultResult(testElement, finishedTest == true ? 'Passed' : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest);
        }
        else if(typeof result == 'string')
        {
            this.#setDefaultResult(testElement, `${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest);
        }
        else if(typeof result == 'object')
        {
            const objectResult = result as any;
            if(objectResult.success != undefined
            && objectResult.expected != undefined
            && objectResult.value != undefined)
            {
                this.#setDefaultResult(testElement,
                `${(objectResult.success == true) ?'Passed:' : 'Failed:'}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
                objectResult.success);
            }
        }

        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = true;
        }
    }

    static create(properties: CodeTestsProperties)
    {
        const element = document.createElement('code-tests');
        console.log(properties);
        return element;
    }

    #tests: Map<string, Test> = new Map();
    #addTest(description: string, test: Test)
    {
        const testId = generateId();
        this.#tests.set(testId, test);
        const testElement = this.#createTest(testId, description);
        this.getElement('tests').append(testElement);
        return testId;
    }
    #createTest(testId: string, description: string)
    {
        const testElement = document.createElement('li');
        testElement.dataset.testId = testId;
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        
        const descriptionElement = document.createElement('span');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;
        summaryElement.append(descriptionElement);

        const runButton = document.createElement('button');
        runButton.classList.add('run');
        runButton.textContent = '⏵';
        runButton.title = "Run Test";
        summaryElement.append(runButton);

        const resultElement = document.createElement('div');
        resultElement.classList.add("result");

        detailsElement.append(summaryElement);
        detailsElement.append(resultElement);

        testElement.append(detailsElement);

        return testElement;
    }

    #setResult(testElement: HTMLElement, valueElement: HTMLElement, success: boolean)
    {
        testElement.setAttribute('success', success == true ? 'true' : 'false');

        const resultElement = testElement.querySelector(`.result`);
        if(resultElement == null)
        {
            this.#addProcessError(`Unable to find result element`);
            return;
        }

        resultElement.innerHTML = '';
        resultElement.appendChild(valueElement);
    }
    #setDefaultResult(testElement: HTMLElement, message: string, success: boolean)
    {    
        const codeElement = document.createElement('code');
        const preElement = document.createElement('pre');
        preElement.textContent = message;
            preElement.classList.add((success == true)
            ? 'success-message'
            : 'error-message');
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
    #addProcessError(message: string, error?: unknown)
    {
        if(error instanceof Error)
        {
            message += `\n${error.message}`;

            console.error(error);
        }
        
        const errorElement = document.createElement('li');
        const codeElement = document.createElement('code');
        const preElement = document.createElement('pre');
        preElement.textContent = message;
        codeElement.append(preElement);
        errorElement.append(codeElement);
        this.getElement('tests').append(errorElement);
    }

    #updateListType(type: 'ordered'|'unordered')
    {
        if(type == 'ordered')
        {
            const list = this.shadowRoot!.querySelector<HTMLElement>('ul');
            if(list == null) { return; }

            const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

            const newList = document.createElement('ol');
            if(items != null)
            {
                newList.append(...items);
            }
            newList.id = 'tests';

            list.replaceWith(newList);
        }
        else
        {
            const list = this.shadowRoot!.querySelector<HTMLElement>('ol');
            if(list == null) { return; }

            const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

            const newList = document.createElement('ul');
            newList.id = 'tests';
            if(items != null)
            {
                newList.append(...items);
            }

            list.replaceWith(newList);
        }
    }

    static observedAttributes = ['in-order'];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string)
    {
        if(attributeName == 'in-order')
        {
            if(newValue == undefined)
            {
                this.#updateListType('unordered');
            }
            else
            {
                this.#updateListType('ordered');
            }
        }
    }
}
/**
* Create a random, locally-unique string value to use as an id
* @returns a `string` id value
*/
function generateId()
{
    const rnd = new Uint8Array(20);
    crypto.getRandomValues(rnd);
    const b64 = [].slice.apply(rnd).map(function(ch) {
        return String.fromCharCode(ch);
    }).join("");
    const secret = btoa(b64).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
    return secret;
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}
export
{ 
    CodeTests,
    expect,
    BEFOREALL,
    BEFOREEACH,
    AFTERALL,
    AFTEREACH
};