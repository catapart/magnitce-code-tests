export type TestResult = { success: boolean, expected?: any, value: string|HTMLElement, data?: any };
export type TestResultType = void|undefined|string|TestResult|HTMLElement;
export type GroupTestResults = { totalTests: number, totalPassed: number, totalPercentage: number, duration: number }