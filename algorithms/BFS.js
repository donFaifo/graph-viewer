import {Algorithm} from './Algorithm.js'
import {Queue} from '../data_structures/Queue.js'

class BFS extends Algorithm
{
    constructor (name)
    {
        super (name)
        this.output.visited_nodes = []
    }

    run (graph,starting_node,include_not_connected)
    {
        this.graph = graph
        this.graph.nodes.forEach (n => n.visited = null)
        this.output.visited_nodes.length = 0
        if (starting_node) {
            this.BFS (starting_node)

            if (include_not_connected) {
                this.graph.nodes.forEach (n => {
                    if (!n.visited) {
                        this.BFS (n)
                    }
                })
            }
        }

        
    }

    BFS (node)
    {
        var q = new Queue ()
        node.visited = true
        this.output.visited_nodes.push (node)
        q.enqueue (node) 

        while (!q.isEmpty ()) {
            let u = q.dequeue ()         
            this.graph.getAdjacentTo (u).forEach (n => {
                if (!n.visited) {
                    n.visited = true
                    n.originNode = u
                    this.output.visited_nodes.push (n)
                    q.enqueue (n) 
                }
            })
        }
    }

    showSource ()
    {
        return "//this function is called for each not conex component of the graph" + this.BFS.toString ()
    }

}


export {BFS}