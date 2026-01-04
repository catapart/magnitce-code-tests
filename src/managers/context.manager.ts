import { CodeTestsElement, Hook, type CodeTestsState } from "../code-tests";
import { CodeTestElement, type TestResultCategory, type TestState } from "../components/code-test/code-test";
import { NOTESTDEFINED } from "../constants";
import { CodeTestEvent } from "../maps/code-test-event";
import type { TestResultType } from "../types/test-result.type";
import type { Test } from "../types/test.type";
import { TestManager } from "./test.manager";

export class ContextManager
{
    codeTestsElement: CodeTestsElement;

    #testManager: TestManager;

    constructor(parent: CodeTestsElement)
    {
        this.codeTestsElement = parent;
        this.#testManager = new TestManager();
    }
    async loadTests(path?: string)
    {
        if(path == null) { return; }
        
        try
        {
            const { tests, hooks } = await this.#testManager.loadTests(path);

            console.log(tests, hooks);

            const beforeAll = hooks[Hook.BeforeAll];
            if(beforeAll != null)
            {
                this.codeTestsElement.classList.add('has-before-hook', 'has-before-all-hook');
                this.codeTestsElement.part.add('has-before-hook', 'has-before-all-hook');
            }
            const afterAll = hooks[Hook.AfterAll];
            if(afterAll != null)
            {
                this.codeTestsElement.classList.add('has-after-hook', 'has-after-all-hook');
                this.codeTestsElement.part.add('has-after-hook', 'has-after-all-hook');
            }
            const beforeEach = hooks[Hook.BeforeEach];
            if(beforeEach != null)
            {
                this.codeTestsElement.classList.add('has-before-hook', 'has-before-each-hook');
                this.codeTestsElement.part.add('has-before-hook', 'has-before-each-hook');
            }
            const afterEach = hooks[Hook.AfterEach];
            if(afterEach != null)
            {
                this.codeTestsElement.classList.add('has-after-hook', 'has-after-each-hook');
                this.codeTestsElement.part.add('has-after-hook', 'has-after-each-hook');
            }
            const requiredBeforeAny = hooks[Hook.RequiredBeforeAny];
            if(requiredBeforeAny != null)
            {
                this.codeTestsElement.classList.add('has-before-hook', 'has-required-before-hook');
                this.codeTestsElement.part.add('has-before-hook', 'has-required-before-hook');
            }
            const requiredAfterAny = hooks[Hook.RequiredAfterAny];
            if(requiredAfterAny != null)
            {
                this.codeTestsElement.classList.add('has-after-hook', 'has-required-after-hook');
                this.codeTestsElement.part.add('has-after-hook', 'has-required-after-hook');
            }

            const beforeAllState: TestState|undefined = (beforeAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: beforeAll, hasRun: false, isRunning: false };
            const afterAllState: TestState|undefined = (afterAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: afterAll, hasRun: false, isRunning: false };
            const beforeEachState: TestState|undefined = (beforeEach == null) ? undefined : { resultCategory: 'none', resultContent: '', test: beforeEach, hasRun: false, isRunning: false };
            const afterEachState: TestState|undefined = (afterEach == null) ? undefined : { resultCategory: 'none', resultContent: '', test: afterEach, hasRun: false, isRunning: false };
            const requiredBeforeAnyState: TestState|undefined = (requiredBeforeAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredBeforeAny, hasRun: false, isRunning: false };
            const requiredAfterAnyState: TestState|undefined = (requiredAfterAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredAfterAny, hasRun: false, isRunning: false };

            this.codeTestsElement.setStateProperties({
                beforeAllState,
                afterAllState,
                beforeEachState,
                afterEachState,
                requiredBeforeAnyState,
                requiredAfterAnyState
            });

            for(const [description, test] of Object.entries(tests))
            {
                this.#addTest(description, test);
            }
        }
        catch(error)
        {
            console.error(error);
            // this.#addProcessError("An error occurred while loading the tasks:", error);
        }
    }

    #addTest(description: string, test: Test)
    {
        const testId = generateId();
        this.#testManager.addTest(testId, test);
        const testElement = new CodeTestElement();
        testElement.setStateProperties({
            testId,
            description,
            testState: { test, resultCategory: 'none', resultContent: '', isRunning: false, hasRun: false },
            beforeEachState: (this.codeTestsElement.state.beforeEachState == null)
            ? undefined
            : {
                isRunning: this.codeTestsElement.state.beforeEachState.isRunning,
                hasRun: this.codeTestsElement.state.beforeEachState.hasRun,
                resultCategory: this.codeTestsElement.state.beforeEachState.resultCategory,
                resultContent: this.codeTestsElement.state.beforeEachState.resultContent
            },
            afterEachState: (this.codeTestsElement.state.afterEachState == null)
            ? undefined
            : {
                isRunning: this.codeTestsElement.state.afterEachState.isRunning,
                hasRun: this.codeTestsElement.state.afterEachState.hasRun,
                resultCategory: this.codeTestsElement.state.afterEachState.resultCategory,
                resultContent: this.codeTestsElement.state.afterEachState.resultContent
            }
        })
        this.codeTestsElement.findElement('#tests').append(testElement);
        return testId;
    }

    shouldContinueRunningTests: boolean = true;
    async runTests(tests: CodeTestElement[])
    {
        const allowTests = this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeAll, { bubbles: true, composed: true, cancelable: true }));
        if(allowTests == false) { throw new Error("Tests have been prevented."); }

        this.reset();

        await this.runHook('requiredBeforeAnyState');
        if(this.shouldContinueRunningTests == false)
        {
            await this.runHook('requiredAfterAnyState');
            this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
            return;
        }
        await this.runHook('beforeAllState');
        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        {
            await this.runHook('requiredAfterAnyState');
            this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
            return;
        }

        const inOrder = this.codeTestsElement.getAttribute('ordered') != 'false';
        if(inOrder == false)
        {
            const promises = tests.map(item => this.runTest(item, true));
            await Promise.all(promises);
        }
        else
        {
            for(let i = 0; i < tests.length; i++)
            {
                const test = tests[i];
                // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
                if(this.shouldContinueRunningTests == false) { break; }                
                await this.runTest(test, true);
            }
        }

        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        { 
            await this.runHook('requiredAfterAnyState');
            this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
            return;
        }
        
        await this.runHook('afterAllState');
        await this.runHook('requiredAfterAnyState');
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    }
    async runTest(test: CodeTestElement|undefined, inLoop: boolean)
    {
        if(test == null) { return; }

        if(inLoop == false)
        {
            this.resetHook('requiredBeforeAnyState');
            this.resetHook('requiredAfterAnyState');

            this.resetHook('beforeEachState');
            this.resetHook('afterEachState');
        }

        if(inLoop == false)
        { 
            await this.runHook('requiredBeforeAnyState');
            if(this.shouldContinueRunningTests == false)
            {
                if(inLoop == false) { await this.runHook('requiredAfterAnyState'); }
                return;
            }
        }

        await this.runHook('beforeEachState', test); 
        if(this.shouldContinueRunningTests == false)
        {
            if(inLoop == false) { await this.runHook('requiredAfterAnyState'); }
            return;
        }

        await test.runTest(this);
        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        {
            if(inLoop == false) { await this.runHook('requiredAfterAnyState'); }
            return;
        }

        await this.runHook('afterEachState', test);
        if(inLoop == false) { await this.runHook('requiredAfterAnyState'); }
    }
    
    async runHook(testStateName: keyof Pick<CodeTestsState, 'requiredBeforeAnyState'|'requiredAfterAnyState'|'beforeEachState'|'afterEachState'|'beforeAllState'|'afterAllState'>, test?: CodeTestElement)
    {
        const testState = this.codeTestsElement.state[testStateName];
        if(testState == null) { return NOTESTDEFINED; }

        // todo:
        // figure out how to cancel
        // add test context
        // onContext, onReset hooks
        // user reset after fail
        // reload tests
        // prompt
        // expect
        // footer report
        // passed/total; failed/total; pass percentage; execution time;
        // hook icon
        // cancel icon
        // handle has-hook classes in render
        

        let hookResult: TestResultType;
        try
        {
            // if(this.codeTestsElement.state.isCanceled == true) { throw new Error("Tests have been cancelled"); }
            if(this.shouldContinueRunningTests == false 
            && (testStateName != 'requiredAfterAnyState'
               || this.codeTestsElement.getAttribute('required-after') == 'error')
            ) { throw new Error("Tests have been disabled from continuing to run."); }

            if(test != null) { test.setTestStateProperties(testStateName as any, { isRunning: true }); }
            this.codeTestsElement.setTestStateProperties(testStateName, { isRunning: true });

            hookResult = await testState.test(this.codeTestsElement, this.codeTestsElement);

            if(test != null) { test.setTestStateProperties(testStateName as any, { isRunning: false, hasRun: true  }); }
            this.codeTestsElement.setTestStateProperties(testStateName, { isRunning: false, hasRun: true });

            const hookParsedResult = this.parseTestResult(hookResult, true, undefined);
            
            if(test != null)
            {
                test.setTestStateProperties(testStateName as any, { 
                    resultCategory: hookParsedResult.resultCategory,
                    resultContent: hookParsedResult.result
                });
            }

            this.codeTestsElement.setTestStateProperties(testStateName, { 
                resultCategory: hookParsedResult.resultCategory,
                resultContent: hookParsedResult.result
            });
        }
        catch(error)
        {
            console.error(error);
            this.shouldContinueRunningTests = false;
            hookResult = { success: false, value: `Failed: ${(error as Error).message}` }
            const errorParsedResult = this.parseTestResult(hookResult, false, error as Error);
            
            if(test != null) { 
                test.setTestStateProperties(testStateName as any, 
                { 
                    isRunning: false,
                    hasRun: true,
                    resultContent: errorParsedResult.result,
                    resultCategory: errorParsedResult.resultCategory,
                }); 
            }
            this.codeTestsElement.setTestStateProperties(testStateName, { 
                isRunning: false,
                hasRun: true,
                resultCategory: errorParsedResult.resultCategory,
                resultContent: errorParsedResult.result
            });
        }
        finally
        {
            this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterHook, { bubbles: true, composed: true, detail: hookResult }));
            return hookResult;
        }
    }

    parseTestResult(result: TestResultType|typeof NOTESTDEFINED, finishedTest: boolean, error?: Error)
    : { result: string|HTMLElement, resultCategory: TestResultCategory }
    {
        if(result == NOTESTDEFINED) { return { result: '', resultCategory: 'none' }; }

        if(result == undefined)
        {
            const message = finishedTest == true ? 'Passed' : `Failed${(error != null) ? `:\n${error.message}` : ''}`;
            const className = (finishedTest == true)
            ? 'success-message'
            : 'error-message';
            return { 
                result: `<code class="code" part="code">
                    <pre class="pre ${className}" part="pre ${className}">${message}</pre>
                </code>`,
                resultCategory: (finishedTest == true) ? 'success' : 'fail'
            };
        }
        else if(typeof result == 'function')
        {
            console.log('function');
            return { result: `[A function was returned]`, resultCategory: 'none' };
        }
        else if(result instanceof HTMLElement || typeof result == 'string')
        {
            return { result, resultCategory: 'none' };
        }
        else if(typeof result == 'object')
        {
            const objectResult = result as any;
            const className = (finishedTest == true)
            ? 'success-message'
            : 'error-message';
            
            if(objectResult.success != undefined
            && objectResult.expected != undefined
            && objectResult.value != undefined)
            {
                return { 
                    result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${(objectResult.success == true) ? 'Passed' : 'Failed'}\nExpected:${objectResult.expected}\nResult:${objectResult.value}</pre>
                    </code>`,
                    resultCategory: (objectResult.success == true) ? 'success' : 'fail'
                };
            }
            else if(objectResult.success != undefined)
            {
                return { 
                    result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${JSON.stringify(result, undefined, 2)}</pre>
                    </code>`,
                    resultCategory: (objectResult.success == true) ? 'success' : 'fail'
                };
            }
            else
            {
                const className = (finishedTest == true)
                ? 'success-message'
                : 'error-message';
                return { 
                    result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${JSON.stringify(result, undefined, 2)}</pre>
                    </code>`,
                    resultCategory: (finishedTest == true) ? 'success' : 'fail'
                };
            }
        }

        throw new Error("Unable to parse result type: Unknown result type");
    }

    reset()
    {
        this.shouldContinueRunningTests = true;
        this.codeTestsElement.reset();
    }
    resetHook(hookName: keyof Pick<CodeTestsState, 'requiredBeforeAnyState'|'requiredAfterAnyState'|'beforeEachState'|'afterEachState'|'beforeAllState'|'afterAllState'>)
    {
        this.codeTestsElement.setTestStateProperties(hookName, { resultContent: '', resultCategory: 'none', hasRun: false });
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