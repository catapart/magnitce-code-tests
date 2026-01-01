import type { CodeTestsElement } from "../code-tests";
import type { TestResultType } from "./test-result.type";

export type Test = <T extends TestResultType>(host: CodeTestsElement, parent: HTMLElement) => T|Promise<T>;