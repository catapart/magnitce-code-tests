import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, prompt  } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

import './components/run-button/run-button';
import { RunButton } from './components/run-button/run-button';
import { TestManager } from './managers/test.manager';
import { ContextManager } from './managers/context.manager';

export type CodeTestsProperties = 
{
    
}

export const Hook = 
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeEach: 'beforeeach',
    AfterEach: 'aftereach',
    RequiredBeforeAny: 'requiredbeforeany',
    RequiredAfterAny: 'requiredafterany',
} as const;
export type HookType = typeof Hook[keyof typeof Hook];

export const CodeTestEvent =
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeTest: 'beforetest',
    AfterTest: 'aftertest',
    Cancel: 'cancel',
}
export type CodeTestEventType = typeof CodeTestEvent[keyof typeof CodeTestEvent];

const NOTESTDEFINED = Symbol('No Test Defined');

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'code-tests';
export class CodeTestsElement extends HTMLElement
{
    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }

    // #hooks: {
    //     [Hook.BeforeAll]?: Test,
    //     [Hook.AfterAll]?: Test,
    //     [Hook.BeforeEach]?: Test,
    //     [Hook.AfterEach]?: Test,
    //     [Hook.RequiredBeforeAny]?: Test,
    //     [Hook.RequiredAfterAny]?: Test,
    // } = { };

    #continueRunningTests: boolean = true;

    #contextManager: ContextManager;

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.#boundClickHandler = this.#onClick.bind(this);

        this.#contextManager = new ContextManager(this);
    }
    
    connectedCallback()
    {
        this.#init();
    }
    disconnectedCallback()
    {
        this.#destroy();
    }

    #isInitialized: boolean = false;
    async #init()
    {
        if(this.#isInitialized == true) { return; }

        await this.#initManagers();
        await this.#initComponents();
        await this.#initHandlers();

        this.#isInitialized = true;

        if(this.getAttribute('auto') == 'false') { return; }
        const testsPath = this.#getCurrentTestsPath();
        this.#contextManager.loadTests(testsPath);
    }
    async #initManagers()
    {
        
    }
    async #initComponents()
    {
        // const runAllButton = this.findElement<RunButton>('#run-all-button');
    }
    async #initHandlers()
    {
        this.addEventListener('click', this.#boundClickHandler);
    }
    #destroy()
    {
        this.removeEventListener('click', this.#boundClickHandler);
    }

    #boundClickHandler!: (event: Event) => void;
    #onClick(event: Event)
    {
        const runAllButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.id == 'run-all-button') as HTMLButtonElement;
        if(runAllButton != null)
        {
            console.log(runAllButton);
            return;
        }
        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run-test-button')) as HTMLButtonElement;
        console.log(runButton);

        // const parentListItem = runButton.closest('li');
        // if(parentListItem == null)
        // {

        //     const isRunAll = runButton.hasAttribute('data-all');
        //     if(isRunAll == true)
        //     { 
        //         if(this.classList.contains('running'))
        //         {
        //             if(this.classList.contains('canceled')) { return; }
        //             this.cancel();
        //         }
        //         else
        //         {
        //             this.runTests();
        //         }
        //     }
        //     return;
        // }

        // const testId = parentListItem.dataset.testId;
        // if(testId == null) { return; }
        // const test = this.#tests.get(testId);
        // if(test == null) { return; }
        
        // this.isCanceled = false;
        // this.classList.remove('canceled');
        // this.part.remove('canceled');
        // this.#runTest(testId, test);
    }

    #getCurrentTestsPath()
    {
        return this.getAttribute('src')
        ?? this.getAttribute('test')
        ?? this.getAttribute('tests')
        ?? this.getAttribute('run')
        ?? this.getAttribute('path')
        ?? undefined;
    }



    // isCanceled: boolean = false;
    // cancel()
    // {
    //     this.isCanceled = true;
    //     this.classList.add('canceled');
    //     this.part.add('canceled');

    //     this.dispatchEvent(new CustomEvent(CodeTestEvent.Cancel, { bubbles: true, composed: true }));
    // }

    // async runTests()
    // {
    //     this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeAll, { bubbles: true, composed: true }));
    //     this.#continueRunningTests = true;
    //     this.classList.add('running');
    //     this.isCanceled = false;
    //     this.classList.remove('canceled');
    //     this.part.remove('canceled');
    //     this.toggleAttribute('success', false);

    //     const playButtonLabel = this.findElement('play-button-label');
    //     if(playButtonLabel != null)
    //     {
    //         playButtonLabel.textContent = "Cancel";
    //     }

    //     this.#clearTestStatuses();

    //     const inOrder = this.hasAttribute('in-order');

    //     const requiredBeforeHook = this.#hooks[Hook.RequiredBeforeAny];
    //     if(requiredBeforeHook != null)
    //     {
    //         let hookResult;
    //         try
    //         {
    //             const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
    //             requiredBeforeAnyHookElement.classList.add('running');
    //             requiredBeforeAnyHookElement.part.add('running');

    //             //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //             hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

    //             this.#handleHookResult(hookResult, true, 'before', true);
    //             requiredBeforeAnyHookElement.part.remove('running');
    //             requiredBeforeAnyHookElement.classList.remove('running');
    //         }
    //         catch(error)
    //         {
    //             this.#handleHookResult(hookResult, false, 'before', true, error as Error);
    //             console.error(error);
    //             this.#continueRunningTests = false;
    //             this.classList.remove('running');
    //             this.part.remove('running');
    //             if(playButtonLabel != null)
    //             {
    //                 playButtonLabel.textContent = "Run Tests";
    //             }
    //             this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    //             return;
    //         }
    //     }

    //     const beforeHook = this.#hooks[Hook.BeforeAll]
    //     if(beforeHook != null)
    //     {
    //         let hookResult;
    //         try
    //         {
    //             const beforeAllHookElement = this.findElement(`#before-all-details`);
    //             beforeAllHookElement.classList.add('running');
    //             beforeAllHookElement.part.add('running');

    //             //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //             hookResult = await beforeHook(this, beforeAllHookElement);

    //             this.#handleHookResult(hookResult, true, 'before', false);
    //             beforeAllHookElement.part.remove('running');
    //             beforeAllHookElement.classList.remove('running');
    //         }
    //         catch(error)
    //         {
    //             this.#handleHookResult(hookResult, false, 'before', false, error as Error);
    //             console.error(error);
    //             this.#continueRunningTests = false;
    //             this.classList.remove('running');
    //             this.part.remove('running');
    //             if(playButtonLabel != null)
    //             {
    //                 playButtonLabel.textContent = "Run Tests";
    //             }
    //             this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    //             return;
    //         }
    //     }

    //     if(inOrder == false)
    //     {
    //         const promises = [];
    //         for(const [id, test] of this.#tests)
    //         {
    //             promises.push(this.#runTest(id, test));
    //         }
    //         await Promise.all(promises);
    //     }
    //     else
    //     {
    //         for(const [id, test] of this.#tests)
    //         {
    //             //@ts-expect-error ts doesn't understand that runTest can change this value?
    //             if(this.#continueRunningTests == false) { break; }
    //             await this.#runTest(id, test, false);
    //         } 
    //     }
    //     //@ts-expect-error ts doesn't understand that runTest can change this value?
    //     if(this.#continueRunningTests == false)
    //     { 
    //         this.classList.remove('running');
    //         this.part.remove('running');
    //         if(playButtonLabel != null)
    //         {
    //             playButtonLabel.textContent = "Run Tests";
    //         }
    //         this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    //         return;
    //     }

    //     const afterHook = this.#hooks[Hook.AfterAll];
    //     if(afterHook != null)
    //     {
    //         let hookResult;
    //         try
    //         {
    //             const afterAllHookElement = this.findElement(`#after-all-details`);
    //             afterAllHookElement.classList.add('running');
    //             afterAllHookElement.part.add('running');
                
    //             //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //             hookResult = await afterHook(this, afterAllHookElement);
    //             this.#handleHookResult(hookResult, true, 'after', false);

    //             afterAllHookElement.part.remove('running');
    //             afterAllHookElement.classList.remove('running');
    //         }
    //         catch(error)
    //         {
    //             this.#handleHookResult(hookResult, false, 'after', false, error as Error);
    //             console.error(error);

                
    //             const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
    //             if(requiredAfterHook != null)
    //             {
    //                 let hookResult;
    //                 try
    //                 {
    //                     const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
    //                     requiredAfterAnyHookElement.classList.add('running');
    //                     requiredAfterAnyHookElement.part.add('running');

    //                     //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //                     if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //                     hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

    //                     this.#handleHookResult(hookResult, true, 'after', true);
    //                     requiredAfterAnyHookElement.part.remove('running');
    //                     requiredAfterAnyHookElement.classList.remove('running');
    //                 }
    //                 catch(error)
    //                 {
    //                     this.#handleHookResult(hookResult, false, 'after', true, error as Error);
    //                     console.error(error);
    //                 }
    //             }

    //             this.#continueRunningTests = false;
    //             this.classList.remove('running');
    //             this.part.remove('running');
    //             if(playButtonLabel != null)
    //             {
    //                 playButtonLabel.textContent = "Run Tests";
    //             }
    //             this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    //             return;
    //         }
    //     }        

    //     const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
    //     if(requiredAfterHook != null)
    //     {
    //         let hookResult;
    //         try
    //         {
    //             const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
    //             requiredAfterAnyHookElement.classList.add('running');
    //             requiredAfterAnyHookElement.part.add('running');

    //             //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //             hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

    //             this.#handleHookResult(hookResult, true, 'after', true);
    //             requiredAfterAnyHookElement.part.remove('running');
    //             requiredAfterAnyHookElement.classList.remove('running');
    //         }
    //         catch(error)
    //         {
    //             this.#handleHookResult(hookResult, false, 'after', true, error as Error);
    //             console.error(error);
    //             this.#continueRunningTests = false;
    //         }
    //     }

    //     const failedTests = this.shadowRoot!.querySelectorAll('[success="false"]');
    //     this.setAttribute('success', failedTests.length == 0 ? 'true' : 'false');
    //     this.classList.remove('running');
    //     this.part.remove('running');
    //     if(playButtonLabel != null)
    //     {
    //         playButtonLabel.textContent = "Run Tests";
    //     }
    //     this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    // }
    // #clearTestStatuses()
    // {
    //     for(const [testId, _test] of this.#tests)
    //     {
    //         const testElement = this.findElement('#tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
    //         if(testElement == null)
    //         {
    //             this.#addProcessError(`Unable to find test element for test: ${testId}`);
    //             return;
    //         }
            
    //         testElement.toggleAttribute('success', false);
    //         testElement.classList.remove('success', 'fail');
    //         testElement.part.remove('success', 'fail');
    //     } 

    //     const beforeAllHookElement = this.findElement(`#before-all-details`);
    //     beforeAllHookElement.toggleAttribute('success', false);
    //     beforeAllHookElement.classList.remove('success', 'fail');
    //     beforeAllHookElement.part.remove('success', 'fail');
        
    //     const afterAllHookElement = this.findElement(`#after-all-details`);
    //     afterAllHookElement.toggleAttribute('success', false);
    //     afterAllHookElement.classList.remove('success', 'fail');
    //     afterAllHookElement.part.remove('success', 'fail');
    // }
    // async #runTest(testId: string, test: Test, handleRequiredTests: boolean = true)
    // {
    //     const testElement = this.findElement('#tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
    //     if(testElement == null)
    //     {
    //         this.#addProcessError(`Unable to find test element for test: ${testId}`);
    //         return;
    //     }
    //     testElement.toggleAttribute('success', false);
    //     testElement.classList.add('running');
    //     testElement.part.add('running');
    //     testElement.classList.remove('success', 'fail');
    //     testElement.part.remove('success', 'fail');

    //     const iconElement = testElement.querySelector('.result-icon');
    //     iconElement?.classList.remove('success', 'fail');
    //     iconElement?.part.remove('success', 'fail');
    //     iconElement?.classList.add('running');
    //     iconElement?.part.add('running');
        
    //     // clean up old test result
    //     const errorMessageElement = testElement.querySelector(".error-message");
    //     if(errorMessageElement != null)
    //     {
    //         errorMessageElement.textContent = "";
    //     }
    //     const detailsElement = testElement.querySelector('details');
    //     if(detailsElement != null)
    //     {
    //         detailsElement.open = false;
    //     }
        

    //     // execute test
    //     let beforeResult: TestResultType|typeof NOTESTDEFINED = NOTESTDEFINED;
    //     let testResult;
    //     let afterResult: TestResultType|typeof NOTESTDEFINED = NOTESTDEFINED;

    //     let testType: 'before'|'after'|undefined;
    //     try
    //     {
    //         const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));

    //         if(handleRequiredTests == true)
    //         {
    //             const requiredBeforeHook = this.#hooks[Hook.RequiredBeforeAny];
    //             if(requiredBeforeHook != null)
    //             {
    //                 let hookResult;
    //                 try
    //                 {
    //                     const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
    //                     requiredBeforeAnyHookElement.classList.add('running');
    //                     requiredBeforeAnyHookElement.part.add('running');

    //                     if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //                     hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

    //                     this.#handleHookResult(hookResult, true, 'before', true);
    //                     requiredBeforeAnyHookElement.part.remove('running');
    //                     requiredBeforeAnyHookElement.classList.remove('running');
    //                 }
    //                 catch(error)
    //                 {
    //                     this.#handleHookResult(hookResult, true, 'before', true, error as Error);
    //                     console.error(error);
    //                     this.#continueRunningTests = false;
    //                     return;
    //                 }
    //             }
    //         }

    //         if(this.#continueRunningTests == false) { throw new Error("Tests have been disabled from continuing to run."); }

    //         if(allowTest == false || this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //         const beforeHook = this.#hooks[Hook.BeforeEach];
    //         if(beforeHook != null)
    //         {
    //             beforeResult = await beforeHook(this, testElement);
    //         }

    //         //@ts-expect-error - test can be cancelled while async functions run
    //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //         testResult = await test(this, testElement);

    //         //@ts-expect-error - test can be cancelled while async functions run
    //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //         const afterHook = this.#hooks[Hook.AfterEach];
    //         if(afterHook != null)
    //         {
    //             afterResult = await afterHook(this, testElement);
    //         }
            
    //         if(handleRequiredTests == true)
    //         {
    //             const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
    //             if(requiredAfterHook != null)
    //             {
    //                 let hookResult;
    //                 try
    //                 {
    //                     const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
    //                     requiredBeforeAnyHookElement.classList.add('running');
    //                     requiredBeforeAnyHookElement.part.add('running');

    //                     //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //                     if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //                     hookResult = await requiredAfterHook(this, requiredBeforeAnyHookElement);

    //                     this.#handleHookResult(hookResult, true, 'after', true);
    //                     requiredBeforeAnyHookElement.part.remove('running');
    //                     requiredBeforeAnyHookElement.classList.remove('running');
    //                 }
    //                 catch(error)
    //                 {
    //                     this.#handleHookResult(hookResult, true, 'after', true, error as Error);
    //                     console.error(error);
    //                     this.#continueRunningTests = false;
    //                     return;
    //                 }
    //             }
    //         }
            
    //         testType = 'before';
    //         if(beforeResult != NOTESTDEFINED) // can't use undefined or null because those are valid result types
    //         {
    //             this.#handleTestResult(testElement, beforeResult, true, undefined, testType);
    //         }

    //         testType = undefined;
    //         this.#handleTestResult(testElement, testResult, true, undefined, testType);

    //         testType = 'after';
    //         if(afterResult != NOTESTDEFINED) // can't use undefined or null because those are valid result types
    //         {
    //             this.#handleTestResult(testElement, afterResult, true, undefined, testType);
    //         }
    //     }
    //     catch(error)
    //     {
    //         this.#handleTestResult(testElement, testResult, false, error as Error, testType);
    //         console.error(error);
    //         this.#continueRunningTests = false;
    //     }
    //     finally
    //     {
    //         testElement?.classList.remove('running');
    //         testElement?.part.remove('running');
            
    //         iconElement?.classList.remove('running');
    //         iconElement?.part.remove('running');

    //         this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement } }));
    //     }
    // }
    // #handleTestResult(testElement: HTMLElement, result: TestResultType, finishedTest: boolean, error?: Error, beforeOrAfter?: 'before'|'after')
    // {
    //     console.log(result);
    //     if(result instanceof HTMLElement)
    //     {
    //         this.#setTestResult(testElement, result, finishedTest, beforeOrAfter);
    //     }
    //     else if(result == undefined)
    //     {
    //         const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Hook Ran Successfully';
    //         const defaultResult = this.#createDefaultResult(finishedTest == true ? `${trueMessage}` : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest, beforeOrAfter);
    //         this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
    //     }
    //     else if(typeof result == 'string')
    //     {
    //         const defaultResult = this.#createDefaultResult(`${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest, beforeOrAfter);
    //         this.#setTestResult(testElement, defaultResult, finishedTest, beforeOrAfter);
    //     }
    //     else if(typeof result == 'object')
    //     {
    //         const objectResult = result as any;
    //         if(objectResult.success != undefined
    //         && objectResult.expected != undefined
    //         && objectResult.value != undefined)
    //         {
    //             const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Success';
    //             const falseMessage = (beforeOrAfter == undefined) ? 'Failed' : 'Fail';
    //             const defaultResult = this.#createDefaultResult(
    //             `${(objectResult.success == true) ? `${trueMessage}:` : `${falseMessage}:`}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
    //             objectResult.success,
    //             beforeOrAfter);
    //             this.#setTestResult(testElement, defaultResult, objectResult.success, beforeOrAfter);
    //         }
    //     }

    //     const detailsElement = testElement.querySelector('details');
    //     if(detailsElement != null)
    //     {
    //         detailsElement.open = true;
    //     }
    // }
    // #handleHookResult(result: TestResultType, finishedTest: boolean, beforeOrAfter: 'before'|'after', required: boolean, error?: Error)
    // {
    //     if(result instanceof HTMLElement)
    //     {
    //         this.#setHookResult(result, finishedTest, beforeOrAfter, required);
    //     }
    //     else 
    //     {
    //         let defaultResult: HTMLElement;
    //         if(result == undefined)
    //         {
    //             defaultResult = this.#createDefaultResult(finishedTest == true ? 'Hook Ran Successfully' : `Failed${(error != null) ? `:\n${error.message}` : ''}`, finishedTest);
    //             this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
    //         }
    //         else if(typeof result == 'string')
    //         {
    //             defaultResult = this.#createDefaultResult(`${result}${error == null ? '' : `:\n${error.message}`}`, finishedTest);
    //             this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
    //         }
    //         else if(typeof result == 'object')
    //         {
    //             const objectResult = result as any;
    //             if(objectResult.success != undefined
    //             && objectResult.expected != undefined
    //             && objectResult.value != undefined)
    //             {
    //                 defaultResult = this.#createDefaultResult(
    //                     `${(objectResult.success == true) ?'Success:' : 'Fail:'}\nExpected:${objectResult.expected}\nResult:${objectResult.value}`,
    //                     objectResult.success
    //                 );
    //                 this.#setHookResult(defaultResult, finishedTest, beforeOrAfter, required);
    //             }
    //         }
    //     }

    //     const detailsElement = this.findElement<HTMLDetailsElement>(`#${beforeOrAfter}-all-details`);
    //     if(detailsElement != null)
    //     {
    //         detailsElement.open = true;
    //     }
    // }

    // static create(_properties: CodeTestsProperties)
    // {
    //     const element = document.createElement('code-tests');
    //     // console.log(properties);
    //     return element;
    // }

    // #setTestResult(testElement: HTMLElement, valueElement: HTMLElement, success: boolean, beforeOrAfter?: 'before'|'after')
    // {
    //     testElement.setAttribute('success', success == true ? 'true' : 'false');
    //     testElement.classList.toggle('success', success);
    //     testElement.part.toggle('success', success);
    //     testElement.classList.toggle('fail', !success);
    //     testElement.part.toggle('fail', !success);
        
    //     const iconElement = testElement.querySelector('.result-icon');
    //     iconElement?.classList.toggle('success', success);
    //     iconElement?.part.toggle('success', success);
    //     iconElement?.classList.toggle('fail', !success);
    //     iconElement?.part.toggle('fail', !success);

    //     const resultElement = testElement.querySelector(`.${beforeOrAfter == undefined
    //     ? 'result'
    //     : beforeOrAfter == 'before'
    //     ? 'before-result'
    //     : 'after-result'}`);
    //     if(resultElement == null)
    //     {
    //         this.#addProcessError(`Unable to find result element`);
    //         return;
    //     }

    //     resultElement.innerHTML = '';
    //     resultElement.appendChild(valueElement);
    // }
    // #createDefaultResult(message: string, success: boolean, _beforeOrAfter?: 'before'|'after')
    // {    
    //     const codeElement = document.createElement('code');
    //     codeElement.classList.add('code');
    //     codeElement.part.add('code');
    //     const preElement = document.createElement('pre');
    //     preElement.textContent = message;
    //     const className = (success == true)
    //     ? 'success-message'
    //     : 'error-message';
    //     preElement.classList.add('pre', className);
    //     preElement.part.add('pre', className);
    //     codeElement.appendChild(preElement);
    //     return codeElement;
    // }
    // #setHookResult(valueElement: HTMLElement, success: boolean, beforeOrAfter: 'before'|'after', required: boolean)
    // {
    //     const selector = (required == true)
    //     ? `required-${beforeOrAfter}-any`
    //     : `${beforeOrAfter}-all`;
    //     const detailsElement = this.findElement(`#${selector}-details`);
    //     const resultsElement = this.findElement(`#${selector}-results`);
    //     detailsElement.setAttribute('success', success == true ? 'true' : 'false');
    //     detailsElement.classList.toggle('success', success);
    //     detailsElement.part.toggle('success', success);
    //     detailsElement.classList.toggle('fail', !success);
    //     detailsElement.part.toggle('fail', !success);

    //     resultsElement.innerHTML = '';
    //     resultsElement.appendChild(valueElement);
    // }
    // #addProcessError(message: string, error?: unknown)
    // {
    //     if(error instanceof Error)
    //     {
    //         message += `\n${error.message}`;

    //         console.error(error);
    //     }
        
    //     const errorElement = document.createElement('li');
    //     errorElement.classList.add('error', 'process-error');
    //     errorElement.part.add('error', 'process-error');
    //     const codeElement = document.createElement('code');
    //     codeElement.classList.add('code', 'process-error-code');
    //     codeElement.part.add('code', 'process-error-code');
    //     const preElement = document.createElement('pre');
    //     preElement.classList.add('pre', 'process-error-pre');
    //     preElement.part.add('pre', 'process-error-pre');
    //     preElement.textContent = message;
    //     codeElement.append(preElement);
    //     errorElement.append(codeElement);
    //     this.findElement('#tests').append(errorElement);
    // }

    // #updateListType(type: 'ordered'|'unordered')
    // {
    //     if(type == 'ordered')
    //     {
    //         const list = this.shadowRoot!.querySelector<HTMLElement>('ul');
    //         if(list == null) { return; }

    //         const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

    //         const newList = document.createElement('ol');
    //         if(items != null)
    //         {
    //             newList.append(...items);
    //         }
    //         newList.id = 'tests';

    //         list.replaceWith(newList);
    //     }
    //     else
    //     {
    //         const list = this.shadowRoot!.querySelector<HTMLElement>('ol');
    //         if(list == null) { return; }

    //         const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

    //         const newList = document.createElement('ul');
    //         newList.id = 'tests';
    //         if(items != null)
    //         {
    //             newList.append(...items);
    //         }

    //         list.replaceWith(newList);
    //     }
    // }

    static observedAttributes = ['in-order'];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string)
    {
        if(attributeName == 'in-order')
        {
            // if(newValue == undefined)
            // {
            //     this.#updateListType('unordered');
            // }
            // else
            // {
            //     this.#updateListType('ordered');
            // }
        }
    }
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