declare class TestPromise<T> extends Promise<T> {
    toBeDefined(valueName?: string): Promise<void>;
    toBe(value: any, exact?: boolean): Promise<void>;
    toContainText(value: string): Promise<void>;
    toHaveAttribute(value: string): Promise<void>;
}
declare class CodeTests {
    #private;
    static timeoutMS: number;
    static expect<T>(value: T): TestPromise<T>;
    static expectSync<T>(value: T): TestPromise<T>;
    static expectBefore<T>(value: T): TestPromise<T>;
    static prompt(host: CodeTestsElement, parent: HTMLElement, message: string, options?: PromptOptions): Promise<boolean>;
    static createElementFromTemplate(target: string | HTMLTemplateElement, parent?: HTMLElement): HTMLElement;
}
declare function expect(value: any): TestPromise<any>;
type PromptOptions = {
    acceptLabel?: string;
    rejectLabel?: string;
    onAccept?: () => void;
    onReject?: () => void;
};
declare function prompt(host: CodeTestsElement, parent: HTMLElement, message: string, options?: PromptOptions): Promise<boolean>;

type CodeTestsProperties = {};
declare enum HookType {
    BeforeAll = "beforeall",
    AfterAll = "afterall",
    BeforeEach = "beforeeach",
    AfterEach = "aftereach",
    RequiredBeforeAny = "requiredbeforeany",
    RequiredAfterAny = "requiredafterany"
}
declare enum CodeTestEventType {
    BeforeAll = "beforeall",
    AfterAll = "afterall",
    BeforeTest = "beforetest",
    AfterTest = "aftertest",
    Cancel = "cancel"
}
declare class CodeTestsElement extends HTMLElement {
    #private;
    componentParts: Map<string, HTMLElement>;
    getElement<T extends HTMLElement = HTMLElement>(id: string): T;
    findElement<T extends HTMLElement = HTMLElement>(id: string): T;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    loadTests(testsPath?: string): Promise<void>;
    isCanceled: boolean;
    cancel(): void;
    runTests(): Promise<void>;
    static create(properties: CodeTestsProperties): HTMLElement;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
}

export { CodeTestEventType, CodeTests, CodeTestsElement, type CodeTestsProperties, HookType, expect, prompt };
