import { expect, HookType } from '../libs/code-tests.js';

export default {
    // [HookType.RequiredBeforeAny]: async () =>
    // {
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     console.log('this should run once before any other test is run');
    // },
    // [HookType.BeforeAll]: async () =>
    // {
    //     console.log('this should run once before all tests');
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    //     await expect(true).toBe(true);
    // },
    [HookType.BeforeEach]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run before each test');
    },
    [HookType.AfterEach]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run after each test');
    },
    [HookType.AfterAll]: async () =>
    {
        console.log('this should run once after all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error("error");
        await expect(true).toBe(true);
    },
    [HookType.RequiredAfterAny]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run once after any other test has been run');
    },
    'should be useful for before-after test': async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
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