import { CodeTestsElement, Hook } from "../code-tests";
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
            
            this.reset();

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

            const beforeAllState: TestState|undefined = (beforeAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: beforeAll };
            const afterAllState: TestState|undefined = (afterAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: afterAll };
            const requiredBeforeAnyState: TestState|undefined = (requiredBeforeAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredBeforeAny };
            const requiredAfterAnyState: TestState|undefined = (requiredAfterAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredAfterAny };

            this.codeTestsElement.setStateProperties({
                beforeAllState,
                afterAllState,
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
            testState: { test, resultCategory: 'none', resultContent: '' },
        })
        this.codeTestsElement.findElement('#tests').append(testElement);
        return testId;
    }

    shouldContinueRunningTests: boolean = true;
    async runTests(tests: CodeTestElement[])
    {
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeAll, { bubbles: true, composed: true }));

        this.codeTestsElement.setStateProperties({
            isRunning: false,
            isCanceled: false,
            groupResultType: 'none',
        })
        this.shouldContinueRunningTests = true;

        this.codeTestsElement.reset();

        const inOrder = this.codeTestsElement.hasAttribute('in-order');

        await this.#testManager.runRequiredBeforeAnyHook();
        await this.#testManager.runBeforeAllHook();

        if(inOrder == false)
        {
            const promises = tests.map(item => item.runTest(this));
            await Promise.all(promises);
        }
        else
        {
            for(let i = 0; i < tests.length; i++)
            {
                const test = tests[i];
                //@ts-expect-error ts doesn't understand that runTest can change this value?
                if(this.shouldContinueRunningTests == false) { break; }
                await test.runTest(this);
            }
        }
        //@ts-expect-error ts doesn't understand that runTest can change this value?
        if(this.shouldContinueRunningTests == false)
        { 
            await this.#testManager.runRequiredAfterAnyHook();
            this.codeTestsElement.setStateProperties({
                isRunning: false,
            });
            this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
            return;
        }
        
        await this.#testManager.runAfterAllHook();
        await this.#testManager.runRequiredAfterAnyHook();


        const failedTests = this.codeTestsElement.findElements('[success="false"]');
        this.codeTestsElement.setStateProperties({
            groupResultType: failedTests.length == 0 ? 'success' : 'fail',
            isRunning: false,
        });
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    }
    runTest(test?: CodeTestElement)
    {
        if(test == null) { return; }
        test.runTest(this);
    }

    
    async runRequiredBeforeAnyHook(): Promise<any>
    {
        // const requiredBeforeParsedResult = this.parseTestResult(requiredBeforeResult, true, undefined, 'before');
    //         detailsElement.open = true;

        // if(handleRequiredTests == true)
        // {
        //     const requiredBeforeHook = this.#hooks[Hook.RequiredBeforeAny];
        //     if(requiredBeforeHook != null)
        //     {
        //         let hookResult;
        //         try
        //         {
        //             const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
        //             requiredBeforeAnyHookElement.classList.add('running');
        //             requiredBeforeAnyHookElement.part.add('running');

        //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //             hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

        //             this.#handleHookResult(hookResult, true, 'before', true);
        //             requiredBeforeAnyHookElement.part.remove('running');
        //             requiredBeforeAnyHookElement.classList.remove('running');
        //         }
        //         catch(error)
        //         {
        //             this.#handleHookResult(hookResult, true, 'before', true, error as Error);
        //             console.error(error);
        //             this.shouldContinueRunningTests = false;
        //             return;
        //         }
        //     }
        // }

        return NOTESTDEFINED;
    }
    async runRequiredAfterAnyHook(): Promise<any>
    {
        const testState = this.codeTestsElement.state.requiredAfterAnyState;
        if(testState == null) { return NOTESTDEFINED; }

        // reset requiredAfter state
        this.codeTestsElement.setStateProperties({
            requiredAfterAnyState: { test: testState.test, resultContent: '', resultCategory: 'none' }
        });
        // const requiredAfterResult = await this.#testManager.runRequiredAfterAnyHook();
        // if(requiredAfterResult == NOTESTDEFINED) { return requiredAfterResult; }
        
        if(this.codeTestsElement.state.isCanceled == true) { throw new Error("Tests have been cancelled"); }
        const requiredAfterResult = await testState.test(this.codeTestsElement, undefined as any);

        const requiredAfterParsedResult = this.parseTestResult(requiredAfterResult, true, undefined, 'after');
    //         detailsElement.open = true;


        // if(handleRequiredTests == true)
        // {
        //     const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
        //     if(requiredAfterHook != null)
        //     {
        //         let hookResult;
        //         try
        //         {
        //             const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
        //             requiredBeforeAnyHookElement.classList.add('running');
        //             requiredBeforeAnyHookElement.part.add('running');

        //             //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //             if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //             hookResult = await requiredAfterHook(this, requiredBeforeAnyHookElement);

        //             this.#handleHookResult(hookResult, true, 'after', true);
        //             requiredBeforeAnyHookElement.part.remove('running');
        //             requiredBeforeAnyHookElement.classList.remove('running');
        //         }
        //         catch(error)
        //         {
        //             this.#handleHookResult(hookResult, true, 'after', true, error as Error);
        //             console.error(error);
        //             this.shouldContinueRunningTests = false;
        //             return;
        //         }
        //     }
        // }

        return NOTESTDEFINED;
    }
    

    parseTestResult(result: TestResultType|typeof NOTESTDEFINED, finishedTest: boolean, error?: Error, beforeOrAfter?: 'before'|'after')
    : { result: string|HTMLElement, resultCategory: TestResultCategory }
    {
        if(result == NOTESTDEFINED) { return { result: '', resultCategory: 'none' }; }

        if(result == undefined)
        {
            const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Hook Ran Successfully';
            const message = finishedTest == true ? `${trueMessage}` : `Failed${(error != null) ? `:\n${error.message}` : ''}`;
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
                const trueMessage = (beforeOrAfter == undefined) ? 'Passed' : 'Success';
                const falseMessage = (beforeOrAfter == undefined) ? 'Failed' : 'Fail';
                return { 
                    result: `<code class="code" part="code">
                        <pre class="pre ${className}" part="pre ${className}">${(objectResult.success == true) ? `${trueMessage}:` : `${falseMessage}:`}\nExpected:${objectResult.expected}\nResult:${objectResult.value}</pre>
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


    reset()
    {
        // this.findElement('#tests').innerHTML = '';
        // this.#tests.clear();

        this.codeTestsElement.classList.remove('has-before-hook', 'has-before-all-hook', 'has-before-each-hook', 'has-required-before-hook');
        this.codeTestsElement.part.remove('has-before-hook', 'has-before-all-hook', 'has-before-each-hook', 'has-required-before-hook');
        this.codeTestsElement.classList.remove('has-after-hook', 'has-after-all-hook', 'has-after-each-hook', 'has-required-after-hook');
        this.codeTestsElement.part.remove('has-after-hook', 'has-after-all-hook', 'has-after-each-hook', 'has-required-after-hook');
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