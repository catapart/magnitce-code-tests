import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, prompt  } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

import { ContextManager } from './managers/context.manager';
import { CodeTestElement, type TestState } from './components/code-test/code-test';

export type CodeTestsState = 
{
    isRunning: boolean;
    isCanceled: boolean;
    groupResultType: 'none'|'success'|'fail';

    hasRun: boolean,
    
    beforeAllState?: TestState,
    afterAllState?: TestState,
    requiredBeforeAnyState?: TestState,
    requiredAfterAnyState?: TestState
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
        beforeAllState: undefined,
        afterAllState: undefined,
        requiredBeforeAnyState: undefined,
        requiredAfterAnyState: undefined,
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

        await this.#initHandlers();

        this.#isInitialized = true;

        if(this.getAttribute('auto') == 'false') { return; }
        const testsPath = this.#getCurrentTestsPath();
        this.#contextManager.loadTests(testsPath);
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
        if(runButton == null) { return; }

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
        beforeAllHookElement.toggleAttribute('success', this.state.beforeAllState?.resultCategory == 'success');
        beforeAllHookElement.classList.toggle('success', this.state.beforeAllState?.resultCategory == 'success');
        beforeAllHookElement.part.toggle('success', this.state.beforeAllState?.resultCategory == 'success');
        beforeAllHookElement.classList.toggle('fail', this.state.beforeAllState?.resultCategory == 'fail');
        beforeAllHookElement.part.toggle('fail', this.state.beforeAllState?.resultCategory == 'fail');
        
        const afterAllHookElement = this.findElement(`#after-all-details`);
        afterAllHookElement.toggleAttribute('success', this.state.afterAllState?.resultCategory == 'success');
        afterAllHookElement.classList.toggle('success', this.state.afterAllState?.resultCategory == 'success');
        afterAllHookElement.part.toggle('success', this.state.afterAllState?.resultCategory == 'success');
        afterAllHookElement.classList.toggle('fail', this.state.afterAllState?.resultCategory == 'fail');
        afterAllHookElement.part.toggle('fail', this.state.afterAllState?.resultCategory == 'fail');
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

        const beforeAllState: TestState|undefined = (this.state.beforeAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.beforeAllState.test };
        const afterAllState: TestState|undefined = (this.state.afterAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.afterAllState.test };
        const requiredBeforeAnyState: TestState|undefined = (this.state.requiredBeforeAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredBeforeAnyState.test };
        const requiredAfterAnyState: TestState|undefined = (this.state.requiredAfterAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredAfterAnyState.test };

        this.setStateProperties({
            groupResultType: 'none',
            
            beforeAllState,
            afterAllState,
            requiredAfterAnyState,
            requiredBeforeAnyState,
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

    static observedAttributes = ['unordered'];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string)
    {
        if(attributeName == 'unordered')
        {
            // if(newValue == undefined)
            // {
            //     this.#updateListType('ordered');
            // }
            // else
            // {
            //     this.#updateListType('unordered');
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