class Heap
{
    /**
     * Constructor
     * @param {String} type string with value 'max' or 'min' to define type of heap to create
     */
    constructor (type)
    {
        this.elements = [null]
        this.size = 0
        this.setType (type)
        this.idCounter = 0

        this.getTopListeners = []
        this.swapListeners = []
        this.insertListeners = []
        this.changeListeners = []
    }

    registerGetTopListener (l)
    {
        this.getTopListeners.push (l)
    }
    registerSwapListener (l)
    {
        this.swapListeners.push (l)
    }
    registerInsertListener (l)
    {
        this.insertListeners.push (l)
    }
    registerChangeListener (l)
    {
        this.changeListeners.push (l)
    }
    /**
     * Sets the type of the heap. Only two values possible: 'max' or 'min'
     * @param {String} type string with value 'max' or 'min' 
     * @throws {Error} if type has not expected value
     */
    setType (type)
    {
        switch (type) {
            case 'max':
                this.correctParrentChildRelation = function (v1,v2) {return v1>v2}
                break
            case 'min':
                this.correctParrentChildRelation = function (v1,v2) {return v1<v2}
                break
            default :
                throw Error ("Can't create a Heap of type " + type + ". Acceptable types: 'min' or 'max'")
        }
        this.type = type
    }
    /**
     * Inserts new value in the heap
     * @param {Number} value value to insert in the heap
     */
    insert (value)
    {
        let new_node = new Node (++this.idCounter,value)
        this.elements.push (new_node)
        this.size++
        this.insertListeners.forEach (l => l (new_node))
        this.float (this.size)
        return new_node
    }

    /**
     * @return first element of the heap without removing it
     */
    first ()
    {
        return this.size > 0 ? this.elements [1].value : null
    }

    /**
     * @return first element of the heap deleting it
     */
    getTop ()
    {
        
        if (this.size > 0) {
            let top = this.elements [1]
            let last = this.elements [this.size]
            this.getTopListeners.forEach (l => l (top,last))
            this.elements.pop ()
            this.elements [1] = last
            if (this.size > 1) {
                this.sink (1)
            } 
            this.size--
            return top
        }
        return null
        
    }

    /**
     * Function that puts the node in the right position in the this.elements array
     * by consecutivly swapping it with it's parent node
     * @param {int} node_idx index of the element to float
     */
    float (node_idx)
    {
        let parent_idx = Math.floor (node_idx/2)
        while (node_idx > 1 && !this.correctParrentChildRelation (this.elements [parent_idx].value,this.elements [node_idx].value)) {
            this.swap (node_idx,parent_idx)
            node_idx = parent_idx
            parent_idx = Math.floor (node_idx/2)
        }
    }

    /**
     * Function that puts the node in the right position in the this.elements array
     * by consecutivly swapping it with it's child node (the one that has bigger value)
     * @param {int} node_idx index of the element to sink
     */
    sink (node_idx)
    {
        let parent_idx = node_idx
        do {
            let left_child_idx = 2 * node_idx
            let right_child_idx = 2 * node_idx + 1
            parent_idx = node_idx
            if (right_child_idx < this.size && !this.correctParrentChildRelation (this.elements [node_idx].value,this.elements [right_child_idx].value))
                node_idx = right_child_idx
            if (left_child_idx < this.size && !this.correctParrentChildRelation (this.elements [node_idx].value,this.elements [left_child_idx].value))
                node_idx = left_child_idx
            this.swap (parent_idx,node_idx)
        } while (parent_idx != node_idx)

    }

    /**
     * Helper function for swapping two elements
     * @param {int} node_idx1 index of the first element to swap
     * @param {int} node_idx2 index of the second element to swap
     */
    swap (node_idx1,node_idx2)
    {
        console.log ('swapping')
        let temp = this.elements [node_idx1]
        this.elements [node_idx1] = this.elements [node_idx2]
        this.elements [node_idx2] = temp
        this.swapListeners.forEach (l => l (this.elements [node_idx2],this.elements [node_idx1]))
    }
}

class Node {
    constructor (id,value) 
    {
        this.value = value
        this.id = id 
    }
}

export {Heap,Node}