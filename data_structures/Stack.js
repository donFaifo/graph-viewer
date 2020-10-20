class Stack
{
    constructor() 
    { 
        this.items = []
    } 

    push(element) 
    { 
        this.items.push(element) 
    } 

    pop() 
    { 
        return this.items.pop(); 
    }

    peek() 
    { 
        return this.items.length > 0 ? this.items[this.items.length - 1] : null 
    }

    isEmpty() 
    { 
        return this.items.length == 0; 
    }

    clear ()
    {
        this.items.length = 0
    }

    size ()
    {
        return this.items.length
    }

    contains (i)
    {
        return this.items.indexOf (i) >= 0
    }
}

export {Stack}