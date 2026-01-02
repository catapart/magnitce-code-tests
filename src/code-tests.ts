import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, prompt  } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

import './components/run-button/run-button';
import { RunButton } from './components/run-button/run-button';
import { TestManager } from './managers/test.manager';
import { ContextManager } from './managers/context.manager';
import { CodeTestElement } from './components/code-test/code-test';

export type CodeTestsState = 
{
    isRunning: boolean;
    isCanceled: boolean;
    groupResultType: 'none'|'success'|'fail';

    hasRun: boolean,
    beforeResult: string,
    beforeResultType: 'none'|'success'|'fail',
    afterResult: string,
    afterResultType: 'none'|'success'|'fail',
}

export const Hook = 
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeEach: 'beforeeach',
    AfterEach: 'aftereach',
    RequiredBeforeAny: 'requiredbeforeany',
    RequiredAfterAny: 'requiredafterany',
} as const;
export type HookType = typeof Hook[keyof typeof Hook];


const NOTESTDEFINED = Symbol('No Test Defined');

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'code-tests';
export class CodeTestsElement extends HTMLElement
{
    state: CodeTestsState = 
    { 
        isRunning: false,
        isCanceled: false,
        groupResultType: 'none',

        hasRun: false,
        beforeResult: '',
        beforeResultType: 'none',
        afterResult: '',
        afterResultType: 'none',
    };
        
    setState(state: CodeTestsState)
    {
        this.state = state;
        this.#render();
    }
    setStateProperties(state: Partial<CodeTestsState>)
    {
        this.setState({
            ...this.state,
            ...state
        });
    }

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from(this.shadowRoot!.querySelectorAll(query) as Iterable<T>) as Array<T>; }

    // #hooks: {
    //     [Hook.BeforeAll]?: Test,
    //     [Hook.AfterAll]?: Test,
    //     [Hook.BeforeEach]?: Test,
    //     [Hook.AfterEach]?: Test,
    //     [Hook.RequiredBeforeAny]?: Test,
    //     [Hook.RequiredAfterAny]?: Test,
    // } = { };

    #continueRunningTests: boolean = true;

    #contextManager: ContextManager;

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.#boundClickHandler = this.#onClick.bind(this);

        this.#contextManager = new ContextManager(this);
    }
    
    connectedCallback()
    {
        this.#init();
    }
    disconnectedCallback()
    {
        this.#destroy();
    }

    #isInitialized: boolean = false;
    async #init()
    {
        if(this.#isInitialized == true) { return; }

        await this.#initManagers();
        await this.#initComponents();
        await this.#initHandlers();

        this.#isInitialized = true;

        if(this.getAttribute('auto') == 'false') { return; }
        const testsPath = this.#getCurrentTestsPath();
        this.#contextManager.loadTests(testsPath);
    }
    async #initManagers()
    {
        
    }
    async #initComponents()
    {
        // const runAllButton = this.findElement<RunButton>('#run-all-button');
    }
    async #initHandlers()
    {
        this.addEventListener('click', this.#boundClickHandler);
    }
    #destroy()
    {
        this.removeEventListener('click', this.#boundClickHandler);
    }

    #boundClickHandler!: (event: Event) => void;
    #onClick(event: Event)
    {
        const runAllButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.id == 'run-all-button') as HTMLButtonElement;
        if(runAllButton != null)
        {
            this.runTests();
            return;
        }
        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run-test-button')) as HTMLButtonElement;

        const test = runButton.closest<CodeTestElement>('code-test') ?? undefined;

        this.#contextManager.runTest(test);

        // if(parentListItem == null)
        // {

        //     const isRunAll = runButton.hasAttribute('data-all');
        //     if(isRunAll == true)
        //     { 
        //         if(this.classList.contains('running'))
        //         {
        //             if(this.classList.contains('canceled')) { return; }
        //             this.cancel();
        //         }
        //         else
        //         {
        //             this.runTests();
        //         }
        //     }
        //     return;
        // }

        // const testId = parentListItem.dataset.testId;
        // if(testId == null) { return; }
        // const test = this.#tests.get(testId);
        // if(test == null) { return; }
        
        // this.isCanceled = false;
        // this.classList.remove('canceled');
        // this.part.remove('canceled');
        // this.#runTest(testId, test);
    }

    #getCurrentTestsPath()
    {
        return this.getAttribute('src')
        ?? this.getAttribute('test')
        ?? this.getAttribute('tests')
        ?? this.getAttribute('run')
        ?? this.getAttribute('path')
        ?? undefined;
    }

    #render()
    {
        this.classList.toggle('running', this.state.isRunning);
        this.part.toggle('running', this.state.isRunning);

        this.classList.toggle('canceled', this.state.isCanceled);
        this.part.toggle('canceled', this.state.isCanceled);
        
        this.toggleAttribute('success', this.state.groupResultType == 'success');

        const runAllButtonLabel = this.findElement('run-all-button-label');
        if(runAllButtonLabel != null)
        {
            runAllButtonLabel.textContent = this.state.isRunning == true
            ? "Cancel"
            : "Run Tests";
        }

        const beforeAllHookElement = this.findElement(`#before-all-details`);
        beforeAllHookElement.toggleAttribute('success', this.state.beforeResultType == 'success');
        beforeAllHookElement.classList.toggle('success', this.state.beforeResultType == 'success');
        beforeAllHookElement.part.toggle('success', this.state.beforeResultType == 'success');
        beforeAllHookElement.classList.toggle('fail', this.state.beforeResultType == 'fail');
        beforeAllHookElement.part.toggle('fail', this.state.beforeResultType == 'fail');
        
        const afterAllHookElement = this.findElement(`#after-all-details`);
        afterAllHookElement.toggleAttribute('success', this.state.afterResultType == 'success');
        afterAllHookElement.classList.toggle('success', this.state.afterResultType == 'success');
        afterAllHookElement.part.toggle('success', this.state.afterResultType == 'success');
        afterAllHookElement.classList.toggle('fail', this.state.afterResultType == 'fail');
        afterAllHookElement.part.toggle('fail', this.state.afterResultType == 'fail');
    }

    async runTests()
    {
        const tests = this.findElements<CodeTestElement>('code-test');
        return this.#contextManager.runTests(tests);
    }

    reset()
    {
        const tests = this.findElements<CodeTestElement>('code-test');
        for(let i = 0; i < tests.length; i++)
        {
            const test = tests[i];
            test.reset();
        }

        this.setStateProperties({
            groupResultType: 'none',
            beforeResult: '',
            beforeResultType: 'none',
            afterResult: '',
            afterResultType: 'none',
        });
    }



    // isCanceled: boolean = false;
    // cancel()
    // {
    //     this.isCanceled = true;
    //     this.classList.add('canceled');
    //     this.part.add('canceled');

    //     this.dispatchEvent(new CustomEvent(CodeTestEvent.Cancel, { bubbles: true, composed: true }));
    // }

    
    // #clearTestStatuses()
    // {
    //     for(const [testId, _test] of this.#tests)
    //     {
    //         const testElement = this.findElement('#tests').querySelector<HTMLElement>(`[data-test-id="${testId}"]`);
    //         if(testElement == null)
    //         {
    //             this.#addProcessError(`Unable to find test element for test: ${testId}`);
    //             return;
    //         }
            
    //         testElement.toggleAttribute('success', false);
    //         testElement.classList.remove('success', 'fail');
    //         testElement.part.remove('success', 'fail');
    //     } 

    //     const beforeAllHookElement = this.findElement(`#before-all-details`);
    //     beforeAllHookElement.toggleAttribute('success', false);
    //     beforeAllHookElement.classList.remove('success', 'fail');
    //     beforeAllHookElement.part.remove('success', 'fail');
        
    //     const afterAllHookElement = this.findElement(`#after-all-details`);
    //     afterAllHookElement.toggleAttribute('success', false);
    //     afterAllHookElement.classList.remove('success', 'fail');
    //     afterAllHookElement.part.remove('success', 'fail');
    // }
    
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

    // static create(_properties: CodeTestsProperties)
    // {
    //     const element = document.createElement('code-tests');
    //     // console.log(properties);
    //     return element;
    // }

    // #setTestResult(testElement: HTMLElement, valueElement: HTMLElement, success: boolean, beforeOrAfter?: 'before'|'after')
    // {
    //     testElement.setAttribute('success', success == true ? 'true' : 'false');
    //     testElement.classList.toggle('success', success);
    //     testElement.part.toggle('success', success);
    //     testElement.classList.toggle('fail', !success);
    //     testElement.part.toggle('fail', !success);
        
    //     const iconElement = testElement.querySelector('.result-icon');
    //     iconElement?.classList.toggle('success', success);
    //     iconElement?.part.toggle('success', success);
    //     iconElement?.classList.toggle('fail', !success);
    //     iconElement?.part.toggle('fail', !success);

    //     const resultElement = testElement.querySelector(`.${beforeOrAfter == undefined
    //     ? 'result'
    //     : beforeOrAfter == 'before'
    //     ? 'before-result'
    //     : 'after-result'}`);
    //     if(resultElement == null)
    //     {
    //         this.#addProcessError(`Unable to find result element`);
    //         return;
    //     }

    //     resultElement.innerHTML = '';
    //     resultElement.appendChild(valueElement);
    // }
    // #createDefaultResult(message: string, success: boolean, _beforeOrAfter?: 'before'|'after')
    // {    
    //     const codeElement = document.createElement('code');
    //     codeElement.classList.add('code');
    //     codeElement.part.add('code');
    //     const preElement = document.createElement('pre');
    //     preElement.textContent = message;
    //     const className = (success == true)
    //     ? 'success-message'
    //     : 'error-message';
    //     preElement.classList.add('pre', className);
    //     preElement.part.add('pre', className);
    //     codeElement.appendChild(preElement);
    //     return codeElement;
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

    // #updateListType(type: 'ordered'|'unordered')
    // {
    //     if(type == 'ordered')
    //     {
    //         const list = this.shadowRoot!.querySelector<HTMLElement>('ul');
    //         if(list == null) { return; }

    //         const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

    //         const newList = document.createElement('ol');
    //         if(items != null)
    //         {
    //             newList.append(...items);
    //         }
    //         newList.id = 'tests';

    //         list.replaceWith(newList);
    //     }
    //     else
    //     {
    //         const list = this.shadowRoot!.querySelector<HTMLElement>('ol');
    //         if(list == null) { return; }

    //         const items = this.shadowRoot?.querySelectorAll<HTMLElement>('li');

    //         const newList = document.createElement('ul');
    //         newList.id = 'tests';
    //         if(items != null)
    //         {
    //             newList.append(...items);
    //         }

    //         list.replaceWith(newList);
    //     }
    // }

    static observedAttributes = ['in-order'];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string)
    {
        if(attributeName == 'in-order')
        {
            // if(newValue == undefined)
            // {
            //     this.#updateListType('unordered');
            // }
            // else
            // {
            //     this.#updateListType('ordered');
            // }
        }
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}
export
{ 
    CodeTests,
    expect,
    prompt
};