
import {MatrixSquare} from './MatrixSquare.js'
import {LinkedList} from './LinkedList.js'

class Graph {

    constructor (name) 
    {
        this.name = name
        this.nodes     = []
        this.insMatrix = new MatrixSquare ()
        this.adjList   = []
        this.directed = false
        this.size = 0
        this.listeners = []
    }

    edgeIdCounter = 0

    addListener (listener)
    {
        this.listeners.push (listener)
    }

    notifyListeners ()
    {
        this.listeners.forEach (l => l (this))
    }

    clear ()
    {
        this.nodes.length = 0
        this.insMatrix.clear ()
        this.adjList.length = 0
        this.size = 0
        this.edgeIdCounter = 0
        this.notifyListeners ()
    }

    getNumEdgesL ()
    {
        var counter = 0
        for (var i = 0;i<this.adjList.length;i++) {
            counter += this.adjList [i].size
        }
        return this.directed ? counter : counter/2
    }
    getNumEdgesM ()
    {
        var counter = 0
        for (var i = 0;i<this.insMatrix.size;i++) {
            for (var j = 0;j<this.insMatrix.size;j++) {
                if (this.insMatrix.get (i,j) >= 1)
                    counter++
            }
        }

        return this.directed ? counter : counter/2
    }

    addVertex ()
    {
        
        let newNode = new Node ('N' + ++this.edgeIdCounter)
        this.nodes.push (newNode)

        //increase insMatrix
        this.insMatrix.expand ()

        //increase adjList
        //this.adjList.push (new Set ())
        this.adjList.push (new LinkedList ())

        this.size++
        this.notifyListeners ()
        return newNode
    }

    removeVertex (v)
    {
        const index = this.nodes.indexOf(v);
        if (index > -1) {
            this.nodes.splice(index, 1);

            this.insMatrix.shrink (index);

            this.adjList.splice (index, 1);
            for (var i = 0;i < this.adjList.length;i++) {
                this.adjList[i].delete (v)
            }

            this.size--
            this.notifyListeners ()
        }
    }

    addEdge (n1,n2,weight)
    {
        var n1_index = this.nodes.indexOf (n1)
        var n2_index = this.nodes.indexOf (n2)

        this.insMatrix.set (n1_index,n2_index, weight || 1)
        this.adjList [n1_index].add (n2)
        if (!this.directed) {
            this.insMatrix.set (n2_index,n1_index, weight || 1)
            this.adjList [n2_index].add (n1)
        }
        this.notifyListeners ()
    }

    removeEdge (n1,n2)
    {
        var n1_index = this.nodes.indexOf (n1)
        var n2_index = this.nodes.indexOf (n2)
        this.insMatrix.set (n1_index,n2_index,0)
        this.adjList [n1_index].delete (n2)
        if (!this.directed) {
            this.insMatrix.set (n2_index,n1_index,0)
            this.adjList [n2_index].delete (n1)
        }
        this.notifyListeners ()
    }

    areAdjacent (n1,n2)
    {      
        //return this.adjList [this.nodes.indexOf (n1)].has(n2) || !this.directed && this.adjList [this.nodes.indexOf (n2)].has(n1)  
        let index1 = this.nodes.indexOf (n1) 
        let index2 = this.nodes.indexOf (n2) 
        return this.directed ? this.insMatrix.get (index1,index2) >= 1 : this.insMatrix.get (index1,index2) >= 1 || this.insMatrix.get (index2,index1) >= 1
    }

    getAdjacentTo (node)
    {
        var res = []
        this.nodes.forEach (n => {
            if (this.areAdjacent (node,n))
                res.push (n)
        })
        return res
    }

    getPrintableInsMatrix ()
    {
        var t = document.createElement ("table");
        t.style.fontSize = '8pt'
        for (var i = 0;i<this.size + 1;i++)
        {
            let r = t.insertRow (0)
            for (var j = 0;j < this.size + 1;j++) {
                let c = r.insertCell (0)
                console.log (i,j)
                if (i == this.size) {
                    if (j <= this.size -1)
                        c.innerHTML = this.nodes[this.size - j - 1].id
                }
                else if (j == this.size) {
                    c.innerHTML = this.nodes [this.size - i - 1].id
                }
                else {
                    c.innerHTML = this.insMatrix.get (this.size - i - 1,this.size - j - 1)
                }
            }
        }

        return t
    }

}

class Node {
    constructor (id) 
    {
        this.data = undefined
        this.id = id 
    }
}
export {Graph}