import { CodeTestsElement } from "./code-tests";

export abstract class TestResultComparers
{
    static async toBeDefined(valueName?: string)
    {
        // convert to parameter
        // move to promise class
        const target = await this;

        if(target == undefined)
        {
            throw new Error(`${(valueName != null) ? valueName : 'Value'} is undefined`);
        }
    }
    static async toBe(value: any, exact: boolean = false)
    {
        const target = await this;

        const result = (exact == true)
        ? target === value
        : target == value;

        if(result == false)
        {
            throw new Error(`  Value is not equal.\n  Expected: ${value}\n  Result: ${target}`);
        }
    }
    static async toContainText(_value: string)
    {
        // const _target = await this;

    }
    static async toHaveAttribute(value: string)
    {
        const target = await this;

        if(!(target instanceof HTMLElement))
        {
            throw new Error("Unable to check for attribute on non-HTMLElement target");
        }
        
        if(target.getAttribute(value))
        {
            throw new Error("Taret does not have attribute");
        }
    }
}

export class ExpectedValue
{
    toBeDefined(valueName?: string) { return TestResultComparers.toBeDefined(valueName); }
}

export class TestPromise<T> extends Promise<T>
{
    async toBeDefined(valueName?: string)
    {
        const target = await this;

        if(target == undefined)
        {
            throw new Error(`${(valueName != null) ? valueName : 'Value'} is undefined`);
        }
    }
    async toBe(value: any, exact: boolean = false)
    {
        const target = await this;

        const result = (exact == true)
        ? target === value
        : target == value;

        if(result == false)
        {
            throw new Error(`  Value is not equal.\n  Expected: ${value}\n  Result: ${target}`);
        }
    }
    async toContainText(_value: string)
    {
        // const target = await this;

    }
    async toHaveAttribute(value: string)
    {
        const target = await this;

        if(!(target instanceof HTMLElement))
        {
            throw new Error("Unable to check for attribute on non-HTMLElement target");
        }
        
        if(target.getAttribute(value))
        {
            throw new Error("Target does not have attribute");
        }
    }
}

export class CodeTests
{
    static timeoutMS = 500;
    // static #expectInterval?: ReturnType<typeof setInterval>;
    // static #expectPromise?: TestPromise<void>;
    static expect<T>(value: T)
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
    static expectSync<T>(value: T)
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
    static expectBefore<T>(value: T)
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

    static async prompt(host: CodeTestsElement, parent: HTMLElement, message: string, options?: PromptOptions)
    {
        return new Promise<boolean>((resolve, _reject) =>
        {
            const template = host.findElement<HTMLTemplateElement>('prompt-template');
            const promptElement = CodeTests.createElementFromTemplate(template);
            promptElement.querySelector('.label')!.textContent = message;

            
            const clickHandler = (event: Event) =>
            {
                const composedPath = event.composedPath();
                
                const acceptButton = composedPath.find(item => item instanceof HTMLButtonElement && item.classList.contains('accept'));
                if(acceptButton != null)
                {
                    const result = options?.onAccept?.() ?? true;
                    promptElement.removeEventListener('click', clickHandler);
                    resolve(result);
                    return;
                }
                
                const rejectButton = composedPath.find(item => item instanceof HTMLButtonElement && item.classList.contains('reject'));
                if(rejectButton != null)
                {
                    const result = options?.onReject?.() ?? false;
                    promptElement.removeEventListener('click', clickHandler);
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
            
            const details = parent instanceof HTMLDetailsElement
            ? parent
            : parent.querySelector<HTMLDetailsElement>('.test-details');
            if(details != null)
            {
                details.open = true;
            }
            parent.querySelector('.result')?.append(promptElement);
        });
    }

    
    static createElementFromTemplate(target: string|HTMLTemplateElement, parent?: HTMLElement)
    {
        const templateNode =((target instanceof HTMLTemplateElement) ? target : document.querySelector<HTMLTemplateElement>(target));
        if(templateNode == null)
        {
            throw new Error(`Unable to find template element from selector: ${target}`);
        }
        const firstChild = (templateNode.content.cloneNode(true) as HTMLElement).querySelector<HTMLElement>('*');
        if(firstChild == null)
        {
            throw new Error(`Unable to find first child of template element`);
        }

        parent?.append(firstChild);

        return firstChild;
    }
}

export function expect(value: any) { return CodeTests.expect(value); }

export type PromptOptions = {
    acceptLabel?: string,
    rejectLabel?: string,
    onAccept?: () => void,
    onReject?: () => void
};
export function prompt(host: CodeTestsElement, parent: HTMLElement, message: string, options?: PromptOptions) { return CodeTests.prompt(host, parent, message, options); }