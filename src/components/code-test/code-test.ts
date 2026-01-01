import { default as style } from './code-test.css?raw';

export type CodeTestState = {
    testId: string;
    description: string;
    hasRun: boolean;
    beforeResult: string;
    beforeResultType: 'none'|'success'|'fail';
    result: string;
    resultType: 'none'|'success'|'fail';
    afterResult: string;
    afterResultType: 'none'|'success'|'fail';
}


const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(`${style}`);

const COMPONENT_TAG_NAME = 'code-test';
export class CodeTestElement extends HTMLElement
{
    state: CodeTestState = 
    { 
        testId: '',
        description: 'none',
        hasRun: false,
        beforeResult: '',
        beforeResultType: 'none',
        result: '',
        resultType: 'none',
        afterResult: '',
        afterResultType: 'none',
    };
        
    setState(state: CodeTestState)
    {
        this.state = state;
        this.#render();
    }
    setStateProperties(state: Partial<CodeTestState>)
    {
        this.setState({
            ...this.state,
            ...state
        });
    }

    findElement<T extends HTMLElement = HTMLElement>(query: string) { return this.shadowRoot!.querySelector(query) as T; }
    findElements<T extends HTMLElement = HTMLElement>(query: string) { return Array.from<T>(this.shadowRoot!.querySelectorAll(query)); }

    constructor()
    {
        super();
        // this.attachShadow({ mode: "open" });
        // this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    }
    
    connectedCallback()
    {
        this.#render();
    }
    // disconnectedCallback()
    // {
    //     this.removeEventListener('click', this.#boundClickHandler);
    // }

    // async #init()
    // {
    //     // await DataService.init();
    //     // ContextManager.init(this);
    //     // InputService.init(this);
    //     // await this.findElement<TargetComponent>('target-component').init();
    // }
    // async destroy()
    // {
    //     // this.findElement<TargetComponent>('target-component').destroy();
    //     // ContextManager.destroy();
    // }

    // #boundClickHandler: (event: Event) => void = this.#onClick.bind(this);
    // async #onClick(event: Event)
    // {
    //     // const composedPath = event.composedPath();

    //     // const button = composedPath.find(item => item instanceof HTMLButtonElement && item.id == 'target-button') as HTMLButtonElement;
    //     // if(button != null)
    //     // {
    //     //     this.findElement<TargetComponent>('target-component').handleClick();
    //     //     return;
    //     // }
        
    // }

    #render()
    {
        this.innerHTML = `<details class="test-details" part="test-details">
            <summary class="test-summary" part="test-summary">
                <svg class="icon arrow-icon"><use href="#icon-definition_arrow"></use></svg>
                <div class="result-icon" part="result-icon"></div>
                <span class="test-description description">${this.state.description}</span>
                <button type="button" class="run-test-button" part="run-test-button" title="Run Test">
                    <slot name="run-button-content">
                        <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
                        <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Test</span></slot>
                    </slot>
                </button>
            </summary>
            <div class="before-result test-before-result" part="before-result test-before-result">${this.state.beforeResult}</div>
            <div class="result test-result" part="result test-result">${this.state.result}</div>
            <div class="after-result test-after-result" part="after-result test-after-result">${this.state.afterResult}</div>
        </details>`;

        this.dataset.testId = this.state.testId;
        this.classList.add('test');
        this.part.add('test');
    }
    
    // static observedAttributes = [ "myprop" ];
    // attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) 
    // {
    //     if(attributeName == "myprop")
    //     {
            
    //     }
    // }
    
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, CodeTestElement);
}