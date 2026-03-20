export class TestResult
{
    success: boolean;
    expected?: any;
    value: string|HTMLElement;
    data?: any;

    constructor(success: boolean, value: string|HTMLElement, expected?: any, data?: any)
    {
        this.success = success;
        this.value = value;
        this.expected = expected;
        this.data = data;
    }
}