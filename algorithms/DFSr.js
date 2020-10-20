import {Algorithm} from './Algorithm.js'

class DFSr extends Algorithm
{
    constructor (name)
    {
        super (name)
        this.output.visited_nodes = []
    }

    run (graph,starting_node,include_not_connected)
    {
        graph.nodes.forEach (n => n.visited = null)
        this.output.visited_nodes.length = 0
        if (starting_node) {
            this.recursiveDFS (graph,starting_node,this.output.visited_nodes)
        
            if (include_not_connected) {
                graph.nodes.forEach (node => {
                    if (!node.visited) {
                        this.recursiveDFS (graph,node,this.output.visited_nodes)
                    }
                })
            }
        }

    }

    recursiveDFS (graph,node,visited_nodes)
    {
        node.visited = true
        visited_nodes.push (node)
        graph.getAdjacentTo (node).forEach (n => {
            if (!n.visited) {
                n.originNode = node
                this.recursiveDFS(graph,n,visited_nodes)
            }
                
        })
    }

    showSource ()
    {
        return "//this function is called for each not conex component of the graph" + this.recursiveDFS.toString ()
    }
}


export {DFSr}