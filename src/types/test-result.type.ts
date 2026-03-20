import type { TestResult } from "../test-result";

export type TestResultType = void|undefined|string|TestResult|HTMLElement;
export type GroupTestResults = { totalTests: number, totalPassed: number, totalPercentage: number, duration: number }