import type { CodeTestsElement } from "../code-tests";
import type { TestContext } from "./test-context.type";
import type { TestResultType } from "./test-result.type";

export type Test = <T extends TestResultType>(host: CodeTestsElement, parent: HTMLElement, context: TestContext) => T|Promise<T>;