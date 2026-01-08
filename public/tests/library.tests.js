import { Library } from "../libs/library.js"
import { expect } from '../libs/code-tests.min.js';

export const tests = {
    'should add': async () =>
    {
        const library = new Library();
        const result = library.add(5, 7);
        await expect(result).toBe(12);
    },
    'should await delayed result': async () =>
    {
        const library = new Library();
        const result = library.accessDelayedTarget(); // this should be awaited, but expect will await it for you.
        await expect(result).toBe("Delayed");
    },
    "should subtract (but doesn't, to demonstrate a default failure)": async () =>
    {
        const library = new Library();
        const result = library.add(5, 7);
        await expect(result).toBe(-2);
    }
}