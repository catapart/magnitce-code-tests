import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, prompt, Test, TestResultType, Tests  } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

export type CodeTestsProperties = 
{
    
}

export enum HookType
{
    BeforeAll = 'beforeall',
    AfterAll = 'afterall',
    BeforeEach = 'beforeeach',
    AfterEach = 'aftereach',
    RequiredBeforeAny = 'requiredbeforeany',
    RequiredAfterAny = 'requiredafterany',
}

export enum CodeTestEventType
{
    BeforeAll = 'beforeall',
    AfterAll = 'afterall',
    BeforeTest = 'beforetest',
    AfterTest = 'aftertest',
    Cancel = 'cancel',
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

    #hooks: {
        [HookType.BeforeAll]?: Test,
        [HookType.AfterAll]?: Test,
        [HookType.BeforeEach]?: Test,
        [HookType.AfterEach]?: Test,
        [HookType.RequiredBeforeAny]?: Test,
        [HookType.RequiredAfterAny]?: Test,
    } = { };

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
        
        const testsPath = this.#getCurrentTestsPath();
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
                if(this.classList.contains('running'))
                {
                    if(this.classList.contains('canceled')) { return; }
                    this.cancel();
                }
                else
                {
                    this.runTests();
                }
            }
            return;
        }

        const testId = parentListItem.dataset.testId;
        if(testId == null) { return; }
        const test = this.#tests.get(testId);
        if(test == null) { return; }
        
        this.isCanceled = false;
        this.classList.remove('canceled');
        this.part.remove('canceled');
        this.#runTest(testId, test);
    }

    #getCurrentTestsPath()
    {
        return this.getAttribute('src')
        ?? this.getAttribute('test')
        ?? this.getAttribute('tests')
        ?? this.getAttribute('run')
        ?? this.getAttribute('path');
    }


    async loadTests(testsPath?: string)
    {
        const path = testsPath ?? this.#getCurrentTestsPath();
        if(path == null) { return; }
        
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

            const beforeAll = tests[HookType.BeforeAll];
            if(beforeAll != null)
            {
                this.#hooks[HookType.BeforeAll] = beforeAll;
                delete tests[HookType.BeforeAll];

                this.classList.add('has-before-hook');
            }
            const afterAll = tests[HookType.AfterAll];
            if(afterAll != null)
            {
                this.#hooks[HookType.AfterAll] = beforeAll;
                delete tests[HookType.AfterAll];
                this.classList.add('has-after-hook');
            }
            const beforeEach = tests[HookType.BeforeEach];
            if(beforeEach != null)
            {
                this.#hooks[HookType.BeforeEach] = beforeAll;
                delete tests[HookType.BeforeEach];
            }
            const afterEach = tests[HookType.AfterEach];
            if(afterEach != null)
            {
                this.#hooks[HookType.AfterEach] = beforeAll;
                delete tests[HookType.AfterEach];
            }
            const requiredBeforeAny = tests[HookType.RequiredBeforeAny];
            if(requiredBeforeAny != null)
            {
                this.#hooks[HookType.RequiredBeforeAny] = requiredBeforeAny;
                delete tests[HookType.RequiredBeforeAny];
                this.classList.add('has-required-before-hook');
                this.part.add('has-required-before-hook');
            }
            const requiredAfterAny = tests[HookType.RequiredAfterAny];
            if(requiredAfterAny != null)
            {
                this.#hooks[HookType.RequiredAfterAny] = requiredAfterAny;
                delete tests[HookType.RequiredAfterAny];
                this.classList.add('has-required-after-hook');
                this.part.add('has-required-after-hook');
            }

            for(const [description, test] of Object.entries(tests))
            {
                this.#addTest(description, test);
            }
        }
        catch(error)
        {
            this.#addProcessError("An error occurred while loading the tasks:", error);
        }
    }

    isCanceled: boolean = false;
    cancel()
    {
        this.isCanceled = true;
        this.classList.add('canceled');
        this.part.add('canceled');

        this.dispatchEvent(new CustomEvent(CodeTestEventType.Cancel, { bubbles: true, composed: true }));
    }

    async runTests()
    {
        this.dispatchEvent(new CustomEvent(CodeTestEventType.BeforeAll, { bubbles: true, composed: true }));
        this.#continueRunningTests = true;
        this.classList.add('running');
        this.isCanceled = false;
        this.classList.remove('canceled');
        this.part.remove('canceled');
        this.toggleAttribute('success', false);

        const playButtonLabel = this.findElement('play-button-label');
        if(playButtonLabel != null)
        {
            playButtonLabel.textContent = "Cancel";
        }

        this.#clearTestStatuses();

        const inOrder = this.hasAttribute('in-order');

        const requiredBeforeHook = this.#hooks[HookType.RequiredBeforeAny];
        if(requiredBeforeHook != null)
        {
            let hookResult;
            try
            {
                const requiredBeforeAnyHookElement = this.getElement(`required-before-any-details`);
                requiredBeforeAnyHookElement.classList.add('running');
                requiredBeforeAnyHookElement.part.add('running');

                //@ts-expect-error ts doesn't understand that this value can change while awaiting
                if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

                this.#handleHookResult(hookResult, true, 'before', true);
                requiredBeforeAnyHookElement.part.remove('running');
                requiredBeforeAnyHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'before', true, error as Error);
                console.error(error);
                this.#continueRunningTests = false;
                this.classList.remove('running');
                this.part.remove('running');
                if(playButtonLabel != null)
                {
                    playButtonLabel.textContent = "Run Tests";
                }
                this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
                return;
            }
        }

        const beforeHook = this.#hooks[HookType.BeforeAll]
        if(beforeHook != null)
        {
            let hookResult;
            try
            {
                const beforeAllHookElement = this.getElement(`before-all-details`);
                beforeAllHookElement.classList.add('running');
                beforeAllHookElement.part.add('running');

                //@ts-expect-error ts doesn't understand that this value can change while awaiting
                if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                hookResult = await beforeHook(this, beforeAllHookElement);

                this.#handleHookResult(hookResult, true, 'before', false);
                beforeAllHookElement.part.remove('running');
                beforeAllHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'before', false, error as Error);
                console.error(error);
                this.#continueRunningTests = false;
                this.classList.remove('running');
                this.part.remove('running');
                if(playButtonLabel != null)
                {
                    playButtonLabel.textContent = "Run Tests";
                }
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
                await this.#runTest(id, test, false);
            } 
        }
        //@ts-expect-error ts doesn't understand that runTest can change this value?
        if(this.#continueRunningTests == false)
        { 
            this.classList.remove('running');
            this.part.remove('running');
            if(playButtonLabel != null)
            {
                playButtonLabel.textContent = "Run Tests";
            }
            this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
            return;
        }

        const afterHook = this.#hooks[HookType.AfterAll];
        if(afterHook != null)
        {
            let hookResult;
            try
            {
                const afterAllHookElement = this.getElement(`after-all-details`);
                afterAllHookElement.classList.add('running');
                afterAllHookElement.part.add('running');
                
                //@ts-expect-error ts doesn't understand that this value can change while awaiting
                if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                hookResult = await afterHook(this, afterAllHookElement);
                this.#handleHookResult(hookResult, true, 'after', false);

                afterAllHookElement.part.remove('running');
                afterAllHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'after', false, error as Error);
                console.error(error);

                
                const requiredAfterHook = this.#hooks[HookType.RequiredAfterAny];
                if(requiredAfterHook != null)
                {
                    let hookResult;
                    try
                    {
                        const requiredAfterAnyHookElement = this.getElement(`required-after-any-details`);
                        requiredAfterAnyHookElement.classList.add('running');
                        requiredAfterAnyHookElement.part.add('running');

                        //@ts-expect-error ts doesn't understand that this value can change while awaiting
                        if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                        hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

                        this.#handleHookResult(hookResult, true, 'after', true);
                        requiredAfterAnyHookElement.part.remove('running');
                        requiredAfterAnyHookElement.classList.remove('running');
                    }
                    catch(error)
                    {
                        this.#handleHookResult(hookResult, false, 'after', true, error as Error);
                        console.error(error);
                    }
                }

                this.#continueRunningTests = false;
                this.classList.remove('running');
                this.part.remove('running');
                if(playButtonLabel != null)
                {
                    playButtonLabel.textContent = "Run Tests";
                }
                this.dispatchEvent(new CustomEvent(CodeTestEventType.AfterAll, { bubbles: true, composed: true }));
                return;
            }
        }        

        const requiredAfterHook = this.#hooks[HookType.RequiredAfterAny];
        if(requiredAfterHook != null)
        {
            let hookResult;
            try
            {
                const requiredAfterAnyHookElement = this.getElement(`required-after-any-details`);
                requiredAfterAnyHookElement.classList.add('running');
                requiredAfterAnyHookElement.part.add('running');

                //@ts-expect-error ts doesn't understand that this value can change while awaiting
                if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

                this.#handleHookResult(hookResult, true, 'after', true);
                requiredAfterAnyHookElement.part.remove('running');
                requiredAfterAnyHookElement.classList.remove('running');
            }
            catch(error)
            {
                this.#handleHookResult(hookResult, false, 'after', true, error as Error);
                console.error(error);
                this.#continueRunningTests = false;
            }
        }

        const failedTests = this.shadowRoot!.querySelectorAll('[success="false"]');
        this.setAttribute('success', failedTests.length == 0 ? 'true' : 'false');
        this.classList.remove('running');
        this.part.remove('running');
        if(playButtonLabel != null)
        {
            playButtonLabel.textContent = "Run Tests";
        }
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
    async #runTest(testId: string, test: Test, handleRequiredTests: boolean = true)
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

            if(handleRequiredTests == true)
            {
                const requiredBeforeHook = this.#hooks[HookType.RequiredBeforeAny];
                if(requiredBeforeHook != null)
                {
                    let hookResult;
                    try
                    {
                        const requiredBeforeAnyHookElement = this.getElement(`required-before-any-details`);
                        requiredBeforeAnyHookElement.classList.add('running');
                        requiredBeforeAnyHookElement.part.add('running');

                        if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                        hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

                        this.#handleHookResult(hookResult, true, 'before', true);
                        requiredBeforeAnyHookElement.part.remove('running');
                        requiredBeforeAnyHookElement.classList.remove('running');
                    }
                    catch(error)
                    {
                        this.#handleHookResult(hookResult, true, 'before', true, error as Error);
                        console.error(error);
                        this.#continueRunningTests = false;
                        return;
                    }
                }
            }

            if(this.#continueRunningTests == false) { throw new Error("Tests have been disabled from continuing to run."); }

            if(allowTest == false || this.isCanceled == true) { throw new Error("Test has been cancelled"); }
            const beforeHook = this.#hooks[HookType.BeforeEach];
            if(beforeHook != null)
            {
                beforeResult = await beforeHook(this, testElement);
            }

            //@ts-expect-error - test can be cancelled while async functions run
            if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
            testResult = await test(this, testElement);

            //@ts-expect-error - test can be cancelled while async functions run
            if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
            const afterHook = this.#hooks[HookType.AfterEach];
            if(afterHook != null)
            {
                afterResult = await afterHook(this, testElement);
            }
            
            if(handleRequiredTests == true)
            {
                const requiredAfterHook = this.#hooks[HookType.RequiredAfterAny];
                if(requiredAfterHook != null)
                {
                    let hookResult;
                    try
                    {
                        const requiredBeforeAnyHookElement = this.getElement(`required-before-any-details`);
                        requiredBeforeAnyHookElement.classList.add('running');
                        requiredBeforeAnyHookElement.part.add('running');

                        //@ts-expect-error ts doesn't understand that this value can change while awaiting
                        if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
                        hookResult = await requiredAfterHook(this, requiredBeforeAnyHookElement);

                        this.#handleHookResult(hookResult, true, 'after', true);
                        requiredBeforeAnyHookElement.part.remove('running');
                        requiredBeforeAnyHookElement.classList.remove('running');
                    }
                    catch(error)
                    {
                        this.#handleHookResult(hookResult, true, 'after', true, error as Error);
                        console.error(error);
                        this.#continueRunningTests = false;
                        return;
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
    #handleHookResult(result: TestResultType, finishedTest: boolean, beforeOrAfter: 'before'|'after', required: boolean, error?: Error)
    {
        if(result instanceof HTMLElement)
        {
            this.#setHookResult(result, finishedTest, beforeOrAfter, required);
        }
        else 
        {
            let defaultResult: HTMLElement;
            if(result == undefined)
            {
                defaultResult = this.#createDefaultResult(finishedTest == true ? 'Hook Ran Successfully' : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest);
                this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
            }
            else if(typeof result == 'string')
            {
                defaultResult = this.#createDefaultResult(`${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest);
                this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
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
                    this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
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
        // console.log(properties);
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
    #setHookResult(valueElement: HTMLElement, success: boolean, beforeOrAfter: 'before'|'after', required: boolean)
    {
        const selector = (required == true)
        ? `required-${beforeOrAfter}-any`
        : `${beforeOrAfter}-all`;
        const detailsElement = this.getElement(`${selector}-details`);
        const resultsElement = this.getElement(`${selector}-results`);
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
    prompt
};