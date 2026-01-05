import { Hook } from '../libs/code-tests.js';
import { expect } from '../libs/code-tests.js';

export default {
    [Hook.Context]: async (a, b, context) =>
    {
        context.detail.value = 'Init';
        console.log(context.detail.value);
    },
    [Hook.RequiredBeforeAny]: async () =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('this should run once before any other test is run');
    },
    [Hook.BeforeAll]: async () =>
    {
        console.log('this should run once before all tests');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await expect(true).toBe(true);
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
        throw new Error('error');
        console.log('this should run once after any other test has been run');
    },
    'should be useful for before-after test': async (a, b, context) =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "A";
        console.log(context.detail.value);
        await expect(true).toBe(true);
    },
    'should also be useful for before-after test': async (a, b, context) =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "B";
        console.log(context.detail.value);
        await expect(true).toBe(true);
    },
    'should be a third useful test for before-after test': async (a, b, context) =>
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        context.detail.value = "C";
        console.log(context.detail.value);
        await expect(true).toBe(true);
    },
}