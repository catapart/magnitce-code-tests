import { expect } from '../../vanilla/code-tests.js';

export default {
    'should have access to the console api': async () =>
    {
        console.log("New Wave? Next Wave? Dream Wave? OR Cyberpunk?");
    },
    'should have access to the DOM': async () =>
    {
        const div = document.querySelector('div');
        await expect(div).toBeDefined();
    },
    'should have access to canvas api': async () =>
    {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        await expect(context).toBeDefined();
    },
}