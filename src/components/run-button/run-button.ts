export type RunButtonState = {
    isActive: boolean;
}

const COMPONENT_TAG_NAME = 'run-button';
export class RunButton extends HTMLButtonElement
{
    state: RunButtonState = 
    { 
        isActive: false,
    };
    
    setState(state: RunButtonState)
    {
        this.state = state;
        this.#render();
    }

    constructor()
    {
        super();
        this.innerHTML = `<slot name="run-button-content">
    <slot name="run-button-icon"><svg class="icon arrow-icon run-button-icon"><use href="#icon-definition_arrow"></use></svg></slot>
    <slot name="run-button-label"><span class="run-button-label button-label label icon">Run Tests</span></slot>
</slot>`;
    }

    async init()
    {
        this.setAttribute('type', 'button');
    }
    async destroy()
    {
        
    }

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
        this.toggleAttribute('disabled', this.state.isActive == false);
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
    customElements.define(COMPONENT_TAG_NAME, RunButton, { extends: 'button' });
}