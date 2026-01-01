import { CodeTestsElement, Hook } from "../code-tests";
import { CodeTestElement } from "../components/code-test/code-test";
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

            if(hooks[Hook.BeforeAll] != null)
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
        })
        this.codeTestsElement.findElement('#tests').append(testElement);
        return testId;
    }

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