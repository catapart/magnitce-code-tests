
import { Hook } from "../code-tests";
import type { Test } from "../types/test.type";
import type { Tests } from "../types/tests.type";

export type Hooks = {
    [Hook.BeforeAll]?: Test,
    [Hook.AfterAll]?: Test,
    [Hook.BeforeEach]?: Test,
    [Hook.AfterEach]?: Test,
    [Hook.RequiredBeforeAny]?: Test,
    [Hook.RequiredAfterAny]?: Test,
};

export class TestManager
{
    #hooks: Hooks = { };
    
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

        this.#tests = new Map(Object.entries(tests));
        this.#hooks = hooks;

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
}