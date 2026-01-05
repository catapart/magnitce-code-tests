import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTests, expect, prompt  } from './api';
import { assignClassAndIdToPart } from 'ce-part-utils';

import { ContextManager } from './managers/context.manager';
import { CodeTestElement, type TestResultState, type TestState } from './components/code-test/code-test';
import { CodeTestEvent } from './maps/code-test-event';

export type CodeTestsState = 
{
    // isOpen: boolean;
    // isRunning: boolean;
    isCanceled: boolean;
    // groupResultType: 'none'|'success'|'fail';

    // hasRun: boolean,
    
    beforeAllState?: TestState,
    afterAllState?: TestState,
    beforeEachState?: TestState,
    afterEachState?: TestState,
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
        // isOpen: false,
        // isRunning: false,
        isCanceled: false,
        // groupResultType: 'none',

        // hasRun: false,
        beforeAllState: undefined,
        afterAllState: undefined,
        beforeEachState: undefined,
        afterEachState: undefined,
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

    setTestStateProperties(key: keyof CodeTestsState, state: Partial<TestState>)
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

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from(this.shadowRoot!.querySelectorAll(query) as Iterable<T>) as Array<T>; }

    
    getIsRunning()
    {
        const testsAreRunning = this.findElements<CodeTestElement>('code-test').find(item => item.isRunning() == true) != null;

        console.log(testsAreRunning)

        return testsAreRunning == true
        || this.state.requiredBeforeAnyState?.isRunning == true
        || this.state.requiredAfterAnyState?.isRunning == true
        || this.state.beforeAllState?.isRunning == true
        || this.state.afterAllState?.isRunning == true;
    }
    
    getResultCategory()
    {
        const testCategory = this.findElements<CodeTestElement>('code-test').reduce((result, item, _index) => {
            const category = item.resultCategory();
            if(result == 'fail' || category == 'fail') { return 'fail'; }
            if((result == 'success' || result == '') && category == 'success') { return 'success'; }
            if(category == 'none') { return 'none'; }
            return 'none';
        }, '');

        const states = [
            this.state.requiredBeforeAnyState,
            this.state.requiredAfterAnyState,
            this.state.beforeAllState,
            this.state.afterAllState,
        ];
        const statesCategory = states.reduce<string|null>((result, item, _index) => {
            if(item == null) { return null; }
            const category = item?.resultCategory;
            if(result == 'fail' || category == 'fail') { return 'fail'; }
            if((result == 'success' || result == '') && category == 'success') { return 'success'; }
            if(category == 'none') { return 'none'; }
            return 'none';
        }, '');

        if(testCategory == 'none' && statesCategory == null)
        {
            return 'none';
        }
        else if(testCategory == 'fail' || statesCategory == 'fail')
        {
            return 'fail';
        }
        else if(testCategory == 'success' && statesCategory == 'success')
        {
            return 'success';
        }
        return 'none';
    }

    #contextManager: ContextManager;

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
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
        
        // this.findElement('#component-details').addEventListener('close', this.#boundDetailsToggleHandler);
    }
    #destroy()
    {
        this.removeEventListener('click', this.#boundClickHandler);
    }

    #boundClickHandler: (event: Event) => void= this.#onClick.bind(this);
    #onClick(event: Event)
    {
        const runAllButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.id == 'run-all-button') as HTMLButtonElement;
        if(runAllButton != null)
        {
            if(this.classList.contains('running'))
            {
                this.#contextManager.shouldContinueRunningTests = false;
            }
            else if(this.classList.contains('fail') || this.classList.contains('success'))
            {
                this.reset();
            }
            else
            {
                this.runTests();
            }
            return;
        }

        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run-test-button')) as HTMLButtonElement;
        if(runButton == null) { return; }

        const test = runButton.closest<CodeTestElement>('code-test') ?? undefined;
        this.#contextManager.runTest(test, false);

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
    // #boundDetailsToggleHandler: (event: Event) => void = this.#componentDetails_onToggle.bind(this);
    // #componentDetails_onToggle(event: Event)
    // {
    //     event.preventDefault();
    //     event.stopPropagation();
    //     return false;
    //     // this.setStateProperties({ isOpen: false })
    // }

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
        const isRunning = this.getIsRunning();
        const resultCategory = this.getResultCategory();

        this.classList.toggle('canceled', this.state.isCanceled);
        this.part.toggle('canceled', this.state.isCanceled);

        // const componentDetails = this.findElement('#component-details');
        // componentDetails.toggleAttribute('open', this.state.isOpen);
        this.classList.toggle('running', isRunning == true);
        this.part.toggle('running', isRunning == true);
        this.toggleAttribute('success', resultCategory == 'success');
        this.classList.toggle('success', resultCategory == 'success');
        this.part.toggle('success', resultCategory == 'success');
        this.classList.toggle('fail', resultCategory == 'fail');
        this.part.toggle('fail', resultCategory == 'fail');
        
        // this.toggleAttribute('success', this.state.groupResultType == 'success');

        const runAllButtonLabel = this.findElement('.run-all-button-label');
        if(runAllButtonLabel != null)
        {
            runAllButtonLabel.textContent = isRunning == true
            ? "Cancel"
            : (resultCategory == 'fail')
            ? "Reset"
            : "Run Tests";
        }
        const runAllIcon = this.findElement('.run-all-button-icon');
        if(runAllIcon != null)
        {
            runAllIcon.innerHTML = isRunning == true
            ? '<use href="#icon-definition_cancel"></use>'
            : (resultCategory == 'fail')
            ? '<use href="#icon-definition_reset"></use>'
            : '<use href="#icon-definition_arrow"></use>';
        }

        this.#renderHook(this.state.beforeAllState, '#before-all-results');
        this.#renderHook(this.state.afterAllState, '#after-all-results');
        this.#renderHook(this.state.requiredBeforeAnyState, '#required-before-any-results');
        this.#renderHook(this.state.requiredAfterAnyState, '#required-after-any-results');

        //todo: convert to toggles; start from contextManager.loadTests
        // this.classList.remove('has-before-hook', 'has-before-all-hook', 'has-before-each-hook', 'has-required-before-hook');
        // this.part.remove('has-before-hook', 'has-before-all-hook', 'has-before-each-hook', 'has-required-before-hook');
        // this.classList.remove('has-after-hook', 'has-after-all-hook', 'has-after-each-hook', 'has-required-after-hook');
        // this.part.remove('has-after-hook', 'has-after-all-hook', 'has-after-each-hook', 'has-required-after-hook');
    }
    #renderHook(hookState: TestState|undefined, elementSelector: string)
    {
        const resultsElement = this.findElement(elementSelector);
        if(hookState?.resultContent instanceof HTMLElement)
        {
            resultsElement.append(hookState.resultContent);
        }
        else if(typeof hookState?.resultContent == 'string')
        {
            resultsElement.innerHTML = hookState.resultContent;
        }
        
        const detailsElement = resultsElement.closest('details')!;
        
        detailsElement.toggleAttribute('open', hookState != undefined && hookState.resultCategory != 'none');
        detailsElement.classList.toggle('running', hookState?.isRunning == true);
        detailsElement.part.toggle('running', hookState?.isRunning == true);
        detailsElement.toggleAttribute('success', hookState?.resultCategory == 'success');
        detailsElement.classList.toggle('success', hookState?.resultCategory == 'success');
        detailsElement.part.toggle('success', hookState?.resultCategory == 'success');
        detailsElement.classList.toggle('fail', hookState?.resultCategory == 'fail');
        detailsElement.part.toggle('fail', hookState?.resultCategory == 'fail');
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
            const beforeEachState: TestResultState|undefined = (this.state.beforeEachState != null)
            ? { resultCategory: 'none',
                resultContent: '',
                hasRun: this.state.beforeEachState.hasRun,
                isRunning: this.state.beforeEachState.isRunning
            }
            : undefined;
            const afterEachState: TestResultState|undefined = (this.state.afterEachState != null)
            ? { resultCategory: 'none',
                resultContent: '',
                hasRun: this.state.afterEachState.hasRun,
                isRunning: this.state.afterEachState.isRunning
            }
            : undefined;
            if(beforeEachState != null) { test.state.beforeEachState = beforeEachState; }
            if(afterEachState != null) { test.state.afterEachState = afterEachState; }
            test.reset();
        }

        const beforeAllState: TestState|undefined = (this.state.beforeAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.beforeAllState.test, isRunning: false, hasRun: false };
        const afterAllState: TestState|undefined = (this.state.afterAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.afterAllState.test, isRunning: false, hasRun: false };
        const beforeEachState: TestState|undefined = (this.state.beforeEachState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.beforeEachState.test, isRunning: false, hasRun: false };
        const afterEachState: TestState|undefined = (this.state.afterEachState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.afterEachState.test, isRunning: false, hasRun: false };
        const requiredBeforeAnyState: TestState|undefined = (this.state.requiredBeforeAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredBeforeAnyState.test, isRunning: false, hasRun: false };
        const requiredAfterAnyState: TestState|undefined = (this.state.requiredAfterAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredAfterAnyState.test, isRunning: false, hasRun: false };

        this.setStateProperties({
            isCanceled: false,
            
            beforeAllState,
            afterAllState,
            beforeEachState,
            afterEachState,
            requiredAfterAnyState,
            requiredBeforeAnyState,
        });

        this.#contextManager.shouldContinueRunningTests = true;

        this.dispatchEvent(new CustomEvent(CodeTestEvent.Reset, { bubbles: true, composed: true }));
    }



    // isCanceled: boolean = false;
    // cancel()
    // {
    //     this.isCanceled = true;
    //     this.classList.add('canceled');
    //     this.part.add('canceled');

    //     this.dispatchEvent(new CustomEvent(CodeTestEvent.Cancel, { bubbles: true, composed: true }));
    // }

    static observedAttributes = ['open'];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string)
    {
        if(attributeName == 'open')
        {
            this.findElement('#component-details').toggleAttribute('open', (newValue != undefined));
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