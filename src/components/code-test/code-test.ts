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

    testState?: TestState,
    beforeEachState?: TestResultState,
    afterEachState?: TestResultState,
}

export type TestResultCategory = 'none'|'success'|'fail';

export type TestResultState = {
    hasRun: boolean;
    isRunning: boolean,
    resultCategory: TestResultCategory,
    resultContent: string|HTMLElement,
};
export type TestState = TestResultState & {
    test: Test
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

        testState: undefined,
        beforeEachState: undefined,
        afterEachState: undefined,
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
    setTestStateProperties(key: keyof CodeTestState, state: Partial<TestState>)
    {
        if(this.state[key] == null) { return; }

        this.setState({
            ...this.state,
            [key]: {
                ...(this.state as any)[key],
                ...state,
            }
        });
    }

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from<T>(this.shadowRoot!.querySelectorAll(query)); }

    isRunning()
    {
        return this.state.testState?.isRunning == true
        || this.state.beforeEachState?.isRunning == true
        || this.state.afterEachState?.isRunning == true;
    }
    hasRun()
    {
        return this.state.testState?.hasRun == true
        || this.state.beforeEachState?.hasRun == true
        || this.state.afterEachState?.hasRun == true;
    }
    resultCategory()
    {
        const testCategory = this.state.testState?.resultCategory ?? 'none';
        const beforeEachCategory = this.state.beforeEachState?.resultCategory ?? 'none';
        const afterEachCategory = this.state.afterEachState?.resultCategory ?? 'none';

        if(testCategory == 'none' && beforeEachCategory == 'none' && afterEachCategory == 'none')
        {
            return 'none';
        }
        if(this.state.beforeEachState == null && this.state.afterEachState == null)
        {
            return testCategory;
        }
        else if(this.state.beforeEachState != null && this.state.afterEachState == null)
        {
            if(testCategory == 'fail' || beforeEachCategory == 'fail')
            {
                return 'fail';
            }

            if(testCategory == 'success' && beforeEachCategory == 'success')
            {
                return 'success';
            }
            return 'none';
        }
        else if(this.state.beforeEachState == null && this.state.afterEachState != null)
        {
            if(testCategory == 'fail' || afterEachCategory == 'fail')
            {
                return 'fail';
            }

            if(testCategory == 'success' && afterEachCategory == 'success')
            {
                return 'success';
            }
            return 'none';
        }
        else if(this.state.beforeEachState != null && this.state.afterEachState != null)
        {
            if(testCategory == 'fail' || beforeEachCategory == 'fail' || afterEachCategory == 'fail')
            {
                return 'fail';
            }

            if(testCategory == 'success' && beforeEachCategory == 'success' && afterEachCategory == 'success')
            {
                return 'success';
            }
            return 'none';
        }
    }

    constructor()
    {
        super();
    }
    
    connectedCallback()
    {
        this.#render();
    }

    #render()
    {
        this.innerHTML = `<details class="test-details" part="test-details" ${this.isRunning() == true || this.hasRun() == true ? ' open' : ''}>
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon test-result-icon${this.state.testState?.resultCategory != 'none' ? ` ${this.state.testState?.resultCategory}` : ''}" part="result-icon"></div>
                <span class="test-description description">${this.state.description}</span>
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test">
                    <slot name="run-button-content">
                        <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
                        <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Test</span></slot>
                    </slot>
                </button>
            </summary>
            <div class="results" part="results">
                ${this.state.beforeEachState == null
                ? ''
                : `<details class="before-each-details hook${this.state.beforeEachState.resultCategory == 'none' ? '' : ` ${this.state.beforeEachState.resultCategory}`}${this.state.beforeEachState.isRunning == true ? ' running' : ''}" part="before-each-details hook">
                        <summary class="before-each-summary" part="before-each-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="before-each-result-icon result-icon${this.state.beforeEachState.resultCategory != 'none' ? ` ${this.state.beforeEachState.resultCategory}` : ''}" part="before-each-result-icon"></div>
                            <span class="before-each-description description hook-name">Before Each Hook</span>
                        </summary>
                        <div class="before-each-result result message" part="before-each-result result message">
                            ${typeof this.state.beforeEachState.resultContent != 'string'
                            ? ''
                            : this.state.beforeEachState.resultContent}
                        </div>
                    </details>`
                }
                ${this.state.testState == null
                ? ''
                : (this.state.beforeEachState == null && this.state.afterEachState == null)
                ? `<div class="test-result result message" part="test-result result message">
                        ${typeof this.state.testState.resultContent != 'string'
                        ? ''
                        : this.state.testState.resultContent}
                    </div>`
                : `<details class="processing-details${this.state.testState.resultCategory == 'none' ? '' : ` ${this.state.testState.resultCategory}`}${this.state.testState.isRunning == true ? ' running' : ''}" part="processing-details"${this.state.testState.hasRun == true ? ' open' : ''}>
                        <summary class="processing-summary" part="processing-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="processing-result-icon result-icon${this.state.testState.resultCategory != 'none' ? ` ${this.state.testState.resultCategory}` : ''}" part="processing-result-icon result-icon"></div>
                            <span class="processing-description description">Test</span>
                        </summary>
                        <div class="test-result result message" part="test-result result message">
                            ${typeof this.state.testState.resultContent != 'string'
                            ? ''
                            : this.state.testState.resultContent}
                        </div>
                    </details>`
                }                
                ${this.state.afterEachState == null
                ? ''
                : `<details class="after-each-details hook${this.state.afterEachState.resultCategory == 'none' ? '' : ` ${this.state.afterEachState.resultCategory}`}${this.state.afterEachState.isRunning == true ? ' running' : ''}" part="after-each-detail hooks">
                        <summary class="after-each-summary" part="after-each-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="after-each-result-icon result-icon${this.state.afterEachState.resultCategory != 'none' ? ` ${this.state.afterEachState.resultCategory}` : ''}" part="before-each-result-icon"></div>
                            <span class="after-each-description description hook-name">After Each Hook</span>
                        </summary>
                        <div class="after-each-result result message" part="after-each-result result message">
                            ${typeof this.state.afterEachState.resultContent != 'string'
                            ? ''
                            : this.state.afterEachState.resultContent}
                        </div>
                    </details>`
                }
            </div>
        </details>`;

        this.dataset.testId = this.state.testId;
        this.classList.add('test');
        this.part.add('test');

        this.toggleAttribute('success', this.resultCategory() == 'success');
        this.classList.toggle('success', this.resultCategory() == 'success');
        this.part.toggle('success', this.resultCategory() == 'success');
        this.classList.toggle('fail', this.resultCategory() == 'fail');
        this.part.toggle('fail', this.resultCategory() == 'fail');

        this.classList.toggle('running', this.isRunning());
        this.part.toggle('running', this.isRunning());

        if(this.state.beforeEachState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.before-each-result')!.append(this.state.beforeEachState.resultContent);
        }
        if(this.state.testState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.test-result')!.append(this.state.testState.resultContent);
        }
        if(this.state.afterEachState?.resultContent instanceof HTMLElement)
        {
            this.querySelector('.after-each-result')!.append(this.state.afterEachState.resultContent);
        }

        // if(this.state.testState?.resultCategory != 'none')
        // {
        //     this.querySelector('details')!.toggleAttribute('open', true);
        // }
    }

    async runTest(contextManager: ContextManager)
    {
        if(this.state.testState?.test == null) { return; }

        this.reset();        

        let testResult;
        let stateProperties: Partial<CodeTestState> = {};
        try
        {
            if(contextManager.shouldContinueRunningTests == false) { throw new Error("Tests have been disabled from continuing to run."); }

            const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
            if(allowTest == false) { throw new Error("Test has been prevented."); }

            this.setTestStateProperties('testState', { isRunning: true });
            contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state); // render hack so that codeTestsElement.isRunning() has up-to-date information
            testResult = await this.state.testState.test(contextManager.codeTestsElement, this);
            this.setTestStateProperties('testState', { isRunning: false, hasRun: true });
            contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state); // render hack so that codeTestsElement.isRunning() has up-to-date information
            const testParsedResult = contextManager.parseTestResult(testResult, true);

            stateProperties = {
                testState: {
                    test: this.state.testState.test,
                    resultContent: testParsedResult.result,
                    resultCategory: testParsedResult.resultCategory,
                    hasRun: this.state.testState.hasRun,
                    isRunning: false,
                }
            };
        }
        catch(error)
        {
            const errorParsedResult = contextManager.parseTestResult(testResult, false, error as Error);

            stateProperties = {
                testState: {
                    test: this.state.testState.test,
                    resultContent: errorParsedResult.result,
                    resultCategory: errorParsedResult.resultCategory,
                    hasRun: this.state.testState.hasRun,
                    isRunning: false,
                }
            };
            console.error(error);
            contextManager.shouldContinueRunningTests = false;
        }
        finally
        {
            this.setStateProperties({ ...stateProperties });
            contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state); // render hack so that codeTestsElement.isRunning() has up-to-date information
            this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
        }
    }

    reset()
    {
        const testState: TestState|undefined = (this.state.testState != null)
        ? { resultCategory: 'none',
            resultContent: '',
            test: this.state.testState.test,
            hasRun: this.state.testState.hasRun,
            isRunning: this.state.testState.isRunning
        }
        : undefined;

        if(testState == undefined) { return; }

        this.setTestStateProperties('testState', testState);

        this.setStateProperties({
            testState
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