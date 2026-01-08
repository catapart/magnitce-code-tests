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
    async toContainText(value: string)
    {
        const target = await this;
        if(target instanceof HTMLElement)
        {
            return { success: target.textContent.includes(value), index: target.textContent.indexOf(value) };
        }
        if(typeof target != 'string') { return false; }
        return { success: target.includes(value), index: target.indexOf(value) };
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