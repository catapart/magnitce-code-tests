export class Library
{
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) { return a / b; }

    async accessDelayedTarget(timeout = 1000)
    {
        await new Promise((resolve) => setTimeout(resolve, timeout));
        return "Delayed";
    }

    accessDOM(selector) { return document.querySelector(selector); }
    accessStorage(type = 'local')
    {
        if(type == 'local')
        {
            this.addAndRemoveFromLocalStorage();
        }
        else if(type == 'session')
        {
            this.addAndRemoveFromSessionStorage();
        }
        else if(type == 'indexedDB')
        {
            this.addAndRemoveFromIndexedDB();
        }
        
        return 
    }

    addAndRemoveFromLocalStorage()
    {
        console.log('local')
    }

    addAndRemoveFromSessionStorage()
    {
        console.log('session')
    }

    addAndRemoveFromIndexedDB()
    {
        console.log('indexedDB')
    }
}