export const CodeTestEvent =
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeTest: 'beforetest',
    AfterTest: 'aftertest',
    BeforeHook: 'beforehook',
    AfterHook: 'afterhook',
    Cancel: 'cancel',
    Context: 'context',
    Reset: 'reset',
    TestEnd: 'testend',
    Init: 'init',
    Enabled: 'enabled',
    PromptResult: 'promptresult',
}
export type CodeTestEventType = typeof CodeTestEvent[keyof typeof CodeTestEvent];