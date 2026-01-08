import { expect, Hook } from '../libs/code-tests.min.js';

export default {
    [Hook.Context]: async (context) =>
    {
        context.detail.value = 'Init';
    },
    [Hook.RequiredBeforeAny]: async () =>
    {
        // throw new Error("Test");
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run once before any other test is run');
    },
    [Hook.BeforeAll]: async (context) =>
    {
        console.log('this should run once before all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(context.codeTestsElement.state.isCanceled);
        await expect(context.codeTestsElement.state.isCanceled).toBe(false);
    },
    [Hook.BeforeEach]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run before each test');
    },
    [Hook.AfterEach]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run after each test');
    },
    [Hook.AfterAll]: async () =>
    {
        console.log('this should run once after all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
    },
    [Hook.RequiredAfterAny]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // throw new Error('error');
        console.log('this should run once after any other test has been run');
    },
    'should be useful for before-after test': async (context) =>
    {
        await expect(context.detail.value).toBe("Init");
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "A";
        console.log(context.detail.value);
        await expect(context.detail.value).toBe("A");
    },
    'should also be useful for before-after test': async (context) =>
    {
        await expect(context.detail.value).toBe("A");
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "B";
        console.log(context.detail.value);
        await expect(context.detail.value).toBe("B");
    },
    'should be a third useful test for before-after test': async (context) =>
    {
        await expect(context.detail.value).toBe("B");
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "C";
        await expect(context.detail.value).toBe("C");
    },
}