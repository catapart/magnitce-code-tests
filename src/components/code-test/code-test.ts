import type { CodeTestsElement } from '../../code-tests';
import { NOTESTDEFINED } from '../../constants';
import type { ContextManager } from '../../managers/context.manager';
import { CodeTestEvent } from '../../maps/code-test-event';
import type { TestResultType } from '../../types/test-result.type';
import type { Test } from '../../types/test.type';
import { default as style } from './code-test.css?raw';

export type CodeTestState = {
    testId: string;
    description: string;

    isRunning: boolean,
    isCanceled: boolean,
    hasRun: boolean;

    testState?: TestState,
    beforeEachState?: TestState,
    afterEachState?: TestState,
    requiredBeforeAnyState?: TestState,
    requiredAfterAnyState?: TestState,
}

export type TestResultCategory = 'none'|'success'|'fail';

export type TestState = {
    test: Test,
    resultCategory: TestResultCategory,
    resultContent: string|HTMLElement,
};

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(`${style}`);

const COMPONENT_TAG_NAME = 'code-test';
export class CodeTestElement extends HTMLElement
{
    state: CodeTestState = 
    { 
        testId: '',
        description: 'none',

        isRunning: false,
        isCanceled: false,
        hasRun: false,

        testState: undefined,
        beforeEachState: undefined,
        afterEachState: undefined,
        requiredBeforeAnyState: undefined,
        requiredAfterAnyState: undefined,
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
        this.innerHTML = `<details class="test-details" part="test-details"${this.state.isRunning == true || this.state.hasRun == true ? ' open' : ''}>
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon${this.state.testState?.resultCategory != 'none' ? ` ${this.state.testState?.resultCategory}${this.state.isRunning == true ? ' running' : ''}` : ''}" part="result-icon"></div>
                <span class="test-description description">${this.state.description}</span>
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test">
                    <slot name="run-button-content">
                        <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
                        <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Test</span></slot>
                    </slot>
                </button>
            </summary>
            <div class="before-result test-before-result" part="before-result test-before-result">
                ${this.state.beforeEachState?.resultContent == null || typeof this.state.beforeEachState.resultContent != 'string'
                ? ''
                : this.state.beforeEachState.resultContent}
            </div>
            <div class="result test-result" part="result test-result">
                ${this.state.testState?.resultContent == null || typeof this.state.testState.resultContent != 'string'
                ? ''
                : this.state.testState.resultContent}
            </div>
            <div class="after-result test-after-result" part="after-result test-after-result">
                ${this.state.afterEachState?.resultContent == null || typeof this.state.afterEachState.resultContent != 'string'
                ? ''
                : this.state.afterEachState.resultContent}
            </div>
        </details>`;

        this.dataset.testId = this.state.testId;
        this.classList.add('test');
        this.part.add('test');

        this.toggleAttribute('success', this.state.testState?.resultCategory == 'success');
        this.classList.toggle('success', this.state.testState?.resultCategory == 'success');
        this.part.toggle('success', this.state.testState?.resultCategory == 'success');
        this.classList.toggle('fail', this.state.testState?.resultCategory == 'fail');
        this.part.toggle('fail', this.state.testState?.resultCategory == 'fail');

        if(this.state.beforeEachState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.before-result')!.append(this.state.beforeEachState.resultContent);
        }
        if(this.state.testState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.result')!.append(this.state.testState.resultContent);
        }
        if(this.state.afterEachState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.after-result')!.append(this.state.afterEachState.resultContent);
        }

        if(this.state.testState?.resultCategory != 'none')
        {
            this.querySelector('details')!.toggleAttribute('open', true);
        }
    }

    async runTest(contextManager: ContextManager)
    {
        if(this.state.testState?.test == null) { return; }

        this.reset();

        this.setStateProperties({ isRunning: true });

        // const iconElement = this.querySelector('.result-icon');
        // iconElement?.classList.remove('success', 'fail');
        // iconElement?.part.remove('success', 'fail');
        // iconElement?.classList.add('running');
        // iconElement?.part.add('running');
        
        // clean up old test result
        // const errorMessageElement = testElement.querySelector(".error-message");
        // if(errorMessageElement != null)
        // {
        //     errorMessageElement.textContent = "";
        // }
        

        // execute test
        let beforeEachResult: TestResultCategory|typeof NOTESTDEFINED = NOTESTDEFINED;
        let testResult;
        let afterEachResult: TestResultCategory|typeof NOTESTDEFINED = NOTESTDEFINED;

        let testType: 'before'|'after'|undefined;

        let stateProperties: Partial<CodeTestState> = {};
        try
        {
            const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));

            await contextManager.runRequiredBeforeAnyHook();            

            if(contextManager.shouldContinueRunningTests == false) { throw new Error("Tests have been disabled from continuing to run."); }

            if(allowTest == false || this.state.isCanceled == true) { throw new Error("Test has been cancelled"); }
            testType = 'before';
            beforeEachResult = await this.#runBeforeEachHook(contextManager.codeTestsElement);
            const beforeEachParsedResult = contextManager.parseTestResult(beforeEachResult, true, undefined, testType);

            //@ts-expect-error - test can be cancelled while async functions run
            if(this.state.isCanceled == true) { throw new Error("Test has been cancelled"); }
            testType = undefined;
            testResult = await this.state.testState.test(contextManager.codeTestsElement, this);
            const testParsedResult = contextManager.parseTestResult(testResult, true);

            //@ts-expect-error - test can be cancelled while async functions run
            if(this.state.isCanceled == true) { throw new Error("Test has been cancelled"); }
            testType = 'after';
            afterEachResult = await this.#runAfterEachHook(contextManager.codeTestsElement);
            const afterEachParsedResult = contextManager.parseTestResult(afterEachResult, true, undefined, testType);
            
            await contextManager.runRequiredAfterAnyHook();

            stateProperties = {
                testState: {
                    test: this.state.testState.test,
                    resultContent: testParsedResult.result,
                    resultCategory: testParsedResult.resultCategory,
                }
            };

            if(this.state.beforeEachState != null)
            {
                (stateProperties as any)['beforeEachState'] = {
                    test: this.state.beforeEachState!.test,
                    resultContent: beforeEachParsedResult.result,
                    resultCategory: beforeEachParsedResult.resultCategory,
                };
            }
            if(this.state.afterEachState != null)
            {
                (stateProperties as any)['afterEachState'] = {
                    test: this.state.afterEachState!.test,
                    resultContent: afterEachParsedResult.result,
                    resultCategory: afterEachParsedResult.resultCategory,
                };
            }
        }
        catch(error)
        {
            const targetResult = (testType == undefined)
            ? testResult
            : (testType == 'before')
            ? beforeEachResult
            : afterEachResult;
            const errorParsedResult = contextManager.parseTestResult(targetResult, false, error as Error, testType);

            stateProperties = testType == undefined
            ? {
                testState: {
                    test: this.state.testState.test,
                    resultContent: errorParsedResult.result,
                    resultCategory: errorParsedResult.resultCategory,
                }
            }
            : testType == 'before'
            ? {
                beforeEachState: {
                    test: this.state.beforeEachState!.test,
                    resultContent: errorParsedResult.result,
                    resultCategory: errorParsedResult.resultCategory,
                }
            }
            : {
                afterEachState: {
                    test: this.state.afterEachState!.test,
                    resultContent: errorParsedResult.result,
                    resultCategory: errorParsedResult.resultCategory,
                }
            };
            console.error(error);
            contextManager.shouldContinueRunningTests = false;
        }
        finally
        {
            this.setStateProperties({ isRunning: false, ...stateProperties });
            this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
        }
    }
    async #runBeforeEachHook(codeTestsElement: CodeTestsElement)
    {
        if(this.state.beforeEachState?.test != null)
        {
            return await this.state.beforeEachState?.test(codeTestsElement, this);
        }
        return NOTESTDEFINED;
    }
    async #runAfterEachHook(codeTestsElement: CodeTestsElement)
    {
        if(this.state.afterEachState?.test != null)
        {
            return await this.state.afterEachState?.test(codeTestsElement, this);
        }
        return NOTESTDEFINED;
    }

    reset()
    {
        const testState: TestState|undefined = (this.state.testState != null)
        ? { resultCategory: 'none', resultContent: '', test: this.state.testState.test }
        : undefined;
        const beforeEachState: TestState|undefined = (this.state.beforeEachState != null)
        ? { resultCategory: 'none', resultContent: '', test: this.state.beforeEachState.test }
        : undefined;
        const afterEachState: TestState|undefined = (this.state.afterEachState != null)
        ? { resultCategory: 'none', resultContent: '', test: this.state.afterEachState.test }
        : undefined;

        this.setStateProperties({
            isRunning: false,
            isCanceled: false,
            testState,
            beforeEachState,
            afterEachState,
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