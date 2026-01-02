import type { CodeTestsElement } from '../../code-tests';
import type { Test } from '../../types/test.type';
import { default as style } from './code-test.css?raw';

export type CodeTestState = {
    testId: string;
    description: string;
    hasRun: boolean;
    beforeResult: string;
    beforeResultType: 'none'|'success'|'fail';
    result: string;
    resultType: 'none'|'success'|'fail';
    afterResult: string;
    afterResultType: 'none'|'success'|'fail';
    test?: Test;
}


const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(`${style}`);

const COMPONENT_TAG_NAME = 'code-test';
export class CodeTestElement extends HTMLElement
{
    state: CodeTestState = 
    { 
        testId: '',
        description: 'none',
        test: undefined,

        hasRun: false,
        beforeResult: '',
        beforeResultType: 'none',
        result: '',
        resultType: 'none',
        afterResult: '',
        afterResultType: 'none',
    };
        
    setState(state: CodeTestState)
    {
        this.state = state;
        this.#render();
    }
    setStateProperties(state: Partial<CodeTestState>)
    {
        this.setState({
            ...this.state,
            ...state
        });
    }

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from<T>(this.shadowRoot!.querySelectorAll(query)); }

    constructor()
    {
        super();
        // this.attachShadow({ mode: "open" });
        // this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    }
    
    connectedCallback()
    {
        this.#render();
    }
    // disconnectedCallback()
    // {
    //     this.removeEventListener('click', this.#boundClickHandler);
    // }

    // async #init()
    // {
    //     // await DataService.init();
    //     // ContextManager.init(this);
    //     // InputService.init(this);
    //     // await this.findElement<TargetComponent>('target-component').init();
    // }
    // async destroy()
    // {
    //     // this.findElement<TargetComponent>('target-component').destroy();
    //     // ContextManager.destroy();
    // }

    // #boundClickHandler: (event: Event) => void = this.#onClick.bind(this);
    // async #onClick(event: Event)
    // {
    //     // const composedPath = event.composedPath();

    //     // const button = composedPath.find(item => item instanceof HTMLButtonElement && item.id == 'target-button') as HTMLButtonElement;
    //     // if(button != null)
    //     // {
    //     //     this.findElement<TargetComponent>('target-component').handleClick();
    //     //     return;
    //     // }
        
    // }

    #render()
    {
        this.innerHTML = `<details class="test-details" part="test-details">
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon" part="result-icon"></div>
                <span class="test-description description">${this.state.description}</span>
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test">
                    <slot name="run-button-content">
                        <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
                        <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Test</span></slot>
                    </slot>
                </button>
            </summary>
            <div class="before-result test-before-result" part="before-result test-before-result">${this.state.beforeResult}</div>
            <div class="result test-result" part="result test-result">${this.state.result}</div>
            <div class="after-result test-after-result" part="after-result test-after-result">${this.state.afterResult}</div>
        </details>`;

        this.dataset.testId = this.state.testId;
        this.classList.add('test');
        this.part.add('test');

        this.toggleAttribute('success', this.state.resultType == 'success');
        this.classList.toggle('success', this.state.resultType == 'success');
        this.part.toggle('success', this.state.resultType == 'success');
        this.classList.toggle('fail', this.state.resultType == 'fail');
        this.part.toggle('fail', this.state.resultType == 'fail');
    }

    async runTest()
    {
        if(this.state.test == null) { return; }
        this.state.test(this.parentElement as CodeTestsElement, this);
    }
    async #runBeforeEachHook()
    {

    }
    async #runAfterEachHook()
    {

    }
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

    reset()
    {
        this.setStateProperties({
            beforeResult: '',
            beforeResultType: 'none',
            result: '',
            resultType: 'none',
            afterResult: '',
            afterResultType: 'none',
        });
    }
    
    // static observedAttributes = [ "myprop" ];
    // attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) 
    // {
    //     if(attributeName == "myprop")
    //     {
            
    //     }
    // }
    
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestElement);
}