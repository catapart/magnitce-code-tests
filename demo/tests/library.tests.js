import { Library } from "../library.js"
import { expect } from '../../vanilla/code-tests.js';

// export default {
//     'should add': async () =>
//     {
//         const library = new Library();
//         const result = library.add(5, 7);
//         await expect(result).toBe(12);
//     }
// }
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
    'should subtract': async () =>
    {
        const library = new Library();
        const result = library.add(5, 7);
        await expect(result).toBe(-2);
    }
}