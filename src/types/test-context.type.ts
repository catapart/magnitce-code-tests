import type { CodeTestElement } from "../code-test"
import type { CodeTestsElement } from "../code-tests"

export type TestContext =
{
    codeTestsElement: CodeTestsElement,
    testElement?: CodeTestElement,
    detail: any,
}