export default {
    'should handle long results': async () =>
    {
        return { 
            success: true,
            expected: ["lorem", "ipsum", "dolor", "sit", "amet", "adipiscing", "some", "other", "words", "that", "make", "a", "long", "response"],
            value: ["lorem", "ipsum", "dolor", "sit", "amet", "adipiscing", "some", "other", "words", "that", "make", "a", "long", "response"]
        };
    },
    'should handle html results': async () =>
    {
        const target = document.createElement('div');
        target.classList.add('test');
        target.textContent = 'Test Div';
        return { 
            success: true,
            value: target
        };
    },
    'should handle error html results': async () =>
    {
        const target = document.createElement('div');
        target.classList.add('test');
        target.textContent = 'Test Div';
        return { 
            success: false,
            value: target
        };
    },
}