import { CodeTestsElement, Hook, type CodeTestsState } from "./code-tests";
import { CodeTestElement, type TestResultCategory, type TestState } from "./code-test";
import { NOTESTDEFINED } from "./constants";
import { CodeTestEvent } from "./code-test-event";
import type { TestContext } from "./types/test-context.type";
import type { TestResultType } from "./types/test-result.type";
import type { Test } from "./types/test.type";
import type { Tests } from "./types/tests.type";

export type Hooks = {
    [Hook.BeforeAll]?: Test,
    [Hook.AfterAll]?: Test,
    [Hook.BeforeEach]?: Test,
    [Hook.AfterEach]?: Test,
    [Hook.RequiredBeforeAny]?: Test,
    [Hook.RequiredAfterAny]?: Test,
    [Hook.Reset]?: Test,
    [Hook.Context]?: Test,
};

export class CodeTestsContext
{
    codeTestsElement: CodeTestsElement;
    // testContext?: TestContext;

    constructor(parent: CodeTestsElement)
    {
        this.codeTestsElement = parent;
    }

    //#region Loading
    async loadTests(path?: string)
    {
        if(path == null) { return; }
        
        try
        {
            const { tests, hooks } = await this.#loadTests(path);

            // console.log(tests, hooks);

            const beforeAll = hooks[Hook.BeforeAll];
            const afterAll = hooks[Hook.AfterAll];
            const beforeEach = hooks[Hook.BeforeEach];
            const afterEach = hooks[Hook.AfterEach];
            const requiredBeforeAny = hooks[Hook.RequiredBeforeAny];
            const requiredAfterAny = hooks[Hook.RequiredAfterAny];

            const beforeAllState: TestState|undefined = (beforeAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: beforeAll, hasRun: false, isRunning: false, duration: 0 };
            const afterAllState: TestState|undefined = (afterAll == null) ? undefined : { resultCategory: 'none', resultContent: '', test: afterAll, hasRun: false, isRunning: false, duration: 0 };
            const beforeEachState: TestState|undefined = (beforeEach == null) ? undefined : { resultCategory: 'none', resultContent: '', test: beforeEach, hasRun: false, isRunning: false, duration: 0 };
            const afterEachState: TestState|undefined = (afterEach == null) ? undefined : { resultCategory: 'none', resultContent: '', test: afterEach, hasRun: false, isRunning: false, duration: 0 };
            const requiredBeforeAnyState: TestState|undefined = (requiredBeforeAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredBeforeAny, hasRun: false, isRunning: false, duration: 0 };
            const requiredAfterAnyState: TestState|undefined = (requiredAfterAny == null) ? undefined : { resultCategory: 'none', resultContent: '', test: requiredAfterAny, hasRun: false, isRunning: false, duration: 0 };
            
            // need to assign these before adding tests
            // but don't need to render that assignment
            // in the group element; tests render themselves
            this.codeTestsElement.state.beforeEachState = beforeEachState;
            this.codeTestsElement.state.afterEachState = afterEachState;

            for(const [description, test] of Object.entries(tests))
            {
                this.#addTest(description, test);
            }

            this.codeTestsElement.setStateProperties({
                beforeAllState,
                afterAllState,
                beforeEachState,
                afterEachState,
                requiredBeforeAnyState,
                requiredAfterAnyState,
                resetHook: hooks.reset,
                contextHook: hooks.context,
            });
        }
        catch(error)
        {
            console.error(error);
            // this.#addProcessError("An error occurred while loading the tasks:", error);
        }
    }
    async #loadTests(path: string)
    {
        const module = await this.#loadModule(path);
        
        const tests: Tests = module.tests ?? module.default;
        if(tests == undefined)
        {
            throw new Error(`Unable to find tests definition in file at path: ${path}`);
        }

        const hooks: Hooks = { }

        const beforeAll = tests[Hook.BeforeAll];
        if(beforeAll != null)
        {
            hooks[Hook.BeforeAll] = beforeAll;
            delete tests[Hook.BeforeAll];
        }
        const afterAll = tests[Hook.AfterAll];
        if(afterAll != null)
        {
            hooks[Hook.AfterAll] = afterAll;
            delete tests[Hook.AfterAll];
        }
        const beforeEach = tests[Hook.BeforeEach];
        if(beforeEach != null)
        {
            hooks[Hook.BeforeEach] = beforeEach;
            delete tests[Hook.BeforeEach];
        }
        const afterEach = tests[Hook.AfterEach];
        if(afterEach != null)
        {
            hooks[Hook.AfterEach] = afterEach;
            delete tests[Hook.AfterEach];
        }
        const requiredBeforeAny = tests[Hook.RequiredBeforeAny];
        if(requiredBeforeAny != null)
        {
            hooks[Hook.RequiredBeforeAny] = requiredBeforeAny;
            delete tests[Hook.RequiredBeforeAny];
        }
        const requiredAfterAny = tests[Hook.RequiredAfterAny];
        if(requiredAfterAny != null)
        {
            hooks[Hook.RequiredAfterAny] = requiredAfterAny;
            delete tests[Hook.RequiredAfterAny];
        }
        const resetHook = tests[Hook.Reset];
        if(resetHook != null)
        {
            hooks[Hook.Reset] = resetHook;
            delete tests[Hook.Reset];
        }
        const contextHook = tests[Hook.Context];
        if(contextHook != null)
        {
            hooks[Hook.Context] = contextHook;
            delete tests[Hook.Context];
        }

        return { tests, hooks };
    }
    async #loadModule(path: string)
    {
        const lastSlashIndexInCurrentPath = window.location.href.lastIndexOf('/');
        const currentPathHasExtension = window.location.href.substring(lastSlashIndexInCurrentPath).indexOf('.') != -1;
        const currentPath = (currentPathHasExtension == true)
        ? window.location.href.substring(0, lastSlashIndexInCurrentPath + 1)
        : window.location.href;
        // const moduleDirectory = currentPath + path.substring(0, path.lastIndexOf('/') + 1);
        const modulePath = currentPath + path;
        // let moduleContent = await (await fetch(modulePath)).text();
        // moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
        // console.log(moduleContent);
        // const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf('/')), { type: 'text/javascript' });
        // const moduleURL = URL.createObjectURL(moduleFile);
        // const module = await import(`data:text/javascript,${encodeURIComponent(moduleContent)}`);
        // const module = await (await fetch(moduleURL)).text();
        const module = await import(/* @vite-ignore */modulePath);
        return module;
    }
    #addTest(description: string, test: Test)
    {
        const testId = generateId();
        const testElement = new CodeTestElement();
        testElement.setStateProperties({
            testId,
            description,
            testState: { test, resultCategory: 'none', resultContent: '', isRunning: false, hasRun: false, duration: 0 },
            beforeEachState: (this.codeTestsElement.state.beforeEachState == null)
            ? undefined
            : {
                isRunning: this.codeTestsElement.state.beforeEachState.isRunning,
                hasRun: this.codeTestsElement.state.beforeEachState.hasRun,
                resultCategory: this.codeTestsElement.state.beforeEachState.resultCategory,
                resultContent: this.codeTestsElement.state.beforeEachState.resultContent,
                duration: 0
            },
            afterEachState: (this.codeTestsElement.state.afterEachState == null)
            ? undefined
            : {
                isRunning: this.codeTestsElement.state.afterEachState.isRunning,
                hasRun: this.codeTestsElement.state.afterEachState.hasRun,
                resultCategory: this.codeTestsElement.state.afterEachState.resultCategory,
                resultContent: this.codeTestsElement.state.afterEachState.resultContent,
                duration: 0
            }
        })
        this.codeTestsElement.findElement('#tests').append(testElement);
        return testId;
    }
    //#endregion Loading

    //#region Running
    shouldContinueRunningTests: boolean = true;
    async runTests(tests: CodeTestElement[])
    {
        const allowTests = this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.BeforeAll, { bubbles: true, composed: true, cancelable: true }));
        if(allowTests == false) { throw new Error("Tests have been prevented."); }

        await this.codeTestsElement.reset();

        for(let i = 0; i < tests.length; i++)
        {
            tests[i].disable();
        }

        const context = await this.createTestContext();

        await this.runHook('requiredBeforeAnyState', undefined, context);
        if(this.shouldContinueRunningTests == false)
        {
            await this.#endTests(tests, context);
            return;
        }
        await this.runHook('beforeAllState', undefined, context);
        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        {
            await this.#endTests(tests, context);
            return;
        }

        const inOrder = this.codeTestsElement.getAttribute('ordered') != 'false';
        if(inOrder == false)
        {
            const promises = tests.map(item => this.runTest(item, true, context));
            await Promise.all(promises);
        }
        else
        {
            for(let i = 0; i < tests.length; i++)
            {
                const test = tests[i];
                // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
                if(this.shouldContinueRunningTests == false) { break; }                
                await this.runTest(test, true, context);
            }
        }

        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        { 
            await this.#endTests(tests, context);
            return;
        }
        
        await this.runHook('afterAllState', undefined, context);
        await this.#endTests(tests, context);
    }
    async #endTests(tests: CodeTestElement[], context: TestContext)
    {
        await this.runHook('requiredAfterAnyState', undefined, context);        
        for(let i = 0; i < tests.length; i++)
        {
            tests[i].enable();
        }
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
    }
    async runTest(test: CodeTestElement|undefined, inLoop: boolean, testContext?: TestContext)
    {
        if(test == null) { return; }

        if(inLoop == false)
        {
            const tests = this.codeTestsElement.findElements<CodeTestElement>('code-test');
            for(let i = 0; i < tests.length; i++)
            {
                tests[i].disable();
            }
        }

        testContext = testContext ?? await this.createTestContext(test);
        if(testContext.testElement == null)
        {
            testContext.testElement = test;
        }

        if(inLoop == false)
        { 
            await this.runHook('requiredBeforeAnyState', undefined, testContext);
            if(this.shouldContinueRunningTests == false)
            {
                await this.#endTest(testContext, inLoop);
                return;
            }
        }

        await this.runHook('beforeEachState', test, testContext); 
        if(this.shouldContinueRunningTests == false)
        {
            await this.#endTest(testContext, inLoop);
            return;
        }

        await test.runTest(this, testContext);
        // @ts-expect-error ts doesn't realize that this may have been set to false in runTest
        if(this.shouldContinueRunningTests == false)
        {
            await this.#endTest(testContext, inLoop);
            return;
        }

        await this.runHook('afterEachState', test, testContext);
        await this.#endTest(testContext, inLoop);
    }
    async #endTest(context: TestContext, inLoop: boolean)
    {
        if(inLoop == true) { return; }

        await this.runHook('requiredAfterAnyState', undefined, context);
        const tests = this.codeTestsElement.findElements<CodeTestElement>('code-test');
        for(let i = 0; i < tests.length; i++)
        {
            tests[i].enable();
        }
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.TestEnd, { bubbles: true, composed: true, cancelable: true, detail: { target: this }}));
    }

    async runHook(testStateName: keyof Pick<CodeTestsState, 'requiredBeforeAnyState'|'requiredAfterAnyState'|'beforeEachState'|'afterEachState'|'beforeAllState'|'afterAllState'>, 
        test: CodeTestElement|undefined,
        testContext: TestContext)
    {
        const testState = this.codeTestsElement.state[testStateName];
        if(testState == null) { return NOTESTDEFINED; }

        if(this.codeTestsElement.state.isCanceled == true)
        {
            return { success: false, value: "Testing has been canceled." };
        }        

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

            hookResult = await testState.test(testContext);

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
    //#endregion Running

    //#region Utils
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
        else if(typeof result == 'boolean')
        {
            return { result, resultCategory: (result == true) ? 'success' : 'fail' };
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

    async createTestContext(testElement?: CodeTestElement)
    {
        const context: TestContext = {
            detail: {},
            codeTestsElement: this.codeTestsElement,
            testElement
        };

        // this.testContext = context;
        
        if(this.codeTestsElement.state.contextHook != null)
        {
            await this.codeTestsElement.state.contextHook(context);
        }
        this.codeTestsElement.dispatchEvent(new CustomEvent(CodeTestEvent.Context, { bubbles: true, composed: true, detail: { context } }));
        return context;
    }
    //#endregion Utils
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