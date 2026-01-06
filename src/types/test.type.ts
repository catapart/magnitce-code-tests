import type { TestContext } from "./test-context.type";
import type { TestResultType } from "./test-result.type";

export type Test = <T extends TestResultType>(context: TestContext) => T|Promise<T>;