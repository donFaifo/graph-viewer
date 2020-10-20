import {Algorithm} from './Algorithm.js'
import {Stack} from '../data_structures/Stack.js'

class DFSi extends Algorithm
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
            this.DFSiterativo (starting_node)
        
            if (include_not_connected) {
                this.graph.nodes.forEach (n => {
                    if (!n.visited) {
                        this.DFSiterativo (n)
                    }
                })
            }
        }
    }

    DFSiterativo (node)
    {
        var s = new Stack ()
        s.push (node) 
        while (s.size () != 0) {
            let u = s.pop ()
            if (!u.visited)
                this.output.visited_nodes.push (u)
            u.visited = true
            
            this.graph.getAdjacentTo (u).forEach (n => {
                if (!n.visited) {
                    n.originNode = u
                    s.push (n)
                }
            })
        }
    }

    showSource ()
    {
        return "//this function is called for each not conex component of the graph" + this.DFSiterativo.toString ()
    }

}


export {DFSi}