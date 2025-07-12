import { expect } from '../../dist/code-tests.js';

export default {
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