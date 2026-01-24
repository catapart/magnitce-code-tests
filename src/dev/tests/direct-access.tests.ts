import { expect } from '../../code-tests'

export default {
    'should have access to the console api': async () =>
    {
        console.log("New Wave? Next Wave? Dream Wave? OR Cyberpunk?");
    },
    'should have access to the DOM': async () =>
    {
        const testRunner = document.querySelector('test-runner');
        await expect(testRunner).toBeDefined();
    },
    'should have access to canvas api': async () =>
    {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        await expect(context).toBeDefined();
    },
}