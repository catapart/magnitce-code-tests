import { AFTERALL, AFTEREACH, BEFOREALL, BEFOREEACH, expect } from '../../dist/code-tests.js';

export default {
    [BEFOREALL]: async () =>
    {
        console.log('this should run once before all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
    },
    [BEFOREEACH]: async () =>
    {
        console.log('this should run before each test');
    },
    [AFTEREACH]: async () =>
    {
        console.log('this should run after each test');
    },
    [AFTERALL]: async () =>
    {
        console.log('this should run once after all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
    },
    'should be useful for before-after test': async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await expect(true).toBe(true);
    },
    'should also be useful for before-after test': async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
    },
    'should be a third useful test for before-after test': async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
    },
}