import { expect, prompt } from '../libs/test-runner.min.js';

export default {
    'should have access to the console api': async (context) =>
    {
        const result = await prompt(context, 'New Wave? Next Wave? Dream Wave? OR Cyberpunk?');
        console.log("New Wave? Next Wave? Dream Wave? OR Cyberpunk?");
    },
    'should have access to the DOM': async () =>
    {
        await expect(document.body).toBeDefined();
    },
    'should have access to canvas api': async () =>
    {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        await expect(context).toBeDefined();
    },
}