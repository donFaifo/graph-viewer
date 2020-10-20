import {Algorithm} from './Algorithm.js'
import {DFSr} from './DFSr.js'
import {Stack} from '../data_structures/Stack.js'

class BreakException extends Error{}

class DFScycles extends Algorithm
{
    constructor (name)
    {
        super (name)
        this.output.has_cycles = false
    }

    run (graph)
    {
        this.graph = graph
        this.output.has_cycles = false

        if (this.graph.nodes.length == 0) {
            return 
        }
            
        this.graph.nodes.forEach (n => n.visited = null)

        let counter = 0
        try {
            if (this.graph.directed == true) {
                this.graph.nodes.forEach ( m => {
                    if (!m.visited) {
                        let recStack = new Stack ()
                        this.cycleFinderDirectedGraph (m,recStack)
                    }  
                })
            }
            else {
                this.graph.nodes.forEach ( m => {
                    if (!m.visited) {
                        var dfs = new DFSr ('DFSr')
                        dfs.run (this.graph,m)
                        this.graph.nodes.forEach (n => n.visited = null)
                        this.cycleFinderUndirectedGraph (dfs.output.visited_nodes)
                    }  
                })
            }
        } catch (e) {
            if (e == BreakException) {
                this.output.has_cycles = true
                return
            }
                
            else
                throw e
        }
    }

    cycleFinderDirectedGraph (node,stack)
    {
        stack.push (node)
        node.visited = true
        let adjacent = this.graph.getAdjacentTo (node).forEach (n => 
            {
                if (stack.contains (n)) {
                    throw BreakException
                }
                this.cycleFinderDirectedGraph(n,stack) 
            }
        )

        stack.pop ()
    }

    cycleFinderUndirectedGraph (spanningTree)
    {
        spanningTree.forEach (n => {
            n.visited = true
            this.graph.getAdjacentTo (n).forEach (adj => {
                if (adj.visited && n.originNode && adj != n.originNode) {
                    console.log (n.id + '-' + adj.id + ' origin: ' + n.originNode.id)
                    throw BreakException
                }
            })
        })
    }

    

    showSource ()
    {
        return this.run.toString ()
    }

}


export {DFScycles}