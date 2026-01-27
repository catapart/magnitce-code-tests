
import { default as style } from './code-tests.css?raw';
import { default as html } from './code-tests.html?raw';
import { CodeTestsContext } from './context';
import { CodeTestElement, type CodeTestState, type TestResultCategory, type TestResultState, type TestState } from './code-test';
import { CodeTestEvent } from './code-test-event';
import type { Test } from './types/test.type';
import type { GroupTestResults, TestResult, TestResultType } from './types/test-result.type';
import { TestPromise } from './test-promise';
import { assignClassAndIdToPart } from 'ce-part-utils';
import type { TestContext } from './types/test-context.type';

export type CodeTestsState = 
{
    isCanceled: boolean;
    
    beforeAllState?: TestState,
    afterAllState?: TestState,
    beforeEachState?: TestState,
    afterEachState?: TestState,
    requiredBeforeAnyState?: TestState,
    requiredAfterAnyState?: TestState,
    resetHook?: Test,
    contextHook?: Test,
}

export const Hook = 
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeEach: 'beforeeach',
    AfterEach: 'aftereach',
    RequiredBeforeAny: 'requiredbeforeany',
    RequiredAfterAny: 'requiredafterany',
    Reset: 'reset',
    Context: 'context',
} as const;
export type HookType = typeof Hook[keyof typeof Hook];



const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);

const COMPONENT_TAG_NAME = 'code-tests';
export class CodeTestsElement extends HTMLElement
{
    state: CodeTestsState = 
    { 
        isCanceled: false,
        
        beforeAllState: undefined,
        afterAllState: undefined,
        beforeEachState: undefined,
        afterEachState: undefined,
        requiredBeforeAnyState: undefined,
        requiredAfterAnyState: undefined,
        resetHook: undefined,
        contextHook: undefined,
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
        else if(testCategory == 'success' || statesCategory == 'success')
        {
            return 'success';
        }
        return 'none';
    }

    #context!: CodeTestsContext;

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    }
    
    connectedCallback()
    {
        this.#init();
    }
    disconnectedCallback()
    {
        this.#destroy();
    }

    #isInitializing: boolean = false;
    #isInitialized: boolean = false;
    async #init()
    {
        if(this.#isInitializing == true || this.#isInitialized == true) { return; }
        this.#isInitializing = true;

        assignClassAndIdToPart(this.shadowRoot!);

        this.addEventListener('click', this.#boundClickHandler);
        this.findElement<HTMLInputElement>('#enabled').addEventListener('change', this.#boundEnabledHandler);

        await new Promise<void>(resolve => requestAnimationFrame(() =>
        {
            // wait a frame to make sure that the ContextManager class
            // has been interpreted by the browser
            // (connectedCallback may fire before the library loads)
            this.#context = new CodeTestsContext(this);

            this.#isInitialized = true;
            this.#isInitializing = false;

            const allowAutoLoad = this.dispatchEvent(new CustomEvent(CodeTestEvent.Init, { bubbles: true, composed: true, cancelable: true, detail: { target: this }}));
            if(allowAutoLoad == false) { resolve(); return; }

            let autoAttribute = this.getAttribute('auto');
            if(autoAttribute == 'false') { resolve(); return; }

            this.reloadTests();
            
            resolve();
        }));

        //todo: 
        // replace test-runner file in code-tests (so that the code-tests library referenced from test-runner loads tests correctly)
        // remove code-tests dependency from magnit-ce package (reference code test content from updated test-runner)
    }
    #destroy()
    {
        this.removeEventListener('click', this.#boundClickHandler);
        this.findElement<HTMLInputElement>('#enabled').removeEventListener('change', this.#boundEnabledHandler);
        this.#isInitialized = false;
        this.#isInitializing = false; // need to include this, in case destroyed before async init finishes
    }

    #boundClickHandler: (event: Event) => void= this.#onClick.bind(this);
    #onClick(event: Event)
    {
        const runAllButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.id == 'run-all-button') as HTMLButtonElement;
        if(runAllButton != null)
        {
            if(this.classList.contains('running'))
            {
                this.cancel();
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

        const reloadButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.id =='reload-button') as HTMLButtonElement;
        if(reloadButton != null)
        {
            this.reloadTests();
        }

        const runButton = event.composedPath().find(item => item instanceof HTMLButtonElement && item.classList.contains('run-test-button')) as HTMLButtonElement;
        if(runButton == null) { return; }

        const test = runButton.closest<CodeTestElement>('code-test') ?? undefined;
        this.#context.runTest(test, false);
    }
    #boundEnabledHandler: (event: Event) => void= this.#enabled_onChange.bind(this);
    #enabled_onChange(event: Event)
    {
        const input = event.target as HTMLInputElement;
        const allowToggle = this.dispatchEvent(new CustomEvent(CodeTestEvent.Enabled, { bubbles: true, composed: true, cancelable: true, detail: { target: this }}));
        if(allowToggle == false) { event.preventDefault(); event.stopPropagation(); input.checked = !input.checked; }
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
        const isRunning = this.getIsRunning();
        const resultCategory = this.getResultCategory();
        
        const hasBeforeAllState = this.state.beforeAllState != null;
        const hasBeforeEachState = this.state.beforeEachState != null;
        const hasRequiredBeforeAnyState = this.state.requiredAfterAnyState != null;

        const hasAfterAllState = this.state.beforeAllState != null;
        const hasAfterEachState = this.state.beforeEachState != null;
        const hasRequiredAfterAnyState = this.state.requiredAfterAnyState != null;

        const hasBeforeHook = hasRequiredBeforeAnyState == true || hasBeforeAllState == true || hasBeforeEachState == true;
        const hasAfterHook = hasRequiredAfterAnyState == true || hasAfterAllState == true || hasAfterEachState == true;

        this.classList.toggle('canceled', this.state.isCanceled);
        this.part.toggle('canceled', this.state.isCanceled);

        this.classList.toggle('running', isRunning == true);
        this.part.toggle('running', isRunning == true);
        this.toggleAttribute('success', resultCategory == 'success');
        this.classList.toggle('success', resultCategory == 'success');
        this.part.toggle('success', resultCategory == 'success');
        this.classList.toggle('fail', resultCategory == 'fail');
        this.part.toggle('fail', resultCategory == 'fail');

        this.classList.toggle('has-before-hook', hasBeforeHook);
        this.part.toggle('has-before-hook', hasBeforeHook);
        this.classList.toggle('has-after-hook', hasAfterHook);
        this.part.toggle('has-after-hook', hasAfterHook);

        this.classList.toggle('has-before-all-hook', hasBeforeAllState);
        this.part.toggle('has-before-all-hook', hasBeforeAllState);

        this.classList.toggle('has-after-all-hook', hasAfterAllState);
        this.part.toggle('has-after-all-hook', hasAfterAllState);

        this.classList.toggle('has-before-each-hook', hasBeforeEachState);
        this.part.toggle('has-before-each-hook', hasBeforeEachState);

        this.classList.toggle('has-after-each-hook', hasAfterEachState);
        this.part.toggle('has-after-each-hook', hasAfterEachState);

        this.classList.toggle('has-required-before-hook', hasRequiredBeforeAnyState);
        this.part.toggle('has-required-before-hook', hasRequiredBeforeAnyState);

        this.classList.toggle('has-required-after-hook', hasRequiredAfterAnyState);
        this.part.toggle('has-required-after-hook', hasRequiredAfterAnyState);

        const runAllButtonLabel = this.findElement('.run-all-button-label');
        if(runAllButtonLabel != null)
        {
            runAllButtonLabel.textContent = isRunning == true
            ? "Cancel"
            : (resultCategory == 'fail' || resultCategory == 'success')
            ? "Reset"
            : "Run Tests";
            runAllButtonLabel.title = isRunning == true
            ? "Cancel the testing"
            : (resultCategory == 'fail' || resultCategory == 'success')
            ? "Reset the tests so they can be run again"
            : "Run the tests";
        }
        const runAllIcon = this.findElement('.run-all-button-icon');
        if(runAllIcon != null)
        {
            runAllIcon.innerHTML = isRunning == true
            ? '<use href="#icon-definition_cancel"></use>'
            : (resultCategory == 'fail' || resultCategory == 'success')
            ? '<use href="#icon-definition_reset"></use>'
            : '<use href="#icon-definition_arrow"></use>';
        }

        this.#renderHook(this.state.beforeAllState, '#before-all-results');
        this.#renderHook(this.state.afterAllState, '#after-all-results');
        this.#renderHook(this.state.requiredBeforeAnyState, '#required-before-any-results');
        this.#renderHook(this.state.requiredAfterAnyState, '#required-after-any-results');

        const title = this.findElement('#title');
        if(title != null)
        {
            title.textContent = this.getAttribute('label') ?? 'Tests';
        }

        this.#renderGroupResults();
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
    #renderGroupResults()
    {
        const results = this.collectTestResults();

        const progress = this.findElement<HTMLProgressElement>('#results-progress-value');
        if(progress != null)
        {
            progress.max = results.totalTests;
            progress.value = results.totalPassed;
        }
        const totalPassedElement = this.findElement('#total-tests-passed-value');
        if(totalPassedElement != null)
        {
            totalPassedElement.textContent = results.totalPassed.toString();
        }
        const totalTestsElement = this.findElement('#total-tests-count-value');
        if(totalTestsElement != null)
        {
            totalTestsElement.textContent = results.totalTests.toString();
        }
        const totalPercentElement = this.findElement('#passed-total-percent-value');
        if(totalPercentElement != null)
        {
            totalPercentElement.textContent = results.totalPercentage.toFixed(1);
        }
        const durationElement = this.findElement('#duration-value');
        if(durationElement != null)
        {
            durationElement.textContent = results.duration > 10 ? results.duration.toFixed(0) : results.duration.toFixed(2);
        }
    }

    collectTestResults()
    {
        const tests = this.findElements<CodeTestElement>('code-test');
        const totalTests = tests.length;
        const totalPassed = tests.filter(item => item.state.testState?.resultCategory == 'success').length;
        const totalPercentage = (totalTests == 0) ? 0 : (totalPassed/totalTests) * 100;
        const duration = tests.reduce((result, item, _index) =>
        {
            return result + (item.state.testState?.duration ?? 0);
        }, 0);
        
        const results: GroupTestResults = {
            totalTests,
            totalPassed,
            totalPercentage,
            duration,
        }

        return results;
    }

    async runTests()
    {
        const tests = this.findElements<CodeTestElement>('code-test');
        return this.#context.runTests(tests);
    }

    async reloadTests()
    {
        this.findElement('#tests').innerHTML = '';
        await this.reset();
        const testsPath = this.#getCurrentTestsPath();
        this.#context.loadTests(testsPath);
    }

    async reset()
    {
        const tests = this.findElements<CodeTestElement>('code-test');
        for(let i = 0; i < tests.length; i++)
        {
            const test = tests[i];
            const beforeEachState: TestResultState|undefined = (this.state.beforeEachState != null)
            ? { resultCategory: 'none',
                resultContent: '',
                hasRun: this.state.beforeEachState.hasRun,
                isRunning: this.state.beforeEachState.isRunning,
                duration: 0
            }
            : undefined;
            const afterEachState: TestResultState|undefined = (this.state.afterEachState != null)
            ? { resultCategory: 'none',
                resultContent: '',
                hasRun: this.state.afterEachState.hasRun,
                isRunning: this.state.afterEachState.isRunning,
                duration: 0
            }
            : undefined;
            if(beforeEachState != null) { test.state.beforeEachState = beforeEachState; }
            if(afterEachState != null) { test.state.afterEachState = afterEachState; }
            test.reset();
        }

        const beforeAllState: TestState|undefined = (this.state.beforeAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.beforeAllState.test, isRunning: false, hasRun: false, duration: 0 };
        const afterAllState: TestState|undefined = (this.state.afterAllState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.afterAllState.test, isRunning: false, hasRun: false, duration: 0 };
        const beforeEachState: TestState|undefined = (this.state.beforeEachState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.beforeEachState.test, isRunning: false, hasRun: false, duration: 0 };
        const afterEachState: TestState|undefined = (this.state.afterEachState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.afterEachState.test, isRunning: false, hasRun: false, duration: 0 };
        const requiredBeforeAnyState: TestState|undefined = (this.state.requiredBeforeAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredBeforeAnyState.test, isRunning: false, hasRun: false, duration: 0 };
        const requiredAfterAnyState: TestState|undefined = (this.state.requiredAfterAnyState == undefined)
        ? undefined
        : { resultContent: '', resultCategory: 'none', test: this.state.requiredAfterAnyState.test, isRunning: false, hasRun: false, duration: 0 };

        this.setStateProperties({
            isCanceled: false,
            
            beforeAllState,
            afterAllState,
            beforeEachState,
            afterEachState,
            requiredAfterAnyState,
            requiredBeforeAnyState,
        });

        this.#context.shouldContinueRunningTests = true;

        if(this.state.resetHook != null)
        {
            await this.state.resetHook(await this.#context.createTestContext());
        }

        this.dispatchEvent(new CustomEvent(CodeTestEvent.Reset, { bubbles: true, composed: true }));
    }

    cancel()
    {
        this.state.isCanceled = true;
        this.#context.shouldContinueRunningTests = false;
        this.classList.add('canceled');
        this.part.add('canceled');

        this.dispatchEvent(new CustomEvent(CodeTestEvent.Cancel, { bubbles: true, composed: true }));
    }

    static observedAttributes = ['open', 'label'];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string)
    {
        if(attributeName == 'open')
        {
            this.findElement('#component-details').toggleAttribute('open', (newValue != undefined));
        }
        else if(attributeName == 'label')
        {
            const title = this.findElement("#title");
            if(title != null)
            {
                title.textContent = newValue ?? "Tests";
            }
        }
    }
}

if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestsElement);
}




export function expect<T>(value: T)
{
    const promise = new TestPromise<T>(async (resolve, _reject) =>
    {
        if(value instanceof Promise)
        {
            const result = await value;
            resolve(result);
            return;
        }

        resolve(value);
    });
    return promise;
}


export type PromptOptions = {
    parentElement?: HTMLElement,
    template?: HTMLTemplateElement,
    acceptLabel?: string,
    rejectLabel?: string,
    onAccept?: () => void,
    onReject?: () => void
};
export async function prompt(context: TestContext, message: string, options?: PromptOptions)
{
    const host = context.codeTestsElement;
    let promptElement: HTMLElement|null = null;
    const result = await new Promise<boolean>((resolve, _reject) =>
    {
        const template = options?.template ?? host.querySelector<HTMLTemplateElement>('.prompt-template') ?? host.findElement<HTMLTemplateElement>('#prompt-template');
        promptElement = createElementFromTemplate(template);
        promptElement.querySelector('.label')!.textContent = message;
        
        const clickHandler = (event: Event) =>
        {
            const composedPath = event.composedPath();
            
            const acceptButton = composedPath.find(item => item instanceof HTMLButtonElement && item.classList.contains('accept'));
            if(acceptButton != null)
            {
                const result = options?.onAccept?.() ?? true;
                promptElement!.removeEventListener('click', clickHandler);
                resolve(result);
                return;
            }
            
            const rejectButton = composedPath.find(item => item instanceof HTMLButtonElement && item.classList.contains('reject'));
            if(rejectButton != null)
            {
                const result = options?.onReject?.() ?? false;
                promptElement!.removeEventListener('click', clickHandler);
                resolve(result);
                return;
            }
        }
        promptElement.addEventListener('click', clickHandler);

        if(options?.acceptLabel != null)
        {
            promptElement.querySelector('.accept')!.textContent = options.acceptLabel;
        }
        if(options?.rejectLabel != null)
        {
            promptElement.querySelector('.reject')!.textContent = options.rejectLabel;
        }
        
        host.dispatchEvent(new CustomEvent(CodeTestEvent.PromptInject, { bubbles: true, composed: true, detail: { codeTestElement: context.testElement, promptElement } }));
        
        const parent = options?.parentElement ?? context.testElement?.getMessageElement();
        parent?.append(promptElement);
    });
    
    if(promptElement != null)
    {
        //@ts-expect-error ts thinks this doesn't work (it does)
        promptElement.remove();
    }

    host.dispatchEvent(new CustomEvent(CodeTestEvent.PromptResult, { bubbles: true, composed: true, detail: { target: host, result } }));

    return result;
}
export function createElementFromTemplate(target: string|HTMLTemplateElement, parent?: HTMLElement)
{
    const templateNode =((target instanceof HTMLTemplateElement) ? target : document.querySelector<HTMLTemplateElement>(target));
    if(templateNode == null)
    {
        throw new Error(`Unable to find template element from selector: ${target}`);
    }
    const firstChild = (templateNode.content.cloneNode(true) as HTMLElement).firstElementChild as HTMLElement;
    if(firstChild == null)
    {
        throw new Error(`Unable to find first child of template element`);
    }

    parent?.append(firstChild);

    return firstChild;
}

export type { TestContext, GroupTestResults, CodeTestState, Test, TestResult, TestResultCategory, TestResultState, TestResultType, TestState }

export {
    CodeTestEvent,
    CodeTestElement,
    TestPromise,
}