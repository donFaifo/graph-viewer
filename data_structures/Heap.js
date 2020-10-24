class Heap
{
    constructor ()
    {
        this.elements = [null]
        this.size = 0
    }

    insert (value) 
    {
        let new_node = new Node (value,'E' + ++this.size)
    }
}

class Node {
    constructor (value,id) 
    {
        this.value = value
        this.id = id 
    }
}