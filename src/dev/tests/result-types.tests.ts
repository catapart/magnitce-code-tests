export default {
    'should handle long results': async () =>
    {
        return { 
            success: true,
            expected: ["lorem", "ipsum", "dolor", "sit", "amet", "adipiscing", "some", "other", "words", "that", "make", "a", "long", "response"],
            value: ["lorem", "ipsum", "dolor", "sit", "amet", "adipiscing", "some", "other", "words", "that", "make", "a", "long", "response"]
        };
    },
}