import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, Tests } from './api';

export type CodeTestsProperties = 
{
    
}

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'code-tests';
export class CodeTestsElement extends HTMLElement
{
    componentParts: Map<string, HTMLElement> = new Map();
    getElement<T extends HTMLElement = HTMLElement>(id: string)
    {
        if(this.componentParts.get(id) == null)
        {
            const part = this.findElement(id);
            if(part != null) { this.componentParts.set(id, part); }
        }

        return this.componentParts.get(id) as T;
    }
    findElement<T extends HTMLElement = HTMLElement>(id: string) { return this.shadowRoot!.getElementById(id) as T; }

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.#boundClickHandler = this.#onClick.bind(this);
    }

    connectedCallback()
    {
        this.addEventListener('click', this.#boundClickHandler)
        const testsPath = this.getAttribute('src')
        ?? this.getAttribute('test')
        ?? this.getAttribute('tests')
        ?? this.getAttribute('run')
        ?? this.getAttribute('path');

        if(testsPath == null) { return; }

        this.loadTests(testsPath);
    }
    disconnectedCallback()
    {
        this.removeEventListener('click', this.#boundClickHandler);
    }

    #boundClickHandler!: (event: Event) => void;
    #onClick(event: Event)
    {
        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run')) as HTMLButtonElement;
        if(runButton == null) { return; }

        const parentListItem = runButton.closest('li');
        if(parentListItem == null)
        {
            const isRunAll = runButton.hasAttribute('data-all');
            if(isRunAll == true)
            { 
                this.runTests();
            }
            return;
        }

        const testId = parentListItem.dataset.testId;
        if(testId == null) { return; }
        const test = this.#tests.get(testId);
        if(test == null) { return; }
        this.#runTest(testId, test);
    }

    async loadTests(path: string)
    {
        try
        {
            const currentPath = window.location.href;
            const moduleDirectory = currentPath + path.replace(/(.*?)[^/]*\..*$/, '$1');
            const modulePath = currentPath + path;
            let moduleContent = await (await fetch(modulePath)).text();
            moduleContent = moduleContent.replaceAll(/['"`](((\.\/)|(\.\.\/))+(.*))['"`]/g, `'${moduleDirectory}$1'`);
            // console.log(moduleContent);
            const moduleFile = new File([moduleContent], path.substring(path.lastIndexOf('/')), { type: 'text/javascript' });
            const moduleURL = URL.createObjectURL(moduleFile);
            // const module = await import(`data:text/javascript,${encodeURIComponent(moduleContent)}`);
            // const module = await (await fetch(moduleURL)).text();
            const module = await import(moduleURL);
            // console.log(module);
            const tests: Tests = module.tests ?? module.default;
            if(tests == undefined)
            {
                throw new Error(`Unable to find tests definition in file at path: ${path}`);
            }

            for(const [description, test] of Object.entries(tests))
            {
                this.#addTest(description, test);
            }
            // console.log(module);
        }
        catch(error)
        {
            this.#addProcessError("An error occurred while loading the tasks:", error);
        }
    }

    async runTests()
    {
        this.classList.add('running');
        this.toggleAttribute('success', false);
        const promises = [];
        for(const [id, test] of this.#tests)
        {
            promises.push(this.#runTest(id, test));
        }
        await Promise.all(promises);

        const failedTests = this.shadowRoot!.querySelectorAll('[success="false"]');
        this.setAttribute('success', failedTests.length == 0 ? 'true' : 'false');
        this.classList.remove('running');
    }
    async #runTest(testId: string, test: (...args: any[]) => void|Promise<void>)
    {
        const testElement = this.getElement('tests').querySelector(`[data-test-id="${testId}"]`);
        testElement?.toggleAttribute('success', false);
        testElement?.classList.add('running');
        
        // clean up old test result
        const errorMessageElement = testElement?.querySelector(".error-message");
        if(errorMessageElement != null)
        {
            errorMessageElement.textContent = "";
        }
        const detailsElement = testElement?.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = false;
        }

        // execute test
        try
        {
            await test();
            testElement?.classList.remove('running');
            if(testElement != null)
            {
                testElement.setAttribute('success', 'true');
            }
        }
        catch(error)
        {
            testElement?.classList.remove('running');
            if(testElement != null)
            {
                this.#setTestError(testElement as HTMLLIElement, "Failed:", error);
            }
            console.error(error);
        }
    }

    static create(properties: CodeTestsProperties)
    {
        const element = document.createElement('code-tests');
        console.log(properties);
        return element;
    }

    #tests: Map<string, (...args: any[]) => void|Promise<void>> = new Map();
    #addTest(description: string, test: (...args: any[]) => void|Promise<void>)
    {
        const testId = generateId();
        this.#tests.set(testId, test);
        
        const testElement = document.createElement('li');
        testElement.dataset.testId = testId;
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        
        const descriptionElement = document.createElement('span');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = description;
        summaryElement.append(descriptionElement);

        const runButton = document.createElement('button');
        runButton.classList.add('run');
        runButton.textContent = '⏵';
        runButton.title = "Run Test";
        summaryElement.append(runButton);

        const errorElement = document.createElement('div');
        errorElement.classList.add("error");
        
        const codeElement = document.createElement('code');
        const preElement = document.createElement('pre');
        preElement.classList.add('error-message');
        
        codeElement.appendChild(preElement);

        errorElement.appendChild(codeElement);

        detailsElement.append(summaryElement);
        detailsElement.append(errorElement);

        testElement.append(detailsElement);

        this.getElement('tests').append(testElement);
    }
    #setTestError(testElement: HTMLLIElement, message: string, error?: unknown)
    {
        if(error instanceof Error)
        {
            message += `\n${error.message}`;
        }
        
        testElement.setAttribute('success', 'false');

        const errorMessageElement = testElement.querySelector(".error-message");
        if(errorMessageElement != null)
        {
            errorMessageElement.textContent = message;
        }

        const detailsElement = testElement.querySelector('details');
        if(detailsElement != null)
        {
            detailsElement.open = true;
        }
    }
    #addProcessError(message: string, error?: unknown)
    {
        if(error instanceof Error)
        {
            message += `\n${error.message}`;
        }
        
        const errorElement = document.createElement('li');
        const codeElement = document.createElement('code');
        const preElement = document.createElement('pre');
        preElement.textContent = message;
        codeElement.append(preElement);
        errorElement.append(codeElement);
        this.getElement('tests').append(errorElement);
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

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}

export { CodeTests, expect };