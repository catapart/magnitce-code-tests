import { expect, prompt } from '../libs/test-runner.min.js';

export default {
    'should await prompt response': async (host, parent) =>
    {
        const testResult = await prompt(host, parent, "Is the test awaiting the user's interaction?");

        const duplicateResult = await prompt(host, parent, "Does a second prompt await the user's interaction?", 
        {
            acceptLabel: "Yes",
            rejectLabel: "No",
            onAccept: () =>
            {
                return true;
            }, 
            onReject: () => { return { success: false, error: "The code tests element was observed to skip waiting for the user's interaction." }; }
        });

        await expect(testResult).toBe(true);
        await expect(duplicateResult).toBe(true);
    },
    'should allow undefined results': async () =>
    {
        console.log("Passed!");
    },
    'should allow string results': async () =>
    {
        return "Custom string pass"
    },
    'should allow TestResult results': async () =>
    {
        return { success: true, expected: "TestResult", value: 'A different TestResult' };
    },
    'should allow HTMLElement results': async () =>
    {
        const resultElement = document.createElement('input');
        resultElement.value = "This is a result";
        resultElement.toggleAttribute('readonly', true);

        return resultElement;
    },
    'should allow custom results from before tests': async () =>
    {
        const resultElement = document.createElement('input');
        resultElement.value = "Before test, custom result";
        resultElement.toggleAttribute('readonly', true);

        return resultElement;
    },
    'should allow custom results from after tests': async () =>
    {
        const resultElement = document.createElement('input');
        resultElement.value = "After test, custom result";
        resultElement.toggleAttribute('readonly', true);

        return resultElement;
    },
    'should allow custom errors': async () =>
    {
        const resultElement = document.createElement('input');
        resultElement.value = "Throwing an element provides the element to the error";
        resultElement.toggleAttribute('readonly', true);

        return { success: false, resultElement } ;
    },
}