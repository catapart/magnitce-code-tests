// add any setup code here;
// initialize frameworks, register custom elements, anything you may need to do before running tests

import '../code-tests';

if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', init);
}
else
{
    init();
}

async function init()
{
    console.log('hello world');

    // const target = document.querySelector('#target');
    // target?.addEventListener('enabled', (event: Event) =>
    // {
    //     const customEvent = event as CustomEvent;
    //     const element = customEvent.detail.target;
    //     // event.preventDefault();
    // });
}