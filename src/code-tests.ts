import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { AFTERALL, AFTEREACH, BEFOREALL, BEFOREEACH, CodeTests, expect, Test, TestResultType, Tests } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

export type CodeTestsProperties = 
{
    
}

export enum CodeTestEventType
{
    BeforeAll = 'beforeall',
    AfterAll = 'afterall',
    BeforeTest = 'beforetest',
    AfterTest = 'aftertest',
}

const NOTESTDEFINED = Symbol('No Test Defined');

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

    #continueRunningTests: boolean = true;

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
        assignClassAndIdToPart(this.shadowRoot!);
        this.addEventListener('click', this.#boundClickHandler);

        if(this.getAttribute('auto') == 'false') { return; }
        
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
            this.getElement('tests').innerHTML = '';
            this.#tests.clear();
            this.classList.remove('has-before-hook');
            this.classList.remove('has-after-hook');

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

                this.classList.add('has-before-hook');
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
                this.classList.add('has-after-hook');
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

            // cancel test
            // after all hook doesn't reset on runTests start

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
        this.dispatchEvent(new CustomEvent(CodeTestEventType.BeforeAll, { bubbles: true, composed: true }));
        this.#continueRunningTests = true;
        this.classList.add('running');
        this.toggleAttribute('success', false);

        this.#clearTestStatuses();

        const inOrder = this.hasAttribute('in-order');

        const beforeHooks = this.#hooks.get(BEFOREALL);
        if(beforeHooks != null)
        {
            let hookResult;
            try
            {
                const beforeAllHookElement = this.getElement(`before-all-details`);
                beforeAllHookElement.classList.add('running');
                beforeAllHookElement.part.add('running');
                for(const [hook, ids] of beforeHooks)
                {
                    hookResult = await hook();
                    this.#handleHookResult(hookResult, true, 'before');
                }
                beforeAllHookElement.part.remove('running');
                beforeAllHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'before', error as Error);
                console.error(error);
                this.#continueRunningTests = false;
                this.classList.remove('running');
                this.part.remove('running');
                this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
                return;
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
                //@ts-expect-error ts doesn't understand that runTest can change this value?
                if(this.#continueRunningTests == false) { break; }
                await this.#runTest(id, test)
            } 
        }
        //@ts-expect-error ts doesn't understand that runTest can change this value?
        if(this.#continueRunningTests == false)
        { 
            this.classList.remove('running');
            this.part.remove('running');
            this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
            return;
        }
        const afterHooks = this.#hooks.get(AFTERALL);
        if(afterHooks != null)
        {
            let hookResult;
            try
            {
                const afterAllHookElement = this.getElement(`after-all-details`);
                afterAllHookElement.classList.add('running');
                afterAllHookElement.part.add('running');
                for(const [hook, ids] of afterHooks)
                {
                    hookResult = await hook();
                    this.#handleHookResult(hookResult, true, 'after');
                }
                afterAllHookElement.part.remove('running');
                afterAllHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'after', error as Error);
                console.error(error);
                this.#continueRunningTests = false;
                this.classList.remove('running');
                this.part.remove('running');
                this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
                return;
            }
        }

        const failedTests = this.shadowRoot!.querySelectorAll('[success="false"]');
        this.setAttribute('success', failedTests.length == 0 ? 'true' : 'false');
        this.classList.remove('running');
        this.part.remove('running');
        this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
    }
    #clearTestStatuses()
    {
        for(const [testId, test] of this.#tests)
        {
            const testElement = this.getElement('tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
            if(testElement == null)
            {
                this.#addProcessError(`Unable to find test element for test: ${testId}`);
                return;
            }
            
            testElement.toggleAttribute('success', false);
            testElement.classList.remove('success', 'fail');
            testElement.part.remove('success', 'fail');
        } 

        const beforeAllHookElement = this.getElement(`before-all-details`);
        beforeAllHookElement.toggleAttribute('success', false);
        beforeAllHookElement.classList.remove('success', 'fail');
        beforeAllHookElement.part.remove('success', 'fail');
        
        const afterAllHookElement = this.getElement(`after-all-details`);
        afterAllHookElement.toggleAttribute('success', false);
        afterAllHookElement.classList.remove('success', 'fail');
        afterAllHookElement.part.remove('success', 'fail');
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
        testElement.part.add('running');
        testElement.classList.remove('success', 'fail');
        testElement.part.remove('success', 'fail');

        const iconElement = testElement.querySelector('.result-icon');
        iconElement?.classList.remove('success', 'fail');
        iconElement?.part.remove('success', 'fail');
        iconElement?.classList.add('running');
        iconElement?.part.add('running');
        
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
        let beforeResult: TestResultType|typeof NOTESTDEFINED = NOTESTDEFINED;
        let testResult;
        let afterResult: TestResultType|typeof NOTESTDEFINED = NOTESTDEFINED;

        let testType: 'before'|'after'|undefined;
        try
        {
            const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEventType.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));

            if(allowTest == true)
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
                
                testType = 'before';
                if(beforeResult != NOTESTDEFINED) // can't use undefined or null because those are valid result types
                {
                    this.#handleTestResult(testElement, beforeResult, true, undefined, testType);
                }

                testType = undefined;
                this.#handleTestResult(testElement, testResult, true, undefined, testType);

                testType = 'after';
                if(afterResult != NOTESTDEFINED) // can't use undefined or null because those are valid result types
                {
                    this.#handleTestResult(testElement, afterResult, true, undefined, testType);
                }
            }

        }
        catch(error)
        {
            this.#handleTestResult(testElement, testResult, false, error as Error, testType);
            console.error(error);
            this.#continueRunningTests = false;
        }
        finally
        {
            testElement?.classList.remove('running');
            testElement?.part.remove('running');
            
            iconElement?.classList.remove('running');
            iconElement?.part.remove('running');

            this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));
        }
    }
    #handleTestResult(testElement: HTMLElement, result: TestResultType, finishedTest: boolean, error?: Error, beforeOrAfter?: 'before'|'after')
    {
        if(result instanceof HTMLElement)
        {
            this.#setTestResult(testElement, result, finishedTest, beforeOrAfter);
        }
        else if(result == undefined)
        {
            const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Hook Ran Successfully';
            const defaultResult = this.#createDefaultResult(finishedTest == true ? `${trueMessage}` : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest, beforeOrAfter);
            this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
        }
        else if(typeof result == 'string')
        {
            const defaultResult = this.#createDefaultResult(`${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest, beforeOrAfter);
            this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
        }
        else if(typeof result == 'object')
        {
            const objectResult = result as any;
            if(objectResult.success != undefined
            && objectResult.expected != undefined
            && objectResult.value != undefined)
            {
                const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Success';
                const falseMessage = (beforeOrAfter == undefined) ? 'Failed' : 'Fail';
                const defaultResult = this.#createDefaultResult(
                `${(objectResult.success == true) ? `${trueMessage}:` : `${falseMessage}:`}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
                objectResult.success,
                beforeOrAfter);
                this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
            }
        }

        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = true;
        }
    }
    #handleHookResult(result: TestResultType, finishedTest: boolean, beforeOrAfter: 'before'|'after', error?: Error)
    {
        if(result instanceof HTMLElement)
        {
            this.#setHookResult(result, finishedTest, beforeOrAfter);
        }
        else 
        {
            let defaultResult: HTMLElement;
            if(result == undefined)
            {
                defaultResult = this.#createDefaultResult(finishedTest == true ? 'Hook Ran Successfully' : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest);
                this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
            }
            else if(typeof result == 'string')
            {
                defaultResult = this.#createDefaultResult(`${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest);
                this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
            }
            else if(typeof result == 'object')
            {
                const objectResult = result as any;
                if(objectResult.success != undefined
                && objectResult.expected != undefined
                && objectResult.value != undefined)
                {
                    defaultResult = this.#createDefaultResult(
                        `${(objectResult.success == true) ?'Success:' : 'Fail:'}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
                        objectResult.success
                    );
                    this.#setHookResult(defaultResult, finishedTest, beforeOrAfter);
                }
            }
        }

        const detailsElement = this.getElement<HTMLDetailsElement>(`${beforeOrAfter}-all-details`);
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
        testElement.classList.add('test');
        testElement.part.add('test');
        const detailsElement = document.createElement('details');
        detailsElement.classList.add('test-details');
        detailsElement.part.add('test-details');
        const summaryElement = document.createElement('summary');
        summaryElement.classList.add('test-summary');
        summaryElement.part.add('test-summary');

        const resultIcon = document.createElement('div');
        resultIcon.classList.add('result-icon');
        resultIcon.part.add('result-icon');
        summaryElement.append(resultIcon);
        
        const descriptionElement = document.createElement('span');
        descriptionElement.classList.add('description', 'test-description');
        descriptionElement.textContent = description;
        summaryElement.append(descriptionElement);

        const runButton = document.createElement('button');
        runButton.classList.add('run', 'test-run');
        runButton.part.add('run', 'test-run');
        runButton.textContent = 'Run Test';
        runButton.title = "Run Test";
        summaryElement.append(runButton);

        const beforeResultElement = document.createElement('div');
        beforeResultElement.classList.add("before-result", 'test-before-result');
        beforeResultElement.part.add("before-result", 'test-before-result');
        const resultElement = document.createElement('div');
        resultElement.classList.add("result", 'test-result');
        resultElement.part.add("result", 'test-result');
        const afterResultElement = document.createElement('div');
        afterResultElement.classList.add("after-result", 'test-after-result');
        afterResultElement.part.add("after-result", 'test-after-result');

        detailsElement.append(summaryElement);
        detailsElement.append(beforeResultElement);
        detailsElement.append(resultElement);
        detailsElement.append(afterResultElement);

        testElement.append(detailsElement);

        return testElement;
    }

    #setTestResult(testElement: HTMLElement, valueElement: HTMLElement, success: boolean, beforeOrAfter?: 'before'|'after')
    {
        testElement.setAttribute('success', success == true ? 'true' : 'false');
        testElement.classList.toggle('success', success);
        testElement.part.toggle('success', success);
        testElement.classList.toggle('fail', !success);
        testElement.part.toggle('fail', !success);
        
        const iconElement = testElement.querySelector('.result-icon');
        iconElement?.classList.toggle('success', success);
        iconElement?.part.toggle('success', success);
        iconElement?.classList.toggle('fail', !success);
        iconElement?.part.toggle('fail', !success);

        const resultElement = testElement.querySelector(`.${beforeOrAfter == undefined
        ? 'result'
        : beforeOrAfter == 'before'
        ? 'before-result'
        : 'after-result'}`);
        if(resultElement == null)
        {
            this.#addProcessError(`Unable to find result element`);
            return;
        }

        resultElement.innerHTML = '';
        resultElement.appendChild(valueElement);
    }
    #createDefaultResult(message: string, success: boolean, beforeOrAfter?: 'before'|'after')
    {    
        const codeElement = document.createElement('code');
        codeElement.classList.add('code');
        codeElement.part.add('code');
        const preElement = document.createElement('pre');
        preElement.textContent = message;
        const className = (success == true)
        ? 'success-message'
        : 'error-message';
        preElement.classList.add('pre', className);
        preElement.part.add('pre', className);
        codeElement.appendChild(preElement);
        return codeElement;
    }
    #setHookResult(valueElement: HTMLElement, success: boolean, beforeOrAfter: 'before'|'after')
    {
        const detailsElement = this.getElement(`${beforeOrAfter}-all-details`);
        const resultsElement = this.getElement(`${beforeOrAfter}-all-results`);
        detailsElement.setAttribute('success', success == true ? 'true' : 'false');
        detailsElement.classList.toggle('success', success);
        detailsElement.part.toggle('success', success);
        detailsElement.classList.toggle('fail', !success);
        detailsElement.part.toggle('fail', !success);

        resultsElement.innerHTML = '';
        resultsElement.appendChild(valueElement);
    }
    #addProcessError(message: string, error?: unknown)
    {
        if(error instanceof Error)
        {
            message += `\n${error.message}`;

            console.error(error);
        }
        
        const errorElement = document.createElement('li');
        errorElement.classList.add('error', 'process-error');
        errorElement.part.add('error', 'process-error');
        const codeElement = document.createElement('code');
        codeElement.classList.add('code', 'process-error-code');
        codeElement.part.add('code', 'process-error-code');
        const preElement = document.createElement('pre');
        preElement.classList.add('pre', 'process-error-pre');
        preElement.part.add('pre', 'process-error-pre');
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