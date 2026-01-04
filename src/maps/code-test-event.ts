export const CodeTestEvent =
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeTest: 'beforetest',
    AfterTest: 'aftertest',
    BeforeHook: 'beforehook',
    AfterHook: 'afterhook',
    Cancel: 'cancel',
    Reset: 'reset',
}
export type CodeTestEventType = typeof CodeTestEvent[keyof typeof CodeTestEvent];