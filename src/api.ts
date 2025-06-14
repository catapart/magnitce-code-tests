export class TestPromise<T> extends Promise<T>
{
    async toBeDefined()
    {
        const target = await this;

        if(typeof target == 'undefined')
        {
            throw new Error("Value is undefined");
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
            throw new Error("Taret does not have attribute");
        }
    }
}

export type Tests = { [key: string]: (...args: any[]) => void|Promise<void> };

export class CodeTests
{
    static timeoutMS = 500;
    static #expectInterval?: ReturnType<typeof setInterval>;
    static #expectPromise?: TestPromise<void>;
    static expect<T>(value: T)
    {
        
        const promise = new TestPromise<T>(async (resolve, reject) =>
        {
            if(value instanceof Promise)
            {
                const result = await value;
                resolve(result);
                return;
            }
            
            if(typeof value !== 'undefined')
            {
                resolve(value);
                return;
            }

            if(this.#expectInterval != null)
            {
                clearInterval(this.#expectInterval);
            }

            const startTime = Date.now();
            this.#expectInterval = setInterval(() =>
            {
                const currentTime = Date.now();
                if(currentTime - startTime > CodeTests.timeoutMS)
                {
                    clearInterval(this.#expectInterval);
                    reject();
                }
                if(typeof value !== 'undefined')
                {
                    clearInterval(this.#expectInterval);
                    if(CodeTests.#expectPromise != null)
                    {
                        resolve(value);
                    }
                    else
                    {
                        console.error("Expect Promise is not set");
                        reject();
                    }
                }
            }, 20);
        });
        return promise;
    }
}

export function expect(value: any) { return CodeTests.expect(value); }