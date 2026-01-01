export type TestResult = { success: boolean, expected: any, value: any; };
export type TestResultType = void|undefined|string|TestResult|HTMLElement;