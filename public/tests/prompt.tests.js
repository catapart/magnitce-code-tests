import { expect, Hook, prompt } from "../libs/test-runner.min.js";

export const tests = {
    'should allow prompting in plain test': async (context) =>
    {
        context.testElement.toggleAttribute('open', true);
        const result = await prompt(context.codeTestsElement, context.testElement.getMessageElement(), 'New Wave? Next Wave? Dream Wave? OR Cyberpunk?');
        return result;
    },
    [Hook.BeforeEach]: () =>
    {

    },
    'should allow prompting in multi-stage tests': async () =>
    {
        
    },
    "should await loading prompts": async () =>
    {
        
    },
    "should be able to cancel a tset, while awaiting a prompt": async () =>
    {
        
    }
}