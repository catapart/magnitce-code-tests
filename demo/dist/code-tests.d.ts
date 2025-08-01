declare class TestPromise<T> extends Promise<T> {
    toBeDefined(valueName?: string): Promise<void>;
    toBe(value: any, exact?: boolean): Promise<void>;
    toContainText(value: string): Promise<void>;
    toHaveAttribute(value: string): Promise<void>;
}
declare const BEFOREALL: unique symbol;
declare const BEFOREEACH: unique symbol;
declare const AFTERALL: unique symbol;
declare const AFTEREACH: unique symbol;
declare class CodeTests {
    #private;
    static timeoutMS: number;
    static expect<T>(value: T): TestPromise<T>;
    static expectSync<T>(value: T): TestPromise<T>;
    static expectBefore<T>(value: T): TestPromise<T>;
}
declare function expect(value: any): TestPromise<any>;

type CodeTestsProperties = {};
declare class CodeTestsElement extends HTMLElement {
    #private;
    componentParts: Map<string, HTMLElement>;
    getElement<T extends HTMLElement = HTMLElement>(id: string): T;
    findElement<T extends HTMLElement = HTMLElement>(id: string): T;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    loadTests(path: string): Promise<void>;
    runTests(): Promise<void>;
    static create(properties: CodeTestsProperties): HTMLElement;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
}

export { AFTERALL, AFTEREACH, BEFOREALL, BEFOREEACH, CodeTests, CodeTestsElement, type CodeTestsProperties, expect };
