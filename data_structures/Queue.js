class Queue
{
    constructor () 
    { 
        this.items = [] 
    }

    enqueue (element) 
    {     
        this.items.push(element); 
    } 

    dequeue () 
    { 
        return this.items.shift ()
    } 

    front () 
    { 
        return this.isEmpty () ? null : this.items [0]
    }

    isEmpty () 
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
}

export {Queue}