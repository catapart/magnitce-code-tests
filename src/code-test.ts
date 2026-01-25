import type { CodeTestsContext } from './context';
import { CodeTestEvent } from './code-test-event';
import type { TestContext } from './types/test-context.type';
import type { Test } from './types/test.type';

export type CodeTestState = {
    testId: string;
    description: string;

    isDisabled: boolean;

    testState?: TestState,
    beforeEachState?: TestResultState,
    afterEachState?: TestResultState,
}

export type TestResultCategory = 'none'|'success'|'fail';

export type TestResultState = {
    hasRun: boolean;
    isRunning: boolean,
    resultCategory: TestResultCategory,
    resultContent: string|boolean|number|HTMLElement,
    duration: number,
};
export type TestState = TestResultState & {
    test: Test
};


const COMPONENT_TAG_NAME = 'code-test';
export class CodeTestElement extends HTMLElement
{
    state: CodeTestState = 
    { 
        testId: '',
        description: 'none',

        isDisabled: false,

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

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from<T>(this.querySelectorAll(query)); }

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
    
    connectedCallback()
    {
        this.#render();
    }

    #render()
    {
        const resultMessage = this.state.testState == null
        ? ''
        : typeof this.state.testState.resultContent == 'boolean'
        ? (this.state.testState.resultContent == true ? `<code class="code" part="code"><pre class="pre success-message" part="pre success-message">Passed</pre></code>` : `<code class="code" part="code"><pre class="pre error-message" part="pre error-message">Failed</pre></code>`)
        : typeof this.state.testState.resultContent == 'number'
        ? `<code class="code" part="code"><pre class="pre success-message" part="pre success-message">Passed: ${this.state.testState.resultContent.toString()}</pre></code>`
        : typeof this.state.testState.resultContent == 'string'
        ? this.state.testState.resultContent
        : '';

        this.innerHTML = `<details class="test-details" part="test-details" ${this.isRunning() == true || this.hasRun() == true ? ' open' : ''}>
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon test-result-icon${this.state.testState?.resultCategory != 'none' ? ` ${this.state.testState?.resultCategory}` : ''}" part="result-icon"></div>
                <span class="test-description description" title="${this.state.description}">${this.state.description}</span>
                ${this.state.testState?.duration != null && this.state.testState.duration > 0
                ? `<span class="test-duration duration">
                        <span class="test-duration-value">${this.state.testState.duration > 10 ? this.state.testState.duration.toFixed(0) : this.state.testState.duration.toFixed(2)}</span>
                        <span class="test-duration-unit">ms</span>
                    </span>`
                : ''}
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test"${(this.state.isDisabled == true ? ' disabled' : '')}>
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
                        <div class="before-each-result result message" part="before-each-result result message">${typeof this.state.beforeEachState.resultContent != 'string'
                            ? ''
                            : this.state.beforeEachState.resultContent}</div>
                    </details>`
                }
                ${this.state.testState == null
                ? ''
                : (this.state.beforeEachState == null && this.state.afterEachState == null)
                ? `<div class="test-result result message" part="test-result result message">${resultMessage}</div>`
                : `<details class="processing-details${this.state.testState.resultCategory == 'none' ? '' : ` ${this.state.testState.resultCategory}`}${this.state.testState.isRunning == true ? ' running' : ''}" part="processing-details"${this.state.testState.hasRun == true ? ' open' : ''}>
                        <summary class="processing-summary" part="processing-summary">
                            <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                            <div class="processing-result-icon result-icon${this.state.testState.resultCategory != 'none' ? ` ${this.state.testState.resultCategory}` : ''}" part="processing-result-icon result-icon"></div>
                            <span class="processing-description description">Test</span>
                        </summary>
                        <div class="test-result result message" part="test-result result message">${resultMessage}</div>
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
                        <div class="after-each-result result message" part="after-each-result result message">${typeof this.state.afterEachState.resultContent != 'string'
                            ? ''
                            : this.state.afterEachState.resultContent}</div>
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

    enable()
    {
        this.state.isDisabled = false;
        this.findElement('.run-test-button').toggleAttribute('disabled', false);
    }
    disable()
    {
        this.state.isDisabled = true;
        this.findElement('.run-test-button').toggleAttribute('disabled', true);
    }

    async runTest(contextManager: CodeTestsContext, testContext: TestContext)
    {
        if(this.state.testState?.test == null) { return; }

        this.reset();        

        let testResult;
        let stateProperties: Partial<CodeTestState> = {};
        let duration = 0;
        try
        {
            if(contextManager.shouldContinueRunningTests == false) { throw new Error("Tests have been disabled from continuing to run."); }

            const allowTest = this.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeTest, { bubbles: true, cancelable: true, composed: true, detail: { testElement: this } }));
            if(allowTest == false) { throw new Error("Test has been prevented."); }

            if(testContext.codeTestsElement.state.isCanceled == true)
            {
                throw new Error("Testing has been canceled.");
            }

            this.setTestStateProperties('testState', { isRunning: true });
            contextManager.codeTestsElement.setState(contextManager.codeTestsElement.state); // render hack so that codeTestsElement.isRunning() has up-to-date information
            const startTime = (performance?.now() ?? Date.now());
            testResult = await this.state.testState.test(testContext);
            const endTime = (performance?.now() ?? Date.now());
            duration = endTime - startTime;
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
                    duration,
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
                    duration,
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
            isRunning: this.state.testState.isRunning,
            duration: 0,
        }
        : undefined;

        if(testState == undefined) { return; }

        this.setTestStateProperties('testState', testState);

        // this.setStateProperties({
        //     testState,
        //     beforeEachState,
        //     afterEachState,
        // });
    }

    getMessageElement()
    {
        return this.findElement('.test-result');
    }
    
    static observedAttributes = [ "open" ];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
    {
        if(attributeName == 'open')
        {
            this.findElement('.test-details').toggleAttribute('open', (newValue != undefined));
        }
    }
    
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestElement);
}