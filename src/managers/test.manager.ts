
import { Hook } from "../code-tests";
import { NOTESTDEFINED } from "../constants";
import type { TestResultType } from "../types/test-result.type";
import type { Test } from "../types/test.type";
import type { Tests } from "../types/tests.type";
import type { ContextManager } from "./context.manager";

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

export class TestManager
{
    // #hooks: Hooks = { };
    
    #tests: Map<string, Test> = new Map();

    async loadTests(path: string)
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

        this.#tests = new Map(Object.entries(tests));

        // this.#hooks = hooks;

        return { tests, hooks };
    }
    async #loadModule(path: string)
    {
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
        const module = await import(/* @vite-ignore */moduleURL);
        return module;
    }

    addTest(testId: string, test: Test)
    {
        this.#tests.set(testId, test);
    }


    async runBeforeAllHook()
    {
        // const beforeHook = this.#hooks[Hook.BeforeAll]
        // if(beforeHook != null)
        // {
        //     let hookResult;
        //     try
        //     {
        //         const beforeAllHookElement = this.findElement(`#before-all-details`);
        //         beforeAllHookElement.classList.add('running');
        //         beforeAllHookElement.part.add('running');

        //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //         hookResult = await beforeHook(this, beforeAllHookElement);

        //         this.#handleHookResult(hookResult, true, 'before', false);
        //         beforeAllHookElement.part.remove('running');
        //         beforeAllHookElement.classList.remove('running');
        //     }
        //     catch(error)
        //     {
        //         this.#handleHookResult(hookResult, false, 'before', false, error as Error);
        //         console.error(error);
        //         this.#continueRunningTests = false;
        //         this.classList.remove('running');
        //         this.part.remove('running');
        //         if(playButtonLabel != null)
        //         {
        //             playButtonLabel.textContent = "Run Tests";
        //         }
        //         this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
        //         return;
        //     }
        // }
    }
    async runAfterAllHook()
    {
        // const afterHook = this.#hooks[Hook.AfterAll];
        // if(afterHook != null)
        // {
        //     let hookResult;
        //     try
        //     {
        //         const afterAllHookElement = this.findElement(`#after-all-details`);
        //         afterAllHookElement.classList.add('running');
        //         afterAllHookElement.part.add('running');
                
        //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //         hookResult = await afterHook(this, afterAllHookElement);
        //         this.#handleHookResult(hookResult, true, 'after', false);

        //         afterAllHookElement.part.remove('running');
        //         afterAllHookElement.classList.remove('running');
        //     }
        //     catch(error)
        //     {
        //         this.#handleHookResult(hookResult, false, 'after', false, error as Error);
        //         console.error(error);

                
        //         const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
        //         if(requiredAfterHook != null)
        //         {
        //             let hookResult;
        //             try
        //             {
        //                 const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
        //                 requiredAfterAnyHookElement.classList.add('running');
        //                 requiredAfterAnyHookElement.part.add('running');

        //                 //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //                 if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //                 hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

        //                 this.#handleHookResult(hookResult, true, 'after', true);
        //                 requiredAfterAnyHookElement.part.remove('running');
        //                 requiredAfterAnyHookElement.classList.remove('running');
        //             }
        //             catch(error)
        //             {
        //                 this.#handleHookResult(hookResult, false, 'after', true, error as Error);
        //                 console.error(error);
        //             }
        //         }

        //         this.#continueRunningTests = false;
        //         this.classList.remove('running');
        //         this.part.remove('running');
        //         if(playButtonLabel != null)
        //         {
        //             playButtonLabel.textContent = "Run Tests";
        //         }
        //         this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
        //         return;
        //     }
        // }
    }
    async runRequiredBeforeAnyHook()
    {
        // const requiredBeforeHook = this.#hooks[Hook.RequiredBeforeAny];
        // if(requiredBeforeHook != null)
        // {
        //     let hookResult;
        //     try
        //     {
        //         const requiredBeforeAnyHookElement = this.findElement(`#required-before-any-details`);
        //         requiredBeforeAnyHookElement.classList.add('running');
        //         requiredBeforeAnyHookElement.part.add('running');

        //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //         hookResult = await requiredBeforeHook(this, requiredBeforeAnyHookElement);

        //         this.#handleHookResult(hookResult, true, 'before', true);
        //         requiredBeforeAnyHookElement.part.remove('running');
        //         requiredBeforeAnyHookElement.classList.remove('running');
        //     }
        //     catch(error)
        //     {
        //         this.#handleHookResult(hookResult, false, 'before', true, error as Error);
        //         console.error(error);
        //         this.#continueRunningTests = false;
        //         this.classList.remove('running');
        //         this.part.remove('running');
        //         if(playButtonLabel != null)
        //         {
        //             playButtonLabel.textContent = "Run Tests";
        //         }
        //         this.dispatchEvent(new CustomEvent(CodeTestEvent.AfterAll, { bubbles: true, composed: true }));
        //         return;
        //     }
        // }
    }
    async runRequiredAfterAnyHook()
    {
        // const requiredAfterHook = this.#hooks[Hook.RequiredAfterAny];
        // if(requiredAfterHook == null) { return NOTESTDEFINED; }
        
        // if(requiredAfterHook != null)
        // {
        //     let hookResult;
        //     try
        //     {
        //         const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
        //         requiredAfterAnyHookElement.classList.add('running');
        //         requiredAfterAnyHookElement.part.add('running');

        //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
        //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
        //         hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

        //         this.#handleHookResult(hookResult, true, 'after', true);
        //         requiredAfterAnyHookElement.part.remove('running');
        //         requiredAfterAnyHookElement.classList.remove('running');
        //     }
        //     catch(error)
        //     {
        //         this.#handleHookResult(hookResult, false, 'after', true, error as Error);
        //         console.error(error);
        //         this.#continueRunningTests = false;
        //     }
        // }
    }

    // async runHook(contextManager: ContextManager, hook: Test)
    // {
    //     try
    //     {
    //         if(contextManager.codeTestsElement.state.isCanceled == true) { throw new Error("Tests have been cancelled"); }
    //         return await hook(contextManager.codeTestsElement, contextManager.codeTestsElement);
    //     }
    //     catch(error)
    //     {
    //         console.error(error);
    //         contextManager.shouldContinueRunningTests = false;
    //         return { success: false, value: `Failed: ${(error as Error).message}` }
    //     }

    //     // return await hook(contextManager.codeTestsElement);
    //     //     try
    //     //     {
    //     //         const requiredAfterAnyHookElement = this.findElement(`#required-after-any-details`);
    //     //         requiredAfterAnyHookElement.classList.add('running');
    //     //         requiredAfterAnyHookElement.part.add('running');

    //     //         //@ts-expect-error ts doesn't understand that this value can change while awaiting
    //     //         if(this.isCanceled == true) { throw new Error("Test has been cancelled"); }
    //     //         hookResult = await requiredAfterHook(this, requiredAfterAnyHookElement);

    //     //         this.#handleHookResult(hookResult, true, 'after', true);
    //     //         requiredAfterAnyHookElement.part.remove('running');
    //     //         requiredAfterAnyHookElement.classList.remove('running');
    //     //     }
    //     //     catch(error)
    //     //     {
    //     //         this.#handleHookResult(hookResult, false, 'after', true, error as Error);
    //     //         console.error(error);
    //     //         this.#continueRunningTests = false;
    //     //     }
    // }
}