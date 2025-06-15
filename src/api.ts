export class TestPromise<T> extends Promise<T>
{
    async toBeDefined()
    {
        const target = await this;

        if(target == undefined)
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
export type Test = (...args: any[]) => void|Promise<void>;
export type Tests = { [key: string|symbol]: Test };
export const BEFOREALL = Symbol("beforeAll");
export const BEFOREEACH = Symbol("beforeEach");
export const AFTERALL = Symbol("afterAll");
export const AFTEREACH = Symbol("afterEach");

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

            resolve(value);
        });
        return promise;
    }
}

export function expect(value: any) { return CodeTests.expect(value); }