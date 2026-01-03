export const CodeTestEvent =
{
    BeforeAll: 'beforeall',
    AfterAll: 'afterall',
    BeforeTest: 'beforetest',
    AfterTest: 'aftertest',
    Cancel: 'cancel',
}
export type CodeTestEventType = typeof CodeTestEvent[keyof typeof CodeTestEvent];