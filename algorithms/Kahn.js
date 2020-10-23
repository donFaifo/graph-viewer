import {Algorithm} from "./Algorithm.js";
import {Queue} from "../data_structures/Queue.js";

class Kahn extends Algorithm {
    constructor(name) {
        super(name)
        this.output.visited_nodes = []
        this.removedEdges = []
    }

    run(graph) {
        this.graph = graph
        this.kahnAlgorithm(graph)
        this.removedEdges.forEach(edge => {
            graph.addEdge(edge.u, edge.v, 1)
        })
    }

    kahnAlgorithm(graph) {
        let queue = new Queue()

        graph.nodes.forEach(node => {
            if (this.hasNoPredecesor(node, graph)) {
                queue.enqueue(node)
            }
        })

        while (!queue.isEmpty()) {
            let u = queue.dequeue()
            this.output.visited_nodes.push(u)
            graph.getAdjacentTo(u).forEach(v => {
                graph.removeEdge(u, v)
                this.removedEdges.push({u, v})
                if (this.hasNoPredecesor(v, graph)) queue.enqueue(v)
            })
        }
    }

    hasNoPredecesor(node, graph) {
        let nodeIndex = graph.nodes.indexOf(node)
        let matrix = graph.insMatrix
        for (let i=0; i<matrix.size; i++) {
            if (matrix.rows[i][nodeIndex] !== 0) return false
        }
        return true
    }

    showSource() {
        return "//this function is called for each not conex component of the graph" + this.kahnAlgorithm.toString()
    }
}

export {Kahn}
